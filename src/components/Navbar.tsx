import React from 'react';
import { User, Bookmark, Sun, Moon, Menu } from 'lucide-react';
import { ScreenType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedCount: number;
  onOpenSignIn: () => void;
  onOpenMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  savedCount,
  onOpenSignIn,
  onOpenMobileSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-white/95 dark:bg-[#070D18]/95 backdrop-blur-xl border-b border-gray-200 dark:border-[#D3B5E8]/15 shadow-[0_1px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.3)] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Mobile Hamburger Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Trigger */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation sidebar"
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161c27] transition-colors focus:outline-none focus:ring-2 focus:ring-[#007DCC]/40"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            type="button"
            id="navbar-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 text-left focus:outline-none cursor-pointer group"
            aria-label="Go to Infostaan Mumbai homepage"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1UJRnyY75dMTB5Z-cXZjZ3AHt6T7uaIV9eXqLfvbCpkoh6H3vtLzT72f2ELzFgBSVdzT8-paZEQSLjKKpma2NUop1U8fTGtcs4-J6mfIodKtH8dUycdls-_KKlOvC0EEraSGgAvoQBgmghFNBZIjxbUkkg16C7SI5mPgsPhNQ6cmxNXigYJ5ay7rfelrmM6GEV11vg1k6aY8fZf3RlkYWK_b54tzMXQ0BasRUUKiOCXCrWQbInnY2XgtVU"
              alt="Infostaan Mumbai Logo"
              className="h-7 sm:h-8 w-auto object-contain pointer-events-none transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-medium text-gray-600 dark:text-[#A9B8CA]">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              currentScreen === 'home' || currentScreen === 'college-detail'
                ? 'bg-gray-100 dark:bg-[#1a202b] text-gray-900 dark:text-[#F4F7FB] font-semibold'
                : 'hover:text-gray-900 dark:hover:text-[#F4F7FB]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('guidance')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentScreen === 'guidance'
                ? 'bg-gray-100 dark:bg-[#1a202b] text-gray-900 dark:text-[#F4F7FB] font-semibold'
                : 'hover:text-gray-900 dark:hover:text-[#F4F7FB]'
            }`}
          >
            <span>Guidance & Roadmaps</span>
          </button>
          <button
            onClick={() => onNavigate('connect')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentScreen === 'connect'
                ? 'bg-gray-100 dark:bg-[#1a202b] text-gray-900 dark:text-[#F4F7FB] font-semibold'
                : 'hover:text-gray-900 dark:hover:text-[#F4F7FB]'
            }`}
          >
            <span>Infostaan Connect</span>
          </button>
          <button
            onClick={() => onNavigate('saved')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentScreen === 'saved'
                ? 'bg-gray-100 dark:bg-[#1a202b] text-gray-900 dark:text-[#F4F7FB] font-semibold'
                : 'hover:text-gray-900 dark:hover:text-[#F4F7FB]'
            }`}
          >
            <span>Shortlist</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-blue-100 dark:bg-[#3795e6]/20 text-blue-700 dark:text-[#9ccaff] border border-blue-200 dark:border-[#9ccaff]/30">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions: Theme Toggle, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1a202b] dark:hover:bg-[#242a36] text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-2xs"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={onOpenSignIn}
            className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] transition-colors hidden lg:block"
          >
            Preferences
          </button>
          <button
            onClick={onOpenSignIn}
            title="User Profile & Preferences"
            aria-label="User Profile & Preferences"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] transition-colors flex items-center justify-center text-white shadow-xs"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
