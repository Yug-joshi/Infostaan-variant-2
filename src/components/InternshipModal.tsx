import React, { useEffect, useRef } from 'react';
import { X, Briefcase, MapPin, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { SearchResultItem } from '../types';

interface InternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: SearchResultItem | null;
}

export const InternshipModal: React.FC<InternshipModalProps> = ({
  isOpen,
  onClose,
  internship,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (modalRef.current && backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
        );
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOpen || !internship) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
      />
      <div
        ref={modalRef}
        className="relative w-full h-[75vh] mt-auto md:mt-0 md:h-auto max-w-2xl bg-white dark:bg-[#0D1828] rounded-t-3xl md:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col md:max-h-[90vh]"
      >
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-[#D3B5E8]">
                  {internship.badgeCategory}
                </span>
                <span className="text-slate-500 dark:text-[#A9B8CA] text-xs font-medium">
                  {internship.badgeSub}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F4F7FB] leading-tight mb-2">
                {internship.title}
              </h2>
              <div className="flex items-center gap-2 text-slate-600 dark:text-[#A9B8CA] text-sm font-medium">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>{internship.subtitle}</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-px w-full bg-slate-200 dark:bg-white/10 mb-6" />

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#007DCC] dark:text-[#86cfff]" />
                Why this opportunity is relevant
              </h3>
              <p className="text-slate-700 dark:text-[#A9B8CA] text-sm leading-relaxed">
                {internship.whyRelevant}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F4F7FB] mb-3 uppercase tracking-wider">
                Key Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {internship.meta.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-[#161c27] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-[#A9B8CA] font-medium">{m}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-[#161c27] rounded-2xl p-5 border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-[#F4F7FB] font-bold mb-2">
                    <MapPin className="w-4 h-4 text-[#007DCC]" />
                    Location Focus
                </div>
                <p className="text-sm text-slate-600 dark:text-[#A9B8CA]">
                    This opportunity is based in Mumbai and is specifically curated for Mumbai students targeting this sector.
                </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161c27] flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              alert('Redirecting to application portal...');
            }}
            className="px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 group"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
