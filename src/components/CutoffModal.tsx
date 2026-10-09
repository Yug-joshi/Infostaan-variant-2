import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, ArrowRight, ArrowLeft, Activity, SlidersHorizontal, GraduationCap, CheckCircle2, MapPin, Building2, BookOpen } from 'lucide-react';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
import { PercentageScale } from './PercentageScale';
import { getCategoryAccent } from '../lib/categoryAccents';
import { useTheme } from '../context/ThemeContext';

interface CutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCollege: (id: string) => void;
  onApplyFilters?: (filters: { educationLevel: string; selectedRangeId: string | null; percentageExact: string; stream: string; region: string; searchQuery: string }) => void;
  onViewAll?: () => void;
}

// Education levels supported by the current dataset
const EDUCATION_LEVELS = [
  { id: 'fyjc', label: 'FYJC / 11th', hasData: true, desc: 'First Year Junior College (11th admission) cutoffs across Mumbai' },

  { id: 'jee', label: 'JEE Main / Engineering', hasData: false, desc: 'Engineering degree admission cutoffs (Data Coming Soon)' },
  { id: 'law3', label: 'Law 3-Year (MH CET)', hasData: false, desc: 'LLB 3-Year degree cutoffs (Data Coming Soon)' },
  { id: 'law5', label: 'Law 5-Year (MH CET)', hasData: false, desc: 'Integrated LLB 5-Year cutoffs (Data Coming Soon)' },
];

const STREAMS = ['All Streams', 'Arts', 'Commerce', 'Science'];

const MUMBAI_REGIONS = [
  'All Mumbai',
  'South Mumbai',
  'Western Suburbs',
  'Central Suburbs',
  'Eastern Suburbs',
  'Harbour / Central-East',
];

interface PercentageRangeOption {
  id: string;
  label: string;
  min: number;
  max: number;
}

const PERCENTAGE_RANGES: PercentageRangeOption[] = [
  { id: '35-45', label: '35–45%', min: 35, max: 45 },
  { id: '45-55', label: '45–55%', min: 45, max: 55 },
  { id: '55-65', label: '55–65%', min: 55, max: 65 },
  { id: '65-75', label: '65–75%', min: 65, max: 75 },
  { id: '75-85', label: '75–85%', min: 75, max: 85 },
  { id: '85-95', label: '85–95%', min: 85, max: 95 },
  { id: '95-100', label: '95–100%', min: 95, max: 100 },
];

interface Filters {
  searchQuery: string;
  educationLevel: string;
  stream: string;
  region: string;
  selectedRangeId: string | null;
  percentageExact: string;
}

const DEFAULT_FILTERS: Filters = {
  searchQuery: '',
  educationLevel: 'fyjc',
  stream: 'All Streams',
  region: 'All Mumbai',
  selectedRangeId: '75-85',
  percentageExact: '85',
};

export const CutoffModal: React.FC<CutoffModalProps> = ({
  isOpen,
  onClose,
  onSelectCollege,
  onApplyFilters,
  onViewAll,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = getCategoryAccent('cutoffs');
  // Wizard Step: 1 = Education Level, 2 = Stream, 3 = Percentage Range / Dial, 4 = Mumbai Region, 5 = Results
  const [step, setStep] = useState<number>(1);
  const [pending, setPending] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('Highest cutoff');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset wizard when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPending(DEFAULT_FILTERS);
      setApplied(DEFAULT_FILTERS);
      setSortBy('Highest cutoff');
    }
  }, [isOpen]);

  const setPendingField = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setPending((prev) => ({ ...prev, [key]: value }));
  };

  const dialValue = parseFloat(pending.percentageExact) || 85;

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(pending);
    } else {
      setApplied({ ...pending });
      setStep(5);
    }
  };

  // Region mapper for cutoff records
  const getCollegeRegion = (collegeName: string): string => {
    const name = collegeName.toUpperCase();
    if (
      name.includes("XAVIER") ||
      name.includes("H.R.") ||
      name.includes("JAI HIND") ||
      name.includes("HINDUJA") ||
      name.includes("FORT") ||
      name.includes("CHURCHGATE") ||
      name.includes("CHARNI ROAD") ||
      name.includes("MARINE") ||
      name.includes("SYDENHAM") ||
      name.includes("ELPHINSTONE") ||
      name.includes("WILSON")
    ) {
      return 'South Mumbai';
    }
    if (
      name.includes("MITHIBAI") ||
      name.includes("N.M.") ||
      name.includes("NARSEE") ||
      name.includes("SVKM") ||
      name.includes("ANDHERI") ||
      name.includes("PARLE") ||
      name.includes("MALAD") ||
      name.includes("BORIVALI") ||
      name.includes("BANDRA") ||
      name.includes("KANDIVALI") ||
      name.includes("GOREGAON") ||
      name.includes("SANTACRUZ") ||
      name.includes("BHAVAN")
    ) {
      return 'Western Suburbs';
    }
    if (
      name.includes("PODAR") ||
      name.includes("MATUNGA") ||
      name.includes("DADAR") ||
      name.includes("SIES") ||
      name.includes("RUPAREL") ||
      name.includes("KHALSA") ||
      name.includes("VIDYALANKAR")
    ) {
      return 'Central Suburbs';
    }
    if (
      name.includes("GHATKOPAR") ||
      name.includes("MULUND") ||
      name.includes("BHANDUP") ||
      name.includes("VIKHROLI") ||
      name.includes("SOMAIYA")
    ) {
      return 'Eastern Suburbs';
    }
    if (name.includes("CHEMBUR") || name.includes("VASHI") || name.includes("BELAPUR")) {
      return 'Harbour / Central-East';
    }
    return 'All Mumbai';
  };

  // Filter colleges based on APPLIED filters
  const filteredColleges = useMemo(() => {
    if (applied.educationLevel !== 'fyjc' && applied.educationLevel !== '12th') return [];

    let result = FYJC_CUTOFFS.filter((c) => {
      const q = applied.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.collegeName.toLowerCase().includes(q) ||
        c.stream.toLowerCase().includes(q);

      const matchesStream =
        applied.stream === 'All Streams' || c.stream === applied.stream;

      const collegeRegion = getCollegeRegion(c.collegeName);
      const matchesRegion =
        applied.region === 'All Mumbai' ||
        collegeRegion === applied.region;

      // Range filtering takes precedence if a range is selected
      let matchesPct = true;
      if (applied.selectedRangeId) {
        const range = PERCENTAGE_RANGES.find((r) => r.id === applied.selectedRangeId);
        if (range) {
          matchesPct = c.cutoff >= range.min && c.cutoff <= range.max;
        }
      } else {
        const userPct = parseFloat(applied.percentageExact);
        if (!isNaN(userPct)) {
          matchesPct = c.cutoff <= userPct;
        }
      }

      return matchesSearch && matchesStream && matchesRegion && matchesPct;
    });

    if (sortBy === 'Highest cutoff') {
      result = [...result].sort((a, b) => b.cutoff - a.cutoff);
    } else {
      result = [...result].sort((a, b) => a.cutoff - b.cutoff);
    }

    return result;
  }, [applied, sortBy]);

  const displayedColleges = filteredColleges.slice(0, 60);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md transition-opacity"
        style={{ background: isDark ? 'rgba(3, 7, 18, 0.78)' : 'rgba(7, 13, 24, 0.65)' }}
        onClick={onClose}
      />

      {/* Modal Container — glass shell */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] border shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB] backdrop-blur-xl transition-colors duration-200"
        style={{
          background: isDark ? 'rgba(13, 24, 40, 0.96)' : 'rgba(255, 255, 255, 0.94)',
          borderColor: isDark ? accent.borderDark : accent.borderLight,
          boxShadow: isDark
            ? `0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px ${accent.borderDark}`
            : `0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px ${accent.borderLight}`,
        }}
      >
        {/* Header — accent tinted band */}
        <div
          className="shrink-0 px-6 py-4 border-b flex items-center justify-between transition-colors duration-200"
          style={{
            background: isDark ? accent.bgDark : accent.bgLight,
            borderColor: isDark ? accent.borderDark : accent.borderLight,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isDark ? 'rgba(255, 255, 255, 0.08)' : accent.bgDark }}
            >
              <Activity className="w-[18px] h-[18px]" style={{ color: isDark ? accent.chipTextDark : accent.color }} />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-[#F4F7FB]">Mumbai Cutoff Explorer</h2>
              <p className="text-xs text-slate-500 dark:text-[#71839A]">
                {step === 1
                  ? 'Step 1 of 4: Select Education Level'
                  : step === 2
                  ? 'Step 2 of 4: Select Stream'
                  : step === 3
                  ? 'Step 3 of 4: Cutoff Percentage Range'
                  : step === 4
                  ? 'Step 4 of 4: Mumbai Region Filter'
                  : `Eligible Colleges (${filteredColleges.length})`}
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
          {/* STEP 1: Education Level */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Select Education Level
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Choose your target qualification level to check cutoff trends across Mumbai.
                </p>
              </div>

              <div className="space-y-3">
                {EDUCATION_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setPendingField('educationLevel', level.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      pending.educationLevel === level.id
                        ? 'text-slate-900 dark:text-[#F4F7FB]'
                        : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                    }`}
                    style={pending.educationLevel === level.id ? {
                      background: isDark ? accent.bgDark : accent.bgLight,
                      borderColor: isDark ? accent.colorHover : accent.ring,
                      boxShadow: `0 0 0 1.5px ${isDark ? accent.colorHover : accent.ring}`,
                    } : undefined}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-[#F4F7FB]">
                          {level.label}
                        </span>
                        {!level.hasData && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Data Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#71839A] mt-1">
                        {level.desc}
                      </p>
                    </div>

                    {pending.educationLevel === level.id && (
                      <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: isDark ? accent.colorHover : accent.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Stream Selection */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Select Stream
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Filter cutoffs by your preferred junior college academic stream.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STREAMS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPendingField('stream', s)}
                    className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${
                      pending.stream === s
                        ? 'text-slate-900 dark:text-[#F4F7FB]'
                        : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                    }`}
                    style={pending.stream === s ? {
                      background: isDark ? accent.bgDark : accent.bgLight,
                      borderColor: isDark ? accent.colorHover : accent.ring,
                      boxShadow: `0 0 0 1.5px ${isDark ? accent.colorHover : accent.ring}`,
                    } : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: pending.stream === s
                            ? (isDark ? accent.colorHover : accent.color)
                            : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                          color: pending.stream === s ? '#ffffff' : (isDark ? '#C5D3E3' : '#475569'),
                        }}
                      >
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-base text-slate-900 dark:text-[#F4F7FB]">
                        {s}
                      </span>
                    </div>

                    {pending.stream === s && (
                      <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: isDark ? accent.colorHover : accent.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Percentage Range Filter */}
          {step === 3 && (
            <div className="max-w-xl mx-auto space-y-4 text-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                  Select Cutoff Percentage Range
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#71839A]">
                  Pick a target range or adjust your exact percentage to view eligible colleges.
                </p>
              </div>

              {/* Quick Select Ranges */}
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#A9B8CA] mb-2 text-left">
                  Quick select:
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 sm:gap-2">
                  {PERCENTAGE_RANGES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setPendingField('selectedRangeId', r.id);
                        setPendingField('percentageExact', String(r.max));
                      }}
                      className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        pending.selectedRangeId === r.id
                          ? ''
                          : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                      }`}
                      style={pending.selectedRangeId === r.id ? {
                        background: isDark ? accent.bgDark : accent.bgLight,
                        borderColor: isDark ? accent.colorHover : accent.ring,
                        boxShadow: `0 0 0 1.5px ${isDark ? accent.colorHover : accent.ring}`,
                        color: isDark ? accent.chipTextDark : accent.selectedText,
                      } : undefined}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizontal Percentage Selector Component */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                <PercentageScale
                  value={dialValue}
                  onChange={(val) => {
                    setPendingField('percentageExact', String(val));
                    const matched = PERCENTAGE_RANGES.find(r => val >= r.min && val <= r.max);
                    setPendingField('selectedRangeId', matched ? matched.id : null);
                  }}
                />

                {/* Exact Percentage Input */}
                <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-500 dark:text-[#A9B8CA]">
                    Or enter your percentage:
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={pending.percentageExact}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setPendingField('percentageExact', raw);
                        const val = parseFloat(raw);
                        if (!isNaN(val)) {
                          const matched = PERCENTAGE_RANGES.find(r => val >= r.min && val <= r.max);
                          setPendingField('selectedRangeId', matched ? matched.id : null);
                        }
                      }}
                      className="w-20 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#162232] border border-slate-300 dark:border-white/10 font-bold text-sm text-center text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#0B9EC4]"
                    />
                    <span className="font-bold text-sm text-slate-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Mumbai Region */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Mumbai Region
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Filter cutoffs by target Mumbai region.
                </p>
              </div>

              <div className="space-y-6">

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: isDark ? accent.chipTextDark : accent.color }} />
                    <span>Mumbai Region</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {MUMBAI_REGIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setPendingField('region', r)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                          pending.region === r
                            ? ''
                            : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                        }`}
                        style={pending.region === r ? {
                          background: isDark ? accent.bgDark : accent.bgLight,
                          borderColor: isDark ? accent.colorHover : accent.ring,
                          color: isDark ? accent.chipTextDark : accent.selectedText,
                        } : undefined}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Cutoffs Results List (Vertical Stacked Cards) */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Search & Sort Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-auto flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search college by name..."
                    value={pending.searchQuery}
                    onChange={(e) => {
                      setPendingField('searchQuery', e.target.value);
                      setApplied((prev) => ({ ...prev, searchQuery: e.target.value }));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#162232] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#0B9EC4]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-[#162232] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-semibold text-slate-700 dark:text-[#A9B8CA] focus:outline-none"
                  >
                    <option value="Highest cutoff">Sort: Highest Cutoff First</option>
                    <option value="Lowest cutoff">Sort: Lowest Cutoff First</option>
                  </select>

                  <button
                    onClick={() => setStep(4)}
                    className="px-4 py-2.5 bg-white dark:bg-[#162232] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-[#0B9EC4] dark:text-[#62d6f5] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Modify Filters</span>
                  </button>
                </div>
              </div>

              {/* Vertical Stacked Result Cards */}
              {displayedColleges.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-[#131F30] border border-slate-200 dark:border-white/10">
                  <p className="text-base font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                    No matching cutoffs found
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#71839A] mb-4">
                    Try adjusting your percentage range, stream, or selecting All Mumbai region.
                  </p>
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-[#0B9EC4] hover:bg-[#0888aa] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Back to Range Selection
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {displayedColleges.map((c, idx) => {
                    const slug = c.collegeId || 'mithibai';
                    const region = getCollegeRegion(c.collegeName);

                    return (
                      <div
                        key={`${c.collegeName}-${c.stream}-${idx}`}
                        className="p-5 rounded-2xl bg-white dark:bg-[#131F30] border border-slate-200 dark:border-white/10 hover:border-[#0B9EC4]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-[#0B9EC4] dark:text-[#62d6f5] text-[10px] font-extrabold uppercase">
                              {c.stream}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#A9B8CA] text-[10px] font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#0B9EC4]" />
                              {region}
                            </span>
                            {c.year && (
                              <span className="text-[10px] font-semibold text-slate-400">
                                {c.year}
                              </span>
                            )}
                          </div>

                          {/* Clickable College Name */}
                          <button
                            type="button"
                            onClick={() => onSelectCollege(slug)}
                            className="text-left font-bold text-base sm:text-lg text-slate-900 dark:text-[#F4F7FB] hover:text-[#0B9EC4] dark:hover:text-[#62d6f5] transition-colors leading-snug block truncate group-hover:underline cursor-pointer"
                          >
                            {c.collegeName}
                          </button>

                          <p className="text-xs text-slate-500 dark:text-[#71839A] mt-1">
                            Category: {c.category || 'General'} • Code: {c.choiceCode || 'MU00'}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                          <div className="text-2xl sm:text-3xl font-black" style={{ color: isDark ? accent.chipTextDark : accent.color }}>
                            {c.cutoff}%
                          </div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            FYJC Cutoff
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div
          className="shrink-0 px-6 py-4 border-t flex items-center justify-between transition-colors duration-200"
          style={{
            background: isDark ? accent.bgDark : accent.bgLight,
            borderColor: isDark ? accent.borderDark : accent.borderLight,
          }}
        >
          {step > 1 && step < 5 ? (
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

          <div className="flex items-center gap-2">
            {onViewAll && step < 5 && (
              <button
                type="button"
                onClick={onViewAll}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/70 dark:bg-[#162232] text-slate-700 dark:text-[#C5D3E3] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#1c2b3f] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="hidden sm:inline">View All Cutoffs</span>
                <span className="sm:hidden">View All</span>
              </button>
            )}

            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                style={{ background: accent.ctaBg }}
              >
                <span className="hidden sm:inline">Next: Stream</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                style={{ background: accent.ctaBg }}
              >
                <span className="hidden sm:inline">Next: Percentage Range</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                style={{ background: accent.ctaBg }}
              >
                <span className="hidden sm:inline">Next: Mumbai Region</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                style={{ background: accent.ctaBg }}
              >
                <span className="hidden sm:inline">Apply Filters &amp; View</span>
                <span className="sm:hidden">Apply</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 5 && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                style={{ background: accent.ctaBg }}
              >
                <span>Done</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
