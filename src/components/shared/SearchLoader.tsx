import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchLoaderProps {
  category?: string;
}

export const SearchLoader: React.FC<SearchLoaderProps> = ({ category = '' }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getContextualText = () => {
    const normCategory = category.toLowerCase();
    switch (normCategory) {
      case 'colleges': return 'Finding colleges...';
      case 'courses': return 'Finding courses...';
      case 'careers': return 'Matching your interests...';
      case 'internships': return 'Finding opportunities...';
      case 'classes': return 'Finding classes...';
      default: return 'Finding relevant options...';
    }
  };

  const messages = [
    'Understanding your search...',
    getContextualText(),
    'Preparing your results...'
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-24 text-center">
      <div className="relative flex items-center justify-center w-16 h-16 mb-6">
        {/* Subtle decorative ring */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-100 dark:border-[#1a202b]" />
        
        {/* Inner animated ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#007DCC] dark:border-t-[#9ccaff] animate-spin" style={{ animationDuration: '2s' }} />
        
        <Search className="w-6 h-6 text-[#007DCC] dark:text-[#86cfff]" />
        
        {/* Outer subtle dots (simulating nodes without heavy visual) */}
        <div className="absolute -inset-4 rounded-full border border-dashed border-slate-200 dark:border-[#2f3541] animate-[spin_10s_linear_infinite] opacity-50" />
      </div>

      <div className="h-6 relative w-full overflow-hidden">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`absolute inset-0 w-full text-sm font-medium text-slate-600 dark:text-[#A9B8CA] transition-all duration-500 transform ${
              step === i 
                ? 'opacity-100 translate-y-0' 
                : step > i 
                  ? 'opacity-0 -translate-y-4' 
                  : 'opacity-0 translate-y-4'
            }`}
          >
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};
