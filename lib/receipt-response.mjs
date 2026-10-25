const categories = new Set(["housing", "transportation", "groceries", "utilities", "entertainment", "food", "shopping", "healthcare", "education", "personal", "travel", "insurance", "gifts", "bills", "other-expense"]);

export function parseReceiptResponse(data) {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new Error("No readable receipt was found in this image.");
  }
  const date = typeof data.date === "string" ? new Date(data.date) : new Date(NaN);
  if (typeof data.amount !== "number" || !Number.isFinite(data.amount) || data.amount <= 0 ||
      !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(data.date || "") || Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== data.date.slice(0, 10) ||
      !categories.has(data.category) || typeof data.description !== "string" ||
      !data.description.trim() || typeof data.merchantName !== "string") {
    throw new Error("The receipt response contains invalid fields. Check the image or enter the transaction manually.");
  }
  return {amount: data.amount, date, description: data.description.trim(), category: data.category, merchantName: data.merchantName.trim()};
}
