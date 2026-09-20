import React from 'react';

/**
 * GlowingWave — React Bits Pro style
 * A luminous sinusoidal wave that sweeps slowly across the full screen.
 * Uses pure SVG + CSS animation — no external dependencies.
 *
 * Props:
 *   colors   – array of wave stroke colors (defaults: indigo/purple/sky palette)
 *   opacity  – base opacity (default 0.55)
 *   blur     – SVG filter blur radius in px (default 18)
 *   speed    – animation duration in seconds (default 12)
 */
const GlowingWave = ({
  colors = [
    'rgba(99,102,241,0.9)',   // indigo
    'rgba(139,92,246,0.75)',  // violet
    'rgba(14,165,233,0.65)',  // sky
    'rgba(168,85,247,0.55)',  // purple
  ],
  opacity = 0.55,
  blur = 20,
  speed = 12,
}) => {
  const waves = [
    { amplitude: 70,  period: 0.8,  yBase: 0.52, duration: speed,        delay: 0,            strokeIdx: 0, strokeWidth: 3,   glowScale: 1.0 },
    { amplitude: 55,  period: 1.0,  yBase: 0.50, duration: speed * 1.35, delay: -(speed * 0.3), strokeIdx: 1, strokeWidth: 2.5, glowScale: 0.85 },
    { amplitude: 40,  period: 0.65, yBase: 0.54, duration: speed * 0.80, delay: -(speed * 0.6), strokeIdx: 2, strokeWidth: 2,   glowScale: 0.7 },
    { amplitude: 85,  period: 1.2,  yBase: 0.48, duration: speed * 1.6,  delay: -(speed * 0.15),strokeIdx: 3, strokeWidth: 1.5, glowScale: 0.6 },
  ];

  // Build the SVG path for one wave using a series of sin-curve points
  const buildPath = (amplitude, period, yBase, width = 1400, height = 900, phaseOffset = 0) => {
    const pts = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = height * yBase + amplitude * Math.sin((i / steps) * Math.PI * 2 * period + phaseOffset);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return pts.join(' ');
  };

  const filterId = 'glowFilter';

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={blur} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Per-wave keyframes injected as inline <style> */}
          <style>{`
            ${waves.map((w, i) => `
              @keyframes waveSlide${i} {
                0%   { transform: translateX(0px); }
                100% { transform: translateX(-${(1 / w.period) * 200}px); }
              }
              .wave-path-${i} {
                animation: waveSlide${i} ${w.duration}s linear ${w.delay}s infinite;
                will-change: transform;
              }
            `).join('')}

            @keyframes waveGlow {
              0%, 100% { opacity: 0.7; }
              50%       { opacity: 1; }
            }
            .wave-glow {
              animation: waveGlow 4s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* Render each wave twice (tiled) so the loop is seamless */}
        {waves.map((w, i) => {
          const path1 = buildPath(w.amplitude, w.period, w.yBase, 1400, 900, 0);
          const path2 = buildPath(w.amplitude, w.period, w.yBase, 1400, 900, Math.PI);
          const color = colors[w.strokeIdx % colors.length];

          return (
            <g key={i} filter={`url(#${filterId})`} className="wave-glow">
              {/* Primary wave */}
              <path
                d={path1}
                stroke={color}
                strokeWidth={w.strokeWidth * w.glowScale * 3}
                fill="none"
                strokeLinecap="round"
                opacity={0.25}
                className={`wave-path-${i}`}
              />
              {/* Sharp bright core line on top */}
              <path
                d={path1}
                stroke={color}
                strokeWidth={w.strokeWidth}
                fill="none"
                strokeLinecap="round"
                opacity={0.95}
                className={`wave-path-${i}`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GlowingWave;
