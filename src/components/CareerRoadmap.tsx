import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Briefcase,
  GraduationCap,
  Award,
  Building2,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  IndianRupee,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react';
import { CareerGoal, RoadmapStep } from '../types';
import { CAREER_ROADMAPS } from '../data/mockData';
import gsap from 'gsap';

interface CareerRoadmapProps {
  onSelectCollege?: (collegeId: string) => void;
  onNavigate?: (screen: any) => void;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  onSelectCollege,
  onNavigate,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>('ca-statutory-audit');
  const [activeStepFilter, setActiveStepFilter] = useState<number | 'all'>('all');
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  const currentGoal: CareerGoal =
    CAREER_ROADMAPS.find((g) => g.id === selectedGoalId) || CAREER_ROADMAPS[0];

  useEffect(() => {
    if (stepsContainerRef.current) {
      const stepCards = stepsContainerRef.current.querySelectorAll('.step-card-anim');
      gsap.fromTo(
        stepCards,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [selectedGoalId, activeStepFilter]);

  const toggleStepExpand = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const toggleStepCompleted = (goalId: string, stepNumber: number) => {
    setCompletedSteps((prev) => {
      const currentList = prev[goalId] || [];
      const updated = currentList.includes(stepNumber)
        ? currentList.filter((s) => s !== stepNumber)
        : [...currentList, stepNumber];
      return { ...prev, [goalId]: updated };
    });
  };

  const isStepDone = (stepNumber: number) => {
    return (completedSteps[selectedGoalId] || []).includes(stepNumber);
  };

  const filteredSteps =
    activeStepFilter === 'all'
      ? currentGoal.steps
      : currentGoal.steps.filter((s) => s.stepNumber === activeStepFilter);

  const goalCompletedCount = (completedSteps[selectedGoalId] || []).length;
  const progressPercent = Math.round(
    (goalCompletedCount / (currentGoal.steps.length || 1)) * 100
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="interactive-career-roadmap" className="w-full">
      {/* Header Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#0D1828] via-[#101F33] to-[#0A1424] dark:from-[#0D1828] dark:via-[#101F33] dark:to-[#0A1424] p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#007DCC]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007DCC]/20 border border-[#007DCC]/40 text-[#86cfff] text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5 text-[#007DCC]" />
              <span>Interactive Mumbai Career Pathways</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Degree & Internship Career Roadmap
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-1.5 leading-relaxed">
              Select a professional career target to see an end-to-end blueprint: from Class 12 prerequisites, recommended Mumbai colleges (Hinduja, Podar, Jai Hind, Mithibai, HR), verified internships in BKC & Lower Parel, to entry salaries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Path</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Goal Selector Tabs */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Choose Your Target Career Goal:
          </label>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {CAREER_ROADMAPS.map((goal) => {
              const isSelected = goal.id === selectedGoalId;
              return (
                <button
                  key={goal.id}
                  type="button"
                  id={`goal-tab-${goal.id}`}
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setActiveStepFilter('all');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#007DCC] text-white shadow-lg shadow-[#007DCC]/30 ring-2 ring-[#86cfff]/50'
                      : 'bg-[#161c27]/80 hover:bg-[#202735] text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  <Briefcase className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#86cfff]'}`} />
                  <span>{goal.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overview Snapshot Card */}
      <div className="mb-8 rounded-2xl bg-white dark:bg-[#0D1828] border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                {currentGoal.category.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentGoal.streamFit.join(' • ')}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {currentGoal.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {currentGoal.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-gray-50 dark:bg-[#161c27] p-4 rounded-xl border border-gray-200 dark:border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                Target Starting CTC
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <IndianRupee className="w-4 h-4" />
                {currentGoal.targetSalaryRange}
              </span>
            </div>

            <div className="h-8 w-px bg-gray-300 dark:bg-white/10 hidden sm:block" />

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                Your Roadmap Progress
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {goalCompletedCount}/{currentGoal.steps.length} Steps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights: Hubs & Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-[#007DCC] mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                Target Industries & Practice Areas:
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {currentGoal.keyIndustries.join(' • ')}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#007DCC] mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                Mumbai Business Districts:
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {currentGoal.workLocations.join(' • ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation Filters */}
      <div className="flex items-center justify-between gap-3 mb-6 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveStepFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStepFilter === 'all'
                ? 'bg-[#007DCC] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#161c27] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All 5 Steps
          </button>
          {currentGoal.steps.map((step) => (
            <button
              key={step.stepNumber}
              type="button"
              onClick={() => setActiveStepFilter(step.stepNumber)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeStepFilter === step.stepNumber
                  ? 'bg-[#007DCC] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-[#161c27] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>Step {step.stepNumber}</span>
              {isStepDone(step.stepNumber) && (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <button
            type="button"
            onClick={() =>
              setExpandedSteps({
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
              })
            }
            className="hover:text-[#007DCC] transition-colors"
          >
            Expand all
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setExpandedSteps({})}
            className="hover:text-[#007DCC] transition-colors"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Step by Step Timeline Cards */}
      <div ref={stepsContainerRef} className="space-y-6 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-[#007DCC] before:via-blue-400 before:to-gray-300 dark:before:to-gray-800 before:hidden sm:before:block">
        {filteredSteps.map((step) => {
          const isExpanded = !!expandedSteps[step.stepNumber];
          const isDone = isStepDone(step.stepNumber);

          return (
            <div
              key={step.stepNumber}
              id={`roadmap-step-${step.stepNumber}`}
              className={`step-card-anim relative rounded-2xl transition-all border ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800/40'
                  : 'bg-white dark:bg-[#0D1828] border-gray-200 dark:border-white/10 shadow-sm'
              }`}
            >
              {/* Step Card Header */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors shadow-sm ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#007DCC] text-white'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : step.stepNumber}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/40">
                        {step.badge}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {step.timeline}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {step.stageTitle}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => toggleStepCompleted(selectedGoalId, step.stepNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isDone
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-gray-100 dark:bg-[#161c27] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#202735] border border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                    <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleStepExpand(step.stepNumber)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-[#161c27] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#202735] transition-colors"
                    aria-label="Toggle step details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step Card Body */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100 dark:border-white/5 space-y-6">
                  {/* Summary Text */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {step.summary}
                  </p>

                  {/* Section: Recommended Degrees & Mumbai Colleges */}
                  {step.degreesOrCourses && step.degreesOrCourses.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-4 h-4 text-[#007DCC]" />
                        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          Recommended Degrees & Mumbai Institutions:
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {step.degreesOrCourses.map((deg, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-gray-50 dark:bg-[#161c27] border border-gray-200 dark:border-white/10"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#007DCC]/20 text-[#007DCC] dark:text-[#86cfff]">
                                  {deg.code}
                                </span>
                                <h6 className="font-bold text-gray-900 dark:text-white text-sm">
                                  {deg.name}
                                </h6>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {deg.duration}
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                              {deg.whyFit}
                            </p>

                            {deg.recommendedColleges && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                                  Top Mumbai Colleges for this Track:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {deg.recommendedColleges.map((col) => (
                                    <div
                                      key={col.id}
                                      className="p-3 rounded-lg bg-white dark:bg-[#0D1828] border border-gray-200 dark:border-white/10 flex flex-col justify-between hover:border-[#007DCC]/50 transition-colors"
                                    >
                                      <div>
                                        <div className="flex items-start justify-between gap-2">
                                          <span className="font-bold text-xs text-gray-900 dark:text-white">
                                            {col.name}
                                          </span>
                                        </div>
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                                          {col.location}
                                        </span>
                                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                                          📍 {col.commuteTip}
                                        </p>
                                        <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1">
                                          ✨ {col.highlight}
                                        </p>
                                      </div>

                                      {onSelectCollege && (
                                        <button
                                          type="button"
                                          onClick={() => onSelectCollege(col.id)}
                                          className="mt-3 w-full py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-[#161c27] dark:hover:bg-[#202735] text-[#007DCC] dark:text-[#86cfff] text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-blue-200 dark:border-white/10"
                                        >
                                          <span>View College Details</span>
                                          <ArrowRight className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Professional Certifications */}
                  {step.certifications && step.certifications.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          Concurrent Certifications & Exams:
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.certifications.map((cert, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161c27] border border-gray-200 dark:border-white/10"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h6 className="font-bold text-xs text-gray-900 dark:text-white">
                                {cert.name}
                              </h6>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                {cert.duration}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                              Issued by: {cert.provider}
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                              {cert.relevance}
                            </p>
                            <div className="mt-2 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                              ⏰ Best time: {cert.whenToTake}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Practical Internships & Articleships */}
                  {step.internships && step.internships.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          Verified Mumbai Internships & Articleship Roles:
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.internships.map((job, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-gray-50 dark:bg-[#161c27] border border-gray-200 dark:border-white/10 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h6 className="font-bold text-sm text-gray-900 dark:text-white">
                                    {job.title}
                                  </h6>
                                  <span className="text-xs font-semibold text-[#007DCC] dark:text-[#86cfff] block">
                                    {job.company}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                  {job.stipend}
                                </span>
                              </div>

                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>{job.location}</span>
                              </div>

                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Core Exposure: </span>
                                {job.skillsGained}
                              </p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                              <span>Window: {job.applicationWindow}</span>
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                {job.timing}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Pro Tips */}
                  {step.proTips && step.proTips.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                      <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Mumbai Insider Tips & Advice</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed list-disc list-inside">
                        {step.proTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
