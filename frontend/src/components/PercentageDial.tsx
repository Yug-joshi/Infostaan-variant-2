import React, { useRef, useCallback } from 'react';

interface PercentageDialProps {
  value: number; // 0 to 100
  onChange: (value: number) => void;
  className?: string;
}

const SCALE_TICKS = [35, 45, 55, 65, 75, 85, 95, 100];

export const PercentageDial: React.FC<PercentageDialProps> = ({ value, onChange, className = '' }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const clampedValue = Math.min(100, Math.max(0, isNaN(value) ? 85 : value));

  const updateValueFromPointer = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
    const rounded = Math.round(percentage * 10) / 10;
    onChange(rounded);
  }, [onChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateValueFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      updateValueFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto flex flex-col items-center select-none ${className}`}>
      {/* Current Percentage Prominent Display */}
      <div className="text-center my-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#71839A]">
          Choose your percentage
        </span>
        <div className="text-3xl sm:text-4xl font-black text-[#007DCC] dark:text-[#86cfff] tracking-tight leading-none my-1">
          {clampedValue.toFixed(1).replace(/\.0$/, '')}%
        </div>
        <div className="text-[11px] font-medium text-slate-500 dark:text-[#71839A]">
          Your percentage
        </div>
      </div>

      {/* Interactive Horizontal Track & Scale */}
      <div className="w-full px-3 py-1">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-10 flex items-center cursor-pointer touch-none"
        >
          {/* Background Track */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-white/10 relative overflow-hidden">
            {/* Active Fill Track */}
            <div
              className="h-full bg-gradient-to-r from-[#007DCC] to-[#19A7E8] rounded-full transition-all duration-75"
              style={{ width: `${clampedValue}%` }}
            />
          </div>

          {/* Draggable Marker / Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#0D1828] border-3 border-[#007DCC] dark:border-[#86cfff] shadow-md flex items-center justify-center transition-transform active:scale-125 pointer-events-none z-10"
            style={{ left: `${clampedValue}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-[#007DCC] dark:bg-[#86cfff]" />
          </div>

          {/* Accessible Invisible Range Input Overlay */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={clampedValue}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            aria-label="Select cutoff percentage"
          />
        </div>

        {/* Compact Scale Markers Row: 35 ── 45 ── 55 ── 65 ── 75 ── 85 ── 95 ── 100 */}
        <div className="relative w-full h-5 mt-0.5">
          {SCALE_TICKS.map((tick) => {
            const isCurrent = Math.abs(clampedValue - tick) < 2.5;
            return (
              <div
                key={tick}
                onClick={() => onChange(tick)}
                className={`absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer transition-colors ${
                  isCurrent
                    ? 'text-[#007DCC] dark:text-[#86cfff] font-extrabold'
                    : 'text-slate-400 dark:text-slate-500 font-medium hover:text-slate-700 dark:hover:text-[#A9B8CA]'
                }`}
                style={{ left: `${tick}%` }}
              >
                <div className={`w-0.5 h-1 rounded-full mb-0.5 ${isCurrent ? 'bg-[#007DCC] dark:bg-[#86cfff]' : 'bg-slate-300 dark:bg-white/20'}`} />
                <span className="text-[10px] leading-none">{tick}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
