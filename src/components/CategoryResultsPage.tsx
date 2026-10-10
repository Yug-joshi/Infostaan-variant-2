import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  GraduationCap,
  TrendingUp,
  MonitorPlay,
  SlidersHorizontal,
  MapPin,
  Compass,
  X,
  Bookmark,
  Users,
  Star,
  Award,
  CheckCircle,
  Info,
  Search
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchResultItem } from '../types';
import { searchInfostaan } from '../lib/searchEngine';
import { matchItemRegion, applyStreamFilter, filterClasses, parseMultiValue } from '../lib/categoryFilters';
import { FilterCategoryType } from './CategoryFilterModal';
import { getCategoryAccent } from '../lib/categoryAccents';
import { ResultFilterDrawer } from './ResultFilterDrawer';

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
  onSaveItem?: (item: SearchResultItem) => void;
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
  value?: string;
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
  onSaveItem,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const config = PAGE_CONFIG[category];
  const IconComp = config.icon;
  const accent = getCategoryAccent(category);

  // ── Read URL params ────────────────────────────────────────────────────────
  const allParam = searchParams.get('all');          // "true" = View All mode
  const query = searchParams.get('query') || '';
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const regionParam = searchParams.get('region');
  const streamParam = searchParams.get('stream');
  const fieldParam = searchParams.get('field');
  const interestParam = searchParams.get('interest');
  const industryParam = searchParams.get('industry');
  const levelParam = searchParams.get('level');
  const specializationParam = searchParams.get('specialization');
  const sortParam = searchParams.get('sort');

  // ── Show results ───────────────────────────────────────────────────────────
  // Default state is always to show results (all results when no filter applied).
  const isViewAll = allParam === 'true';

  // ── Derive active filter chips ─────────────────────────────────────────────
  const activeChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    const add = (label: string | null, param: string) => {
      if (label && !label.startsWith('All')) chips.push({ label, param });
    };
    add(streamParam, 'stream');
    add(fieldParam, 'field');
    add(interestParam, 'interest');
    add(industryParam, 'industry');
    if (regionParam && regionParam !== 'All Mumbai') {
      const regions = parseMultiValue(regionParam);
      regions.forEach((r) => {
        chips.push({ label: r, param: 'region', value: r });
      });
    }
    add(levelParam, 'level');
    add(specializationParam, 'specialization');
    if (query) chips.push({ label: `"${query}"`, param: 'query' });
    return chips;
  }, [streamParam, fieldParam, interestParam, industryParam, regionParam, levelParam, specializationParam, query]);

  // Remove a single active filter chip
  const removeChip = (param: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (param === 'region' && value) {
      const current = parseMultiValue(next.get('region'));
      const remaining = current.filter((r) => r !== value);
      if (remaining.length > 0) {
        next.set('region', remaining.join(', '));
      } else {
        next.delete('region');
      }
    } else {
      next.delete(param);
    }
    setSearchParams(next, { replace: true });
  };

  // ── Compute filtered results ───────────────────────────────────────────────
  const results: SearchResultItem[] = useMemo(() => {
    let raw: SearchResultItem[] = [];

    if (category === 'classes') {
      // Classes use their own dataset — not the search engine
      const trimmedQuery = query ? query.trim() : null;
      const filtered = filterClasses({
        interest: interestParam || null,
        region: regionParam || null,
        specialization: specializationParam || null,
        query: trimmedQuery,
      });
      // Map ClassData → SearchResultItem shape
      raw = filtered.slice(0, 200).map((cls) => ({
        id: cls.id,
        slug: cls.slug,
        category: 'classes' as const,
        badgeCategory: 'Coaching Class',
        badgeSub: cls.area || cls.region || 'Mumbai',
        title: cls.name,
        subtitle: cls.specializations
          ? `Specialization: ${cls.specializations}`
          : 'Coaching & Classes',
        meta: [cls.streams || 'All Streams'],
        whyRelevant: 'Coaching class in Mumbai',
        tagColor: 'lavender' as const,
        actionLabel: 'View Details',
      }));
    } else {
      // colleges / courses / careers — use searchInfostaan, then apply shared filters
      raw = searchInfostaan(query, category);

      if (regionParam && regionParam !== 'All Mumbai') {
        raw = raw.filter((item) => matchItemRegion(item, regionParam));
      }
      const streamFilter =
        streamParam || fieldParam || interestParam || industryParam || specializationParam;
      raw = applyStreamFilter(raw, streamFilter);
    }

    let finalResults = raw;

    // -- Sorting logic --
    if (sortParam) {
      if (sortParam === 'distance_asc' && (category === 'classes' || category === 'colleges')) {
        finalResults.sort((a, b) => (a.badgeSub?.length || 0) - (b.badgeSub?.length || 0));
      } else if (sortParam === 'distance_desc' && (category === 'classes' || category === 'colleges')) {
        finalResults.sort((a, b) => (b.badgeSub?.length || 0) - (a.badgeSub?.length || 0));
      } else if (sortParam === 'cutoff_desc' && category === 'colleges') {
        const getCutoffNum = (item: SearchResultItem): number => {
          const m = item.subtitle?.match(/(\d+(\.\d+)?)\s*%/);
          return m ? parseFloat(m[1]) : 0;
        };
        finalResults.sort((a, b) => getCutoffNum(b) - getCutoffNum(a) || a.title.localeCompare(b.title));
      } else if (sortParam === 'cutoff_asc' && category === 'colleges') {
        const getCutoffNum = (item: SearchResultItem): number => {
          const m = item.subtitle?.match(/(\d+(\.\d+)?)\s*%/);
          return m ? parseFloat(m[1]) : 0;
        };
        finalResults.sort((a, b) => getCutoffNum(a) - getCutoffNum(b) || a.title.localeCompare(b.title));
      }
    }

    return finalResults;
  }, [
    category, query, regionParam,
    streamParam, fieldParam, interestParam, industryParam,
    levelParam, specializationParam, sortParam
  ]);

  const ITEMS_PER_PAGE = 16;
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (newPage <= 1) {
      next.delete('page');
    } else {
      next.set('page', newPage.toString());
    }
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset pagination when filters change (delete page param if present)
  useEffect(() => {
    if (searchParams.has('page')) {
      const next = new URLSearchParams(searchParams);
      next.delete('page');
      setSearchParams(next, { replace: true });
    }
  }, [category, query, regionParam, streamParam, fieldParam, interestParam, industryParam, levelParam, specializationParam, sortParam]);

  const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return results.slice(start, start + ITEMS_PER_PAGE);
  }, [results, safePage]);

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
    } else if (item.collegeId) {
      onSelectCollege(item.collegeId);
    } else if (item.category === 'colleges' || item.category === 'cutoffs') {
      // Fallback: generate a slug from the title
      const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      onSelectCollege(slug || 'mithibai');
    } else if (item.category === 'classes' && item.slug) {
      navigate(`/class/${item.slug}`);
    } else if (item.category === 'careers') {
      navigate('/career-roadmap');
    }
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
        <div className="flex flex-col gap-4 mb-6 sm:mb-8 text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                style={{
                  background: accent.chipBgLight,
                  color: accent.chipText,
                }}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{config.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] break-words">
                {config.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-[#71839A] mt-1">
                {activeChips.length === 0
                  ? `Showing all ${results.length} results`
                  : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start sm:self-auto w-full sm:w-auto">
                <div className="relative flex items-center w-full sm:w-[250px] bg-white dark:bg-[#0D1828] rounded-xl px-3 py-2.5 shadow-sm border border-slate-300 dark:border-white/10 focus-within:border-[#007DCC] focus-within:ring-1 focus-within:ring-[#007DCC]">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const next = new URLSearchParams(searchParams);
                        if (inputValue.trim()) {
                          next.set('query', inputValue.trim());
                          next.delete('all');
                        } else {
                          next.delete('query');
                        }
                        setSearchParams(next, { replace: true });
                      }
                    }}
                    placeholder={`Search ${category}...`}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-[#F4F7FB] focus:outline-none placeholder:text-slate-400"
                  />
                  {inputValue && (
                    <button
                      onClick={() => {
                        setInputValue('');
                        const next = new URLSearchParams(searchParams);
                        next.delete('query');
                        setSearchParams(next, { replace: true });
                      }}
                      className="ml-2 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {(category === 'classes' || category === 'colleges') && (
                  <select
                    className="px-3 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-300 dark:border-white/10 focus:outline-none focus:border-[#007DCC] cursor-pointer"
                    value={sortParam || 'default'}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = new URLSearchParams(searchParams);
                      if (val.includes('distance')) {
                        const loc = window.prompt("Enter your current Mumbai location (e.g., Borivali) to calculate distance:");
                        if (loc) {
                          next.set('sort', val);
                          next.set('userLoc', loc);
                          setSearchParams(next, { replace: true });
                        } else {
                          // Reset if cancelled
                          e.target.value = sortParam || 'default';
                        }
                      } else if (val === 'default') {
                        next.delete('sort');
                        next.delete('userLoc');
                        setSearchParams(next, { replace: true });
                      } else {
                        next.set('sort', val);
                        setSearchParams(next, { replace: true });
                      }
                    }}
                  >
                    <option value="default">Sort: Recommended</option>
                    {category === 'colleges' && (
                      <>
                        <option value="cutoff_desc">Percentage: High to Low</option>
                        <option value="cutoff_asc">Percentage: Low to High</option>
                      </>
                    )}
                    {(category === 'classes' || category === 'colleges') && (
                      <>
                        <option value="distance_asc">Distance: Low to High</option>
                        <option value="distance_desc">Distance: High to Low</option>
                      </>
                    )}
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#161c27] transition-all whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Modify Filters
                </button>
              </div>
            </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <button
                  key={`${chip.param}-${chip.value || chip.label}`}
                  type="button"
                  onClick={() => removeChip(chip.param, chip.value)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 max-w-full rounded-full text-xs font-semibold border transition-colors text-left"
                  style={{
                    background: accent.chipBgLight,
                    color: accent.chipText,
                    borderColor: accent.borderLight,
                  }}
                >
                  <span className="min-w-0 break-words">{chip.label}</span>
                  <X className="w-3 h-3 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Career Roadmap banner (careers only) ───── */}
        {category === 'careers' && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ background: accent.bgLight, color: accent.color }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div className="min-w-0">
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
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-white text-xs font-bold transition-colors shrink-0 self-start sm:self-auto"
              style={{ background: accent.ctaBg }}
            >
              <span>Open Career Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar + Results */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative w-full">
          {/* Desktop Sidebar Filter (Permanent) */}
          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-28 z-20 h-[calc(100vh-8rem)]">
            <ResultFilterDrawer
              isOpen={true}
              inline={true}
              onClose={() => { }}
              category={category}
            />
          </aside>

          {/* Results Container */}
          <div className="flex-1 w-full min-w-0">
            {results.length === 0 ? (
              /* No matching results after filtering */
              <div className="w-full py-12 sm:py-16 text-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#0D1828] flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10">
                  <IconComp className="w-7 h-7 text-slate-400 dark:text-[#71839A]" />
                </div>
                <p className="text-base font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
                  No matching results found
                </p>
                <p className="text-xs text-slate-500 dark:text-[#71839A] mb-5">
                  Try adjusting your filters or selecting a broader region.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams(new URLSearchParams(), { replace: true });
                    }}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-xs font-bold transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="px-5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
                    style={{ background: accent.ctaBg }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Modify Filters
                  </button>
                </div>
              </div>
            ) : (
              /* Results grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {paginatedResults.map((item) => {
                  const getStreams = (): string[] => {
                    if (item.category === 'colleges' && item.subtitle) {
                      const offeredPart = item.subtitle.split('•')[0]
                        .replace(/^Offered:\s*/i, '').trim();
                      return offeredPart.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4);
                    }
                    if (item.category === 'careers' && item.meta) {
                      return item.meta.slice(0, 3);
                    }
                    if (item.category === 'courses' && item.meta) {
                      return item.meta.slice(0, 3);
                    }
                    if (item.category === 'classes' && item.meta) {
                      return item.meta;
                    }
                    return [];
                  };
                  const streams = getStreams();

                  if (item.category === 'colleges' || item.category === 'classes' || item.category === 'courses' || item.category === 'careers') {
                    const isCollege = item.category === 'colleges';
                    const isCourse = item.category === 'courses';
                    const isCareer = item.category === 'careers';
                    const facts: { icon: any; value: string; label: string }[] = [];
                    if (isCareer) {
                      if (item.meta && item.meta[0]) {
                        facts.push({ icon: Award, value: item.meta[0], label: 'Level' });
                      }
                      if (item.meta && item.meta[1]) {
                        facts.push({ icon: TrendingUp, value: item.meta[1], label: 'Sector' });
                      }
                    } else {
                      item.meta.forEach(m => {
                        if (item.category === 'classes' || item.category === 'colleges') return; // Classes and Colleges don't use facts
                        const lower = m.toLowerCase();
                        if (lower.includes('autonomous') || lower.includes('university')) {
                          facts.push({ icon: Building2, value: m.split('•')[0].trim(), label: 'Status' });
                        } else if (lower.includes('naac') || lower.includes('grade')) {
                          facts.push({ icon: Star, value: m.split('•').find(p => p.toLowerCase().includes('naac') || p.toLowerCase().includes('grade'))?.trim() || m, label: 'Rating' });
                        } else if (lower.includes('student') || lower.includes('batch')) {
                          facts.push({ icon: Users, value: m, label: 'Students' });
                        } else if (lower.includes('year') || lower.includes('exp')) {
                          facts.push({ icon: Award, value: m, label: 'Experience' });
                        } else {
                          facts.push({ icon: CheckCircle, value: m, label: isCollege ? 'Info' : 'Feature' });
                        }
                      });
                    }

                    // Decorative header icon (replaces the previous remote images, which returned 404)
                    const HeaderIcon = isCollege ? Building2 : isCourse ? GraduationCap : isCareer ? TrendingUp : MonitorPlay;

                    // Mirrors handleCardClick targets so cards without a destination don't look clickable
                    const isClickable = !!(
                      item.collegeSlug ||
                      item.collegeId ||
                      item.category === 'colleges' ||
                      (item.category === 'classes' && item.slug) ||
                      item.category === 'careers'
                    );

                    return (
                      <article
                        key={item.id}
                        className={`result-card-anim group flex flex-col p-0 min-w-0 rounded-2xl bg-white dark:bg-[#0D1828] transition-all duration-200 shadow-sm border border-slate-200 dark:border-[#D3B5E8]/12 text-left relative ${isClickable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-[#121f33] hover:shadow-md hover:border-[#007DCC]/50 dark:hover:border-[#007DCC]/50' : ''}`}
                        data-category={item.category}
                        onClick={isClickable ? () => handleCardClick(item) : undefined}
                      >
                        {/* HEADER (gradient + category icon) */}
                        <div className="relative w-full h-[120px] sm:h-[160px] rounded-t-[15px] bg-gradient-to-br from-[#091540] via-[#0B3366] to-[#007DCC] shrink-0 flex items-start justify-between gap-2 p-3 sm:p-4 overflow-hidden">
                          <HeaderIcon
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-2 -bottom-2 w-20 h-20 sm:w-28 sm:h-28 text-white/10"
                          />

                          {/* BADGE */}
                          <span className="relative min-w-0 px-2 py-1 rounded bg-[#007DCC] border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider leading-snug break-words shadow-sm">
                            {item.badgeCategory || (isCollege ? 'COLLEGE' : isCourse ? 'COURSE' : isCareer ? 'CAREER' : 'CLASS')}
                          </span>

                          {/* SAVE BUTTON */}
                          <button
                            type="button"
                            aria-label="Save"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSaveItem) onSaveItem(item);
                            }}
                            className="relative shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors border border-white/20"
                          >
                            <Bookmark className={`w-4 h-4 ${savedItemIds?.includes(item.id) ? 'fill-[#19A7E8] text-[#19A7E8]' : 'text-white'}`} />
                          </button>
                        </div>

                        {/* CONTENT */}
                        <div className="p-3 sm:p-4 flex flex-col flex-grow min-w-0">

                          {/* TITLE & LOCATION */}
                          <div className="mb-2 min-w-0 flex flex-col gap-1">
                            <h2 className={`text-[13px] sm:text-[14px] font-bold text-slate-900 dark:text-[#F4F7FB] leading-snug break-words ${isClickable ? 'group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors' : ''}`}>
                              {item.title}
                            </h2>

                            <div className="flex items-start gap-1 text-slate-500 dark:text-[#A9B8CA] min-w-0">
                              <MapPin className="w-3.5 h-3.5 shrink-0 mt-[2px] text-slate-400 dark:text-[#71839A]" />
                              <span className="min-w-0 text-xs leading-snug break-words font-medium">
                                {item.badgeSub || 'Mumbai'}
                              </span>
                            </div>

                            {isCollege && item.subtitle?.includes('Cutoff:') && (
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                <span className="text-sm font-extrabold text-[#007DCC] dark:text-[#86cfff] bg-[#007DCC]/10 dark:bg-[#86cfff]/10 px-2 py-0.5 rounded-md">
                                  {item.subtitle.split('Cutoff:')[1].trim()}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-[#A9B8CA] uppercase tracking-wide">
                                  FYJC Cutoff
                                </span>
                              </div>
                            )}
                          </div>

                          {/* DESKTOP ONLY: TAGS & FACTS */}
                          <div className="hidden sm:flex flex-col flex-grow min-w-0">
                            {streams.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 mb-3 min-w-0">
                                {streams.slice(0, 2).map((stream, idx) => (
                                  <span key={idx} className="max-w-full px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#162133] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-[#A9B8CA] text-[11px] leading-snug font-medium break-words">
                                    {stream}
                                  </span>
                                ))}
                              </div>
                            )}

                            {facts.length > 0 && (
                              <div className="mt-auto flex items-stretch bg-slate-50 dark:bg-[#121E30] rounded-xl p-2 border border-slate-200 dark:border-white/5 mb-3 min-w-0">
                                {facts.slice(0, 2).map((fact, idx) => {
                                  const FactIcon = fact.icon;
                                  return (
                                    <div key={idx} className="flex-1 flex flex-col items-center justify-center text-center px-1 border-r border-slate-200 dark:border-white/5 last:border-0 min-w-0">
                                      <FactIcon className="w-3.5 h-3.5 text-[#19A7E8] shrink-0 mb-1" />
                                      <span className="w-full text-slate-800 dark:text-[#F4F7FB] font-semibold text-xs leading-snug break-words">{fact.value}</span>
                                      <span className="w-full text-[10px] text-slate-500 dark:text-[#71839A] mt-0.5 leading-snug break-words">{fact.label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <div className={`${facts.length === 0 ? 'mt-auto' : ''}`} />
                          </div>

                          {/* MOBILE ONLY: CATEGORY SPECIFIC CONTENT */}
                          <div className="flex sm:hidden flex-col flex-grow min-w-0 gap-1.5 mb-2 mt-auto text-xs text-slate-600 dark:text-[#A9B8CA] font-medium leading-snug">
                            {isCollege && (
                              <div>
                                <span className="text-slate-400 font-normal">Cutoff:</span>{' '}
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  {item.subtitle?.includes('Cutoff:') ? item.subtitle.split('Cutoff:')[1].trim() : 'Check Details'}
                                </span>
                              </div>
                            )}
                            {isCourse && (
                              <>
                                <div><span className="text-slate-400 font-normal">Stream:</span> {streams[0] || 'General'}</div>
                                <div>
                                  <span className="text-slate-400 font-normal">Fees:</span> {
                                    item.subtitle?.includes('₹')
                                      ? item.subtitle.split('•').find((p: string) => p.includes('₹'))?.replace('Approx.', '').trim()
                                      : 'View Details'
                                  }
                                </div>
                              </>
                            )}
                            {isCareer && (
                              <>
                                <div><span className="text-slate-400 font-normal">Industry:</span> {streams[0] || 'General'}</div>
                                {item.meta?.[0] && <div><span className="text-slate-400 font-normal">Level:</span> {item.meta[0]}</div>}
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  }

                  return (
                    <article
                      key={item.id}
                      onClick={() => handleCardClick(item)}
                      className="group flex flex-col justify-between p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0D1828] hover:bg-slate-50 dark:hover:bg-[#121f33] transition-all duration-200 shadow-sm hover:shadow-md border border-slate-200 dark:border-[#D3B5E8]/12 hover:border-[#007DCC]/50 dark:hover:border-[#D3B5E8]/30 text-left cursor-pointer min-w-0"
                      data-category={item.category}
                    >
                      {/* Top: category type + locality */}
                      <div className="mb-2 min-w-0 flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 min-w-0">
                          <span
                            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${item.tagColor === 'tertiary'
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
                            <span className="min-w-0 text-[10px] sm:text-[11px] text-slate-400 dark:text-[#71839A] break-words">
                              · {item.badgeSub}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-[#F4F7FB] leading-snug tracking-tight group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors break-words">
                          {item.title}
                        </h2>

                        {item.subtitle ? (
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#71839A] break-words">
                            {item.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 mb-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#A9B8CA] hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5 mx-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Simple windowing: show first, last, and +/- 1 around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= safePage - 1 && page <= safePage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${safePage === page
                              ? 'bg-[#007DCC] text-white shadow-sm'
                              : 'bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === safePage - 2 || page === safePage + 2) {
                      return <span key={page} className="text-slate-400 dark:text-[#71839A] px-1">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#A9B8CA] hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result Page Filter Drawer Shell */}
      <ResultFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        category={category}
      />
    </main>
  );
};
