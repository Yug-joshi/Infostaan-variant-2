import React, { useEffect } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CareerRoadmap } from './CareerRoadmap';

interface CareerRoadmapScreenProps {
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
}

export const CareerRoadmapScreen: React.FC<CareerRoadmapScreenProps> = ({
  onNavigate,
  onSelectCollege,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="w-full pt-20 sm:pt-24 pb-20 bg-slate-50 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Back Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/careers')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#161c27] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Careers</span>
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Standalone Career Roadmap</span>
          </div>
        </div>

        {/* Embedded Career Roadmap Component */}
        <CareerRoadmap
          onSelectCollege={onSelectCollege}
          onNavigate={(path) => {
            if (typeof path === 'string') {
              onNavigate(path);
            }
          }}
        />
      </div>
    </main>
  );
};
