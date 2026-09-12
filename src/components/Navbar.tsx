import React from 'react';
import { User, Bookmark } from 'lucide-react';
import { ScreenType } from '../types';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedCount: number;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  savedCount,
  onOpenSignIn,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#070D18]/90 backdrop-blur-xl border-b border-[#D3B5E8]/15 shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Identity */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 transition-opacity hover:opacity-90 text-left focus:outline-none"
        >
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1UJRnyY75dMTB5Z-cXZjZ3AHt6T7uaIV9eXqLfvbCpkoh6H3vtLzT72f2ELzFgBSVdzT8-paZEQSLjKKpma2NUop1U8fTGtcs4-J6mfIodKtH8dUycdls-_KKlOvC0EEraSGgAvoQBgmghFNBZIjxbUkkg16C7SI5mPgsPhNQ6cmxNXigYJ5ay7rfelrmM6GEV11vg1k6aY8fZf3RlkYWK_b54tzMXQ0BasRUUKiOCXCrWQbInnY2XgtVU"
            alt="Infostaan Mumbai Logo"
            className="h-7 sm:h-8 w-auto object-contain"
          />
          <span className="text-sm sm:text-base font-semibold tracking-tight uppercase text-[#F4F7FB] hidden sm:inline-block">
            Infostaan Mumbai
          </span>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium text-[#A9B8CA]">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentScreen === 'home' || currentScreen === 'search' || currentScreen === 'college-detail'
                ? 'bg-[#1a202b] text-[#F4F7FB] font-semibold'
                : 'hover:text-[#F4F7FB]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('guidance')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentScreen === 'guidance'
                ? 'bg-[#1a202b] text-[#F4F7FB] font-semibold'
                : 'hover:text-[#F4F7FB]'
            }`}
          >
            Guidance
          </button>
          <button
            onClick={() => onNavigate('saved')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentScreen === 'saved'
                ? 'bg-[#1a202b] text-[#F4F7FB] font-semibold'
                : 'hover:text-[#F4F7FB]'
            }`}
          >
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-[#3795e6]/20 text-[#9ccaff] border border-[#9ccaff]/30">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenSignIn}
            className="text-sm font-medium text-[#A9B8CA] hover:text-[#F4F7FB] transition-colors hidden sm:block"
          >
            Sign in
          </button>
          <button
            onClick={onOpenSignIn}
            title="User Account"
            className="w-8 h-8 rounded-full bg-[#007DCC] hover:bg-[#19A7E8] transition-colors flex items-center justify-center text-white shadow-sm"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
