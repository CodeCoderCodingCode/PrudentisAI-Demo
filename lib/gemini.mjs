import { GoogleGenerativeAI } from "@google/generative-ai";

// Keep receipt scanning and report generation on the same configurable model.
// Provider availability still needs verification with the deployment's API key.
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required to use AI features.");
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";
  if (/^(?:models\/)?gemini-1\.5(?:-|$)/.test(model)) {
    throw new Error("Gemini 1.5 has been shut down. Set GEMINI_MODEL to an available model.");
  }

  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model,
    generationConfig: { maxOutputTokens: 2048, responseMimeType: "application/json" },
  });
}
