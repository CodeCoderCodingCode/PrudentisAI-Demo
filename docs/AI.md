# AI setup: free first, with limits

[← README](../README.md) · [Full setup](SETUP.md)

## Recommended starting point

Use the **Gemini Developer API Free tier** for the first demo. The application already uses Google's SDK, and Google currently lists free input/output tokens for `gemini-3.5-flash-lite`. Actual eligibility, model access and capacity belong to your Google project; they cannot be guaranteed by this repository.

OpenAI could power the same text and image workflows through a different adapter, but its normal generative API pricing does not provide a generally guaranteed free allowance for these tasks. A ChatGPT subscription is not a substitute for API billing. This repository therefore keeps Gemini as its only AI provider for the free-first setup and does not add a paid fallback.

Official sources, checked October 25, 2026: [Google pricing](https://ai.google.dev/gemini-api/docs/pricing), [Google quotas](https://ai.google.dev/gemini-api/docs/rate-limits), [OpenAI API pricing](https://developers.openai.com/api/docs/pricing).

## Create and configure the key

1. Open **[Google AI Studio API keys](https://aistudio.google.com/apikey)** and sign in.
2. Create or choose a project in the **Free** tier. Do not enable paid billing for a zero-cost demo. A key belonging to an already billed project can produce charges; the app cannot infer the project's billing tier from the key.
3. Create a key restricted to the Gemini API, following [Google's key guide](https://ai.google.dev/gemini-api/docs/api-key).
4. In the local, Git-ignored `.env` file, set `GEMINI_API_KEY` to your key and leave `GEMINI_MODEL=gemini-3.5-flash-lite` unless your project's model availability requires a change.
5. Restart the full application. Keep the key on the server; do not post it in issues, screenshots, chat transcripts or Git commits.
6. Open the project's rate-limit view in AI Studio. The minute, token and daily limits shown there are authoritative for that project.

No key is required for `npm run preview`. Creating a key alone does not activate a hosted demo; hosted access remains on request.

## Limits in this application

| Boundary | Behavior |
| --- | --- |
| Provider quota | Google enforces model/project limits, including requests and tokens. Exceeding one can produce a 429 error. Quotas are per project, not per API key. |
| Receipt access | An authenticated Clerk user is required before the scan calls the provider. |
| Receipt attempts | A dedicated Arcjet token bucket allows five attempts per user and refills every 86,400 seconds. Attempts that later fail at Google still consume a token. |
| Upload | Both client and server check JPEG/PNG/WebP MIME metadata and a maximum size of 4 MiB. This is input validation, not a full binary-content inspection. |
| Output | Both AI workflows request JSON and cap output at 2,048 tokens. |
| Provider choice | Gemini only; no automatic switch to a paid model/provider. |

The per-user scan bucket is not a global project cost cap. Monthly reports also use the project's Gemini quota. To keep the first demo free, use a Free-tier project without paid billing and leave Inngest jobs disabled until needed. If paid billing is enabled later, review application-wide cost controls first.

## Verification and data handling

Unit tests cover missing keys, shared model selection, retired-model rejection and receipt upload boundaries. They do not contact Google. On October 25, 2026, AI Studio showed the demo project's Free tier with billing not enabled. A live SDK request using fictional receipt text and `gemini-3.5-flash-lite` returned valid JSON with the expected amount and date. The initially selected `gemini-3.8-flash` returned 503 overload errors twice, so the demo now selects Flash-Lite explicitly. This is not an automatic fallback. Image upload through the authenticated UI and scheduled report delivery still need separate integration checks.

Use fictional receipt data initially. Receipt images and monthly aggregate statistics leave the application when those features call Google. Review the provider terms applicable to your location and tier before using personal financial data; the [pricing page](https://ai.google.dev/gemini-api/docs/pricing) links to the relevant data-use terms.

If Google changes availability or pricing, update `GEMINI_MODEL` after checking model compatibility and the Free tier. The earlier `gemini-1.5-flash` model was shut down and must not be restored.
