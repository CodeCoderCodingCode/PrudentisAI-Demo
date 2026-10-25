# Contributing to Prudentis AI

Thanks for helping improve the project. Keep changes focused and distinguish a working implementation from an integration that still needs provider verification.

## Start locally

Use Node.js 22 and install with `npm ci --legacy-peer-deps`. For UI work, `npm run preview` starts the original analytics and email components with sample data and no service accounts. For database or authentication work, follow [the full setup guide](docs/SETUP.md).

## Before opening a pull request

```sh
npm run lint
npm test
npm run preview:build
```

For visual changes, inspect the preview at desktop and mobile widths. Update [the screenshots](docs/DEMO.md#screenshots-origin-and-reproduction) if the documented UI changes. For changes to database actions or provider integrations, test the relevant flow against a development database or service and describe the result explicitly.

Include the user-visible problem, resulting behavior and relevant validation in the pull request. Add meaningful regression tests for behavior changes. Do not present a preview build as evidence of successful authentication, AI calls or email delivery.

## Database and configuration changes

Keep Prisma schema changes and migrations together. Update `.env.example` and the setup guide when adding configuration. Preserve existing stored field names unless a migration is intentional. Never commit API keys, filled-in environment files, real receipts or personal transaction exports.

## Reporting a problem

Use [GitHub Issues](https://github.com/CodeCoderCodingCode/PrudentisAI-Demo/issues) with reproduction steps, expected and actual behavior, runtime version and whether the issue concerns the full application or isolated preview. Remove credentials and personal data from logs and screenshots.

The repository currently has no license file. Ask the owner about intended licensing before redistributing the code.
