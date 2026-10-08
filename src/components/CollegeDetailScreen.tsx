import React, { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import { CollegeDetail, ScreenType, ShortlistItem } from '../types';
import { getCollegeDetails } from '../data/mockData';
import { CUTOFFS } from '../data/cutoffs';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
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

  const [selectedCategory, setSelectedCategory] = useState<string>('General');

  // FYJC structured cutoff data for this college
  const rawFyjc = FYJC_CUTOFFS.filter(c =>
    (c.collegeId === collegeId) ||
    (c.collegeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === collegeId)
  ).sort((a, b) => b.cutoff - a.cutoff);

  const availableCategories = Array.from(new Set(rawFyjc.map(c => c.category))).sort();

  let fyjcCutoffs = rawFyjc;
  if (streamQuery) {
    fyjcCutoffs = rawFyjc.filter(c => c.stream.toLowerCase() === streamQuery.toLowerCase() && c.category === selectedCategory);
  } else {
    // Show only top 3 (Arts, Commerce, Science) for selected category
    const arts = rawFyjc.find(c => c.stream === 'Arts' && c.category === selectedCategory);
    const comm = rawFyjc.find(c => c.stream === 'Commerce' && c.category === selectedCategory);
    const sci = rawFyjc.find(c => c.stream === 'Science' && c.category === selectedCategory);
    fyjcCutoffs = [arts, comm, sci].filter(Boolean) as typeof rawFyjc;
  }
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
      className="w-full pt-20 sm:pt-24 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header / Left-aligned free layout */}
        <header className="detail-fade-anim pb-8 text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            {/* Back button & Breadcrumb */}
            <div className="flex flex-col gap-2 mb-6 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/colleges?all=true');
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#007DCC] dark:text-[#A9B8CA] dark:hover:text-[#86cfff] transition-colors w-fit group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to results</span>
              </button>

              <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-[#A9B8CA]">
                <button onClick={() => navigate('/')} className="hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors">Home</button>
                <span>/</span>
                <button
                  onClick={() => {
                    if (window.history.length > 1) {
                      navigate(-1);
                    } else {
                      navigate('/colleges?all=true');
                    }
                  }}
                  className="hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors"
                >
                  Colleges
                </button>
                <span>/</span>
                <span className="text-slate-900 dark:text-[#F4F7FB] truncate max-w-[200px] sm:max-w-md">{college.name}</span>
              </nav>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0D1828] border border-slate-300 dark:border-[#D3B5E8]/20 rounded-full text-[#007DCC] dark:text-[#86cfff] text-xs font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#51dcbc] animate-pulse" />
              <span>{college.badge}</span>
            </div>

            {/* College Name */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight leading-tight">
              {college.name}
            </h1>

            {/* Subtitle / Full Name */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] font-medium tracking-normal">
              {college.subName}
            </p>

            {/* Location & Transit */}
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8a919c] text-xs sm:text-sm flex-wrap pt-1">
              <MapPin className="w-4 h-4 text-[#007DCC] dark:text-[#86cfff] shrink-0" />
              <span>{college.location}</span>
              <span className="mx-1 text-slate-300 dark:text-[#404751]">•</span>
              <span className="text-slate-600 dark:text-[#A9B8CA]">{college.transitDetail}</span>
            </div>
          </div>

          {/* Right Side: Cutoffs & Action Strip */}
          <div className="flex flex-col items-start md:items-end gap-5 self-start md:self-auto shrink-0 mt-4 md:mt-0">

            {/* Top Highlighted Cutoffs */}
            {rawFyjc.length > 0 && (
              <div className="flex flex-col items-start md:items-end gap-2 w-full">
                <div className="flex items-center gap-2">
                  {streamQuery && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-[#71839A] uppercase tracking-widest">
                      {streamQuery} FYJC Cutoff
                    </span>
                  )}
                  {!streamQuery && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-[#71839A] uppercase tracking-widest">
                      FYJC Cutoffs
                    </span>
                  )}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-[10px] sm:text-[11px] font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md px-2 py-0.5 outline-none focus:border-[#007DCC] text-slate-700 dark:text-[#A9B8CA] cursor-pointer"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end w-full">
                  {fyjcCutoffs.length > 0 ? fyjcCutoffs.map(c => (
                    <div key={c.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#007DCC]/10 dark:bg-[#007DCC]/20 border border-[#007DCC]/20 dark:border-[#007DCC]/30">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-[#A9B8CA]">{c.stream}</span>
                      <span className="text-xs sm:text-sm font-black text-[#007DCC] dark:text-[#51dcbc]">{c.cutoff}%</span>
                    </div>
                  )) : (
                    <span className="text-xs text-slate-500 italic px-2">No {selectedCategory} cutoff available.</span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="saveBtn"
                type="button"
                onClick={() => onToggleSave(college.id)}
                className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 flex items-center gap-2 active:scale-95 ${isSaved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00a388] dark:hover:bg-[#008f77]'
                  : 'bg-[#007DCC] hover:bg-[#006cb0] text-white'
                  }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Shortlisted</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save to Shortlist</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenCompare(college.id)}
                className="h-11 px-5 bg-white dark:bg-[#0D1828] hover:bg-slate-100 dark:hover:bg-[#161c27] text-slate-800 dark:text-[#F4F7FB] font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center gap-2 border border-slate-300 dark:border-[#D3B5E8]/15 shadow-sm"
              >
                <Scale className="w-4 h-4 text-slate-500 dark:text-[#A9B8CA]" />
                <span>Compare College</span>
              </button>
            </div>
          </div>
        </header>

        {/* Campus Context Vignette */}
        <div className="detail-fade-anim relative w-full rounded-2xl overflow-hidden mb-10 shadow-sm bg-white dark:bg-[#0D1828] border border-slate-300 dark:border-[#D3B5E8]/15">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[260px] md:min-h-[290px]">
            {/* Campus Photo */}
            <div className="md:col-span-7 relative min-h-[220px] md:min-h-full">
              <img
                src={college.image}
                alt={`${college.name} building exterior in Mumbai`}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/40 dark:from-[#0D1828] dark:via-[#0D1828]/40 to-transparent" />
            </div>

            {/* Commute & Accessibility Card */}
            <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#0D1828]">
              <div className="space-y-2 text-left">
                <span className="text-[11px] text-[#007DCC] dark:text-[#86cfff] font-bold uppercase tracking-widest">
                  Commute & Transit Advantage
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                  {college.commuteHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                  {college.commuteDescription}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-slate-700 dark:text-[#A9B8CA] text-xs font-medium border-t border-slate-100 dark:border-white/5">
                <Train className="w-4 h-4 text-[#007DCC] dark:text-[#51dcbc] shrink-0" />
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
