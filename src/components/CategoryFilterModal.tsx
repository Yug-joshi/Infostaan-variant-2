import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Building2, GraduationCap, TrendingUp, CheckCircle2, MapPin, SlidersHorizontal } from 'lucide-react';
import { getCategoryAccent } from '../lib/categoryAccents';
import { useTheme } from '../context/ThemeContext';
import { parseMultiValue } from '../lib/categoryFilters';

export type FilterCategoryType = 'colleges' | 'courses' | 'careers';

interface CategoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: FilterCategoryType;
  onApplyFilters: (category: FilterCategoryType, filters: Record<string, string>) => void;
  onViewAll?: (category: FilterCategoryType) => void;
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
        desc: 'Choose up to 3 target regional zones in Mumbai.',
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
      {
        id: 'duration',
        title: 'Course Duration',
        desc: 'Select your preferred course duration.',
        options: ['Any Duration', 'Short-term (1-6 Months)', 'Medium-term (1-2 Years)', 'Degree (3-4 Years)', 'Integrated (5 Years)'],
      },
      {
        id: 'mode',
        title: 'Mode of Study',
        desc: 'Select your preferred mode of learning.',
        options: ['Any Mode', 'Full-Time Classroom', 'Part-Time / Weekend', 'Online / Distance', 'Hybrid'],
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
  onViewAll,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.colleges;
  const IconComp = config.icon;
  const accent = getCategoryAccent(category);

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
    if (currentStep.id === 'region') {
      if (value.startsWith('All')) {
        setSelectedValues((prev) => {
          const next = { ...prev };
          delete next.region;
          return next;
        });
        return;
      }

      const current = parseMultiValue(selectedValues.region);
      if (current.includes(value)) {
        const remaining = current.filter((r) => r !== value);
        setSelectedValues((prev) => {
          const next = { ...prev };
          if (remaining.length > 0) {
            next.region = remaining.join(', ');
          } else {
            delete next.region;
          }
          return next;
        });
      } else {
        if (current.length < 3) {
          setSelectedValues((prev) => ({
            ...prev,
            region: [...current, value].join(', '),
          }));
        } else {
          setSelectedValues((prev) => ({
            ...prev,
            region: [...current.slice(1), value].join(', '),
          }));
        }
      }
      return;
    }

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
        className="absolute inset-0 backdrop-blur-md transition-opacity"
        style={{ background: isDark ? 'rgba(3, 7, 18, 0.78)' : 'rgba(7, 13, 24, 0.65)' }}
        onClick={onClose}
      />

      {/* Modal Container — glass shell */}
      <div
        className="relative w-full max-w-2xl border shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-900 dark:text-[#F4F7FB] backdrop-blur-xl transition-colors duration-200"
        style={{
          background: isDark ? 'rgba(13, 24, 40, 0.96)' : 'rgba(255, 255, 255, 0.94)',
          borderColor: isDark ? accent.borderDark : accent.borderLight,
          boxShadow: isDark
            ? `0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px ${accent.borderDark}`
            : `0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px ${accent.borderLight}`,
        }}
      >
        {/* Header — accent tinted band */}
        <div
          className="shrink-0 px-6 py-4 border-b flex items-center justify-between transition-colors duration-200"
          style={{
            background: isDark ? accent.bgDark : accent.bgLight,
            borderColor: isDark ? accent.borderDark : accent.borderLight,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isDark ? 'rgba(255, 255, 255, 0.08)' : accent.bgDark }}
            >
              <IconComp className="w-[18px] h-[18px]" style={{ color: isDark ? accent.chipTextDark : accent.color }} />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-[#F4F7FB]">{config.title}</h2>
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
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                {currentStep.title}
              </h3>
              {currentStep.id === 'region' && (
                <span className="text-xs font-semibold text-[#007DCC] dark:text-[#86cfff]">
                  {parseMultiValue(selectedValues.region).length > 0
                    ? `${parseMultiValue(selectedValues.region).length}/3 selected`
                    : 'Select up to 3'}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-[#71839A]">
              {currentStep.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStep.options.map((opt) => {
              const selectedRegions = currentStep.id === 'region' ? parseMultiValue(selectedValues.region) : [];
              const isSelected = currentStep.id === 'region'
                ? (opt.startsWith('All') ? selectedRegions.length === 0 : selectedRegions.includes(opt))
                : (selectedValues[currentStep.id] === opt || (!selectedValues[currentStep.id] && opt.startsWith('All')));
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${isSelected
                      ? 'text-slate-900 dark:text-[#F4F7FB]'
                      : 'bg-white/60 dark:bg-[#162232] border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#C5D3E3] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1c2b3f]'
                    }`}
                  style={isSelected ? {
                    background: isDark ? accent.bgDark : accent.bgLight,
                    borderColor: isDark ? accent.colorHover : accent.ring,
                    boxShadow: `0 0 0 1.5px ${isDark ? accent.colorHover : accent.ring}`,
                    color: isDark ? accent.chipTextDark : accent.selectedText,
                  } : undefined}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0 ml-2" style={{ color: isDark ? accent.colorHover : accent.color }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-6 py-4 border-t transition-colors duration-200"
          style={{
            background: isDark ? accent.bgDark : accent.bgLight,
            borderColor: isDark ? accent.borderDark : accent.borderLight,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/70 dark:bg-[#162232] text-slate-700 dark:text-[#C5D3E3] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#1c2b3f] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{stepIndex === 0 ? 'Cancel' : 'Previous'}</span>
            </button>

            <div className="flex items-center gap-2">
              {/* View All — available on all steps */}
              {onViewAll && (
                <button
                  type="button"
                  onClick={() => { onViewAll(category); onClose(); }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/70 dark:bg-[#162232] text-slate-700 dark:text-[#C5D3E3] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#1c2b3f] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">View All {category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="sm:hidden">View All</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                style={{ background: accent.ctaBg }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accent.ctaHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accent.ctaBg; }}
              >
                <span className="hidden sm:inline">{stepIndex === config.steps.length - 1 ? config.submitLabel : 'Next Step'}</span>
                <span className="sm:hidden">{stepIndex === config.steps.length - 1 ? 'Apply' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
