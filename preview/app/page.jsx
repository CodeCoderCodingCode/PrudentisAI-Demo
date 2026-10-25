import DashboardOverview from "@/app/(main)/dashboard/_components/transaction-overview";
import AccountChart from "@/app/(main)/account/_components/account-chart";
import { accounts, getSampleTransactions } from "./sample-data";

export const dynamic = "force-dynamic";

export default function AnalyticsPreview() {
  const transactions = getSampleTransactions();

  return (
    <>
      <p className="preview-eyebrow">YOUR FINANCES, AT A GLANCE</p>
      <h1 className="preview-title">From transactions to perspective.</h1>
      <p className="preview-description">
        Explore the real dashboard and account-chart components with fictional transactions.
        Switch accounts, inspect spending categories or change the chart&apos;s date range.
      </p>
      <DashboardOverview accounts={accounts} transactions={transactions} />
      <section className="preview-chart" aria-label="Account transaction chart">
        <AccountChart transactions={transactions.filter((transaction) => transaction.accountId === accounts[0].id)} />
      </section>
    </>
  );
}
