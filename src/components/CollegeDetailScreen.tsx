import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Scale,
  Train,
  CheckCircle2,
  Info,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Camera,
  Building2,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { CollegeDetail, ScreenType, ShortlistItem } from '../types';
import { getCollegeDetails } from '../data/mockData';
import { CUTOFFS } from '../data/cutoffs';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
import { getCollegeCutoffGroup } from '../lib/collegeData';
import gsap from 'gsap';

interface CollegeDetailScreenProps {
  savedItems: ShortlistItem[];
  onToggleSave: (collegeId: string) => void;
  onOpenCompare: (primaryCollegeId: string) => void;
  onNavigate: (path: string) => void;
}

export const CollegeDetailScreen: React.FC<CollegeDetailScreenProps> = ({
  savedItems,
  onToggleSave,
  onOpenCompare,
  onNavigate,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const collegeId = slug || 'mithibai'; // Fallback
  const isSaved = savedItems.some((item) => item.collegeId === collegeId);
  const college: CollegeDetail = getCollegeDetails(collegeId);
  const collegeCutoffs = CUTOFFS.filter(c => c.collegeId === collegeId);
  const [searchParams] = useSearchParams();
  const streamQuery = searchParams.get('stream');

  // FYJC structured cutoff data for this college
  // Lookup via:
  // 1. Explicit collegeId match (e.g. 'mithibai', 'xaviers')
  // 2. Slug / normalized name match in getCollegeCutoffGroup
  // 3. Normalized title / choiceCode fallback
  const rawFyjc = useMemo(() => {
    const directMatches = FYJC_CUTOFFS.filter(c => c.collegeId && c.collegeId.toLowerCase() === collegeId.toLowerCase());
    if (directMatches.length > 0) return directMatches;

    const group = getCollegeCutoffGroup(collegeId);
    if (group && group.length > 0) return group;

    const normId = collegeId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const byName = FYJC_CUTOFFS.filter(c => {
      const cSlug = c.collegeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return cSlug === normId || (c.choiceCode && c.choiceCode.toLowerCase().includes(normId));
    });
    if (byName.length > 0) return byName;

    return [];
  }, [collegeId]);

  // Available streams in actual data for this college
  const availableStreams = useMemo(() => {
    return Array.from(new Set(rawFyjc.map(c => c.stream))).filter(Boolean);
  }, [rawFyjc]);

  // Selected stream state: defaults to URL stream query if valid, else first available, or 'Arts'
  const [selectedStream, setSelectedStream] = useState<string>(() => {
    if (streamQuery && availableStreams.some(s => s.toLowerCase() === streamQuery.toLowerCase())) {
      const match = availableStreams.find(s => s.toLowerCase() === streamQuery.toLowerCase());
      return match || streamQuery;
    }
    return availableStreams[0] || 'Commerce';
  });

  // Sync selectedStream if availableStreams changes or streamQuery updates
  useEffect(() => {
    if (streamQuery && availableStreams.some(s => s.toLowerCase() === streamQuery.toLowerCase())) {
      const match = availableStreams.find(s => s.toLowerCase() === streamQuery.toLowerCase());
      if (match) setSelectedStream(match);
    } else if (availableStreams.length > 0 && !availableStreams.includes(selectedStream)) {
      setSelectedStream(availableStreams[0]);
    }
  }, [availableStreams, streamQuery]);

  // Available reservation categories for this college (only when actual data is present)
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(rawFyjc.map(c => c.category))).filter(Boolean);
    // Sort so 'General' is first if present
    return cats.sort((a, b) => {
      if (a === 'General') return -1;
      if (b === 'General') return 1;
      return a.localeCompare(b);
    });
  }, [rawFyjc]);

  const [selectedCategory, setSelectedCategory] = useState<string>('General');

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories]);

  // Cutoffs specifically for selected stream
  const streamCutoffs = useMemo(() => {
    return rawFyjc.filter(c => c.stream.toLowerCase() === selectedStream.toLowerCase());
  }, [rawFyjc, selectedStream]);

  // Matching record for active stream + category
  const activeCutoffRecord = useMemo(() => {
    return streamCutoffs.find(c => c.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [streamCutoffs, selectedCategory]);

  // Other categories for the selected stream
  const otherCategoryCutoffs = useMemo(() => {
    return streamCutoffs.filter(c => c.category.toLowerCase() !== selectedCategory.toLowerCase());
  }, [streamCutoffs, selectedCategory]);

  // College choice code from cutoff data or college details
  const choiceCode = useMemo(() => {
    const withCode = rawFyjc.find(c => c.choiceCode);
    if (withCode) return withCode.choiceCode;
    const match = college.subName.match(/MU\w+/i);
    return match ? match[0] : null;
  }, [rawFyjc, college.subName]);

  const admissionYear = '2025-2026';

  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP entrance animation
  useEffect(() => {
    if (containerRef.current) {
      const animElements = containerRef.current.querySelectorAll('.detail-fade-anim');
      gsap.fromTo(
        animElements,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [collegeId]);

  return (
    <main
      ref={containerRef}
      className="w-full pt-20 sm:pt-24 pb-20 bg-[#F4F7FB] dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        
        {/* Navigation Breadcrumb */}
        <div className="detail-fade-anim flex flex-col gap-1.5 pt-1 text-left">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/colleges');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#007DCC] dark:text-[#A9B8CA] dark:hover:text-[#86cfff] transition-colors w-fit group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to results</span>
          </button>

          <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-[#A9B8CA] truncate">
            <button onClick={() => navigate('/')} className="hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors cursor-pointer">Home</button>
            <span>/</span>
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/colleges');
                }
              }}
              className="hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors cursor-pointer"
            >
              Colleges
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F4F7FB] truncate font-semibold">{college.name}</span>
          </nav>
        </div>

        
        {/* ── RESPONSIVE TOP SECTION (Option 3 for Desktop, Original for Mobile) ── */}
        <div className="flex flex-col gap-6">

          {/* === DESKTOP LAYOUT (Hidden on Mobile) === */}
          <div className="hidden lg:flex flex-col gap-6">
            
            {/* 1. DESKTOP CUTOFF PANEL (Top) */}
            <section className="detail-fade-anim w-full rounded-3xl bg-[#F0F7FF] dark:bg-[#0c1a2e] border border-blue-100 dark:border-blue-900/30 shadow-sm p-7 text-left flex flex-col gap-5 relative overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-black text-slate-900 dark:text-[#F4F7FB] tracking-tight flex items-center gap-2">
                    <span>FYJC Admission Cutoff</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#007DCC]/10 text-[#007DCC] dark:bg-[#007DCC]/25 dark:text-[#86cfff]">
                      {admissionYear}
                    </span>
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#A9B8CA] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#007DCC] dark:text-[#51dcbc]" />
                  <span>Data source: Official FYJC</span>
                </div>
              </div>

              {rawFyjc.length > 0 ? (
                <div className="flex gap-8 z-10 items-center mt-2">
                  <div className="flex-1 max-w-xs">
                    {activeCutoffRecord ? (
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-3">
                          <span className="text-[5rem] font-black text-[#007DCC] dark:text-[#51dcbc] tracking-tight leading-none">
                            {activeCutoffRecord.cutoff.toFixed(2)}%
                          </span>
                          <span className="text-sm font-semibold text-slate-500 dark:text-[#A9B8CA]">
                            ({Math.round((activeCutoffRecord.cutoff / 100) * 500)} / 500)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <span className="text-sm font-semibold text-slate-600 dark:text-[#A9B8CA]">{selectedStream} •</span>
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none bg-transparent text-sm font-bold text-[#007DCC] dark:text-[#86cfff] outline-none cursor-pointer pr-4 relative z-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%23007DCC%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '10px' }}
                          >
                            {availableCategories.map((cat) => (
                              <option key={`desktop-cat-${cat}`} value={cat} className="text-slate-900">
                                {cat} Category
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3">
                        <span className="text-2xl font-bold text-slate-400">Not Available</span>
                        <p className="text-xs text-slate-500 mt-1">
                          No {selectedCategory} record for {selectedStream} stream.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex-[1.5] flex flex-col justify-center border-l border-blue-200/60 dark:border-blue-800/40 pl-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#A9B8CA] mb-3">
                      Other category cutoffs ({selectedStream})
                    </span>
                    {otherCategoryCutoffs.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3">
                        {otherCategoryCutoffs.slice(0, 4).map((item) => (
                          <button
                            key={`desktop-other-${item.id}`}
                            type="button"
                            onClick={() => setSelectedCategory(item.category)}
                            className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl p-3 text-center hover:border-[#007DCC]/50 hover:shadow-sm transition-all cursor-pointer group"
                          >
                            <span className="block text-[11px] font-bold text-slate-500 dark:text-[#A9B8CA] group-hover:text-[#007DCC] transition-colors truncate">
                              {item.category}
                            </span>
                            <span className="block text-xl font-black text-slate-900 dark:text-[#F4F7FB] mt-1">
                              {item.cutoff.toFixed(2)}%
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 dark:text-[#A9B8CA]">
                        {availableCategories.length === 1 && availableCategories[0] === 'General'
                          ? 'General merit threshold is the sole published category.'
                          : 'No additional category records recorded.'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white/50 dark:bg-white/5 rounded-2xl border border-blue-100/50 dark:border-white/10 text-slate-500">
                  <p className="font-semibold text-sm">Cutoff data currently being updated.</p>
                </div>
              )}
            </section>

            {/* 2. DESKTOP HEADER (Middle) */}
            <header className="detail-fade-anim w-full rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-sm p-6 text-left flex justify-between items-center gap-6">
              <div className="flex flex-col gap-2.5 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-full text-blue-700 dark:text-blue-300 text-[11px] font-bold w-fit">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{college.badge || 'Affiliated Junior College'}</span>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mt-1">
                  {college.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-[#A9B8CA] font-medium mt-0.5">
                  {choiceCode && (
                    <>
                      <span className="font-semibold text-slate-700 dark:text-[#C5D3E3]">Choice Code: {choiceCode}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                    </>
                  )}
                  {availableStreams.length > 0 && (
                    <>
                      <span>{availableStreams.join(', ')}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                    </>
                  )}
                  <span>{college.location}</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold mt-2">
                   <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8a919c]">
                     <MapPin className="w-3.5 h-3.5 text-[#007DCC]" />
                     <span>{college.transitDetail || 'Access via Mumbai suburban railway and local transit'}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8a919c]">
                     <Train className="w-3.5 h-3.5 text-[#007DCC]" />
                     <span>Well connected via local train and bus</span>
                   </div>
                </div>
              </div>

              <div className="relative w-[280px] h-[160px] rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-white/5 group">
                <img
                  src={college.image}
                  alt={college.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-3 right-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 transition-all cursor-pointer hover:bg-black/70">
                    <Camera className="w-3.5 h-3.5" />
                    <span>View Photos</span>
                  </div>
                </div>
              </div>
            </header>

            {/* 3. DESKTOP TABS (Bottom) */}
            <div className="flex flex-wrap items-center gap-3">
              {availableStreams.length > 0 ? (
                availableStreams.map((str) => {
                  const isActive = selectedStream.toLowerCase() === str.toLowerCase();
                  return (
                    <button
                      key={`desktop-tab-${str}`}
                      type="button"
                      onClick={() => setSelectedStream(str)}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-150 text-center cursor-pointer border ${
                        isActive
                          ? 'bg-[#007DCC] border-[#007DCC] text-white shadow-md'
                          : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {str}
                    </button>
                  );
                })
              ) : (
                 <div className="w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-500 text-center">
                   No specific stream data available.
                 </div>
              )}
            </div>

          </div>

          {/* === MOBILE LAYOUT (Hidden on Desktop) === */}
          <div className="flex flex-col gap-6 lg:hidden">
            {/* ── 1. COMPACT COLLEGE HEADER (Image Background with controlled height) ── */}
        <header className="lg:hidden detail-fade-anim relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-white/10 bg-slate-900 text-white min-h-[190px] sm:min-h-[220px] flex flex-col justify-end p-5 sm:p-8 text-left">
          {/* Background Image */}
          <img
            src={college.image}
            alt={`${college.name} campus building`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Dark Gradient Overlay for readability across light/dark themes */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/70 sm:to-black/35" />

          {/* View Photos Pill (Top-Right or Bottom-Right) */}
          <div className="absolute top-4 sm:top-auto sm:bottom-6 right-4 sm:right-6 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-sm transition-all cursor-pointer">
              <Camera className="w-3.5 h-3.5" />
              <span>View Photos</span>
            </div>
          </div>

          {/* Content Layer */}
          <div className="relative z-10 space-y-2 max-w-3xl">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/25 rounded-full text-white text-[11px] font-bold shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>{college.badge || 'Affiliated Junior College'}</span>
            </div>

            {/* College Name */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight line-clamp-2">
              {college.name}
            </h1>

            {/* Choice Code & Streams */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-200 font-medium pt-0.5">
              {choiceCode && (
                <>
                  <span className="font-semibold text-cyan-200">Choice Code: {choiceCode}</span>
                  <span className="text-white/40">•</span>
                </>
              )}
              {availableStreams.length > 0 && (
                <>
                  <span>{availableStreams.join(', ')}</span>
                  <span className="text-white/40">•</span>
                </>
              )}
              <span className="text-slate-300">{college.location}</span>
            </div>

            {/* Transit snippet */}
            <div className="flex items-center gap-1.5 text-slate-300 text-xs pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{college.transitDetail || 'Access via Mumbai suburban railway and local transit'}</span>
            </div>
          </div>
        </header>

        {/* ── 2. PROMINENT CUTOFF PANEL (Immediately Below Header) ── */}
        <section className="lg:hidden detail-fade-anim w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-md p-5 sm:p-7 text-left space-y-5">
          {/* Panel Top Heading & Year Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F4F7FB] tracking-tight flex items-center gap-2">
                <span>FYJC ADMISSION CUTOFF</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#007DCC]/10 text-[#007DCC] dark:bg-[#007DCC]/25 dark:text-[#86cfff]">
                  {admissionYear}
                </span>
              </h2>
              <div className="group relative cursor-pointer" title="Cutoffs based on official FYJC Mumbai merit thresholds">
                <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#A9B8CA] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#007DCC] dark:text-[#51dcbc]" />
              <span>Data source: Official FYJC</span>
            </div>
          </div>

          {/* Stream Selector Buttons (Arts, Commerce, Science) */}
          {availableStreams.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {availableStreams.map((str) => {
                const isActive = selectedStream.toLowerCase() === str.toLowerCase();
                return (
                  <button
                    key={str}
                    type="button"
                    onClick={() => setSelectedStream(str)}
                    className={`flex-1 min-w-[100px] sm:min-w-[130px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 text-center cursor-pointer ${
                      isActive
                        ? 'bg-[#007DCC] text-white shadow-md active:scale-98'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#C5D3E3] border border-slate-200/80 dark:border-white/10 hover:bg-slate-200/80 dark:hover:bg-white/10'
                    }`}
                  >
                    {str}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500">
              No specific stream cutoff data on record for this college.
            </div>
          )}

          {/* Cutoff Percentage Display & Category Controls */}
          {rawFyjc.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
              {/* Left / Primary Cutoff Display */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 space-y-3">
                {/* Category Dropdown */}
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <label htmlFor="cat-selector" className="sr-only">Select Reservation Category</label>
                    <select
                      id="cat-selector"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none pr-8 pl-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-[#162232] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-[#F4F7FB] outline-none focus:border-[#007DCC] cursor-pointer shadow-2xs"
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} Category
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Big Percentage Number */}
                <div className="pt-2">
                  {activeCutoffRecord ? (
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-4xl sm:text-6xl font-black text-[#007DCC] dark:text-[#51dcbc] tracking-tight leading-none">
                        {activeCutoffRecord.cutoff.toFixed(2)}%
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#A9B8CA]">
                        ({Math.round((activeCutoffRecord.cutoff / 100) * 500)} / 500)
                      </span>
                    </div>
                  ) : (
                    <div className="py-3">
                      <span className="text-2xl font-bold text-slate-400">Not Available</span>
                      <p className="text-xs text-slate-500 mt-1">
                        No {selectedCategory} record for {selectedStream} stream.
                      </p>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#A9B8CA] mt-2">
                    {selectedStream} • {selectedCategory} category
                  </p>
                </div>
              </div>

              {/* Right / Comparison Row for other categories of this stream */}
              <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#162232] border border-slate-200/90 dark:border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA]">
                  Other category cutoffs ({selectedStream})
                </span>

                {otherCategoryCutoffs.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {otherCategoryCutoffs.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedCategory(item.category)}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center hover:border-[#007DCC]/50 transition-all cursor-pointer group"
                      >
                        <span className="block text-[11px] font-bold text-slate-500 dark:text-[#A9B8CA] group-hover:text-[#007DCC] transition-colors">
                          {item.category}
                        </span>
                        <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-[#F4F7FB] mt-0.5">
                          {item.cutoff.toFixed(2)}%
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-xs text-slate-500 dark:text-[#A9B8CA]">
                    {availableCategories.length === 1 && availableCategories[0] === 'General'
                      ? 'General merit threshold is the sole published category for this stream.'
                      : 'No additional category records recorded for this stream.'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-500">
              <p className="font-semibold text-sm">Cutoff data currently being updated for this institution.</p>
              <p className="text-xs mt-1">Check back soon for confirmed {admissionYear} admissions figures.</p>
            </div>
          )}
        </section>

                  </div>

          {/* === SHARED ACTIONS (Visible on both) === */}
          {/* ── 3. ACTIONS: Save to Shortlist & Compare College (Below Cutoff Panel) ── */}
        <section className="detail-fade-anim grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            id="saveBtn"
            type="button"
            onClick={() => onToggleSave(college.id)}
            className={`h-12 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00a388] dark:hover:bg-[#008f77]'
                : 'bg-[#007DCC] hover:bg-[#006cb0] text-white'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-5 h-5" />
                <span>Shortlisted</span>
              </>
            ) : (
              <>
                <Bookmark className="w-5 h-5" />
                <span>Save to Shortlist</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenCompare(college.id)}
            className="h-12 px-6 bg-white dark:bg-[#0D1828] hover:bg-slate-50 dark:hover:bg-[#161c27] text-slate-800 dark:text-[#F4F7FB] font-bold text-sm sm:text-base rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-300 dark:border-white/15 shadow-sm active:scale-98 cursor-pointer"
          >
            <Scale className="w-5 h-5 text-slate-500 dark:text-[#A9B8CA]" />
            <span>Compare College</span>
          </button>
        </section>\n        </div>

        {/* ── 4. SUPPORTING COLLEGE INFORMATION (Commute, Campus, Details Below) ── */}
        {/* Campus & Commute Context Vignette */}
        <div className="detail-fade-anim relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[220px]">
            {/* Campus Photo */}
            <div className="md:col-span-6 relative min-h-[190px] md:min-h-full">
              <img
                src={college.image}
                alt={`${college.name} campus view`}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/30 dark:from-[#0D1828] dark:via-[#0D1828]/30 to-transparent" />
            </div>

            {/* Commute & Accessibility Card */}
            <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#0D1828] text-left">
              <div className="space-y-2">
                <span className="text-[11px] text-[#007DCC] dark:text-[#86cfff] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5" />
                  <span>Commute &amp; Transit Advantage</span>
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                  {college.commuteHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                  {college.commuteDescription}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-slate-700 dark:text-[#A9B8CA] text-xs font-semibold border-t border-slate-100 dark:border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{college.commuteBadge}</span>
              </div>
            </div>
          </div>
        </div>



        {/* Free-flowing 2-column layout for details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 text-left">
          {/* Main Left Column (7 cols): Alignment + Perspectives */}
          <div className="lg:col-span-7 space-y-8">
            {/* Alignment Analysis */}
            <section className="detail-fade-anim space-y-4">
              <div>
                <span className="text-[11px] text-emerald-600 dark:text-[#51dcbc] font-bold uppercase tracking-widest">
                  Alignment Analysis
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight mt-1">
                  Why this campus fits student goals
                </h2>
              </div>

              <div className="bg-white dark:bg-[#0D1828] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5 border border-slate-300 dark:border-[#D3B5E8]/10">
                {college.whyFit.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#161c27] flex items-center justify-center shrink-0 mt-0.5">
                      {idx === 0 ? (
                        <GraduationCap className="w-5 h-5 text-[#007DCC] dark:text-[#51dcbc]" />
                      ) : idx === 1 ? (
                        <Train className="w-5 h-5 text-[#007DCC] dark:text-[#86cfff]" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-[#007DCC] dark:text-[#9ccaff]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F4F7FB]">
                        {item.title}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Balanced Perspective */}
            <section className="detail-fade-anim space-y-4">
              <div>
                <span className="text-[11px] text-[#007DCC] dark:text-[#86cfff] font-bold uppercase tracking-widest">
                  Balanced Perspective
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight mt-1">
                  Is this college right for you?
                </h2>
              </div>

              <div className="space-y-4">
                {/* Strong Fit Panel */}
                <div className="bg-emerald-50/60 dark:bg-[#0D1828] p-6 sm:p-7 rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-800/30">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-[#51dcbc]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Strong Fit If</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-[#F4F7FB] leading-relaxed">
                    {college.isRightForYou.strongFit}
                  </p>
                </div>

                {/* Things to Keep in Mind Panel */}
                <div className="bg-amber-50/50 dark:bg-[#0D1828] p-6 sm:p-7 rounded-2xl border border-amber-200 dark:border-amber-800/20">
                  <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
                    <Info className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Things to Keep in Mind
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-[#A9B8CA] leading-relaxed">
                    {college.isRightForYou.keepInMind}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (5 cols): Key Facts & Fast Decision */}
          <div className="lg:col-span-5 space-y-8">
            <section className="detail-fade-anim space-y-4">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-[#8a919c] font-bold uppercase tracking-widest">
                  Essential Parameters
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight mt-1">
                  Key Facts to Know
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {college.keyFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0D1828] p-5 rounded-2xl flex flex-col justify-between border border-slate-300 dark:border-[#D3B5E8]/10 hover:border-[#007DCC]/40 transition-all shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider">
                        {fact.label}
                      </span>
                      <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight">
                        {fact.value}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-2 leading-relaxed">
                      {fact.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Action Box */}
            <div className="detail-fade-anim p-6 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-300 dark:border-[#D3B5E8]/15 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-[#F4F7FB]">
                Plan Your Degree Career Path
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('guidance')}
                className="w-full py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>View Career Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Compare Next Step */}
        <section className="detail-fade-anim pt-2" id="compare">
          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0D1828] text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm border border-slate-300 dark:border-[#D3B5E8]/15">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight">
                Compare with {college.compareTargetName}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onOpenCompare(college.id)}
                className="h-11 px-6 bg-[#007DCC] hover:bg-[#006cb0] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all duration-200 inline-flex items-center gap-2 active:scale-95"
              >
                <span>Compare Side-by-Side</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
