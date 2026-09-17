import React, { useState } from 'react';
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
import { CutoffModal } from './components/CutoffModal';
import { MobileSidebar } from './components/MobileSidebar';
import { PencilLoader } from './components/PencilLoader';
import { Check } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('mithibai');
  const [searchQuery, setSearchQuery] = useState<string>('finance');
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [savedItems, setSavedItems] = useState<ShortlistItem[]>(INITIAL_SAVED_ITEMS);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareColleges, setCompareColleges] = useState<{ col1: string; col2: string }>({
    col1: 'mithibai',
    col2: 'hr-college',
  });
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [isCutoffOpen, setIsCutoffOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSearch = (query: string, category: string = 'all') => {
    setSearchQuery(query || 'finance');
    setSearchCategory(category);
    setCurrentScreen('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCollege = (collegeId: string) => {
    setSelectedCollegeId(collegeId);
    setCurrentScreen('college-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 bg-slate-100 dark:bg-[#070D18]`}>
        <PencilLoader size="large" variant="draw" message="INFOSTAAN" subMessage="Finding your way..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D18] text-slate-900 dark:text-[#F4F7FB] flex flex-col font-sans transition-colors duration-200 selection:bg-[#007DCC]/30 selection:text-[#007DCC] relative">
      <InitialLoader />
      <DesktopDecorations />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-[#1a202b] border border-slate-700 dark:border-[#007DCC]/40 text-sm text-white dark:text-[#F4F7FB] shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-[#51dcbc]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
            />
          } />
          
          <Route path="/search" element={
            <SearchResultsScreen
              onNavigate={(path) => navigate(path)}
              onSelectCollege={handleSelectCollege}
              savedItemIds={savedItems.map((i) => i.id)}
            />
          } />

        {currentScreen === 'search' && (
          <SearchResultsScreen
            initialQuery={searchQuery}
            initialCategory={searchCategory}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCollege={handleSelectCollege}
            savedItemIds={savedItems.map((i) => i.id)}
          />
        )}

        {currentScreen === 'college-detail' && (
          <CollegeDetailScreen
            collegeId={selectedCollegeId}
            isSaved={isCollegeSaved(selectedCollegeId)}
            onToggleSave={handleToggleSaveCollege}
            onOpenCompare={handleOpenCompare}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'saved' && (
          <ShortlistScreen
            savedItems={savedItems}
            onRemoveItem={handleRemoveSavedItem}
            onOpenCompare={handleOpenCompare}
            onSelectCollege={handleSelectCollege}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'guidance' && (
          <GuidanceScreen
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCollege={handleSelectCollege}
          />
        )}

        {currentScreen === 'connect' && (
          <ConnectScreen
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </PageTransition>

      {/* Mobile Navigation Drawer / Side Bar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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

      {/* Cutoff Modal */}
      <CutoffModal
        isOpen={isCutoffOpen}
        onClose={() => setIsCutoffOpen(false)}
        onSelectCollege={handleSelectCollege}
      />

      {/* Universal Calm Footer */}
      <Footer
        onSelectCategory={(cat) => handleSearch('', cat)}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
