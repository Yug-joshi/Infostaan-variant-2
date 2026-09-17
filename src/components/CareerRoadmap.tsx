import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ArrowRight,
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
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
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
  }, [selectedGoalId]);

  const toggleStepExpand = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  return (
    <div id="interactive-career-roadmap" className="w-full max-w-4xl mx-auto py-8">
      {/* Simple Header */}
      <div className="mb-10 text-left">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#F4F7FB] mb-3">
          Career Roadmaps
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] mb-6">
          Step-by-step career blueprints tailored to Mumbai colleges and internships. Select a career goal to explore the path.
        </p>

        {/* Goal Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {CAREER_ROADMAPS.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => {
                  setSelectedGoalId(goal.id);
                  setExpandedSteps({});
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#007DCC] text-white border-[#007DCC] shadow-sm'
                    : 'bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border-slate-200 dark:border-white/10 hover:border-[#007DCC]'
                }`}
              >
                <Briefcase className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#007DCC] dark:text-[#86cfff]'}`} />
                <span>{goal.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Goal Snapshot (Progressive Disclosure) */}
      <div className="mb-6 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
            {currentGoal.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">
            {currentGoal.category.toUpperCase()} • {currentGoal.streamFit.join(', ')}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#A9B8CA] block mb-1">
            Roadmap progress
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-[#F4F7FB]">
            Not started
          </span>
        </div>
      </div>

      {/* Steps List */}
      <div ref={stepsContainerRef} className="space-y-4">
        {currentGoal.steps.map((step) => {
          const isExpanded = !!expandedSteps[step.stepNumber];
          
          return (
            <div
              key={step.stepNumber}
              className="step-card-anim bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
            >
              {/* Clickable Header for Expand */}
              <button
                type="button"
                onClick={() => toggleStepExpand(step.stepNumber)}
                aria-expanded={isExpanded}
                className="w-full px-5 py-5 sm:px-6 flex items-center justify-between text-left focus:outline-none focus:bg-slate-50 dark:focus:bg-white/5 hover:bg-slate-50 dark:hover:bg-[#161c27] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#007DCC] dark:text-[#86cfff] font-bold flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                    {step.stepNumber}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-[#F4F7FB]">
                      {step.stageTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] mt-0.5 max-w-xl">
                      {step.summary}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 ml-4 text-slate-400 dark:text-[#A9B8CA]">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Content Area */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isExpanded ? 'opacity-100 grid-rows-[1fr] pb-5' : 'opacity-0 grid-rows-[0fr] h-0 overflow-hidden'
                }`}
                style={{ display: 'grid' }}
              >
                <div className="min-h-0 px-5 sm:px-6 pt-2 border-t border-slate-100 dark:border-white/5 mx-5 sm:mx-6 mt-2 space-y-6">
                  
                  {/* Recommended Degrees/Courses */}
                  {step.degreesOrCourses && step.degreesOrCourses.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-3">
                        Recommended Degrees & Courses
                      </h5>
                      <div className="space-y-4">
                        {step.degreesOrCourses.map((deg) => (
                          <div key={deg.code} className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-white/5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div>
                                <span className="font-bold text-slate-900 dark:text-[#F4F7FB] block sm:inline">{deg.name}</span>
                                <span className="text-xs font-semibold text-[#007DCC] dark:text-[#86cfff] sm:ml-2 block sm:inline">{deg.duration}</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-gray-400 mt-2 leading-relaxed">{deg.whyFit}</p>
                            
                            {deg.recommendedColleges && deg.recommendedColleges.length > 0 && (
                              <div className="mt-4">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Mumbai Targets</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {deg.recommendedColleges.map(col => (
                                    <button
                                      key={col.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onSelectCollege) onSelectCollege(col.id);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1a202b] border border-slate-200 dark:border-[#D3B5E8]/15 text-xs font-semibold text-[#007DCC] dark:text-[#86cfff] hover:border-[#007DCC] transition-colors"
                                    >
                                      <span>{col.name}</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {step.certifications && step.certifications.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-3">
                        Required Certifications
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {step.certifications.map((cert) => (
                          <div key={cert.name} className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-[#F4F7FB] text-xs font-medium border border-slate-200 dark:border-white/10">
                            <span className="font-bold block text-sm">{cert.name}</span>
                            <span className="text-slate-500 dark:text-[#A9B8CA] block mt-0.5">{cert.provider} • {cert.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internships */}
                  {step.internships && step.internships.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-2">
                        Internship & Experience Focus
                      </h5>
                      <div className="space-y-3">
                        {step.internships.map(intern => (
                          <div key={intern.title} className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-[#007DCC]/20">
                            <div className="font-bold text-slate-900 dark:text-white">{intern.title} <span className="font-normal text-slate-600 dark:text-[#A9B8CA]">at {intern.company}</span></div>
                            <div className="text-xs font-semibold text-blue-700 dark:text-[#86cfff] mt-1">{intern.location} • {intern.stipend}</div>
                            <p className="text-sm mt-2 text-slate-700 dark:text-[#F4F7FB]">{intern.skillsGained}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pro Tips */}
                  {step.proTips && step.proTips.length > 0 && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                      <h6 className="text-xs font-bold text-emerald-800 dark:text-[#51dcbc] uppercase tracking-wider flex items-center gap-2 mb-2">
                        <Compass className="w-4 h-4" />
                        Pro Tips
                      </h6>
                      <ul className="list-disc list-inside space-y-1.5 text-sm text-emerald-900 dark:text-emerald-100 font-medium leading-relaxed">
                        {step.proTips.map((tip, idx) => (
                          <li key={idx} className="">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
