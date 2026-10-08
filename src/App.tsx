import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ScreenType, ShortlistItem } from './types';
import { INITIAL_SAVED_ITEMS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { SearchResultsScreen } from './components/SearchResultsScreen';
import { CategoryResultsPage } from './components/CategoryResultsPage';
import { CollegeDetailScreen } from './components/CollegeDetailScreen';
import { ShortlistScreen } from './components/ShortlistScreen';
import { GuidanceScreen } from './components/GuidanceScreen';
import { CareerRoadmapScreen } from './components/CareerRoadmapScreen';
import { ConnectScreen } from './components/ConnectScreen';
import { MentorDetailScreen } from './components/MentorDetailScreen';
import { CompareModal } from './components/CompareModal';
import { SignInModal } from './components/SignInModal';
import { CutoffModal } from './components/CutoffModal';
import { ClassesModal } from './components/ClassesModal';
import { CategoryFilterModal, FilterCategoryType } from './components/CategoryFilterModal';
import { MobileSidebar } from './components/MobileSidebar';
import { PencilLoader } from './components/PencilLoader';
import { Check } from 'lucide-react';
import logoImg from './assets/logo.png';
import gsap from 'gsap';
import ClassDetailScreen from './components/ClassDetailScreen';
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('mithibai');
  const [savedItems, setSavedItems] = useState<ShortlistItem[]>(INITIAL_SAVED_ITEMS);
  const allSavedItemIds = useMemo(() => savedItems.flatMap((i) => [i.id, i.collegeId || '']).filter(Boolean), [savedItems]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareColleges, setCompareColleges] = useState<{ col1: string; col2: string }>({
    col1: 'mithibai',
    col2: 'hr-college',
  });
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [isCutoffOpen, setIsCutoffOpen] = useState<boolean>(false);
  const [isClassesOpen, setIsClassesOpen] = useState<boolean>(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<FilterCategoryType>('colleges');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState<boolean>(true);

  const handleOpenCategoryFilter = (cat: FilterCategoryType) => {
    setActiveCategoryFilter(cat);
    setIsCategoryFilterOpen(true);
  };

  const handleApplyCategoryFilters = (cat: FilterCategoryType, filters: Record<string, string>) => {
    setIsCategoryFilterOpen(false);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && !v.startsWith('All')) {
        params.set(k, v);
      }
    });
    const queryString = params.toString();
    if (queryString) {
      navigate(`/${cat}?${queryString}`);
    } else {
      navigate(`/${cat}?all=true`);
    }
  };

  // View All — navigates with ONLY ?all=true, no filter params
  const handleViewAllCategory = (cat: FilterCategoryType) => {
    setIsCategoryFilterOpen(false);
    navigate(`/${cat}?all=true`);
  };

  const handleViewAllClasses = () => {
    setIsClassesOpen(false);
    navigate('/classes?all=true');
  };

  const handleViewAllCutoffs = () => {
    setIsCutoffOpen(false);
    navigate('/cutoffs?all=true');
  };

  const handleApplyClassesFilters = (filters: { interest?: string; region?: string; specialization?: string; searchQuery?: string }) => {
    setIsClassesOpen(false);
    const params = new URLSearchParams();
    if (filters.interest && !filters.interest.startsWith('All')) params.set('interest', filters.interest);
    if (filters.region && !filters.region.startsWith('All')) params.set('region', filters.region);
    if (filters.specialization && !filters.specialization.startsWith('All')) params.set('specialization', filters.specialization);
    if (filters.searchQuery) params.set('query', filters.searchQuery);
    const queryString = params.toString();
    if (queryString) {
      navigate(`/classes?${queryString}`);
    } else {
      navigate(`/classes?all=true`);
    }
  };

  const handleApplyCutoffFilters = (filters: { educationLevel?: string; selectedRangeId?: string | null; percentageExact?: string; stream?: string; region?: string; searchQuery?: string }) => {
    setIsCutoffOpen(false);
    const params = new URLSearchParams();
    if (filters.educationLevel) params.set('educationLevel', filters.educationLevel);
    if (filters.selectedRangeId) params.set('range', filters.selectedRangeId);
    if (filters.percentageExact) params.set('percentage', filters.percentageExact);
    if (filters.stream && !filters.stream.startsWith('All')) params.set('stream', filters.stream);
    if (filters.region && !filters.region.startsWith('All')) params.set('region', filters.region);
    if (filters.searchQuery) params.set('query', filters.searchQuery);
    const queryString = params.toString();
    navigate(`/cutoffs${queryString ? '?' + queryString : ''}`);
  };
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 2-second branded loading screen.
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  const handleSearch = (query: string, category: string = 'all') => {
    navigate('/');
  };

  const handleSelectCollege = (collegeSlug: string) => {
    navigate(`/college/${collegeSlug}`);
  };

  const isCollegeSaved = (id: string) => {
    return savedItems.some((item) => item.collegeId === id);
  };

  const handleToggleSaveCollege = (id: string) => {
    if (isCollegeSaved(id)) {
      setSavedItems(savedItems.filter((item) => item.collegeId !== id));
      showToast('Removed college from shortlist');
    } else {
      let collegeTitle = 'Mithibai College of Arts & Commerce';
      let region = 'Western Suburbs';
      let info = 'Vile Parle West, Mumbai • B.Com, BMS, BAF • Approx. ₹45,000/yr';
      let line = 'Western Line';

      if (id === 'hr-college') {
        collegeTitle = 'H.R. College of Commerce & Economics';
        region = 'South Mumbai';
        info = 'Churchgate, Mumbai • B.Com, BAF, BFM • Approx. ₹38,000/yr';
        line = 'South Mumbai';
      } else if (id === 'hinduja') {
        collegeTitle = 'K.P.B. Hinduja College of Commerce';
        region = 'South Mumbai';
        info = 'Charni Road, Mumbai • B.Com, BAF, BFM, BMS • Approx. ₹32,000/yr';
        line = 'Western Line (South)';
      } else if (id === 'podar') {
        collegeTitle = 'R.A. Podar College of Commerce & Economics';
        region = 'Central Mumbai';
        info = 'Matunga, Mumbai • B.Com, BMS, BAF • Approx. ₹28,000/yr';
        line = 'Central Line';
      } else if (id === 'jai-hind') {
        collegeTitle = 'Jai Hind College (Autonomous)';
        region = 'South Mumbai';
        info = 'Churchgate, Mumbai • BMS, BAF, Data Science • Approx. ₹48,000/yr';
        line = 'Western Line (Marine Drive)';
      } else if (id === 'nm-college') {
        collegeTitle = 'Narsee Monjee College of Commerce & Economics';
        region = 'Western Suburbs';
        info = 'Vile Parle West, Mumbai • B.Com, BAF, BMS • Approx. ₹42,000/yr';
        line = 'Western Line';
      } else if (id === 'xaviers') {
        collegeTitle = "St. Xavier's College (Autonomous)";
        region = 'South Mumbai';
        info = 'Fort / Dhobi Talao, Mumbai • B.Com, BMS, BA, B.Sc • Approx. ₹45,000/yr';
        line = 'Central / Western Line (CSMT)';
      }

      const newItem: ShortlistItem = {
        id: `item-${Date.now()}`,
        category: 'college',
        title: collegeTitle,
        regionBadge: region,
        badgeType: region,
        locationInfo: info,
        timeSavedText: 'Saved just now',
        lineText: line,
        iconType: 'school',
        canCompare: true,
        collegeId: id,
      };
      setSavedItems([newItem, ...savedItems]);
      showToast('Saved to shortlist!');
    }
  };

  const handleToggleSaveItem = (item: any) => {
    // Determine if it's already saved by checking ID or collegeId
    const itemCollegeId = item.collegeSlug || item.collegeId;
    const isSaved = savedItems.some(
      (i) => i.id === item.id || (itemCollegeId && i.collegeId && i.collegeId === itemCollegeId)
    );

    if (isSaved) {
      setSavedItems(
        savedItems.filter(
          (i) => i.id !== item.id && (!itemCollegeId || !i.collegeId || i.collegeId !== itemCollegeId)
        )
      );
      showToast('Removed from shortlist');
    } else {
      const isCollege = item.category === 'colleges' || item.category === 'cutoffs';
      const newItem: ShortlistItem = {
        id: item.id,
        category: isCollege ? 'college' : item.category === 'courses' ? 'course' : item.category === 'classes' ? 'class' : 'career',
        title: item.title,
        regionBadge: item.badgeSub || 'Mumbai',
        badgeType: item.badgeCategory || (isCollege ? 'COLLEGE' : 'INFO'),
        locationInfo: item.subtitle || item.badgeSub || 'Mumbai',
        timeSavedText: 'Saved just now',
        lineText: item.badgeSub || 'General',
        iconType: isCollege ? 'school' : item.category === 'courses' ? 'library_books' : 'work',
        canCompare: isCollege,
        collegeId: itemCollegeId,
      };
      setSavedItems([newItem, ...savedItems]);
      showToast('Saved to shortlist!');
    }
  };

  const handleRemoveSavedItem = (id: string) => {
    setSavedItems(savedItems.filter((item) => item.id !== id));
    showToast('Item removed from shortlist');
  };

  const handleOpenCompare = (primaryCollegeId?: string) => {
    if (primaryCollegeId) {
      setCompareColleges({
        col1: primaryCollegeId,
        col2: primaryCollegeId === 'mithibai' ? 'hr-college' : 'mithibai',
      });
    }
    setIsCompareOpen(true);
  };

  if (isBooting) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans transition-colors duration-200 bg-slate-100 dark:bg-[#070D18] relative overflow-hidden">
        {/* Logo watermark — centered behind the text */}
        <img
          src={logoImg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute select-none object-contain"
          style={{
            width: 'min(55vw, 280px)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute z-10 text-center px-4 animate-in fade-in duration-150"
          style={{
            top: '75%',
            left: '49%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB]">
            Infostaan<span className="text-[#007DCC]">.</span>
          </h1>
          <p className="text-sm sm:text-sm font-semibold tracking-wide text-slate-500 dark:text-[#71839A] mt-1.5">
            Guiding your journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D18] text-slate-900 dark:text-[#F4F7FB] flex flex-col font-sans transition-colors duration-200 selection:bg-[#007DCC]/30 selection:text-[#007DCC]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-[#1a202b] border border-slate-700 dark:border-[#007DCC]/40 text-sm text-white dark:text-[#F4F7FB] shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-[#51dcbc]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation Bar */}
      <Navbar
        savedCount={savedItems.length}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* Screen Views */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={
            <HomeScreen
              onSearch={handleSearch}
              onNavigate={(path) => navigate(path)}
              onSelectCollege={handleSelectCollege}
              onOpenCutoff={() => setIsCutoffOpen(true)}
              onOpenClasses={() => setIsClassesOpen(true)}
              onOpenCategoryFilter={handleOpenCategoryFilter}
            />
          } />
          <Route
            path="/class/:slug"
            element={<ClassDetailScreen />}
          />
          <Route path="/search" element={<Navigate to="/" replace />} />

          <Route path="/colleges" element={
            <CategoryResultsPage
              category="colleges"
              onSelectCollege={handleSelectCollege}
              savedItemIds={allSavedItemIds}
              onOpenCategoryFilter={handleOpenCategoryFilter}
              onSaveItem={handleToggleSaveItem}
            />
          } />

          <Route path="/courses" element={
            <CategoryResultsPage
              category="courses"
              onSelectCollege={handleSelectCollege}
              savedItemIds={allSavedItemIds}
              onOpenCategoryFilter={handleOpenCategoryFilter}
              onSaveItem={handleToggleSaveItem}
            />
          } />

          <Route path="/careers" element={
            <CategoryResultsPage
              category="careers"
              onSelectCollege={handleSelectCollege}
              savedItemIds={allSavedItemIds}
              onOpenCategoryFilter={handleOpenCategoryFilter}
              onSaveItem={handleToggleSaveItem}
            />
          } />

          <Route path="/classes" element={
            <CategoryResultsPage
              category="classes"
              onSelectCollege={handleSelectCollege}
              savedItemIds={allSavedItemIds}
              onOpenClasses={() => setIsClassesOpen(true)}
              onSaveItem={handleToggleSaveItem}
            />
          } />

          <Route path="/cutoffs" element={
            <SearchResultsScreen
              defaultCategory="cutoffs"
              onNavigate={(path) => navigate(path)}
              onSelectCollege={handleSelectCollege}
              savedItemIds={allSavedItemIds}
              onOpenCutoff={() => setIsCutoffOpen(true)}
              onSaveItem={handleToggleSaveItem}
            />
          } />

          <Route path="/college/:slug" element={
            <CollegeDetailScreen
              savedItems={savedItems}
              onToggleSave={handleToggleSaveCollege}
              onOpenCompare={handleOpenCompare}
              onNavigate={(path) => navigate(path)}
            />
          } />

          <Route path="/saved" element={
            <ShortlistScreen
              savedItems={savedItems}
              onRemoveItem={handleRemoveSavedItem}
              onOpenCompare={handleOpenCompare}
              onSelectCollege={handleSelectCollege}
              onNavigate={(path) => navigate(path)}
            />
          } />

          <Route path="/help-me-decide" element={
            <GuidanceScreen
              onNavigate={(path) => navigate(path)}
              onSelectCollege={handleSelectCollege}
            />
          } />

          <Route path="/career-roadmap" element={
            <CareerRoadmapScreen
              onNavigate={(path) => navigate(path)}
              onSelectCollege={handleSelectCollege}
            />
          } />

          <Route path="/mentor/:id" element={
            <MentorDetailScreen
              onNavigate={(path) => navigate(path)}
            />
          } />

          <Route path="/dashboard" element={
            <ConnectScreen
              onNavigate={(path) => navigate(path)}
            />
          } />

          {/* Legacy route fallbacks */}
          <Route path="/guidance" element={<Navigate to="/help-me-decide" replace />} />
          <Route path="/connect" element={<Navigate to="/dashboard" replace />} />
          <Route path="/explore" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Mobile Navigation Drawer / Side Bar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        savedCount={savedItems.length}
        onSearch={handleSearch}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onSelectCollege={handleSelectCollege}
        onOpenCategoryFilter={handleOpenCategoryFilter}
        onOpenClasses={() => setIsClassesOpen(true)}
        onOpenCutoff={() => setIsCutoffOpen(true)}
      />

      {/* Side-by-Side Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        defaultCollege1={compareColleges.col1}
        defaultCollege2={compareColleges.col2}
      />

      {/* Sign In / Preferences Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSave={(name, loc, stream) => {
          showToast(`Preferences updated for ${name} (${loc})`);
        }}
      />

      {/* Cutoff Modal */}
      <CutoffModal
        isOpen={isCutoffOpen}
        onClose={() => setIsCutoffOpen(false)}
        onSelectCollege={handleSelectCollege}
        onApplyFilters={handleApplyCutoffFilters}
        onViewAll={handleViewAllCutoffs}
      />

      {/* Classes Filter Wizard Modal */}
      <ClassesModal
        isOpen={isClassesOpen}
        onClose={() => setIsClassesOpen(false)}
        onApplyFilters={handleApplyClassesFilters}
        onViewAll={handleViewAllClasses}
        onViewClass={(slug) => {
          setIsClassesOpen(false);
          navigate(`/class/${slug}`);
        }}
      />

      {/* Data-driven Category Filter Modal (Colleges, Courses, Careers) */}
      <CategoryFilterModal
        isOpen={isCategoryFilterOpen}
        onClose={() => setIsCategoryFilterOpen(false)}
        category={activeCategoryFilter}
        onApplyFilters={handleApplyCategoryFilters}
        onViewAll={handleViewAllCategory}
      />

      {/* Universal Calm Footer */}
      <Footer />
    </div>
  );
}
