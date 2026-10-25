# Demo access and walkthrough

[← README](../README.md) · [Setup](SETUP.md) · [Free AI setup](AI.md)

## Request a demo

**Hosted demo access is activated on request.** There is no advertised always-on public demo URL.

Contact the maintainer via the [GitHub profile](https://github.com/CodeCoderCodingCode), or open a [demo request issue](https://github.com/CodeCoderCodingCode/PrudentisAI-Demo/issues/new?title=Demo%20access%20request). Describe which workflow you want to see. Do not include financial data or credentials in a public issue. The maintainer provides availability and access details separately.

The repository also includes an independently started **local component preview** for development and screenshots. Running it locally does not activate or publish the hosted demo.

## A two-minute local component tour

After installing the dependencies, run:

```sh
npm run preview
```

Open [127.0.0.1:3001](http://127.0.0.1:3001). The server listens on the local loopback interface.

| Step | Action | What it demonstrates |
| --- | --- | --- |
| 1 | Review **Recent Transactions**. | The application's actual dashboard component, populated with fictional income and expenses. |
| 2 | Switch **Everyday account** to **Savings account**. | Account-based filtering of transactions and category totals. |
| 3 | Hover over a category slice. | Expense amounts shown through the real chart tooltip. |
| 4 | Change **Last Month** to **Last 7 Days**. | The application's actual account-chart date filter. |
| 5 | Open **Email report**. | The original React Email monthly-report template rendered with sample props. |

These pages import [`DashboardOverview`](../app/%28main%29/dashboard/_components/transaction-overview.jsx), [`AccountChart`](../app/%28main%29/account/_components/account-chart.jsx) and [`EmailTemplate`](../emails/template.jsx). They do not reproduce those components in a mock design.

Transactions are generated relative to the date when the page loads, so current-month and date-range filters remain useful. At a month boundary, fewer expenses may belong to the current month. Email report values are fixed fictional examples; their handwritten insights are not AI-generated results.

## Walk through the complete app

Use a configured development environment from [SETUP.md](SETUP.md), or arrange hosted access with the maintainer. Use a test account and fictional data.

1. **Sign up** at `/sign-up` and open `/dashboard`.
2. **Create a current account** called `Everyday` with a fictional opening balance. The first account becomes the default.
3. **Add income and expenses** at `/transaction/create`. Choose dates in the current month and several categories.
4. **Set a monthly budget** and compare spending in the default account against it.
5. **Open the account** at `/account/<id>`, inspect the chart and filter the transaction table.
6. **Optional: scan a receipt.** Configure the Gemini key, use a legible JPEG/PNG/WebP of at most 4 MiB, check extracted values and save only after review. Authentication, scan limits and provider quotas apply.
7. **Optional: inspect automation.** With Inngest and email configured, examine registered jobs and their run logs. The local component preview alone never runs these integrations.

Do not use the legacy `/api/seed` endpoint for this tour. It contains fixed IDs and deletes transactions for its configured account.

## Screenshots: origin and reproduction

| File | Source | Data |
| --- | --- | --- |
| [`analytics-preview.png`](images/analytics-preview.png) | Browser capture of the local preview's `/` route. | Fictional transactions passed into the actual dashboard and account-chart components. |
| [`monthly-report-preview.png`](images/monthly-report-preview.png) | Browser capture of the local preview's `/reports` route. | Original email template with fictional totals and handwritten sample insights. |

Both are real browser screenshots. No generated illustrations, composited dashboards or fabricated authenticated sessions were used. The preview header explicitly labels the data as samples. The main app's existing robot illustrations are separate assets and are not used as proof of functionality here.

To refresh the screenshots:

1. Run `npm run preview` and open a page at a desktop width of about 1,440 pixels.
2. Wait for the charts to finish animating and close menus/tooltips.
3. Capture a full-page browser screenshot, keeping the sample-data label visible.
4. Save the PNG under `docs/images/` with the existing filename and review readability.
5. Keep captions accurate. If you capture the complete authenticated application later, identify it separately and use a dedicated demo user with fictional data.

Changes to the visual components should be reflected in refreshed screenshots. There is no fabricated screenshot placeholder in the README.
