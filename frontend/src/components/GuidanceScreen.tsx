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
  Check,
  Compass,
  GraduationCap,
  Award,
  Clock,
  MapPin,
  Bookmark,
  Scale,
} from 'lucide-react';
import { PencilLoader } from './PencilLoader';
import { MascotArt } from './MascotArt';
import gsap from 'gsap';
import {
  generateRecommendations,
  getRecommendationDiagnostics,
} from '../lib/recommendationEngine';

interface GuidanceScreenProps {
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
  savedCollegeIds?: string[];
  onToggleSave?: (collegeId: string) => void;
  onOpenCompare?: (primaryCollegeId: string) => void;
}

export const GuidanceScreen: React.FC<GuidanceScreenProps> = ({
  onNavigate,
  onSelectCollege,
  savedCollegeIds = [],
  onToggleSave,
  onOpenCompare,
}) => {
  // Help Me Decide wizard step: starts strictly at 1
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Academic stage
  const [stage, setStage] = useState<string>('class12-commerce');

  // Step 2: Interests (supports up to 2)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'commerce-finance',
  ]);

  // Step 3: Preferred Location (Canonical Mumbai Region)
  const [selectedLocation, setSelectedLocation] = useState<string>('central');

  // Step 4: Priorities
  const [priority, setPriority] = useState<string>('ca-flexibility');

  // Display limit for pagination / load more (null means show all eligible colleges)
  const [visibleLimit, setVisibleLimit] = useState<number | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);

  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP animation when changing wizard steps
  useEffect(() => {
    if (stepContainerRef.current) {
      gsap.fromTo(
        stepContainerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [currentStep]);

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
      setIsCalculating(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Simulate recommendation generation
      setTimeout(() => {
        setIsCalculating(false);
        setCurrentStep(5);
      }, 1200);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onNavigate('/');
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setStage('class12-commerce');
    setSelectedInterests(['commerce-finance']);
    setSelectedLocation('central');
    setPriority('ca-flexibility');
    setVisibleLimit(null);
  };

  const progressPercent = Math.min(100, Math.round((currentStep / 4) * 100));

  // Step A - G recommendation engine invocation strictly applying location constraint
  const diagnostics = getRecommendationDiagnostics({
    stage,
    interests: selectedInterests,
    location: selectedLocation,
    priority,
  });

  const allEligibleColleges = diagnostics.finalRecommendations;
  const matchedColleges =
    visibleLimit !== null && visibleLimit > 0
      ? allEligibleColleges.slice(0, visibleLimit)
      : allEligibleColleges;

  const totalEligibleCount = allEligibleColleges.length;
  const renderedCount = matchedColleges.length;
  const hiddenByLimit = Math.max(0, totalEligibleCount - renderedCount);

  return (
    <main className="w-full pt-20 sm:pt-24 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
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
                    ? 'COLLEGE LOCATION'
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight max-w-2xl">
                  What is your current academic stage?
                </h1>
                <div className="w-28 sm:w-32 shrink-0">
                  <MascotArt variant="thinking" className="w-full" alt="InfoBuddy mascot asking a quick course-planning question" />
                </div>
              </div>
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
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-8">
                What subjects or areas excite you most?
              </h1>

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
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff]">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    {selectedInterests.includes('commerce-finance') && (
                      <span className="p-1 rounded-full bg-[#007DCC] text-white">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                      Commerce, CA & Corporate Finance
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                      Financial accounting, tax laws, audit compliance, stock markets, and CA synchronization.
                    </p>
                  </div>
                </div>

                {/* Option 2: Business Management */}
                <div
                  onClick={() => toggleInterest('management-bms')}
                  className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                    selectedInterests.includes('management-bms')
                      ? 'bg-blue-50/70 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                      : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC]/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-[#007DCC]/10 text-[#007DCC] dark:text-[#86cfff]">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    {selectedInterests.includes('management-bms') && (
                      <span className="p-1 rounded-full bg-[#007DCC] text-white">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                      Business Management & BMS
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                      Marketing strategies, corporate operations, HR management, entrepreneurship, and leadership.
                    </p>
                  </div>
                </div>

                {/* Option 3: Tech & Coding */}
                <div
                  onClick={() => toggleInterest('tech-coding')}
                  className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                    selectedInterests.includes('tech-coding')
                      ? 'bg-blue-50/70 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                      : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC]/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-[#007DCC]/10 text-[#007DCC] dark:text-[#86cfff]">
                      <Code className="w-6 h-6" />
                    </div>
                    {selectedInterests.includes('tech-coding') && (
                      <span className="p-1 rounded-full bg-[#007DCC] text-white">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                      Technology, B.Sc IT & Analytics
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                      Software engineering, data science, web development, cloud computing, and IT infrastructure.
                    </p>
                  </div>
                </div>

                {/* Option 4: Design & Media */}
                <div
                  onClick={() => toggleInterest('design-media')}
                  className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                    selectedInterests.includes('design-media')
                      ? 'bg-blue-50/70 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                      : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC]/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-[#D3B5E8]">
                      <Palette className="w-6 h-6" />
                    </div>
                    {selectedInterests.includes('design-media') && (
                      <span className="p-1 rounded-full bg-[#007DCC] text-white">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#F4F7FB] mb-1">
                      Media, BMM & Creative Arts
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                      Journalism, public relations, advertising production, digital media, and film studies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Geographic Location Filter */}
          {currentStep === 3 && (
            <div className="w-full mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-2">
                Where would you prefer your college to be located?
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA] mb-8">
                Select your preferred geographic region in Mumbai. College recommendations will strictly match your chosen location.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {[
                  {
                    id: 'central',
                    title: 'Central Suburbs / Central Mumbai',
                    desc: 'Matunga, Sion, Dadar, Kurla, Ghatkopar, Vidyavihar',
                  },
                  {
                    id: 'south-mumbai',
                    title: 'South Mumbai',
                    desc: 'Churchgate, Marine Lines, Charni Road, Fort, Parel',
                  },
                  {
                    id: 'western',
                    title: 'Western Suburbs',
                    desc: 'Vile Parle, Andheri, Bandra, Malad, Kandivali, Borivali',
                  },
                  {
                    id: 'eastern',
                    title: 'Eastern Suburbs',
                    desc: 'Mulund, Bhandup, Kanjurmarg, Thane corridor',
                  },
                  {
                    id: 'harbour',
                    title: 'Harbour / Central-East',
                    desc: 'Chembur, Wadala, Navi Mumbai hubs',
                  },
                  {
                    id: 'all-mumbai',
                    title: 'All Mumbai',
                    desc: 'Show premier colleges across all Mumbai regions and corridors',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLocation(item.id)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      selectedLocation === item.id
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

          {/* STEP 4: Key Priorities */}
          {currentStep === 4 && (
            <div className="w-full mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-8">
                What is your top priority for college decision?
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {[
                  {
                    id: 'ca-flexibility',
                    title: 'Early Morning Shift / CA Articleship Sync',
                    desc: 'Lectures ending by 10:15 AM so you can commute to Big 4 audit firms in BKC / South Mumbai',
                  },
                  {
                    id: 'placements',
                    title: 'Corporate Campus Placements & Industry Tie-ups',
                    desc: 'Strong campus recruitment, high average CTC, and active placement cell',
                  },
                  {
                    id: 'brand',
                    title: 'Legacy Brand & Autonomous Excellence',
                    desc: 'Top cutoffs, prestigious alumni network, and autonomous syllabus flexibility',
                  },
                  {
                    id: 'fest',
                    title: 'Extracurricular Exposure & College Culture',
                    desc: 'Vibrant fest culture (Umang, Malhar, Kiran) and student organization leadership',
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
                    <p className="font-semibold text-slate-900 dark:text-[#F4F7FB] text-base mb-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-[#A9B8CA]">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: CALCULATING LOADER */}
          {isCalculating && (
            <div className="py-16 text-center">
              <PencilLoader
                size="large"
                variant="spin"
                message="Matching your choices with 10,000+ Mumbai admission data points..."
              />
            </div>
          )}

          {/* STEP 5: RECOMMENDATION RESULTS */}
          {!isCalculating && currentStep === 5 && (
            <div className="w-full text-left animate-fade-in">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-[#51dcbc] text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Personalized Recommendation Ready</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007DCC]/10 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold">
                      {totalEligibleCount} Eligible {totalEligibleCount === 1 ? 'College' : 'Colleges'} Found
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-[#A9B8CA] text-xs font-medium">
                      Region: {diagnostics.normalizedRegion}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight">
                    Recommended Colleges For You
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A9B8CA] mt-1">
                    Showing {renderedCount === totalEligibleCount ? `all ${totalEligibleCount}` : `${renderedCount} of ${totalEligibleCount}`} verified colleges ranked by academic alignment, shift timings, and your decision priorities.
                  </p>
                </div>
                <div className="w-24 sm:w-28 shrink-0 self-center sm:self-end">
                  <MascotArt variant="idea" className="w-full" alt="InfoBuddy mascot sharing a recommendation idea" />
                </div>
              </div>

              {matchedColleges.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-md text-center max-w-xl mx-auto mb-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                    No Matching Colleges in this Region
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-[#A9B8CA] mb-6">
                    We could not find verified colleges in <strong>{diagnostics.normalizedRegion}</strong> matching your exact criteria. You can broaden your preference to explore colleges across all Mumbai regions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation('all-mumbai');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#007DCC] text-white font-bold text-sm hover:bg-[#006cb0] transition-all"
                    >
                      Explore All Mumbai
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(3);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-[#F4F7FB] font-semibold text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                    >
                      Change Location
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {matchedColleges.map((col) => (
                      <div
                        key={col.id}
                        className="p-6 rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-md flex flex-col justify-between hover:border-[#007DCC]/40 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-[#007DCC]/10 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold">
                              {col.matchRate}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-[#A9B8CA]">
                              {col.badge}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                            {col.name}
                          </h2>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#71839A] mb-4">
                            <MapPin className="w-3.5 h-3.5 text-[#007DCC] shrink-0" />
                            <span>{col.location}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed mb-6">
                            {col.desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => onSelectCollege(col.id)}
                            className="flex-1 py-3 bg-[#007DCC] hover:bg-[#006cb0] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                          >
                            <span>{col.actionText}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          {onToggleSave && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleSave(col.id);
                              }}
                              className={`p-3 rounded-xl border transition-all ${
                                savedCollegeIds?.includes(col.id)
                                  ? 'bg-amber-500 text-white border-amber-500'
                                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#A9B8CA] border-slate-200 dark:border-white/10 hover:text-amber-500 hover:border-amber-400'
                              }`}
                              title={savedCollegeIds?.includes(col.id) ? 'Saved to shortlist' : 'Save to shortlist'}
                              aria-label="Save to shortlist"
                            >
                              <Bookmark className={`w-4 h-4 ${savedCollegeIds?.includes(col.id) ? 'fill-white' : ''}`} />
                            </button>
                          )}
                          {onOpenCompare && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenCompare(col.id);
                              }}
                              className="p-3 rounded-xl border bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#A9B8CA] border-slate-200 dark:border-white/10 hover:text-[#007DCC] hover:border-[#007DCC]/40 transition-all"
                              title="Compare college"
                              aria-label="Compare college"
                            >
                              <Scale className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load more / Pagination if limit was applied */}
                  {hiddenByLimit > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                      <button
                        type="button"
                        onClick={() => setVisibleLimit((prev) => (prev ? prev + 6 : 12))}
                        className="px-6 py-3 rounded-xl bg-[#007DCC] text-white font-bold text-sm hover:bg-[#006cb0] transition-all shadow-sm"
                      >
                        Load More Colleges ({hiddenByLimit} remaining)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisibleLimit(null)}
                        className="px-6 py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-[#F4F7FB] font-semibold text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                      >
                        Show All {totalEligibleCount} Colleges
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Dev Diagnostics (Only rendered in development environment for verification) */}
              {import.meta.env.DEV && (
                <div className="mb-6 p-5 rounded-2xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/40 dark:border-white/10 text-xs text-slate-600 dark:text-[#A9B8CA]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-slate-800 dark:text-[#F4F7FB] text-sm">
                      Recommendation Pipeline Diagnostics
                    </p>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#007DCC]/15 text-[#007DCC] font-bold text-[11px]">
                      {renderedCount} / {totalEligibleCount} Visible
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Region</span>
                      <span className="font-semibold text-[#007DCC] truncate block" title={diagnostics.normalizedRegion}>
                        {diagnostics.normalizedRegion}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Initial Candidates</span>
                      <span className="font-semibold">{diagnostics.initialCandidateCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Resolved Identities</span>
                      <span className="font-semibold">{diagnostics.candidatesWithResolvedIdentities}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Verified Locations</span>
                      <span className="font-semibold">
                        {diagnostics.candidatesWithVerifiedLocations}
                        {diagnostics.candidatesWithUnresolvedLocations > 0 && (
                          <span className="text-slate-400 font-normal text-[10px] ml-1">
                            ({diagnostics.candidatesWithUnresolvedLocations} unres)
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">After Location</span>
                      <span className="font-semibold">{diagnostics.remainingAfterLocationFilter}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">After Academic</span>
                      <span className="font-semibold">{diagnostics.remainingAfterAcademicFilter}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Unique Eligible</span>
                      <span className="font-semibold">{diagnostics.totalEligibleScored}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Rendered / Hidden</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {renderedCount} / {hiddenByLimit}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-[#F4F7FB] font-bold text-sm hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart Wizard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] text-white font-bold text-sm hover:bg-[#006cb0] transition-all"
                >
                  <span>Return to Home</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Bar for Steps 1 - 4 */}
          {currentStep <= 4 && !isCalculating && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#161c27] font-semibold text-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{currentStep === 1 ? 'Exit to Home' : 'Previous Step'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <span>{currentStep === 4 ? 'Generate Recommendation' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
