import React from 'react';
import { Pencil, GraduationCap, BookOpen, FileText } from 'lucide-react';

export const MobileDecorations: React.FC = () => {
  return (
    <div className="block md:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Pencil - Top Left */}
      <div className="absolute top-[12%] left-[4%] opacity-20 dark:opacity-30 motion-safe:animate-float-slow">
        <div style={{ transform: 'rotate(-15deg)' }}>
          <Pencil className="w-8 h-8 text-[#007DCC] dark:text-[#9ccaff] drop-shadow-sm" strokeWidth={1.5} />
        </div>
      </div>

      {/* 2. Graduation Cap - Middle Right */}
      <div className="absolute top-[35%] right-[2%] opacity-15 dark:opacity-20 motion-safe:animate-float-slower">
        <div style={{ transform: 'rotate(10deg)' }}>
          <GraduationCap className="w-12 h-12 text-[#19A7E8] dark:text-[#D3B5E8] drop-shadow-sm" strokeWidth={1} />
        </div>
      </div>

      {/* 3. Small Book - Bottom Left */}
      <div className="absolute bottom-[20%] left-[3%] opacity-15 dark:opacity-25 motion-safe:animate-float-slow">
        <div style={{ transform: 'rotate(-8deg)' }}>
          <BookOpen className="w-7 h-7 text-[#091540] dark:text-[#86cfff] drop-shadow-sm" strokeWidth={1.5} />
        </div>
      </div>

      {/* 4. Small Document - Bottom Right */}
      <div className="absolute bottom-[8%] right-[5%] opacity-20 dark:opacity-20 motion-safe:animate-float-slower">
        <div style={{ transform: 'rotate(5deg)' }}>
          <FileText className="w-6 h-6 text-[#D3B5E8] dark:text-[#D3B5E8] drop-shadow-sm" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
