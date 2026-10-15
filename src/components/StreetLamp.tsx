import React from 'react';

interface StreetLampProps {
  className?: string;
  isDesktopOnly?: boolean;
}

export const StreetLamp: React.FC<StreetLampProps> = ({ className = '', isDesktopOnly = false }) => {
  return (
    <div
      className={`street-lamp-item ${isDesktopOnly ? 'street-lamp--desktop-only' : ''} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        userSelect: 'none',
        flexShrink: 0,
        width: '32px',
        height: '130px',
        position: 'relative',
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      {/* Downward light cone onto street */}
      <div
        className="lamp-light-cone"
        style={{
          position: 'absolute',
          bottom: '-15px',
          width: '60px',
          height: '95px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.28) 0%, rgba(245, 158, 11, 0.08) 55%, transparent 80%)',
          clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* SVG Pixel Street Lamp */}
      <svg
        viewBox="0 0 32 110"
        width="32"
        height="110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <filter id="lamp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Decorative Top Finial */}
        <rect x="15" y="8" width="2" height="4" fill="#64748b" />
        <circle cx="16" cy="7" r="1.5" fill="#facc15" />

        {/* Lantern Cap */}
        <polygon points="16,12 8,16 24,16" fill="#334155" stroke="#475569" strokeWidth="1" />

        {/* Glowing Lantern Core */}
        <g filter="url(#lamp-glow)" className="lamp-lantern-glow">
          {/* Warm Amber Lantern Glass */}
          <rect x="10" y="16" width="12" height="12" rx="1" fill="#fbbf24" opacity="0.95" />
          {/* Intense Bright Center */}
          <rect x="12" y="18" width="8" height="8" rx="1" fill="#fef08a" />
          <circle cx="16" cy="22" r="2" fill="#ffffff" />
        </g>

        {/* Lantern Frame Grid */}
        <rect x="10" y="16" width="12" height="12" rx="1" stroke="#1e293b" strokeWidth="1" />
        <line x1="16" y1="16" x2="16" y2="28" stroke="#1e293b" strokeWidth="1" />
        <line x1="10" y1="22" x2="22" y2="22" stroke="#1e293b" strokeWidth="1" />

        {/* Lantern Bottom Cap */}
        <polygon points="10,28 22,28 17,32 15,32" fill="#334155" />

        {/* Curved Lamp Bracket */}
        <path d="M16 32V38C16 38 12 36 10 38" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 32V38C16 38 20 36 22 38" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

        {/* Main Post (Pole) */}
        <rect x="15" y="36" width="2" height="66" fill="#64748b" />
        <rect x="15.5" y="36" width="1" height="66" fill="#94a3b8" />

        {/* Post Joints/Rings */}
        <rect x="13" y="52" width="6" height="2" rx="0.5" fill="#334155" />
        <rect x="13" y="74" width="6" height="2" rx="0.5" fill="#334155" />

        {/* Base Pedestal */}
        <polygon points="12,102 20,102 22,108 10,108" fill="#334155" stroke="#475569" strokeWidth="1" />
        <rect x="8" y="108" width="16" height="2" fill="#1e293b" />
      </svg>
    </div>
  );
};
