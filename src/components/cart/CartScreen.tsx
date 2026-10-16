import React from 'react';
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartScreenProps {
  onNavigate: (path: string) => void;
  onToast: (msg: string, kind?: 'success' | 'info') => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onNavigate, onToast }) => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();

  const handleRemove = (pdfId: string, title: string) => {
    removeFromCart(pdfId);
    onToast(`Removed "${title}" from cart`);
  };

  if (cartItems.length === 0) {
    return (
      <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
        <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] max-w-sm mx-auto">
            Explore our curated collection of Mumbai admission guides, cutoffs, and roadmaps.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/pdf-resources')}
            className="px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-xs"
          >
            Explore PDF Resources
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#A9B8CA]">
              {cartItems.length} publication{cartItems.length > 1 ? 's' : ''} ready for checkout
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.pdf.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div
                  onClick={() => onNavigate(`/pdf-resources/${item.pdf.slug}`)}
                  className="flex items-start gap-4 cursor-pointer flex-1"
                >
                  <img
                    src={item.pdf.coverImage}
                    alt={item.pdf.title}
                    className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {item.pdf.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      {item.pdf.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.pdf.pages} Pages • Digital PDF Access
                    </p>
                  </div>
                </div>

                {/* Price and Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                      ₹{item.pdf.price}
                    </span>
                    {item.pdf.originalPrice && (
                      <span className="text-xs text-slate-400 line-through block">
                        ₹{item.pdf.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.pdf.id, item.pdf.title)}
                    aria-label={`Remove ${item.pdf.title}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Back link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/pdf-resources')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue browsing publications</span>
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 p-5 space-y-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/5">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-[#A9B8CA]">
                <span>Items Subtotal ({cartItems.length})</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-[#A9B8CA]">
                <span>Format Delivery</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between text-base">
                <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/checkout')}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Direct digital license access for Mumbai students.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
