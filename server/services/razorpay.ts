import crypto from 'crypto';

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
};

type RazorpayPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
};

type RazorpayQrCode = {
  id: string;
  type: string;
  usage: string;
  image_url: string;
  payment_amount: number;
  status: string;
  close_by: number;
  notes?: Record<string, string>;
};

type RazorpayQrPayments = {
  items: RazorpayPayment[];
};

function getCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured.');
  }
  return { keyId, keySecret };
}

async function razorpayRequest<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const { keyId, keySecret } = getCredentials();
  const response = await fetch(`https://api.razorpay.com/v1${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body
      ? JSON.stringify((body as { error: unknown }).error)
      : `HTTP ${response.status}`;
    throw new Error(`Razorpay API request failed: ${message}`);
  }
  return body as T;
}

export function getRazorpayKeyId(): string {
  return getCredentials().keyId;
}

export function createRazorpayOrder(input: {
  amount: number;
  receipt: string;
  pdfIds: string[];
  purpose?: 'pdf_purchase' | 'integration_test';
}): Promise<RazorpayOrder> {
  return razorpayRequest<RazorpayOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      amount: input.amount,
      currency: 'INR',
      receipt: input.receipt,
      notes: {
        app: 'infostaan',
        amount_paise: String(input.amount),
        purpose: input.purpose ?? 'pdf_purchase',
        ...(input.pdfIds.length > 0 ? { pdf_ids: input.pdfIds.join(',') } : {}),
      },
    }),
  });
}

export function fetchRazorpayOrder(orderId: string): Promise<RazorpayOrder> {
  return razorpayRequest<RazorpayOrder>(`/orders/${encodeURIComponent(orderId)}`);
}

export function fetchRazorpayPayment(paymentId: string): Promise<RazorpayPayment> {
  return razorpayRequest<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}`);
}

export function createRazorpayTestQr(input: {
  amount: number;
  closeBy: number;
}): Promise<RazorpayQrCode> {
  return razorpayRequest<RazorpayQrCode>('/payments/qr_codes', {
    method: 'POST',
    body: JSON.stringify({
      type: 'upi_qr',
      name: 'Infostaan integration test',
      usage: 'single_use',
      fixed_amount: true,
      payment_amount: input.amount,
      description: 'Infostaan ₹1 integration test payment. No PDF purchase.',
      close_by: input.closeBy,
      notes: {
        app: 'infostaan',
        purpose: 'integration_test',
        amount_paise: String(input.amount),
      },
    }),
  });
}

export function fetchRazorpayQr(qrId: string): Promise<RazorpayQrCode> {
  return razorpayRequest<RazorpayQrCode>(`/payments/qr_codes/${encodeURIComponent(qrId)}`);
}

export function fetchRazorpayQrPayments(qrId: string): Promise<RazorpayQrPayments> {
  return razorpayRequest<RazorpayQrPayments>(
    `/payments/qr_codes/${encodeURIComponent(qrId)}/payments?count=100`,
  );
}

export function createDownloadToken(pdfId: string, paymentId: string, expiresAt: number): string {
  const { keySecret } = getCredentials();
  const payload = Buffer.from(JSON.stringify({ pdfId, paymentId, expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', keySecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyDownloadToken(token: string): { pdfId: string } | null {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined) return null;

  const { keySecret } = getCredentials();
  const expected = crypto.createHmac('sha256', keySecret).update(payload).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('pdfId' in parsed) ||
      typeof parsed.pdfId !== 'string' ||
      !('paymentId' in parsed) ||
      typeof parsed.paymentId !== 'string' ||
      !('expiresAt' in parsed) ||
      typeof parsed.expiresAt !== 'number' ||
      parsed.expiresAt <= Math.floor(Date.now() / 1000)
    ) return null;
    return { pdfId: parsed.pdfId };
  } catch {
    return null;
  }
}

export function isValidRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!/^[a-f\d]{64}$/i.test(signature)) return false;
  const { keySecret } = getCredentials();
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
