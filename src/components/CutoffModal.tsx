import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, ArrowRight, Activity } from 'lucide-react';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';

interface CutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCollege: (id: string) => void;
}

export const CutoffModal: React.FC<CutoffModalProps> = ({
  isOpen,
  onClose,
  onSelectCollege,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stream, setStream] = useState('All Streams');
  const [category, setCategory] = useState('General');
  const [year, setYear] = useState('2026-27');
  const [cutoffBucket, setCutoffBucket] = useState('All Ranges');
  const [sortBy, setSortBy] = useState('Highest cutoff');
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto focus search and handle keyboard shortcuts
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredColleges = useMemo(() => {
    let result = FYJC_CUTOFFS.filter((c) => {
      const matchesSearch =
        c.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.stream.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStream = stream === 'All Streams' || c.stream === stream;
      const matchesYear = c.year === year;
      const matchesCategory = c.category === category;
      
      let matchesBucket = true;
      if (cutoffBucket === '90%+ (Top Tier)') {
        matchesBucket = c.cutoff >= 90;
      } else if (cutoffBucket === '80% - 90%') {
        matchesBucket = c.cutoff >= 80 && c.cutoff < 90;
      } else if (cutoffBucket === '70% - 80%') {
        matchesBucket = c.cutoff >= 70 && c.cutoff < 80;
      } else if (cutoffBucket === '< 70%') {
        matchesBucket = c.cutoff < 70;
      }

      return matchesSearch && matchesStream && matchesYear && matchesCategory && matchesBucket;
    });

    if (sortBy === 'Highest cutoff') {
      result.sort((a, b) => b.cutoff - a.cutoff);
    } else if (sortBy === 'Lowest cutoff') {
      result.sort((a, b) => a.cutoff - b.cutoff);
    }

    return result;
  }, [searchQuery, stream, category, year, cutoffBucket, sortBy]);

  const displayedColleges = filteredColleges.slice(0, 50);

  const clearFilters = () => {
    setSearchQuery('');
    setStream('All Streams');
    setCategory('General');
    setCutoffBucket('All Ranges');
    setSortBy('Highest cutoff');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#070D18]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full h-[85vh] mt-auto md:mt-0 md:h-auto md:max-h-[90vh] md:w-[85vw] md:max-w-5xl bg-white/40 dark:bg-[#070D18]/60 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,125,204,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB]">
        
        {/* Header Region */}
        <div className="p-5 md:p-6 lg:p-8 shrink-0 flex flex-col gap-5 border-b border-white/40 dark:border-white/5 bg-white/30 dark:bg-black/20">
          
          {/* Top row: Title and Year selector */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-[#007DCC] dark:text-[#86cfff]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] leading-tight">Cutoffs</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA]">Find FYJC cutoffs for Mumbai colleges</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="hidden sm:block bg-transparent text-slate-500 dark:text-[#A9B8CA] text-sm font-semibold border-0 focus:ring-0 cursor-pointer hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors"
              >
                <option value="2026-27">2026–27</option>
              </select>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 dark:text-[#71839A] dark:hover:text-[#F4F7FB] rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 dark:text-[#71839A]" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search college or course..."
              className="w-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#71839A] focus:outline-none focus:border-[#007DCC] focus:ring-2 focus:ring-[#007DCC]/20 transition-all shadow-sm"
            />
            <div className="absolute inset-y-0 right-4 hidden sm:flex items-center pointer-events-none">
              <span className="text-xs font-semibold text-slate-400 dark:text-[#71839A] px-2 py-1 rounded bg-slate-100 dark:bg-[#1a2333]">Ctrl + K</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-[#A9B8CA] focus:outline-none focus:border-[#007DCC] shadow-sm hover:border-white/80 dark:hover:border-white/20 transition-colors"
            >
              <option value="All Streams">All Streams</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
              <option value="Science">Science</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-[#A9B8CA] focus:outline-none focus:border-[#007DCC] shadow-sm hover:border-white/80 dark:hover:border-white/20 transition-colors"
            >
              <option value="General">General</option>
            </select>

            <select
              value={cutoffBucket}
              onChange={(e) => setCutoffBucket(e.target.value)}
              className="bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-[#A9B8CA] focus:outline-none focus:border-[#007DCC] shadow-sm hover:border-white/80 dark:hover:border-white/20 transition-colors"
            >
              <option value="All Ranges">Cutoff Range</option>
              <option value="90%+ (Top Tier)">90%+ (Top Tier)</option>
              <option value="80% - 90%">80% - 90%</option>
              <option value="70% - 80%">70% - 80%</option>
              <option value="< 70%">&lt; 70%</option>
            </select>

            {(searchQuery || stream !== 'All Streams' || cutoffBucket !== 'All Ranges') && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-[#007DCC] hover:text-[#005a9c] dark:text-[#86cfff] dark:hover:text-white transition-colors sm:ml-auto px-2 py-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto bg-transparent p-5 md:p-6 lg:p-8">
          
          {/* Results meta bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
            <div className="text-sm font-medium text-slate-500 dark:text-[#A9B8CA]">
              <span className="text-slate-900 dark:text-[#F4F7FB] font-bold">{filteredColleges.length}</span> results
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-[#71839A]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 text-sm font-semibold text-slate-700 dark:text-[#F4F7FB] focus:ring-0 cursor-pointer hover:text-slate-900 transition-colors p-0 pl-1"
              >
                <option value="Highest cutoff">Highest cutoff</option>
                <option value="Lowest cutoff">Lowest cutoff</option>
              </select>
            </div>
          </div>

          {/* Results List */}
          {displayedColleges.length > 0 ? (
            <div className="flex flex-col gap-1">
              {displayedColleges.map((c, index) => (
                <div 
                  key={`${c.id}-${index}`} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 border-b border-white/40 dark:border-white/5 last:border-0 group hover:bg-white/40 dark:hover:bg-white/5 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors rounded-xl"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-slate-900 dark:text-[#F4F7FB] mb-1.5 leading-snug">
                      {c.collegeName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-slate-500 dark:text-[#A9B8CA]">
                      <span>{c.stream}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#71839A]/50" />
                      <span>{c.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#71839A]/50" />
                      <span>{c.year}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0 shrink-0 border-t sm:border-0 pt-4 sm:pt-0 border-slate-100 dark:border-white/5">
                    <div className="text-xl sm:text-[22px] font-black text-[#007DCC] dark:text-[#19A7E8] tracking-tight">
                      {c.cutoff}%
                    </div>
                    {c.collegeId ? (
                      <button 
                        onClick={() => {
                          onClose();
                          onSelectCollege(c.collegeId as string);
                        }}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/60 dark:bg-white/10 backdrop-blur-md group-hover:bg-[#007DCC] text-slate-500 dark:text-[#A9B8CA] group-hover:text-white transition-all shadow-sm"
                      >
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    ) : (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/5 text-slate-300 dark:text-white/10" title="Needs Review">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredColleges.length > 50 && (
                <div className="text-center pt-8 pb-4">
                  <p className="text-sm text-slate-500 dark:text-[#71839A]">
                    Showing 1–50 of {filteredColleges.length} results. Use search or filters to narrow down.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 bg-slate-100 dark:bg-[#121c2c] rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-slate-400 dark:text-[#71839A]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">No colleges found</h3>
              <p className="text-slate-500 dark:text-[#A9B8CA] text-sm max-w-sm">
                Try adjusting your percentage range or search query to see more results.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
