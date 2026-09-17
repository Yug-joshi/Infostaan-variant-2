import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Check, SlidersHorizontal, Sparkles, Building2, MapPin, GraduationCap } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CategoryType, SearchResultItem } from '../types';
import { searchInfostaan } from '../lib/searchEngine';
import { PencilLoader } from './PencilLoader';
import { SkeletonResultCards } from './SkeletonResultCards';
import { InternshipModal } from './InternshipModal';
import gsap from 'gsap';

interface SearchResultsScreenProps {
  initialQuery: string;
  initialCategory?: string;
  onNavigate: (screen: ScreenType) => void;
  onSelectCollege: (collegeId: string) => void;
  onSaveItem?: (item: SearchResultItem) => void;
  savedItemIds?: string[];
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  initialQuery,
  initialCategory = 'all',
  onNavigate,
  onSelectCollege,
  onSaveItem,
  savedItemIds = [],
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('query') || '';
  const activeCategory = (searchParams.get('category') as CategoryType) || 'all';
  
  const [inputValue, setInputValue] = useState(query);
  const [searchPhase, setSearchPhase] = useState<'idle' | 'understanding' | 'skeleton' | 'done'>('idle');
  const [isInternshipOpen, setIsInternshipOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<SearchResultItem | null>(null);

  // Sync external query changes to input value
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Debounce input to URL query
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== query) {
        const params = new URLSearchParams(searchParams);
        if (inputValue) {
          params.set('query', inputValue);
        } else {
          params.delete('query');
        }
        setSearchParams(params);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [inputValue, query, searchParams, setSearchParams]);

  const setActiveCategory = (newCategory: CategoryType) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory && newCategory !== 'all') {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const getLoaderMessage = (cat: CategoryType) => {
    switch (cat) {
      case 'colleges': return 'Finding relevant colleges...';
      case 'courses': return 'Finding relevant courses...';
      case 'careers': return 'Exploring career paths...';
      case 'classes': return 'Finding relevant classes...';
      case 'cutoffs': return 'Finding cutoff documents...';
      default: return "Finding what's relevant...";
    }
  };

  const filteredResults = useMemo(() => {
    return searchInfostaan(query, activeCategory);
  }, [query, activeCategory]);

  const fullResultsForCounts = useMemo(() => searchInfostaan('', 'all'), []);

  const counts = useMemo(() => {
    return {
      all: fullResultsForCounts.length,
      colleges: fullResultsForCounts.filter((i) => i.category === 'colleges').length,
      courses: fullResultsForCounts.filter((i) => i.category === 'courses').length,
      careers: fullResultsForCounts.filter((i) => i.category === 'careers').length,
      internships: fullResultsForCounts.filter((i) => i.category === 'internships').length,
      classes: fullResultsForCounts.filter((i) => i.category === 'classes').length,
      cutoffs: fullResultsForCounts.filter((i) => i.category === 'cutoffs').length,
    };
  }, [fullResultsForCounts]);

  // Search loader sequence
  useEffect(() => {
    setSearchPhase('understanding');
    
    // "Understanding" phase (spinning pencil): 2500ms
    const timer1 = setTimeout(() => {
      setSearchPhase('skeleton');
    }, 2500);
    
    // "Skeleton" phase: 500ms
    const timer2 = setTimeout(() => {
      setSearchPhase('done');
    }, 3000);

  // Simulate fast search latency when query or category changes
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 1500); // Fast but visible loading duration
    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  // Subtle GSAP animations when results change
  useEffect(() => {
    if (!isSearching && resultsContainerRef.current) {
      const cards = resultsContainerRef.current.querySelectorAll('.result-card-anim');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }
  }, [filteredResults, activeCategory]);

  const handleActionClick = (item: SearchResultItem) => {
    if (item.category === 'colleges') {
      onSelectCollege(item.collegeId || 'hinduja');
    } else if (item.category === 'cutoffs' && item.sourceFile) {
      window.open(item.sourceFile, '_blank');
    } else if (item.category === 'internships') {
      setSelectedInternship(item);
      setIsInternshipOpen(true);
    } else {
      onNavigate('guidance');
    }
  };

  return (
    <main
      ref={containerRef}
      className="w-full pt-20 sm:pt-24 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header & Filter Bar (Left-aligned, free-flow layout) */}
        <div className="flex flex-col gap-6 mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Mumbai Student Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB]">
                Search & Explore Mumbai Programs
              </h1>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/help-me-decide')}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#161c27] hover:bg-slate-100 dark:hover:bg-[#1f2838] border border-slate-300 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#A9B8CA] shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Open Career Roadmap</span>
            </button>
          </div>

          {/* Input Bar */}
          <div className="relative z-50 flex items-center w-full bg-white dark:bg-[#0D1828] rounded-2xl px-4 py-3 shadow-xs transition-all border border-slate-300 dark:border-[#D3B5E8]/15 focus-within:border-[#007DCC] focus-within:ring-2 focus-within:ring-[#007DCC]/20">
            <Search className="text-[#007DCC] dark:text-[#9ccaff] mr-3 w-5 h-5 shrink-0" />
            <input
              aria-label="Search opportunities, courses, and institutions in Mumbai"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colleges (Hinduja, Podar, Mithibai, HR), courses, careers, internships..."
              className="w-full bg-transparent font-medium text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A9B8CA]/60 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                title="Clear search"
                className="flex items-center justify-center p-1 text-slate-400 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] rounded-full transition-colors mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {/* Search Suggestions Dropdown */}
            {inputValue.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a202b] border border-slate-300 dark:border-[#D3B5E8]/20 rounded-2xl shadow-xl overflow-hidden z-50 text-left">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue('');
                      onSelectCollege('mithibai');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-[#242a36] rounded-xl transition-colors flex items-center gap-3"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-[#A9B8CA]">{inputValue} <span className="text-slate-400">in Colleges</span></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Perform search logic here if needed
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-[#242a36] rounded-xl transition-colors flex items-center gap-3"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-[#A9B8CA]">{inputValue} <span className="text-slate-400">in Courses</span></span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist">
              {[
                { id: 'all', label: 'All Results', count: counts.all },
                { id: 'colleges', label: 'Colleges', count: counts.colleges },
                { id: 'courses', label: 'Courses', count: counts.courses },
                { id: 'careers', label: 'Careers', count: counts.careers },
                { id: 'internships', label: 'Internships', count: counts.internships },
                { id: 'classes', label: 'Classes', count: counts.classes },
                { id: 'cutoffs', label: 'Cutoffs', count: counts.cutoffs },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as CategoryType)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeCategory === tab.id
                      ? 'bg-[#007DCC] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] bg-white dark:bg-[#0D1828] hover:bg-slate-100 dark:hover:bg-[#161c27] border border-slate-300 dark:border-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[11px] font-normal ${
                      activeCategory === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#8a919c]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500 dark:text-[#A9B8CA] tracking-wide">
              {isSearching 
                ? 'Retrieving results...' 
                : `Showing ${filteredResults.length} matching ${activeCategory} options`}
            </p>
          </div>
        </div>

        {/* Dynamic Loading Sequence / Results Container */}
        <div ref={resultsContainerRef} className="w-full">
          {searchPhase === 'understanding' ? (
            <div className="py-12">
              <PencilLoader size="medium" variant="spin" message={getLoaderMessage(activeCategory)} />
            </div>
          ) : searchPhase === 'skeleton' ? (
            <SkeletonResultCards />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredResults.length === 0 ? (
                <div className="md:col-span-2 p-10 text-center rounded-2xl bg-white dark:bg-[#0D1828] text-slate-600 dark:text-[#A9B8CA] border border-slate-300 dark:border-white/10 shadow-xs">
                  <p className="text-base font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
                    No matching results found for "{query}"
                  </p>
                  <p className="text-xs sm:text-sm">
                    Try searching for Hinduja, Podar, Mithibai, HR College, Chartered Accountant, or BKC.
                  </p>
                  <button
                    onClick={() => {
                      setInputValue('Hinduja');
                      setActiveCategory('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#007DCC] text-white text-xs sm:text-sm font-semibold hover:bg-[#006cb0] transition-colors"
                  >
                    Search K.P.B. Hinduja College
                  </button>
                </div>
              ) : (
                filteredResults.map((item) => (
                  <article
                    key={item.id}
                    className="result-card-anim group relative flex flex-col justify-between p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0D1828] hover:bg-slate-100 dark:hover:bg-[#121f33] transition-all duration-200 shadow-sm hover:shadow-md border border-slate-300 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] dark:hover:border-[#D3B5E8]/35 text-left h-full"
                    data-category={item.category}
                  >
                    <div>
                      {/* Category & Region Metadata */}
                      <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                            item.tagColor === 'tertiary'
                              ? 'text-emerald-600 dark:text-[#51dcbc]'
                              : item.tagColor === 'secondary'
                              ? 'text-blue-600 dark:text-[#86cfff]'
                              : 'text-purple-600 dark:text-[#D3B5E8]'
                          }`}
                        >
                          {item.badgeCategory}
                        </span>
                        <span className="text-slate-300 dark:text-[#8a919c] text-[10px]">•</span>
                        <span className="text-[10px] text-slate-500 dark:text-[#A9B8CA]">{item.badgeSub}</span>
                      </div>

                      {/* Title */}
                      <h2
                        onClick={() => handleActionClick(item)}
                        className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-1 group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors cursor-pointer leading-snug"
                      >
                        {item.title}
                      </h2>

                      {/* Subtitle / Program Specs */}
                      {item.subtitle && (
                        <div className="text-slate-600 dark:text-[#A9B8CA] text-[11px] sm:text-xs mb-2 leading-snug">
                          <span>{item.subtitle}</span>
                        </div>
                      )}

                      {/* Why Relevant Callout Box */}
                      <div className="p-2 bg-slate-100 dark:bg-[#161c27] rounded-xl mb-3 border border-slate-300/80 dark:border-white/5 line-clamp-3">
                        <p className="text-[10px] sm:text-[11px] text-slate-700 dark:text-[#F4F7FB] leading-tight">
                          <span
                            className={`font-bold mr-1 block sm:inline ${
                              item.tagColor === 'tertiary'
                                ? 'text-emerald-600 dark:text-[#51dcbc]'
                                : 'text-[#007DCC] dark:text-[#9ccaff]'
                            }`}
                          >
                            Why relevant:
                          </span>
                          {item.whyRelevant}
                        </p>
                      </div>
                    </div>

                    {/* Meta Strip & Action Link */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2 mt-auto">
                      <div className="flex items-center flex-wrap gap-1 text-slate-500 dark:text-[#A9B8CA] text-[9px] sm:text-[10px] leading-tight">
                        {item.meta.map((m, idx) => (
                          <React.Fragment key={idx}>
                            {idx > 0 && <span className="text-slate-300 dark:text-[#8a919c]">•</span>}
                            <span className="truncate max-w-[120px]">{m}</span>
                          </React.Fragment>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleActionClick(item)}
                        className="inline-flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-[#091540] text-[10px] sm:text-xs font-bold text-[#007DCC] dark:text-[#86cfff] transition-colors"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        ) : (
          <div ref={resultsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredResults.length === 0 ? (
            <div className="md:col-span-2 p-10 text-center rounded-2xl bg-white dark:bg-[#0D1828] text-slate-600 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 shadow-xs">
              <p className="text-base font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
                No matching results found for "{query}"
              </p>
              <p className="text-xs sm:text-sm">
                Try searching for Hinduja, Podar, Mithibai, HR College, Chartered Accountant, or BKC.
              </p>
              <button
                onClick={() => {
                  setQuery('Hinduja');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#007DCC] text-white text-xs sm:text-sm font-semibold hover:bg-[#006cb0] transition-colors"
              >
                Search K.P.B. Hinduja College
              </button>
            </div>
          ) : (
            filteredResults.map((item) => (
              <ResultCard
                key={item.id}
                item={item}
                onActionClick={handleActionClick}
                isSaved={savedItemIds.includes(item.id)}
                onToggleSave={onSaveItem}
              />
            ))
          )}
          </div>
        )}

        {/* Free-layout Banner at Bottom */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-300 dark:border-[#D3B5E8]/15 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB]">
              Need a personalized academic plan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA]">
              Check out the step-by-step career blueprints tailored to Mumbai colleges, fees, and internships.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('guidance')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#007DCC] hover:bg-[#006cb0] px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 shrink-0"
          >
            <span>Open Career Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <InternshipModal 
        isOpen={isInternshipOpen}
        onClose={() => setIsInternshipOpen(false)}
        internship={selectedInternship}
      />
    </main>
  );
};
