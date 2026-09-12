import React, { useState } from 'react';
import { X, Scale, Train, Check, MapPin, Building, GraduationCap, Clock } from 'lucide-react';
import { COMPARISON_DATA } from '../data/mockData';

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

  if (!isOpen) return null;

  const data1 = COMPARISON_DATA[col1] || COMPARISON_DATA.mithibai;
  const data2 = COMPARISON_DATA[col2] || COMPARISON_DATA['hr-college'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0D1828] border border-[#D3B5E8]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#D3B5E8]/15 flex items-center justify-between bg-[#161c27]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#242a36] text-[#9ccaff] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#F4F7FB]">
                Side-by-Side College Comparison
              </h2>
              <p className="text-xs sm:text-sm text-[#A9B8CA]">
                Compare real Mumbai factors: commute duration, CA flexibility, fees, and cutoffs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A9B8CA] hover:text-[#F4F7FB] rounded-lg hover:bg-[#242a36] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Table */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#A9B8CA] uppercase tracking-wider">
                College A
              </label>
              <select
                value={col1}
                onChange={(e) => setCol1(e.target.value)}
                className="bg-[#1a202b] text-[#F4F7FB] border border-[#D3B5E8]/15 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-[#007DCC]"
              >
                <option value="mithibai">Mithibai College (Vile Parle)</option>
                <option value="hr-college">H.R. College (Churchgate)</option>
                <option value="nmims">NMIMS ASMSOC (Vile Parle)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#A9B8CA] uppercase tracking-wider">
                College B
              </label>
              <select
                value={col2}
                onChange={(e) => setCol2(e.target.value)}
                className="bg-[#1a202b] text-[#F4F7FB] border border-[#D3B5E8]/15 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-[#007DCC]"
              >
                <option value="hr-college">H.R. College (Churchgate)</option>
                <option value="mithibai">Mithibai College (Vile Parle)</option>
                <option value="nmims">NMIMS ASMSOC (Vile Parle)</option>
              </select>
            </div>
          </div>

          {/* Comparison Cards Matrix */}
          <div className="space-y-4">
            {/* Station Distance */}
            <div className="p-4 rounded-xl bg-[#161c27] border border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Train className="w-4 h-4 text-[#51dcbc]" />
                Station Distance & Commute
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#F4F7FB]">{data1.stationDistance}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">{data1.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#F4F7FB]">{data2.stationDistance}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">{data2.location}</p>
                </div>
              </div>
            </div>

            {/* Cutoff & Eligibility */}
            <div className="p-4 rounded-xl bg-[#161c27] border border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <GraduationCap className="w-4 h-4 text-[#86cfff]" />
                Admission Cutoffs (HSC General)
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#F4F7FB]">{data1.cutoff}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">High competition for BAF and BMS</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#F4F7FB]">{data2.cutoff}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">Consistently top 3 cutoffs in Mumbai</p>
                </div>
              </div>
            </div>

            {/* Annual Fees */}
            <div className="p-4 rounded-xl bg-[#161c27] border border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Building className="w-4 h-4 text-[#9ccaff]" />
                Annual Fee Structure
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#51dcbc]">{data1.avgFees}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">Aided + Self-financed tiers</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#51dcbc]">{data2.avgFees}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">Highly subsidized government aided quotas</p>
                </div>
              </div>
            </div>

            {/* CA Articleship & Timing */}
            <div className="p-4 rounded-xl bg-[#161c27] border border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Clock className="w-4 h-4 text-[#D3B5E8]" />
                Daily Timings & CA / Internship Suitability
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#F4F7FB]">{data1.caArticleshipFriendly}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">{data1.attendanceStrictness}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#F4F7FB]">{data2.caArticleshipFriendly}</p>
                  <p className="text-xs text-[#A9B8CA] mt-0.5">{data2.attendanceStrictness}</p>
                </div>
              </div>
            </div>

            {/* Top Recruiters */}
            <div className="p-4 rounded-xl bg-[#161c27] border border-[#D3B5E8]/10">
              <span className="text-xs font-bold text-[#86cfff] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                Corporate Recruiters
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {data1.topRecruiters.map((rec) => (
                    <span key={rec} className="px-2 py-0.5 rounded bg-[#242a36] text-[#F4F7FB] text-xs font-medium">
                      {rec}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data2.topRecruiters.map((rec) => (
                    <span key={rec} className="px-2 py-0.5 rounded bg-[#242a36] text-[#F4F7FB] text-xs font-medium">
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#161c27] border-t border-[#D3B5E8]/15 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#007DCC] text-white text-sm font-semibold hover:bg-[#19A7E8] transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
