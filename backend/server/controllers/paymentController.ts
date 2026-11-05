import { Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFRepository } from '../data/pdfRepository.js';
import { PDFMetadata } from '../types.js';
import { PRIVATE_PDF_DIR } from '../storage/paths.js';
import {
  createDownloadToken,
  createRazorpayOrder,
  createRazorpayTestQr,
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  fetchRazorpayQr,
  fetchRazorpayQrPayments,
  getRazorpayKeyId,
  isValidRazorpaySignature,
  verifyDownloadToken,
} from '../services/razorpay.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOWNLOAD_TOKEN_TTL_SECONDS = 900;
const INTEGRATION_TEST_PRICE_PAISE = 100;
const INTEGRATION_TEST_QR_TTL_SECONDS = 20 * 60;

function getFixedPdfPricePaise(): number | null {
  const configured = process.env.RAZORPAY_FIXED_PDF_PRICE_PAISE?.trim();
  if (!configured) return null;
  const amount = Number(configured);
  if (!Number.isSafeInteger(amount) || amount < 100) {
    throw new Error('RAZORPAY_FIXED_PDF_PRICE_PAISE must be an integer of at least 100 paise.');
  }
  return amount;
}

function getPrivatePdfPath(pdf: PDFMetadata | undefined): string | undefined {
  if (!pdf?.privateFilePath) return undefined;
  const filePath = path.resolve(path.isAbsolute(pdf.privateFilePath)
    ? pdf.privateFilePath
    : path.join(__dirname, '..', pdf.privateFilePath));
  const relativePath = path.relative(PRIVATE_PDF_DIR, filePath);
  if (
    !relativePath ||
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath) ||
    !fs.existsSync(filePath)
  ) return undefined;
  return filePath;
}

export const getPaymentConfigHandler = (_req: Request, res: Response): void => {
  try {
    const fixedPdfPricePaise = getFixedPdfPricePaise();
    res.json({
      fixedPdfPrice: fixedPdfPricePaise === null ? null : fixedPdfPricePaise / 100,
      integrationTestEnabled: false,
      integrationTestPrice: INTEGRATION_TEST_PRICE_PAISE / 100,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Loading payment configuration failed:', error);
    res.status(503).json({
      error: 'PaymentNotConfigured',
      message: 'Payment service configuration is invalid.',
    });
  }
};

function isIntegrationTestEnabled(): boolean {
  return false;
}

function requireIntegrationTestEnabled(res: Response): boolean {
  if (isIntegrationTestEnabled()) return true;
  res.status(404).json({ error: 'NotFound', message: 'Payment integration test is not enabled.' });
  return false;
}

function sendPaymentError(res: Response, error: unknown, operation: string): void {
  console.error(`${operation} failed:`, error);
  if (error instanceof Error && (
    error.message.includes('must be configured') ||
    error.message.includes('RAZORPAY_FIXED_PDF_PRICE_PAISE')
  )) {
    res.status(503).json({
      error: 'PaymentNotConfigured',
      message: 'Payment service configuration is incomplete.',
    });
    return;
  }
  res.status(502).json({
    error: 'PaymentProviderError',
    message: 'The payment provider could not complete the request.',
  });
}

export const createPaymentOrderHandler = async (req: Request, res: Response): Promise<void> => {
  const pdfIds: unknown = req.body?.pdfIds;
  if (!Array.isArray(pdfIds) || pdfIds.length < 1 || pdfIds.length > 10 ||
      !pdfIds.every((id) => typeof id === 'string' && id.length > 0) ||
      new Set(pdfIds).size !== pdfIds.length) {
    res.status(400).json({
      error: 'ValidationError',
      message: '"pdfIds" must contain between 1 and 10 unique PDF IDs.',
    });
    return;
  }

  try {
    const pdfs = pdfIds.map((id) => PDFRepository.getById(id));
    if (pdfs.some((pdf) => !pdf?.isPublished || !getPrivatePdfPath(pdf))) {
      res.status(400).json({
        error: 'InvalidProducts',
        message: 'One or more selected PDFs are unpublished or their files are unavailable.',
      });
      return;
    }

    const fixedPdfPricePaise = getFixedPdfPricePaise();
    const amount = fixedPdfPricePaise === null
      ? Math.round(pdfs.reduce((total, pdf) => total + (pdf?.price ?? 0), 0) * 100)
      : fixedPdfPricePaise * pdfs.length;
    if (!Number.isSafeInteger(amount) || amount < 100) {
      res.status(400).json({
        error: 'InvalidAmount',
        message: 'The selected PDFs must have a valid total price of at least ₹1.',
      });
      return;
    }

    const receipt = `ifs-${crypto.randomUUID().replace(/-/g, '')}`;
    const order = await createRazorpayOrder({ amount, receipt, pdfIds });
    res.status(201).json({
      keyId: getRazorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    sendPaymentError(res, error, 'Creating Razorpay order');
  }
};

export const createIntegrationTestOrderHandler = async (_req: Request, res: Response): Promise<void> => {
  if (!requireIntegrationTestEnabled(res)) return;
  try {
    const receipt = `ifs-test-${crypto.randomUUID().replace(/-/g, '')}`;
    const order = await createRazorpayOrder({
      amount: INTEGRATION_TEST_PRICE_PAISE,
      receipt,
      pdfIds: [],
      purpose: 'integration_test',
    });
    res.status(201).json({
      keyId: getRazorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      testPayment: true,
      message: 'This is a ₹1 integration test payment and does not purchase or deliver a PDF.',
    });
  } catch (error) {
    sendPaymentError(res, error, 'Creating integration test order');
  }
};

export const createIntegrationTestQrHandler = async (_req: Request, res: Response): Promise<void> => {
  if (!requireIntegrationTestEnabled(res)) return;
  try {
    const closeBy = Math.floor(Date.now() / 1000) + INTEGRATION_TEST_QR_TTL_SECONDS;
    const qr = await createRazorpayTestQr({
      amount: INTEGRATION_TEST_PRICE_PAISE,
      closeBy,
    });
    if (!qr.id || !qr.image_url || qr.payment_amount !== INTEGRATION_TEST_PRICE_PAISE) {
      throw new Error('Razorpay returned an invalid integration-test QR code.');
    }
    res.status(201).json({
      qrId: qr.id,
      imageUrl: qr.image_url,
      amount: INTEGRATION_TEST_PRICE_PAISE,
      currency: 'INR',
      closeBy: qr.close_by,
      testPayment: true,
      message: 'This QR charges ₹1 as an integration test and does not purchase or deliver a PDF.',
    });
  } catch (error) {
    sendPaymentError(res, error, 'Creating integration test QR');
  }
};

export const getIntegrationTestQrStatusHandler = async (req: Request, res: Response): Promise<void> => {
  if (!requireIntegrationTestEnabled(res)) return;
  const { qrId } = req.params;
  if (!/^qr_[A-Za-z0-9]+$/.test(qrId)) {
    res.status(400).json({ error: 'ValidationError', message: 'Invalid QR code ID.' });
    return;
  }
  try {
    const [qr, payments] = await Promise.all([
      fetchRazorpayQr(qrId),
      fetchRazorpayQrPayments(qrId),
    ]);
    if (
      qr.notes?.app !== 'infostaan' ||
      qr.notes?.purpose !== 'integration_test' ||
      qr.payment_amount !== INTEGRATION_TEST_PRICE_PAISE
    ) {
      res.status(404).json({ error: 'NotFound', message: 'Integration test QR code was not found.' });
      return;
    }
    const paid = payments.items.some((payment) =>
      payment.status === 'captured' &&
      payment.amount === INTEGRATION_TEST_PRICE_PAISE &&
      payment.currency === 'INR'
    );
    res.json({
      paid,
      status: qr.status,
      expiresAt: qr.close_by,
    });
  } catch (error) {
    sendPaymentError(res, error, 'Checking integration test QR status');
  }
};

export const verifyPaymentHandler = async (req: Request, res: Response): Promise<void> => {
  const { orderId, paymentId, signature } = req.body ?? {};
  if (typeof orderId !== 'string' || typeof paymentId !== 'string' || typeof signature !== 'string') {
    res.status(400).json({
      error: 'ValidationError',
      message: '"orderId", "paymentId", and "signature" are required.',
    });
    return;
  }

  try {
    if (!isValidRazorpaySignature(orderId, paymentId, signature)) {
      res.status(400).json({ error: 'PaymentVerificationFailed', message: 'Invalid payment signature.' });
      return;
    }

    const [order, payment] = await Promise.all([
      fetchRazorpayOrder(orderId),
      fetchRazorpayPayment(paymentId),
    ]);
    if (
      order.id !== orderId ||
      !(order.receipt.startsWith('ifs-') || order.receipt.startsWith('ifs-test-')) ||
      order.notes?.app !== 'infostaan' ||
      payment.id !== paymentId ||
      payment.order_id !== orderId ||
      payment.status !== 'captured' ||
      payment.amount !== order.amount ||
      order.notes?.amount_paise !== String(order.amount) ||
      payment.currency !== 'INR' ||
      order.currency !== 'INR'
    ) {
      res.status(400).json({
        error: 'PaymentVerificationFailed',
        message: 'Payment is not captured or does not match the order.',
      });
      return;
    }

    if (order.notes?.purpose === 'integration_test') {
      if (
        order.receipt.startsWith('ifs-test-') &&
        order.notes?.amount_paise === String(INTEGRATION_TEST_PRICE_PAISE) &&
        order.amount === INTEGRATION_TEST_PRICE_PAISE
      ) {
        res.json({
          verified: true,
          testPayment: true,
          downloads: [],
          message: '₹1 integration test payment verified. No PDF was purchased or delivered.',
        });
        return;
      }
      res.status(400).json({
        error: 'PaymentVerificationFailed',
        message: 'The integration test payment does not match the expected amount.',
      });
      return;
    }

    if (order.notes?.purpose !== 'pdf_purchase') {
      res.status(400).json({
        error: 'PaymentVerificationFailed',
        message: 'The order purpose is invalid.',
      });
      return;
    }

    const pdfIds = order.notes?.pdf_ids?.split(',').filter(Boolean) ?? [];
    if (pdfIds.length < 1 || pdfIds.length > 10 || new Set(pdfIds).size !== pdfIds.length) {
      res.status(400).json({
        error: 'PaymentVerificationFailed',
        message: 'The payment order does not contain a valid PDF selection.',
      });
      return;
    }

    const pdfs = pdfIds.map((id) => PDFRepository.getById(id));
    if (pdfs.some((pdf) => !getPrivatePdfPath(pdf))) {
      res.status(404).json({
        error: 'DownloadUnavailable',
        message: 'One or more purchased PDF files are no longer available.',
      });
      return;
    }

    const expiresAt = Math.floor(Date.now() / 1000) + DOWNLOAD_TOKEN_TTL_SECONDS;
    const downloads = pdfs.map((pdf) => ({
      id: pdf!.id,
      slug: pdf!.slug,
      title: pdf!.title,
      downloadUrl: `/api/payments/download/${createDownloadToken(pdf!.id, paymentId, expiresAt)}`,
    }));

    res.json({
      verified: true,
      downloads,
      expiresIn: DOWNLOAD_TOKEN_TTL_SECONDS,
    });
  } catch (error) {
    sendPaymentError(res, error, 'Verifying Razorpay payment');
  }
};

export const downloadPurchasedPdfHandler = (req: Request, res: Response): void => {
  try {
    const token = verifyDownloadToken(req.params.token);
    if (!token) {
      res.status(403).json({ error: 'InvalidDownloadToken', message: 'The download link is invalid or expired.' });
      return;
    }

    const pdf = PDFRepository.getById(token.pdfId);
    const filePath = getPrivatePdfPath(pdf);
    if (!pdf || !filePath) {
      res.status(404).json({ error: 'DownloadUnavailable', message: 'The PDF file is unavailable.' });
      return;
    }

    res.download(filePath, path.basename(pdf.originalFileName || filePath));
  } catch (error) {
    console.error('Serving purchased PDF failed:', error);
    if (error instanceof Error && error.message.includes('must be configured')) {
      res.status(503).json({
        error: 'PaymentNotConfigured',
        message: 'Payment service configuration is incomplete.',
      });
      return;
    }
    res.status(500).json({ error: 'DownloadFailed', message: 'The PDF download could not be completed.' });
  }
};
