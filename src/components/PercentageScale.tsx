import React, { useRef, useCallback, useMemo } from 'react';

interface PercentageScaleProps {
  value: number; // 35 to 100
  onChange: (value: number) => void;
  className?: string;
}

const MIN_PERCENTAGE = 35;
const MAX_PERCENTAGE = 100;

/**
 * PercentageScale — Educational Ruler Selector
 *
 * Interactive horizontal percentage scale from 35–100%.
 *
 * Supports:
 * - Click / tap
 * - Drag with pointer capture
 * - Keyboard controls
 * - External controlled value
 */
export const PercentageScale: React.FC<PercentageScaleProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const animationFrame = useRef<number | null>(null);

  const [dragging, setDragging] = React.useState(false);

  // Clamp value to the valid percentage range.
  const clamped = Math.min(
    MAX_PERCENTAGE,
    Math.max(
      MIN_PERCENTAGE,
      isNaN(value) ? 85 : Math.round(value)
    )
  );

  /*
   * Convert the actual percentage into a 0–100% visual
   * position on the ruler.
   *
   * 35% = left edge
   * 100% = right edge
   */
  const fraction =
    (clamped - MIN_PERCENTAGE) /
    (MAX_PERCENTAGE - MIN_PERCENTAGE);

  /* Pointer helpers */
  const valueFromClientX = useCallback(
    (clientX: number): number => {
      if (!rulerRef.current) return clamped;

      const rect = rulerRef.current.getBoundingClientRect();

      const rulerFraction =
        (clientX - rect.left) / rect.width;

      const raw =
        MIN_PERCENTAGE +
        rulerFraction *
        (MAX_PERCENTAGE - MIN_PERCENTAGE);

      return Math.min(
        MAX_PERCENTAGE,
        Math.max(MIN_PERCENTAGE, Math.round(raw))
      );
    },
    [clamped],
  );

  /* Pointer down */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = true;
      setDragging(true);

      e.currentTarget.setPointerCapture(e.pointerId);

      onChange(valueFromClientX(e.clientX));
    },
    [onChange, valueFromClientX],
  );

  /* Pointer move — frame synchronized */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;

      const clientX = e.clientX;

      if (animationFrame.current !== null) return;

      animationFrame.current = requestAnimationFrame(() => {
        animationFrame.current = null;

        onChange(valueFromClientX(clientX));
      });
    },
    [onChange, valueFromClientX],
  );

  /* Pointer up */
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;

      isDragging.current = false;
      setDragging(false);

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        // Pointer capture may already have been released.
      }
    },
    [],
  );

  /* Keyboard */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let next = clamped;

      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp'
      ) {
        next = Math.min(
          MAX_PERCENTAGE,
          clamped + 1
        );
      } else if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowDown'
      ) {
        next = Math.max(
          MIN_PERCENTAGE,
          clamped - 1
        );
      } else if (e.key === 'Home') {
        next = MIN_PERCENTAGE;
      } else if (e.key === 'End') {
        next = MAX_PERCENTAGE;
      } else {
        return;
      }

      e.preventDefault();
      onChange(next);
    },
    [clamped, onChange],
  );

  /*
   * Tick data.
   *
   * The ruler now represents 35–100,
   * so ticks are generated only inside that range.
   */
  const ticks = useMemo(() => {
    const result: {
      pct: number;
      kind: 'major' | 'mid' | 'minor';
    }[] = [];

    for (
      let i = MIN_PERCENTAGE;
      i <= MAX_PERCENTAGE;
      i++
    ) {
      let kind: 'major' | 'mid' | 'minor' = 'minor';

      if (
        i === MIN_PERCENTAGE ||
        i % 10 === 0
      ) {
        kind = 'major';
      } else if (i % 5 === 0) {
        kind = 'mid';
      }

      result.push({
        pct: i,
        kind,
      });
    }

    return result;
  }, []);

  /*
   * Convert actual percentage into ruler position.
   *
   * Example:
   * 35  → 0%
   * 40  → 7.69%
   * 50  → 23.07%
   * 75  → 61.54%
   * 100 → 100%
   */
  const percentageToPosition = (pct: number) => {
    return (
      ((pct - MIN_PERCENTAGE) /
        (MAX_PERCENTAGE - MIN_PERCENTAGE)) *
      100
    );
  };

  /* Floating percentage bubble */
  const bubbleLeft = `${fraction * 100}%`;

  const bubbleTx =
    clamped <= 40
      ? 'translateX(0%)'
      : clamped >= 95
        ? 'translateX(-100%)'
        : 'translateX(-50%)';

  return (
    <div
      className={`w-full select-none ${className}`}
      style={{
        maxWidth: '750px',
        margin: '0 auto',
      }}
    >
      <div className="px-6 sm:px-8">

        {/* Floating percentage bubble */}
        <div
          style={{
            position: 'relative',
            height: '38px',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: bubbleLeft,
              transform: bubbleTx,

              /*
               * No transition while dragging.
               * This keeps the number locked to the pointer.
               */
              transition: dragging
                ? 'none'
                : 'left 0.08s ease-out, transform 0.12s ease-out',

              pointerEvents: 'none',
              willChange: 'left, transform',
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

                /*
                 * Subtle visual feedback without affecting dragging.
                 */
                boxShadow: dragging
                  ? '0 4px 14px rgba(0,125,204,0.28)'
                  : '0 2px 8px rgba(0,125,204,0.18)',
                transition:
                  'box-shadow 0.15s ease',
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
                  borderLeft:
                    '5px solid transparent',
                  borderRight:
                    '5px solid transparent',
                  borderTop:
                    '6px solid #007DCC',
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
          aria-valuemin={MIN_PERCENTAGE}
          aria-valuemax={MAX_PERCENTAGE}
          aria-valuenow={clamped}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className="relative cursor-pointer touch-none"
          style={{
            /*
             * Slightly narrower than the container so
             * 35 and 100 have breathing room.
             */
            width: 'calc(100% - 32px)',
            margin: '0 auto',
            height: '56px',
            outline: 'none',
          }}
        >

          {/* Ruler spine */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: 0,
              right: 0,
              height: '2px',
              background:
                'rgba(169,184,202,0.22)',
              borderRadius: '1px',
            }}
          />

          {/* Ticks */}
          {ticks.map(({ pct, kind }) => {
            const isActive =
              pct === clamped;

            const isMajor =
              kind === 'major';

            const isMid =
              kind === 'mid';

            const tickH = isMajor
              ? 18
              : isMid
                ? 11
                : 7;

            const tickW = isMajor ? 2 : 1;

            const position =
              percentageToPosition(pct);

            return (
              <div
                key={pct}
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: `${position}%`,
                  transform:
                    'translateX(-50%)',
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

                  transition:
                    'background 0.09s ease',

                  pointerEvents: 'none',
                }}
              />
            );
          })}

          {/* Major labels */}
          {[
            35,
            40,
            50,
            60,
            70,
            80,
            90,
            100,
          ].map((pct) => {
            const isActive =
              pct === clamped;

            const position =
              percentageToPosition(pct);

            const tx =
              pct === 35
                ? '0%'
                : pct === 100
                  ? '-100%'
                  : '-50%';

            return (
              <div
                key={`lbl-${pct}`}
                style={{
                  position: 'absolute',
                  top: '36px',
                  left: `${position}%`,
                  transform: `translateX(${tx})`,
                  fontSize: '10px',
                  fontWeight: isActive
                    ? 800
                    : 500,
                  color: isActive
                    ? '#19A7E8'
                    : 'rgba(169,184,202,0.65)',
                  transition:
                    'color 0.09s ease',
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
              transform:
                'translateX(-50%)',

              /*
               * No position animation while dragging.
               * This prevents the marker from lagging behind.
               */
              transition: dragging
                ? 'none'
                : 'left 0.06s ease-out',

              width: '2px',
              height: '48px',

              background:
                'linear-gradient(to bottom, #007DCC 65%, rgba(0,125,204,0.1))',

              borderRadius: '1px',
              pointerEvents: 'none',
              willChange: 'left',
            }}
          />

          {/* Marker dot */}
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: `${fraction * 100}%`,
              transform:
                'translate(-50%, -50%)',

              transition: dragging
                ? 'none'
                : 'left 0.06s ease-out, box-shadow 0.15s ease',

              width: '13px',
              height: '13px',
              borderRadius: '50%',

              background: '#007DCC',
              border:
                '2.5px solid #19A7E8',

              /*
               * Subtle active-state animation.
               */
              boxShadow: dragging
                ? '0 0 0 6px rgba(0,125,204,0.20)'
                : '0 0 0 4px rgba(0,125,204,0.15)',

              pointerEvents: 'none',
              willChange:
                'left, box-shadow',
            }}
          />
        </div>

        {/* Bottom ruler edge */}
        <div
          style={{
            height: '1px',
            background:
              'rgba(169,184,202,0.1)',
            marginTop: '2px',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};