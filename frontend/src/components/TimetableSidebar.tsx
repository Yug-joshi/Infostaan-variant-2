import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import sscTimetable from '../assets/images/SSCBoardTimeTable.png';
import hscArtsTimetable from '../assets/images/HSCBoardArtsTimeTable.png';
import hscCommerceTimetable from '../assets/images/HSCBoardCOMTimeTable.png';
import hscScienceTimetable from '../assets/images/HSCBoardSciTimeTable.png';

const timetables = [
  { label: 'SSC', image: sscTimetable },
  { label: 'HSC Arts', image: hscArtsTimetable },
  { label: 'HSC Commerce', image: hscCommerceTimetable },
  { label: 'HSC Science', image: hscScienceTimetable },
] as const;

export type TimetableLabel = (typeof timetables)[number]['label'];

interface TimetableSidebarProps {
  isOpen: boolean;
  presentation: 'popup' | 'sidebar';
  initialTimetable: TimetableLabel;
  onClose: () => void;
}

export const TimetableSidebar: React.FC<TimetableSidebarProps> = ({ isOpen, presentation, initialTimetable, onClose }) => {
  const [selectedTimetable, setSelectedTimetable] = useState<(typeof timetables)[number]>(timetables[0]);
  const isPopup = presentation === 'popup';

  useEffect(() => {
    if (isOpen) {
      setSelectedTimetable(timetables.find((timetable) => timetable.label === initialTimetable) ?? timetables[0]);
    }
  }, [initialTimetable, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130]" role="dialog" aria-modal="true" aria-labelledby="timetable-sidebar-title">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 w-full bg-slate-950/60 backdrop-blur-sm"
        aria-label="Close exam timetable sidebar"
      />
      <aside
        className={`absolute flex flex-col overflow-hidden bg-white text-slate-900 shadow-2xl dark:bg-[#0B111E] dark:text-[#F8FAFC] ${
          isPopup
            ? 'left-1/2 top-1/2 max-h-[92vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 dark:border-white/10'
            : 'inset-y-0 right-0 w-full max-w-lg border-l border-slate-200 dark:border-white/10'
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Bell className="h-4 w-4" />
              Board exam update
            </div>
            <h2 id="timetable-sidebar-title" className="text-xl font-extrabold">
              Exam timetables
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#A9B8CA]">
              Select your board and stream to view the timetable.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close exam timetable sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
          {timetables.map((timetable) => (
            <button
              key={timetable.label}
              type="button"
              onClick={() => setSelectedTimetable(timetable)}
              aria-pressed={selectedTimetable.label === timetable.label}
              className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${
                selectedTimetable.label === timetable.label
                  ? 'border-amber-500 bg-amber-500 text-slate-950'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-[#A9B8CA]'
              }`}
            >
              {timetable.label}
            </button>
          ))}
        </div>

        <div className={`min-h-0 flex-1 overflow-y-auto px-4 pb-5 ${isPopup ? 'flex justify-center' : ''}`}>
          <img
            key={selectedTimetable.image}
            src={selectedTimetable.image}
            alt={`${selectedTimetable.label} Maharashtra State Board exam timetable`}
            className={`h-auto w-full rounded-xl border border-slate-200 object-contain shadow-sm dark:border-white/10 ${
              isPopup ? 'max-h-[65vh] max-w-[420px]' : 'mx-auto max-w-md'
            }`}
          />
        </div>
      </aside>
    </div>
  );
};
