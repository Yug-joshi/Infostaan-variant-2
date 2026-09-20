import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, ArrowRight, Activity, SlidersHorizontal } from 'lucide-react';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
import { PercentageDial } from './PercentageDial';

interface CutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCollege: (id: string) => void;
}

// Education levels supported by the current dataset
const EDUCATION_LEVELS = [
  { id: '12th', label: '12th / FYJC', hasData: true },
  { id: '10th', label: '10th', hasData: false },
  { id: 'jee', label: 'JEE', hasData: false },
  { id: 'law3', label: 'Law 3-Year', hasData: false },
  { id: 'law5', label: 'Law 5-Year', hasData: false },
];

const STREAMS = ['All Streams', 'Arts', 'Commerce', 'Science'];
const CATEGORIES = ['General'];
const YEARS = ['2026-27'];



interface Filters {
  searchQuery: string;
  educationLevel: string;
  stream: string;
  category: string;
  year: string;
  percentageExact: string; // exact % string or ''
}

const DEFAULT_FILTERS: Filters = {
  searchQuery: '',
  educationLevel: '12th',
  stream: 'All Streams',
  category: 'General',
  year: '2026-27',
  percentageExact: '',
};

export const CutoffModal: React.FC<CutoffModalProps> = ({
  isOpen,
  onClose,
  onSelectCollege,
}) => {
  // PENDING — what the user is selecting right now
  const [pending, setPending] = useState<Filters>(DEFAULT_FILTERS);
  // APPLIED — what the results actually use (only updated on Apply)
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('Highest cutoff');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset everything when modal opens
  useEffect(() => {
    if (isOpen) {
      setPending(DEFAULT_FILTERS);
      setApplied(DEFAULT_FILTERS);
      setSortBy('Highest cutoff');
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl+K focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helpers to update pending state
  const setPendingField = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setPending((prev) => ({ ...prev, [key]: value }));
  };



  // Apply pending → applied
  const handleApply = () => {
    setApplied({ ...pending });
    setFiltersOpen(false);
  };

  // Clear: reset pending only; user must then Apply to clear results
  const handleClear = () => {
    setPending(DEFAULT_FILTERS);
  };

  // Check if pending differs from applied (to show "pending changes" indicator)
  const hasPendingChanges = JSON.stringify(pending) !== JSON.stringify(applied);

  // Derive the active percentage range from applied filters
  const getPercentageBounds = (f: Filters): { min: number; max: number } | null => {
    if (f.percentageExact) {
      const val = parseFloat(f.percentageExact);
      if (!isNaN(val)) return { min: val, max: 100 };
    }
    return null;
  };

  const getActiveRange = (valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return null;
    if (val < 50) return '< 50%';
    if (val < 60) return '50–60%';
    if (val < 70) return '60–70%';
    if (val < 80) return '70–80%';
    if (val < 90) return '80–90%';
    return '90–100%';
  };

  const activeRange = getActiveRange(pending.percentageExact);

  // Results use APPLIED filters only
  const filteredColleges = useMemo(() => {
    // Only FYJC (12th) data is available; other education levels show no results
    if (applied.educationLevel !== '12th') return [];

    const bounds = getPercentageBounds(applied);

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

      const matchesPct =
        !bounds ||
        (c.cutoff >= bounds.min && c.cutoff <= bounds.max);

      return matchesSearch && matchesStream && matchesYear && matchesCategory && matchesPct;
    });

    if (sortBy === 'Highest cutoff') {
      result = [...result].sort((a, b) => b.cutoff - a.cutoff);
    } else {
      result = [...result].sort((a, b) => a.cutoff - b.cutoff);
    }

    return result;
  }, [applied, sortBy]);

  const displayedColleges = filteredColleges.slice(0, 60);

  const selectedLevel = EDUCATION_LEVELS.find((l) => l.id === pending.educationLevel);

  if (!isOpen) return null;

  const filterSelectClass =
    'w-full bg-white/60 dark:bg-black/30 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-[#A9B8CA] focus:outline-none focus:border-[#007DCC] focus:ring-2 focus:ring-[#007DCC]/20 transition-all';

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#070D18]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full h-[92vh] md:h-auto md:max-h-[92vh] md:w-[90vw] md:max-w-5xl bg-white dark:bg-[#0B1623] border border-slate-200 dark:border-white/10 shadow-2xl rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB]">

        {/* ── HEADER ── */}
        <div className="shrink-0 px-5 pt-5 pb-4 md:px-8 md:pt-7 md:pb-5 border-b border-slate-100 dark:border-white/8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <Activity className="w-4.5 h-4.5 text-[#007DCC] dark:text-[#86cfff]" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold leading-tight">Cutoffs</h2>
                <p className="text-xs text-slate-500 dark:text-[#71839A]">
                  FYJC cutoffs for Mumbai colleges · {applied.year}
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

          {/* ── EDUCATION LEVEL CHIPS ── */}
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#71839A] mb-2">
              Education Level
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {EDUCATION_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setPendingField('educationLevel', level.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pending.educationLevel === level.id
                      ? 'bg-[#007DCC] text-white shadow-sm'
                      : level.hasData
                      ? 'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-[#A9B8CA] hover:bg-slate-200 dark:hover:bg-white/12'
                      : 'bg-slate-50 dark:bg-white/4 text-slate-400 dark:text-[#4a5568] cursor-default'
                  }`}
                  title={!level.hasData ? 'Data not yet available' : undefined}
                >
                  {level.label}
                  {!level.hasData && (
                    <span className="ml-1.5 text-[9px] opacity-60">soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── SEARCH BAR ── */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#71839A] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={pending.searchQuery}
              onChange={(e) => setPendingField('searchQuery', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Search college name..."
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#71839A] focus:outline-none focus:border-[#007DCC] focus:ring-2 focus:ring-[#007DCC]/20 transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:block text-[10px] font-semibold text-slate-300 dark:text-[#3a4a5a] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5">
              Enter ↵
            </span>
          </div>

          {/* ── MY PERCENTAGE ── */}
          <div className="mb-6 flex flex-col items-center border-t border-slate-100 dark:border-white/5 pt-6 mt-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F4F7FB] mb-1">Set your percentage</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] mb-8 text-center max-w-sm">
              Select your 10th, 12th or Graduation percentage to get more relevant results.
            </p>
            
            <PercentageDial 
              value={parseFloat(pending.percentageExact) || 0}
              onChange={(v) => setPendingField('percentageExact', v.toString())}
            />
            
            <div className="w-full max-w-md mt-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-bold text-slate-500 dark:text-[#71839A]">Quick select</p>
                <button 
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs font-semibold text-[#007DCC] dark:text-[#19A7E8] hover:underline"
                >
                  {showManualInput ? 'Show ranges' : 'Enter manually'}
                </button>
              </div>
              
              {showManualInput ? (
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={pending.percentageExact}
                      onChange={(e) => setPendingField('percentageExact', e.target.value)}
                      placeholder="e.g. 87.4"
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC] transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 animate-fade-in">
                  {[
                    { label: '< 50%', val: 45 },
                    { label: '50–60%', val: 55 },
                    { label: '60–70%', val: 65 },
                    { label: '70–80%', val: 75 },
                    { label: '80–90%', val: 85 },
                    { label: '90–100%', val: 95 }
                  ].map(r => (
                    <button
                      key={r.label}
                      onClick={() => setPendingField('percentageExact', r.val.toString())}
                      className={`px-1 py-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all active:scale-95 ${
                        activeRange === r.label 
                          ? 'bg-[#007DCC] border-[#007DCC] text-white shadow-md'
                          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/50 hover:text-[#007DCC]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── MORE FILTERS (collapsible) ── */}
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#71839A] hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors mb-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
            <span className="text-[10px] ml-0.5 opacity-60">{filtersOpen ? '▲' : '▼'}</span>
          </button>

          {filtersOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 pb-1">
              {/* Stream */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#71839A] mb-1.5">
                  Stream
                </label>
                <select
                  value={pending.stream}
                  onChange={(e) => setPendingField('stream', e.target.value)}
                  className={filterSelectClass}
                >
                  {STREAMS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#71839A] mb-1.5">
                  Category
                </label>
                <select
                  value={pending.category}
                  onChange={(e) => setPendingField('category', e.target.value)}
                  className={filterSelectClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#71839A] mb-1.5">
                  Academic Year
                </label>
                <select
                  value={pending.year}
                  onChange={(e) => setPendingField('year', e.target.value)}
                  className={filterSelectClass}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ── APPLY / CLEAR ROW ── */}
          <div className="flex items-center justify-between mt-4 gap-3">
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-slate-500 dark:text-[#71839A] hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors px-2 py-1.5"
            >
              Clear All
            </button>

            <button
              onClick={handleApply}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] ${
                hasPendingChanges
                  ? 'bg-[#007DCC] hover:bg-[#006cb0] text-white'
                  : 'bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-[#4a5568] cursor-default'
              }`}
              disabled={!hasPendingChanges}
            >
              <span>Apply Filters</span>
              {hasPendingChanges && (
                <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* ── RESULTS AREA ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Results meta bar */}
          <div className="flex items-center justify-between px-5 md:px-8 py-3.5 border-b border-slate-100 dark:border-white/5 sticky top-0 bg-white dark:bg-[#0B1623] z-10">
            <p className="text-sm text-slate-500 dark:text-[#71839A]">
              <span className="font-bold text-slate-900 dark:text-[#F4F7FB]">
                {filteredColleges.length.toLocaleString()}
              </span>{' '}
              {applied.educationLevel !== '12th' ? 'results' : 'colleges'}
              {applied.stream !== 'All Streams' && (
                <span className="ml-1.5 text-[#007DCC] dark:text-[#86cfff]">· {applied.stream}</span>
              )}
              {(applied.percentageExact) && (
                <span className="ml-1.5 text-[#007DCC] dark:text-[#86cfff]">
                  · {applied.percentageExact}%+
                </span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-[#71839A]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-[#F4F7FB] border-0 focus:ring-0 cursor-pointer"
              >
                <option value="Highest cutoff">Highest first</option>
                <option value="Lowest cutoff">Lowest first</option>
              </select>
            </div>
          </div>

          {/* Results list */}
          <div className="px-5 md:px-8 pb-8">
            {applied.educationLevel !== '12th' ? (
              /* No data state for non-FYJC levels */
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 mb-4 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-slate-300 dark:text-[#3a4a5a]" />
                </div>
                <h3 className="text-base font-bold text-slate-700 dark:text-[#A9B8CA] mb-1">
                  {selectedLevel?.label} cutoff data coming soon
                </h3>
                <p className="text-sm text-slate-400 dark:text-[#71839A] max-w-xs">
                  Currently only 12th / FYJC cutoffs are available for Mumbai colleges.
                </p>
              </div>
            ) : displayedColleges.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {displayedColleges.map((c, index) => (
                  <div
                    key={`${c.id}-${index}`}
                    className="flex items-center justify-between py-4 group hover:bg-slate-50 dark:hover:bg-white/3 -mx-5 md:-mx-8 px-5 md:px-8 transition-colors"
                  >
                    {/* College info */}
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-[#F4F7FB] leading-snug mb-1 capitalize">
                        {c.collegeName.toLowerCase().replace(/\b\w/g, (ch) => ch.toUpperCase())}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500 dark:text-[#71839A]">
                        <span>{c.stream}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-current opacity-40" />
                        <span>{c.category}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-current opacity-40" />
                        <span>{c.year}</span>
                      </div>
                    </div>

                    {/* Cutoff % + action */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-black text-[#007DCC] dark:text-[#19A7E8] tracking-tight tabular-nums">
                          {c.cutoff}%
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-[#4a5568]">cutoff</div>
                      </div>

                      {c.collegeId ? (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectCollege(c.collegeId as string);
                          }}
                          className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/8 group-hover:bg-[#007DCC] text-slate-400 dark:text-[#71839A] group-hover:text-white transition-all shadow-sm"
                          title="View college details"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-100 dark:border-white/5 text-slate-200 dark:text-white/10">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredColleges.length > 60 && (
                  <div className="py-6 text-center">
                    <p className="text-sm text-slate-400 dark:text-[#71839A]">
                      Showing 1–60 of {filteredColleges.length.toLocaleString()} results.{' '}
                      Use search or filters to narrow down.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Empty state */
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 mb-4 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-slate-300 dark:text-[#3a4a5a]" />
                </div>
                <h3 className="text-base font-bold text-slate-700 dark:text-[#A9B8CA] mb-1">
                  No matching colleges
                </h3>
                <p className="text-sm text-slate-400 dark:text-[#71839A] max-w-xs">
                  Try adjusting your filters or percentage range, then click Apply Filters.
                </p>
                <button
                  onClick={handleClear}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-[#007DCC] dark:text-[#86cfff] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
