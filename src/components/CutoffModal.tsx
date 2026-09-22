import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, ArrowRight, ArrowLeft, Activity, SlidersHorizontal, GraduationCap, CheckCircle2, RotateCcw, MapPin } from 'lucide-react';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
import { PercentageDial } from './PercentageDial';

interface CutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCollege: (id: string) => void;
}

// Education levels supported by the current dataset
const EDUCATION_LEVELS = [
  { id: '12th', label: '12th / FYJC', hasData: true, desc: 'First Year Junior College (Class 11/12) cutoffs across Mumbai' },
  { id: '10th', label: '10th / SSC', hasData: false, desc: 'Secondary School Certificate cutoffs (Data Coming Soon)' },
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
const CATEGORIES = ['General'];
const YEARS = ['2026-27'];

interface Filters {
  searchQuery: string;
  educationLevel: string;
  stream: string;
  region: string;
  category: string;
  year: string;
  percentageExact: string;
}

const DEFAULT_FILTERS: Filters = {
  searchQuery: '',
  educationLevel: '12th',
  stream: 'All Streams',
  region: 'All Mumbai',
  category: 'General',
  year: '2026-27',
  percentageExact: '85',
};

export const CutoffModal: React.FC<CutoffModalProps> = ({
  isOpen,
  onClose,
  onSelectCollege,
}) => {
  // Wizard Step: 1 = Education Level, 2 = Percentage Dial, 3 = Stream & Region, 4 = Results
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
    setApplied({ ...pending });
    setStep(4);
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
    return 'All Mumbai'; // Default fallback for unmapped records
  };

  // Filter colleges based on APPLIED filters
  const filteredColleges = useMemo(() => {
    if (applied.educationLevel !== '12th') return [];

    const userPct = parseFloat(applied.percentageExact);

    let result = FYJC_CUTOFFS.filter((c) => {
      const q = applied.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.collegeName.toLowerCase().includes(q) ||
        c.stream.toLowerCase().includes(q);

      const matchesStream =
        applied.stream === 'All Streams' || c.stream === applied.stream;

      const matchesYear = c.year === applied.year;
      const matchesCategory = c.category === applied.category;

      // Region check: if All Mumbai, allow all; else check mapped region or fallback
      const collegeRegion = getCollegeRegion(c.collegeName);
      const matchesRegion =
        applied.region === 'All Mumbai' ||
        collegeRegion === applied.region ||
        collegeRegion === 'All Mumbai';

      // Cutoff eligibility check: student qualifies if college cutoff <= student percentage
      const matchesPct = isNaN(userPct) || c.cutoff <= userPct;

      return (
        matchesSearch &&
        matchesStream &&
        matchesYear &&
        matchesCategory &&
        matchesRegion &&
        matchesPct
      );
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
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#070D18]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0B1623] border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB]">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Activity className="w-4.5 h-4.5 text-[#007DCC] dark:text-[#86cfff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Mumbai Cutoff Explorer</h2>
              <p className="text-xs text-slate-500 dark:text-[#71839A]">
                {step === 1
                  ? 'Step 1 of 3: Select Education Level'
                  : step === 2
                  ? 'Step 2 of 3: Set Your Percentage'
                  : step === 3
                  ? 'Step 3 of 3: Field & Region Filters'
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
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      pending.educationLevel === level.id
                        ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                        : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 hover:border-[#007DCC]/40'
                    }`}
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
                      <CheckCircle2 className="w-5 h-5 text-[#007DCC] dark:text-[#86cfff] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Percentage Selector */}
          {step === 2 && (
            <div className="max-w-xl mx-auto space-y-6 text-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  What is your percentage?
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Use the dial or enter your score to view colleges you qualify for ($\le$ your percentage).
                </p>
              </div>

              {/* Dial Component */}
              <div className="py-2">
                <PercentageDial
                  value={dialValue}
                  onChange={(val) => setPendingField('percentageExact', String(val))}
                />
              </div>

              {/* Direct numeric input & quick presets */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exact %:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={pending.percentageExact}
                    onChange={(e) => setPendingField('percentageExact', e.target.value)}
                    className="w-24 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0D1828] border border-slate-300 dark:border-white/10 font-bold text-sm text-center focus:outline-none focus:border-[#007DCC]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {[75, 80, 85, 90, 95].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setPendingField('percentageExact', String(pct))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        parseFloat(pending.percentageExact) === pct
                          ? 'bg-[#007DCC] text-white'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#A9B8CA] hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Stream & Mumbai Region */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Stream & Mumbai Region
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#71839A]">
                  Filter cutoffs by stream and target Mumbai regional zone.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-3">
                    Academic Stream
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STREAMS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setPendingField('stream', s)}
                        className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                          pending.stream === s
                            ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                            : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#007DCC]" />
                    <span>Mumbai Region</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {MUMBAI_REGIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setPendingField('region', r)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                          pending.region === r
                            ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                            : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Cutoffs Results List */}
          {step === 4 && (
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-semibold text-slate-700 dark:text-[#A9B8CA] focus:outline-none"
                  >
                    <option value="Highest cutoff">Sort: Highest Cutoff First</option>
                    <option value="Lowest cutoff">Sort: Lowest Cutoff First</option>
                  </select>

                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-[#007DCC] dark:text-[#86cfff] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Modify Filters</span>
                  </button>
                </div>
              </div>

              {/* Results Cards */}
              {displayedColleges.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-[#0D1828] border border-slate-200 dark:border-white/10">
                  <p className="text-base font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                    No matching cutoffs found
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#71839A] mb-4">
                    Try adjusting your percentage dial or selecting All Mumbai region.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-[#007DCC] text-white text-xs font-bold rounded-xl"
                  >
                    Back to Wizard
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedColleges.map((c, idx) => (
                    <div
                      key={`${c.collegeName}-${c.stream}-${idx}`}
                      onClick={() => onSelectCollege(c.collegeSlug || 'mithibai')}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] text-[10px] font-bold uppercase">
                            {c.stream}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {getCollegeRegion(c.collegeName)}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB] group-hover:text-[#007DCC] transition-colors leading-snug">
                          {c.collegeName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-[#71839A] mt-1">
                          Eligible for {applied.percentageExact}% · Code: {c.choiceCode || 'MU00'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xl sm:text-2xl font-black text-[#007DCC] dark:text-[#86cfff]">
                          {c.cutoff}%
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Cutoff
                        </span>
                      </div>
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
          ) : (
            <div />
          )}

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Next: Percentage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Next: Stream & Region</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Apply Filters & View Cutoffs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
