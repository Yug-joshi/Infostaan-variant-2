import React, { useState } from 'react';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Scale,
  Train,
  CheckCircle2,
  Info,
  ArrowRight,
  Sparkles,
  Building,
  Clock,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { CollegeDetail, ScreenType } from '../types';
import { MITHIBAI_DETAILS, HR_COLLEGE_DETAILS } from '../data/mockData';

interface CollegeDetailScreenProps {
  collegeId: string;
  isSaved: boolean;
  onToggleSave: (collegeId: string) => void;
  onOpenCompare: (primaryCollegeId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CollegeDetailScreen: React.FC<CollegeDetailScreenProps> = ({
  collegeId,
  isSaved,
  onToggleSave,
  onOpenCompare,
  onNavigate,
}) => {
  const college: CollegeDetail =
    collegeId === 'hr-college' ? HR_COLLEGE_DETAILS : MITHIBAI_DETAILS;

  return (
    <main className="w-full pt-16 sm:pt-20 bg-[#070D18] min-h-screen">
      <div className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 pb-20">
        {/* Calm Gradient Glow Anchor */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[540px] h-[320px] bg-[#007DCC]/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Editorial Header / Decision Anchor */}
        <header className="pt-6 sm:pt-8 pb-10 text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#242a36]/60 border border-[#D3B5E8]/20 rounded-full text-[#86cfff] text-xs font-semibold mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#51dcbc] animate-pulse" />
            <span>{college.badge}</span>
          </div>

          {/* College Name */}
          <h1 className="text-3xl sm:text-5xl font-bold text-[#F4F7FB] tracking-tight leading-tight mb-2">
            {college.name}
          </h1>

          {/* Subtitle / Full Name */}
          <p className="text-sm sm:text-base text-[#A9B8CA] font-medium tracking-normal mb-3 max-w-2xl">
            {college.subName}
          </p>

          {/* Location & Transit */}
          <div className="flex items-center justify-center gap-1.5 text-[#8a919c] text-xs sm:text-sm mb-6 flex-wrap">
            <MapPin className="w-4 h-4 text-[#86cfff] shrink-0" />
            <span>{college.location}</span>
            <span className="mx-1 text-[#404751]">•</span>
            <span className="text-[#A9B8CA]">{college.transitDetail}</span>
          </div>

          {/* Action Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              id="saveBtn"
              type="button"
              onClick={() => onToggleSave(college.id)}
              className={`h-11 px-5 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                isSaved
                  ? 'bg-[#00a388] hover:bg-[#008f77] text-[#002019]'
                  : 'bg-[#3795e6] hover:bg-[#00a0e0] text-white'
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
              className="h-11 px-5 bg-[#242a36]/80 hover:bg-[#333946] text-[#F4F7FB] font-semibold text-sm rounded-xl transition-all duration-200 flex items-center gap-2 border border-[#D3B5E8]/15"
            >
              <Scale className="w-4 h-4 text-[#A9B8CA]" />
              <span>Compare with another college</span>
            </button>
          </div>
        </header>

        {/* Visual Grounding: Campus Context Vignette */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-12 shadow-xl bg-[#161c27] border border-[#D3B5E8]/15">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[260px] md:min-h-[290px]">
            {/* Campus Photo with Gradient Overlay */}
            <div className="md:col-span-7 relative min-h-[220px] md:min-h-full">
              <img
                src={college.image}
                alt={`${college.name} building exterior in Mumbai`}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#161c27] via-[#161c27]/40 to-transparent" />
            </div>

            {/* Commute & Accessibility Card */}
            <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between bg-[#161c27]">
              <div className="space-y-2">
                <span className="text-[11px] text-[#86cfff] font-bold uppercase tracking-widest">
                  Commute & Accessibility
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#F4F7FB]">
                  {college.commuteHeading}
                </h3>
                <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                  {college.commuteDescription}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[#A9B8CA] text-xs font-medium">
                <Train className="w-4 h-4 text-[#51dcbc] shrink-0" />
                <span>{college.commuteBadge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Alignment Analysis (Why this may fit you) */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <span className="text-[11px] text-[#51dcbc] font-bold uppercase tracking-widest">
                Alignment Analysis
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] tracking-tight mt-1">
                Why this may fit you
              </h2>
            </div>

            <div className="bg-[#1a202b] rounded-2xl p-6 sm:p-7 shadow-md space-y-5 border border-[#D3B5E8]/10">
              {college.whyFit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#2f3541] flex items-center justify-center shrink-0 mt-0.5">
                    {idx === 0 ? (
                      <GraduationCap className="w-5 h-5 text-[#51dcbc]" />
                    ) : idx === 1 ? (
                      <Train className="w-5 h-5 text-[#86cfff]" />
                    ) : (
                      <Briefcase className="w-5 h-5 text-[#9ccaff]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-[#F4F7FB]">
                      {item.title}
                    </p>
                    <p className="text-xs sm:text-sm text-[#A9B8CA] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Key Facts to Know */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <span className="text-[11px] text-[#8a919c] font-bold uppercase tracking-widest">
                Essential Parameters
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] tracking-tight mt-1">
                Key Facts to Know
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {college.keyFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="bg-[#161c27] p-5 sm:p-6 rounded-2xl flex flex-col justify-between border border-[#D3B5E8]/10 hover:border-[#D3B5E8]/25 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#A9B8CA] uppercase tracking-wider">
                      {fact.label}
                    </span>
                    <p className="text-lg font-bold text-[#F4F7FB] tracking-tight">
                      {fact.value}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-[#A9B8CA] mt-3 leading-relaxed">
                    {fact.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Balanced Perspective (Is this college right for you?) */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <span className="text-[11px] text-[#86cfff] font-bold uppercase tracking-widest">
                Balanced Perspective
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] tracking-tight mt-1">
                Is this college right for you?
              </h2>
            </div>

            <div className="space-y-4">
              {/* Strong Fit Panel */}
              <div className="bg-[#1a202b] p-6 sm:p-7 rounded-2xl shadow-sm border border-[#51dcbc]/20">
                <div className="flex items-center gap-2 mb-2 text-[#51dcbc]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Strong Fit If</span>
                </div>
                <p className="text-sm sm:text-base text-[#F4F7FB] leading-relaxed">
                  {college.isRightForYou.strongFit}
                </p>
              </div>

              {/* Things to Keep in Mind Panel */}
              <div className="bg-[#242a36]/60 p-6 sm:p-7 rounded-2xl border border-[#D3B5E8]/10">
                <div className="flex items-center gap-2 mb-2 text-[#A9B8CA]">
                  <Info className="w-5 h-5 text-[#8a919c]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8a919c]">
                    Things to Keep in Mind
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#A9B8CA] leading-relaxed">
                  {college.isRightForYou.keepInMind}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Compare Next Step */}
        <section className="pt-2" id="compare">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-b from-[#242a36] to-[#161c27] p-8 sm:p-10 rounded-2xl text-center flex flex-col items-center shadow-lg border border-[#D3B5E8]/15">
              <span className="w-12 h-12 rounded-full bg-[#1a202b] flex items-center justify-center text-[#9ccaff] mb-4 shadow-sm">
                <Scale className="w-6 h-6" />
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] tracking-tight mb-2">
                Want to compare {college.name} against {college.compareTargetName}?
              </h3>
              <p className="text-sm sm:text-base text-[#A9B8CA] max-w-lg mb-6 leading-relaxed">
                Review side-by-side cutoff trends, commute duration, and attendance flexibility without bias or marketing noise.
              </p>
              <button
                type="button"
                onClick={() => onOpenCompare(college.id)}
                className="h-12 px-7 bg-[#007DCC] hover:bg-[#19A7E8] text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 inline-flex items-center gap-2 group active:scale-95"
              >
                <span>Compare side-by-side</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
