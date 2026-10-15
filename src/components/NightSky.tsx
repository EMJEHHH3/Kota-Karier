import React from 'react';

interface NightSkyProps {
  scrollX?: number;
}

// Static deterministic star positions for perfect hydration & performance across the wide parallax sky
const STARS_DATA = [
  { id: 1, x: 2, y: 12, s: 2, d: 2.8, delay: 0.2, c: '#ffffff' },
  { id: 2, x: 5, y: 34, s: 1, d: 3.5, delay: 1.1, c: '#e0f2fe' },
  { id: 3, x: 8, y: 8, s: 2, d: 4.2, delay: 0.7, c: '#fef08a' },
  { id: 4, x: 11, y: 22, s: 1, d: 2.4, delay: 1.8, c: '#ffffff' },
  { id: 5, x: 14, y: 40, s: 2, d: 3.1, delay: 0.5, c: '#a5f3fc' },
  { id: 6, x: 17, y: 15, s: 1, d: 4.0, delay: 2.3, c: '#ffffff' },
  { id: 7, x: 20, y: 28, s: 2, d: 2.7, delay: 1.4, c: '#fef08a' },
  { id: 8, x: 23, y: 10, s: 3, d: 3.6, delay: 0.1, c: '#e0f2fe' },
  { id: 9, x: 26, y: 38, s: 1, d: 4.5, delay: 2.0, c: '#ffffff' },
  { id: 10, x: 29, y: 18, s: 2, d: 2.9, delay: 1.2, c: '#ffffff' },
  { id: 11, x: 32, y: 7, s: 1, d: 3.4, delay: 0.8, c: '#a5f3fc' },
  { id: 12, x: 35, y: 32, s: 2, d: 4.1, delay: 1.7, c: '#fef08a' },
  { id: 13, x: 38, y: 14, s: 1, d: 2.5, delay: 2.4, c: '#ffffff' },
  { id: 14, x: 41, y: 26, s: 3, d: 3.8, delay: 0.3, c: '#e0f2fe' },
  { id: 15, x: 44, y: 9, s: 2, d: 2.6, delay: 1.9, c: '#ffffff' },
  { id: 16, x: 47, y: 35, s: 1, d: 4.3, delay: 0.9, c: '#fef08a' },
  { id: 17, x: 50, y: 16, s: 2, d: 3.2, delay: 2.1, c: '#ffffff' },
  { id: 18, x: 53, y: 24, s: 1, d: 2.7, delay: 1.3, c: '#a5f3fc' },
  { id: 19, x: 56, y: 11, s: 2, d: 4.0, delay: 0.4, c: '#ffffff' },
  { id: 20, x: 59, y: 38, s: 1, d: 3.3, delay: 1.6, c: '#e0f2fe' },
  { id: 21, x: 62, y: 20, s: 3, d: 2.9, delay: 2.5, c: '#fef08a' },
  { id: 22, x: 65, y: 8, s: 1, d: 4.4, delay: 0.6, c: '#ffffff' },
  { id: 23, x: 68, y: 30, s: 2, d: 3.0, delay: 1.5, c: '#ffffff' },
  { id: 24, x: 71, y: 17, s: 1, d: 2.6, delay: 2.2, c: '#a5f3fc' },
  { id: 25, x: 74, y: 36, s: 2, d: 3.7, delay: 0.7, c: '#e0f2fe' },
  { id: 26, x: 77, y: 14, s: 1, d: 4.1, delay: 1.8, c: '#fef08a' },
  { id: 27, x: 80, y: 25, s: 2, d: 3.1, delay: 1.0, c: '#ffffff' },
  { id: 28, x: 83, y: 11, s: 1, d: 3.9, delay: 0.5, c: '#e0f2fe' },
  { id: 29, x: 86, y: 33, s: 2, d: 2.8, delay: 1.7, c: '#fef08a' },
  { id: 30, x: 89, y: 19, s: 1, d: 4.3, delay: 2.3, c: '#ffffff' },
  { id: 31, x: 92, y: 37, s: 2, d: 3.5, delay: 0.4, c: '#a5f3fc' },
  { id: 32, x: 95, y: 12, s: 3, d: 4.0, delay: 1.2, c: '#ffffff' },
  { id: 33, x: 98, y: 28, s: 1, d: 3.2, delay: 2.0, c: '#fef08a' },
  // Extended parallax field stars (roll into view when scrolling to the right)
  { id: 34, x: 4, y: 22, s: 1, d: 3.0, delay: 2.0, c: '#ffffff' },
  { id: 35, x: 12, y: 44, s: 2, d: 4.2, delay: 0.9, c: '#a5f3fc' },
  { id: 36, x: 19, y: 30, s: 1, d: 2.7, delay: 1.4, c: '#ffffff' },
  { id: 37, x: 27, y: 6, s: 2, d: 3.9, delay: 2.7, c: '#e0f2fe' },
  { id: 38, x: 34, y: 45, s: 1, d: 3.3, delay: 0.3, c: '#ffffff' },
  { id: 39, x: 42, y: 20, s: 2, d: 2.8, delay: 1.1, c: '#fef08a' },
  { id: 40, x: 49, y: 29, s: 1, d: 4.4, delay: 2.2, c: '#ffffff' },
  { id: 41, x: 57, y: 43, s: 2, d: 3.5, delay: 0.5, c: '#a5f3fc' },
  { id: 42, x: 64, y: 19, s: 1, d: 2.9, delay: 1.8, c: '#ffffff' },
  { id: 43, x: 72, y: 41, s: 2, d: 4.0, delay: 2.6, c: '#e0f2fe' },
  { id: 44, x: 79, y: 24, s: 1, d: 3.1, delay: 0.8, c: '#fef08a' },
  { id: 45, x: 87, y: 39, s: 2, d: 2.5, delay: 1.7, c: '#ffffff' },
  { id: 46, x: 94, y: 22, s: 1, d: 4.3, delay: 2.3, c: '#a5f3fc' },
  { id: 47, x: 97, y: 42, s: 2, d: 3.6, delay: 0.4, c: '#ffffff' },
];

export const NightSky: React.FC<NightSkyProps> = ({ scrollX = 0 }) => {
  return (
    <div
      className="night-sky-container"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        background: 'linear-gradient(180deg, #070714 0%, #0d0d21 25%, #18153c 60%, #251e4b 85%, #18182b 100%)',
      }}
      aria-hidden="true"
    >
      {/* 
        Parallax Sky Canvas:
        Moves gently with horizontal scroll (parallax effect), with a generous 1400px buffer 
        so it never gets cut off or exposes empty space at the right edge.
      */}
      <div
        className="night-sky-parallax"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'calc(100% + 1400px)',
          transform: `translateX(-${scrollX * 0.2}px)`,
          willChange: 'transform',
        }}
      >
        {/* 1. MOON (Upper Right with Soft Glow - Moves with gentle celestial parallax) */}
        <div
          className="night-sky-moon"
          style={{
            position: 'absolute',
            top: '18px',
            right: '180px',
            zIndex: 2,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="moon-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: 'block',
              overflow: 'visible',
              filter: 'drop-shadow(0 0 20px rgba(254, 240, 138, 0.65)) drop-shadow(0 0 45px rgba(253, 224, 71, 0.25))',
            }}
          >
            <defs>
              <radialGradient id="moon-surface" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="55%" stopColor="#fef08a" />
                <stop offset="85%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
              </radialGradient>
              <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
                <stop offset="50%" stopColor="#fef9c3" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Outer Halo */}
            <circle cx="50" cy="50" r="48" fill="url(#moon-halo)" />

            {/* Moon Body */}
            <circle cx="50" cy="50" r="32" fill="url(#moon-surface)" />

            {/* Soft Lunar Craters / Pixel Shading */}
            <circle cx="42" cy="40" r="6" fill="#facc15" opacity="0.35" />
            <circle cx="58" cy="54" r="7" fill="#facc15" opacity="0.3" />
            <circle cx="44" cy="62" r="4.5" fill="#facc15" opacity="0.25" />
            <circle cx="62" cy="38" r="3.5" fill="#facc15" opacity="0.25" />
          </svg>
        </div>

        {/* 2. STARS (Twinkling Stars distributed across the wide parallax sky) */}
        <div className="night-sky-stars" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {STARS_DATA.map((star) => (
            <div
              key={star.id}
              className="sky-star"
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.s}px`,
                height: `${star.s}px`,
                backgroundColor: star.c,
                borderRadius: '50%',
                boxShadow: star.s > 1 ? `0 0 3px ${star.c}` : 'none',
                animation: `starTwinkle ${star.d}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        {/* 3. NIGHT CLOUDS (Seamless 2-duplicate looping tracks with zero empty gap) */}
        {/* Cloud Layer 1 - Slower, Deeper */}
        <div
          className="cloud-wrapper"
          style={{
            position: 'absolute',
            top: '25px',
            left: 0,
            width: '100%',
            height: '100px',
            overflow: 'hidden',
            opacity: 0.18,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <div className="cloud-track cloud-layer--1">
            <div className="cloud-segment">
              <svg viewBox="0 0 1600 100" preserveAspectRatio="none" width="100%" height="100%" fill="#3b2d54">
                <path d="M 0,40 C 80,15 180,15 280,40 C 380,65 480,65 580,40 C 680,10 780,10 880,40 C 980,65 1080,65 1180,40 C 1260,15 1360,15 1440,40 C 1480,65 1520,65 1600,40 L 1600,100 L 0,100 Z" />
              </svg>
            </div>
            <div className="cloud-segment">
              <svg viewBox="0 0 1600 100" preserveAspectRatio="none" width="100%" height="100%" fill="#3b2d54">
                <path d="M 0,40 C 80,15 180,15 280,40 C 380,65 480,65 580,40 C 680,10 780,10 880,40 C 980,65 1080,65 1180,40 C 1260,15 1360,15 1440,40 C 1480,65 1520,65 1600,40 L 1600,100 L 0,100 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Cloud Layer 2 - Front, Slightly Faster */}
        <div
          className="cloud-wrapper"
          style={{
            position: 'absolute',
            top: '60px',
            left: 0,
            width: '100%',
            height: '80px',
            overflow: 'hidden',
            opacity: 0.22,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <div className="cloud-track cloud-layer--2">
            <div className="cloud-segment">
              <svg viewBox="0 0 1600 80" preserveAspectRatio="none" width="100%" height="100%" fill="#231b3a">
                <path d="M 0,35 C 70,15 170,15 260,35 C 350,60 440,60 530,35 C 630,8 730,8 820,35 C 910,60 1000,60 1090,35 C 1190,12 1290,12 1380,35 C 1450,55 1530,55 1600,35 L 1600,80 L 0,80 Z" />
              </svg>
            </div>
            <div className="cloud-segment">
              <svg viewBox="0 0 1600 80" preserveAspectRatio="none" width="100%" height="100%" fill="#231b3a">
                <path d="M 0,35 C 70,15 170,15 260,35 C 350,60 440,60 530,35 C 630,8 730,8 820,35 C 910,60 1000,60 1090,35 C 1190,12 1290,12 1380,35 C 1450,55 1530,55 1600,35 L 1600,80 L 0,80 Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
