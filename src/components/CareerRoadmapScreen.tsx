import React from 'react';
import { CareerRoadmap } from './CareerRoadmap';

interface CareerRoadmapScreenProps {
  onNavigate: (path: string) => void;
  onSelectCollege: (collegeId: string) => void;
}

export const CareerRoadmapScreen: React.FC<CareerRoadmapScreenProps> = ({
  onNavigate,
  onSelectCollege,
}) => {
  return (
    <main className="w-full pt-20 sm:pt-24 pb-20 bg-slate-100 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <CareerRoadmap
          onSelectCollege={onSelectCollege}
          onNavigate={onNavigate}
        />
      </div>
    </main>
  );
};
