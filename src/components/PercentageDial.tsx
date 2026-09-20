import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GraduationCap } from 'lucide-react';

interface PercentageDialProps {
  value: number; // 0 to 100
  onChange: (value: number) => void;
  className?: string;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(" ");
}

export const PercentageDial: React.FC<PercentageDialProps> = ({ value, onChange, className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Math constants
  const cx = 150;
  const cy = 150;
  const radius = 110;
  const startAngle = -135;
  const endAngle = 135;
  const angleRange = endAngle - startAngle;

  const currentAngle = startAngle + (Math.max(0, Math.min(100, value)) / 100) * angleRange;
  const knobPos = polarToCartesian(cx, cy, radius, currentAngle);

  // Generate tick marks (e.g., every 5%)
  const ticks = Array.from({ length: 21 }).map((_, i) => {
    const p = i * 5;
    const a = startAngle + (p / 100) * angleRange;
    const isMajor = p % 25 === 0;
    const inner = polarToCartesian(cx, cy, isMajor ? radius + 15 : radius + 15);
    const outer = polarToCartesian(cx, cy, isMajor ? radius + 25 : radius + 20);
    return { p, a, inner, outer, isMajor };
  });

  const handlePointerUpdate = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Calculate position relative to center of SVG
    const x = clientX - rect.left - (rect.width / 2);
    const y = clientY - rect.top - (rect.height / 2);

    // atan2 gives angle from positive x-axis. 
    // We want angle from positive y-axis (downwards), where top is 0.
    // In our polarToCartesian, angle=0 is TOP (x=0, y=-R). 
    // So dx=x, dy=y. angle in rad from top = atan2(y, x) + PI/2.
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    
    // Normalize angle to be between -180 and 180
    if (angle > 180) angle -= 360;

    // Constrain to our arc
    if (angle < startAngle && angle > -180) angle = startAngle;
    if (angle > endAngle || angle < -180) {
       // if it's in the bottom wedge, snap to closest end
       if (angle > endAngle && angle < 180) {
           angle = endAngle;
       } else if (angle < startAngle) {
           angle = startAngle;
       }
    }

    const percentage = ((angle - startAngle) / angleRange) * 100;
    const clamped = Math.max(0, Math.min(100, percentage));
    onChange(Number(clamped.toFixed(1)));
  }, [onChange, angleRange]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handlePointerUpdate(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerUpdate(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handlePointerUpdate]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handlePointerUpdate(e.touches[0].clientX, e.touches[0].clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while dragging
      handlePointerUpdate(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handlePointerUpdate]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 300 300"
        className="w-full h-auto max-w-[320px] sm:max-w-[360px] touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.05))' }}
      >
        <defs>
          <linearGradient id="activeArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#007DCC" />
            <stop offset="100%" stopColor="#5B5CE2" />
          </linearGradient>
          <filter id="knobShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Ticks */}
        {ticks.map((tick, i) => (
          <g key={i}>
            <line
              x1={tick.inner.x}
              y1={tick.inner.y}
              x2={tick.outer.x}
              y2={tick.outer.y}
              stroke="currentColor"
              strokeWidth={tick.isMajor ? 2 : 1.5}
              className="text-slate-300 dark:text-slate-700"
            />
            {tick.isMajor && (
              <text
                x={polarToCartesian(cx, cy, radius + 40, tick.a).x}
                y={polarToCartesian(cx, cy, radius + 40, tick.a).y}
                textAnchor="middle"
                alignmentBaseline="middle"
                className="text-[10px] font-bold fill-slate-400 dark:fill-[#71839A]"
              >
                {tick.p}
              </text>
            )}
          </g>
        ))}

        {/* Background Track */}
        <path
          d={describeArc(cx, cy, radius, startAngle, endAngle)}
          fill="none"
          strokeWidth="16"
          strokeLinecap="round"
          className="stroke-slate-100 dark:stroke-white/5"
        />

        {/* Active Arc */}
        {value > 0 && (
          <path
            d={describeArc(cx, cy, radius, startAngle, currentAngle)}
            fill="none"
            stroke="url(#activeArcGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            className="transition-all duration-75 ease-out"
          />
        )}

        {/* Knob */}
        <circle
          cx={knobPos.x}
          cy={knobPos.y}
          r="14"
          fill="white"
          className="cursor-grab active:cursor-grabbing transition-all duration-75 ease-out dark:fill-[#0D1828]"
          filter="url(#knobShadow)"
          stroke="#5B5CE2"
          strokeWidth="3"
        />
        
        {/* Floating Percentage Label above Knob */}
        <g 
          className="transition-all duration-75 ease-out pointer-events-none"
          transform={`translate(${knobPos.x}, ${knobPos.y - 32})`}
        >
          <rect x="-24" y="-12" width="48" height="24" rx="6" fill="#007DCC" className="dark:fill-[#19A7E8]" />
          <text x="0" y="0" textAnchor="middle" alignmentBaseline="central" className="text-[11px] font-bold fill-white dark:fill-[#070D18]">
            {value.toFixed(1)}%
          </text>
        </g>
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2 sm:mt-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
          <GraduationCap className="w-5 h-5 text-[#007DCC] dark:text-[#86cfff]" />
        </div>
        <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-1">
          {value.toFixed(1)}<span className="text-2xl sm:text-3xl text-slate-400 dark:text-[#71839A]">%</span>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#71839A]">
          Your Percentage
        </div>
      </div>
    </div>
  );
};
