import React, { useEffect, useState } from 'react';

export type LoaderSize = 'small' | 'medium' | 'large';
export type LoaderVariant = 'spin' | 'draw' | 'write'; // Kept for backwards compatibility

interface PencilLoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  message?: string;
  subMessage?: string;
  className?: string;
}

export const PencilLoader: React.FC<PencilLoaderProps> = ({
  size = 'medium',
  variant = 'draw', // Unused now but kept for backwards compatibility
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
      translate: '-translate-y-[75%]',
      strokeWidth: '4',
    },
    medium: {
      container: 'w-14 h-14',
      svg: 'w-8 h-8',
      textSize: 'text-sm sm:text-base',
      gap: 'gap-4',
      translate: '-translate-y-[90%]',
      strokeWidth: '3',
    },
    large: {
      container: 'w-24 h-24',
      svg: 'w-14 h-14',
      textSize: 'text-base sm:text-lg',
      gap: 'gap-6',
      translate: '-translate-y-[85%]',
      strokeWidth: '2.5',
    },
  };

  const { container, svg, textSize, gap, translate, strokeWidth } = sizeMap[size];

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
        
        {/* Orbital Track (Static faint ring) */}
        <div className="absolute inset-0 w-full h-full rounded-full border border-slate-200/50 dark:border-white/10" />

        {/* Orbital Loading Ring (Spinning) */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full animate-spin opacity-80 z-0"
          style={{ animationDuration: '2s' }}
        >
          <defs>
            <linearGradient id={`loaderRing-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007DCC" />
              <stop offset="50%" stopColor="#007DCC" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#007DCC" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle 
            cx="50" cy="50" r="48" 
            fill="none" 
            stroke={`url(#loaderRing-${size})`} 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
            strokeDasharray="150 300"
          />
        </svg>

        {/* Orbiting Pencil */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center z-10 animate-spin"
          style={{ animationDuration: '0.8s' }}
        >
          <div className={`transform ${translate} rotate-[45deg]`}>
             <PencilSVG />
          </div>
        </div>

      </div>

      {(message || subMessage) && (
        <div className={`text-center ${size === 'small' ? 'flex flex-row items-center gap-1.5 ml-3' : 'mt-4 flex flex-col items-center'}`}>
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
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit-fast {
          animation: orbit-spin 0.8s linear infinite;
        }
        .animate-orbit-ring {
          animation: orbit-spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
