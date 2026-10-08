import React, { useState, useEffect } from 'react';
import {
  X,
  SlidersHorizontal,
  Search,
  RotateCcw,
  Check,
  Building2,
  GraduationCap,
  TrendingUp,
  MonitorPlay,
  BarChart2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getCategoryAccent } from '../lib/categoryAccents';
import { LOCALITY_ZONES } from '../lib/categoryFilters';

export type DrawerCategoryType = 'colleges' | 'courses' | 'careers' | 'classes' | 'cutoffs';

interface ResultFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: DrawerCategoryType;
  /** Optional active filter overrides if managed externally */
  activeFilters?: Record<string, string>;
  /** Optional callback when filters are applied */
  onApply?: (filters: Record<string, string>) => void;
  /** Optional callback when filters are reset */
  onReset?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Metadata & Filter Configuration
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryMeta {
  title: string;
  badge: string;
  icon: React.ElementType;
  searchPlaceholder: string;
  quickFilterParam: string;
  quickFilterOptions: { label: string; value: string }[];
  discoverySections: {
    id: string;
    label: string;
    desc?: string;
    options: string[];
  }[];
}

const CATEGORY_CONFIGS: Record<DrawerCategoryType, CategoryMeta> = {
  colleges: {
    title: 'Colleges',
    badge: 'Colleges Filter',
    icon: Building2,
    searchPlaceholder: 'Search college name, area, or keyword...',
    quickFilterParam: 'stream',
    quickFilterOptions: [
      { label: 'All', value: 'All Streams' },
      { label: 'Commerce', value: 'Commerce' },
      { label: 'Arts', value: 'Arts' },
      { label: 'Science', value: 'Science' },
      { label: 'BMS', value: 'Management (BMS)' },
    ],
    discoverySections: [
      {
        id: 'region',
        label: 'Mumbai Region',
        desc: 'Select preferred geographical zone in Mumbai',
        options: [
          'All Mumbai',
          'South Mumbai',
          'Western Suburbs',
          'Central Suburbs',
          'Eastern Suburbs',
          'Harbour / Central-East',
        ],
      },
      {
        id: 'stream',
        label: 'Academic Stream & Program',
        desc: 'Filter colleges offering specific study tracks',
        options: [
          'All Streams',
          'Commerce',
          'Arts',
          'Science',
          'Management (BMS)',
          'Finance & Accounting (BAF)',
        ],
      },
    ],
  },

  courses: {
    title: 'Courses',
    badge: 'Courses Filter',
    icon: GraduationCap,
    searchPlaceholder: 'Search degree, course title, or subject...',
    quickFilterParam: 'level',
    quickFilterOptions: [
      { label: 'All Levels', value: 'All Levels' },
      { label: 'Undergraduate', value: 'Undergraduate Degree (B.Com/BMS/BAF)' },
      { label: 'Professional', value: 'Professional Qualification (CA/CS/CMA)' },
      { label: 'Diploma', value: 'Diploma & Certifications' },
    ],
    discoverySections: [
      {
        id: 'stream',
        label: 'Field of Study',
        desc: 'Choose primary academic discipline',
        options: [
          'All Fields',
          'Commerce & Accounting',
          'Management & Leadership',
          'Finance & Markets',
          'Data Science & IT',
        ],
      },
      {
        id: 'level',
        label: 'Qualification Level',
        desc: 'Degree type or professional certification',
        options: [
          'All Levels',
          'Undergraduate Degree (B.Com/BMS/BAF)',
          'Professional Qualification (CA/CS/CMA)',
          'Diploma & Certifications',
        ],
      },
    ],
  },

  careers: {
    title: 'Careers',
    badge: 'Careers Filter',
    icon: TrendingUp,
    searchPlaceholder: 'Search career pathway, job role, or sector...',
    quickFilterParam: 'entryLevel',
    quickFilterOptions: [
      { label: 'All Milestones', value: 'All Milestones' },
      { label: 'Graduate Trainee', value: 'Graduate Trainee / Intern' },
      { label: 'Junior Analyst', value: 'Junior Analyst / Associate' },
      { label: 'Specialist', value: 'Professional Specialist' },
    ],
    discoverySections: [
      {
        id: 'industry',
        label: 'Target Industry / Domain',
        desc: 'Industry sector you aim to enter',
        options: [
          'All Industries',
          'Investment & Equity Research',
          'Corporate Banking & CA',
          'Brand Management & Advertising',
          'Technology & Analytics',
        ],
      },
      {
        id: 'entryLevel',
        label: 'Career Milestone Level',
        desc: 'Experience milestone or career level',
        options: [
          'All Milestones',
          'Graduate Trainee / Intern',
          'Junior Analyst / Associate',
          'Professional Specialist',
        ],
      },
    ],
  },

  classes: {
    title: 'Classes',
    badge: 'Classes Filter',
    icon: MonitorPlay,
    searchPlaceholder: 'Search coaching class name, area, or tutor...',
    quickFilterParam: 'interest',
    quickFilterOptions: [
      { label: 'All', value: 'All Interests' },
      { label: 'Commerce', value: 'Commerce' },
      { label: 'Science', value: 'Science' },
      { label: 'School Tuition', value: 'Class 6 to 10 Tuition' },
    ],
    discoverySections: [
      {
        id: 'interest',
        label: 'Academic Focus / Interest',
        desc: 'Primary subject or examination stream',
        options: [
          'All Interests',
          'Commerce',
          'Science',
          'Coaching Classes',
          'Class 6 to 10 Tuition',
        ],
      },
      {
        id: 'region',
        label: 'Mumbai Region',
        desc: 'Geographical center for coaching',
        options: [
          'All Mumbai',
          'South Mumbai',
          'Western Suburbs',
          'Central Suburbs',
          'Eastern Suburbs',
          'Harbour / Central-East',
        ],
      },
      {
        id: 'specialization',
        label: 'Specialization Tag',
        desc: 'Specific class target or batch',
        options: [
          'All Specializations',
          '11th & 12th',
          'FYJC / SYJC',
          'CA / CS / CMA',
          'Tybcom / Tybms',
          'Economics & Accounts',
        ],
      },
    ],
  },

  cutoffs: {
    title: 'Cutoffs',
    badge: 'Cutoffs Filter',
    icon: BarChart2,
    searchPlaceholder: 'Search college cutoffs, stream, or area...',
    quickFilterParam: 'stream',
    quickFilterOptions: [
      { label: 'All Streams', value: 'All Streams' },
      { label: 'Commerce', value: 'Commerce' },
      { label: 'Science', value: 'Science' },
      { label: 'Arts', value: 'Arts' },
    ],
    discoverySections: [
      {
        id: 'educationLevel',
        label: 'Education Level',
        desc: 'Target admission phase',
        options: [
          'FYJC / 11th',

          'JEE Main / Engineering',
          'Law 3-Year (MH CET)',
          'Law 5-Year (MH CET)',
        ],
      },
      {
        id: 'range',
        label: 'Percentage Range',
        desc: 'Score percentage bracket',
        options: [
          '35–45%',
          '45–55%',
          '55–65%',
          '65–75%',
          '75–85%',
          '85–95%',
          '95–100%',
        ],
      },
      {
        id: 'stream',
        label: 'Stream',
        desc: 'Academic stream for admission',
        options: ['All Streams', 'Arts', 'Commerce', 'Science'],
      },
      {
        id: 'region',
        label: 'Mumbai Region',
        desc: 'College regional boundary',
        options: [
          'All Mumbai',
          'South Mumbai',
          'Western Suburbs',
          'Central Suburbs',
          'Eastern Suburbs',
          'Harbour / Central-East',
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component: ResultFilterDrawer
// ─────────────────────────────────────────────────────────────────────────────

export const ResultFilterDrawer: React.FC<ResultFilterDrawerProps> = ({
  isOpen,
  onClose,
  category,
  activeFilters,
  onApply,
  onReset,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const config = CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.colleges;
  const accent = getCategoryAccent(category);
  const CategoryIcon = config.icon;

  // Local draft state for filters inside the drawer
  const [draftFilters, setDraftFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize draft state when drawer opens or URL params change
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, string> = {};
      if (activeFilters) {
        Object.entries(activeFilters).forEach(([k, v]) => {
          if (v) initial[k] = v;
        });
      } else {
        searchParams.forEach((value, key) => {
          if (value) initial[key] = value;
        });
      }
      setDraftFilters(initial);
      setSearchQuery(initial.query || searchParams.get('query') || '');
    }
  }, [isOpen, searchParams, activeFilters]);

  // Handle keyboard Escape and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle setting a field value
  const handleSelectField = (fieldId: string, value: string) => {
    setDraftFilters((prev) => {
      const next = { ...prev };
      // Toggle or set
      if (value.startsWith('All') || next[fieldId] === value) {
        delete next[fieldId];
      } else {
        next[fieldId] = value;
      }
      return next;
    });
  };

  // Handle Search Input Change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setDraftFilters((prev) => {
      const next = { ...prev };
      if (val.trim()) {
        next.query = val.trim();
      } else {
        delete next.query;
      }
      return next;
    });
  };

  // Handle Reset button
  const handleReset = () => {
    setDraftFilters({});
    setSearchQuery('');
    if (onReset) {
      onReset();
    } else {
      // Retain ?all=true on reset so results page remains loaded cleanly
      const next = new URLSearchParams();
      next.set('all', 'true');
      setSearchParams(next, { replace: true });
    }
    onClose();
  };

  // Handle Apply button
  const handleApply = () => {
    if (onApply) {
      onApply(draftFilters);
    } else {
      // Sync draftFilters to searchParams without altering filtering logic
      const next = new URLSearchParams();
      let hasAnyFilter = false;
      Object.entries(draftFilters).forEach(([key, val]) => {
        if (val && !val.startsWith('All') && key !== 'all') {
          next.set(key, val);
          hasAnyFilter = true;
        }
      });

      if (!hasAnyFilter) {
        next.set('all', 'true');
      }

      setSearchParams(next, { replace: true });
    }
    onClose();
  };

  // Active filter count for badge
  const activeCount = Object.keys(draftFilters).filter(
    (k) => draftFilters[k] && !draftFilters[k].startsWith('All') && k !== 'all'
  ).length;

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="filter-drawer-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Desktop right drawer, Mobile bottom sheet / drawer) */}
      <div className="fixed inset-x-0 bottom-0 max-sm:max-h-[92vh] max-sm:rounded-t-3xl max-sm:border-t sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-[420px] sm:max-w-full sm:rounded-none sm:border-l bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 shadow-2xl flex flex-col z-[110] animate-in slide-in-from-right duration-250 ease-out transition-all">
        
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
        </div>

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div className="px-5 py-4 sm:py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform"
              style={{ background: accent.bgLight, color: accent.color }}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="filter-drawer-title"
                  className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F4F7FB] leading-none"
                >
                  Modify Filters
                </h2>
                {activeCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: accent.ctaBg, color: '#ffffff' }}
                  >
                    {activeCount} active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: accent.chipText }}
                >
                  {config.badge}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F4F7FB] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── DRAWER BODY (SCROLLABLE) ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 text-left">

          {/* ── 1. DIRECT FILTERS SECTION ─────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71839A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: accent.color }} />
                Direct Filters
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Quick lookup
              </span>
            </div>

            {/* Direct Keyword Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-[#71839A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={config.searchPlaceholder}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#070D18] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#71839A] focus:outline-none focus:ring-2 transition-all"
                style={{
                  outlineColor: accent.ring,
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Option Pills */}
            {config.quickFilterOptions && config.quickFilterOptions.length > 0 && (
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-[#71839A] mb-2">
                  Quick categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {config.quickFilterOptions.map((opt) => {
                    const isSelected =
                      draftFilters[config.quickFilterParam] === opt.value ||
                      (!draftFilters[config.quickFilterParam] && opt.value.startsWith('All'));
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectField(config.quickFilterParam, opt.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          isSelected
                            ? 'shadow-xs font-semibold'
                            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-50 dark:hover:bg-white/10'
                        }`}
                        style={
                          isSelected
                            ? {
                                background: accent.bgLight,
                                borderColor: accent.borderLight,
                                color: accent.selectedText,
                              }
                            : undefined
                        }
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── DIVIDER ────────────────────────────────────────────────────── */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-[#0D1828] px-2 text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-600 tracking-wider">
                Discovery Options
              </span>
            </div>
          </div>

          {/* ── 2. EXISTING / DISCOVERY FILTERS SECTION ────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71839A] flex items-center gap-1.5">
                <CategoryIcon className="w-3.5 h-3.5" style={{ color: accent.color }} />
                Discovery Filters
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Category specific
              </span>
            </div>

            {config.discoverySections.map((section) => {
              const currentValue = draftFilters[section.id] || '';
              return (
                <div key={section.id} className="space-y-2.5">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] block">
                      {section.label}
                    </label>
                    {section.desc && (
                      <p className="text-[11px] text-slate-400 dark:text-[#71839A] mt-0.5">
                        {section.desc}
                      </p>
                    )}
                  </div>

                    <div className="flex flex-wrap gap-1.5">
                      {section.options.map((opt) => {
                        const isSelected =
                          currentValue === opt ||
                          (!currentValue && opt.startsWith('All'));
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectField(section.id, opt)}
                            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                              isSelected
                                ? 'shadow-xs font-semibold'
                                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                            style={
                              isSelected
                                ? {
                                    background: accent.bgLight,
                                    borderColor: accent.borderLight,
                                    color: accent.selectedText,
                                  }
                                : undefined
                            }
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {section.id === 'region' && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 space-y-2">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-[#71839A]">
                          Or filter by specific Mumbai locality:
                        </p>
                        <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                          {LOCALITY_ZONES.map((group) => (
                            <div key={group.zone} className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                {group.zone}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {group.localities.map((loc) => {
                                  const isSelected = currentValue === loc;
                                  return (
                                    <button
                                      key={loc}
                                      type="button"
                                      onClick={() => handleSelectField('region', loc)}
                                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                                        isSelected
                                          ? 'shadow-xs font-semibold'
                                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-50 dark:hover:bg-white/10'
                                      }`}
                                      style={
                                        isSelected
                                          ? {
                                              background: accent.bgLight,
                                              borderColor: accent.borderLight,
                                              color: accent.selectedText,
                                            }
                                          : undefined
                                      }
                                    >
                                      {loc}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

        </div>

        {/* ── BOTTOM ACTIONS (RESET + APPLY) ─────────────────────────────────── */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0D1828]/95 backdrop-blur-sm flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-[#A9B8CA] transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-[2] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-sm hover:shadow inline-flex items-center justify-center gap-2 active:scale-98"
            style={{ background: accent.ctaBg }}
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>

      </div>
    </div>
  );
};
