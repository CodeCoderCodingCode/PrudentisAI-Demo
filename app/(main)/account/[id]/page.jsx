import React, { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
import { notFound } from "next/navigation";
import TransactionTable from "@/app/(main)/account/_components/transaction-table";
import { BarLoader } from "react-spinners";
import AccountChart from "@/app/(main)/account/_components/account-chart";
import {EditableAccountHeaderL, EditableAccountHeaderR} from "@/app/(main)/account/_components/editable-headers";



const AccountsPage = async ({ params }) => {
    const accountData = await getAccountWithTransactions(params.id);
    if (!accountData) {
        notFound();
    }

    const { transactions, ...account } = accountData;

    return (
        <div className="space-y-8 px-5">
            <div className="flex items-end justify-between">
                    {/* interaktive Client-Komponente */}
                <EditableAccountHeaderL account={account} />
                <EditableAccountHeaderR account={account} />
            </div>
            {/* Chart Section */}
            <Suspense
                fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
            >
                <AccountChart transactions={transactions} />
            </Suspense>
            {/* Transaction Section */}
            <Suspense
                fallback={<BarLoader className="mt-4" width={"100%"} color="#93bbff" />}
            >
                <TransactionTable transactions={transactions} />
            </Suspense>
        </div>
    );
};

export default AccountsPage;
