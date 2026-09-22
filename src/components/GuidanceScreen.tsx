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
} from 'lucide-react';
import { PencilLoader } from './PencilLoader';
import gsap from 'gsap';

interface GuidanceScreenProps {
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
}

export const GuidanceScreen: React.FC<GuidanceScreenProps> = ({
  onNavigate,
  onSelectCollege,
}) => {
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
      // Simulate real recommendation generation
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
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-8">
                What is your current academic stage?
              </h1>
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

          {/* STEP 3: Commute & Location */}
          {currentStep === 3 && (
            <div className="w-full mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-8">
                What is your preferred Mumbai commute line?
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {[
                  {
                    id: 'western',
                    title: 'Western Railway Line',
                    desc: 'Churchgate, Marine Lines, Charni Road, Dadar, Vile Parle, Borivali',
                  },
                  {
                    id: 'central',
                    title: 'Central Railway Line',
                    desc: 'CSMT, Dadar, Matunga, Kurla, Ghatkopar, Thane',
                  },
                  {
                    id: 'south-mumbai',
                    title: 'South Mumbai Core Hubs',
                    desc: 'Direct walkability to Churchgate, Marine Drive & Fort audit firms',
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
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-[#51dcbc] text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Personalized Recommendation Ready</span>
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F4F7FB] tracking-tight">
                  Recommended Colleges For You
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {matchedColleges.map((col) => (
                  <div
                    key={col.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-[#007DCC]/10 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold">
                          {col.matchRate} Match
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#A9B8CA]">
                          {col.badge}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-2">
                        {col.name}
                      </h2>
                      <p className="text-xs font-medium text-slate-500 dark:text-[#71839A] mb-4">
                        {col.location}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed mb-6">
                        {col.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectCollege(col.id)}
                      className="w-full py-3 bg-[#007DCC] hover:bg-[#006cb0] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>{col.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-[#F4F7FB] font-bold text-sm hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart Wizard</span>
                </button>
                <button
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
