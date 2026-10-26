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
  PenTool,
  FileText,
  Briefcase,
  MonitorPlay,
  Lightbulb,
  BarChart2
} from 'lucide-react';
import { ScreenType, SearchResultItem, PDFResource } from '../types';
import booksImg from '../assets/images/books.png';
import gradCapImg from '../assets/images/grad_cap.png';
import gsap from 'gsap';
import { ScrollStorySection } from './ScrollStorySection';
import { ConnectCarousel } from './ConnectCarousel';
import { InstagramReelCarousel } from './InstagramReelCarousel';
import { MascotArt } from './MascotArt';

import { FilterCategoryType } from './CategoryFilterModal';
import { getCategoryAccent } from '../lib/categoryAccents';
import { searchInfostaan } from '../lib/searchEngine';
import { fetchPDFResources, INITIAL_PDF_RESOURCES } from '../data/pdfResources';
import { useTheme } from '../context/ThemeContext';

interface HomeScreenProps {
  onSearch: (query: string, category?: string) => void;
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
  onOpenCutoff: () => void;
  onOpenClasses: () => void;
  onOpenCategoryFilter: (category: FilterCategoryType) => void;
  onOpenSignIn: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSearch,
  onNavigate,
  onSelectCollege,
  onOpenCutoff,
  onOpenClasses,
  onOpenCategoryFilter,
  onOpenSignIn,
}) => {
  const [query, setQuery] = useState('');
  const [pdfResources, setPdfResources] = useState<PDFResource[]>(INITIAL_PDF_RESOURCES);
  const { toggleTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const decorationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;
    fetchPDFResources().then((resources) => {
      if (isActive) setPdfResources(resources);
    });
    return () => {
      isActive = false;
    };
  }, []);

  const searchSuggestions = query.trim()
    ? searchInfostaan(query.trim(), 'all', pdfResources).slice(0, 6)
    : [];

  const handleSuggestionClick = (item: SearchResultItem) => {
    if (item.action === 'toggle-theme') {
      toggleTheme();
    } else if (item.action === 'open-profile') {
      onOpenSignIn();
    } else if (item.href) {
      onNavigate(item.href);
    } else if (item.category === 'pdfs' && item.slug) {
      onNavigate(`/pdf-resources/${item.slug}`);
    } else if (item.category === 'connect') {
      onNavigate(`/mentor/${item.id}`);
    } else if (item.category === 'classes' && item.slug) {
      onNavigate(`/class/${item.slug}`);
    } else {
      onSearch(query.trim());
    }
  };

  // Subtle GSAP entrance animation and background interactions
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
          }
        );
      }
      
      if (decorationsRef.current) {
        const parallaxLayers = decorationsRef.current.querySelectorAll('.parallax-layer');
        const floatLayers = decorationsRef.current.querySelectorAll('.float-layer');

        // Continuous independent floating motion
        floatLayers.forEach((layer, i) => {
          const dur = 4 + (i * 1.5);
          const dist = 10 + (i * 5);
          const rot = 2 + i;
          
          gsap.to(layer, {
            y: `+=${dist}`,
            rotation: `+=${rot}`,
            duration: dur,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: i * 0.5
          });

          // Hover interaction
          layer.addEventListener('mouseenter', () => {
            gsap.to(layer, { scale: 1.08, duration: 0.5, ease: 'back.out(1.5)', overwrite: 'auto' });
          });
          layer.addEventListener('mouseleave', () => {
            gsap.to(layer, { scale: 1, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
          });
        });

        // Combined Parallax, Proximity, and Scroll reaction
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let scrollY = window.scrollY;

        const updateParallax = () => {
          const { innerWidth, innerHeight } = window;
          const xPos = (mouseX / innerWidth - 0.5) * 2;
          const yPos = (mouseY / innerHeight - 0.5) * 2;

          parallaxLayers.forEach((layer, index) => {
            const depth = parseFloat(layer.getAttribute('data-depth') || '0.1');
            
            // Proximity calculation
            const rect = layer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
            
            let repelX = 0;
            let repelY = 0;
            if (dist < 250) {
              const force = (250 - dist) / 250; 
              const angle = Math.atan2(centerY - mouseY, centerX - mouseX);
              repelX = Math.cos(angle) * force * 15; // Small 15px reaction
              repelY = Math.sin(angle) * force * 15;
            }

            // Scroll parallax: swap places circularly on scroll
            let scrollX = 0;
            let scrollYOffset = 0;
            
            if (index === 0) { // Bottom Left (Books) -> moves Up
              scrollX = scrollY * 0.1;
              scrollYOffset = -scrollY * 0.9;
            } else if (index === 1) { // Right (Grad Cap) -> moves Left and Down
              scrollX = -scrollY * 1.6;
              scrollYOffset = scrollY * 0.4;
            } else {
              scrollYOffset = -scrollY * depth * 0.3; // Fallback
            }

            gsap.to(layer, {
              x: xPos * 30 * depth + repelX + scrollX,
              y: yPos * 30 * depth + repelY + scrollYOffset,
              duration: 1.2,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
        };

        const handleMouseMove = (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          updateParallax();
        };

        const handleScroll = () => {
          scrollY = window.scrollY;
          updateParallax();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initialize once
        updateParallax();
        
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('scroll', handleScroll);
        };
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <main className="relative w-full flex-1 pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0B111E] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      
      {/* Absolute Background Rule - Clean subtle background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-100/30 dark:bg-amber-400/5 blur-[100px] dark:blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-yellow-100/25 dark:bg-yellow-400/5 blur-[120px] dark:blur-[150px]" />
      </div>

      {/* Desktop-only static mascot & floating decorations */}
      <div 
        ref={decorationsRef} 
        className="pointer-events-none absolute top-0 left-0 right-0 h-[100vh] z-0 hidden lg:block overflow-hidden"
        aria-hidden="true"
      >
        {/* Top Left: Mascot (Stationary, larger prominent size) */}
        <div className="absolute top-[8%] lg:top-[10%] left-[2%] xl:left-[4%] w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 pointer-events-auto cursor-default transition-all duration-300">
          <MascotArt variant="welcome" className="w-full h-full object-contain opacity-100 dark:opacity-95 drop-shadow-sm" alt="InfoBuddy mascot greeting students on the homepage" />
        </div>
        
        {/* Bottom Left: Books (Hidden for now - do not delete) */}
        {/*
        <div className="parallax-layer absolute top-[60%] left-[3%] xl:left-[6%] w-36 h-36 md:w-48 md:h-48" data-depth="0.9">
          <div className="float-layer w-full h-full pointer-events-auto cursor-default">
            <img src={booksImg} alt="" className="w-full h-full object-contain opacity-80 dark:opacity-60 rotate-12" />
          </div>
        </div>
        */}
        
        {/* Middle/Bottom Right: Grad Cap (Hidden for now - do not delete) */}
        {/*
        <div className="parallax-layer absolute top-[40%] right-[2%] xl:right-[5%] w-40 h-40 md:w-56 md:h-56" data-depth="-0.5">
          <div className="float-layer w-full h-full pointer-events-auto cursor-default">
            <img src={gradCapImg} alt="" className="w-full h-full object-contain opacity-80 dark:opacity-60 rotate-6" />
          </div>
        </div>
        */}
      </div>

      {/* Mobile-only minimal marks */}
      <div 
        className="pointer-events-none absolute top-0 left-0 right-0 h-[100vh] z-0 block lg:hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[10%] right-[5%] w-2 h-2 rounded-full bg-amber-400/30" />
        <div className="absolute bottom-[20%] left-[5%] w-3 h-3 rounded-full bg-amber-300/20" />
      </div>

      {/* Central Content (Spacious & Clean) */}
      <div ref={containerRef} className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="relative z-20 flex flex-col items-center justify-center gap-4">
          <div className="w-full max-w-3xl text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-[#A9B8CA]">
              <span className="w-8 h-[1px] bg-slate-300 dark:bg-amber-400/30" />
              MUMBAI'S STUDENT DISCOVERY PLATFORM
              <span className="w-8 h-[1px] bg-slate-300 dark:bg-amber-400/30" />
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] mb-6 leading-tight">
              What are you <span className="marker-highlight text-white dark:text-yellow-400">looking for?</span>
            </h1>

            {/* Search */}
            <div className="w-full max-w-3xl mb-8 relative z-[100]">
              <form onSubmit={handleSubmit} className="relative w-full group">
                <div className="flex items-center bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 rounded-full shadow-lg shadow-black/5 dark:shadow-2xl transition-all duration-300 focus-within:border-slate-400 dark:focus-within:border-amber-400/40 focus-within:ring-4 focus-within:ring-slate-900/5 dark:focus-within:ring-amber-400/10 px-3 py-1.5 sm:px-4 sm:py-2">
                  <Search className="text-slate-400 dark:text-slate-300 w-5 h-5 sm:w-6 sm:h-6 ml-1.5 sm:ml-3 shrink-0" />
                  <input
                    id="main-query-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search colleges, courses, people, PDFs, and more..."
                    className="w-full bg-transparent border-none text-slate-900 dark:text-[#F8FAFC] font-medium text-xs sm:text-base px-2 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder-[#71839A] min-w-0"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="bg-slate-950 hover:bg-black text-white font-bold px-5 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-sm transform active:scale-95 text-xs sm:text-sm shrink-0"
                  >
                    Search
                  </button>
                </div>

                {/* Search Dropdown */}
                {query.trim().length > 0 && (
<<<<<<< HEAD
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50 text-left">
                    <div className="p-2 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => onSearch(query, 'all')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3 font-semibold text-slate-900 dark:text-[#F8FAFC] border-b border-slate-100 dark:border-white/5"
                      >
                        <Search className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span>Search "{query}" in <span className="text-amber-600 dark:text-amber-400 font-bold">All Categories</span></span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearch(query, 'colleges')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3 text-xs sm:text-sm"
                      >
                        <Building2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span className="text-slate-900 dark:text-[#F8FAFC]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Colleges</span></span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearch(query, 'courses')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3 text-xs sm:text-sm"
                      >
                        <GraduationCap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span className="text-slate-900 dark:text-[#F8FAFC]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Courses</span></span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearch(query, 'careers')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3 text-xs sm:text-sm"
                      >
                        <TrendingUp className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span className="text-slate-900 dark:text-[#F8FAFC]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Careers</span></span>
=======
                  <div className="relative mt-3 w-full bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden text-left">
                    <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
                      {searchSuggestions.length > 0 ? searchSuggestions.map((item) => (
                        <button
                          key={`${item.category}-${item.id}`}
                          type="button"
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-start gap-3"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-900 dark:text-[#F8FAFC]">{item.title}</span>
                            <span className={`mt-0.5 text-xs text-slate-500 dark:text-[#71839A] line-clamp-2 ${item.category === 'colleges' ? 'hidden sm:block' : 'block'}`}>{item.subtitle || item.badgeCategory}</span>
                          </span>
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-[#71839A]">{item.badgeCategory}</span>
                        </button>
                      )) : (
                        <div className="px-4 py-3 text-sm text-slate-500 dark:text-[#71839A]">No matching results yet</div>
                      )}
                      <button
                        type="button"
                        onClick={() => onSearch(query.trim())}
                        className="w-full mt-1 px-4 py-3 text-left text-sm font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        See all results for “{query.trim()}”
>>>>>>> 40b9b86fac5dd2c944a16a9246d560ff8a5f32c4
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearch(query, 'classes')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3 text-xs sm:text-sm"
                      >
                        <MonitorPlay className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span className="text-slate-900 dark:text-[#F8FAFC]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Coaching Classes</span></span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearch(query, 'cutoffs')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3 text-xs sm:text-sm"
                      >
                        <BarChart2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span className="text-slate-900 dark:text-[#F8FAFC]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Admission Cutoffs</span></span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSearch(query, 'pdf')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3 text-xs sm:text-sm"
                      >
                        <FileText className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span className="text-slate-900 dark:text-[#F8FAFC]">{query} <span className="text-slate-500 dark:text-[#71839A]">in PDF Resources</span></span>
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Contextual Suggestions */}
              <div className="min-h-6 mt-4">
                {query.trim().length === 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 px-2 text-xs sm:text-sm text-slate-500 dark:text-[#71839A]">
                    <button type="button" onClick={() => onSearch('B.Com colleges in Mumbai')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">B.Com colleges</button>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#71839A]/40" />
                    <button type="button" onClick={() => onSearch('CA courses')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">CA courses</button>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#71839A]/40" />
                    <button type="button" onClick={() => onSearch('Design careers')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Design careers</button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Discovery Shortcuts (Row 1: Colleges, Courses, Careers | Row 2: Classes, Cutoffs side by side) */}
        <div className="sm:hidden flex flex-col items-center justify-center gap-3 w-full mb-6 relative z-10">
          <div className="flex items-center justify-center gap-3 w-full">
            {([
              { name: 'Colleges', cat: 'colleges' as const, icon: Building2, action: () => onOpenCategoryFilter('colleges') },
              { name: 'Courses', cat: 'courses' as const, icon: GraduationCap, action: () => onOpenCategoryFilter('courses') },
              { name: 'Paid PDFs', cat: 'careers' as const, icon: FileText, action: () => onNavigate('/pdf-resources') },
            ]).map((item) => {
              const IconComp = item.icon;
              const accent = getCategoryAccent(item.cat);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={item.action}
                  style={{
                    background: accent.bgLight,
                    borderColor: accent.borderLight,
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 w-[84px] py-3.5 rounded-2xl border transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md cursor-pointer group shrink-0"
                >
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-transform duration-200 group-hover:scale-110"
                    style={{ background: accent.bgDark }}
                  >
                    <IconComp className="w-[18px] h-[18px]" style={{ color: accent.color }} />
                  </span>
                  <span
                    className="text-[11px] font-semibold leading-tight text-center"
                    style={{ color: accent.chipText }}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 w-full">
            {([
              { name: 'Classes', cat: 'classes' as const, icon: MonitorPlay, action: onOpenClasses },
              { name: 'Cutoffs', cat: 'cutoffs' as const, icon: BarChart2, action: onOpenCutoff },
            ]).map((item) => {
              const IconComp = item.icon;
              const accent = getCategoryAccent(item.cat);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={item.action}
                  style={{
                    background: accent.bgLight,
                    borderColor: accent.borderLight,
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 w-[84px] py-3.5 rounded-2xl border transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md cursor-pointer group shrink-0"
                >
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-transform duration-200 group-hover:scale-110"
                    style={{ background: accent.bgDark }}
                  >
                    <IconComp className="w-[18px] h-[18px]" style={{ color: accent.color }} />
                  </span>
                  <span
                    className="text-[11px] font-semibold leading-tight text-center"
                    style={{ color: accent.chipText }}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Discovery Shortcuts (Preserved single-row layout) */}
        <div className="hidden sm:flex w-full max-w-4xl mx-auto flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 relative z-10">
          {([
            { name: 'Colleges', cat: 'colleges' as const, icon: Building2, action: () => onOpenCategoryFilter('colleges') },
            { name: 'Courses', cat: 'courses' as const, icon: GraduationCap, action: () => onOpenCategoryFilter('courses') },
            { name: 'Paid PDFs', cat: 'careers' as const, icon: FileText, action: () => onNavigate('/pdf-resources') },
            { name: 'Classes', cat: 'classes' as const, icon: MonitorPlay, action: onOpenClasses },
            { name: 'Cutoffs', cat: 'cutoffs' as const, icon: BarChart2, action: onOpenCutoff },
          ]).map((item) => {
            const IconComp = item.icon;
            const accent = getCategoryAccent(item.cat);
            return (
              <button
                key={item.name}
                type="button"
                onClick={item.action}
                style={{
                  background: `color-mix(in srgb, ${accent.bgLight} 92%, transparent)`,
                  borderColor: accent.borderLight,
                }}
                className="flex flex-col items-center justify-center gap-1.5 w-20 py-4 rounded-2xl border border-white/50 backdrop-blur-md ring-1 ring-inset ring-white/40 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md cursor-pointer group shrink-0"
              >
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: accent.bgDark }}
                >
                  <IconComp className="w-[18px] h-[18px]" style={{ color: accent.color }} />
                </span>
                <span
                  className="text-xs font-semibold leading-tight text-center"
                  style={{ color: accent.chipText }}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Help Me Decide Button (Directly below shortcut options under search bar) */}
        <div className="relative z-50 mb-6 flex justify-center">
          <button
            onClick={() => onNavigate('guidance')}
            className="px-8 py-3.5 rounded-full bg-slate-950 hover:bg-black text-white font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group backdrop-blur-sm border border-white/10 cursor-pointer"
          >
            <span>Help Me Decide</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Mascot: Positioned below Help Me Decide */}
        <div className="lg:hidden mt-2 mb-8 flex justify-center">
          <MascotArt
            variant="welcome"
            className="w-full max-w-[170px] sm:max-w-[190px] h-auto object-contain drop-shadow-sm"
            alt="InfoBuddy mascot welcoming students to the platform"
          />
        </div>
      </div>

      {/* Infostaan Connect Carousel */}
      <div className="w-full my-6">
        <ConnectCarousel onNavigate={onNavigate} />
      </div>

      {/* Instagram Reel Carousel */}
      <div className="w-full my-6">
        <InstagramReelCarousel />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Quick Explore */}
        <div className="w-full max-w-5xl mx-auto mt-6 pt-10 border-t border-slate-200 dark:border-white/10 text-left">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Quick Explore</h3>
            <span className="text-xs text-slate-500 dark:text-[#71839A] uppercase tracking-wider font-bold">Discover Mumbai</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div 
              onClick={() => onOpenCategoryFilter('colleges')}
              className="p-5 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 hover:border-amber-400/50 cursor-pointer group transition-colors shadow-sm hover:shadow-md"
            >
              <h4 className="text-slate-900 dark:text-[#F8FAFC] font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1">Top Mumbai Colleges</h4>
              <p className="text-xs text-slate-500 dark:text-[#71839A]">Filter commerce, arts, science & autonomous Mumbai colleges</p>
            </div>
            
            <div 
              onClick={() => onNavigate('/pdf-resources')}
              className="p-5 rounded-2xl bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/10 hover:border-amber-400/50 cursor-pointer group transition-colors shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    <FileText className="w-3 h-3" />
                    <span>Curated Resources</span>
                  </span>
                </div>
                <h4 className="text-slate-900 dark:text-[#F8FAFC] font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1">
                  Premium Study Resources
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#71839A] leading-relaxed">
                  Access valuable study materials, notes, and educational PDFs to support your academic journey.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  <span>Explore Premium PDFs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-[#71839A]">Verified Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-Locked Storytelling Section */}
      <ScrollStorySection />
    </main>
  );
};
