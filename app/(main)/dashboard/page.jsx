import React, { Suspense } from "react";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "@/app/(main)/dashboard/_components/budget-progress";
import { BarLoader } from "react-spinners";
import DashboardOverview from "@/app/(main)/dashboard/_components/transaction-overview";
import BulkAccountActions from "@/app/(main)/dashboard/_components/account-table";

async function DashboardPage() {
    const accounts = await getUserAccounts();
    const defaultAccount = accounts.find((account) => account.isDefault);

    let budgetData = null;
    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id);
    }

    const transactions = await getDashboardData();

    return (
        <div className="px-5">
            {/* Budget Progress */}
            {defaultAccount && (
                <BudgetProgress
                    initialBudget={budgetData?.budget}
                    currentExpenses={budgetData?.currentExpenses || 0}
                />
            )}

            {/* Overview */}
            <Suspense
                fallback={
                    <div className="mt-4 flex flex-col items-center">
                        <BarLoader width={"100%"} color="#9333ea" />
                        <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                }
            >
                <DashboardOverview accounts={accounts} transactions={transactions || []} />
            </Suspense>

            {/* Bulk Accounts mit Search/Filter und Bulk Actions (inkl. "Add New Account"-Karte) */}
            <BulkAccountActions accounts={accounts} />
        </div>
    );
}
export default DashboardPage;
