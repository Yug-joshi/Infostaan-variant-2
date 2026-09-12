import React, { useState, useEffect, useRef } from 'react';
import { X, Scale, Train, Check, MapPin, Building, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { COMPARISON_DATA } from '../data/mockData';
import gsap from 'gsap';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCollege1?: string;
  defaultCollege2?: string;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  defaultCollege1 = 'mithibai',
  defaultCollege2 = 'hr-college',
}) => {
  const [col1, setCol1] = useState<string>(defaultCollege1);
  const [col2, setCol2] = useState<string>(defaultCollege2);
  const modalCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalCardRef.current) {
      gsap.fromTo(
        modalCardRef.current,
        { opacity: 0, scale: 0.96, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data1 = COMPARISON_DATA[col1] || COMPARISON_DATA.mithibai;
  const data2 = COMPARISON_DATA[col2] || COMPARISON_DATA['hr-college'];

  const collegeOptions = [
    { id: 'mithibai', label: 'Mithibai College (Vile Parle West)' },
    { id: 'hr-college', label: 'H.R. College (Churchgate)' },
    { id: 'hinduja', label: 'K.P.B. Hinduja College (Charni Road)' },
    { id: 'podar', label: 'R.A. Podar College (Matunga Central)' },
    { id: 'jai-hind', label: 'Jai Hind College (Churchgate/Marine Drive)' },
    { id: 'nm-college', label: 'Narsee Monjee College (Vile Parle West)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
      <div
        ref={modalCardRef}
        className="relative w-full max-w-4xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-[#D3B5E8]/15 flex items-center justify-between bg-slate-50 dark:bg-[#161c27]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#242a36] text-[#007DCC] dark:text-[#9ccaff] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                Side-by-Side College Comparison
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B8CA]">
                Compare real Mumbai factors: commute duration, CA flexibility, fees, and cutoffs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] rounded-lg hover:bg-slate-100 dark:hover:bg-[#242a36] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Table */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider">
                College A
              </label>
              <select
                value={col1}
                onChange={(e) => setCol1(e.target.value)}
                className="bg-slate-50 dark:bg-[#1a202b] text-slate-900 dark:text-[#F4F7FB] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-[#007DCC]"
              >
                {collegeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider">
                College B
              </label>
              <select
                value={col2}
                onChange={(e) => setCol2(e.target.value)}
                className="bg-slate-50 dark:bg-[#1a202b] text-slate-900 dark:text-[#F4F7FB] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-[#007DCC]"
              >
                {collegeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards Matrix */}
          <div className="space-y-4">
            {/* Station Distance */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#007DCC] dark:text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Train className="w-4 h-4 text-emerald-600 dark:text-[#51dcbc]" />
                Station Distance & Commute
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data1.stationDistance}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">{data1.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data2.stationDistance}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">{data2.location}</p>
                </div>
              </div>
            </div>

            {/* Cutoff & Eligibility */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#007DCC] dark:text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <GraduationCap className="w-4 h-4 text-[#007DCC] dark:text-[#86cfff]" />
                Admission Cutoffs (HSC General)
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data1.cutoff}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">High competition for BAF and BMS</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data2.cutoff}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">Top-tier cutoffs across Mumbai</p>
                </div>
              </div>
            </div>

            {/* Annual Fees */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#007DCC] dark:text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Building className="w-4 h-4 text-emerald-600 dark:text-[#51dcbc]" />
                Annual Fee Range
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data1.avgFees}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">{data1.autonomous ? 'Autonomous syllabus' : 'Aided & self-financed'}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data2.avgFees}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">{data2.autonomous ? 'Autonomous syllabus' : 'Aided & self-financed'}</p>
                </div>
              </div>
            </div>

            {/* CA Articleship Friendliness */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#007DCC] dark:text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Clock className="w-4 h-4 text-purple-600 dark:text-[#D3B5E8]" />
                CA Articleship Schedule & Timetable
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data1.caArticleshipFriendly}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">{data1.attendanceStrictness}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#F4F7FB]">{data2.caArticleshipFriendly}</p>
                  <p className="text-xs text-slate-600 dark:text-[#A9B8CA] mt-0.5">{data2.attendanceStrictness}</p>
                </div>
              </div>
            </div>

            {/* Key Recruiters */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#007DCC] dark:text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#51dcbc]" />
                Marquee Placements & Big 4 Recruiters
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {data1.topRecruiters.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-[#242a36] dark:text-[#9ccaff]">
                      {r}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data2.topRecruiters.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-[#242a36] dark:text-[#9ccaff]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-[#D3B5E8]/15 bg-slate-50 dark:bg-[#161c27] flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-[#8a919c] hidden sm:block">
            Data verified from Mumbai University & college academic calendars.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-sm font-semibold transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
