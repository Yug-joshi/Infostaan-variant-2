import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  TrendingUp,
  Briefcase,
  Code,
  Palette,
  CheckCircle2,
  Building2,
  Building,
  Terminal,
  Camera,
  Lightbulb,
  Train,
  Check,
  Compass,
  GraduationCap,
  Award,
  Clock,
  MapPin,
} from 'lucide-react';
import { ScreenType } from '../types';
import { CareerRoadmap } from './CareerRoadmap';
import gsap from 'gsap';

interface GuidanceScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectCollege: (collegeId: string) => void;
}

export const GuidanceScreen: React.FC<GuidanceScreenProps> = ({
  onNavigate,
  onSelectCollege,
}) => {
  // Active view: 'roadmap' or 'wizard'
  const [activeTab, setActiveTab] = useState<'roadmap' | 'wizard'>('roadmap');

  // Help Me Decide wizard step: starts strictly at 1
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Academic stage
  const [stage, setStage] = useState<string>('class12-commerce');

  // Step 2: Interests (supports up to 2)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'commerce-finance',
  ]);

  // Step 3: Commute line
  const [commuteLine, setCommuteLine] = useState<string>('western');

  // Step 4: Priorities
  const [priority, setPriority] = useState<string>('ca-flexibility');

  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP animation when changing wizard steps or tabs
  useEffect(() => {
    if (stepContainerRef.current) {
      gsap.fromTo(
        stepContainerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [currentStep, activeTab]);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      if (selectedInterests.length >= 2) {
        setSelectedInterests([selectedInterests[1], id]);
      } else {
        setSelectedInterests([...selectedInterests, id]);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onNavigate('home');
    }
  };

  const progressPercent = Math.min(100, Math.round((currentStep / 4) * 100));

  // Determine top matched colleges dynamically based on choices
  const getMatchedColleges = () => {
    const list = [];

    if (priority === 'ca-flexibility' || commuteLine === 'south-mumbai') {
      list.push({
        id: 'hinduja',
        matchRate: '98%',
        badge: 'Premier CA Articleship Schedule',
        name: 'K.P.B. Hinduja College of Commerce',
        location: 'Charni Road, South Mumbai • 2 min from station',
        desc: 'Lectures wrap up at 10:15 AM sharp, allowing students to travel to Churchgate and Nariman Point Big 4 audit offices for articleship. Highest CA rankholder network in South Mumbai.',
        actionText: 'Explore Hinduja College',
      });
      list.push({
        id: 'hr-college',
        matchRate: '96%',
        badge: 'Churchgate Finance Corridor',
        name: 'H.R. College of Commerce & Economics',
        location: 'Churchgate, South Mumbai • 3 min from station',
        desc: 'Direct proximity to Nariman Point financial district. World-class alumni network across Morgan Stanley, KPMG, and EY.',
        actionText: 'Explore H.R. College',
      });
    } else if (commuteLine === 'central') {
      list.push({
        id: 'podar',
        matchRate: '97%',
        badge: 'Central Line Academic Benchmark',
        name: 'R.A. Podar College of Commerce & Economics',
        location: 'Matunga Central, Mumbai • 5 min from station',
        desc: 'Central Mumbai’s gold-standard commerce campus. Strict academic rigor with top-tier B.Com, BMS, and BAF student placements.',
        actionText: 'Explore Podar College',
      });
      list.push({
        id: 'hinduja',
        matchRate: '92%',
        badge: 'Direct Marine Lines/Charni Road Access',
        name: 'K.P.B. Hinduja College of Commerce',
        location: 'Charni Road, South Mumbai • 2 min from station',
        desc: 'Ideal for central line commuters willing to travel via Dadar to South Mumbai for premier CA articleship flexibility.',
        actionText: 'Explore Hinduja College',
      });
    } else {
      list.push({
        id: 'mithibai',
        matchRate: '96%',
        badge: 'Best for Western Suburbs & Fests',
        name: 'Mithibai College of Arts & Commerce',
        location: 'Vile Parle West, Western Suburbs • 5 min from station',
        desc: 'Morning shifts allow CA articleship prep and corporate internships in BKC. High Big 4 recruitment and premier SVKM campus facilities.',
        actionText: 'Explore Mithibai College',
      });
      list.push({
        id: 'hinduja',
        matchRate: '94%',
        badge: 'South Mumbai Heritage',
        name: 'K.P.B. Hinduja College of Commerce',
        location: 'Charni Road, South Mumbai • 2 min from station',
        desc: 'Renowned faculty and legacy CA coaching synchronization, with fast direct transit down the Western line.',
        actionText: 'Explore Hinduja College',
      });
    }

    return list;
  };

  const matchedColleges = getMatchedColleges();

  return (
    <main className="w-full pt-20 sm:pt-24 pb-20 bg-slate-50 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      {/* Top Switcher Strip */}
      <div className="w-full border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1828] sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="tab-career-roadmap"
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'roadmap'
                  ? 'bg-[#007DCC] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161c27]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Career Roadmap</span>
            </button>

            <button
              type="button"
              id="tab-help-me-decide"
              onClick={() => setActiveTab('wizard')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'wizard'
                  ? 'bg-[#007DCC] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161c27]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Help Me Decide Wizard</span>
              {currentStep > 1 && currentStep <= 4 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-[#8a919c] hidden md:block">
            {activeTab === 'roadmap'
              ? '6 Verified Mumbai Career Pathways'
              : `Admission Matching • Step ${currentStep} of 4`}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* VIEW 1: INTERACTIVE CAREER ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="w-full">
            <CareerRoadmap
              onSelectCollege={onSelectCollege}
              onNavigate={onNavigate}
            />

            {/* Bottom Callout to try Help Me Decide */}
            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left shadow-2xs">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  Unsure which Mumbai college fits your schedule?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] max-w-2xl">
                  Take our 4-question "Help Me Decide" quiz to match colleges based on your railway line and CA articleship requirements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setActiveTab('wizard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white font-bold text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-2 transition-all shadow-xs shrink-0"
              >
                <span>Launch Matching Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: HELP ME DECIDE WIZARD (Free responsive layout, left-aligned) */}
        {activeTab === 'wizard' && (
          <div ref={stepContainerRef} className="w-full flex flex-col text-left">
            {/* Step Indicator & Progress */}
            {currentStep <= 4 && (
              <div className="w-full mb-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B8CA] mb-3">
                  <span className="text-[#007DCC] dark:text-[#86cfff] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007DCC]" />
                    STEP {currentStep} OF 4 •{' '}
                    {currentStep === 1
                      ? 'YOUR CURRENT STAGE'
                      : currentStep === 2
                      ? 'YOUR AREA OF INTEREST'
                      : currentStep === 3
                      ? 'COMMUTE & LOCATION'
                      : 'KEY PRIORITIES'}
                  </span>
                  <span>{progressPercent}% Complete</span>
                </div>
                {/* Progress Track */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-[#161c27] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#007DCC] to-[#19A7E8] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* STEP 1: Academic Stage */}
            {currentStep === 1 && (
              <div className="w-full mb-8">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-2">
                  What is your current academic stage?
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] max-w-2xl mb-8">
                  We calibrate course prerequisites, entrance deadlines, and degree tracks for Mumbai institutions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {[
                    {
                      id: 'class10',
                      title: 'Class 10th Passed / Junior College Aspirant',
                      desc: 'Exploring FYJC admissions across Mumbai junior colleges (Hinduja, Podar, Mithibai, HR)',
                    },
                    {
                      id: 'class12-commerce',
                      title: 'Class 12th Commerce',
                      desc: 'Targeting B.Com, BAF, BMS, BFM degree courses and professional certifications',
                    },
                    {
                      id: 'class12-science',
                      title: 'Class 12th Science',
                      desc: 'Targeting B.Sc IT, Data Science, or Engineering tracks in Powai / Suburban hubs',
                    },
                    {
                      id: 'undergrad',
                      title: 'Currently in Undergraduate Degree',
                      desc: 'Looking for BFSI corporate internships in BKC & Nariman Point, plus career pathways',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStage(item.id)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        stage === item.id
                          ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                          : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/10 hover:border-[#007DCC]/40'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-[#F4F7FB] text-base mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-[#A9B8CA]">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Interests */}
            {currentStep === 2 && (
              <div className="w-full mb-8">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-2">
                  What subjects or areas excite you most?
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] max-w-2xl mb-8">
                  Pick up to two. We'll narrow down Mumbai colleges, degree courses, and career possibilities accordingly.
                </p>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* Option 1: Commerce & Corporate Finance */}
                  <div
                    onClick={() => toggleInterest('commerce-finance')}
                    className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                      selectedInterests.includes('commerce-finance')
                        ? 'bg-blue-50/70 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                        : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-[#242a36] flex items-center justify-center text-[#007DCC] dark:text-[#9ccaff]">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        {selectedInterests.includes('commerce-finance') && (
                          <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
                        Commerce & Corporate Finance
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                        Accounting, capital markets, investment banking, CA pathways
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8a919c]">
                      <Building2 className="w-3.5 h-3.5 text-[#007DCC] dark:text-[#86cfff]" />
                      <span>Key Hub: Nariman Point & Fort</span>
                    </div>
                  </div>

                  {/* Option 2: Management & Entrepreneurship */}
                  <div
                    onClick={() => toggleInterest('management')}
                    className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                      selectedInterests.includes('management')
                        ? 'bg-blue-50/70 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                        : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-[#242a36] flex items-center justify-center text-[#007DCC] dark:text-[#9ccaff]">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        {selectedInterests.includes('management') && (
                          <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
                        Management & Entrepreneurship
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                        BMS, BBA, marketing, operations, startup ventures
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8a919c]">
                      <Building className="w-3.5 h-3.5 text-[#007DCC] dark:text-[#86cfff]" />
                      <span>Key Hub: BKC & Lower Parel</span>
                    </div>
                  </div>

                  {/* Option 3: Technology & Computer Science */}
                  <div
                    onClick={() => toggleInterest('tech-cs')}
                    className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                      selectedInterests.includes('tech-cs')
                        ? 'bg-blue-50/70 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                        : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-[#242a36] flex items-center justify-center text-[#007DCC] dark:text-[#9ccaff]">
                          <Code className="w-5 h-5" />
                        </div>
                        {selectedInterests.includes('tech-cs') && (
                          <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
                        Technology & Computer Science
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                        B.Sc IT, engineering, software dev, data analytics
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8a919c]">
                      <Terminal className="w-3.5 h-3.5 text-[#007DCC] dark:text-[#86cfff]" />
                      <span>Key Hub: Powai & Navi Mumbai</span>
                    </div>
                  </div>

                  {/* Option 4: Media, Law & Creative Arts */}
                  <div
                    onClick={() => toggleInterest('media-law')}
                    className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                      selectedInterests.includes('media-law')
                        ? 'bg-blue-50/70 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                        : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-[#242a36] flex items-center justify-center text-[#007DCC] dark:text-[#9ccaff]">
                          <Palette className="w-5 h-5" />
                        </div>
                        {selectedInterests.includes('media-law') && (
                          <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-[#F4F7FB] mb-1">
                        Media, Law & Creative Arts
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                        BAMMC, mass media, corporate law, design, journalism
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8a919c]">
                      <Camera className="w-3.5 h-3.5 text-[#007DCC] dark:text-[#86cfff]" />
                      <span>Key Hub: Bandra & Churchgate</span>
                    </div>
                  </div>
                </div>

                {/* Contextual Insight Box */}
                <div className="w-full bg-white dark:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-2xl p-5 sm:p-6 mb-8 flex items-start gap-4 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-[#242a36] flex items-center justify-center text-[#007DCC] dark:text-[#9ccaff] shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">Why we ask:</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                      Mumbai colleges have distinct regional strengths. For example, South Mumbai colleges (Hinduja, H.R., Jai Hind) excel in finance and corporate law, while the Western suburbs (Mithibai, NM College) dominate in management, media, and tech innovation hubs.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Commute Line */}
            {currentStep === 3 && (
              <div className="w-full mb-8">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-2">
                  Where in Mumbai do you live or commute from?
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] max-w-2xl mb-8">
                  Suburban rail lines determine daily commute stress. We prioritize colleges with zero changeovers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {[
                    {
                      id: 'western',
                      title: 'Western Line (Borivali to Churchgate)',
                      desc: 'Ideal for Mithibai (Vile Parle), NM College, Hinduja (Charni Road), H.R. (Churchgate), Jai Hind',
                    },
                    {
                      id: 'central',
                      title: 'Central Main Line (Thane / Kalyan to CST)',
                      desc: 'Direct access to R.A. Podar (Matunga), Ruia, Somaiya (Vidyavihar), and CST colleges',
                    },
                    {
                      id: 'harbour',
                      title: 'Harbour / Navi Mumbai (Vashi to Panvel)',
                      desc: 'Easy reach to SIES (Nerul), Chembur, and CST via Harbour branch',
                    },
                    {
                      id: 'south-mumbai',
                      title: 'South Mumbai Resident',
                      desc: 'Direct Charni Road, Churchgate, and Marine Lines institutional access',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCommuteLine(item.id)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        commuteLine === item.id
                          ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                          : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/10 hover:border-[#007DCC]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Train className="w-4 h-4 text-[#007DCC] dark:text-[#51dcbc]" />
                        <p className="font-semibold text-slate-900 dark:text-[#F4F7FB] text-base">{item.title}</p>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-[#A9B8CA]">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Key Priorities */}
            {currentStep === 4 && (
              <div className="w-full mb-8">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-2">
                  What matters most to you in a college?
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] max-w-2xl mb-8">
                  Select your top non-negotiable preference to fine-tune recommendations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {[
                    {
                      id: 'ca-flexibility',
                      title: 'CA / Professional Articleship Flexibility',
                      desc: 'Requires early morning lectures (ending by 10:15–10:30 AM) and lenient articleship attendance like at Hinduja and H.R.',
                    },
                    {
                      id: 'placements',
                      title: 'High Corporate Placements & Big 4 Recruitment',
                      desc: 'Prioritizes campuses with top brand recall among Big 4 audit and global consulting firms.',
                    },
                    {
                      id: 'commute-saving',
                      title: 'Shortest Commute (<30 mins)',
                      desc: 'Keeps travel minimal on Suburban rail to preserve daily study bandwidth and mental energy.',
                    },
                    {
                      id: 'campus-culture',
                      title: 'Extracurriculars & Festival Culture',
                      desc: 'Famous college fests (Malhar, Umang, Kiran), debating societies, and student leadership networks.',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPriority(item.id)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        priority === item.id
                          ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                          : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/10 hover:border-[#007DCC]/40'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-[#F4F7FB] text-base mb-1">{item.title}</p>
                      <p className="text-xs text-slate-600 dark:text-[#A9B8CA]">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Outcome Recommendations */}
            {currentStep === 5 && (
              <div className="w-full py-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-[#007DCC]/20 text-[#007DCC] dark:text-[#9ccaff] text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommendation Results</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F4F7FB] mb-2">
                  Your Tailored Mumbai College Matches
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#A9B8CA] max-w-2xl mb-8">
                  Calibrated for your preferences in <strong>Commerce, Finance, and Commute</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left mb-8">
                  {matchedColleges.map((col) => (
                    <div
                      key={col.id}
                      className="p-6 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] transition-all flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-[#007DCC] dark:text-[#51dcbc] uppercase tracking-wider block">
                          {col.matchRate} Match • {col.badge}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mt-1 mb-1">
                          {col.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-[#A9B8CA] mb-3 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#007DCC]" />
                          <span>{col.location}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                          {col.desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectCollege(col.id)}
                        className="mt-6 w-full py-2.5 rounded-xl bg-[#007DCC] text-white font-bold text-sm hover:bg-[#19A7E8] transition-colors flex items-center justify-center gap-2"
                      >
                        <span>{col.actionText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#161c27] hover:bg-slate-100 dark:hover:bg-[#1a202b] text-slate-700 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border border-slate-200 dark:border-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Quiz (Step 1)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('roadmap')}
                    className="px-5 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>View Career Roadmap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('search')}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#242a36] dark:hover:bg-[#2f3541] text-slate-800 dark:text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    <span>View All Search Results</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Wizard Bottom Navigation Bar */}
            {currentStep <= 4 && (
              <div className="w-full flex items-center justify-between pt-6 border-t border-slate-200 dark:border-[#D3B5E8]/15 mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-[#A9B8CA] hover:text-slate-900 dark:hover:text-[#F4F7FB] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{currentStep === 1 ? 'Exit to Home' : 'Back'}</span>
                </button>

                <div className="flex items-center gap-4">
                  {currentStep === 2 && (
                    <span className="text-xs text-slate-500 dark:text-[#8a919c] font-medium hidden sm:inline">
                      {selectedInterests.length} of 2 selected
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === 2 && selectedInterests.length === 0}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${
                      currentStep === 2 && selectedInterests.length === 0
                        ? 'bg-slate-200 dark:bg-[#161c27] text-slate-400 dark:text-[#8a919c] cursor-not-allowed'
                        : 'bg-[#007DCC] hover:bg-[#006cb0] text-white'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
