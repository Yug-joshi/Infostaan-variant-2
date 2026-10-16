import React, { useState } from 'react';
import { FileText, Lock, Calendar, Layers, ExternalLink, ArrowRight, Clock } from 'lucide-react';
import { PurchasedPdfItem } from '../../types';
import { INITIAL_PURCHASES } from '../../data/pdfResources';

interface MyPurchasesScreenProps {
  onNavigate: (path: string) => void;
}

export const MyPurchasesScreen: React.FC<MyPurchasesScreenProps> = ({ onNavigate }) => {
  const [purchases] = useState<PurchasedPdfItem[]>(INITIAL_PURCHASES);

  return (
    <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="pb-3 border-b border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Purchases
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] mt-0.5">
              Your registered PDF publications and reference manuals.
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total Purchased: <span className="font-bold text-slate-900 dark:text-white">{purchases.length}</span>
          </div>
        </div>

        {/* Deferred Delivery Banner Notice */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111A28] border border-slate-200 dark:border-white/10 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              PDF downloading, direct access tokens, and verification workflows are deferred and currently inactive.
            </span>
          </div>
        </div>

        {/* Purchases List */}
        {purchases.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#111A28] rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No purchases registered yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Find admission analysis, cutoff handbooks, and guides under PDF Resources.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/pdf-resources')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950"
            >
              Explore PDF Resources
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs"
              >
                {/* Item Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={purchase.coverImage}
                    alt={purchase.title}
                    className="w-16 h-22 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        {purchase.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {purchase.orderNumber}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {purchase.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {purchase.pages} Pages
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Purchased {new Date(purchase.purchasedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Paid ₹{purchase.pricePaid}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Access Pending (Deferred)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/pdf-resources/${purchase.slug}`)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      <span>Overview</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled
                      title="PDF download is deferred and disabled"
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-400 text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Download (Deferred)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
