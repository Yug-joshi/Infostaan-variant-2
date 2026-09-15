import React from 'react';
import { User, Bookmark, Sun, Moon, Menu } from 'lucide-react';
import { ScreenType } from '../types';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo.png';

import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  savedCount: number;
  onOpenSignIn: () => void;
  onOpenMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenSignIn,
  onOpenMobileSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;

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

          <Link
            id="navbar-logo-btn"
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 text-left focus:outline-none cursor-pointer group"
            aria-label="Go to Infostaan Mumbai homepage"
          >
            <img
              src={logoImg}
              alt="Infostaan Mumbai Logo"
              className="h-7 sm:h-8 w-auto object-contain pointer-events-none transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-medium text-gray-600 dark:text-[#A9B8CA]">
          <Link
            to="/search"
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              currentPath === '/search' || currentPath.startsWith('/college/')
                ? 'bg-gray-100 dark:bg-[#1a202b] text-gray-900 dark:text-[#F4F7FB] font-semibold'
                : 'hover:text-gray-900 dark:hover:text-[#F4F7FB]'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/help-me-decide"
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentPath === '/help-me-decide'
                ? 'bg-gray-100 dark:bg-[#1a202b] text-gray-900 dark:text-[#F4F7FB] font-semibold'
                : 'hover:text-gray-900 dark:hover:text-[#F4F7FB]'
            }`}
          >
            <span>Guidance & Roadmaps</span>
          </Link>
          <Link
            to="/dashboard"
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentPath === '/dashboard'
                ? 'bg-gray-100 dark:bg-[#1a202b] text-gray-900 dark:text-[#F4F7FB] font-semibold'
                : 'hover:text-gray-900 dark:hover:text-[#F4F7FB]'
            }`}
          >
            <span>Infostaan Connect</span>
          </Link>
          <Link
            to="/saved"
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentPath === '/saved'
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
          </Link>
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
