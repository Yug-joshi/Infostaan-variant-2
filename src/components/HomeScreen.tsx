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
  FileText,
  Briefcase,
  MonitorPlay,
  Lightbulb,
  BarChart2
} from 'lucide-react';
import { ScreenType } from '../types';
import laptopImg from '../assets/images/laptop.png';
import booksImg from '../assets/images/books.png';
import gradCapImg from '../assets/images/grad_cap.png';
import gsap from 'gsap';
import { ScrollStorySection } from './ScrollStorySection';
import { ConnectCarousel } from './ConnectCarousel';

import { FilterCategoryType } from './CategoryFilterModal';
import { getCategoryAccent } from '../lib/categoryAccents';

interface HomeScreenProps {
  onSearch: (query: string, category?: string) => void;
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
  onOpenCutoff: () => void;
  onOpenClasses: () => void;
  onOpenCategoryFilter: (category: FilterCategoryType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSearch,
  onNavigate,
  onSelectCollege,
  onOpenCutoff,
  onOpenClasses,
  onOpenCategoryFilter,
}) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const decorationsRef = useRef<HTMLDivElement>(null);

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
            
            if (index === 0) { // Top Left (Laptop) -> moves Right and Down
              scrollX = scrollY * 1.6;
              scrollYOffset = scrollY * 0.5;
            } else if (index === 1) { // Bottom Left (Books) -> moves Up
              scrollX = scrollY * 0.1;
              scrollYOffset = -scrollY * 0.9;
            } else if (index === 2) { // Right (Grad Cap) -> moves Left and Down
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
    if (query.trim()) {
      onSearch(query.trim());
    } else {
      onSearch('finance');
    }
  };

  return (
    <main className="relative w-full flex-1 pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-[#070D18] text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      
      {/* Absolute Background Rule - Clean subtle dark background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50 dark:bg-[#007DCC]/5 blur-[100px] dark:blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-50 dark:bg-[#19A7E8]/5 blur-[120px] dark:blur-[150px]" />
      </div>

      {/* Desktop-only floating decorations (pointer-events-none) */}
      <div 
        ref={decorationsRef} 
        className="pointer-events-none absolute top-0 left-0 right-0 h-[100vh] z-0 hidden lg:block overflow-hidden"
        aria-hidden="true"
      >
        {/* Top Left: Laptop */}
        <div className="parallax-layer absolute top-[15%] left-[2%] xl:left-[5%] w-40 h-40 md:w-56 md:h-56" data-depth="0.6">
          <div className="float-layer w-full h-full pointer-events-auto cursor-default">
            <img src={laptopImg} alt="" className="w-full h-full object-contain opacity-80 dark:opacity-60 -rotate-12" />
          </div>
        </div>
        
        {/* Bottom Left: Books */}
        <div className="parallax-layer absolute top-[60%] left-[3%] xl:left-[6%] w-36 h-36 md:w-48 md:h-48" data-depth="0.9">
          <div className="float-layer w-full h-full pointer-events-auto cursor-default">
            <img src={booksImg} alt="" className="w-full h-full object-contain opacity-80 dark:opacity-60 rotate-12" />
          </div>
        </div>
        
        {/* Middle/Bottom Right: Grad Cap */}
        <div className="parallax-layer absolute top-[40%] right-[2%] xl:right-[5%] w-40 h-40 md:w-56 md:h-56" data-depth="-0.5">
          <div className="float-layer w-full h-full pointer-events-auto cursor-default">
            <img src={gradCapImg} alt="" className="w-full h-full object-contain opacity-80 dark:opacity-60 rotate-6" />
          </div>
        </div>
      </div>

      {/* Mobile-only minimal marks */}
      <div 
        className="pointer-events-none absolute top-0 left-0 right-0 h-[100vh] z-0 block lg:hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[10%] right-[5%] w-2 h-2 rounded-full bg-[#007DCC]/30" />
        <div className="absolute bottom-[20%] left-[5%] w-3 h-3 rounded-full bg-[#D3B5E8]/20" />
      </div>

      {/* Central Content (Spacious & Clean) */}
      <div ref={containerRef} className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-[#A9B8CA]">
          <span className="w-8 h-[1px] bg-slate-300 dark:bg-[#007DCC]/40" />
          MUMBAI'S STUDENT DISCOVERY PLATFORM
          <span className="w-8 h-[1px] bg-slate-300 dark:bg-[#007DCC]/40" />
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] mb-6 leading-tight">
          What are you looking for?
        </h1>

        {/* Search */}
        <div className="w-full max-w-3xl mb-8 relative z-[60]">
          <form onSubmit={handleSubmit} className="relative w-full group">
            <div className="flex items-center bg-white dark:bg-[#0D1828] border border-slate-300 dark:border-[#D3B5E8]/20 rounded-full shadow-xl dark:shadow-2xl transition-all duration-300 focus-within:border-[#007DCC] focus-within:ring-4 focus-within:ring-[#007DCC]/10 focus-within:shadow-[#007DCC]/10 px-3 py-2 sm:px-4">
              <Search className="text-[#007DCC] w-6 h-6 ml-3 shrink-0" />
              <input
                id="main-query-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search colleges, courses, careers, classes..."
                className="w-full bg-transparent border-none text-slate-900 dark:text-[#F4F7FB] font-medium text-sm sm:text-base px-4 py-3 sm:py-4 focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder-[#71839A]"
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-[#007DCC] hover:bg-[#006cb0] text-white font-bold px-6 sm:px-8 py-3 rounded-full transition-all duration-200 shadow-md transform active:scale-95"
              >
                Search
              </button>
            </div>
            
            {/* Search Dropdown */}
            {query.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/20 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50 text-left">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => onSelectCollege('mithibai')}
                    className="w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3"
                  >
                    <Building2 className="w-5 h-5 text-[#007DCC] dark:text-[#A9B8CA]" />
                    <span className="text-slate-900 dark:text-[#F4F7FB]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Colleges</span></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSearch(query, 'courses')}
                    className="w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3"
                  >
                    <GraduationCap className="w-5 h-5 text-[#007DCC] dark:text-[#A9B8CA]" />
                    <span className="text-slate-900 dark:text-[#F4F7FB]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Courses</span></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSearch(query, 'careers')}
                    className="w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-[#161c27] rounded-xl transition-colors flex items-center gap-3"
                  >
                    <TrendingUp className="w-5 h-5 text-[#007DCC] dark:text-[#A9B8CA]" />
                    <span className="text-slate-900 dark:text-[#F4F7FB]">{query} <span className="text-slate-500 dark:text-[#71839A]">in Careers</span></span>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Contextual Suggestions */}
          <div className="h-6 mt-4">
            {query.trim().length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-2 text-xs sm:text-sm text-slate-500 dark:text-[#71839A]">
                <button type="button" onClick={() => onSearch('B.Com colleges in Mumbai')} className="hover:text-[#007DCC] dark:hover:text-[#19A7E8] transition-colors">B.Com colleges</button>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#71839A]/40" />
                <button type="button" onClick={() => onSearch('CA courses')} className="hover:text-[#007DCC] dark:hover:text-[#19A7E8] transition-colors">CA courses</button>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#71839A]/40" />
                <button type="button" onClick={() => onSearch('Design careers')} className="hover:text-[#007DCC] dark:hover:text-[#19A7E8] transition-colors">Design careers</button>
              </div>
            )}
          </div>
        </div>

        {/* Discovery Shortcuts (Opens category filter popups first) */}
        <div className="w-full max-w-4xl flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 relative z-50">
          {([
            { name: 'Colleges', cat: 'colleges', icon: Building2, action: () => onOpenCategoryFilter('colleges') },
            { name: 'Courses', cat: 'courses', icon: GraduationCap, action: () => onOpenCategoryFilter('courses') },
            { name: 'Careers', cat: 'careers', icon: TrendingUp, action: () => onOpenCategoryFilter('careers') },
            { name: 'Classes', cat: 'classes', icon: MonitorPlay, action: onOpenClasses },
            { name: 'Cutoffs', cat: 'cutoffs', icon: BarChart2, action: onOpenCutoff },
          ] as const).map((item) => {
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
                className="flex flex-col items-center justify-center gap-1.5 w-[72px] sm:w-20 py-3.5 sm:py-4 rounded-2xl border transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: accent.bgDark }}
                >
                  <IconComp className="w-[18px] h-[18px]" style={{ color: accent.color }} />
                </span>
                <span
                  className="text-[11px] sm:text-xs font-semibold leading-tight text-center"
                  style={{ color: accent.chipText }}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>


        {/* Help Me Decide Button (Directly below shortcut options under search bar) */}
        <div className="relative z-50 mb-10">
          <button
            onClick={() => onNavigate('guidance')}
            className="px-8 py-3.5 rounded-full bg-[#007DCC]/90 hover:bg-[#007DCC] text-white font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group backdrop-blur-sm border border-white/10 cursor-pointer"
          >
            <span>Help Me Decide</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Infostaan Connect Carousel */}
      <div className="w-full my-6">
        <ConnectCarousel onNavigate={onNavigate} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Quick Explore */}
        <div className="w-full max-w-5xl mx-auto mt-6 pt-10 border-t border-slate-300 dark:border-white/5 text-left">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB]">Quick Explore</h3>
            <span className="text-xs text-slate-500 dark:text-[#71839A] uppercase tracking-wider font-bold">Discover Mumbai</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div 
              onClick={() => onOpenCategoryFilter('colleges')}
              className="p-5 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-300 dark:border-white/5 hover:border-[#007DCC]/50 cursor-pointer group transition-colors shadow-sm hover:shadow-md"
            >
              <h4 className="text-slate-900 dark:text-[#F4F7FB] font-semibold group-hover:text-[#007DCC] dark:group-hover:text-[#19A7E8] transition-colors mb-1">Top Mumbai Colleges</h4>
              <p className="text-xs text-slate-500 dark:text-[#71839A]">Filter commerce, arts, science & autonomous Mumbai colleges</p>
            </div>
            
            <div 
              onClick={() => onNavigate('guidance')}
              className="p-5 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-300 dark:border-white/5 hover:border-[#007DCC]/50 cursor-pointer group transition-colors shadow-sm hover:shadow-md"
            >
              <h4 className="text-slate-900 dark:text-[#F4F7FB] font-semibold group-hover:text-[#007DCC] dark:group-hover:text-[#19A7E8] transition-colors mb-1">Career Roadmaps</h4>
              <p className="text-xs text-slate-500 dark:text-[#71839A]">Explore step-by-step career pathways tailored for Mumbai students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-Locked Storytelling Section */}
      <ScrollStorySection />
    </main>
  );
};
