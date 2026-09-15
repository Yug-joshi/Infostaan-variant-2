import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { CategoryType } from '../types';

interface SearchProgressLoaderProps {
  category: CategoryType;
}

export const SearchProgressLoader: React.FC<SearchProgressLoaderProps> = ({ category }) => {
  const [step, setStep] = useState(0);

  const getLines = (cat: CategoryType) => {
    switch (cat) {
      case 'colleges':
        return ['Finding colleges', 'Checking courses', 'Matching your preferences'];
      case 'courses':
        return ['Finding courses', 'Checking eligibility', 'Matching your interests'];
      case 'careers':
        return ['Exploring careers', 'Matching your interests', 'Finding relevant paths'];
      case 'internships':
        return ['Finding opportunities', 'Checking your skills', 'Matching relevant internships'];
      default:
        return ['Understanding your search', 'Finding relevant options', 'Preparing your results'];
    }
  };

  const lines = getLines(category);

  useEffect(() => {
    // Quickly progress through the 3 steps
    const timers = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 400),
      setTimeout(() => setStep(3), 600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [category]);

  return (
    <div className="w-full py-8 flex flex-col items-center justify-center text-slate-700 dark:text-[#A9B8CA]">
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-[#1a202b] mb-6 shadow-inner">
        <Search className="w-5 h-5 text-[#007DCC] dark:text-[#9ccaff] animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-[#007DCC]/20 dark:border-[#9ccaff]/20 border-t-[#007DCC] dark:border-t-[#9ccaff] animate-spin"></div>
      </div>
      
      <div className="space-y-3 w-full max-w-xs">
        {lines.map((line, index) => {
          const isActive = step === index;
          const isDone = step > index;
          
          return (
            <div 
              key={index}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isDone ? 'opacity-100 text-slate-900 dark:text-[#F4F7FB]' : 
                isActive ? 'opacity-100' : 'opacity-0 translate-y-2'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#19B89A] shrink-0" />
              ) : (
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${isActive ? 'border-[#007DCC] dark:border-[#9ccaff]' : 'border-slate-300 dark:border-slate-600'}`}></div>
              )}
              <span className={`text-sm font-medium ${isDone ? 'text-slate-900 dark:text-[#F4F7FB]' : ''}`}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
