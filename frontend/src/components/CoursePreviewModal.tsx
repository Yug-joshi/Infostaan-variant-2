import React from 'react';
import { ArrowRight, X } from 'lucide-react';
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
      className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#0D1828] dark:text-[#F4F7FB] sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close course preview"
        className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#A9B8CA] dark:hover:bg-white/10"
      >
        <X className="h-5 w-5" />
      </button>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#007DCC]">Sponsored professional course · FPA Edutech</p>
      <h2 id="course-preview-title" className="pr-8 text-xl font-extrabold sm:text-2xl">
        {course.title}
      </h2>
      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-[#71839A]">{course.category}</p>

      <div className="mt-5 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-[#C1CDDA]">
        <p>{course.summary}</p>

        <section>
          <h3 className="mb-2 font-bold text-slate-900 dark:text-[#F4F7FB]">What you will learn</h3>
          {course.learningGroups.map((group, groupIndex) => (
            <div key={`${group.title || 'topics'}-${groupIndex}`} className={groupIndex > 0 ? 'mt-4' : ''}>
              {group.title && (
                <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-[#E2EAF2]">{group.title}</h4>
              )}
              <ul className="space-y-1.5">
                {group.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#007DCC]" aria-hidden="true" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h3 className="mb-2 font-bold text-slate-900 dark:text-[#F4F7FB]">Course highlights</h3>
          <ul className="space-y-1.5">
            {course.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#007DCC]" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {course.careerAreas && (
          <section>
            <h3 className="mb-2 font-bold text-slate-900 dark:text-[#F4F7FB]">Career areas mentioned</h3>
            <ul className="space-y-1.5">
              {course.careerAreas.map((area) => (
                <li key={area} className="flex items-start gap-2">
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#007DCC]" aria-hidden="true" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="mb-1 font-bold text-slate-900 dark:text-[#F4F7FB]">Ideal for</h3>
          <p>{course.idealFor}</p>
        </section>

        <section>
          <h3 className="mb-1 font-bold text-slate-900 dark:text-[#F4F7FB]">Eligibility</h3>
          <p>{course.eligibility}</p>
        </section>
      </div>

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
