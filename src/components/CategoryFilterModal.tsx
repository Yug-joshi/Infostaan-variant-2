import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Building2, GraduationCap, TrendingUp, CheckCircle2, MapPin, SlidersHorizontal } from 'lucide-react';

export type FilterCategoryType = 'colleges' | 'courses' | 'careers';

interface CategoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: FilterCategoryType;
  onApplyFilters: (category: FilterCategoryType, filters: Record<string, string>) => void;
}

// Data-driven filter options per category based on actual dataset fields
const CATEGORY_CONFIGS = {
  colleges: {
    title: 'College Filter Wizard',
    icon: Building2,
    steps: [
      {
        id: 'region',
        title: 'Select Mumbai Region',
        desc: 'Choose your target regional zone in Mumbai.',
        options: [
          'All Mumbai',
          'South Mumbai',
          'Western Suburbs',
          'Central Suburbs',
          'Eastern Suburbs',
          'Harbour / Central-East',
        ],
      },
      {
        id: 'stream',
        title: 'Academic Stream & Program',
        desc: 'Filter colleges offering specific academic streams.',
        options: ['All Streams', 'Commerce', 'Arts', 'Science', 'Management (BMS)', 'Finance & Accounting (BAF)'],
      },
    ],
    submitLabel: 'Find Colleges',
  },
  courses: {
    title: 'Course & Degree Wizard',
    icon: GraduationCap,
    steps: [
      {
        id: 'stream',
        title: 'Field of Study',
        desc: 'Select your field of interest.',
        options: ['All Fields', 'Commerce & Accounting', 'Management & Leadership', 'Finance & Markets', 'Data Science & IT'],
      },
      {
        id: 'level',
        title: 'Qualification Level',
        desc: 'Select degree type or professional certification.',
        options: ['All Levels', 'Undergraduate Degree (B.Com/BMS/BAF)', 'Professional Qualification (CA/CS/CMA)', 'Diploma & Certifications'],
      },
    ],
    submitLabel: 'Find Courses',
  },
  careers: {
    title: 'Career Discovery Wizard',
    icon: TrendingUp,
    steps: [
      {
        id: 'industry',
        title: 'Target Industry / Domain',
        desc: 'Choose the industry path you want to explore.',
        options: ['All Industries', 'Investment & Equity Research', 'Corporate Banking & CA', 'Brand Management & Advertising', 'Technology & Analytics'],
      },
      {
        id: 'entryLevel',
        title: 'Career Milestone Level',
        desc: 'Select career entry or growth target.',
        options: ['All Milestones', 'Graduate Trainee / Intern', 'Junior Analyst / Associate', 'Professional Specialist'],
      },
    ],
    submitLabel: 'Find Careers',
  },
};

export const CategoryFilterModal: React.FC<CategoryFilterModalProps> = ({
  isOpen,
  onClose,
  category,
  onApplyFilters,
}) => {
  const config = CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.colleges;
  const IconComp = config.icon;

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
      setSelectedValues({});
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  const currentStep = config.steps[stepIndex] || config.steps[0];

  const handleSelectOption = (value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [currentStep.id]: value,
    }));
  };

  const handleNext = () => {
    if (stepIndex < config.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Final step: submit filters and navigate
      onApplyFilters(category, selectedValues);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#070D18]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B1623] border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB]">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <IconComp className="w-4.5 h-4.5 text-[#007DCC] dark:text-[#86cfff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">{config.title}</h2>
              <p className="text-xs text-slate-500 dark:text-[#71839A]">
                Step {stepIndex + 1} of {config.steps.length}: {currentStep.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:text-[#71839A] dark:hover:text-[#F4F7FB] rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-1.5">
              {currentStep.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#71839A]">
              {currentStep.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStep.options.map((opt) => {
              const isSelected = selectedValues[currentStep.id] === opt || (!selectedValues[currentStep.id] && opt.startsWith('All'));
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-[#161c27] border-[#007DCC] ring-1 ring-[#007DCC] text-[#007DCC] dark:text-[#86cfff]'
                      : 'bg-white dark:bg-[#0D1828] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A9B8CA] hover:border-[#007DCC]/40'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#007DCC] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 dark:border-white/8 flex items-center justify-between bg-slate-50/50 dark:bg-[#0D1828]/50">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#161c27] text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{stepIndex === 0 ? 'Cancel' : 'Previous'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>{stepIndex === config.steps.length - 1 ? config.submitLabel : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
