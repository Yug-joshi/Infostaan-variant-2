import React, { useMemo, useRef } from 'react';
import {
  ArrowRight,
  Building2,
  GraduationCap,
  TrendingUp,
  MonitorPlay,
  SlidersHorizontal,
  MapPin,
  Compass,
  X,
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchResultItem } from '../types';
import { searchInfostaan } from '../lib/searchEngine';
import { matchItemRegion, applyStreamFilter, filterClasses } from '../lib/categoryFilters';
import { FilterCategoryType } from './CategoryFilterModal';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type CategoryPageType = 'colleges' | 'courses' | 'careers' | 'classes';

interface CategoryResultsPageProps {
  category: CategoryPageType;
  onSelectCollege: (slug: string) => void;
  savedItemIds?: string[];
  onOpenCategoryFilter?: (cat: FilterCategoryType) => void;
  onOpenClasses?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_CONFIG: Record<
  CategoryPageType,
  { badge: string; title: string; emptyTitle: string; emptyDesc: string; filterLabel: string; icon: React.ElementType }
> = {
  colleges: {
    badge: 'Mumbai Colleges',
    title: 'Colleges in Mumbai',
    emptyTitle: 'Find Colleges in Mumbai',
    emptyDesc: 'Select your preferred stream and Mumbai region to discover matching colleges.',
    filterLabel: 'Choose Filters',
    icon: Building2,
  },
  courses: {
    badge: 'Mumbai Courses & Degrees',
    title: 'Courses in Mumbai',
    emptyTitle: 'Find Courses in Mumbai',
    emptyDesc: 'Choose your field of study and qualification level to discover courses.',
    filterLabel: 'Choose Filters',
    icon: GraduationCap,
  },
  careers: {
    badge: 'Mumbai Career Pathways',
    title: 'Careers in Mumbai',
    emptyTitle: 'Find Careers in Mumbai',
    emptyDesc: 'Select your target industry to explore Mumbai career pathways.',
    filterLabel: 'Choose Filters',
    icon: TrendingUp,
  },
  classes: {
    badge: 'Mumbai Coaching Classes',
    title: 'Coaching Classes in Mumbai',
    emptyTitle: 'Find Coaching Classes in Mumbai',
    emptyDesc: 'Choose your subject and Mumbai region to find nearby coaching classes.',
    filterLabel: 'Choose Filters',
    icon: MonitorPlay,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Active filter chip helper
// ─────────────────────────────────────────────────────────────────────────────

interface FilterChip {
  label: string;
  param: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const CategoryResultsPage: React.FC<CategoryResultsPageProps> = ({
  category,
  onSelectCollege,
  savedItemIds = [],
  onOpenCategoryFilter,
  onOpenClasses,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const config = PAGE_CONFIG[category];
  const IconComp = config.icon;

  // ── Read URL params ────────────────────────────────────────────────────────
  const allParam = searchParams.get('all');          // "true" = View All mode
  const query = searchParams.get('query') || '';
  const regionParam = searchParams.get('region');
  const streamParam = searchParams.get('stream');
  const fieldParam = searchParams.get('field');
  const interestParam = searchParams.get('interest');
  const industryParam = searchParams.get('industry');
  const levelParam = searchParams.get('level');
  const specializationParam = searchParams.get('specialization');

  // ── Show results gate ──────────────────────────────────────────────────────
  // Only one of two explicit signals shows results:
  //   1. all=true  → intentional "show everything"
  //   2. at least one filter / query param → filtered discovery
  // Bare /colleges with NO params → empty entry state.
  const isViewAll = allParam === 'true';
  const hasFilters = !!(
    query || regionParam || streamParam || fieldParam ||
    interestParam || industryParam || levelParam || specializationParam
  );
  const showResults = isViewAll || hasFilters;

  // ── Derive active filter chips ─────────────────────────────────────────────
  const activeChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    if (isViewAll) { chips.push({ label: 'All Results', param: 'all' }); return chips; }
    const add = (label: string | null, param: string) => {
      if (label && !label.startsWith('All')) chips.push({ label, param });
    };
    add(streamParam, 'stream');
    add(fieldParam, 'field');
    add(interestParam, 'interest');
    add(industryParam, 'industry');
    add(regionParam, 'region');
    add(levelParam, 'level');
    add(specializationParam, 'specialization');
    if (query) chips.push({ label: `"${query}"`, param: 'query' });
    return chips;
  }, [isViewAll, streamParam, fieldParam, interestParam, industryParam, regionParam, levelParam, specializationParam, query]);

  // Remove a single active filter chip
  const removeChip = (param: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(param);
    setSearchParams(next, { replace: true });
  };

  // ── Compute filtered results ───────────────────────────────────────────────
  const results: SearchResultItem[] = useMemo(() => {
    if (!showResults) return [];

    if (category === 'classes') {
      // Classes use their own dataset — not the search engine
      const filtered = filterClasses({
        interest: isViewAll ? null : interestParam,
        region: isViewAll ? null : regionParam,
        specialization: isViewAll ? null : specializationParam,
        query: isViewAll ? null : query,
      });
      // Map ClassData → SearchResultItem shape
      return filtered.slice(0, 200).map((cls) => ({
        id: cls.id,
        category: 'classes' as const,
        badgeCategory: 'Coaching Class',
        badgeSub: cls.area || cls.region || 'Mumbai',
        title: cls.name,
        subtitle: cls.specializations
          ? `Specialization: ${cls.specializations}`
          : 'Coaching & Classes',
        meta: [cls.streams || 'All Streams', cls.address || 'Mumbai'],
        whyRelevant: 'Coaching class in Mumbai',
        tagColor: 'lavender' as const,
        actionLabel: 'View Details',
      }));
    }

    // colleges / courses / careers — use searchInfostaan, then apply shared filters
    let raw = searchInfostaan(isViewAll ? '' : query, category);

    if (!isViewAll) {
      if (regionParam && regionParam !== 'All Mumbai') {
        raw = raw.filter((item) => matchItemRegion(item, regionParam));
      }
      const streamFilter =
        streamParam || fieldParam || interestParam || industryParam || specializationParam;
      raw = applyStreamFilter(raw, streamFilter);
    }

    return raw;
  }, [
    showResults, category, isViewAll, query, regionParam,
    streamParam, fieldParam, interestParam, industryParam,
    levelParam, specializationParam,
  ]);

  // ── Open correct modal for "Modify Filters" / "Choose Filters" ────────────
  const handleOpenFilter = () => {
    if (category === 'classes') {
      if (onOpenClasses) onOpenClasses();
    } else {
      if (onOpenCategoryFilter) onOpenCategoryFilter(category as FilterCategoryType);
    }
  };

  // ── Card click → college detail ───────────────────────────────────────────
  const handleCardClick = (item: SearchResultItem) => {
    if (item.collegeSlug) {
      onSelectCollege(item.collegeSlug);
    } else if (item.category === 'colleges') {
      onSelectCollege('mithibai');
    }
    // careers / courses / classes: future detail routes
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <main
      ref={containerRef}
      className="w-full pt-20 sm:pt-24 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{config.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB]">
                {config.title}
              </h1>
              {showResults && (
                <p className="text-sm text-slate-500 dark:text-[#71839A] mt-1">
                  {isViewAll
                    ? `Showing all ${results.length} results`
                    : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
                </p>
              )}
            </div>

            {showResults && (
              <button
                type="button"
                onClick={handleOpenFilter}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#161c27] transition-all whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Modify Filters
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {showResults && activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.param}
                  type="button"
                  onClick={() => removeChip(chip.param)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007DCC]/10 dark:bg-[#007DCC]/20 text-[#007DCC] dark:text-[#86cfff] text-xs font-semibold border border-[#007DCC]/20 dark:border-[#007DCC]/30 hover:bg-[#007DCC]/20 transition-colors"
                >
                  <span>{chip.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Career Roadmap banner (careers only, when showing results) ───── */}
        {category === 'careers' && showResults && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-[#F4F7FB]">
                  Looking for step-by-step career pathways?
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#71839A]">
                  Explore structured Mumbai career roadmaps for CA, BMS, Tech & Design.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/career-roadmap')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#007DCC] text-white text-xs font-bold hover:bg-[#006cb0] transition-colors shrink-0"
            >
              <span>Open Career Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── Results / Empty State ─────────────────────────────────────────── */}
        {!showResults ? (
          /* Empty state — no params, no all=true */
          <div className="py-20 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#007DCC] dark:text-[#86cfff] flex items-center justify-center mx-auto mb-5">
              <IconComp className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-3">
              {config.emptyTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-[#71839A] mb-8 leading-relaxed">
              {config.emptyDesc}
            </p>
            <button
              type="button"
              onClick={handleOpenFilter}
              className="px-6 py-3 rounded-xl bg-[#007DCC] text-white text-sm font-bold hover:bg-[#006cb0] transition-colors inline-flex items-center gap-2 shadow-md shadow-[#007DCC]/20"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{config.filterLabel}</span>
            </button>
          </div>
        ) : results.length === 0 ? (
          /* No matching results after filtering */
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#0D1828] flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10">
              <IconComp className="w-7 h-7 text-slate-400 dark:text-[#71839A]" />
            </div>
            <p className="text-base font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
              No matching results found
            </p>
            <p className="text-xs text-slate-500 dark:text-[#71839A] mb-5">
              Try adjusting your filters or selecting a broader region.
            </p>
            <button
              type="button"
              onClick={handleOpenFilter}
              className="px-5 py-2.5 rounded-xl bg-[#007DCC] text-white text-xs font-bold hover:bg-[#006cb0] transition-colors inline-flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Modify Filters
            </button>
          </div>
        ) : (
          /* Results grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {results.map((item) => {
              const getStreams = (): string[] => {
                if (item.category !== 'colleges' || !item.subtitle) return [];
                const offeredPart = item.subtitle.split('•')[0]
                  .replace(/^Offered:\s*/i, '').trim();
                return offeredPart.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4);
              };
              const streams = getStreams();

              return (
                <article
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1828] hover:bg-slate-50 dark:hover:bg-[#121f33] transition-all duration-200 shadow-sm hover:shadow-md border border-slate-200 dark:border-[#D3B5E8]/12 hover:border-[#007DCC]/50 dark:hover:border-[#D3B5E8]/30 text-left cursor-pointer"
                  data-category={item.category}
                >
                  {/* Top: category type + locality */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${
                          item.tagColor === 'tertiary'
                            ? 'text-emerald-600 dark:text-[#51dcbc]'
                            : item.tagColor === 'secondary'
                            ? 'text-[#007DCC] dark:text-[#86cfff]'
                            : item.tagColor === 'lavender'
                            ? 'text-purple-500 dark:text-[#D3B5E8]'
                            : 'text-[#007DCC] dark:text-[#86cfff]'
                        }`}
                      >
                        {item.badgeCategory}
                      </span>
                      {item.badgeSub && (
                        <span className="text-[10px] text-slate-400 dark:text-[#71839A] truncate">
                          · {item.badgeSub}
                        </span>
                      )}
                    </div>

                    <h2 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-[#F4F7FB] leading-snug tracking-tight group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors line-clamp-2">
                      {item.title}
                    </h2>

                    {(item.category === 'colleges' && streams.length > 0) ? (
                      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-[#71839A] truncate">
                        {streams.join(' · ')}
                      </p>
                    ) : item.subtitle ? (
                      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-[#71839A] truncate">
                        {item.subtitle.replace(/^Specialization:\s*/i, '')}
                      </p>
                    ) : null}
                  </div>

                  {/* Bottom action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#007DCC] dark:text-[#86cfff]">
                      {item.category === 'colleges' ? 'Details'
                        : item.category === 'classes' ? 'View Details'
                        : item.category === 'courses' ? 'Course Info'
                        : item.category === 'careers' ? 'Career Path'
                        : item.actionLabel}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#007DCC] dark:text-[#86cfff] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
