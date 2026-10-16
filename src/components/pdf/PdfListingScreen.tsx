import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Bookmark,
  ArrowRight,
  SlidersHorizontal,
  FileText,
  Check,
  X,
} from 'lucide-react';
import { PDFResource } from '../../types';
import { fetchPDFResources, PDF_CATEGORIES } from '../../data/pdfResources';
import { useCart } from '../../context/CartContext';

interface PdfListingScreenProps {
  onNavigate: (path: string) => void;
  onSavePdf: (pdf: PDFResource) => void;
  isSaved: (pdfId: string) => boolean;
  onToast: (msg: string, kind?: 'success' | 'info') => void;
}

export const PdfListingScreen: React.FC<PdfListingScreenProps> = ({
  onNavigate,
  onSavePdf,
  isSaved,
  onToast,
}) => {
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular' | 'newest'>('default');

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    let mounted = true;
    fetchPDFResources().then((data) => {
      if (mounted) {
        setPdfs(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPdfs = useMemo(() => {
    return pdfs
      .filter((pdf) => {
        const matchesCategory =
          selectedCategory === 'All' || pdf.category.toLowerCase() === selectedCategory.toLowerCase();
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          pdf.title.toLowerCase().includes(q) ||
          pdf.description.toLowerCase().includes(q) ||
          (pdf.subtitle && pdf.subtitle.toLowerCase().includes(q)) ||
          pdf.topicsCovered.some((t) => t.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        if (sortBy === 'newest') return (b.lastUpdated || '').localeCompare(a.lastUpdated || '');
        return 0;
      });
  }, [pdfs, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, pdf: PDFResource) => {
    e.stopPropagation();
    if (isInCart(pdf.id)) {
      onToast('Already in your cart');
      return;
    }
    addToCart(pdf);
    onToast(`Added "${pdf.title}" to cart`, 'success');
  };

  const handleBuyNow = (e: React.MouseEvent, pdf: PDFResource) => {
    e.stopPropagation();
    if (!isInCart(pdf.id)) {
      addToCart(pdf);
    }
    onNavigate('/checkout');
  };

  const handleToggleSave = (e: React.MouseEvent, pdf: PDFResource) => {
    e.stopPropagation();
    onSavePdf(pdf);
  };

  return (
    <main className="w-full pt-20 pb-16 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Minimal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              PDF Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] mt-0.5">
              Curated Mumbai admission roadmaps, cutoff handbooks, and course directories.
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredPdfs.length}</span> publications
          </div>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PDF guides, topics, cutoffs..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort PDF resources"
                className="py-2 px-3 rounded-xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-medium cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Recently Updated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {PDF_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-[#111A28] text-slate-600 dark:text-[#A9B8CA] hover:bg-slate-200 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading skeleton state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 animate-pulse p-4 space-y-4"
              >
                <div className="h-44 rounded-xl bg-slate-200 dark:bg-white/5" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/5 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {!loading && filteredPdfs.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-[#111A28] rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No matching PDF resources found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Clean, Consistent PDF Cards Grid */}
        {!loading && filteredPdfs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPdfs.map((pdf) => {
              const saved = isSaved(pdf.id);
              const inCart = isInCart(pdf.id);

              return (
                <div
                  key={pdf.id}
                  onClick={() => onNavigate(`/pdf-resources/${pdf.slug}`)}
                  className="group bg-white dark:bg-[#111A28] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-white/20 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md"
                >
                  {/* Card Cover & Badge Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#162235]">
                    <img
                      src={pdf.coverImage}
                      alt={pdf.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      loading="lazy"
                    />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 dark:bg-black/80 text-white backdrop-blur-xs">
                        {pdf.category}
                      </span>
                    </div>

                    {/* Save for Later Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, pdf)}
                      aria-label={saved ? 'Remove from saved' : 'Save for later'}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-xs transition-colors ${
                        saved
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-950/70 hover:bg-slate-950 text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>

                    {/* Page count pill */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-xs">
                        {pdf.pages} Pages • {pdf.fileFormat}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {pdf.title}
                      </h2>
                      {pdf.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-[#A9B8CA] line-clamp-2">
                          {pdf.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Price and Metadata */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            ₹{pdf.price}
                          </span>
                          {pdf.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{pdf.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {pdf.edition}
                        </span>
                      </div>

                      {/* Card Action Buttons: Add to Cart & Buy Now */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, pdf)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                            inCart
                              ? 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-transparent cursor-default'
                              : 'bg-white dark:bg-[#1A2639] hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>In Cart</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, pdf)}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-1 transition-colors shadow-xs"
                        >
                          <span>Buy Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
