import React, { useEffect, useRef } from 'react';
import {
  X,
  Compass,
  Sparkles,
  Bookmark,
  Search,
  School,
  Sun,
  Moon,
  User,
  MapPin,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { ScreenType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import logoImg from '../assets/logo.png';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedCount: number;
  onSearch: (query: string, category?: string) => void;
  onOpenSignIn: () => void;
  onSelectCollege: (collegeId: string) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  savedCount,
  onSearch,
  onOpenSignIn,
  onSelectCollege,
}) => {
  const { theme, toggleTheme } = useTheme();
  const backdropRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Normal subtle GSAP animation on open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const ctx = gsap.context(() => {
        // Fade in backdrop
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: 'power2.out' }
        );

        // Slide in drawer smoothly from left
        gsap.fromTo(
          sidebarRef.current,
          { x: '-100%' },
          { x: '0%', duration: 0.35, ease: 'power3.out' }
        );

        // Subtle stagger on menu items
        if (navItemsRef.current) {
          const links = navItemsRef.current.querySelectorAll('.sidebar-anim-item');
          gsap.fromTo(
            links,
            { opacity: 0, x: -12 },
            {
              opacity: 1,
              x: 0,
              duration: 0.25,
              stagger: 0.035,
              ease: 'power2.out',
              delay: 0.1,
            }
          );
        }
      });

      return () => ctx.revert();
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleClose = () => {
    // Gentle exit animation before unmounting
    if (sidebarRef.current && backdropRef.current) {
      gsap.to(sidebarRef.current, {
        x: '-100%',
        duration: 0.22,
        ease: 'power2.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const navigateAndClose = (path: string) => {
    navigate(path);
    handleClose();
  };

  const selectCollegeAndClose = (collegeId: string) => {
    onSelectCollege(collegeId);
    handleClose();
  };

  const searchCategoryAndClose = (category: string) => {
    onSearch('', category);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Side Bar Drawer */}
      <div
        ref={sidebarRef}
        className="relative w-[85%] max-w-sm h-full bg-white dark:bg-[#0D1828] border-r border-slate-200 dark:border-[#D3B5E8]/15 shadow-2xl flex flex-col z-10 text-slate-900 dark:text-[#F4F7FB] transition-colors duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#D3B5E8]/15 flex items-center justify-between">
          <button
            type="button"
            id="mobile-sidebar-logo-btn"
            onClick={() => navigateAndClose('/')}
            className="flex items-center gap-3 text-left hover:opacity-85 transition-opacity cursor-pointer focus:outline-none group"
            aria-label="Go to Infostaan Mumbai homepage"
          >
            <img
              src={logoImg}
              alt="Infostaan Mumbai Logo"
              className="h-7 w-auto object-contain pointer-events-none transition-transform duration-200 group-hover:scale-105"
            />
          </button>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close navigation sidebar"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161c27] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div ref={navItemsRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Main Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8a919c] px-3 mb-2 block">
              Navigation
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => navigateAndClose('/')}
                className={`sidebar-anim-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${currentPath === '/'
                  ? 'bg-[#007DCC] text-white shadow-xs'
                  : 'text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-100 dark:hover:bg-[#161c27] hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Explore & Search</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => navigateAndClose('/help-me-decide')}
                className={`sidebar-anim-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${currentPath === '/help-me-decide'
                  ? 'bg-[#007DCC] text-white shadow-xs'
                  : 'text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-100 dark:hover:bg-[#161c27] hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
                  <span>Career Roadmap & Guide</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  New
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigateAndClose('/dashboard')}
                className={`sidebar-anim-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${currentPath === '/dashboard'
                  ? 'bg-[#007DCC] text-white shadow-xs'
                  : 'text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-100 dark:hover:bg-[#161c27] hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Infostaan Connect</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => navigateAndClose('/saved')}
                className={`sidebar-anim-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${currentPath === '/saved'
                  ? 'bg-[#007DCC] text-white shadow-xs'
                  : 'text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-100 dark:hover:bg-[#161c27] hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 shrink-0" />
                  <span>Shortlist & Comparison</span>
                </div>
                {savedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-[#007DCC] dark:text-[#86cfff]">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigateAndClose('/search')}
                className={`sidebar-anim-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${currentPath === '/search'
                  ? 'bg-[#007DCC] text-white shadow-xs'
                  : 'text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-100 dark:hover:bg-[#161c27] hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 shrink-0" />
                  <span>All Mumbai Results</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8a919c] px-3 mb-2 block">
              Quick Filter By Type
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Colleges', id: 'colleges', icon: School },
                { label: 'Courses', id: 'courses', icon: GraduationCap },
                { label: 'Careers', id: 'careers', icon: Briefcase },
                { label: 'Internships', id: 'internships', icon: Layers },
              ].map((c) => {
                const IconComponent = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => searchCategoryAndClose(c.id)}
                    className="sidebar-anim-item p-2.5 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200/80 dark:border-white/5 hover:border-[#007DCC] dark:hover:border-[#007DCC] flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-[#A9B8CA] hover:text-[#007DCC] dark:hover:text-white transition-all text-left"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-[#007DCC] dark:text-[#86cfff]" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top Mumbai Colleges Shortcuts */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8a919c] px-3 mb-2 block">
              Top Mumbai Institutions
            </span>
            <div className="space-y-1.5">
              {[
                {
                  id: 'hinduja',
                  name: 'K.P.B. Hinduja College',
                  area: 'Charni Road • CA Schedule',
                },
                {
                  id: 'mithibai',
                  name: 'Mithibai College',
                  area: 'Vile Parle • Autonomous',
                },
                {
                  id: 'podar',
                  name: 'R.A. Podar College',
                  area: 'Matunga • Central Line',
                },
                {
                  id: 'hr-college',
                  name: 'H.R. College',
                  area: 'Churchgate • Finance',
                },
                {
                  id: 'jai-hind',
                  name: 'Jai Hind College',
                  area: 'Marine Drive • Placements',
                },
              ].map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => selectCollegeAndClose(col.id)}
                  className="sidebar-anim-item w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200/60 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#1f2838] transition-colors text-left group"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-[#F4F7FB] group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors">
                      {col.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-[#A9B8CA]">
                      {col.area}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#007DCC] transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-[#D3B5E8]/15 bg-slate-50/70 dark:bg-[#101926] flex items-center justify-between gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-[#161c27] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-white shadow-2xs transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Profile / Preferences */}
          <button
            type="button"
            onClick={() => {
              onOpenSignIn();
              handleClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
