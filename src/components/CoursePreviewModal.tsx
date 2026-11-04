import React from 'react';
import { X } from 'lucide-react';
import { ProfessionalCourseBrochure } from '../data/professionalCourseBrochures';

interface CoursePreviewModalProps {
  course: ProfessionalCourseBrochure;
  onClose: () => void;
}

export const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({ course, onClose }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
    role="presentation"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-preview-title"
      className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#0D1828] dark:text-[#F4F7FB] sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close course preview"
        className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#A9B8CA] dark:hover:bg-white/10"
      >
        <X className="h-5 w-5" />
      </button>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#007DCC]">Course preview</p>
      <h2 id="course-preview-title" className="pr-8 text-xl font-extrabold sm:text-2xl">
        {course.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-[#A9B8CA]">
        {course.preview}
      </p>
      <p className="mt-5 text-xs text-slate-500 dark:text-[#71839A]">
        Based on the course brochure.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 min-h-11 rounded-xl bg-[#007DCC] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#006BB0]"
      >
        Close preview
      </button>
    </section>
  </div>
);
