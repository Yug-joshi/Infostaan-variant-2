import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Building2,
  GraduationCap,
  TrendingUp,
  Layers,
  ArrowRight,
  Compass,
  BookOpen,
  Laptop,
  PenTool,
  FileText
} from 'lucide-react';
import { ScreenType } from '../types';
import gsap from 'gsap';

interface HomeScreenProps {
  onSearch: (query: string, category?: string) => void;
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSearch,
  onNavigate,
  onSelectCollege,
}) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const decorationsRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP entrance animation for the focused search layout
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
      
      if (quickLinksRef.current) {
        gsap.fromTo(
          quickLinksRef.current.children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.3,
            ease: 'power3.out',
          }
        );
      }
      
      // Floating decorations animation (only runs on desktop)
      if (decorationsRef.current) {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
          gsap.to(decorationsRef.current.children, {
            y: "random(-15, 15)",
            x: "random(-15, 15)",
            rotation: "random(-5, 5)",
            duration: "random(4, 8)",
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: {
              amount: 2,
              from: "random"
            }
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    } else {
      onSearch('finance');
    }
  };

  return (
    <main className="relative w-full flex-1 flex flex-col items-center pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200 overflow-hidden">
      
      {/* Desktop-only floating decorations */}
      <div 
        ref={decorationsRef} 
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        aria-hidden="true"
      >
        <GraduationCap className="absolute top-[15%] left-[10%] w-16 h-16 text-[#007DCC]/10 dark:text-[#9ccaff]/10 -rotate-12" />
        <BookOpen className="absolute top-[25%] right-[12%] w-20 h-20 text-[#19A7E8]/10 dark:text-[#19A7E8]/15 rotate-6" />
        <Laptop className="absolute bottom-[20%] left-[15%] w-24 h-24 text-[#091540]/5 dark:text-[#D3B5E8]/10 -rotate-6" />
        <PenTool className="absolute bottom-[30%] right-[15%] w-12 h-12 text-[#19B89A]/10 dark:text-[#19B89A]/15 rotate-12" />
        <FileText className="absolute top-[50%] left-[5%] w-14 h-14 text-slate-400/10 dark:text-slate-400/10 rotate-3" />
        <Compass className="absolute top-[45%] right-[8%] w-16 h-16 text-[#007DCC]/10 dark:text-[#9ccaff]/10 -rotate-6" />
      </div>

      {/* Mobile-only floating decorations (Restrained design) */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 block lg:hidden"
        aria-hidden="true"
      >
        <PenTool className="absolute top-[5%] left-[3%] w-7 h-7 text-[#19B89A]/20 dark:text-[#19B89A]/25 rotate-[15deg] opacity-60" />
        <GraduationCap className="absolute top-[12%] right-[2%] w-9 h-9 text-[#007DCC]/15 dark:text-[#9ccaff]/25 -rotate-[10deg] opacity-60" />
        <BookOpen className="absolute bottom-[8%] left-[4%] w-8 h-8 text-[#19A7E8]/15 dark:text-[#19A7E8]/25 rotate-6 opacity-60" />
      </div>

      <div ref={containerRef} className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mt-6 lg:mt-12">
        {/* Minimal Header */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] mb-10 leading-tight">
          What are you looking for?
        </h1>

        {/* Highlighted Search Input Box */}
        <form onSubmit={handleSubmit} className="relative w-full group mb-6">
          <div className="flex items-center bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/20 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus-within:border-[#007DCC] focus-within:ring-4 focus-within:ring-[#007DCC]/10 px-5 sm:px-6 py-2">
            <Search className="text-[#007DCC] dark:text-[#9ccaff] w-6 h-6 shrink-0" />
            <input
              id="main-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colleges, courses, or careers..."
              className="w-full bg-transparent py-4 pl-4 pr-4 text-base sm:text-lg text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A9B8CA]/60 border-none outline-none focus:ring-0"
              autoFocus
            />
            <button
              type="submit"
              aria-label="Search"
              className="shrink-0 px-6 py-3 rounded-full bg-[#007DCC] hover:bg-[#006cb0] text-white font-semibold transition-all shadow-xs flex items-center gap-2 active:scale-95"
            >
              <span>Search</span>
            </button>
          </div>
          
          {/* Search Suggestions Dropdown */}
          {query.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/20 rounded-2xl shadow-xl overflow-hidden z-50 text-left">
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => onSelectCollege('mithibai')}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#242a36] rounded-xl transition-colors flex items-center gap-3"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-[#A9B8CA]">{query} <span className="text-slate-400">in Colleges</span></span>
                </button>
                <button
                  type="button"
                  onClick={() => onSearch(query, 'courses')}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#242a36] rounded-xl transition-colors flex items-center gap-3"
                >
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-[#A9B8CA]">{query} <span className="text-slate-400">in Courses</span></span>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-[#A9B8CA] mb-8">
          <span>Popular:</span>
          <button onClick={() => onSearch('B.Com')} className="hover:text-[#007DCC] hover:underline transition-colors">B.Com</button>
          <span>•</span>
          <button onClick={() => onSelectCollege('mithibai')} className="hover:text-[#007DCC] hover:underline transition-colors">Mithibai College</button>
          <span>•</span>
          <button onClick={() => onSelectCollege('hinduja')} className="hover:text-[#007DCC] hover:underline transition-colors">Hinduja College</button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { name: 'Colleges', icon: Building2 },
            { name: 'Courses', icon: GraduationCap },
            { name: 'Careers', icon: TrendingUp },
            { name: 'Internships', icon: Layers },
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onSearch('', item.name.toLowerCase())}
                className="px-5 py-2.5 rounded-full bg-white dark:bg-[#0D1828] hover:bg-slate-100 dark:hover:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/15 text-slate-700 dark:text-[#F4F7FB] text-sm font-medium transition-all hover:border-[#007DCC] active:scale-95 shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <IconComp className="w-4 h-4 text-[#007DCC] dark:text-[#86cfff]" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Quick Explore Grid */}
      <div className="relative z-10 w-full max-w-5xl mt-24 sm:mt-32">
        <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-[#F4F7FB] text-center">Explore by Pathway</h2>
        <div ref={quickLinksRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Pathway 1 */}
          <div 
            onClick={() => onSearch('', 'colleges')}
            className="group cursor-pointer bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] rounded-2xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 text-[#007DCC] dark:text-[#86cfff]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-2 group-hover:text-[#007DCC] transition-colors">
              Top Mumbai Colleges
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#A9B8CA] leading-relaxed mb-4">
              Browse top autonomous and university-affiliated campuses.
            </p>
            <div className="flex items-center text-sm font-semibold text-[#007DCC] dark:text-[#86cfff]">
              <span>View directory</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pathway 2 */}
          <div 
            onClick={() => onNavigate('guidance')}
            className="group cursor-pointer bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] rounded-2xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 text-emerald-600 dark:text-[#51dcbc]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-2 group-hover:text-[#007DCC] transition-colors">
              Career Roadmaps
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#A9B8CA] leading-relaxed mb-4">
              Step-by-step guides from Class 12 to professional roles.
            </p>
            <div className="flex items-center text-sm font-semibold text-[#007DCC] dark:text-[#86cfff]">
              <span>Explore pathways</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pathway 3 */}
          <div 
            onClick={() => onSearch('', 'internships')}
            className="group cursor-pointer bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] rounded-2xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-2 group-hover:text-[#007DCC] transition-colors">
              Internship Hub
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#A9B8CA] leading-relaxed mb-4">
              Find articleships and early career opportunities near transit hubs.
            </p>
            <div className="flex items-center text-sm font-semibold text-[#007DCC] dark:text-[#86cfff]">
              <span>Search roles</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
