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
import { CompareModal } from './components/CompareModal';
import { SignInModal } from './components/SignInModal';
import { Check, Compass, Search, School, Bookmark, HelpCircle } from 'lucide-react';

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
      const isHr = id === 'hr-college';
      const newItem: ShortlistItem = {
        id: `item-${Date.now()}`,
        category: 'college',
        title: isHr ? 'H.R. College of Commerce & Economics' : 'Mithibai College of Arts & Commerce',
        regionBadge: isHr ? 'South Mumbai' : 'Western Suburbs',
        badgeType: isHr ? 'South Mumbai' : 'Western Suburbs',
        locationInfo: isHr
          ? 'Churchgate, Mumbai • B.Com, BAF, BFM • Approx. ₹38,000/yr'
          : 'Vile Parle West, Mumbai • B.Com, BMS, BAF • Approx. ₹45,000/yr',
        timeSavedText: 'Saved just now',
        lineText: isHr ? 'South Mumbai' : 'Western Line',
        iconType: isHr ? 'account_balance' : 'school',
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

  return (
    <div className="min-h-screen bg-[#070D18] text-[#F4F7FB] flex flex-col font-sans selection:bg-[#007DCC]/30 selection:text-[#F4F7FB]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#1a202b] border border-[#007DCC]/40 text-sm text-[#F4F7FB] shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-[#51dcbc]" />
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
      />

      {/* Screen Views */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            onSearch={handleSearch}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCollege={handleSelectCollege}
            onOpenPreferences={() => setIsSignInOpen(true)}
          />
        )}

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
      </div>

      {/* Quick Screen Switcher Bar (Bottom docked floating selector for immediate inspection of all 5 screens) */}
      <aside aria-label="Screen Switcher" className="fixed bottom-4 right-4 z-40 bg-[#161c27]/95 border border-[#D3B5E8]/25 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md hidden sm:flex items-center gap-1 text-xs">
        <span className="px-2.5 text-[#8a919c] font-medium hidden md:inline">
          Screens:
        </span>
        <button
          onClick={() => {
            setCurrentScreen('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            currentScreen === 'home'
              ? 'bg-[#007DCC] text-white shadow-sm'
              : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#242a36]'
          }`}
          title="Screen 1: Search Home"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setCurrentScreen('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            currentScreen === 'search'
              ? 'bg-[#007DCC] text-white shadow-sm'
              : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#242a36]'
          }`}
          title="Screen 2: Search Results"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Results</span>
        </button>

        <button
          onClick={() => {
            setSelectedCollegeId('mithibai');
            setCurrentScreen('college-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            currentScreen === 'college-detail'
              ? 'bg-[#007DCC] text-white shadow-sm'
              : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#242a36]'
          }`}
          title="Screen 3: College Detail (Mithibai)"
        >
          <School className="w-3.5 h-3.5" />
          <span>College</span>
        </button>

        <button
          onClick={() => {
            setCurrentScreen('saved');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            currentScreen === 'saved'
              ? 'bg-[#007DCC] text-white shadow-sm'
              : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#242a36]'
          }`}
          title="Screen 4: Shortlist"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Shortlist ({savedItems.length})</span>
        </button>

        <button
          onClick={() => {
            setCurrentScreen('guidance');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            currentScreen === 'guidance'
              ? 'bg-[#007DCC] text-white shadow-sm'
              : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#242a36]'
          }`}
          title="Screen 5: Guidance Wizard"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guidance</span>
        </button>
      </aside>

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
