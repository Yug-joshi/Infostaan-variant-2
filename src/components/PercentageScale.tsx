import React, { useRef, useCallback } from 'react';

interface PercentageScaleProps {
  value: number; // 0 to 100
  onChange: (value: number) => void;
  className?: string;
}

/**
 * PercentageScale — Educational Ruler Selector
 *
 * Replaces the old PercentageDial with an interactive horizontal
 * "school ruler" scale.  Every integer 0–100 is selectable via:
 *   - Click / tap anywhere on the ruler
 *   - Drag (pointer capture)
 *   - Keyboard (arrow keys, Home, End)
 *   - External numeric input (controlled via `value` prop)
 *
 * Follows the Infostaan dark-theme design system.
 */
export const PercentageScale: React.FC<PercentageScaleProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Clamp and snap to whole-number integer
  const clamped = Math.min(100, Math.max(0, isNaN(value) ? 85 : Math.round(value)));
  const fraction = clamped / 100;

  /* Pointer helpers */
  const valueFromClientX = useCallback(
    (clientX: number): number => {
      if (!rulerRef.current) return clamped;
      const rect = rulerRef.current.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      return Math.min(100, Math.max(0, Math.round(raw)));
    },
    [clamped],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      onChange(valueFromClientX(e.clientX));
    },
    [onChange, valueFromClientX],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      onChange(valueFromClientX(e.clientX));
    },
    [onChange, valueFromClientX],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    },
    [],
  );

  /* Keyboard */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let next = clamped;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        next = Math.min(100, clamped + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        next = Math.max(0, clamped - 1);
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = 100;
      } else {
        return;
      }
      e.preventDefault();
      onChange(next);
    },
    [clamped, onChange],
  );

  /* Tick data: 101 ticks with kind classification */
  const ticks: { pct: number; kind: 'major' | 'mid' | 'minor' }[] = [];
  for (let i = 0; i <= 100; i++) {
    let kind: 'major' | 'mid' | 'minor' = 'minor';
    if (i % 10 === 0) kind = 'major';
    else if (i % 5 === 0) kind = 'mid';
    ticks.push({ pct: i, kind });
  }

  /* Bubble label transform clamped at edges */
  const bubbleLeft = `${fraction * 100}%`;
  const bubbleTx =
    clamped <= 5 ? 'translateX(0%)' : clamped >= 95 ? 'translateX(-100%)' : 'translateX(-50%)';

  return (
    <div
      className={`w-full select-none ${className}`}
      style={{ maxWidth: '750px', margin: '0 auto' }}
    >
      <div className="px-3 sm:px-5">
        {/* Floating percentage bubble */}
        <div style={{ position: 'relative', height: '38px' }} aria-hidden="true">
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: bubbleLeft,
              transform: bubbleTx,
              transition: 'left 0.07s ease',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: '#007DCC',
                color: '#F4F7FB',
                borderRadius: '7px',
                padding: '3px 9px',
                fontSize: '13px',
                fontWeight: 800,
                lineHeight: 1.4,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              {clamped}%
              <span
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '6px solid #007DCC',
                }}
              />
            </div>
          </div>
        </div>

        {/* Ruler interactive zone */}
        <div
          ref={rulerRef}
          role="slider"
          aria-label="Select cutoff percentage"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clamped}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className="relative w-full cursor-pointer touch-none"
          style={{ height: '56px', outline: 'none' }}
        >
          {/* Ruler spine */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: 0,
              right: 0,
              height: '2px',
              background: 'rgba(169,184,202,0.22)',
              borderRadius: '1px',
            }}
          />

          {/* Ticks */}
          {ticks.map(({ pct, kind }) => {
            const isActive = pct === clamped;
            const isMajor = kind === 'major';
            const isMid = kind === 'mid';
            const tickH = isMajor ? 18 : isMid ? 11 : 7;
            const tickW = isMajor ? 2 : 1;

            return (
              <div
                key={pct}
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: `${pct}%`,
                  transform: 'translateX(-50%)',
                  width: `${tickW}px`,
                  height: `${tickH}px`,
                  background: isActive
                    ? '#007DCC'
                    : isMajor
                    ? 'rgba(169,184,202,0.55)'
                    : isMid
                    ? 'rgba(169,184,202,0.32)'
                    : 'rgba(169,184,202,0.18)',
                  borderRadius: '1px',
                  transition: 'background 0.09s ease',
                }}
              />
            );
          })}

          {/* Major labels: 0 10 20 … 100 */}
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((pct) => {
            const isActive = pct === clamped;
            const tx = pct === 0 ? '0%' : pct === 100 ? '-100%' : '-50%';
            return (
              <div
                key={`lbl-${pct}`}
                style={{
                  position: 'absolute',
                  top: '36px',
                  left: `${pct}%`,
                  transform: `translateX(${tx})`,
                  fontSize: '10px',
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? '#19A7E8' : 'rgba(169,184,202,0.65)',
                  transition: 'color 0.09s ease',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                {pct}
              </div>
            );
          })}

          {/* Marker vertical line */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: `${fraction * 100}%`,
              transform: 'translateX(-50%)',
              transition: 'left 0.06s ease',
              width: '2px',
              height: '48px',
              background: 'linear-gradient(to bottom, #007DCC 65%, rgba(0,125,204,0.1))',
              borderRadius: '1px',
              pointerEvents: 'none',
            }}
          />

          {/* Marker dot on the spine */}
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: `${fraction * 100}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.06s ease',
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              background: '#007DCC',
              border: '2.5px solid #19A7E8',
              boxShadow: '0 0 0 4px rgba(0,125,204,0.15)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Bottom ruler edge */}
        <div
          style={{
            height: '1px',
            background: 'rgba(169,184,202,0.1)',
            marginTop: '2px',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
