import test from "node:test";
import assert from "node:assert/strict";
import { getGeminiModel } from "../lib/gemini.mjs";

test("shared Gemini configuration", async (t) => {
  const oldKey = process.env.GEMINI_API_KEY;
  const oldModel = process.env.GEMINI_MODEL;
  t.after(() => {
    if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = oldKey;
    if (oldModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = oldModel;
  });

  await t.test("missing API key produces a clear error without a network call", () => {
    delete process.env.GEMINI_API_KEY;
    assert.throws(getGeminiModel, /GEMINI_API_KEY is required/);
  });

  process.env.GEMINI_API_KEY = "test-only-placeholder";
  await t.test("unset model selects the documented default", () => {
    delete process.env.GEMINI_MODEL;
    assert.equal(getGeminiModel().model, "models/gemini-3.8-flash");
  });

  await t.test("configured models are shared and whitespace is trimmed", () => {
    process.env.GEMINI_MODEL = "  gemini-custom-model  ";
    assert.equal(getGeminiModel().model, "models/gemini-custom-model");
  });

  await t.test("retired Gemini 1.5 models fail before any request", () => {
    for (const model of ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "models/gemini-1.5-flash"]) {
      process.env.GEMINI_MODEL = model;
      assert.throws(getGeminiModel, /has been shut down/);
    }
  });
});
