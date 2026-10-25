import test from "node:test";
import assert from "node:assert/strict";
import {sendEmail} from "../lib/email.mjs";

const message = {to: "test@example.com", subject: "Test", text: "Fictional example only"};
const response = value => ({apiKey: "test-placeholder", createClient: () => ({emails: {send: async () => value}})});

test("provider rejection is a failed delivery, not a successful send", async () => {
  const result = await sendEmail(message, response({data: null, error: {message: "Sender is not verified"}}));
  assert.deepEqual(result, {success: false, error: "Sender is not verified"});
});
test("missing credentials and missing provider confirmation fail", async () => {
  assert.equal((await sendEmail(message, {apiKey: ""})).success, false);
  assert.equal((await sendEmail(message, response({data: null, error: null}))).success, false);
});
test("provider acceptance returns its message ID and idempotency key", async () => {
  const result = await sendEmail({...message, idempotencyKey: "budget-test"}, {
    apiKey: "test-placeholder",
    createClient: () => ({headers: new Headers({Authorization: "Bearer test-placeholder"}), emails: {send: async (payload, options) => {
      assert.equal(payload.to, message.to);
      assert.equal(options.headers.get("Idempotency-Key"), "budget-test");
      assert.equal(options.headers.get("Authorization"), "Bearer test-placeholder");
      return {data: {id: "message-id"}, error: null};
    }}}),
  });
  assert.deepEqual(result, {success: true, data: {id: "message-id"}});
});
test("network errors are reported as failed delivery", async () => {
  const result = await sendEmail(message, {apiKey: "test-placeholder", createClient: () => ({emails: {send: async () => {throw new Error("Network unavailable");}}})});
  assert.deepEqual(result, {success: false, error: "Network unavailable"});
});
