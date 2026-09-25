import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ArrowLeft, Building2, MapPin, GraduationCap, Settings2, Compass, CheckCircle2, BarChart2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CategoryType, SearchResultItem } from '../types';
import { searchInfostaan } from '../lib/searchEngine';
import { PencilLoader } from './PencilLoader';
import { SkeletonResultCards } from './SkeletonResultCards';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';

interface FilterState {
  interest?: string | null;
  grade?: string | null;
  fee?: string | null;
  domain?: string | null;
  degreeLevel?: string | null;
  subjectCategory?: string | null;
  subject?: string | null;
  level?: string | null;
  region?: string | null;
}

interface SearchResultsScreenProps {
  defaultCategory?: CategoryType;
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
  onSaveItem?: (item: SearchResultItem) => void;
  savedItemIds?: string[];
  onOpenCutoff?: () => void;
}

const MUMBAI_REGIONS = [
  'All Mumbai',
  'South Mumbai',
  'Western Suburbs',
  'Central Suburbs',
  'Eastern Suburbs',
  'Harbour / Central-East',
];

const getCollegeRegion = (collegeName: string): string => {
  const name = collegeName.toUpperCase();
  if (
    name.includes("XAVIER") || name.includes("H.R.") || name.includes("JAI HIND") ||
    name.includes("HINDUJA") || name.includes("FORT") || name.includes("CHURCHGATE") ||
    name.includes("CHARNI ROAD") || name.includes("MARINE") || name.includes("SYDENHAM") ||
    name.includes("ELPHINSTONE") || name.includes("WILSON")
  ) {
    return 'South Mumbai';
  }
  if (
    name.includes("MITHIBAI") || name.includes("N.M.") || name.includes("NARSEE") ||
    name.includes("SVKM") || name.includes("ANDHERI") || name.includes("PARLE") ||
    name.includes("MALAD") || name.includes("BORIVALI") || name.includes("BANDRA") ||
    name.includes("KANDIVALI") || name.includes("GOREGAON") || name.includes("SANTACRUZ") ||
    name.includes("BHAVAN")
  ) {
    return 'Western Suburbs';
  }
  if (
    name.includes("PODAR") || name.includes("MATUNGA") || name.includes("DADAR") ||
    name.includes("SIES") || name.includes("RUPAREL") || name.includes("KHALSA") ||
    name.includes("VIDYALANKAR")
  ) {
    return 'Central Suburbs';
  }
  if (
    name.includes("GHATKOPAR") || name.includes("MULUND") || name.includes("BHANDUP") ||
    name.includes("VIKHROLI") || name.includes("SOMAIYA")
  ) {
    return 'Eastern Suburbs';
  }
  if (name.includes("CHEMBUR") || name.includes("VASHI") || name.includes("BELAPUR")) {
    return 'Harbour / Central-East';
  }
  return 'All Mumbai';
};

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  defaultCategory,
  onNavigate,
  onSelectCollege,
  onSaveItem,
  savedItemIds = [],
  onOpenCutoff,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('query') || '';
  const activeCategory = (searchParams.get('category') as CategoryType) || defaultCategory || 'all';
  
  const [inputValue, setInputValue] = useState(query);

  const regionParam = searchParams.get('region');
  const streamParam = searchParams.get('stream');
  const fieldParam = searchParams.get('field');
  const interestParam = searchParams.get('interest');
  const industryParam = searchParams.get('industry');
  const levelParam = searchParams.get('level');
  const specializationParam = searchParams.get('specialization');
  const percentageParam = searchParams.get('percentage');
  const rangeParam = searchParams.get('range');
  const educationLevelParam = searchParams.get('educationLevel');

  const hasAppliedParams = !!(query || regionParam || streamParam || fieldParam || interestParam || industryParam || levelParam || specializationParam || percentageParam || rangeParam || educationLevelParam || defaultCategory);

  // Show results if query or any committed URL filter parameter exists
  const showResults = hasAppliedParams;

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
    if (newCategory === 'all') {
      navigate('/search');
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete('category');
      const qStr = params.toString();
      navigate(`/${newCategory}${qStr ? '?' + qStr : ''}`);
    }
  };

  const getPageHeaderInfo = () => {
    switch (activeCategory) {
      case 'colleges':
        return { badge: 'Mumbai Colleges Catalog', title: 'Explore Colleges in Mumbai' };
      case 'courses':
        return { badge: 'Mumbai Courses & Degrees', title: 'Explore Courses in Mumbai' };
      case 'careers':
        return { badge: 'Mumbai Career Pathways', title: 'Explore Careers in Mumbai' };
      case 'classes':
        return { badge: 'Mumbai Coaching Classes', title: 'Explore Coaching Classes in Mumbai' };
      case 'cutoffs':
        return { badge: 'Mumbai Cutoff Explorer', title: 'Explore Admission Cutoffs in Mumbai' };
      default:
        return { badge: 'Mumbai Student Catalog', title: 'Search & Explore Mumbai Programs' };
    }
  };

  const headerInfo = getPageHeaderInfo();

  const containerRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const getLoaderMessage = (cat: CategoryType) => {
    switch (cat) {
      case 'colleges': return 'Finding relevant colleges in Mumbai...';
      case 'courses': return 'Finding relevant courses in Mumbai...';
      case 'careers': return 'Exploring Mumbai career paths...';
      case 'classes': return 'Finding relevant classes in Mumbai...';
      case 'cutoffs': return 'Finding relevant admission cutoffs...';
      default: return "Finding what's relevant in Mumbai...";
    }
  };

  // Helper to test if a result item matches the target Mumbai region
  const matchItemRegion = (item: SearchResultItem, targetRegion: string | null | undefined): boolean => {
    if (!targetRegion || targetRegion === 'All Mumbai') return true;
    const text = [item.title, item.badgeSub || '', ...(item.meta || []), item.subtitle || ''].join(' ').toUpperCase();
    if (targetRegion === 'South Mumbai') {
      return text.includes('SOUTH MUMBAI') || text.includes('CHURCHGATE') || text.includes('CHARNI') || text.includes('FORT') || text.includes('MARINE') || text.includes('SOUTH');
    }
    if (targetRegion === 'Western Suburbs') {
      return text.includes('WESTERN') || text.includes('VILE PARLE') || text.includes('ANDHERI') || text.includes('BORIVALI') || text.includes('BANDRA') || text.includes('SUBURBS');
    }
    if (targetRegion === 'Central Suburbs') {
      return text.includes('CENTRAL') || text.includes('MATUNGA') || text.includes('DADAR') || text.includes('KURLA');
    }
    if (targetRegion === 'Eastern Suburbs') {
      return text.includes('EASTERN') || text.includes('GHATKOPAR') || text.includes('MULUND') || text.includes('BHANDUP');
    }
    if (targetRegion === 'Harbour / Central-East') {
      return text.includes('CHEMBUR') || text.includes('HARBOUR') || text.includes('BELAPUR');
    }
    return true;
  };

  const filteredResults = useMemo(() => {
    if (activeCategory === 'cutoffs' || percentageParam || rangeParam || educationLevelParam) {
      let cutoffs = FYJC_CUTOFFS;

      if (regionParam && regionParam !== 'All Mumbai') {
        cutoffs = cutoffs.filter(c => getCollegeRegion(c.collegeName) === regionParam);
      }

      if (streamParam && !streamParam.startsWith('All')) {
        cutoffs = cutoffs.filter(c => c.stream.toLowerCase() === streamParam.toLowerCase());
      }

      if (rangeParam) {
        const rangeMap: Record<string, [number, number]> = {
          '35-45': [35, 45],
          '45-55': [45, 55],
          '55-65': [55, 65],
          '65-75': [65, 75],
          '75-85': [75, 85],
          '85-95': [85, 95],
          '95-100': [95, 100],
        };
        const bounds = rangeMap[rangeParam];
        if (bounds) {
          cutoffs = cutoffs.filter(c => c.cutoff >= bounds[0] && c.cutoff <= bounds[1]);
        }
      } else if (percentageParam) {
        const userPct = parseFloat(percentageParam);
        if (!isNaN(userPct)) {
          cutoffs = cutoffs.filter(c => c.cutoff <= userPct);
        }
      }

      if (query) {
        const q = query.toLowerCase().trim();
        cutoffs = cutoffs.filter(c => c.collegeName.toLowerCase().includes(q) || c.stream.toLowerCase().includes(q));
      }

      cutoffs = [...cutoffs].sort((a, b) => b.cutoff - a.cutoff);

      return cutoffs.slice(0, 60).map(c => ({
        id: c.id,
        category: 'cutoffs' as const,
        badgeCategory: `${c.stream} Cutoff`,
        badgeSub: `${c.cutoff}% (${c.year})`,
        title: c.collegeName,
        subtitle: `FYJC Cutoff: ${c.cutoff}% • Code: ${c.choiceCode} • Category: ${c.category || 'General'}`,
        meta: [c.stream, `Region: ${getCollegeRegion(c.collegeName)}`, `Code: ${c.choiceCode}`],
        whyRelevant: `Official FYJC cutoff threshold: ${c.cutoff}%`,
        tagColor: 'tertiary' as const,
        actionLabel: 'View College Details',
        collegeSlug: c.collegeId || 'mithibai',
      }));
    }

    let raw = searchInfostaan(query, activeCategory);

    if (regionParam && regionParam !== 'All Mumbai') {
      raw = raw.filter(item => matchItemRegion(item, regionParam));
    }

    const streamFilter = streamParam || fieldParam || interestParam || industryParam || specializationParam;
    if (streamFilter && !streamFilter.startsWith('All')) {
      const keywords = streamFilter.toLowerCase().split(/[\s&,/]+/).filter(Boolean);
      raw = raw.filter(item => {
        const text = [item.title, item.badgeCategory, item.badgeSub || '', ...(item.meta || []), item.subtitle || ''].join(' ').toLowerCase();
        return keywords.some(kw => text.includes(kw));
      });
    }

    return raw;
  }, [query, activeCategory, regionParam, streamParam, fieldParam, interestParam, industryParam, specializationParam, percentageParam, rangeParam, educationLevelParam]);

  const [searchPhase, setSearchPhase] = useState<'idle' | 'understanding' | 'skeleton' | 'done'>('done');

  // Search loader sequence (fast transition)
  useEffect(() => {
    if (query) {
      setSearchPhase('done');
    }
  }, [query, activeCategory]);

  const handleActionClick = (item: SearchResultItem) => {
    if (item.category === 'colleges' && item.collegeSlug) {
      onSelectCollege(item.collegeSlug);
    } else {
      onSelectCollege('mithibai');
    }
  };

  return (
    <main
      ref={containerRef}
      className="w-full pt-20 sm:pt-24 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header & Filter Bar */}
        <div className="flex flex-col gap-6 mb-8 text-left relative z-30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{headerInfo.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB]">
                {headerInfo.title}
              </h1>
            </div>
          </div>

          {/* Input Bar with layered suggestions */}
          <div className="relative z-30 flex items-center w-full bg-white dark:bg-[#0D1828] rounded-2xl px-4 py-3 shadow-xs transition-all border border-slate-300 dark:border-[#D3B5E8]/15 focus-within:border-[#007DCC] focus-within:ring-2 focus-within:ring-[#007DCC]/20">
            <Search className="text-[#007DCC] dark:text-[#9ccaff] mr-3 w-5 h-5 shrink-0" />
            <input
              aria-label="Search opportunities, courses, and institutions in Mumbai"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search colleges, courses, careers, classes..."
              className="w-full bg-transparent font-medium text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A9B8CA]/60 focus:outline-none"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                title="Clear search"
                className="flex items-center justify-center p-1 text-slate-400 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] rounded-full transition-colors mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {/* Search Suggestions Dropdown Overlay */}
            {inputValue.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a202b] border border-slate-300 dark:border-[#D3B5E8]/20 rounded-2xl shadow-xl overflow-hidden z-40 text-left">
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
                      setInputValue('');
                      setActiveCategory('courses');
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

          {/* Category Filter Tabs (Cutoffs removed) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist">
              {[
                { id: 'all', label: 'All Results' },
                { id: 'colleges', label: 'Colleges' },
                { id: 'courses', label: 'Courses' },
                { id: 'careers', label: 'Careers' },
                { id: 'classes', label: 'Classes' },
                { id: 'cutoffs', label: 'Cutoffs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as CategoryType)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'bg-[#007DCC] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] bg-white dark:bg-[#0D1828] hover:bg-slate-100 dark:hover:bg-[#161c27] border border-slate-300 dark:border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {showResults && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenCutoff) onOpenCutoff();
                }}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#161c27] transition-all whitespace-nowrap shrink-0"
              >
                <Settings2 className="w-4 h-4" />
                More Filters
              </button>
            )}
          </div>
        </div>

        {/* Subtle Career Roadmap Banner in Careers view */}
        {activeCategory === 'careers' && showResults && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-[#F4F7FB]">Looking for step-by-step career pathways?</h4>
                <p className="text-xs text-slate-500 dark:text-[#71839A]">Explore structured Mumbai career roadmaps for CA, BMS, Tech & Design.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/career-roadmap')}
              className="px-4 py-2 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Open Career Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Results Container */}
        <div ref={resultsContainerRef} className="w-full">
          {!showResults ? (
            <div className="py-16 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#007DCC] dark:text-[#86cfff] flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                Start Exploring Mumbai Options
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#71839A] mb-6 leading-relaxed">
                Use the search bar above or pick a shortcut button on the Homepage to filter colleges, courses, classes, and careers across Mumbai.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl bg-[#007DCC] text-white text-xs font-bold hover:bg-[#006cb0] transition-colors"
              >
                Go to Homepage Shortcuts
              </button>
            </div>
          ) : searchPhase === 'understanding' ? (
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
                    No matching results found for your filters
                  </p>
                  <p className="text-xs sm:text-sm mb-4">
                    Try adjusting your Mumbai region or selecting All Mumbai.
                  </p>
                  <button
                    onClick={() => {
                      setInputValue('Hinduja');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#007DCC] text-white text-xs sm:text-sm font-semibold hover:bg-[#006cb0] transition-colors"
                  >
                    Search K.P.B. Hinduja College
                  </button>
                </div>
              ) : (
                filteredResults.map((item) => {
                  const getStreams = (): string[] => {
                    if (item.category !== 'colleges' || !item.subtitle) return [];
                    const offeredPart = item.subtitle.split('•')[0].replace(/^Offered:\s*/i, '').trim();
                    return offeredPart.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
                  };

                  const streams = getStreams();

                  return (
                  <article
                    key={item.id}
                    className="result-card-anim group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1828] hover:bg-slate-50 dark:hover:bg-[#121f33] transition-all duration-200 shadow-sm hover:shadow-md border border-slate-200 dark:border-[#D3B5E8]/12 hover:border-[#007DCC]/50 dark:hover:border-[#D3B5E8]/30 text-left cursor-pointer"
                    data-category={item.category}
                    onClick={() => handleActionClick(item)}
                  >
                    {/* Top: category type + locality */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest ${
                            item.tagColor === 'tertiary'
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
                          <span className="text-[10px] text-slate-400 dark:text-[#71839A] truncate">
                            · {item.badgeSub}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <h2 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-[#F4F7FB] leading-snug tracking-tight group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors line-clamp-2">
                        {item.title}
                      </h2>

                      {/* Description */}
                      {(item.category === 'colleges' && streams.length > 0) ? (
                        <p className="mt-1.5 text-[11px] text-slate-500 dark:text-[#71839A] truncate">
                          {streams.join(' · ')}
                        </p>
                      ) : item.subtitle && (
                        <p className="mt-1.5 text-[11px] text-slate-500 dark:text-[#71839A] truncate">
                          {item.subtitle.replace(/^Specialization:\s*/i, '')}
                        </p>
                      )}
                    </div>

                    {/* Bottom action */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[11px] sm:text-xs font-semibold text-[#007DCC] dark:text-[#86cfff]">
                        {item.category === 'colleges' ? 'Details' :
                         item.category === 'classes' ? 'View Details' :
                         item.category === 'courses' ? 'Course Info' :
                         item.category === 'careers' ? 'Career Path' :
                         item.actionLabel}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#007DCC] dark:text-[#86cfff] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </article>
                  );
                })
              )}
            </div>
          )}
        </div>

      </div>
    </main>
  );
};
