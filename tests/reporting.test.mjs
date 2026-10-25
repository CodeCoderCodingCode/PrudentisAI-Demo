import test from "node:test";
import assert from "node:assert/strict";
import {monthWindow, summarizeTransactions} from "../lib/reporting.mjs";

test("previous-month reports handle the 31st and a year boundary", () => {
  const {start, end} = monthWindow(new Date("2026-01-31T23:00:00Z"), -1);
  assert.equal(start.toISOString(), "2025-12-01T00:00:00.000Z");
  assert.equal(end.toISOString(), "2026-01-01T00:00:00.000Z");
});
test("month windows include the entire last day, including leap day", () => {
  const {start, end} = monthWindow(new Date("2028-02-15T12:00:00Z"));
  assert.equal(start.toISOString(), "2028-02-01T00:00:00.000Z");
  assert.ok(new Date("2028-02-29T23:59:59.999Z") < end);
  assert.equal(end.toISOString(), "2028-03-01T00:00:00.000Z");
});
test("monthly summaries preserve cents and count categories and transactions", () => {
  assert.deepEqual(summarizeTransactions([
    {type: "INCOME", amount: "3400.00", category: "salary"},
    {type: "EXPENSE", amount: "9.50", category: "food"},
    {type: "EXPENSE", amount: "6.25", category: "food"},
  ]), {totalIncome: 3400, totalExpenses: 15.75, byCategory: {food: 15.75}, transactionsCount: 3});
});
