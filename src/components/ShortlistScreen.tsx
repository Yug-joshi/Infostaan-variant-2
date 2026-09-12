import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  School,
  Building2,
  TrendingUp,
  Scale,
  Trash2,
  ArrowRight,
  Clock,
  Train,
  Sparkles,
  Columns2,
} from 'lucide-react';
import { ShortlistItem, ScreenType } from '../types';
import gsap from 'gsap';

interface ShortlistScreenProps {
  savedItems: ShortlistItem[];
  onRemoveItem: (id: string) => void;
  onOpenCompare: (primaryId?: string) => void;
  onSelectCollege: (collegeId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ShortlistScreen: React.FC<ShortlistScreenProps> = ({
  savedItems,
  onRemoveItem,
  onOpenCompare,
  onSelectCollege,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'college' | 'internship'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const collegeCount = savedItems.filter((i) => i.category === 'college').length;
  const internshipCount = savedItems.filter((i) => i.category === 'internship').length;

  const filteredItems = useMemo(() => {
    if (filter === 'all') return savedItems;
    return savedItems.filter((item) => item.category === filter);
  }, [savedItems, filter]);

  useEffect(() => {
    if (listContainerRef.current) {
      const items = listContainerRef.current.querySelectorAll('.shortlist-card-anim');
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [filteredItems, filter]);

  const handleRemove = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onRemoveItem(id);
      setDeletingId(null);
    }, 250);
  };

  return (
    <main className="w-full pt-16 sm:pt-20 bg-slate-50 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 overflow-hidden">
        {/* Subtle Ambient Top Halos */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#007DCC]/5 dark:bg-[#007DCC]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#19A7E8]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Editorial Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
          <div className="flex flex-col gap-1 max-w-xl">
            <div className="flex items-center gap-2 text-[#007DCC] dark:text-[#9ccaff] text-xs font-semibold tracking-wider uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#007DCC] animate-pulse" />
              <span>Decision Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight">
              Your Shortlist
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] mt-1">
              {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved to help you decide your next step.
            </p>
          </div>

          {/* Live Decision Progress Mini-Widget */}
          <div className="flex items-center gap-4 p-3 pl-4 bg-white dark:bg-[#1a202b] rounded-xl self-start md:self-auto shadow-xs border border-slate-200 dark:border-[#D3B5E8]/10">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase text-slate-500 dark:text-[#A9B8CA] font-semibold tracking-wider">
                Evaluation State
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB]">
                Stage 2: Comparison
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-[#242a36] flex items-center justify-center text-[#007DCC] dark:text-[#9ccaff]">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-[#2f3541]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#007DCC]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="66, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              filter === 'all'
                ? 'bg-[#007DCC] text-white shadow-xs'
                : 'bg-white dark:bg-[#1a202b] text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] border border-slate-200 dark:border-transparent'
            }`}
          >
            <span>All</span>
            <span className={`px-1.5 py-0.2 rounded-full text-xs font-normal ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-[#2f3541] text-slate-600 dark:text-[#A9B8CA]'}`}>
              {savedItems.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('college')}
            className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              filter === 'college'
                ? 'bg-[#007DCC] text-white shadow-xs'
                : 'bg-white dark:bg-[#1a202b] text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] border border-slate-200 dark:border-transparent'
            }`}
          >
            <span>Colleges</span>
            <span className={`px-1.5 py-0.2 rounded-full text-xs font-normal ${filter === 'college' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-[#2f3541] text-slate-600 dark:text-[#A9B8CA]'}`}>
              {collegeCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('internship')}
            className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              filter === 'internship'
                ? 'bg-[#007DCC] text-white shadow-xs'
                : 'bg-white dark:bg-[#1a202b] text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] border border-slate-200 dark:border-transparent'
            }`}
          >
            <span>Internships</span>
            <span className={`px-1.5 py-0.2 rounded-full text-xs font-normal ${filter === 'internship' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-[#2f3541] text-slate-600 dark:text-[#A9B8CA]'}`}>
              {internshipCount}
            </span>
          </button>
        </div>

        {/* Shortlist Items Container */}
        <div className="flex flex-col gap-8">
          <div ref={listContainerRef} className="flex flex-col gap-4">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#161c27] rounded-xl border border-slate-200 dark:border-[#D3B5E8]/10 text-slate-500 dark:text-[#A9B8CA]">
                <p className="text-lg font-semibold text-slate-900 dark:text-[#F4F7FB] mb-2">No items saved in this view</p>
                <p className="text-sm max-w-sm mx-auto mb-6">
                  Save institutions like Hinduja College, Podar, Mithibai, or H.R. College to compare them side-by-side.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="px-5 py-2.5 rounded-lg bg-[#007DCC] text-white text-sm font-medium hover:bg-[#006cb0] transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Mumbai Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isItemDeleting = deletingId === item.id;
                return (
                  <article
                    key={item.id}
                    className={`shortlist-card-anim group relative p-5 sm:p-6 bg-white dark:bg-[#161c27] hover:bg-slate-50 dark:hover:bg-[#1a202b] rounded-xl border border-slate-200 dark:border-[#D3B5E8]/10 hover:border-[#007DCC] dark:hover:border-[#D3B5E8]/30 transition-all duration-200 shadow-xs ${
                      isItemDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Metadata & Titles */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#242a36] flex items-center justify-center shrink-0 text-[#007DCC] dark:text-[#9ccaff] group-hover:scale-105 transition-transform">
                          {item.iconType === 'school' ? (
                            <School className="w-6 h-6" />
                          ) : (
                            <Building2 className="w-6 h-6" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2
                              onClick={() => {
                                if (item.collegeId) onSelectCollege(item.collegeId);
                              }}
                              className={`text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F4F7FB] group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors ${
                                item.collegeId ? 'cursor-pointer' : ''
                              }`}
                            >
                              {item.title}
                            </h2>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase ${
                                item.category === 'internship'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-[#00382d] dark:text-[#51dcbc]'
                                  : 'bg-blue-50 text-blue-700 dark:bg-[#2f3541] dark:text-[#86cfff]'
                              }`}
                            >
                              {item.regionBadge}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA]">
                            {item.locationInfo}
                          </p>

                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#8a919c] mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.timeSavedText}</span>
                            {item.lineText && (
                              <>
                                <span className="text-slate-300 dark:text-[#404751]">•</span>
                                <span className="text-slate-600 dark:text-[#A9B8CA]">{item.lineText}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contextual Actions */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:self-center pl-16 lg:pl-0">
                        {item.canCompare && (
                          <button
                            type="button"
                            onClick={() => onOpenCompare(item.collegeId)}
                            className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#2f3541] text-slate-800 dark:text-[#F4F7FB] hover:text-slate-900 dark:hover:bg-[#007DCC] dark:hover:text-white transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
                          >
                            <Scale className="w-4 h-4" />
                            <span>Compare</span>
                          </button>
                        )}

                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => handleRemove(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#A9B8CA] hover:text-rose-600 hover:bg-rose-50 dark:hover:text-[#ffb4ab] dark:hover:bg-[#93000a]/20 transition-colors flex items-center gap-1.5 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (item.collegeId) {
                              onSelectCollege(item.collegeId);
                            } else {
                              onNavigate('search');
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-[#007DCC] dark:text-[#9ccaff] hover:text-[#005a94] dark:hover:text-[#d0e4ff] hover:bg-blue-50 dark:hover:bg-[#2f3541] transition-colors flex items-center gap-1.5 group/link"
                        >
                          <span>{item.category === 'college' ? 'View details' : 'View opportunity'}</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Decision Next-Step Banner */}
          {collegeCount >= 2 && (
            <section
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 p-6 sm:p-8 md:p-10 shadow-xl border border-blue-800/40 text-white"
              id="decision-banner"
            >
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold tracking-wider uppercase">
                    <Columns2 className="w-4 h-4" />
                    <span>Next Strategic Move</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Ready to decide between your saved colleges?
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mt-1">
                    Compare Hinduja, Podar, Mithibai, and H.R. College side-by-side on commute duration, annual fees, cutoffs, and CA articleship suitability.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onOpenCompare()}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold bg-white text-slate-900 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-md group active:scale-95"
                  >
                    <span>Compare Saved Colleges</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Analytical Commute Matrix Preview */}
          <section className="rounded-xl bg-white dark:bg-[#080e19] p-5 sm:p-7 border border-slate-200 dark:border-[#D3B5E8]/10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-[#8a919c] font-semibold">
                  Commute & Feasibility Digest
                </span>
                <h4 className="text-base font-semibold text-slate-900 dark:text-[#F4F7FB] mt-0.5">
                  Snapshot of Mumbai Institutional Footprints
                </h4>
              </div>
              <span className="text-xs text-slate-600 dark:text-[#A9B8CA] flex items-center gap-1.5">
                <Train className="w-4 h-4 text-emerald-600 dark:text-[#51dcbc]" />
                <span>Optimized for Western & Central Railway lines</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Col 1 */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#1a202b] flex flex-col gap-2 border border-slate-200 dark:border-[#D3B5E8]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB]">Charni Road / Churchgate</span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-[#51dcbc]">2–3 min walk</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                  Direct hub for K.P.B. Hinduja College & H.R. College. Quick access to Marine Drive and Nariman Point offices.
                </p>
              </div>

              {/* Col 2 */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#1a202b] flex flex-col gap-2 border border-slate-200 dark:border-[#D3B5E8]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB]">Matunga (Central)</span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-[#51dcbc]">5 min walk</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                  Prime Central Line hub for R.A. Podar College. Direct connectivity from Thane, Ghatkopar, and Dadar.
                </p>
              </div>

              {/* Col 3 */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#1a202b] flex flex-col gap-2 border border-slate-200 dark:border-[#D3B5E8]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB]">Vile Parle (Western)</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-[#86cfff]">5 min walk</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                  SVKM Campus for Mithibai and NM College. Fast trains stop at neighboring Andheri station.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
