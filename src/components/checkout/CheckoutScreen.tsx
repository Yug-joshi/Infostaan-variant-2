import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, ShoppingCart, ShieldCheck, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { useCart } from '../../context/CartContext';

interface RazorpayCheckoutResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name?: string; email?: string; contact?: string };
  theme: { color: string };
  handler: (response: RazorpayCheckoutResult) => void;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface PaymentOrderResponse {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

interface PaymentConfigResponse {
  fixedPdfPrice: number | null;
  integrationTestEnabled: boolean;
  integrationTestPrice: number;
  currency: string;
}

interface IntegrationTestQrResponse {
  qrId: string;
  imageUrl: string;
  amount: number;
  currency: string;
  closeBy: number;
  message: string;
}

interface DownloadItem {
  id: string;
  slug: string;
  title: string;
  downloadUrl: string;
}

async function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    const script = existing ?? document.createElement('script');
    const onLoad = () => resolve();
    const onError = () => reject(new Error('Could not load Razorpay Checkout. Check your internet connection and try again.'));
    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
    if (!existing) {
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.dataset.razorpayCheckout = 'true';
      document.body.appendChild(script);
    }
  });
  if (!window.Razorpay) throw new Error('Razorpay Checkout did not initialize.');
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null) as (T & { message?: string }) | null;
  if (!response.ok) {
    throw new Error(data?.message || 'Payment request failed. Please try again.');
  }
  if (!data) throw new Error('The server returned an invalid payment response.');
  return data;
}

interface CheckoutScreenProps {
  onNavigate: (path: string) => void;
  onToast: (msg: string, kind?: 'success' | 'info') => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onNavigate, onToast }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [fixedPdfPrice, setFixedPdfPrice] = useState<number | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [integrationTestEnabled, setIntegrationTestEnabled] = useState(false);
  const [integrationTestPrice, setIntegrationTestPrice] = useState(1);
  const [integrationTestPaid, setIntegrationTestPaid] = useState(false);
  const [testQr, setTestQr] = useState<IntegrationTestQrResponse | null>(null);
  const [testQrImage, setTestQrImage] = useState<string | null>(null);
  const [isCreatingQr, setIsCreatingQr] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/payments/config')
      .then(async (response) => {
        const data = await response.json() as PaymentConfigResponse & { message?: string };
        if (!response.ok) throw new Error(data.message || 'Could not load payment settings.');
        return data;
      })
      .then((config) => {
        if (!active) return;
        if (config.currency !== 'INR' ||
            (config.fixedPdfPrice !== null &&
              (!Number.isFinite(config.fixedPdfPrice) || config.fixedPdfPrice < 1))) {
          throw new Error('Payment settings returned an invalid price.');
        }
        setFixedPdfPrice(config.fixedPdfPrice);
        setIntegrationTestEnabled(config.integrationTestEnabled);
        setIntegrationTestPrice(config.integrationTestPrice);
        setConfigLoaded(true);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setPaymentError(error instanceof Error ? error.message : 'Could not load payment settings.');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!testQr || integrationTestPaid) return;
    let active = true;
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payments/integration-test/qr/${encodeURIComponent(testQr.qrId)}/status`);
        const result = await response.json() as { paid?: boolean; message?: string };
        if (!response.ok) throw new Error(result.message || 'Could not check QR payment status.');
        if (active && result.paid) {
          setIntegrationTestPaid(true);
        }
      } catch (error) {
        if (active) {
          console.error('Checking Razorpay QR payment status failed:', error);
          setPaymentError(error instanceof Error ? error.message : 'Could not check QR payment status.');
        }
      }
    };
    void checkStatus();
    const intervalId = window.setInterval(() => void checkStatus(), 4000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [testQr, integrationTestPaid]);

  const displayedPdfPrice = integrationTestEnabled ? undefined : fixedPdfPrice ?? undefined;
  const displayedTotal = displayedPdfPrice === undefined
    ? cartTotal
    : displayedPdfPrice * cartItems.length;

  const startPayment = async () => {
    if (isProcessing || cartItems.length === 0) return;
    setIsProcessing(true);
    setPaymentError(null);
    try {
      await loadRazorpay();
      const order = await postJson<PaymentOrderResponse>('/api/payments/orders', {
        pdfIds: cartItems.map((item) => item.pdf.id),
      });

      const Razorpay = window.Razorpay;
      if (!Razorpay) throw new Error('Razorpay Checkout did not initialize.');

      const checkout = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Infostaan',
        description: `Digital PDFs (${cartItems.length})`,
        order_id: order.orderId,
        prefill: {
          name: fullName.trim() || undefined,
          email: email.trim() || undefined,
          contact: phone.trim() || undefined,
        },
        theme: { color: '#f59e0b' },
        handler: async (result) => {
          try {
            const verification = await postJson<{ verified: boolean; downloads: DownloadItem[] }>(
              '/api/payments/verify',
              {
                orderId: result.razorpay_order_id,
                paymentId: result.razorpay_payment_id,
                signature: result.razorpay_signature,
              },
            );
            if (!verification.verified || !Array.isArray(verification.downloads) || verification.downloads.length === 0) {
              throw new Error('Payment could not be verified. Contact support before trying to pay again.');
            }
            setDownloads(verification.downloads);
            clearCart();
            onToast('Payment verified. Your PDF downloads are ready.', 'success');
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Payment verification failed.';
            setPaymentError(`${message} If you were charged, contact support with your Razorpay payment ID.`);
            onToast('Payment was not verified. Please contact support if you were charged.', 'info');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });
      checkout.on('payment.failed', (response) => {
        setPaymentError(response.error?.description || 'Payment failed. Please try again.');
        setIsProcessing(false);
      });
      checkout.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start payment.';
      setPaymentError(message);
      setIsProcessing(false);
    }
  };

  const startIntegrationTestPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPaymentError(null);
    try {
      await loadRazorpay();
      const order = await postJson<PaymentOrderResponse>('/api/payments/integration-test/orders', {});
      const Razorpay = window.Razorpay;
      if (!Razorpay) throw new Error('Razorpay Checkout did not initialize.');
      const checkout = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Infostaan',
        description: '₹1 integration test payment (no PDF)',
        order_id: order.orderId,
        prefill: {
          name: fullName.trim() || undefined,
          email: email.trim() || undefined,
          contact: phone.trim() || undefined,
        },
        theme: { color: '#f59e0b' },
        handler: async (result) => {
          try {
            const verification = await postJson<{
              verified: boolean;
              testPayment?: boolean;
              message?: string;
            }>('/api/payments/verify', {
              orderId: result.razorpay_order_id,
              paymentId: result.razorpay_payment_id,
              signature: result.razorpay_signature,
            });
            if (!verification.verified || !verification.testPayment) {
              throw new Error(verification.message || 'Payment verification failed.');
            }
            setIntegrationTestPaid(true);
            onToast('₹1 integration test payment verified.', 'success');
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Payment verification failed.';
            setPaymentError(`${message} If charged, contact support with your Razorpay payment ID.`);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });
      checkout.on('payment.failed', (response) => {
        setPaymentError(response.error?.description || 'Payment failed. Please try again.');
        setIsProcessing(false);
      });
      checkout.open();
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not start integration test payment.');
      setIsProcessing(false);
    }
  };

  const createIntegrationTestQr = async () => {
    if (isCreatingQr) return;
    setIsCreatingQr(true);
    setPaymentError(null);
    setIntegrationTestPaid(false);
    try {
      const qr = await postJson<IntegrationTestQrResponse>('/api/payments/integration-test/qr', {});
      const qrImage = await QRCode.toDataURL(qr.imageUrl, { width: 280, margin: 2 });
      setTestQr(qr);
      setTestQrImage(qrImage);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not create Razorpay QR code.');
    } finally {
      setIsCreatingQr(false);
    }
  };

  if (downloads.length > 0) {
    return (
      <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB]">
        <div className="w-full max-w-2xl mx-auto px-4 py-12 space-y-6">
          <div className="text-center space-y-2">
            <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500" />
            <h1 className="text-2xl font-extrabold">Payment successful</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your secure download links expire in 15 minutes.</p>
          </div>
          <div className="space-y-3">
            {downloads.map((download) => (
              <a
                key={download.id}
                href={download.downloadUrl}
                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 font-semibold"
              >
                <span className="line-clamp-2">{download.title}</span>
                <Download className="w-5 h-5 shrink-0 text-amber-500" />
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/pdf-resources')}
            className="w-full py-3 rounded-xl bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 font-bold"
          >
            Continue browsing
          </button>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
        <div className="w-full max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <ShoppingCart className="w-10 h-10 text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold">No Items Selected for Checkout</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please add at least one publication to your cart before proceeding to checkout.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/pdf-resources')}
            className="px-4 py-2 rounded-xl bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold"
          >
            Browse PDF Resources
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate('/cart')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Cart</span>
        </button>

        <div className="pb-2 border-b border-slate-200/80 dark:border-white/10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#A9B8CA] mt-0.5">
            Review your order and provide delivery contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Information Form */}
          <div className="md:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Delivery & Contact Details
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Student / Parent Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address (For receipt & PDF access)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aryan@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    WhatsApp / Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Interface */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Payment Method
              </h2>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162235] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      {integrationTestEnabled ? 'Razorpay ₹1 Integration Test' : 'Razorpay UPI / Cards / Net Banking'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {integrationTestEnabled
                        ? 'Test payment only; no PDF will be purchased'
                        : 'Secure checkout powered by Razorpay'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Available</span>
              </div>

              {paymentError && (
                integrationTestEnabled && paymentError.includes('selected PDFs are unpublished or their files are unavailable')
                  ? (
                    <p className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-300">
                      PDF purchase is unavailable until the file is uploaded. You can still run the separate ₹{integrationTestPrice} payment test below; it does not include a PDF.
                    </p>
                  )
                  : (
                    <div role="alert" className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                      {paymentError}
                    </div>
                  )
              )}

              {integrationTestEnabled ? (
                <section className="space-y-3 border-t border-slate-200 dark:border-white/10 pt-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Payment integration test</h3>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                      This makes a real ₹{integrationTestPrice} charge and does not purchase or deliver any PDF.
                    </p>
                  </div>
                  {integrationTestPaid ? (
                    <p role="status" className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                      ₹{integrationTestPrice} test payment verified. No PDF was purchased.
                    </p>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={isProcessing || isCreatingQr}
                        onClick={() => void startIntegrationTestPayment()}
                        className="w-full rounded-xl border border-amber-400 px-4 py-3 text-sm font-bold text-amber-800 dark:text-amber-300 disabled:opacity-60"
                      >
                        {isProcessing ? 'Connecting to Razorpay…' : `Make ₹${integrationTestPrice} test payment`}
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing || isCreatingQr}
                        onClick={() => void createIntegrationTestQr()}
                        className="w-full rounded-xl border border-slate-300 dark:border-white/10 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-60"
                      >
                        {isCreatingQr ? 'Creating QR code…' : `Get ₹${integrationTestPrice} UPI test QR`}
                      </button>
                      {testQr && (
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white p-4 text-center">
                          <p className="mb-3 text-xs font-semibold text-slate-700">
                            Scan to make a real ₹{integrationTestPrice} test payment. No PDF is included.
                          </p>
                          <a href={testQr.imageUrl} target="_blank" rel="noreferrer">
                            <img
                              src={testQrImage ?? undefined}
                              alt={`Razorpay UPI QR code for ₹${integrationTestPrice} integration test payment`}
                              className="mx-auto h-56 w-56 object-contain"
                            />
                          </a>
                          <p className="mt-2 text-[11px] text-slate-500">
                            Waiting for payment confirmation…
                          </p>
                          <a
                            href={testQr.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-xs font-semibold text-amber-700 underline"
                          >
                            Open Razorpay payment link
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </section>
              ) : (
                <>

                  {fixedPdfPrice !== null && (
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Temporary integration price: ₹{fixedPdfPrice} per PDF.
                    </p>
                  )}

                  {!integrationTestEnabled && <button
                    type="button"
                    disabled={isProcessing || !configLoaded}
                    onClick={startPayment}
                    className="w-full py-3 px-4 rounded-xl bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-sm disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Lock className="w-4 h-4 animate-pulse" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>
                      {isProcessing
                        ? 'Connecting to Razorpay…'
                        : !configLoaded
                          ? 'Loading payment…'
                          : `Pay ₹${displayedTotal} via Razorpay`}
                    </span>
                  </button>}

                  {!integrationTestEnabled && (
                    <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                      Secure payment powered by Razorpay. Prices are confirmed by the server.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column: Selected PDFs & Order Total */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 space-y-4 shadow-2xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-white/5">
                Selected Publications ({cartItems.length})
              </h2>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.pdf.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.pdf.coverImage}
                        alt=""
                        className="w-10 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 block">
                          {item.pdf.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.pdf.pages} Pages • Digital PDF
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">
                      ₹{displayedPdfPrice ?? item.pdf.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{displayedPdfPrice === undefined ? cartTotal : displayedTotal}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Digital Delivery</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between text-base font-bold text-slate-900 dark:text-white">
                  <span>Order Total</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{displayedTotal}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Secure checkout. Your contact details are sent only to Razorpay.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
