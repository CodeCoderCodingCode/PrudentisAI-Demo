import test from "node:test";
import assert from "node:assert/strict";
import { GET } from "../app/api/seed/route.js";

test("retired seed route responds without a database or user/account IDs", async () => {
  const response = await GET();
  assert.equal(response.status, 410);
  const body = await response.json();
  assert.match(body.error, /Legacy seeding is disabled/);
  assert.equal(body.success, undefined);
});
