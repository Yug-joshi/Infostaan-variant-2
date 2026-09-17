import React, { useEffect, useState } from 'react';

export type LoaderSize = 'small' | 'medium' | 'large';
export type LoaderVariant = 'spin' | 'draw' | 'write';

interface PencilLoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  message?: string;
  subMessage?: string;
  className?: string;
}

export const PencilLoader: React.FC<PencilLoaderProps> = ({
  size = 'medium',
  variant = 'draw',
  message,
  subMessage,
  className = '',
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const sizeMap = {
    small: {
      container: 'w-6 h-6',
      svg: 'w-4 h-4',
      textSize: 'text-xs',
      gap: 'gap-2',
    },
    medium: {
      container: 'w-14 h-14',
      svg: 'w-8 h-8',
      textSize: 'text-sm sm:text-base',
      gap: 'gap-4',
    },
    large: {
      container: 'w-24 h-24',
      svg: 'w-14 h-14',
      textSize: 'text-base sm:text-lg',
      gap: 'gap-6',
    },
  };

  const { container, svg, textSize, gap } = sizeMap[size];

  // Minimal SVG for the Pencil
  const PencilSVG = () => (
    <svg 
      className={`${svg} overflow-visible relative z-10`} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M21.1716 2.82843C20.0459 1.70277 18.2217 1.70277 17.0961 2.82843L4.17157 15.753C3.609 16.3155 3.29289 17.0785 3.29289 17.8744V20C3.29289 20.5523 3.74061 21 4.29289 21H6.41846C7.21443 21 7.9774 20.6839 8.53995 20.1213L21.1716 7.48972C22.2972 6.36406 22.2972 4.54085 21.1716 3.41519L21.1716 2.82843Z" 
        fill="#007DCC"
        stroke="#091540" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M17.0961 2.82843L21.1716 6.90396" 
        stroke="#091540" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M3.29289 17.8744L7.5 16.5M3.29289 17.8744L4.5 19L8.53995 20.1213M3.29289 17.8744L8.53995 20.1213" 
        stroke="#091540" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M7.5 16.5L18 6" 
        stroke="#19A7E8" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M3.29289 21L5.5 18.5" 
        stroke="#D3B5E8" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
    </svg>
  );

  return (
    <div 
      className={`flex ${size === 'small' ? 'flex-row items-center' : 'flex-col items-center justify-center'} ${className}`} 
      role="status" 
      aria-live="polite"
    >
      <div className={`relative flex items-center justify-center ${container} ${size === 'small' ? '' : gap}`}>
        <div className={`
          flex items-center justify-center relative z-10 origin-center
          ${!prefersReducedMotion && variant === 'spin' ? 'animate-[spin_1.5s_linear_infinite]' : ''}
          ${!prefersReducedMotion && variant === 'draw' ? 'animate-[pencil-draw_1.5s_linear_infinite]' : ''}
          ${!prefersReducedMotion && variant === 'write' ? 'animate-[pencil-write_1s_ease-in-out_infinite]' : ''}
          ${prefersReducedMotion ? 'opacity-90' : ''}
        `}>
          <PencilSVG />
        </div>
        
        {/* Draw Path Effect */}
        {!prefersReducedMotion && variant === 'draw' && (
           <div className="absolute inset-0 w-full h-full -z-0 opacity-40">
             <svg viewBox="0 0 100 100" className="w-full h-full">
               <circle 
                 cx="50" cy="50" r="40" 
                 fill="none" 
                 stroke="#007DCC" 
                 strokeWidth="3" 
                 strokeLinecap="round"
                 className="animate-[path-draw_1.5s_linear_infinite]" 
               />
             </svg>
           </div>
        )}

        {/* Write Line Effect */}
        {!prefersReducedMotion && variant === 'write' && (
           <div className="absolute bottom-1 w-[120%] left-[-10%] h-1 -z-0 flex items-center justify-start overflow-hidden opacity-50">
             <div className="h-[2px] bg-[#007DCC] animate-[line-write_1s_ease-in-out_infinite] w-full origin-left" />
           </div>
        )}
      </div>

      {(message || subMessage) && (
        <div className={`text-center ${size === 'small' ? 'flex flex-row items-center gap-1.5 ml-2' : 'mt-4 flex flex-col items-center'}`}>
          {message && (
            <p className={`${textSize} font-semibold text-slate-900 dark:text-[#F4F7FB]`}>
              {message}
            </p>
          )}
          {subMessage && size !== 'small' && (
            <p className="text-sm text-slate-500 dark:text-[#A9B8CA] mt-1">
              {subMessage}
            </p>
          )}
        </div>
      )}

      {/* Global styles for pencil animations */}
      <style>{`
        @keyframes pencil-draw {
          0% { transform: rotate(0deg) translateY(-40%) rotate(45deg); }
          100% { transform: rotate(360deg) translateY(-40%) rotate(45deg); }
        }
        @keyframes path-draw {
          0% { stroke-dasharray: 0 251.2; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 251.2 251.2; stroke-dashoffset: 0; }
          100% { stroke-dasharray: 251.2 251.2; stroke-dashoffset: -251.2; }
        }
        @keyframes pencil-write {
          0% { transform: translateX(-40%) rotate(15deg); }
          50% { transform: translateX(40%) rotate(-5deg); }
          100% { transform: translateX(-40%) rotate(15deg); }
        }
        @keyframes line-write {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1) translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
