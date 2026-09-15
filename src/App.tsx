import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ScreenType, ShortlistItem } from './types';
import { INITIAL_SAVED_ITEMS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { SearchResultsScreen } from './components/SearchResultsScreen';
import { CollegeDetailScreen } from './components/CollegeDetailScreen';
import { ShortlistScreen } from './components/ShortlistScreen';
import { GuidanceScreen } from './components/GuidanceScreen';
import { ConnectScreen } from './components/ConnectScreen';
import { CompareModal } from './components/CompareModal';
import { SignInModal } from './components/SignInModal';
import { MobileSidebar } from './components/MobileSidebar';
import { Check } from 'lucide-react';
import logoImg from './assets/logo.png';
import gsap from 'gsap';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('mithibai');
  const [savedItems, setSavedItems] = useState<ShortlistItem[]>(INITIAL_SAVED_ITEMS);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareColleges, setCompareColleges] = useState<{ col1: string; col2: string }>({
    col1: 'mithibai',
    col2: 'hr-college',
  });
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const logoRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // Very short branded boot loader (300-800ms)
    const ctx = gsap.context(() => {
      if (logoRef.current) {
        gsap.fromTo(logoRef.current, 
          { opacity: 0, scale: 0.9 }, 
          { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    });

    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 700);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  const handleSearch = (query: string, category: string = 'all') => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (category && category !== 'all') params.set('category', category);
    navigate(`/search?${params.toString()}`);
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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#070D18]">
        <img
          ref={logoRef}
          src={logoImg}
          alt="Infostaan Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4"
        />
        <h1 className="text-xl font-bold tracking-wider uppercase text-slate-900 dark:text-[#F4F7FB] mb-2">
          Infostaan
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">Finding your way...</p>
          <div className="w-32 h-0.5 bg-slate-200 dark:bg-[#1a202b] rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-[#007DCC] dark:bg-[#9ccaff] w-full animate-progress-bar origin-left"></div>
          </div>
        </div>
        <style>{`
          @keyframes progressBar {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
          .animate-progress-bar {
            animation: progressBar 0.7s ease-out forwards;
          }
        `}</style>
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
            />
          } />
          
          <Route path="/search" element={
            <SearchResultsScreen
              onNavigate={(path) => navigate(path)}
              onSelectCollege={handleSelectCollege}
              savedItemIds={savedItems.map((i) => i.id)}
            />
          } />

          <Route path="/explore" element={<Navigate to="/search" replace />} />
          <Route path="/colleges" element={<Navigate to="/search?category=colleges" replace />} />
          <Route path="/courses" element={<Navigate to="/search?category=courses" replace />} />
          <Route path="/careers" element={<Navigate to="/search?category=careers" replace />} />
          <Route path="/internships" element={<Navigate to="/search?category=internships" replace />} />
          
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

          <Route path="/dashboard" element={
            <ConnectScreen
              onNavigate={(path) => navigate(path)}
            />
          } />

          {/* Legacy route fallbacks */}
          <Route path="/guidance" element={<Navigate to="/help-me-decide" replace />} />
          <Route path="/connect" element={<Navigate to="/dashboard" replace />} />
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

      {/* Universal Calm Footer */}
      <Footer />
    </div>
  );
}
