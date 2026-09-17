import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

export const InitialLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Wait slightly then fade out smoothly
    const timer = setTimeout(() => {
      gsap.to('.initial-loader-overlay', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => setIsVisible(false)
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="initial-loader-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#070D18] text-slate-900 dark:text-[#F4F7FB]">
      <div className="flex flex-col items-center text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-slate-900 dark:text-[#F4F7FB] animate-pulse">
          Infostaan
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-[#A9B8CA] tracking-wide">
          Finding your way...
        </p>
        
        {/* Subtle line reveal */}
        <div className="mt-6 w-16 h-[2px] bg-slate-200 dark:bg-[#1a202b] rounded-full overflow-hidden flex">
          <div className="h-full bg-[#007DCC] dark:bg-[#9ccaff] animate-loading-line w-full rounded-full origin-left" />
        </div>
      </div>
    </div>
  );
};
