// Match the UTC scheduling used by the background jobs; end is exclusive.
export function monthWindow(date = new Date(), offset = 0) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
  return {start, end};
}

export function summarizeTransactions(transactions) {
  return transactions.reduce((stats, transaction) => {
    const amount = Number(transaction.amount);
    if (transaction.type === "EXPENSE") {
      stats.totalExpenses += amount;
      stats.byCategory[transaction.category] = (stats.byCategory[transaction.category] || 0) + amount;
    } else {
      stats.totalIncome += amount;
    }
    return stats;
  }, {totalExpenses: 0, totalIncome: 0, byCategory: {}, transactionsCount: transactions.length});
}
