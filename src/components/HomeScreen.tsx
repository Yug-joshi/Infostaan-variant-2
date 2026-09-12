import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  Compass,
  Train,
  Clock,
  Building2,
  GraduationCap,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ScreenType } from '../types';
import gsap from 'gsap';

interface HomeScreenProps {
  onSearch: (query: string, category?: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectCollege: (collegeId: string) => void;
  onOpenPreferences: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSearch,
  onNavigate,
  onSelectCollege,
  onOpenPreferences,
}) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const searchCardRef = useRef<HTMLFormElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP animations: clean, smooth micro-entrances
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero titles
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
          }
        );
      }

      // Search container
      if (searchCardRef.current) {
        gsap.fromTo(
          searchCardRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: 0.15,
            ease: 'power2.out',
          }
        );
      }

      // Quick filter chips
      if (pillsRef.current) {
        const chips = pillsRef.current.querySelectorAll('.quick-chip');
        gsap.fromTo(
          chips,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.04,
            delay: 0.25,
            ease: 'power2.out',
          }
        );
      }

      // Cards staggered entrance
      if (cardsGridRef.current) {
        const cards = cardsGridRef.current.querySelectorAll('.gsap-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            delay: 0.3,
            ease: 'power2.out',
          }
        );
      }
    }, containerRef);

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

  const handleQuickSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <main
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-20 text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
    >
      {/* Free-layout Responsive Grid Header (Left-aligned, open spatial distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 sm:mb-14">
        {/* Left / Main Column: Hero & Search Bar */}
        <div className="lg:col-span-8 flex flex-col items-start text-left">
          {/* Subtle Region Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold tracking-wider uppercase mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Mumbai Student Discovery & Guidance</span>
          </div>

          <div ref={heroRef} className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] leading-[1.15]">
              Find colleges, degrees & careers in Mumbai.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#A9B8CA] font-normal max-w-2xl leading-relaxed">
              Designed around local suburban commute lines, CA articleship schedules, autonomous cutoffs, and real industry placements.
            </p>
          </div>

          {/* Search Input Box */}
          <form
            ref={searchCardRef}
            onSubmit={handleSubmit}
            className="mt-7 w-full group"
          >
            <div className="flex items-center bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-[#007DCC] focus-within:ring-2 focus-within:ring-[#007DCC]/20 px-4 sm:px-5 py-2">
              <Search className="text-[#007DCC] dark:text-[#9ccaff] w-5 h-5 shrink-0" />
              <input
                id="main-query-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search colleges (Hinduja, Podar, Mithibai, HR), courses, careers..."
                className="w-full bg-transparent py-3.5 pl-3.5 pr-3 text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A9B8CA]/60 border-none outline-none focus:ring-0"
              />
              <button
                type="submit"
                aria-label="Search"
                className="shrink-0 px-4 sm:px-5 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Natural Queries */}
          <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-500 dark:text-[#A9B8CA]/90">
            <span className="font-semibold text-slate-700 dark:text-[#A9B8CA]">Try searching:</span>
            <button
              type="button"
              onClick={() => handleQuickSearch('Hinduja College Charni Road')}
              className="hover:text-[#007DCC] dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600 transition-colors"
            >
              Hinduja College Charni Road
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleQuickSearch('Podar College Matunga Central')}
              className="hover:text-[#007DCC] dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600 transition-colors"
            >
              Podar College Matunga Central
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleQuickSearch('CA articleship flexibility')}
              className="hover:text-[#007DCC] dark:hover:text-white underline decoration-slate-300 dark:decoration-slate-600 transition-colors"
            >
              CA articleship flexibility
            </button>
          </div>

          {/* Category Filter Pills (Aligned naturally to the left) */}
          <div ref={pillsRef} className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
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
                  className="quick-chip px-4 py-2 rounded-xl bg-white dark:bg-[#0D1828] hover:bg-slate-100 dark:hover:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/15 text-slate-700 dark:text-[#F4F7FB] text-xs sm:text-sm font-semibold transition-all hover:border-[#007DCC] active:scale-95 shadow-2xs flex items-center gap-2"
                >
                  <IconComp className="w-4 h-4 text-[#007DCC] dark:text-[#86cfff]" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic "Career Roadmap & Decider" Hero Banner */}
        <div className="lg:col-span-4 w-full">
          <div className="rounded-2xl bg-gradient-to-br from-[#091E3A] via-[#0E2C52] to-[#123E75] text-white p-6 sm:p-7 shadow-lg border border-blue-700/40 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Navigator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Career Roadmap & Mumbai College Guide
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Step-by-step pathways from Class 12 to Chartered Accountant, Investment Banking, FinTech, and Data Science with verified Mumbai degrees and internships.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row lg:flex-col gap-2.5 relative z-10">
              <button
                type="button"
                onClick={() => onNavigate('guidance')}
                className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white text-slate-900 hover:bg-blue-50 text-xs sm:text-sm font-bold transition-all shadow-md group active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#007DCC]" />
                  <span>Open Career Roadmap</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenPreferences}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Set Commute Hub & Stream</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Free-layout Responsive Section: Featured Mumbai Opportunities & Colleges */}
      <div className="w-full mt-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight">
              Featured Mumbai Institutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] mt-1">
              Top autonomous and University of Mumbai campuses with verified schedules, cutoffs, and placements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSearch('', 'colleges')}
            className="text-xs sm:text-sm font-semibold text-[#007DCC] dark:text-[#86cfff] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all Mumbai colleges</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Responsive Multi-Column Grid for Cards */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {/* Card 1: K.P.B. Hinduja College */}
          <div className="gsap-card bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] dark:hover:border-[#D3B5E8]/35 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  South Mumbai
                </span>
                <span className="text-xs text-slate-500 dark:text-[#A9B8CA] flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-emerald-600 dark:text-[#51dcbc]" />
                  <span>2 min walk</span>
                </span>
              </div>

              <div>
                <h3
                  onClick={() => onSelectCollege('hinduja')}
                  className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors cursor-pointer"
                >
                  K.P.B. Hinduja College of Commerce
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#A9B8CA] mt-0.5">
                  Charni Road East • Autonomous • University of Mumbai
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                Early morning lecture shift (6:45 AM – 10:15 AM) allows seamless CA articleship in Churchgate & Nariman Point Big 4 audit firms.
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['B.Com', 'BAF', 'BFM', 'BMS', 'BBI', 'B.Sc IT'].map((deg) => (
                  <span
                    key={deg}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#161c27] text-slate-600 dark:text-[#A9B8CA]"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-[#8a919c]">
                Cutoff: ~91%–94.5%
              </span>
              <button
                type="button"
                onClick={() => onSelectCollege('hinduja')}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#007DCC] dark:text-[#86cfff] group-hover:text-[#005a94] dark:group-hover:text-white transition-colors"
              >
                <span>View details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: R.A. Podar College */}
          <div className="gsap-card bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] dark:hover:border-[#D3B5E8]/35 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  Central Line
                </span>
                <span className="text-xs text-slate-500 dark:text-[#A9B8CA] flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-emerald-600 dark:text-[#51dcbc]" />
                  <span>5 min walk</span>
                </span>
              </div>

              <div>
                <h3
                  onClick={() => onSelectCollege('podar')}
                  className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors cursor-pointer"
                >
                  R.A. Podar College of Commerce & Economics
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#A9B8CA] mt-0.5">
                  Matunga Central • Autonomous • NAAC A+
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                Central Mumbai’s premier benchmark for commerce and actuarial studies. High concentration of CA rankers and rigorous academic reputation.
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['B.Com', 'BMS', 'BAF', 'BFM', 'BAS Actuarial'].map((deg) => (
                  <span
                    key={deg}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#161c27] text-slate-600 dark:text-[#A9B8CA]"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-[#8a919c]">
                Cutoff: ~93%–96%
              </span>
              <button
                type="button"
                onClick={() => onSelectCollege('podar')}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#007DCC] dark:text-[#86cfff] group-hover:text-[#005a94] dark:group-hover:text-white transition-colors"
              >
                <span>View details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Mithibai College */}
          <div className="gsap-card bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] dark:hover:border-[#D3B5E8]/35 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  Western Suburbs
                </span>
                <span className="text-xs text-slate-500 dark:text-[#A9B8CA] flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-blue-600 dark:text-[#86cfff]" />
                  <span>5 min walk</span>
                </span>
              </div>

              <div>
                <h3
                  onClick={() => onSelectCollege('mithibai')}
                  className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] group-hover:text-[#007DCC] dark:group-hover:text-[#9ccaff] transition-colors cursor-pointer"
                >
                  Mithibai College of Arts & Commerce
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#A9B8CA] mt-0.5">
                  Vile Parle West • SVKM Campus • Autonomous
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                Autonomous status, premier fest culture (Kshitij), and top Big 4 & MNC placement records across BKC and Lower Parel.
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['B.Com', 'BAF', 'BMS', 'BFM', 'BAMMC', 'B.Sc Data'].map((deg) => (
                  <span
                    key={deg}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#161c27] text-slate-600 dark:text-[#A9B8CA]"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-[#8a919c]">
                Cutoff: ~92%–95%
              </span>
              <button
                type="button"
                onClick={() => onSelectCollege('mithibai')}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#007DCC] dark:text-[#86cfff] group-hover:text-[#005a94] dark:group-hover:text-white transition-colors"
              >
                <span>View details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transit Corridor Quick Digest (Free flowing responsive section) */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight flex items-center gap-2">
              <Train className="w-5 h-5 text-[#007DCC] dark:text-[#86cfff]" />
              <span>Mumbai Rail Commute & Campus Corridors</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] mt-1">
              Choose institutions that fit your local train transit to maximize study and internship hours.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('guidance')}
            className="text-xs sm:text-sm font-bold text-[#007DCC] dark:text-[#86cfff] hover:underline flex items-center gap-1"
          >
            <span>Match by transit line</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Western Line (South)
              </span>
              <span className="text-xs text-emerald-600 dark:text-[#51dcbc] font-medium">Fast / Slow</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB]">
              Charni Road & Churchgate Hub
            </p>
            <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
              Direct access for <strong>K.P.B. Hinduja College</strong>, <strong>H.R. College</strong>, and <strong>Jai Hind College</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Western Line (Suburbs)
              </span>
              <span className="text-xs text-emerald-600 dark:text-[#51dcbc] font-medium">Andheri Hub</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB]">
              Vile Parle SVKM Education Zone
            </p>
            <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
              Prime hub for <strong>Mithibai College</strong>, <strong>NM College</strong>, and <strong>NMIMS</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Central Line
              </span>
              <span className="text-xs text-emerald-600 dark:text-[#51dcbc] font-medium">Dadar Junction</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB]">
              Matunga Central & Ruia Hub
            </p>
            <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
              Home of <strong>R.A. Podar College</strong>, Ramnarain Ruia, and VJTI. Accessible directly from Thane & Ghatkopar.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
