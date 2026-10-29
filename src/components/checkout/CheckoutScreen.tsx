import React, { useState } from 'react';
import { ArrowLeft, Lock, AlertCircle, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CheckoutScreenProps {
  onNavigate: (path: string) => void;
  onToast: (msg: string, kind?: 'success' | 'info') => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onNavigate, onToast }) => {
  const { cartItems, cartTotal } = useCart();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

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

        {/* Deferred Payment Notice Alert */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Payment Gateway Notice</span>
            <p className="leading-relaxed">
              Razorpay payment integration is deferred and not yet activated on this deployment.
              No transactions or debit charges will be processed.
            </p>
          </div>
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

              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162235] flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-400" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Razorpay UPI / Cards / Net Banking
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Payment gateway currently deactivated
                    </span>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>

              {/* Disabled Checkout Action */}
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-xl bg-slate-300 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{cartTotal} via Razorpay (Disabled)</span>
              </button>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                Payment processing is intentionally disabled in this stage.
              </p>
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
                      ₹{item.pdf.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Digital Delivery</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between text-base font-bold text-slate-900 dark:text-white">
                  <span>Order Total</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Protected purchase structure. Payments deferred.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
