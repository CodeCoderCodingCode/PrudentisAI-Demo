# Demo verification — October 25, 2026

[← README](../README.md) · [Setup](SETUP.md) · [Implementation notes](ARCHITECTURE.md#implementation-notes)

These checks use fictional demonstration data. They establish the flows below, not production suitability for real financial records.

| Flow | Result |
| --- | --- |
| Deployment and login | Production deployment loads; Clerk login, first-user profile initialization, dashboard and account views checked. |
| Demo data | 85 labelled transactions covering 90 days, an example account and a 2,400 USD budget inserted. A second seed preview found zero duplicate inserts. |
| Image receipt scan | A typeset fictional cafe receipt was uploaded through the authenticated live UI. Gemini returned 9.50 USD, October 25, 2026, food, and the purchased items. |
| Save scanned transaction | The UI saved the 9.50 expense, displayed 86 transactions and changed the example balance from 6,769.75 to 6,760.25. |
| Budget email | Actual job handler executed in a controlled harness, using the demo data and a simulated threshold. Resend reported `delivered` for the explicitly authorized test message. The real budget and its alert marker were not changed by this test. |
| Monthly email | Actual monthly-report handler aggregated September's demo transactions, requested Gemini insights and rendered the original React Email template. Resend reported `delivered` for the explicitly authorized test message. |
| Cost configuration | AI Studio showed Google's Free tier without enabled billing. The existing Resend key showed unused allowances of 100 daily and 3,000 monthly emails before the two test messages. The replacement Supabase project uses its Free plan. No paid upgrade was enabled. |
| Automated checks | 18 unit tests cover model selection, receipt upload/response boundaries, email rejection/acceptance, complete monthly date windows, aggregation and the retired seed endpoint. Lint and both application builds are also run. |

## Automatic schedules are not enabled

The live `/api/inngest` endpoint reports four functions, but `has_event_key` and `has_signing_key` are false. No Inngest Cloud registration or scheduled mail delivery was activated by these tests. The two messages were controlled test runs, not evidence of a cloud cron execution.

To enable scheduling later, configure the intended Inngest project's event/signing keys, sync the deployed endpoint and verify an actual scheduled run. Confirm the free plan and explicitly authorize ongoing email delivery before activation. Until then, receipt scanning and normal account/transaction features work independently of the scheduler.

## Fixes made during verification

- Provider error responses are treated as failed mail delivery; budget alert markers are updated only after provider acceptance. Stable idempotency headers are passed to Resend for job retries.
- Reports and budget queries use complete UTC months with an exclusive next-month boundary. Previous-month selection handles the 31st and year changes.
- Monetary values retain cents in account selectors and alert emails.
- Receipt fields and the three report insights are validated before reaching their UI/template consumers.

Recurrence edge cases, concurrent balance changes, verified custom sender domains and binary image-signature validation remain documented follow-up work. See the implementation notes.
