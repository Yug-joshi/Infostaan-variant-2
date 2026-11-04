import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Bookmark,
  Eye,
  ArrowRight,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
  Globe,
  HardDrive,
  Check,
} from 'lucide-react';
import { PDFResource } from '../../types';
import { fetchPDFBySlug } from '../../data/pdfResources';
import { useCart } from '../../context/CartContext';
import { PdfPreviewModal } from './PdfPreviewModal';

interface PdfDetailScreenProps {
  onNavigate: (path: string) => void;
  onSavePdf: (pdf: PDFResource) => void;
  isSaved: (pdfId: string) => boolean;
  onToast: (msg: string, kind?: 'success' | 'info') => void;
}

export const PdfDetailScreen: React.FC<PdfDetailScreenProps> = ({
  onNavigate,
  onSavePdf,
  isSaved,
  onToast,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [pdf, setPdf] = useState<PDFResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    fetchPDFBySlug(slug).then((res) => {
      if (mounted) {
        setPdf(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="w-full pt-24 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB]">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 dark:bg-white/5 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 h-96 bg-slate-200 dark:bg-white/5 rounded-2xl" />
            <div className="md:col-span-7 space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-white/5 rounded" />
              <div className="h-20 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!pdf) {
    return (
      <main className="w-full pt-24 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB]">
        <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold">PDF Publication Not Found</h2>
          <p className="text-sm text-slate-500">The requested resource could not be loaded.</p>
          <button
            type="button"
            onClick={() => onNavigate('/pdf-resources')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950"
          >
            Back to PDF Resources
          </button>
        </div>
      </main>
    );
  }

  const saved = isSaved(pdf.id);
  const inCart = isInCart(pdf.id);

  const handleAddToCart = () => {
    if (inCart) {
      onToast('Already in your cart');
      return;
    }
    addToCart(pdf);
    onToast(`Added "${pdf.title}" to cart`, 'success');
  };

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(pdf);
    }
    onNavigate('/checkout');
  };

  return (
    <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate('/pdf-resources')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All PDF Resources</span>
        </button>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cover & Preview Action */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#162235] border border-slate-200 dark:border-white/10 shadow-sm">
              <img
                src={pdf.coverImage}
                alt={pdf.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 dark:bg-black/80 text-white backdrop-blur-xs">
                  {pdf.category}
                </span>
              </div>
            </div>

            {/* Preview Trigger Button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Eye className="w-4 h-4 text-amber-500" />
              <span>Preview Sample Pages</span>
            </button>
          </div>

          {/* Right Column: Title, Price, Decisions Info & Primary Actions */}
          <div className="md:col-span-7 space-y-6">
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {pdf.edition}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {pdf.title}
              </h1>
              {pdf.subtitle && (
                <p className="text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                  {pdf.subtitle}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                  Direct Digital Access
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    ₹{pdf.price}
                  </span>
                  {pdf.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{pdf.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
                  Instant Access
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Single User License
                </span>
              </div>
            </div>

            {/* Primary Action Buttons: Add to Cart, Save for Later, Buy Now */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-3 px-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors border ${
                  inCart
                    ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-transparent cursor-default'
                    : 'bg-white dark:bg-[#111A28] hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white border-slate-200 dark:border-white/10'
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSavePdf(pdf)}
                aria-label={saved ? 'Remove from saved' : 'Save for later'}
                className={`p-3 rounded-xl border flex items-center justify-center transition-colors ${
                  saved
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-white dark:bg-[#111A28] hover:bg-slate-50 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#A9B8CA]'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Essential Document Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200/80 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Pages
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{pdf.pages} Pages</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200/80 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> Size
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{pdf.fileSize}</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200/80 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Language
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{pdf.language}</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200/80 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Updated
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{pdf.lastUpdated}</span>
              </div>
            </div>

            {/* Concise Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Summary & Decision Context
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#111A28] p-4 rounded-xl border border-slate-200 dark:border-white/10">
                {pdf.description}
              </p>
            </div>

            {/* Key Topics Covered */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Key Topics Covered
              </h2>
              <div className="bg-white dark:bg-[#111A28] rounded-xl border border-slate-200 dark:border-white/10 p-4 space-y-2.5">
                {pdf.topicsCovered.map((topic, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdf={pdf}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isInCart={inCart}
      />
    </main>
  );
};
