import React, { useState, useMemo } from 'react';
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

  const collegeCount = savedItems.filter((i) => i.category === 'college').length;
  const internshipCount = savedItems.filter((i) => i.category === 'internship').length;

  const filteredItems = useMemo(() => {
    if (filter === 'all') return savedItems;
    return savedItems.filter((item) => item.category === filter);
  }, [savedItems, filter]);

  const handleRemove = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onRemoveItem(id);
      setDeletingId(null);
    }, 250);
  };

  return (
    <main className="w-full pt-16 sm:pt-20 bg-[#070D18] min-h-screen">
      <div className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 overflow-hidden">
        {/* Subtle Ambient Top Halos */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#007DCC]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#19A7E8]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Editorial Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
          <div className="flex flex-col gap-1 max-w-xl">
            <div className="flex items-center gap-2 text-[#9ccaff] text-xs font-semibold tracking-wider uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#007DCC] animate-pulse" />
              <span>Decision Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#F4F7FB] tracking-tight">
              Your Shortlist
            </h1>
            <p className="text-sm sm:text-base text-[#A9B8CA] mt-1">
              {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved to help you decide your next step.
            </p>
          </div>

          {/* Live Decision Progress Mini-Widget */}
          <div className="flex items-center gap-4 p-3 pl-4 bg-[#1a202b] rounded-xl self-start md:self-auto shadow-sm border border-[#D3B5E8]/10">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase text-[#A9B8CA] font-semibold tracking-wider">
                Evaluation State
              </span>
              <span className="text-sm font-semibold text-[#F4F7FB]">
                Stage 2: Comparison
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#242a36] flex items-center justify-center text-[#9ccaff]">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#2f3541]"
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
                ? 'bg-[#242a36] text-[#F4F7FB]'
                : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#1a202b]'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.2 rounded-full text-xs font-normal bg-[#2f3541] text-[#A9B8CA]">
              {savedItems.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('college')}
            className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              filter === 'college'
                ? 'bg-[#242a36] text-[#F4F7FB]'
                : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#1a202b]'
            }`}
          >
            <span>Colleges</span>
            <span className="px-1.5 py-0.2 rounded-full text-xs font-normal bg-[#1a202b] text-[#A9B8CA]">
              {collegeCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('internship')}
            className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              filter === 'internship'
                ? 'bg-[#242a36] text-[#F4F7FB]'
                : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#1a202b]'
            }`}
          >
            <span>Internships</span>
            <span className="px-1.5 py-0.2 rounded-full text-xs font-normal bg-[#1a202b] text-[#A9B8CA]">
              {internshipCount}
            </span>
          </button>
        </div>

        {/* Main Content Flow */}
        <div className="flex flex-col gap-8">
          {/* Items Shortlist Stack */}
          <div className="flex flex-col gap-4" id="shortlist-container">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-[#1a202b] text-[#A9B8CA] border border-[#D3B5E8]/10">
                <p className="text-base font-medium text-[#F4F7FB] mb-2">No items in this category</p>
                <p className="text-sm">Explore Mumbai colleges and internships to save options for comparison.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-[#007DCC] text-white text-sm font-semibold hover:bg-[#19A7E8] transition-colors"
                >
                  Explore Options
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isDeleting = deletingId === item.id;
                return (
                  <article
                    key={item.id}
                    id={item.id}
                    style={{
                      transition: 'opacity 0.25s ease, transform 0.25s ease',
                      opacity: isDeleting ? 0 : 1,
                      transform: isDeleting ? 'translateY(-6px) scale(0.98)' : 'none',
                    }}
                    className="shortlist-item group p-5 sm:p-6 md:p-7 rounded-xl bg-[#1a202b] hover:bg-[#242a36] transition-all duration-200 shadow-sm border border-[#D3B5E8]/10 hover:border-[#D3B5E8]/25"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#2f3541] flex-shrink-0 flex items-center justify-center text-[#9ccaff] group-hover:scale-105 transition-transform">
                          {item.iconType === 'school' ? (
                            <School className="w-6 h-6 text-[#9ccaff]" />
                          ) : item.iconType === 'account_balance' ? (
                            <Building2 className="w-6 h-6 text-[#9ccaff]" />
                          ) : (
                            <TrendingUp className="w-6 h-6 text-[#51dcbc]" />
                          )}
                        </div>

                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <h2
                              onClick={() => {
                                if (item.collegeId) onSelectCollege(item.collegeId);
                              }}
                              className={`text-base sm:text-lg font-semibold text-[#F4F7FB] tracking-tight group-hover:text-[#9ccaff] transition-colors ${
                                item.collegeId ? 'cursor-pointer' : ''
                              }`}
                            >
                              {item.title}
                            </h2>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase ${
                                item.category === 'internship'
                                  ? 'bg-[#00382d] text-[#51dcbc]'
                                  : 'bg-[#2f3541] text-[#86cfff]'
                              }`}
                            >
                              {item.regionBadge}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#A9B8CA]">
                            {item.locationInfo}
                          </p>

                          <div className="flex items-center gap-2 text-xs font-medium text-[#8a919c] mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.timeSavedText}</span>
                            {item.lineText && (
                              <>
                                <span className="text-[#404751]">•</span>
                                <span className="text-[#A9B8CA]">{item.lineText}</span>
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
                            className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#2f3541] text-[#F4F7FB] hover:bg-[#007DCC] hover:text-white transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Scale className="w-4 h-4" />
                            <span>Compare</span>
                          </button>
                        )}

                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => handleRemove(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-[#A9B8CA] hover:text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors flex items-center gap-1.5 active:scale-95"
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
                          className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-[#9ccaff] hover:text-[#d0e4ff] hover:bg-[#2f3541] transition-colors flex items-center gap-1.5 group/link"
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

          {/* Decision Next-Step Banner (Quiet Midnight Anchor) */}
          {collegeCount >= 2 && (
            <section
              className="relative overflow-hidden rounded-xl bg-[#001d35] p-6 sm:p-8 md:p-10 shadow-xl border border-[#007DCC]/30"
              id="decision-banner"
            >
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-[#86cfff] text-xs font-semibold tracking-wider uppercase">
                    <Columns2 className="w-4 h-4" />
                    <span>Next Strategic Move</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Ready to decide between your saved colleges?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9ccaff]/90 leading-relaxed mt-1">
                    Compare Mithibai and H.R. College side-by-side on commute, fees, cutoffs, and CA suitability.
                  </p>
                </div>

                {/* Comparison Decision Catalyst CTA */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onOpenCompare()}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold bg-[#9ccaff] hover:bg-[#d0e4ff] text-[#001d35] transition-all duration-200 flex items-center justify-center gap-2 shadow-md group active:scale-95"
                  >
                    <span>Compare 2 Saved Colleges</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Ambient Backdrop Flare inside Decision Panel */}
              <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#007DCC]/15 rounded-full blur-3xl pointer-events-none" />
            </section>
          )}

          {/* Analytical Commute Matrix Preview */}
          <section className="rounded-xl bg-[#080e19] p-5 sm:p-7 border border-[#D3B5E8]/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest text-[#8a919c] font-semibold">
                  Commute & Feasibility Digest
                </span>
                <h4 className="text-base font-semibold text-[#F4F7FB] mt-0.5">
                  Snapshot of Saved Institutional Footprints
                </h4>
              </div>
              <span className="text-xs text-[#A9B8CA] flex items-center gap-1.5">
                <Train className="w-4 h-4 text-[#51dcbc]" />
                <span>Optimized for Western & Harbour transit lines</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Col 1 */}
              <div className="p-4 rounded-lg bg-[#1a202b] flex flex-col gap-2 border border-[#D3B5E8]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#F4F7FB]">Vile Parle Station</span>
                  <span className="text-xs font-medium text-[#51dcbc]">5 min walk</span>
                </div>
                <p className="text-xs text-[#A9B8CA] leading-relaxed">
                  Direct hub access for Mithibai College. Fast trains stop at Andheri (1 station away).
                </p>
              </div>

              {/* Col 2 */}
              <div className="p-4 rounded-lg bg-[#1a202b] flex flex-col gap-2 border border-[#D3B5E8]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#F4F7FB]">Churchgate Terminal</span>
                  <span className="text-xs font-medium text-[#51dcbc]">3 min walk</span>
                </div>
                <p className="text-xs text-[#A9B8CA] leading-relaxed">
                  Prime terminal proximity for H.R. College. Zero change-overs from Western Mumbai.
                </p>
              </div>

              {/* Col 3 */}
              <div className="p-4 rounded-lg bg-[#1a202b] flex flex-col gap-2 border border-[#D3B5E8]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#F4F7FB]">Malad Link Road</span>
                  <span className="text-xs font-medium text-[#86cfff]">Metro Line 2A</span>
                </div>
                <p className="text-xs text-[#A9B8CA] leading-relaxed">
                  Motilal Oswal Financial Center. Valnai Metro station is 400m from office entrance.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
