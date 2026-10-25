import test from "node:test";
import assert from "node:assert/strict";
import {parseReceiptResponse} from "../lib/receipt-response.mjs";
const valid = {amount: 9.5, date: "2026-10-25", description: "Coffee and Sandwich", merchantName: "Demo Cafe", category: "food"};

test("valid receipt fields preserve cents and produce a valid date", () => {
  const result = parseReceiptResponse(valid);
  assert.equal(result.amount, 9.5);
  assert.equal(result.date.toISOString(), "2026-10-25T00:00:00.000Z");
});
test("a non-receipt response cannot populate invalid form values", () => {
  assert.throws(() => parseReceiptResponse({}), /No readable receipt/);
});
test("malformed AI amounts, dates and categories are rejected", () => {
  for (const fields of [{amount: NaN}, {amount: -1}, {amount: "9.50"}, {date: "2026-02-31"}, {date: "invalid"}, {category: "invented"}, {description: ""}]) {
    assert.throws(() => parseReceiptResponse({...valid, ...fields}), /invalid fields/);
  }
});
