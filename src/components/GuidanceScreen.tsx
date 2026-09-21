import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface GuidanceScreenProps {
  onNavigate: (path: string) => void;
}

export const GuidanceScreen: React.FC<GuidanceScreenProps> = ({
  onNavigate,
}) => {
  return (
    <main className="w-full pt-28 sm:pt-32 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Find Your <span className="text-[#007DCC]">Path.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#A9B8CA] font-medium leading-relaxed">
            Whether you know exactly what you want to do or need some help figuring it out, we have the right tools to guide you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {/* Help Me Decide */}
          <button
            onClick={() => onNavigate('/help-me-decide')}
            className="group relative bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl text-left shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-6 hover:border-[#007DCC]/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-[#007DCC]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-[#007DCC] dark:text-[#19A7E8]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Help Me Decide</h2>
              <p className="text-slate-600 dark:text-[#A9B8CA] text-sm sm:text-base leading-relaxed">
                Not sure which career or college suits you? Use our smart admission matching wizard to find the perfect fit based on your interests and grades.
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-[#007DCC] font-bold text-sm">
              Launch Wizard <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Career Roadmap */}
          <button
            onClick={() => onNavigate('/career-roadmap')}
            className="group relative bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl text-left shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-6 hover:border-[#5B5CE2]/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-[#5B5CE2]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-8 h-8 text-[#5B5CE2]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Career Roadmap</h2>
              <p className="text-slate-600 dark:text-[#A9B8CA] text-sm sm:text-base leading-relaxed">
                Already know your destination? Explore our step-by-step verified career pathways for Mumbai colleges, exams, and articleships.
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-[#5B5CE2] font-bold text-sm">
              Explore Roadmaps <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        </div>

      </div>
    </main>
  );
};
