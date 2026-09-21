import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Building2, MapPin, GraduationCap, Settings2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CategoryType, SearchResultItem } from '../types';
import { searchInfostaan } from '../lib/searchEngine';
import { PencilLoader } from './PencilLoader';
import { SkeletonResultCards } from './SkeletonResultCards';
import gsap from 'gsap';

interface FilterState {
  // Colleges
  collegeStudyArea?: string | null;
  collegeLevel?: string | null; // 10th, 12th, Graduate
  collegePriority?: string | null;
  collegeLocality?: string | null;
  collegeFee?: string | null;
  
  // Courses
  courseInterest?: string | null;
  courseType?: string | null;
  courseLevel?: string | null;
  courseGoal?: string | null;
  
  // Classes
  classSubject?: string | null;
  classLevel?: string | null;
  classLocality?: string | null;
  classMode?: string | null;
  
  // Careers
  careerInterest?: string | null;
  careerActivity?: string | null;
  careerEducation?: string | null;
  careerWorkType?: string | null;
}

interface SearchResultsScreenProps {
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
  onSaveItem?: (item: SearchResultItem) => void;
  savedItemIds?: string[];
  onOpenCutoff?: () => void;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  onNavigate,
  onSelectCollege,
  onSaveItem,
  savedItemIds = [],
  onOpenCutoff,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('query') || '';
  const activeCategory = (searchParams.get('category') as CategoryType) || 'all';
  
  const [inputValue, setInputValue] = useState(query);
  const [searchPhase, setSearchPhase] = useState<'idle' | 'understanding' | 'skeleton' | 'done'>('idle');

  // Filter-First State
  const [pendingFilters, setPendingFilters] = useState<FilterState>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);
  const [hasSubmittedFilters, setHasSubmittedFilters] = useState(false);
  
  const showResults = !!query || hasSubmittedFilters || activeCategory === 'cutoffs';
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // If query changes externally, show results
  useEffect(() => {
    if (query) {
      setHasSubmittedFilters(true);
    }
  }, [query]);

  // Reset to questions when changing tabs if there's no active query
  useEffect(() => {
    if (!query) {
      setHasSubmittedFilters(false);
      setPendingFilters({});
      setAppliedFilters(null);
    }
  }, [activeCategory, query]);

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
    let raw = searchInfostaan(query, activeCategory);
    
    if (!appliedFilters && !query && activeCategory !== 'cutoffs') return [];
    
    if (activeCategory === 'colleges' && appliedFilters) {
      if (appliedFilters.collegeStudyArea) {
        const keywords = appliedFilters.collegeStudyArea.split('/').map(k => k.trim().toLowerCase());
        raw = raw.filter(item => {
          const text = [item.title, item.badgeCategory, item.badgeSub, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
          return keywords.some(kw => text.includes(kw));
        });
      }
      if (appliedFilters.collegeLocality && appliedFilters.collegeLocality !== 'Anywhere in Mumbai') {
        const loc = appliedFilters.collegeLocality.toLowerCase();
        raw = raw.filter(item => {
          const text = [item.title, item.badgeCategory, item.badgeSub, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
          return text.includes(loc);
        });
      }
      if (appliedFilters.collegeFee && appliedFilters.collegeFee !== 'No Limit') {
        raw = raw.filter(item => {
          const feeMatch = item.subtitle?.match(/₹([0-9,]+)/);
          if (!feeMatch) return true;
          const fee = parseInt(feeMatch[1].replace(/,/g, ''), 10);
          if (appliedFilters.collegeFee === 'Under ₹25k') return fee <= 25000;
          if (appliedFilters.collegeFee === '₹25k - ₹50k') return fee > 25000 && fee <= 50000;
          if (appliedFilters.collegeFee === '₹50k - ₹1 Lakh') return fee > 50000 && fee <= 100000;
          if (appliedFilters.collegeFee === 'Over ₹1 Lakh') return fee > 100000;
          return true;
        });
      }
    } else if (activeCategory === 'courses' && appliedFilters) {
      if (appliedFilters.courseInterest) {
        const kw = appliedFilters.courseInterest.toLowerCase();
        raw = raw.filter(item => {
          const text = [item.title, item.subtitle, ...(item.meta || []), item.whyRelevant].join(' ').toLowerCase();
          return text.includes(kw);
        });
      }
      if (appliedFilters.courseType) {
        const kw = appliedFilters.courseType.toLowerCase();
        raw = raw.filter(item => {
          const text = [item.title, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
          return text.includes(kw) || (kw === 'degree' && text.includes('undergraduate'));
        });
      }
      if (appliedFilters.courseLevel) {
        const kw = appliedFilters.courseLevel.split('/')[0].trim().toLowerCase();
        raw = raw.filter(item => {
          const text = [item.title, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
          return text.includes(kw) || text.includes('undergraduate') || text.includes('degree');
        });
      }
    } else if (activeCategory === 'classes' && appliedFilters) {
      if (appliedFilters.classSubject) {
        const kw = appliedFilters.classSubject.toLowerCase();
        raw = raw.filter(item => {
           const text = [item.title, item.badgeCategory, item.badgeSub, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
           return text.includes(kw);
        });
      }
      if (appliedFilters.classLevel) {
        const levelLower = appliedFilters.classLevel.split('/')[0].trim().toLowerCase();
        raw = raw.filter(item => {
           const text = [item.title, item.badgeCategory, item.badgeSub, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
           return text.includes(levelLower) || text.includes('standard') || text.includes('class') || text.includes('board');
        });
      }
      if (appliedFilters.classLocality && appliedFilters.classLocality !== 'Anywhere in Mumbai') {
        const loc = appliedFilters.classLocality.toLowerCase();
        raw = raw.filter(item => {
           const text = [item.title, item.badgeCategory, item.badgeSub, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
           return text.includes(loc);
        });
      }
      if (appliedFilters.classMode && appliedFilters.classMode !== 'Either') {
        const mode = appliedFilters.classMode.toLowerCase();
        raw = raw.filter(item => {
           const text = [item.title, item.badgeCategory, item.badgeSub, item.subtitle, ...(item.meta || [])].join(' ').toLowerCase();
           return text.includes(mode);
        });
      }
    } else if (activeCategory === 'careers' && appliedFilters) {
      if (appliedFilters.careerInterest) {
        const kw = appliedFilters.careerInterest.toLowerCase();
        raw = raw.filter(item => {
          const text = [item.title, item.badgeSub, item.whyRelevant, ...(item.meta || [])].join(' ').toLowerCase();
          return text.includes(kw);
        });
      }
      if (appliedFilters.careerActivity) {
        const kw = appliedFilters.careerActivity.toLowerCase();
        raw = raw.filter(item => {
          const text = [item.title, item.whyRelevant, ...(item.meta || [])].join(' ').toLowerCase();
          if (kw.includes('number')) return text.includes('finance') || text.includes('accounting') || text.includes('audit');
          if (kw.includes('research')) return text.includes('research') || text.includes('analysis');
          if (kw.includes('people')) return text.includes('management') || text.includes('marketing') || text.includes('hr');
          return true;
        });
      }
      if (appliedFilters.careerWorkType) {
        const kw = appliedFilters.careerWorkType.toLowerCase();
        raw = raw.filter(item => {
          const text = [item.title, item.whyRelevant, ...(item.meta || [])].join(' ').toLowerCase();
          if (kw.includes('corporate')) return text.includes('corporate') || text.includes('bank') || text.includes('finance');
          if (kw.includes('creative')) return text.includes('media') || text.includes('design') || text.includes('marketing');
          return true;
        });
      }
    }
    
    return raw;
  }, [query, activeCategory, appliedFilters]);

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

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [query, activeCategory]);

  // Subtle GSAP animations when results change (only when done)
  useEffect(() => {
    if (searchPhase === 'done' && resultsContainerRef.current) {
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
  }, [filteredResults, searchPhase]);

  const handleActionClick = (item: SearchResultItem) => {
    if (item.category === 'colleges') {
      onSelectCollege(item.collegeId || 'hinduja');
    } else if (item.category === 'cutoffs') {
      if (onOpenCutoff) {
        onOpenCutoff();
      }
    } else {
      onNavigate('/help-me-decide');
    }
  };

  const renderClassForm = () => {
    const subjects = ['Mathematics', 'Science', 'Commerce', 'Accounts', 'Coding / IT', 'CA', 'JEE', 'NEET', 'Languages', 'Design'];
    const levels = ['School', '10th', '12th', 'College', 'Graduate', 'Working'];
    const localities = ['Anywhere in Mumbai', 'Andheri', 'Borivali', 'Bandra', 'Dadar', 'Ghatkopar', 'Powai', 'South Mumbai'];
    const modes = ['Offline', 'Online', 'Either'];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What do you want to learn or prepare for?</h3>
          <div className="flex flex-wrap gap-2">
            {subjects.map(opt => (
              <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, classSubject: prev.classSubject === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.classSubject === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        {pendingFilters.classSubject && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What's your current level?</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map(opt => (
                <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, classLevel: prev.classLevel === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.classLevel === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
        {pendingFilters.classLevel && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">Where do you want to attend?</h3>
              <select 
                value={pendingFilters.classLocality || ''}
                onChange={(e) => setPendingFilters(prev => ({ ...prev, classLocality: e.target.value || null }))}
                className="w-full max-w-sm px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-[#161c27] text-slate-900 dark:text-[#F4F7FB] border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#007DCC] focus:ring-1 focus:ring-[#007DCC]"
              >
                <option value="">Select a locality in Mumbai...</option>
                {localities.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">How do you want to learn?</h3>
              <div className="flex flex-wrap gap-2">
                {modes.map(opt => (
                  <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, classMode: prev.classMode === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.classMode === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCollegeForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What do you want to study?</h3>
        <div className="flex flex-wrap gap-2">
          {['Commerce', 'Science', 'Arts', 'IT / Technology', 'Management', 'Law', 'Other'].map(opt => (
            <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, collegeStudyArea: prev.collegeStudyArea === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.collegeStudyArea === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      {pendingFilters.collegeStudyArea && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">Where are you in your education?</h3>
          <div className="flex flex-wrap gap-2">
            {['10th / SSC', '12th / HSC', 'Graduate'].map(opt => (
              <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, collegeLevel: prev.collegeLevel === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.collegeLevel === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {pendingFilters.collegeLevel && (
        <div className="animate-fade-in space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">Where in Mumbai would you prefer to study?</h3>
            <select 
              value={pendingFilters.collegeLocality || ''}
              onChange={(e) => setPendingFilters(prev => ({ ...prev, collegeLocality: e.target.value || null }))}
              className="w-full max-w-sm px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-[#161c27] text-slate-900 dark:text-[#F4F7FB] border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#007DCC] focus:ring-1 focus:ring-[#007DCC]"
            >
              <option value="">Select a locality...</option>
              {['Anywhere in Mumbai', 'South Mumbai', 'Western Suburbs', 'Central Mumbai', 'Andheri', 'Vile Parle', 'Churchgate', 'Matunga', 'Charni Road'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">Approximate Budget (Per Year)</h3>
            <div className="flex flex-wrap gap-2">
              {['Under ₹25k', '₹25k - ₹50k', '₹50k - ₹1 Lakh', 'Over ₹1 Lakh', 'No Limit'].map(opt => (
                <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, collegeFee: prev.collegeFee === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.collegeFee === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCourseForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What area interests you?</h3>
        <div className="flex flex-wrap gap-2">
          {['Commerce', 'Finance', 'Technology', 'Science', 'Management', 'Design', 'Media', 'Law', 'Other'].map(opt => (
            <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, courseInterest: prev.courseInterest === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.courseInterest === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      {pendingFilters.courseInterest && (
        <div className="animate-fade-in space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What are you looking for?</h3>
            <div className="flex flex-wrap gap-2">
              {['Degree', 'Professional Course', 'Skill Course', 'Certification', 'Exam Preparation'].map(opt => (
                <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, courseType: prev.courseType === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.courseType === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {pendingFilters.courseType && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What's your current level?</h3>
              <div className="flex flex-wrap gap-2">
                {['10th', '12th', 'Graduate', 'Working'].map(opt => (
                  <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, courseLevel: prev.courseLevel === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.courseLevel === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCareerForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What are you interested in?</h3>
        <div className="flex flex-wrap gap-2">
          {['Finance', 'Technology', 'Business', 'Design', 'Law', 'Media', 'Science', 'Other'].map(opt => (
            <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, careerInterest: prev.careerInterest === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.careerInterest === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      {pendingFilters.careerInterest && (
        <div className="animate-fade-in space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What do you enjoy doing?</h3>
            <div className="flex flex-wrap gap-2">
              {['Working with numbers', 'Building things', 'Solving problems', 'Creating things', 'Working with people', 'Researching / analysing', 'Leading / managing'].map(opt => (
                <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, careerActivity: prev.careerActivity === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.careerActivity === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {pendingFilters.careerActivity && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">Where are you in your education?</h3>
              <div className="flex flex-wrap gap-2">
                {['10th / SSC', '12th / HSC', 'Graduate', 'Working'].map(opt => (
                  <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, careerEducation: prev.careerEducation === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.careerEducation === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {pendingFilters.careerEducation && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F4F7FB] mb-3">What kind of work interests you?</h3>
              <div className="flex flex-wrap gap-2">
                {['Corporate', 'Creative', 'Technical', 'Business', 'Public-facing'].map(opt => (
                  <button key={opt} onClick={() => setPendingFilters(prev => ({ ...prev, careerWorkType: prev.careerWorkType === opt ? null : opt }))} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pendingFilters.careerWorkType === opt ? 'bg-[#007DCC] text-white shadow-xs' : 'bg-slate-50 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC]/50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <main
      ref={containerRef}
      className="w-full pt-20 sm:pt-24 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header & Filter Bar (Left-aligned, free-flow layout) */}
        <div className="flex flex-col gap-6 mb-8 text-left relative z-[60]">
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
          </div>

          {/* Input Bar */}
          <div className="relative z-[60] flex items-center w-full bg-white dark:bg-[#0D1828] rounded-2xl px-4 py-3 shadow-xs transition-all border border-slate-300 dark:border-[#D3B5E8]/15 focus-within:border-[#007DCC] focus-within:ring-2 focus-within:ring-[#007DCC]/20">
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
                onClick={() => setIsFilterModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#161c27] transition-all whitespace-nowrap shrink-0"
              >
                <Settings2 className="w-4 h-4" />
                More Filters
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Loading Sequence / Results Container */}
        <div ref={resultsContainerRef} className="w-full">
          {!showResults ? (
            <div className="py-6 sm:py-10 animate-fade-in text-left">
              <div className="max-w-2xl bg-white dark:bg-[#0D1828] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm mx-auto sm:mx-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">Tell us what you're looking for</h2>
                <p className="text-sm text-slate-500 dark:text-[#71839A] mb-8">Select a few options below so we can recommend the best matches in Mumbai.</p>
                {activeCategory === 'classes' ? renderClassForm() : activeCategory === 'courses' ? renderCourseForm() : activeCategory === 'careers' ? renderCareerForm() : renderCollegeForm()}

                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => {
                      setSearchPhase('idle');
                      setAppliedFilters(pendingFilters);
                      setHasSubmittedFilters(true);
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#007DCC] hover:bg-[#006cb0] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>{activeCategory === 'careers' ? 'Explore Careers' : `Find ${activeCategory === 'classes' ? 'Classes' : activeCategory === 'colleges' ? 'Colleges' : activeCategory === 'courses' ? 'Courses' : 'Results'}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
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
                filteredResults.map((item) => {
                  // For college cards: extract just stream tokens from subtitle
                  // subtitle format: "Offered: B.Com, BMS, BAF • Approx. ₹X/yr"
                  // We only want the part before the first "•"
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

                      {/* Name — primary identity */}
                      <h2 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-[#F4F7FB] leading-snug tracking-tight group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors line-clamp-2">
                        {item.title}
                      </h2>

                      {/* Concise description */}
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

                    {/* Bottom: Details action */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[11px] sm:text-xs font-semibold text-[#007DCC] dark:text-[#86cfff]">
                        {item.category === 'colleges' ? 'Details' :
                         item.category === 'classes' ? 'View Details' :
                         item.category === 'courses' ? 'Course Info' :
                         item.category === 'careers' ? 'Career Path' :
                         item.category === 'cutoffs' ? 'View Cutoff' :
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

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0D1828] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">Filter Results</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-slate-600 dark:text-[#A9B8CA]" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
               {activeCategory === 'classes' ? renderClassForm() : activeCategory === 'courses' ? renderCourseForm() : activeCategory === 'careers' ? renderCareerForm() : renderCollegeForm()}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
              <button
                onClick={() => {
                  setPendingFilters({});
                }}
                className="px-6 py-3 font-semibold text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setAppliedFilters(pendingFilters);
                  setHasSubmittedFilters(true);
                  setIsFilterModalOpen(false);
                }}
                className="px-8 py-3 bg-[#007DCC] hover:bg-[#006cb0] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
