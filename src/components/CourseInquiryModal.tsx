import React, { FormEvent, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { ProfessionalCourseBrochure } from '../data/professionalCourseBrochures';

interface CourseInquiryModalProps {
  course: ProfessionalCourseBrochure;
  onClose: () => void;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const CourseInquiryModal: React.FC<CourseInquiryModalProps> = ({ course, onClose }) => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionState('submitting');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          currentEducation: formData.get('currentEducation'),
          courseId: course.id,
          consent: formData.get('consent') === 'on',
        }),
      });

      const result: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || 'We could not submit your request. Please try again.');
      }
      setSubmissionState('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We could not submit your request. Please try again.');
      setSubmissionState('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && submissionState !== 'submitting') onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-inquiry-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#0D1828] dark:text-[#F4F7FB] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submissionState === 'submitting'}
          aria-label="Close inquiry form"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50 dark:text-[#A9B8CA] dark:hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        {submissionState === 'success' ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
            <h2 id="course-inquiry-title" className="text-xl font-extrabold">Request received</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#A9B8CA]">
              Your request about {course.title} has been recorded. The course partner can use your contact details to follow up with more information.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 min-h-11 rounded-xl bg-[#007DCC] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#006BB0]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#007DCC]">Professional course inquiry</p>
            <h2 id="course-inquiry-title" className="pr-8 text-xl font-extrabold sm:text-2xl">
              Get details about {course.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#A9B8CA]">
              Share your contact details and our course partner can provide the syllabus, fees, and eligibility information.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold">
                Full name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal outline-none transition focus:border-[#007DCC] dark:border-white/15 dark:bg-[#111E30]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Email
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal outline-none transition focus:border-[#007DCC] dark:border-white/15 dark:bg-[#111E30]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Phone number
                <input
                  required
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal outline-none transition focus:border-[#007DCC] dark:border-white/15 dark:bg-[#111E30]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Current class or qualification
                <input
                  required
                  name="currentEducation"
                  maxLength={100}
                  placeholder="For example, FYJC or B.Com graduate"
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-[#007DCC] dark:border-white/15 dark:bg-[#111E30]"
                />
              </label>

              <label className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-[#A9B8CA]">
                <input
                  required
                  name="consent"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#007DCC]"
                />
                <span>I agree to share my contact details with the course partner so they can respond to my inquiry.</span>
              </label>

              {submissionState === 'error' && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={submissionState === 'submitting'}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#007DCC] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#006BB0] disabled:cursor-wait disabled:opacity-60"
              >
                {submissionState === 'submitting' ? 'Sending request…' : 'Request course details'}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};
