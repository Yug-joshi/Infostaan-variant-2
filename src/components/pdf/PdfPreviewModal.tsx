import React from 'react';
import { X, FileText, CheckCircle2, ShoppingCart, ArrowRight } from 'lucide-react';
import { PDFResource } from '../../types';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdf: PDFResource;
  onAddToCart: (pdf: PDFResource) => void;
  onBuyNow: (pdf: PDFResource) => void;
  isInCart: boolean;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdf,
  onAddToCart,
  onBuyNow,
  isInCart,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${pdf.title}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111A28] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] z-10 transition-colors">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#162235]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Sample Preview Excerpt
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {pdf.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Preview Pages & Excerpts */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-sm">
          {/* Watermark Banner */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
            <span>Watermark: Infostaan Official Sample Preview (First 4 Excerpts)</span>
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {pdf.pages} Pages Full Guide
            </span>
          </div>

          {/* Table of contents sample extracts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sample Excerpts Included in Full Edition:
            </h4>
            <div className="space-y-2.5">
              {(pdf.previewPages && pdf.previewPages.length > 0
                ? pdf.previewPages
                : [
                    'Section 1: Complete Methodology & Benchmark Criteria',
                    'Section 2: Round-wise Cutoff and Percentage Comparison Analysis',
                    'Section 3: College Infrastructure & Attendance Strictness Policies',
                    'Section 4: Career Pathways and Post-Degree ROI Projections',
                  ]
              ).map((excerpt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/80 dark:border-white/5 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-md bg-white dark:bg-[#1A2639] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Topics covered checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Key Focus Areas in this Publication:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pdf.topicsCovered.map((topic, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162235] flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Full Guide</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              ₹{pdf.price}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onAddToCart(pdf)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 border ${
                isInCart
                  ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-transparent cursor-default'
                  : 'bg-white dark:bg-[#1A2639] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-white/10'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>

            <button
              type="button"
              onClick={() => onBuyNow(pdf)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
