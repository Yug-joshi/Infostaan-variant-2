# Backend Deployment

## Render

Deploy this repository as a Render Blueprint using the root [`render.yaml`](../../render.yaml). It configures the backend root directory, `npm install` build command, `npm start` start command, `/api/health` health check, and a persistent disk mounted at `/data`. Render disks require a paid service plan.

Add backend secrets in the Render service's Environment settings; never put them in the Blueprint or frontend variables. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` for payments, `ADMIN_API_KEY` for admin operations, and the Google Sheets variables documented below to enable course inquiries.

## Railway

For Railway, set the service root directory to `backend` and the start command to `npm start`. Keep backend secrets in Railway Variables.

Attach a persistent volume mounted at `/data`, then set `PDF_STORAGE_DIR=/data/storage` and `PDF_CATALOG_PATH=/data/pdfs.json`. The catalog is initialized from the bundled `server/data/pdfs.json` on first startup. These paths preserve uploaded PDFs, covers, and catalog edits across redeploys.

The website remains at `https://infostaan.com`. Set the GitHub Actions repository variable `VITE_API_BASE_URL` to the Railway service URL, or to `https://api.infostaan.com` after configuring that custom domain in Railway and DNS. Leave it unset only while the frontend should continue making same-origin `/api` requests.

# Razorpay API

This backend uses the existing PDF catalog and local private PDF storage. It does not create a database, save customer details, or persist orders.

Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the root `.env` on the server. Use Razorpay test credentials during integration; never expose the secret in frontend code or a `VITE_` variable. Local `.env` loading is enabled when the server starts. The key ID supplied in chat is not sufficient by itself; the matching key secret must be added to the server environment before checkout can create orders.

To test payments without charging for an unavailable PDF, set `RAZORPAY_ENABLE_TEST_PAYMENT=true`. Checkout then offers a separate ₹1 live integration-test payment and a single-use UPI QR code. This charge does not buy or deliver a PDF. The QR expires after 20 minutes, and its payment status is checked through Razorpay. Razorpay QR codes may need to be enabled for your account.

`POST /api/payments/integration-test/orders` creates the standalone ₹1 test order; `POST /api/payments/integration-test/qr` creates its QR code; `GET /api/payments/integration-test/qr/:qrId/status` checks for captured payment. `GET /api/payments/config` returns whether the integration-test flow is enabled.

To temporarily charge ₹1 per PDF instead, set `RAZORPAY_FIXED_PDF_PRICE_PAISE=100`. This still requires the PDF to be published and its actual file to exist. Remove that setting after testing to restore catalog prices.

## Create an order

`POST /api/payments/orders`

```json
{ "pdfIds": ["pdf-fyjc-bk-notes"] }
```

The server validates published products and calculates the amount from its catalog; it does not trust a client-supplied price. The response includes `keyId`, `orderId`, `amount` (paise), `currency`, and `receipt` for the Razorpay Checkout options.

## Verify payment and get downloads

The checkout page creates the order and opens Razorpay Checkout. After checkout succeeds, it sends Razorpay's returned IDs/signature to `POST /api/payments/verify`:

```json
{
  "orderId": "order_...",
  "paymentId": "pay_...",
  "signature": "..."
}
```

The API verifies the signature and confirms the captured payment with Razorpay before returning download URLs. Each URL is valid for 15 minutes. No order or purchase history is stored; the download token is self-contained and signed using the Razorpay secret.

## Professional course inquiries

The Courses page shows short cards for the seven collaboration courses. Students can request more information through the site form; the original brochure PDFs are stored outside the public web directory and are not linked for direct download.

`POST /api/inquiries/courses` validates the student details and appends the inquiry to Google Sheets. The server sets the course ID/name, `Infostaan website` referral source, and collaboration campaign itself, so those attribution values cannot be supplied or changed by the browser. The form collects name, email, phone, current class/qualification, selected course, and consent to share contact details with the course partner. Automatic student/partner emails are not configured in this version.

Configure these server environment variables:

- `GOOGLE_SHEETS_SPREADSHEET_ID`: the ID from the Google Sheet URL.
- `GOOGLE_SHEETS_RANGE`: append range, default `Inquiries!A:I`.
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: credentials for a Google Cloud service account with the Sheets API enabled.

Share the destination spreadsheet with the service-account email as an **Editor** so the backend can append rows. The course partner can separately be given **Viewer** access. Create a tab named `Inquiries` and add these headers in row 1, in order: `Timestamp`, `Name`, `Email`, `Phone`, `Current class/qualification`, `Course ID`, `Course`, `Referral source`, `Campaign`. Keep the private key only in the backend host’s secret/environment settings.

If the frontend and backend are hosted on different domains, set the frontend build variable `VITE_API_BASE_URL` to the backend origin (for example, `https://api.example.com`). Leave it blank for local development with the Vite `/api` proxy. Configure the backend environment on Render/Railway; frontend `VITE_` variables are public and must never contain service-account credentials.
