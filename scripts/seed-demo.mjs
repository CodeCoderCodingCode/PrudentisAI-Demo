import {createHash} from "node:crypto";
import {PrismaClient, Prisma} from "@prisma/client";

const accountId = process.argv[process.argv.indexOf("--account-id") + 1];
if (!process.argv.includes("--account-id") || !accountId || accountId.startsWith("--")) {
  throw new Error("Usage: node --env-file=.env scripts/seed-demo.mjs --account-id <account-id> [--apply]");
}
const apply = process.argv.includes("--apply");
const db = new PrismaClient();
const stableId = (value) => {
  const hex = createHash("sha256").update(value).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

try {
  const account = await db.account.findUnique({where: {id: accountId}});
  if (!account) throw new Error("The selected account does not exist.");
  const transactions = [];
  const today = new Date();
  today.setUTCHours(12, 0, 0, 0);
  for (let daysAgo = 89; daysAgo >= 0; daysAgo--) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - daysAgo);
    const day = date.getUTCDate();
    const weekday = date.getUTCDay();
    const add = (type, category, amount, description) => {
      transactions.push({
        id: stableId(`prudentis-demo-v1:${account.id}:${date.toISOString().slice(0, 10)}:${category}`),
        type, category, amount, description: `DEMO · ${description}`,
        date, status: "COMPLETED", userId: account.userId, accountId: account.id,
        createdAt: date, updatedAt: date,
      });
    };
    if (day === 1) add("INCOME", "salary", 3400, "Monthly salary (fictional)");
    if (day === 15) add("INCOME", "freelance", 480, "Design project (fictional)");
    if (day === 3) add("EXPENSE", "housing", 1150, "Monthly rent (fictional)");
    if (day === 5) add("EXPENSE", "utilities", 135.5, "Electricity and internet (fictional)");
    if (day === 10) add("EXPENSE", "transportation", 59, "Transit pass (fictional)");
    if (day === 18) add("EXPENSE", "healthcare", 29.9, "Pharmacy (fictional)");
    if (day === 22) add("EXPENSE", "shopping", 84.95, "Home supplies (fictional)");
    if (weekday === 6) add("EXPENSE", "groceries", 52.4 + day % 17, "Weekly groceries (fictional)");
    if (weekday === 5) add("EXPENSE", "entertainment", 18 + day % 12, "Cinema and leisure (fictional)");
    if ([1, 3, 5].includes(weekday)) add("EXPENSE", "food", 8.5 + day % 7, "Lunch and coffee (fictional)");
  }
  const result = await db.$transaction(async (tx) => {
    const existing = await tx.transaction.findMany({where: {id: {in: transactions.map(t => t.id)}}, select: {id: true}});
    const known = new Set(existing.map(t => t.id));
    const pending = transactions.filter(t => !known.has(t.id));
    const balanceChange = pending.reduce((sum, t) => sum.add(t.type === "INCOME" ? t.amount : -t.amount), new Prisma.Decimal(0));
    if (apply && pending.length) {
      await tx.transaction.createMany({data: pending});
      await tx.account.update({where: {id: account.id}, data: {balance: {increment: balanceChange}}});
      // Only supply an example budget when the user has not configured one.
      await tx.budget.upsert({where: {userId: account.userId}, update: {}, create: {userId: account.userId, amount: 2400}});
    }
    return {mode: apply ? "applied" : "dry-run", account: account.name, generated: transactions.length, inserted: apply ? pending.length : 0, pending: pending.length, alreadyPresent: existing.length, balanceChange: balanceChange.toFixed(2)};
  }, {isolationLevel: "Serializable", timeout: 20000});
  console.log(JSON.stringify(result));
} catch (error) {
  // Do not print connection strings or provider credentials on failure.
  console.error(JSON.stringify({error: error.code || "Demo seeding failed; check the account ID and database connection."}));
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
