import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, ArrowRight, ArrowLeft, MonitorPlay, SlidersHorizontal, CheckCircle2, MapPin, Phone, Globe } from 'lucide-react';
import { CLASSES, ClassData } from '../data/classes';

interface ClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFiltersToExplore?: (region: string, interest: string) => void;
  onApplyFilters?: (filters: { interest: string; region: string; specialization: string; searchQuery: string }) => void;
  onViewAll?: () => void;
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
}) => {
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

  const setPendingField = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setPending((prev) => ({ ...prev, [key]: value }));
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
  const matchClassRegion = (cls: ClassData, targetRegion: string): boolean => {
    if (targetRegion === 'All Mumbai') return true;
    const text = [cls.region || '', cls.area || '', cls.address || ''].join(' ').toUpperCase();

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
      return text.includes('CHEMBUR') || text.includes('VASHI') || text.includes('BELAPUR') || text.includes('HARBOUR');
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
        cls.streams?.toLowerCase().includes(applied.interest.toLowerCase()) ||
        cls.specializations?.toLowerCase().includes(applied.interest.toLowerCase());

      const matchesRegion = matchClassRegion(cls, applied.region);

      const matchesSpec =
        applied.specialization === 'All Specializations' ||
        cls.specializations?.toLowerCase().includes(applied.specialization.toLowerCase());

      return matchesSearch && matchesInterest && matchesRegion && matchesSpec;
    });
  }, [applied]);

  const displayedClasses = filteredClasses.slice(0, 50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#070D18]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0B1623] border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB]">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
              <MonitorPlay className="w-4.5 h-4.5 text-[#007DCC] dark:text-[#86cfff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Mumbai Coaching Classes</h2>
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
          {/* STEP 1: Stream / Interest */}
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
                    onClick={() => setPendingField('interest', interest)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      pending.interest === interest
                        ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                        : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 hover:border-[#007DCC]/40'
                    }`}
                  >
                    <span className="font-bold text-sm text-slate-900 dark:text-[#F4F7FB]">
                      {interest}
                    </span>
                    {pending.interest === interest && (
                      <CheckCircle2 className="w-5 h-5 text-[#007DCC] dark:text-[#86cfff] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Mumbai Region */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Select Mumbai Region
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Filter coaching classes by your preferred local zone in Mumbai.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MUMBAI_REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setPendingField('region', r)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-all text-left flex flex-col justify-between h-24 ${
                      pending.region === r
                        ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                        : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#007DCC]" />
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Specialization */}
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
                      onClick={() => setPendingField('specialization', tag)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                        pending.specialization === tag
                          ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                          : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Results (Vertical Stacked Result Cards) */}
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
                      setPendingField('searchQuery', e.target.value);
                      setApplied((prev) => ({ ...prev, searchQuery: e.target.value }));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC]"
                  />
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-[#007DCC] dark:text-[#86cfff] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Modify Filters</span>
                </button>
              </div>

              {/* Vertical Stacked Cards */}
              {displayedClasses.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-[#0D1828] border border-slate-200 dark:border-white/10">
                  <p className="text-base font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                    No matching classes found
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#71839A] mb-4">
                    Try selecting All Mumbai or widening your interest filters.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-[#007DCC] text-white text-xs font-bold rounded-xl"
                  >
                    Back to Wizard
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {displayedClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-[#007DCC] dark:text-[#86cfff] text-[10px] font-extrabold uppercase">
                            {cls.streams || 'Coaching'}
                          </span>
                          {(cls.area || cls.region) && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#A9B8CA] text-[10px] font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#007DCC]" />
                              {cls.area || cls.region}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-[#F4F7FB] leading-snug truncate">
                          {cls.name}
                        </h4>

                        {cls.specializations && (
                          <p className="text-xs font-semibold text-[#007DCC] dark:text-[#86cfff] mt-1">
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
                            <Phone className="w-3.5 h-3.5 text-[#007DCC]" />
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
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 dark:border-white/8 flex items-center justify-between bg-slate-50/50 dark:bg-[#0D1828]/50">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#161c27] text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : step === 1 ? (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#161c27] text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Next: Mumbai Region</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Next: Specialization</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <div className="flex items-center gap-2">
              {onViewAll && (
                <button
                  onClick={() => { onViewAll(); onClose(); }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#161c27] text-xs font-bold transition-all"
                >
                  <span>View All Classes</span>
                </button>
              )}
              <button
                onClick={handleApply}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Apply Filters & Find Classes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 4 && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] text-white text-xs font-bold"
            >
              <span>Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
