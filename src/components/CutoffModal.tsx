import React, { useState } from 'react';
import { X, Search, Building2, Filter, ChevronDown, Check } from 'lucide-react';

interface CutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCollege: (id: string) => void;
}

import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';

export const CutoffModal: React.FC<CutoffModalProps> = ({
  isOpen,
  onClose,
  onSelectCollege,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stream, setStream] = useState('All Streams');
  const [year, setYear] = useState('2024-25');
  const [category, setCategory] = useState('General');
  const [minCutoff, setMinCutoff] = useState<number>(70);
  const [maxCutoff, setMaxCutoff] = useState<number>(100);

  if (!isOpen) return null;

  const filteredColleges = FYJC_CUTOFFS.filter((c) => {
    const matchesSearch = c.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) || c.stream.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStream = stream === 'All Streams' || c.stream === stream;
    const matchesYear = c.year === year;
    const matchesCategory = c.category === category;
    const matchesCutoff = c.cutoff >= minCutoff && c.cutoff <= maxCutoff;
    
    return matchesSearch && matchesStream && matchesYear && matchesCategory && matchesCutoff;
  }).slice(0, 50); // Limit to 50 for performance

  const clearFilters = () => {
    setSearchQuery('');
    setStream('All Streams');
    setYear('2024-25');
    setCategory('General');
    setMinCutoff(70);
    setMaxCutoff(100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-150">
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full h-[75vh] mt-auto md:mt-0 md:h-auto md:max-h-[90vh] md:max-w-4xl bg-white dark:bg-[#0D1828] border-0 md:border md:border-slate-200 dark:md:border-[#D3B5E8]/20 rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#D3B5E8]/15 flex items-center justify-between bg-slate-50 dark:bg-[#161c27] shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">Cutoffs</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] rounded-xl hover:bg-slate-200 dark:hover:bg-[#242a36] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          
          {/* Sidebar / Filters */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#D3B5E8]/15 p-5 shrink-0 bg-white dark:bg-[#0D1828]">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#71839A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college or course..."
                className="w-full bg-slate-50 dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC]"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider mb-2">Stream</label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC]"
                >
                  <option value="All Streams">All Streams</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider mb-2">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC]"
                  >
                    <option value="2024-25">2024-25</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC]"
                  >
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider mb-2">Cutoff Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minCutoff}
                    onChange={(e) => setMinCutoff(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC] text-center"
                    placeholder="Min"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="number"
                    value={maxCutoff}
                    onChange={(e) => setMaxCutoff(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#007DCC] text-center"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 p-5 bg-slate-50/50 dark:bg-[#070D18]">
            {filteredColleges.length > 0 ? (
              <div className="space-y-3">
                {filteredColleges.map((c, index) => (
                  <div key={`${c.id}-${index}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl hover:border-[#007DCC]/40 transition-colors gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">{c.collegeName}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-[#A9B8CA]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1a202b]">{c.stream}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1a202b]">{c.category}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1a202b]">{c.year}</span>
                        {c.choiceCode && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1a202b] font-mono text-[11px]">{c.choiceCode}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-right">
                        <div className="text-sm text-slate-500 dark:text-[#71839A] mb-0.5">Cutoff</div>
                        <div className="text-xl font-extrabold text-[#007DCC] dark:text-[#19A7E8]">{c.cutoff}%</div>
                      </div>
                      {c.collegeId ? (
                        <button 
                          onClick={() => {
                            onClose();
                            onSelectCollege(c.collegeId as string);
                          }}
                          className="px-4 py-2 bg-slate-100 dark:bg-[#161c27] hover:bg-slate-200 dark:hover:bg-[#242a36] text-slate-900 dark:text-[#F4F7FB] text-sm font-semibold rounded-lg transition-colors"
                        >
                          View College
                        </button>
                      ) : (
                        <button 
                          disabled
                          title="College profile not available yet"
                          className="px-4 py-2 bg-slate-50 dark:bg-[#0D1828] text-slate-400 dark:text-[#71839A] text-sm font-semibold rounded-lg cursor-not-allowed border border-slate-200 dark:border-white/5"
                        >
                          Needs Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 mb-4 bg-slate-100 dark:bg-[#161c27] rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-slate-400 dark:text-[#71839A]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">No colleges found</h3>
                <p className="text-slate-500 dark:text-[#A9B8CA] text-sm mb-6 max-w-sm">Try adjusting your filters or search query to see more results.</p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-[#007DCC] hover:bg-[#006cb0] text-white text-sm font-semibold rounded-xl transition-all shadow-md"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
