import test from "node:test";
import assert from "node:assert/strict";
import { MAX_RECEIPT_BYTES, validateReceiptFile } from "../lib/receipt.mjs";

const file = (size, type = "image/jpeg") => ({ size, type, arrayBuffer() {} });

test("receipt validation accepts supported images up to the documented limit", () => {
  for (const type of ["image/jpeg", "image/png", "image/webp"]) {
    assert.doesNotThrow(() => validateReceiptFile(file(MAX_RECEIPT_BYTES, type)));
  }
});

test("receipt validation rejects oversized, empty, invalid and unsupported inputs", () => {
  assert.throws(() => validateReceiptFile(file(MAX_RECEIPT_BYTES + 1)), /4 MiB/);
  for (const value of [null, {}, file(0), file(-1), file(NaN), file(Infinity)]) {
    assert.throws(() => validateReceiptFile(value), /non-empty/);
  }
  for (const type of ["application/pdf", "image/svg+xml", "image/gif", ""]) {
    assert.throws(() => validateReceiptFile(file(100, type)), /JPEG, PNG or WebP/);
  }
});
