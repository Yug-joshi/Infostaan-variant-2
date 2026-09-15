import React from 'react';

export const ResultSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-[#D3B5E8]/15 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs h-full relative overflow-hidden">
      {/* Background shimmer layer */}
      <div className="absolute inset-0 animate-shimmer opacity-30 z-0 pointer-events-none" />
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Badge Skeleton */}
          <div className="w-24 h-5 rounded-md bg-slate-100 dark:bg-[#1a202b]" />
          <div className="w-16 h-4 rounded bg-slate-100 dark:bg-[#1a202b]" />
        </div>

        <div>
          {/* Title Skeleton */}
          <div className="w-3/4 h-6 rounded bg-slate-200 dark:bg-[#2f3541] mb-2" />
          {/* Subtitle Skeleton */}
          <div className="w-1/2 h-4 rounded bg-slate-100 dark:bg-[#1a202b]" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mt-4">
          <div className="w-full h-3 rounded bg-slate-100 dark:bg-[#1a202b]" />
          <div className="w-5/6 h-3 rounded bg-slate-100 dark:bg-[#1a202b]" />
          <div className="w-4/6 h-3 rounded bg-slate-100 dark:bg-[#1a202b]" />
        </div>

        {/* Degrees Skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="w-12 h-5 rounded bg-slate-100 dark:bg-[#1a202b]" />
          <div className="w-10 h-5 rounded bg-slate-100 dark:bg-[#1a202b]" />
          <div className="w-14 h-5 rounded bg-slate-100 dark:bg-[#1a202b]" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-10">
        <div className="w-20 h-4 rounded bg-slate-100 dark:bg-[#1a202b]" />
        <div className="w-24 h-4 rounded bg-slate-100 dark:bg-[#1a202b]" />
      </div>
    </div>
  );
};
