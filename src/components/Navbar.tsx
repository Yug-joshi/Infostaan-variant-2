import React from 'react';
import { User, Bookmark, Search, Menu, Users, Sun, Moon } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 w-full z-[100] bg-white/60 dark:bg-[#070D18]/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Mobile Hamburger Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Trigger */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation sidebar"
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007DCC]/40"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link
            id="navbar-logo-btn"
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90 text-left focus:outline-none cursor-pointer group"
            aria-label="Go to Infostaan Mumbai homepage"
          >
            <img
              src={logoImg}
              alt="Infostaan Mumbai Logo"
              className="h-8 w-auto object-contain pointer-events-none transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] hidden sm:block">
              Infostaan<span className="text-[#007DCC]">.</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-6 text-sm font-medium text-slate-600 dark:text-[#A9B8CA]">
          <Link
            to="/search"
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F4F7FB] ${
              currentPath === '/search' || currentPath.startsWith('/college/')
                ? 'text-[#007DCC] dark:text-[#19A7E8] font-semibold'
                : ''
            }`}
          >
            Explore
          </Link>
          <Link
            to="/help-me-decide"
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F4F7FB] ${
              currentPath === '/help-me-decide'
                ? 'text-[#007DCC] dark:text-[#19A7E8] font-semibold'
                : ''
            }`}
          >
            Guidance
          </Link>
          <Link
            to="/saved"
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F4F7FB] flex items-center gap-1.5 ${
              currentPath === '/saved'
                ? 'text-[#007DCC] dark:text-[#19A7E8] font-semibold'
                : ''
            }`}
          >
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#007DCC] text-white">
                {savedCount}
              </span>
            )}
          </Link>
          <Link
            to="/dashboard"
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F4F7FB] flex items-center gap-1.5 ${
              currentPath === '/dashboard'
                ? 'text-[#007DCC] dark:text-[#19A7E8] font-semibold'
                : ''
            }`}
          >
            <span>Connect</span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500 text-white uppercase tracking-wider">
              1:1
            </span>
          </Link>
        </nav>

        {/* Right Actions: Search, For Parents, Sign In */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile Search Icon */}
          <Link
            to="/search"
            className="p-2 md:hidden text-slate-700 dark:text-[#A9B8CA] hover:text-[#007DCC] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Desktop Search Icon */}
          <Link
            to="/search"
            className="hidden md:flex p-2 text-slate-600 dark:text-[#A9B8CA] hover:text-[#007DCC] dark:hover:text-[#19A7E8] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#007DCC]/40 rounded-xl"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onOpenSignIn}
            className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>For Parents</span>
          </button>

          <button
            onClick={onOpenSignIn}
            className="px-5 py-2.5 rounded-full bg-[#007DCC] hover:bg-[#19A7E8] transition-colors text-white text-sm font-bold shadow-md shadow-[#007DCC]/20 hidden sm:block"
          >
            Sign In
          </button>
          
          {/* Mobile Sign In / Profile */}
          <button
            onClick={onOpenSignIn}
            className="w-9 h-9 rounded-full bg-[#007DCC] flex items-center justify-center text-white sm:hidden"
            aria-label="Sign In"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
