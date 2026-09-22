import React, { useEffect, useRef } from 'react';
import { Briefcase, Clock, IndianRupee, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MENTORS_DATA } from '../data/mentorsData';
import gsap from 'gsap';

interface ConnectScreenProps {
  onNavigate: (path: string) => void;
}

export const ConnectScreen: React.FC<ConnectScreenProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="w-full flex-1 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div ref={containerRef} className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold tracking-wider uppercase mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Infostaan Connect</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] mb-6">
            One on One Guidance from Industry Experts
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
            Don't guess your career roadmap. Book a paid One on One session with working professionals in Mumbai to get authentic, actionable advice on placements, exams, and articleships.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENTORS_DATA.map((mentor) => (
            <div 
              key={mentor.id}
              onClick={() => onNavigate(`/mentor/${mentor.id}`)}
              className="bg-white dark:bg-[#0D1828] rounded-3xl border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] transition-all shadow-sm hover:shadow-lg p-6 flex flex-col justify-between cursor-pointer group text-left"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative shrink-0">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-50 dark:ring-white/10 group-hover:ring-[#007DCC]/40 transition-all"
                    />
                    {mentor.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D1828]" />
                    )}
                  </div>
                  <div className="truncate">
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-[#F4F7FB] leading-tight group-hover:text-[#007DCC] transition-colors truncate">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-[#007DCC] dark:text-[#86cfff] font-bold mt-0.5 truncate">
                      {mentor.role}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {mentor.area}
                    </p>
                  </div>
                </div>

                {/* Work Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#A9B8CA]">
                    <Briefcase className="w-4 h-4 shrink-0 text-[#007DCC]" />
                    <span className="truncate">{mentor.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#A9B8CA]">
                    <Clock className="w-4 h-4 shrink-0 text-[#007DCC]" />
                    <span>{mentor.experience} Experience</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-[#71839A] line-clamp-2 leading-relaxed mb-6">
                  {mentor.desc}
                </p>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider font-semibold">
                    30 Min 1:1 Session
                  </span>
                  <div className="flex items-center font-extrabold text-slate-900 dark:text-[#F4F7FB] text-lg">
                    <IndianRupee className="w-4 h-4" />
                    <span>{mentor.price}</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/mentor/${mentor.id}`);
                  }}
                  className="w-full py-3 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Book Session</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How it works section */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-white/5 text-left">
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-8 text-center">
            How Infostaan Connect Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#0D1828] shadow-sm flex items-center justify-center text-[#007DCC] dark:text-[#86cfff]">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB]">Choose a Mentor</h3>
              <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">Select an industry professional who aligns with your target career path.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#0D1828] shadow-sm flex items-center justify-center text-[#007DCC] dark:text-[#86cfff]">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB]">Book a Time</h3>
              <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">Select an available time slot and book a 30-minute virtual 1:1 session.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#0D1828] shadow-sm flex items-center justify-center text-[#007DCC] dark:text-[#86cfff]">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB]">Get Clarity</h3>
              <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">Get your resume reviewed, ask questions, and build your career roadmap.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
