import React from 'react';

export const SkeletonResultCards: React.FC = () => {
  // Render 3 skeleton cards to fill the screen
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((key) => (
        <article
          key={key}
          className="relative p-5 sm:p-6 bg-white dark:bg-[#161c27] rounded-xl border border-slate-200 dark:border-[#D3B5E8]/10 shadow-xs animate-pulse overflow-hidden"
        >
          {/* Subtle scanning gradient effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
          
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Left Image/Icon Placeholder */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-slate-200 dark:bg-[#242a36]"></div>

            {/* Right Content */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1/3 h-5 rounded bg-slate-200 dark:bg-[#242a36]"></div>
                  <div className="w-16 h-4 rounded bg-slate-100 dark:bg-[#1a202b]"></div>
                </div>
                <div className="w-1/2 h-4 rounded bg-slate-100 dark:bg-[#1a202b]"></div>
              </div>

              {/* Description blocks */}
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-slate-100 dark:bg-[#1a202b]"></div>
                <div className="w-5/6 h-3 rounded bg-slate-100 dark:bg-[#1a202b]"></div>
              </div>

              {/* Action Button Placeholder */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#242a36]"></div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#242a36]"></div>
                </div>
                <div className="w-24 h-8 rounded-lg bg-slate-200 dark:bg-[#242a36]"></div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
