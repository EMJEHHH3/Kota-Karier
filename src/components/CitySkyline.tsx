import React from 'react';

export const CitySkyline: React.FC = () => {
  return (
    <div
      className="city-skyline-bg"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '140px',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: 0.45,
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '140px' }}
      >
        <defs>
          <linearGradient id="skyline-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#252448" />
            <stop offset="70%" stopColor="#1a1936" />
            <stop offset="100%" stopColor="#121124" />
          </linearGradient>
          <linearGradient id="skyline-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1b38" />
            <stop offset="100%" stopColor="#0f0e1f" />
          </linearGradient>

          {/* Seamless repeating horizontal pattern (1600px width) */}
          <pattern
            id="skyline-repeat-pattern"
            width="1600"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            {/* Far layer towers (darker silhouette) */}
            <g fill="url(#skyline-far)">
              {/* Spire tower */}
              <polygon points="90,10 88,30 92,30" />
              <rect x="75" y="30" width="30" height="110" />
              <rect x="180" y="45" width="45" height="95" />
              <polygon points="310,20 305,40 315,40" />
              <rect x="295" y="40" width="30" height="100" />
              <rect x="420" y="25" width="55" height="115" />
              <rect x="560" y="40" width="40" height="100" />
              <polygon points="710,15 708,35 712,35" />
              <rect x="695" y="35" width="30" height="105" />
              <rect x="820" y="30" width="60" height="110" />
              <rect x="960" y="45" width="45" height="95" />
              <polygon points="1090,18 1088,38 1092,38" />
              <rect x="1075" y="38" width="30" height="102" />
              <rect x="1200" y="22" width="55" height="118" />
              <rect x="1340" y="35" width="45" height="105" />
              <rect x="1470" y="28" width="60" height="112" />
            </g>

            {/* Near layer silhouette buildings */}
            <g fill="url(#skyline-grad)">
              {/* Tower 1 */}
              <rect x="20" y="50" width="40" height="90" />
              {/* Tower 2 with angled roof */}
              <polygon points="120,35 155,50 120,50" />
              <rect x="120" y="50" width="35" height="90" />
              {/* Tower 3 with antenna */}
              <line x1="245" y1="20" x2="245" y2="40" stroke="#38bdf8" strokeWidth="1" />
              <rect x="230" y="40" width="32" height="100" />
              {/* Tower 4 */}
              <rect x="340" y="30" width="50" height="110" />
              {/* Tower 5 */}
              <rect x="490" y="55" width="45" height="85" />
              {/* Tower 6 with antenna */}
              <line x1="630" y1="15" x2="630" y2="35" stroke="#fbbf24" strokeWidth="1" />
              <rect x="615" y="35" width="35" height="105" />
              {/* Tower 7 */}
              <rect x="740" y="45" width="50" height="95" />
              {/* Tower 8 with stepped top */}
              <rect x="900" y="32" width="24" height="10" />
              <rect x="890" y="42" width="44" height="98" />
              {/* Tower 9 */}
              <rect x="1015" y="50" width="38" height="90" />
              {/* Tower 10 with antenna */}
              <line x1="1145" y1="18" x2="1145" y2="38" stroke="#38bdf8" strokeWidth="1" />
              <rect x="1130" y="38" width="36" height="102" />
              {/* Tower 11 */}
              <rect x="1270" y="40" width="48" height="100" />
              {/* Tower 12 */}
              <rect x="1395" y="48" width="42" height="92" />
              {/* Tower 13 */}
              <rect x="1540" y="35" width="50" height="105" />
            </g>

            {/* Small lit windows in the background towers (warm amber & cyan) */}
            {/* Tower 1 windows */}
            <rect x="28" y="60" width="4" height="4" fill="#fbbf24" opacity="0.6" />
            <rect x="44" y="70" width="4" height="4" fill="#38bdf8" opacity="0.5" />
            <rect x="28" y="85" width="4" height="4" fill="#fbbf24" opacity="0.5" />

            {/* Tower 2 windows */}
            <rect x="130" y="65" width="4" height="4" fill="#38bdf8" opacity="0.6" />
            <rect x="142" y="80" width="4" height="4" fill="#fbbf24" opacity="0.5" />
            <rect x="130" y="95" width="4" height="4" fill="#38bdf8" opacity="0.5" />

            {/* Tower 3 windows */}
            <rect x="240" y="55" width="4" height="4" fill="#fbbf24" opacity="0.7" />
            <rect x="248" y="75" width="4" height="4" fill="#38bdf8" opacity="0.6" />
            <rect x="240" y="95" width="4" height="4" fill="#fbbf24" opacity="0.4" />

            {/* Tower 4 windows */}
            <rect x="352" y="45" width="4" height="4" fill="#38bdf8" opacity="0.7" />
            <rect x="372" y="45" width="4" height="4" fill="#fbbf24" opacity="0.5" />
            <rect x="352" y="65" width="4" height="4" fill="#fbbf24" opacity="0.6" />
            <rect x="372" y="85" width="4" height="4" fill="#38bdf8" opacity="0.5" />

            {/* Tower 5 windows */}
            <rect x="502" y="70" width="4" height="4" fill="#fbbf24" opacity="0.5" />
            <rect x="520" y="85" width="4" height="4" fill="#38bdf8" opacity="0.6" />

            {/* Tower 6 windows */}
            <rect x="625" y="50" width="4" height="4" fill="#fbbf24" opacity="0.7" />
            <rect x="635" y="70" width="4" height="4" fill="#38bdf8" opacity="0.5" />
            <rect x="625" y="90" width="4" height="4" fill="#fbbf24" opacity="0.6" />

            {/* Tower 7 windows */}
            <rect x="752" y="60" width="4" height="4" fill="#38bdf8" opacity="0.6" />
            <rect x="770" y="75" width="4" height="4" fill="#fbbf24" opacity="0.6" />
            <rect x="752" y="90" width="4" height="4" fill="#38bdf8" opacity="0.4" />

            {/* Tower 8 windows */}
            <rect x="905" y="55" width="4" height="4" fill="#fbbf24" opacity="0.7" />
            <rect x="920" y="70" width="4" height="4" fill="#38bdf8" opacity="0.5" />
            <rect x="905" y="85" width="4" height="4" fill="#fbbf24" opacity="0.6" />

            {/* Tower 9 windows */}
            <rect x="1025" y="65" width="4" height="4" fill="#38bdf8" opacity="0.6" />
            <rect x="1040" y="80" width="4" height="4" fill="#fbbf24" opacity="0.5" />

            {/* Tower 10 windows */}
            <rect x="1140" y="50" width="4" height="4" fill="#fbbf24" opacity="0.7" />
            <rect x="1152" y="70" width="4" height="4" fill="#38bdf8" opacity="0.6" />
            <rect x="1140" y="90" width="4" height="4" fill="#fbbf24" opacity="0.5" />

            {/* Tower 11 windows */}
            <rect x="1282" y="55" width="4" height="4" fill="#38bdf8" opacity="0.7" />
            <rect x="1300" y="75" width="4" height="4" fill="#fbbf24" opacity="0.5" />
            <rect x="1282" y="95" width="4" height="4" fill="#38bdf8" opacity="0.5" />

            {/* Tower 12 windows */}
            <rect x="1405" y="65" width="4" height="4" fill="#fbbf24" opacity="0.6" />
            <rect x="1420" y="85" width="4" height="4" fill="#38bdf8" opacity="0.6" />

            {/* Tower 13 windows */}
            <rect x="1552" y="50" width="4" height="4" fill="#38bdf8" opacity="0.7" />
            <rect x="1570" y="70" width="4" height="4" fill="#fbbf24" opacity="0.5" />
            <rect x="1552" y="90" width="4" height="4" fill="#fbbf24" opacity="0.6" />
          </pattern>
        </defs>

        {/* Tiled skyline rectangle covering 100% of the scroll track width */}
        <rect x="0" y="0" width="100%" height="100%" fill="url(#skyline-repeat-pattern)" />
      </svg>
    </div>
  );
};
