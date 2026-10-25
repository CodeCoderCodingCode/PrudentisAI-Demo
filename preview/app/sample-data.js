export const accounts = [
  { id: "demo-current", name: "Everyday account", isDefault: true },
  { id: "demo-savings", name: "Savings account", isDefault: false },
];

// Relative dates keep the real components' current-month filters useful.
export function getSampleTransactions() {
  const now = new Date();
  const entries = [
    [0, "EXPENSE", 84.5, "groceries", "Weekly groceries"],
    [1, "INCOME", 850, "freelance", "Design project"],
    [2, "EXPENSE", 42, "transportation", "Train pass"],
    [3, "EXPENSE", 29.9, "entertainment", "Cinema evening"],
    [4, "EXPENSE", 65, "food", "Dinner with friends"],
    [6, "EXPENSE", 110, "shopping", "Home essentials"],
    [8, "EXPENSE", 1250, "housing", "Monthly rent"],
    [10, "EXPENSE", 96.4, "utilities", "Electricity"],
    [12, "EXPENSE", 73.8, "groceries", "Fresh produce"],
    [14, "INCOME", 3200, "salary", "Monthly salary"],
  ];

  return accounts.flatMap((account, accountIndex) =>
    entries.map(([daysAgo, type, amount, category, description], index) => ({
      id: `${account.id}-${index}`,
      accountId: account.id,
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, 12).toISOString(),
      type,
      amount: accountIndex === 0 ? amount : Number((amount * 0.2).toFixed(2)),
      category,
      description: accountIndex === 0 ? description : `Savings · ${description}`,
    }))
  );
}

export const reportProps = {
  userName: "Alex (Demo)",
  type: "Monthly-Report",
  data: {
    month: "September — sample report",
    stats: {
      totalIncome: 4050,
      totalExpenses: 1751.6,
      byCategory: { housing: 1250, groceries: 158.3, shopping: 110, utilities: 96.4, food: 65, transportation: 42, entertainment: 29.9 },
    },
    // Handwritten examples; the preview never calls Gemini or sends email.
    insights: [
      "Housing accounts for the largest share of this sample month's spending.",
      "Income exceeded expenses by $2,298.40 in this example.",
      "Compare recurring costs each month to spot changes in your budget.",
    ],
  },
};
