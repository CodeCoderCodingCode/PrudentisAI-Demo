# Setup and configuration

[← README](../README.md) · [Demo guide](DEMO.md)

## Choose your starting point

**To explore the UI:** install dependencies and run `npm run preview`. The isolated preview needs no `.env`, database or service accounts. See [DEMO.md](DEMO.md).

**To run the complete app:** follow the steps below. The main application initializes Clerk and Arcjet in its layout/middleware, so leaving those credentials empty is not a supported full-app configuration.

## 1. Install

Use Node.js 22 (also recorded in `.nvmrc`) and npm:

```sh
git clone https://github.com/CodeCoderCodingCode/PrudentisAI-Demo.git
cd PrudentisAI-Demo
npm ci --legacy-peer-deps
```

The existing dependency tree combines React 19 with React Day Picker 8 peer requirements. `--legacy-peer-deps` installs the checked-in lockfile without resolving that upstream compatibility mismatch; `.npmrc` also sets this option for hosted installs. Installation runs `prisma generate` automatically through `postinstall`.

## 2. Create your environment file

Copy `.env.example` to `.env` at the repository root. Using `.env` lets both Next.js and the Prisma CLI load the same database settings. `.env` remains ignored by Git.

macOS / Linux:

```sh
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

| Variable | Used for | Required when |
| --- | --- | --- |
| `DATABASE_URL` | Prisma runtime connection to PostgreSQL; may be a pooled URL. | Using database-backed application features. |
| `DIRECT_URL` | Direct PostgreSQL connection for migrations. Use the same URL as above for a local database without pooling. | Running Prisma migrations. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser configuration. | Starting the main application. |
| `CLERK_SECRET_KEY` | Clerk server authentication. | Starting the main application. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Custom sign-in page; set to `/sign-in`. | Using the custom auth routes. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Custom sign-up page; set to `/sign-up`. | Using the custom auth routes. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Default destination after sign-in; `/dashboard`. | Configuring sign-in navigation. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Default destination after sign-up; `/dashboard`. | Configuring sign-up navigation. |
| `ARCJET_KEY` | Shield, bot detection and transaction rate limiting. | Starting the main application. |
| `GEMINI_API_KEY` | Receipt extraction and monthly AI insights. | Enabling AI features. |
| `GEMINI_MODEL` | Shared model selection; defaults to `gemini-3.5-flash-lite`. | Optional override; verify availability in your project. |
| `RESEND_API_KEY` | Budget-alert and monthly-report delivery. | Sending email. |
| `OPEN_EXCANGE_API_KEY` | `/api/exchangeRates`. The spelling matches the existing code. | Using exchange-rate data. |
| `INNGEST_EVENT_KEY` | Send events to Inngest Cloud. | Deploying background jobs to Inngest Cloud. |
| `INNGEST_SIGNING_KEY` | Verify Inngest Cloud requests. | Deploying background jobs to Inngest Cloud. |

Only variables explicitly prefixed with `NEXT_PUBLIC_` belong in browser-exposed configuration. Never commit filled-in environment files or put provider secrets into that prefix.

## 3. Configure PostgreSQL and Clerk

Create an empty PostgreSQL database named `prudentis`, locally or with a managed provider. The example URL uses development-only placeholder credentials; replace them with your actual local credentials. Use the provider's direct connection URL for `DIRECT_URL` if its runtime URL is pooled.

Apply the migration already stored in this repository:

```sh
npx prisma migrate deploy
```

Create a Clerk development instance and copy its publishable and secret keys into `.env`. The app already contains `/sign-in` and `/sign-up` routes. Clerk's [environment-variable reference](https://clerk.com/docs/guides/development/clerk-environment-variables) explains custom route and redirect configuration.

Provide an Arcjet development key. The current middleware runs Shield and bot detection in `LIVE` mode; [`lib/arcjet.js`](../lib/arcjet.js) separately limits transaction creation to a bucket of 12 requests, refilling hourly. Background-job requests may need explicit bot-policy configuration; verify delivery rather than assuming the endpoint is reachable.

## 4. Start the app

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000), sign up and create your first account. The header's `checkUser` flow creates a corresponding database user for the authenticated Clerk user. Add transactions manually before testing optional integrations.

### Populate an account with fictional demo data

After creating an account, copy its ID from `/account/<id>`. With the intended database configured in `.env`, first preview the seed:

```sh
npm run seed:demo -- --account-id <account-id>
```

Add `--apply` to insert the data. The script supplies 90 days of varied, explicitly `DEMO`-labelled transactions and a 2,400 example budget if none exists. It preserves existing transactions and budgets, adjusts the account balance only for new entries, and uses stable IDs so repeating the same seed does not duplicate transactions. It runs on the administrator's machine; no public HTTP seed endpoint is opened. Example amounts use the app's current USD display.

## 5. Optional integrations

### Receipt scanning and AI reports

Provide `GEMINI_API_KEY` and optionally `GEMINI_MODEL`. Both integrations now use [`lib/gemini.mjs`](../lib/gemini.mjs), which defaults to `gemini-3.5-flash-lite`, requests JSON output and caps output at 2,048 tokens. It rejects retired Gemini 1.5 model IDs. Check provider access and actual output with your project's key before considering AI verified. See [AI.md](AI.md) for the Free-tier setup and limits.

The receipt uploader and Server Action both check for non-empty JPEG, PNG or WebP files of at most 4 MiB, leaving room beneath the 5 MB Server Action body limit. Scanning requires authentication and a separate Arcjet bucket of five attempts per user, refilling every 24 hours. Provider project quotas apply in addition. Confirm every extracted field before saving.

Receipt images are sent to Google when this feature is used. Monthly insight generation sends aggregated financial statistics. Use test data until the integration and data handling have been reviewed.

### Email delivery

Set `RESEND_API_KEY`. [`actions/send-email.js`](../actions/send-email.js) currently uses `Prudentis AI <onboarding@resend.dev>`. Follow Resend's account restrictions for testing and configure a verified sender domain in the code before broader delivery. The preview's `/reports` route renders the email locally without sending anything.

### Scheduled jobs

With the complete app running on port 3000, start the [Inngest Dev Server](https://www.inngest.com/docs/local-development) in another terminal:

```sh
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Open [localhost:8288](http://localhost:8288) and confirm that the functions are registered. Local development does not require Cloud event or signing keys. Configure those keys and sync `/api/inngest` when deploying to Inngest Cloud.

The code schedules budget checks every six hours, recurring-transaction checks daily and monthly reports on the first day of each month. A running Next.js app alone does not schedule these functions.

### Exchange rates

Set `OPEN_EXCANGE_API_KEY` for the Open Exchange Rates integration. The endpoint returns selected rates and an EUR-based conversion view. This does not change the underlying transaction model or add multi-currency account balances.

## Common problems

| Symptom | What to check |
| --- | --- |
| `ERESOLVE` during installation | Use `npm ci --legacy-peer-deps` with the checked-in lockfile. |
| Prisma cannot connect | Database is running, credentials are valid, and both connection URLs are set in `.env`. |
| Clerk key / auth initialization error | Both Clerk keys belong to the same development instance; restart the server after changes. |
| Main app cannot load without keys | Use `npm run preview` for credential-free exploration. |
| Receipt scan fails | Check model/key access, provider quota and the scan limit; use a supported image of at most 4 MiB. |
| Jobs do not run | Check Inngest registration and whether Arcjet permits the incoming requests. |
| No email arrives | Check Resend's sender and recipient restrictions, API response and job run logs. |
| `/api/seed` returns 410 | The legacy destructive seed route is intentionally disabled. Add sample transactions through the UI. |

## Deployment

`npm run build` and `npm start` build and serve the full app. A build does not require live database or authentication calls: the root layout renders per request. Runtime requests still need the application's environment variables in the target platform. Apply migrations to the intended database and configure Clerk, Arcjet, Resend and Inngest for that environment. The app also downloads its Google font during the build.

For Supabase on Vercel, use the project's actual shared transaction-pooler host on port 6543 for `DATABASE_URL` with `pgbouncer=true`, and the session-pooler connection on port 5432 for `DIRECT_URL` when the deployment environment only supports IPv4. Copy the host from the project's Connect dialog; the cluster index cannot be inferred from its region. See the [Supabase connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres).

Use a dedicated server database role with access to application tables. A runtime role with no schema-management privileges cannot apply migrations: run those through an administrator connection or the Supabase management tools. The Prisma model uses Clerk identities; Supabase's public `anon` and `authenticated` API roles should have no access to these tables. Keep the database password and provider keys in encrypted deployment environment variables.

Review the [implementation notes](ARCHITECTURE.md#implementation-notes) before public deployment. The isolated preview build only checks UI rendering and does not establish that the complete application or its services are production-ready.
