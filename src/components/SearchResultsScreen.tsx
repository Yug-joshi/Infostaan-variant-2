import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ArrowLeft, Building2, MapPin, GraduationCap, Settings2, Compass, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CategoryType, SearchResultItem } from '../types';
import { searchInfostaan } from '../lib/searchEngine';
import { PencilLoader } from './PencilLoader';
import { SkeletonResultCards } from './SkeletonResultCards';

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

  // Filter-First & Multi-Step Questionnaire State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [pendingFilters, setPendingFilters] = useState<FilterState>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);
  const [hasSubmittedFilters, setHasSubmittedFilters] = useState(false);
  
  const showResults = !!query || hasSubmittedFilters;
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // If query changes externally, show results
  useEffect(() => {
    if (query) {
      setHasSubmittedFilters(true);
    }
  }, [query]);

  // Reset to questionnaire when changing category tabs if there's no active query
  useEffect(() => {
    if (!query) {
      setHasSubmittedFilters(false);
      setWizardStep(1);
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
      case 'colleges': return 'Finding relevant colleges in Mumbai...';
      case 'courses': return 'Finding relevant courses in Mumbai...';
      case 'careers': return 'Exploring Mumbai career paths...';
      case 'classes': return 'Finding relevant classes in Mumbai...';
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
    return true; // Fallback: allow item if region is unknown to prevent data loss
  };

  const filteredResults = useMemo(() => {
    let raw = searchInfostaan(query, activeCategory);
    
    if (!appliedFilters && !query) return [];
    
    if (appliedFilters) {
      // Region filter matching
      if (appliedFilters.region) {
        raw = raw.filter(item => matchItemRegion(item, appliedFilters.region));
      }

      if (activeCategory === 'classes') {
        if (appliedFilters.subjectCategory || appliedFilters.subject) {
          const keywords = [appliedFilters.subjectCategory, appliedFilters.subject].filter(Boolean).map(k => k!.toLowerCase());
          raw = raw.filter(item => {
             const text = [item.title, item.badgeCategory, item.badgeSub, ...(item.meta || [])].join(' ').toLowerCase();
             return keywords.some(kw => text.includes(kw));
          });
        }
        if (appliedFilters.level) {
          const levelLower = appliedFilters.level.split('/')[0].trim().toLowerCase();
          raw = raw.filter(item => {
             const text = [item.title, item.badgeCategory, item.badgeSub, ...(item.meta || [])].join(' ').toLowerCase();
             return text.includes(levelLower) || text.includes('standard') || text.includes('class') || text.includes('board');
          });
        }
      } else {
        const interest = appliedFilters.interest || appliedFilters.domain;
        if (interest) {
          const keywords = interest.split('/').map(k => k.trim().toLowerCase());
          raw = raw.filter(item => {
            const text = [item.title, item.badgeCategory, item.badgeSub, ...(item.meta || [])].join(' ').toLowerCase();
            return keywords.some(kw => text.includes(kw));
          });
        }
        const grade = appliedFilters.grade || appliedFilters.degreeLevel;
        if (grade) {
          const gradeLower = grade.split('/')[0].trim().toLowerCase();
          raw = raw.filter(item => {
            const text = [item.title, item.badgeCategory, item.badgeSub, ...(item.meta || [])].join(' ').toLowerCase();
            return text.includes(gradeLower) || 
                   text.includes('degree') || 
                   text.includes('college') ||
                   text.includes('university') ||
                   text.includes('undergraduate') ||
                   text.includes('postgraduate');
          });
        }
        if (appliedFilters.fee && appliedFilters.fee !== 'No Limit') {
          raw = raw.filter(item => {
            const feeMatch = item.subtitle?.match(/₹([0-9,]+)/);
            if (!feeMatch) return true;
            const fee = parseInt(feeMatch[1].replace(/,/g, ''), 10);
            if (appliedFilters.fee === 'Under ₹25k') return fee <= 25000;
            if (appliedFilters.fee === '₹25k - ₹50k') return fee > 25000 && fee <= 50000;
            if (appliedFilters.fee === '₹50k - ₹1 Lakh') return fee > 50000 && fee <= 100000;
            if (appliedFilters.fee === 'Over ₹1 Lakh') return fee > 100000;
            return true;
          });
        }
      }
    }
    return raw;
  }, [query, activeCategory, appliedFilters]);

  // Search loader sequence
  useEffect(() => {
    setSearchPhase('understanding');
    
    const timer1 = setTimeout(() => {
      setSearchPhase('skeleton');
    }, 2500);
    
    const timer2 = setTimeout(() => {
      setSearchPhase('done');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [query, activeCategory]);

  const handleActionClick = (item: SearchResultItem) => {
    if (item.category === 'colleges' && item.collegeSlug) {
      onSelectCollege(item.collegeSlug);
    } else {
      onSelectCollege('mithibai');
    }
  };

  const subjectCategories = ['Commerce & Professional', 'Science & Engineering', 'Arts & Humanities'];
  const subjectsMap: Record<string, string[]> = {
    'Commerce & Professional': ['CA Foundation / Inter', 'CS Executive', 'CMA', 'B.Com / BAF / BMS Coaching', '11th & 12th Commerce'],
    'Science & Engineering': ['JEE Main & Advanced', 'NEET UG', 'MHT-CET', '11th & 12th Science', 'Engineering Maths'],
    'Arts & Humanities': ['Law Entrance (MH CET 3/5 Yr)', 'CLAT', 'Psychology & Mass Comm', 'Economics Coaching', 'Design Entrances (NID/NIFT)']
  };
  const levels = ['Class 11th / 12th', 'Undergraduate', 'Postgraduate / Professional'];

  const handleCommitFilters = () => {
    setSearchPhase('idle');
    setAppliedFilters({ ...pendingFilters });
    setHasSubmittedFilters(true);
    setIsFilterModalOpen(false);
  };

  // ── COLLEGES MULTI-STEP WIZARD ──
  const renderCollegeWizard = () => (
    <div className="space-y-6">
      {/* Progress Track */}
      <div className="flex items-center justify-between text-xs font-bold text-[#007DCC] uppercase tracking-wider mb-2">
        <span>Step {wizardStep} of 3: {wizardStep === 1 ? 'Interest / Stream' : wizardStep === 2 ? 'Education Level' : 'Region & Fees'}</span>
        <span>{Math.round((wizardStep / 3) * 100)}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-[#007DCC] transition-all duration-300" style={{ width: `${(wizardStep / 3) * 100}%` }} />
      </div>

      {wizardStep === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider">
            Step 1: What are you interested in?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Commerce', 'Science', 'Arts', 'Tech / IT', 'Law', 'Design'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPendingFilters((prev) => ({ ...prev, interest: prev.interest === opt ? null : opt }))}
                className={`p-4 rounded-2xl border text-left text-sm font-bold transition-all ${
                  pendingFilters.interest === opt
                    ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                    : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider">
            Step 2: Current Grade / Education Level
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['10th / SSC', '12th / HSC', 'Graduate'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPendingFilters((prev) => ({ ...prev, grade: prev.grade === opt ? null : opt }))}
                className={`p-4 rounded-2xl border text-left text-sm font-bold transition-all ${
                  pendingFilters.grade === opt
                    ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                    : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {wizardStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider mb-3">
              Step 3: Preferred Mumbai Region
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MUMBAI_REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setPendingFilters((prev) => ({ ...prev, region: prev.region === r ? null : r }))}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                    pendingFilters.region === r
                      ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                      : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider mb-3">
              Annual Fees Range
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Under ₹25k', '₹25k - ₹50k', '₹50k - ₹1 Lakh', 'Over ₹1 Lakh', 'No Limit'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPendingFilters((prev) => ({ ...prev, fee: prev.fee === opt ? null : opt }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    pendingFilters.fee === opt
                      ? 'bg-[#007DCC] text-white'
                      : 'bg-slate-100 dark:bg-[#161c27] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
        {wizardStep > 1 ? (
          <button
            type="button"
            onClick={() => setWizardStep(wizardStep - 1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-3">
          {wizardStep < 3 && (
            <button
              type="button"
              onClick={() => setWizardStep(wizardStep + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-[#F4F7FB] text-xs font-bold"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCommitFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>Find Colleges</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // ── COURSES MULTI-STEP WIZARD ──
  const renderCourseWizard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-bold text-[#007DCC] uppercase tracking-wider mb-2">
        <span>Step {wizardStep} of 3: {wizardStep === 1 ? 'Interest / Study Domain' : wizardStep === 2 ? 'Degree Level' : 'Mumbai Region'}</span>
        <span>{Math.round((wizardStep / 3) * 100)}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-[#007DCC] transition-all duration-300" style={{ width: `${(wizardStep / 3) * 100}%` }} />
      </div>

      {wizardStep === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider">
            Step 1: Interest / Study Domain
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Commerce', 'Finance', 'Media', 'Tech', 'Management', 'Arts'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPendingFilters((prev) => ({ ...prev, domain: prev.domain === opt ? null : opt }))}
                className={`p-4 rounded-2xl border text-left text-sm font-bold transition-all ${
                  pendingFilters.domain === opt
                    ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                    : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider">
            Step 2: Degree Level / Course Type
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Undergraduate', 'Postgraduate', 'Diploma', 'Certification'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPendingFilters((prev) => ({ ...prev, degreeLevel: prev.degreeLevel === opt ? null : opt }))}
                className={`p-4 rounded-2xl border text-center text-xs font-bold transition-all ${
                  pendingFilters.degreeLevel === opt
                    ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                    : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {wizardStep === 3 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider">
            Step 3: Mumbai Region
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MUMBAI_REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setPendingFilters((prev) => ({ ...prev, region: prev.region === r ? null : r }))}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                  pendingFilters.region === r
                    ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                    : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
        {wizardStep > 1 ? (
          <button
            type="button"
            onClick={() => setWizardStep(wizardStep - 1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-3">
          {wizardStep < 3 && (
            <button
              type="button"
              onClick={() => setWizardStep(wizardStep + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-[#F4F7FB] text-xs font-bold"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCommitFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>Find Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // ── CLASSES MULTI-STEP WIZARD ──
  const renderClassWizard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-bold text-[#007DCC] uppercase tracking-wider mb-2">
        <span>Step {wizardStep} of 3: {wizardStep === 1 ? 'Interest / Coaching Category' : wizardStep === 2 ? 'Exam / Subject' : 'Level & Mumbai Region'}</span>
        <span>{Math.round((wizardStep / 3) * 100)}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-[#007DCC] transition-all duration-300" style={{ width: `${(wizardStep / 3) * 100}%` }} />
      </div>

      {wizardStep === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider">
            Step 1: What do you want to learn?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {subjectCategories.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPendingFilters((prev) => ({ ...prev, subjectCategory: prev.subjectCategory === opt ? null : opt, subject: null }))}
                className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                  pendingFilters.subjectCategory === opt
                    ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                    : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider">
            Step 2: Specific Exam or Subject
          </h3>
          {pendingFilters.subjectCategory && subjectsMap[pendingFilters.subjectCategory]?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {subjectsMap[pendingFilters.subjectCategory].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPendingFilters((prev) => ({ ...prev, subject: prev.subject === opt ? null : opt }))}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                    pendingFilters.subject === opt
                      ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                      : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Please select a category in Step 1 first, or proceed to Step 3.</p>
          )}
        </div>
      )}

      {wizardStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider mb-3">
              Step 3: Level & Mumbai Region
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {levels.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPendingFilters((prev) => ({ ...prev, level: prev.level === opt ? null : opt }))}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    pendingFilters.level === opt
                      ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                      : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-3">
              Target Mumbai Region
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MUMBAI_REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setPendingFilters((prev) => ({ ...prev, region: prev.region === r ? null : r }))}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                    pendingFilters.region === r
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
      )}

      {/* Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
        {wizardStep > 1 ? (
          <button
            type="button"
            onClick={() => setWizardStep(wizardStep - 1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-3">
          {wizardStep < 3 && (
            <button
              type="button"
              onClick={() => setWizardStep(wizardStep + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-[#F4F7FB] text-xs font-bold"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCommitFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>Find Classes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

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
                <span>Mumbai Student Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB]">
                Search & Explore Mumbai Programs
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

        {/* Dynamic Questionnaire / Results Container */}
        <div ref={resultsContainerRef} className="w-full">
          {!showResults ? (
            <div className="py-6 sm:py-10 animate-fade-in text-left">
              <div className="max-w-2xl bg-white dark:bg-[#0D1828] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm mx-auto sm:mx-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Tell us what you're looking for in Mumbai
                </h2>
                <p className="text-sm text-slate-500 dark:text-[#71839A] mb-6">
                  Select your preferences below to recommend top Mumbai matches.
                </p>

                {activeCategory === 'classes'
                  ? renderClassWizard()
                  : activeCategory === 'courses'
                  ? renderCourseWizard()
                  : renderCollegeWizard()}
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

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0D1828] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in text-left">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">Filter Results</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-slate-600 dark:text-[#A9B8CA]" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
               {activeCategory === 'classes' ? renderClassWizard() : activeCategory === 'courses' ? renderCourseWizard() : renderCollegeWizard()}
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
                onClick={handleCommitFilters}
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
