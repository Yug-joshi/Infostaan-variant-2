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
