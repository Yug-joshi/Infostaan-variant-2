import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
  screenKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, screenKey }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Only animate if prefers-reduced-motion is false
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [screenKey]);

  return (
    <div ref={containerRef} className="w-full flex-1 flex flex-col will-change-[opacity,transform]">
      {children}
    </div>
  );
};
