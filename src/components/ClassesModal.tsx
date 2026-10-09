import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Search,
  ArrowRight,
  ArrowLeft,
  MonitorPlay,
  SlidersHorizontal,
  CheckCircle2,
  MapPin,
  Phone,
} from 'lucide-react';
import { CLASSES, ClassData } from '../data/classes';
import { getCategoryAccent } from '../lib/categoryAccents';
import { useTheme } from '../context/ThemeContext';
import { parseMultiValue } from '../lib/categoryFilters';

interface ClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFiltersToExplore?: (region: string, interest: string) => void;
  onApplyFilters?: (filters: {
    interest: string;
    region: string;
    specialization: string;
    searchQuery: string;
  }) => void;
  onViewAll?: () => void;
  onViewClass?: (classData: ClassData) => void;
}

const INTERESTS = [
  'All Interests',
  'Commerce',
  'Science',
  'Coaching Classes',
  'Class 6 to 10 Tuition',
];

const MUMBAI_REGIONS = [
  'All Mumbai',
  'South Mumbai',
  'Western Suburbs',
  'Central Suburbs',
  'Eastern Suburbs',
  'Harbour / Central-East',
];

const SPECIALIZATION_TAGS = [
  'All Specializations',
  '11th & 12th',
  'FYJC / SYJC',
  'CA / CS / CMA',
  'Tybcom / Tybms',
  'Economics & Accounts',
];

interface Filters {
  searchQuery: string;
  interest: string;
  region: string;
  specialization: string;
}

const DEFAULT_FILTERS: Filters = {
  searchQuery: '',
  interest: 'All Interests',
  region: 'All Mumbai',
  specialization: 'All Specializations',
};

export const ClassesModal: React.FC<ClassesModalProps> = ({
  isOpen,
  onClose,
  onApplyFiltersToExplore,
  onApplyFilters,
  onViewAll,
  onViewClass,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = getCategoryAccent('classes');

  const [step, setStep] = useState<number>(1);
  const [pending, setPending] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPending(DEFAULT_FILTERS);
      setApplied(DEFAULT_FILTERS);
    }
  }, [isOpen]);

  const setPendingField = <K extends keyof Filters>(
    key: K,
    value: Filters[K],
  ) => {
    setPending((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSelectRegion = (r: string) => {
    if (r === 'All Mumbai') {
      setPendingField('region', 'All Mumbai');
      return;
    }
    const current = parseMultiValue(pending.region).filter((x) => x !== 'All Mumbai');
    if (current.includes(r)) {
      const remaining = current.filter((x) => x !== r);
      setPendingField('region', remaining.length > 0 ? remaining.join(', ') : 'All Mumbai');
    } else {
      if (current.length < 3) {
        setPendingField('region', [...current, r].join(', '));
      } else {
        setPendingField('region', [...current.slice(1), r].join(', '));
      }
    }
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(pending);
    } else {
      setApplied({ ...pending });
      setStep(4);
    }
  };

  // Helper to map class region / area to Mumbai-only region set
  const matchClassRegion = (
    cls: ClassData,
    targetRegion: string,
  ): boolean => {
    if (targetRegion === 'All Mumbai') return true;

    const text = [
      cls.region || '',
      cls.area || '',
      cls.address || '',
    ]
      .join(' ')
      .toUpperCase();

    if (targetRegion === 'South Mumbai') {
      return (
        text.includes('SOUTH') ||
        text.includes('LOWER PAREL') ||
        text.includes('MAHALAKSHMI') ||
        text.includes('FORT') ||
        text.includes('CHURCHGATE') ||
        text.includes('CHARNI') ||
        text.includes('MUMBAI SOUTH')
      );
    }

    if (targetRegion === 'Western Suburbs') {
      return (
        text.includes('WESTERN') ||
        text.includes('ANDHERI') ||
        text.includes('BANDRA') ||
        text.includes('BORIVALI') ||
        text.includes('PARLE') ||
        text.includes('MALAD') ||
        text.includes('KANDIVALI') ||
        text.includes('GOREGAON') ||
        text.includes('SANTACRUZ')
      );
    }

    if (targetRegion === 'Central Suburbs') {
      return (
        text.includes('CENTRAL') ||
        text.includes('MATUNGA') ||
        text.includes('DADAR') ||
        text.includes('SIES') ||
        text.includes('KURLA') ||
        text.includes('GHATKOPAR')
      );
    }

    if (targetRegion === 'Eastern Suburbs') {
      return (
        text.includes('EASTERN') ||
        text.includes('MULUND') ||
        text.includes('BHANDUP') ||
        text.includes('VIKHROLI')
      );
    }

    if (targetRegion === 'Harbour / Central-East') {
      return (
        text.includes('CHEMBUR') ||
        text.includes('HARBOUR') ||
        text.includes('KURLA') ||
        text.includes('GHATKOPAR')
      );
    }

    return true;
  };

  // Filtered classes list
  const filteredClasses = useMemo(() => {
    return CLASSES.filter((cls) => {
      const q = applied.searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        cls.name.toLowerCase().includes(q) ||
        cls.area?.toLowerCase().includes(q) ||
        cls.specializations?.toLowerCase().includes(q);

      const matchesInterest =
        applied.interest === 'All Interests' ||
        cls.streams
          ?.toLowerCase()
          .includes(applied.interest.toLowerCase()) ||
        cls.specializations
          ?.toLowerCase()
          .includes(applied.interest.toLowerCase());

      const matchesRegion = matchClassRegion(
        cls,
        applied.region,
      );

      const matchesSpec =
        applied.specialization === 'All Specializations' ||
        cls.specializations
          ?.toLowerCase()
          .includes(applied.specialization.toLowerCase());

      return (
        matchesSearch &&
        matchesInterest &&
        matchesRegion &&
        matchesSpec
      );
    });
  }, [applied]);

  const displayedClasses = filteredClasses.slice(0, 50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md transition-opacity"
        style={{
          background: isDark
            ? 'rgba(3, 7, 18, 0.78)'
            : 'rgba(7, 13, 24, 0.65)',
        }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] border shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB] backdrop-blur-xl transition-colors duration-200"
        style={{
          background: isDark
            ? 'rgba(13, 24, 40, 0.96)'
            : 'rgba(255, 255, 255, 0.94)',
          borderColor: isDark
            ? accent.borderDark
            : accent.borderLight,
          boxShadow: isDark
            ? `0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px ${accent.borderDark}`
            : `0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px ${accent.borderLight}`,
        }}
      >
        {/* Header */}
        <div
          className="shrink-0 px-6 py-4 border-b flex items-center justify-between transition-colors duration-200"
          style={{
            background: isDark
              ? accent.bgDark
              : accent.bgLight,
            borderColor: isDark
              ? accent.borderDark
              : accent.borderLight,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : accent.bgDark,
              }}
            >
              <MonitorPlay
                className="w-[18px] h-[18px]"
                style={{
                  color: isDark
                    ? accent.chipTextDark
                    : accent.color,
                }}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-[#F4F7FB]">
                Mumbai Coaching Classes
              </h2>

              <p className="text-xs text-slate-500 dark:text-[#71839A]">
                {step === 1
                  ? 'Step 1 of 3: Select Stream / Interest'
                  : step === 2
                    ? 'Step 2 of 3: Select Mumbai Region'
                    : step === 3
                      ? 'Step 3 of 3: Specialization & Locality'
                      : `Filtered Coaching Classes (${filteredClasses.length})`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:text-[#71839A] dark:hover:text-[#F4F7FB] rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 text-left">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  What are you studying for?
                </h3>

                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Choose your target field or academic interest to find top coaching tutorials in Mumbai.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() =>
                      setPendingField('interest', interest)
                    }
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${pending.interest === interest
                      ? 'text-slate-900 dark:text-[#F4F7FB]'
                      : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                      }`}
                    style={
                      pending.interest === interest
                        ? {
                          background: isDark
                            ? accent.bgDark
                            : accent.bgLight,
                          borderColor: isDark
                            ? accent.colorHover
                            : accent.ring,
                          boxShadow: `0 0 0 1.5px ${isDark
                            ? accent.colorHover
                            : accent.ring
                            }`,
                          color: isDark
                            ? accent.chipTextDark
                            : accent.selectedText,
                        }
                        : undefined
                    }
                  >
                    <span className="font-bold text-sm text-slate-900 dark:text-[#F4F7FB]">
                      {interest}
                    </span>

                    {pending.interest === interest && (
                      <CheckCircle2
                        className="w-5 h-5 shrink-0"
                        style={{
                          color: isDark
                            ? accent.colorHover
                            : accent.color,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                    Select Mumbai Region
                  </h3>
                  <span className="text-xs font-semibold text-[#007DCC] dark:text-[#86cfff]">
                    {parseMultiValue(pending.region).filter((x) => x !== 'All Mumbai').length > 0
                      ? `${parseMultiValue(pending.region).filter((x) => x !== 'All Mumbai').length}/3 selected`
                      : 'Select up to 3'}
                  </span>
                </div>

                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Filter coaching classes by your preferred local zone in Mumbai (select up to 3).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MUMBAI_REGIONS.map((r) => {
                  const selectedRegions = parseMultiValue(pending.region);
                  const isSelected = r === 'All Mumbai'
                    ? (selectedRegions.length === 0 || selectedRegions.includes('All Mumbai'))
                    : selectedRegions.includes(r);
                  return (
                    <button
                      key={r}
                      onClick={() => handleSelectRegion(r)}
                      className={`p-4 rounded-2xl border text-sm font-bold transition-all text-left flex flex-col justify-between h-24 cursor-pointer ${isSelected
                        ? ''
                        : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                        }`}
                      style={
                        isSelected
                          ? {
                            background: isDark
                              ? accent.bgDark
                              : accent.bgLight,
                            borderColor: isDark
                              ? accent.colorHover
                              : accent.ring,
                            boxShadow: `0 0 0 1.5px ${isDark
                              ? accent.colorHover
                              : accent.ring
                              }`,
                            color: isDark
                              ? accent.chipTextDark
                              : accent.selectedText,
                          }
                          : undefined
                      }
                    >
                      <MapPin
                        className="w-4 h-4"
                        style={{
                          color: isDark
                            ? accent.chipTextDark
                            : accent.color,
                        }}
                      />

                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Target Specialization & Courses
                </h3>

                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Refine by specific subject or exam preparation.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-2">
                  Focus Area / Course:
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SPECIALIZATION_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setPendingField(
                          'specialization',
                          tag,
                        )
                      }
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${pending.specialization === tag
                        ? ''
                        : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                        }`}
                      style={
                        pending.specialization === tag
                          ? {
                            background: isDark
                              ? accent.bgDark
                              : accent.bgLight,
                            borderColor: isDark
                              ? accent.colorHover
                              : accent.ring,
                            color: isDark
                              ? accent.chipTextDark
                              : accent.selectedText,
                          }
                          : undefined
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-auto flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search classes by name or locality..."
                    value={pending.searchQuery}
                    onChange={(e) => {
                      setPendingField(
                        'searchQuery',
                        e.target.value,
                      );

                      setApplied((prev) => ({
                        ...prev,
                        searchQuery: e.target.value,
                      }));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#162232] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#0EB89C]"
                  />
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 bg-white dark:bg-[#162232] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-[#0EB89C] dark:text-[#51dcbc] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Modify Filters</span>
                </button>
              </div>

              {/* Results */}
              {displayedClasses.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-[#131F30] border border-slate-200 dark:border-white/10">
                  <p className="text-base font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                    No matching classes found
                  </p>

                  <p className="text-xs text-slate-500 dark:text-[#71839A] mb-4">
                    Try selecting All Mumbai or widening your interest filters.
                  </p>

                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-[#0EB89C] hover:bg-[#0aa088] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Back to Wizard
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {displayedClasses.map((cls) => (
                    <div
                      key={cls.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        onViewClass?.(cls)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' ||
                          e.key === ' '
                        ) {
                          e.preventDefault();
                          onViewClass?.(cls);
                        }
                      }}
                      className="p-5 rounded-2xl bg-white dark:bg-[#131F30] border border-slate-200 dark:border-white/10 hover:border-[#0EB89C]/50 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EB89C]/60"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-[#0EB89C] dark:text-[#51dcbc] text-[10px] font-extrabold uppercase">
                            {cls.streams || 'Coaching'}
                          </span>

                          {(cls.area || cls.region) && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#A9B8CA] text-[10px] font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#0EB89C]" />
                              {cls.area || cls.region}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-[#F4F7FB] leading-snug truncate">
                          {cls.name}
                        </h4>

                        {cls.specializations && (
                          <p className="text-xs font-semibold text-[#0EB89C] dark:text-[#51dcbc] mt-1">
                            Courses: {cls.specializations}
                          </p>
                        )}

                        {cls.address && (
                          <p className="text-xs text-slate-500 dark:text-[#71839A] mt-1 line-clamp-1">
                            {cls.address}
                          </p>
                        )}
                      </div>

                      {cls.contact && (
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#A9B8CA] text-xs font-semibold">
                            <Phone className="w-3.5 h-3.5 text-[#0EB89C]" />
                            {cls.contact}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div
          className="shrink-0 px-6 py-4 border-t flex items-center justify-between transition-colors duration-200"
          style={{
            background: isDark
              ? accent.bgDark
              : accent.bgLight,
            borderColor: isDark
              ? accent.borderDark
              : accent.borderLight,
          }}
        >
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/70 dark:bg-[#162232] text-slate-700 dark:text-[#C5D3E3] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#1c2b3f] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
          ) : step === 1 ? (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/70 dark:bg-[#162232] text-slate-700 dark:text-[#C5D3E3] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#1c2b3f] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <div className="flex items-center gap-2">
              {onViewAll && (
                <button
                  onClick={() => {
                    onViewAll();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/70 dark:bg-[#162232] text-slate-700 dark:text-[#C5D3E3] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#1c2b3f] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">View All Classes</span>
                  <span className="sm:hidden">View All</span>
                </button>
              )}

              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                  style={{
                    background: accent.ctaBg,
                  }}
                >
                  <span className="hidden sm:inline">Next: Mumbai Region</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                  style={{
                    background: accent.ctaBg,
                  }}
                >
                  <span className="hidden sm:inline">Next: Specialization</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                  style={{
                    background: accent.ctaBg,
                  }}
                >
                  <span className="hidden sm:inline">Apply Filters &amp; View</span>
                  <span className="sm:hidden">Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {step === 4 && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer whitespace-nowrap"
              style={{
                background: accent.ctaBg,
              }}
            >
              <span>Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};