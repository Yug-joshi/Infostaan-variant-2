import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Code,
  Palette,
  Building2,
  Building,
  Terminal,
  Camera,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Train,
  School,
  RotateCcw,
} from 'lucide-react';
import { ScreenType } from '../types';

interface GuidanceScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectCollege: (collegeId: string) => void;
}

export const GuidanceScreen: React.FC<GuidanceScreenProps> = ({
  onNavigate,
  onSelectCollege,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(2); // Start at Step 2 by default to show Image 9 immediately!
  
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

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      if (selectedInterests.length >= 2) {
        // replace the first one or cap at 2
        setSelectedInterests([selectedInterests[1], id]);
      } else {
        setSelectedInterests([...selectedInterests, id]);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(5); // Show results
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

  return (
    <main className="w-full pt-16 sm:pt-20 bg-[#070D18] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Step Indicator & Progress */}
        {currentStep <= 4 && (
          <div className="w-full mb-8">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#A9B8CA] mb-3">
              <span className="text-[#86cfff] flex items-center gap-1.5">
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
            <div className="w-full h-1.5 bg-[#161c27] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#007DCC] to-[#19A7E8] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="w-full text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F4F7FB] tracking-tight mb-3">
              What is your current academic stage?
            </h1>
            <p className="text-sm sm:text-base text-[#A9B8CA] max-w-lg mx-auto mb-8">
              We calibrate course prerequisites, entrance deadlines, and degree tracks for Mumbai institutions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                { id: 'class10', title: 'Class 10th Passed / Junior College Aspirant', desc: 'Exploring FYJC admissions across Mumbai junior colleges' },
                { id: 'class12-commerce', title: 'Class 12th Commerce', desc: 'Targeting B.Com, BAF, BMS, BFM degree courses' },
                { id: 'class12-science', title: 'Class 12th Science', desc: 'Targeting B.Sc IT, Data Science, or Engineering tracks' },
                { id: 'undergrad', title: 'Currently in Undergraduate Degree', desc: 'Looking for BFSI corporate internships and career pathways' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStage(item.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    stage === item.id
                      ? 'bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                      : 'bg-[#0D1828] border-[#D3B5E8]/10 hover:border-[#D3B5E8]/30'
                  }`}
                >
                  <p className="font-semibold text-[#F4F7FB] text-base mb-1">{item.title}</p>
                  <p className="text-xs text-[#A9B8CA]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Exactly matching Image 9 */}
        {currentStep === 2 && (
          <>
            {/* Header / Question */}
            <div className="w-full text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#F4F7FB] tracking-tight mb-3">
                What subjects or areas excite you most?
              </h1>
              <p className="text-sm sm:text-base text-[#A9B8CA] max-w-lg mx-auto">
                Pick up to two. We'll narrow down Mumbai colleges, degree courses, and career possibilities accordingly.
              </p>
            </div>

            {/* 4 Selectable Subject Area Tiles */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Option 1: Commerce & Corporate Finance */}
              <div
                onClick={() => toggleInterest('commerce-finance')}
                className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  selectedInterests.includes('commerce-finance')
                    ? 'bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                    : 'bg-[#0D1828] border-[#D3B5E8]/15 hover:border-[#D3B5E8]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#242a36] flex items-center justify-center text-[#9ccaff]">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    {selectedInterests.includes('commerce-finance') && (
                      <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#F4F7FB] mb-1">
                    Commerce & Corporate Finance
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                    Accounting, capital markets, investment banking, CA pathways
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-[#8a919c]">
                  <Building2 className="w-3.5 h-3.5 text-[#86cfff]" />
                  <span>Key Hub: Nariman Point & Fort</span>
                </div>
              </div>

              {/* Option 2: Management & Entrepreneurship */}
              <div
                onClick={() => toggleInterest('management')}
                className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  selectedInterests.includes('management')
                    ? 'bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                    : 'bg-[#0D1828] border-[#D3B5E8]/15 hover:border-[#D3B5E8]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#242a36] flex items-center justify-center text-[#9ccaff]">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    {selectedInterests.includes('management') && (
                      <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#F4F7FB] mb-1">
                    Management & Entrepreneurship
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                    BMS, BBA, marketing, operations, startup ventures
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-[#8a919c]">
                  <Building className="w-3.5 h-3.5 text-[#86cfff]" />
                  <span>Key Hub: BKC & Lower Parel</span>
                </div>
              </div>

              {/* Option 3: Technology & Computer Science */}
              <div
                onClick={() => toggleInterest('tech-cs')}
                className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  selectedInterests.includes('tech-cs')
                    ? 'bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                    : 'bg-[#0D1828] border-[#D3B5E8]/15 hover:border-[#D3B5E8]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#242a36] flex items-center justify-center text-[#9ccaff]">
                      <Code className="w-5 h-5" />
                    </div>
                    {selectedInterests.includes('tech-cs') && (
                      <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#F4F7FB] mb-1">
                    Technology & Computer Science
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                    B.Sc IT, engineering, software dev, data analytics
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-[#8a919c]">
                  <Terminal className="w-3.5 h-3.5 text-[#86cfff]" />
                  <span>Key Hub: Powai & Navi Mumbai</span>
                </div>
              </div>

              {/* Option 4: Media, Law & Creative Arts */}
              <div
                onClick={() => toggleInterest('media-law')}
                className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  selectedInterests.includes('media-law')
                    ? 'bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                    : 'bg-[#0D1828] border-[#D3B5E8]/15 hover:border-[#D3B5E8]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#242a36] flex items-center justify-center text-[#9ccaff]">
                      <Palette className="w-5 h-5" />
                    </div>
                    {selectedInterests.includes('media-law') && (
                      <span className="w-5 h-5 rounded-full bg-[#007DCC] flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#F4F7FB] mb-1">
                    Media, Law & Creative Arts
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                    BAMMC, mass media, corporate law, design, journalism
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#D3B5E8]/10 flex items-center gap-1.5 text-xs text-[#8a919c]">
                  <Camera className="w-3.5 h-3.5 text-[#86cfff]" />
                  <span>Key Hub: Bandra & Churchgate</span>
                </div>
              </div>
            </div>

            {/* Contextual Insight Box */}
            <div className="w-full bg-[#161c27] border border-[#D3B5E8]/15 rounded-2xl p-5 sm:p-6 mb-10 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#242a36] flex items-center justify-center text-[#9ccaff] shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F4F7FB] mb-1">Why we ask:</h4>
                <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                  Mumbai colleges have distinct regional strengths. For example, Churchgate colleges excel in finance and corporate law, while the Western suburbs dominate in management, media, and tech innovation hubs.
                </p>
              </div>
            </div>
          </>
        )}

        {/* STEP 3: Commute Line */}
        {currentStep === 3 && (
          <div className="w-full text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F4F7FB] tracking-tight mb-3">
              Where in Mumbai do you live or commute from?
            </h1>
            <p className="text-sm sm:text-base text-[#A9B8CA] max-w-lg mx-auto mb-8">
              Suburban rail lines determine daily commute stress. We prioritize colleges with zero changeovers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                { id: 'western', title: 'Western Line (Borivali to Churchgate)', desc: 'Ideal for Mithibai (Vile Parle), NMIMS, H.R. (Churchgate), St. Xavier’s' },
                { id: 'central', title: 'Central Main Line (Thane / Kalyan to CST)', desc: 'Direct access to Somaiya (Vidyavihar), Ruia (Matunga), Podar, CST colleges' },
                { id: 'harbour', title: 'Harbour / Navi Mumbai (Vashi to Panvel)', desc: 'Easy reach to SIES (Nerul), Chembur, and CST via Harbour branch' },
                { id: 'south-mumbai', title: 'South Mumbai Resident', desc: 'Direct Churchgate and Marine Lines institutional access' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCommuteLine(item.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    commuteLine === item.id
                      ? 'bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                      : 'bg-[#0D1828] border-[#D3B5E8]/10 hover:border-[#D3B5E8]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Train className="w-4 h-4 text-[#51dcbc]" />
                    <p className="font-semibold text-[#F4F7FB] text-base">{item.title}</p>
                  </div>
                  <p className="text-xs text-[#A9B8CA]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Key Priorities */}
        {currentStep === 4 && (
          <div className="w-full text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F4F7FB] tracking-tight mb-3">
              What matters most to you in a college?
            </h1>
            <p className="text-sm sm:text-base text-[#A9B8CA] max-w-lg mx-auto mb-8">
              Select your top non-negotiable preference to fine-tune recommendations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                { id: 'ca-flexibility', title: 'CA / Professional Exam Preparation', desc: 'Requires early morning lectures (ends by 10:30 AM) and lenient articleship attendance.' },
                { id: 'placements', title: 'High Corporate Placements & Big 4', desc: 'Prioritizes campuses with top brand recall among Big 4 audit and consulting firms.' },
                { id: 'commute-saving', title: 'Shortest Commute (<30 mins)', desc: 'Keeps travel minimal to preserve daily study bandwidth and mental energy.' },
                { id: 'campus-culture', title: 'Extracurriculars & Festival Culture', desc: 'Famous college fests (Malhar, Umang, Kiran), debating societies, and networking.' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPriority(item.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    priority === item.id
                      ? 'bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC]'
                      : 'bg-[#0D1828] border-[#D3B5E8]/10 hover:border-[#D3B5E8]/30'
                  }`}
                >
                  <p className="font-semibold text-[#F4F7FB] text-base mb-1">{item.title}</p>
                  <p className="text-xs text-[#A9B8CA]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OUTCOME SCREEN (STEP 5) */}
        {currentStep === 5 && (
          <div className="w-full text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[#007DCC]/20 text-[#9ccaff] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold text-[#F4F7FB] mb-2">
              Your Tailored Mumbai Pathways
            </h2>
            <p className="text-sm sm:text-base text-[#A9B8CA] max-w-lg mx-auto mb-8">
              Based on your interest in <strong>Commerce & Corporate Finance</strong> and Western Line proximity, here are your top 2 matched institutions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
              {/* Card 1: Mithibai */}
              <div className="p-6 rounded-2xl bg-[#161c27] border border-[#007DCC]/40 hover:border-[#007DCC] transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#51dcbc] uppercase tracking-wider">
                    96% Match • Best for Western Suburbs
                  </span>
                  <h3 className="text-xl font-bold text-[#F4F7FB] mt-1 mb-1">
                    Mithibai College
                  </h3>
                  <p className="text-xs text-[#A9B8CA] mb-3">
                    Vile Parle West • 5 min from station
                  </p>
                  <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                    Morning shifts allow CA articleship prep. High Big 4 recruitment and premier SVKM campus facilities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCollege('mithibai')}
                  className="mt-6 w-full py-2.5 rounded-xl bg-[#007DCC] text-white font-semibold text-sm hover:bg-[#19A7E8] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore Mithibai</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 2: H.R. College */}
              <div className="p-6 rounded-2xl bg-[#161c27] border border-[#D3B5E8]/15 hover:border-[#D3B5E8]/40 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#86cfff] uppercase tracking-wider">
                    94% Match • Premier CA Ecosystem
                  </span>
                  <h3 className="text-xl font-bold text-[#F4F7FB] mt-1 mb-1">
                    H.R. College of Commerce
                  </h3>
                  <p className="text-xs text-[#A9B8CA] mb-3">
                    Churchgate • 3 min from terminus
                  </p>
                  <p className="text-xs sm:text-sm text-[#A9B8CA] leading-relaxed">
                    Direct access to Nariman Point finance firms. Highly accommodating timetable for registered CA articles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCollege('hr-college')}
                  className="mt-6 w-full py-2.5 rounded-xl bg-[#242a36] hover:bg-[#2f3541] text-[#F4F7FB] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore H.R. College</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#161c27] hover:bg-[#1a202b] text-[#A9B8CA] hover:text-[#F4F7FB] text-sm font-medium transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('search')}
                className="px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#19A7E8] text-white text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <span>View Full Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Wizard Bottom Navigation Bar */}
        {currentStep <= 4 && (
          <div className="w-full flex items-center justify-between pt-6 border-t border-[#D3B5E8]/15">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#A9B8CA] hover:text-[#F4F7FB] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-4">
              {currentStep === 2 && (
                <span className="text-xs text-[#8a919c] font-medium hidden sm:inline">
                  {selectedInterests.length} of 2 selected
                </span>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 2 && selectedInterests.length === 0}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 ${
                  currentStep === 2 && selectedInterests.length === 0
                    ? 'bg-[#161c27] text-[#8a919c] cursor-not-allowed'
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
    </main>
  );
};
