import React, { useState } from 'react';
import { ChevronRight, Megaphone } from 'lucide-react';
import type { TimetableLabel } from './TimetableSidebar';

const updates: { label: TimetableLabel; text: string; color: string }[] = [
  { label: 'SSC', text: 'SSC 2027: Class 10 Exam Timetable Released', color: 'bg-blue-500' },
  { label: 'HSC Arts', text: 'HSC 2027: Arts Stream Exam Timetable Released', color: 'bg-rose-500' },
  { label: 'HSC Commerce', text: 'HSC 2027: Commerce Stream Exam Timetable Released', color: 'bg-amber-500' },
  { label: 'HSC Science', text: 'HSC 2027: Science Stream Exam Timetable Released', color: 'bg-emerald-500' },
];

interface LatestUpdatesCarouselProps {
  onOpenTimetable: (label: TimetableLabel) => void;
}

export const LatestUpdatesCarousel: React.FC<LatestUpdatesCarouselProps> = ({ onOpenTimetable }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      aria-label="Latest updates"
      className="relative z-10 mx-auto mb-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm dark:border-white/10 dark:bg-[#111A28]/80 sm:gap-4 sm:px-3">
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white dark:bg-amber-400 dark:text-slate-950">
          <Megaphone className="h-3.5 w-3.5" />
          <span>Latest Updates</span>
        </div>
        <div className="hidden h-8 w-px shrink-0 bg-slate-200 dark:bg-white/10 sm:block" />

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className={`latest-updates-track flex w-max will-change-transform ${isPaused ? 'latest-updates-paused' : ''}`}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsPaused(false);
              }
            }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 gap-2 pr-2"
                aria-hidden={copy === 1}
              >
                {updates.map((update) => (
                  <button
                    key={update.label}
                    type="button"
                    tabIndex={copy === 1 ? -1 : undefined}
                    onClick={() => onOpenTimetable(update.label)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-2 text-left text-xs font-semibold text-slate-800 transition-colors hover:border-amber-400 hover:bg-amber-50 dark:border-white/10 dark:bg-white/10 dark:text-[#F8FAFC] dark:hover:border-amber-400/50 dark:hover:bg-white/15"
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${update.color}`} />
                    <span>{update.text}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-[#A9B8CA]" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
