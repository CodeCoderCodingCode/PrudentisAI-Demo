import { inngest } from "./client";
import {db} from "@/lib/prisma";
import {sendEmail} from "@/actions/send-email";
import EmailTemplate from "@/emails/template";
import {getGeminiModel} from "@/lib/gemini.mjs";
import {monthWindow, summarizeTransactions} from "@/lib/reporting.mjs";

export const checkBudgetAlert = inngest.createFunction(
    { id: "check-budget-alert", name: "Check Budget Alert" },
    { cron: "0 */6 * * *" },
    async ({ step }) => {
const budgets = await step.run("fetch-budget", async () => {
    return db.budget.findMany({
        include:{
            user:{
                include:{
                    accounts:{
                        where: {
                                isDefault:true,
                            },
                        },
                    },
                },
            },
        });
    });
    for (const budget of budgets) {
        const defaultAccount = budget.user.accounts[0];
            if (!defaultAccount) continue; //Skip if no default account

            await step.run(`check-budget-${budget.id}`, async () => {
                const currentDate = new Date();
                const {start: startOfMonth, end: endOfMonth} = monthWindow(currentDate);

                const expenses = await db.transaction.aggregate({
                    where: {
                        userId: budget.userId,
                        accountId: defaultAccount.id, //Only Consider Default Account
                        type: "EXPENSE",
                        date: {
                            gte: startOfMonth,
                            lt: endOfMonth,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

                const totalExpenses = expenses._sum.amount?.toNumber() || 0;
                const budgetAmount = budget.amount;
                const percentageUsed = (totalExpenses / budgetAmount) * 100;

                if (percentageUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))) {
                    //Send Email
                    const delivery = await sendEmail({
                        to: budget.user.email,
                        subject: `Budget Alert for ${defaultAccount.name}`,
                        idempotencyKey: `budget-${budget.id}-${startOfMonth.toISOString().slice(0, 10)}`,
                        react: EmailTemplate({
                            userName: budget.user.name,
                            type: "Budget-Alert",
                            data: {
                                percentageUsed,
                                budgetAmount: Number(budgetAmount).toFixed(2),
                                totalExpenses: totalExpenses.toFixed(2),
                                accountName: defaultAccount.name,
                            },
                        }),
                    });
                    if (!delivery.success) throw new Error(`Budget email failed: ${delivery.error}`);
                    //Update Last Alert Sent
                    await db.budget.update({
                        where: {
                            id: budget.id,
                        },
                        data: {
                            lastAlertSent: new Date(),
                        },
                    });
                }
            });

    }
},
);


function isNewMonth(lastAlertSent, currentDate) {
    return (
        lastAlertSent.getUTCMonth() !== currentDate.getUTCMonth() ||
        lastAlertSent.getUTCFullYear() !== currentDate.getUTCFullYear()
    )
}

export const triggerRecurringTransactions = inngest.createFunction(
    {
    id: "transaction.recurring.process",
    name: "Trigger Recurring Transactions"
    },
{cron: "0 0 * * *"},
    async ({step}) => {
        //Step 1 Fetch all due recurring transactions
        const recurringTransactions = await step.run(
            "fetch-recurring-transactions",
            async() => {
                return db.transaction.findMany({
                    where: {
                        isReccurring: true,
                        status: "COMPLETED",
                        OR: [
                            { lastProcessed: null}, //Never processed
                            { nextRecurringDate: { lte: new Date() }}, //Due Date has passed
                        ],
                    },
                });
            }
        );
        //Step 2 Create events for each recurring transaction
        if (recurringTransactions.length > 0) {
            const events = recurringTransactions.map((transaction) => ({
                name: "transaction.recurring.process",
                data: {transactionId: transaction.id , userId: transaction.userId},
            }));

            //Step 3 Send events to be processed
            await inngest.send(events);
        }

        return {triggered: recurringTransactions.length};
    }
);

export const processRecurringTransaction = inngest.createFunction({
        id: "process-recurring-transaction",
        throttle: {
            limit: 10,                  //Only process 10 transactions
            period: "1m",               //per minute
            key: "event.data.userId",   //per user
        },
    },
    {event: "transaction.recurring.process"},
    async({event, step}) => {
        //Validate event data
        if(!event.data.transactionId || !event?.data?.userId) {
            return {error: "Invalid event data",event};
        }

        await step.run("process-transaction", async() => {
            const transaction = await db.transaction.findUnique({
                where: {
                    id: event.data.transactionId,
                    userId: event.data.userId,
                },
                include: {
                    account: true,
                },
            });

            if(!transaction || !isTransactionDue(transaction)) return;

            await db.$transaction(async (tx) => {
                //Create new transaction
                await tx.transaction.create({
                    data: {
                        type: transaction.type,
                        amount: transaction.amount,
                        description: `${transaction.description} (Recurring)`,
                        date: new Date(),
                        category: transaction.category,
                        userId: transaction.userId,
                        accountId: transaction.accountId,
                        isReccurring: false,
                    },
                });

                //Update Account Balance
                const balanceChange =
                    transaction.type === "EXPENSE"
                        ? -transaction.amount.toNumber()
                        : transaction.amount.toNumber();

                await tx.account.update({
                    where: {id: transaction.accountId},
                    data: {balance: {increment: balanceChange},},
                    });

                //Update Last Processed Date
                await tx.transaction.update({
                    where: {id: transaction.id},
                    data: {
                        lastProcessed: new Date(),
                        nextRecurringDate: calculateNextRecurringDate(
                            new Date,
                            transaction.reccurringInterval
                        ),
                    },
                });
            });
        });
    }
);

function isTransactionDue(transaction) {
    //if no last Processed date, transaction is due
    if(!transaction.lastProcessed) return true;

    const today = new Date();
    const nextDue = new Date(transaction.nextRecurringDate);

    //compare today with next due date
    return today >= nextDue;
}

// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);
    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            break;
    }
    return date;
}

export const generateMonthlyReports = inngest.createFunction({
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
},
    {cron: "0 0 1 * *"},
    async ({step}) => {
    const users = await step.run("fetch-users", async () => {
        return await db.user.findMany({
                include: {accounts: true},
            });
        });

    for (const user of users) {
        await step.run(`generate-report-${user.id}`, async () => {
            const {start: lastMonth} = monthWindow(new Date(), -1);

            const stats = await getMonthlyStats(user.id, lastMonth);
            const monthName = lastMonth.toLocaleString("en-US", {month: "long", year: "numeric", timeZone: "UTC"});

            const insights = await generateFinanceInsights(stats, monthName);

            //Send Email
            const delivery = await sendEmail({
                to: user.email,
                subject: `Your Monthly Financial Report for - ${monthName}`,
                idempotencyKey: `monthly-${user.id}-${lastMonth.toISOString().slice(0, 7)}`,
                react: EmailTemplate({
                    userName: user.name,
                    type: "Monthly-Report",
                    data: {
                        stats,
                        month: monthName,
                        insights
                    },
                }),
            });
            if (!delivery.success) throw new Error(`Monthly report email failed: ${delivery.error}`);
        });
        }

    return {processed: users.length};
    }
);

async function generateFinanceInsights(stats, month)  {
    const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
        .map(([category, amount]) => `${category}: $${amount}`)
        .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]`;

    try {
        const result = await getGeminiModel().generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        const insights = JSON.parse(cleanedText);
        if (!Array.isArray(insights) || insights.length !== 3 || insights.some(item => typeof item !== "string" || !item.trim())) {
            throw new Error("Invalid finance-insight response.");
        }
        return insights;
    } catch (error) {
        console.error("Error generating insights:", error);
        return [
            "Track your recurring expenses to identify potential savings.",
            "A flexible budget helps you manage your finances and ensures there are no unexpected expenses.",
            "Consider investing your money for future growth instead of spending on non-essential items."
        ];
    }
}

const getMonthlyStats = async (userId, month) => {
    const {start: startDate, end: endDate} = monthWindow(month);

    const transactions = await db.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lt: endDate,
            },
        },
    });

    return summarizeTransactions(transactions);
}
