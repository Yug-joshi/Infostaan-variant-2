import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { MENTORS_DATA } from '../data/mentorsData';

interface ConnectCarouselProps {
  onNavigate: (path: string) => void;
}

export const ConnectCarousel: React.FC<ConnectCarouselProps> = ({ onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Triple array for seamless infinite marquee loop
  const marqueeMentors = [...MENTORS_DATA, ...MENTORS_DATA, ...MENTORS_DATA];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? MENTORS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MENTORS_DATA.length);
  };

  return (
    <section className="w-full py-16 bg-slate-50/80 dark:bg-[#070D18] border-t border-slate-200/80 dark:border-white/5 text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200 overflow-hidden relative select-none">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-smooth {
          animation: marquee 32s linear infinite;
        }
        .paused-marquee {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 text-left">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-700/40 text-[#007DCC] dark:text-[#86cfff] text-[11px] font-extrabold uppercase tracking-widest mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>INFOSTAAN CONNECT</span>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB]">
              Personal Guidance
            </h2>

            {/* Supporting Text */}
            <p className="text-xs sm:text-base text-slate-600 dark:text-[#A9B8CA] mt-1.5 leading-relaxed">
              Talk to experienced people who can help you with your education, career or next step.
            </p>
          </div>

          {/* Action & Nav Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#007DCC] dark:text-[#86cfff] hover:text-[#005a9c] transition-colors group"
            >
              <span>View all mentors</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2 ml-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous mentors"
                className="p-2 rounded-xl bg-white dark:bg-[#0D1828] text-slate-600 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC] transition-colors shadow-2xs active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next mentors"
                className="p-2 rounded-xl bg-white dark:bg-[#0D1828] text-slate-600 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:border-[#007DCC] transition-colors shadow-2xs active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Marquee Track Container (Clean cards, no faded side overlays) */}
        <div
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Continuous Moving Track */}
          <div
            className={`flex gap-3 sm:gap-4 w-max animate-marquee-smooth ${
              isHovered ? 'paused-marquee' : ''
            }`}
          >
            {marqueeMentors.map((m, idx) => (
              <div
                key={`${m.id}-${idx}`}
                onClick={() => onNavigate(`/mentor/${m.id}`)}
                className="w-[calc((100vw-3.5rem)/3)] md:w-[calc((100vw-6rem)/3)] lg:w-60 xl:w-64 shrink-0 flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 hover:border-[#007DCC] transition-all duration-200 shadow-sm hover:shadow-md text-left cursor-pointer group"
              >
                <div>
                  {/* Top: 1:1 Avatar + Name & Role */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative shrink-0">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-blue-50 dark:ring-white/10 group-hover:ring-[#007DCC]/40 transition-all"
                      />
                      {m.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D1828]" />
                      )}
                    </div>

                    <div className="truncate">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F4F7FB] truncate group-hover:text-[#007DCC] transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#007DCC] dark:text-[#86cfff] truncate mt-0.5">
                        {m.role}
                      </p>
                    </div>
                  </div>

                  {/* Specialty Badge */}
                  <div className="mb-2.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#A9B8CA] text-[10px] font-semibold truncate">
                      {m.area}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#71839A] line-clamp-2 leading-snug mb-4">
                    {m.desc}
                  </p>
                </div>

                {/* Connect CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/mentor/${m.id}`);
                  }}
                  className="w-full py-2 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Connect</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Small Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {MENTORS_DATA.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex % MENTORS_DATA.length === i
                  ? 'w-6 bg-[#007DCC]'
                  : 'w-1.5 bg-slate-300 dark:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
