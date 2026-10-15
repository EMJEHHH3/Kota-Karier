import React from 'react';

interface BuildingSpriteProps {
  id: string;
  className?: string;
}

export const BuildingSprite: React.FC<BuildingSpriteProps> = ({ id, className = '' }) => {
  switch (id) {
    // ----------------------------------------------------
    // 1. PUSAT INFORMASI (City Hall / Classical Civic Pavilion)
    // ----------------------------------------------------
    case 'pusat-informasi':
      return (
        <svg
          viewBox="0 0 160 160"
          width="160"
          height="160"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Defs for window glow & gold gradients */}
          <defs>
            <linearGradient id="pi-roof" x1="80" y1="20" x2="80" y2="55" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="pi-gold-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <filter id="pi-window-light" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Roof Spire & Flag */}
          <rect x="79" y="10" width="2" height="15" fill="#fef08a" />
          <path d="M81 11L92 15L81 19Z" fill="#fbbf24" />

          {/* Pediment (Triangular Gable Roof) */}
          <path d="M80 24L15 52H145L80 24Z" fill="url(#pi-roof)" stroke="#fef08a" strokeWidth="2" />
          <path d="M80 30L26 50H134L80 30Z" fill="#78350f" />

          {/* Pediment Info Medallion (glowing "i") */}
          <circle cx="80" cy="42" r="7" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="79" y="38" width="2" height="2" fill="#451a03" />
          <rect x="79" y="41" width="2" height="5" fill="#451a03" />

          {/* Architrave / Entablature beam */}
          <rect x="18" y="52" width="124" height="8" fill="#d97706" stroke="#fef08a" strokeWidth="1" />
          <rect x="22" y="54" width="116" height="4" fill="#92400e" />

          {/* Main Building Body */}
          <rect x="22" y="60" width="116" height="96" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
          {/* Back wall paneling */}
          <rect x="26" y="62" width="108" height="92" fill="#18182b" />

          {/* Classical Columns (Pillars) */}
          {/* Column 1 */}
          <rect x="26" y="60" width="10" height="94" fill="#d97706" />
          <rect x="28" y="60" width="3" height="94" fill="#fef08a" />
          <rect x="24" y="58" width="14" height="4" fill="#fde047" />
          <rect x="24" y="150" width="14" height="6" fill="#b45309" />

          {/* Column 2 */}
          <rect x="58" y="60" width="10" height="94" fill="#d97706" />
          <rect x="60" y="60" width="3" height="94" fill="#fef08a" />
          <rect x="56" y="58" width="14" height="4" fill="#fde047" />
          <rect x="56" y="150" width="14" height="6" fill="#b45309" />

          {/* Column 3 */}
          <rect x="92" y="60" width="10" height="94" fill="#d97706" />
          <rect x="94" y="60" width="3" height="94" fill="#fef08a" />
          <rect x="90" y="58" width="14" height="4" fill="#fde047" />
          <rect x="90" y="150" width="14" height="6" fill="#b45309" />

          {/* Column 4 */}
          <rect x="124" y="60" width="10" height="94" fill="#d97706" />
          <rect x="126" y="60" width="3" height="94" fill="#fef08a" />
          <rect x="122" y="58" width="14" height="4" fill="#fde047" />
          <rect x="122" y="150" width="14" height="6" fill="#b45309" />

          {/* Glowing Windows (Upper Floor) */}
          {/* Left upper window */}
          <rect x="40" y="68" width="14" height="20" rx="3" fill="url(#pi-gold-glow)" filter="url(#pi-window-light)" />
          <rect x="40" y="68" width="14" height="20" rx="3" stroke="#b45309" strokeWidth="1" />
          <line x1="47" y1="68" x2="47" y2="88" stroke="#78350f" strokeWidth="1" />
          <line x1="40" y1="78" x2="54" y2="78" stroke="#78350f" strokeWidth="1" />

          {/* Right upper window */}
          <rect x="106" y="68" width="14" height="20" rx="3" fill="url(#pi-gold-glow)" filter="url(#pi-window-light)" />
          <rect x="106" y="68" width="14" height="20" rx="3" stroke="#b45309" strokeWidth="1" />
          <line x1="113" y1="68" x2="113" y2="88" stroke="#78350f" strokeWidth="1" />
          <line x1="106" y1="78" x2="120" y2="78" stroke="#78350f" strokeWidth="1" />

          {/* Center Grand Arch & Entrance */}
          <path d="M70 94C70 88 74 84 80 84C86 84 90 88 90 94V154H70V94Z" fill="#fde047" filter="url(#pi-window-light)" />
          <path d="M72 96C72 91 75 87 80 87C85 87 88 91 88 96V154H72V96Z" fill="#b45309" />
          {/* Wooden door leaves */}
          <rect x="73" y="100" width="6" height="54" fill="#451a03" />
          <rect x="81" y="100" width="6" height="54" fill="#78350f" />
          {/* Brass Door knobs */}
          <circle cx="78" cy="128" r="1.5" fill="#fef08a" />
          <circle cx="82" cy="128" r="1.5" fill="#fef08a" />

          {/* Hanging Lanterns by the Columns */}
          <circle cx="47" cy="108" r="4" fill="#fbbf24" filter="url(#pi-window-light)" />
          <circle cx="47" cy="108" r="2" fill="#fff" />
          <line x1="47" y1="102" x2="47" y2="106" stroke="#92400e" strokeWidth="1.5" />

          <circle cx="113" cy="108" r="4" fill="#fbbf24" filter="url(#pi-window-light)" />
          <circle cx="113" cy="108" r="2" fill="#fff" />
          <line x1="113" y1="102" x2="113" y2="106" stroke="#92400e" strokeWidth="1.5" />

          {/* Lower steps / Foundation Base */}
          <rect x="14" y="152" width="132" height="4" fill="#92400e" />
          <rect x="10" y="156" width="140" height="4" fill="#78350f" />
        </svg>
      );

    // ----------------------------------------------------
    // 2. RUMAH SAKIT (Modern Hospital with Glowing Cross)
    // ----------------------------------------------------
    case 'rumah-sakit':
      return (
        <svg
          viewBox="0 0 160 170"
          width="155"
          height="165"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="rs-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="rs-window-cyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="rs-glow-cross" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="rs-window-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Rooftop Helipad Tower & Medical Cross */}
          <rect x="62" y="12" width="36" height="20" fill="#0f172a" stroke="#22d3ee" strokeWidth="1" />
          {/* Glowing Red & White Cross */}
          <g filter="url(#rs-glow-cross)">
            <circle cx="80" cy="22" r="10" fill="#dc2626" />
            {/* White Cross */}
            <rect x="78" y="16" width="4" height="12" fill="#ffffff" />
            <rect x="74" y="20" width="12" height="4" fill="#ffffff" />
          </g>

          {/* Rooftop Antenna / Beacon */}
          <line x1="35" y1="20" x2="35" y2="32" stroke="#64748b" strokeWidth="2" />
          <circle cx="35" cy="18" r="2" fill="#ef4444" />
          <line x1="125" y1="24" x2="125" y2="32" stroke="#64748b" strokeWidth="2" />
          <circle cx="125" cy="22" r="2" fill="#22d3ee" />

          {/* Helipad Platform Bar */}
          <rect x="52" y="32" width="56" height="4" fill="#0284c7" />

          {/* Main Hospital Building Structure */}
          {/* Main Tower (Left & Center) */}
          <rect x="18" y="36" width="124" height="130" fill="url(#rs-body)" stroke="#475569" strokeWidth="1.5" />

          {/* Top Floor Trim with Cyan Accent */}
          <rect x="18" y="36" width="124" height="6" fill="#0891b2" />
          <rect x="18" y="42" width="124" height="2" fill="#22d3ee" />

          {/* Hospital Wing Dividing Strip */}
          <rect x="78" y="44" width="4" height="122" fill="#0f172a" />

          {/* Floors 4, 3, 2 Window Grid (with glowing cyan / warm medical light) */}
          {/* Floor 4 */}
          <g filter="url(#rs-window-glow)">
            <rect x="26" y="50" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="44" y="50" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="62" y="50" width="12" height="12" rx="1" fill="#fef08a" /> {/* Lab light on */}
            <rect x="86" y="50" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="104" y="50" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="122" y="50" width="12" height="12" rx="1" fill="#0e7490" />
          </g>

          {/* Floor 3 */}
          <g filter="url(#rs-window-glow)">
            <rect x="26" y="72" width="12" height="12" rx="1" fill="#0e7490" />
            <rect x="44" y="72" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="62" y="72" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="86" y="72" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="104" y="72" width="12" height="12" rx="1" fill="#fef08a" />
            <rect x="122" y="72" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
          </g>

          {/* Floor 2 */}
          <g filter="url(#rs-window-glow)">
            <rect x="26" y="94" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="44" y="94" width="12" height="12" rx="1" fill="#0e7490" />
            <rect x="62" y="94" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="86" y="94" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="104" y="94" width="12" height="12" rx="1" fill="url(#rs-window-cyan)" />
            <rect x="122" y="94" width="12" height="12" rx="1" fill="#fef08a" />
          </g>

          {/* Floor 1 / Ground Floor Entrance */}
          {/* Left Wing Windows */}
          <rect x="26" y="118" width="18" height="16" rx="1" fill="url(#rs-window-cyan)" filter="url(#rs-window-glow)" />
          <rect x="116" y="118" width="18" height="16" rx="1" fill="url(#rs-window-cyan)" filter="url(#rs-window-glow)" />

          {/* Emergency / UGD Canopy */}
          <rect x="52" y="114" width="56" height="8" rx="2" fill="#ef4444" />
          <rect x="54" y="116" width="52" height="4" fill="#b91c1c" />
          {/* UGD Sign */}
          <text x="80" y="120" fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">UGD</text>

          {/* Double Automatic Sliding Doors with Glowing Cyan Backlight */}
          <rect x="56" y="122" width="48" height="44" fill="#0891b2" filter="url(#rs-window-glow)" />
          <rect x="58" y="124" width="21" height="42" fill="#0e7490" stroke="#a5f3fc" strokeWidth="1" />
          <rect x="81" y="124" width="21" height="42" fill="#0e7490" stroke="#a5f3fc" strokeWidth="1" />
          {/* Door handles */}
          <line x1="77" y1="140" x2="77" y2="152" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="83" y1="140" x2="83" y2="152" stroke="#ffffff" strokeWidth="1.5" />

          {/* Concrete Base */}
          <rect x="14" y="166" width="132" height="4" fill="#0f172a" />
        </svg>
      );

    // ----------------------------------------------------
    // 3. KANTOR TEKNOLOGI (Cyberpunk High-Tech Tower)
    // ----------------------------------------------------
    case 'kantor-teknologi':
      return (
        <svg
          viewBox="0 0 150 185"
          width="145"
          height="180"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="tech-sky-tower" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="tech-neon-cyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="tech-neon-purple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <filter id="tech-beacon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="tech-window-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Rooftop Antenna Spire & Blinking Beacon */}
          <line x1="75" y1="4" x2="75" y2="28" stroke="#38bdf8" strokeWidth="2" />
          <line x1="68" y1="18" x2="82" y2="18" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="75" cy="4" r="3" fill="#ef4444" filter="url(#tech-beacon-glow)" />

          {/* Rooftop Satellite Dish & HVAC Server Units */}
          <path d="M42 22C42 16 52 14 56 18L50 25Z" fill="#64748b" />
          <rect x="94" y="20" width="16" height="8" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />

          {/* Rooftop Crest / Angled Top Architecture */}
          <polygon points="75,18 24,32 126,32" fill="#0284c7" />
          <polygon points="75,22 28,32 122,32" fill="#0369a1" />

          {/* Main Tower Structure */}
          <rect x="24" y="32" width="102" height="148" fill="url(#tech-sky-tower)" stroke="#0ea5e9" strokeWidth="1.5" />

          {/* Digital Logo Banner near top */}
          <rect x="34" y="36" width="82" height="10" rx="1" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
          <g filter="url(#tech-beacon-glow)">
            <text x="75" y="44" fill="#38bdf8" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TECH // HQ</text>
          </g>

          {/* Multi-story Window Grid with Neon Cyan and Purple Glow */}
          {/* Level 6 */}
          <g filter="url(#tech-window-glow)">
            <rect x="32" y="52" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="48" y="52" width="12" height="10" rx="1" fill="url(#tech-neon-purple)" />
            <rect x="64" y="52" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="80" y="52" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="96" y="52" width="12" height="10" rx="1" fill="url(#tech-neon-purple)" />
          </g>

          {/* Level 5 */}
          <g filter="url(#tech-window-glow)">
            <rect x="32" y="68" width="12" height="10" rx="1" fill="url(#tech-neon-purple)" />
            <rect x="48" y="68" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="64" y="68" width="12" height="10" rx="1" fill="#0369a1" />
            <rect x="80" y="68" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="96" y="68" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
          </g>

          {/* Level 4 */}
          <g filter="url(#tech-window-glow)">
            <rect x="32" y="84" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="48" y="84" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="64" y="84" width="12" height="10" rx="1" fill="url(#tech-neon-purple)" />
            <rect x="80" y="84" width="12" height="10" rx="1" fill="#0369a1" />
            <rect x="96" y="84" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
          </g>

          {/* Level 3 */}
          <g filter="url(#tech-window-glow)">
            <rect x="32" y="100" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="48" y="100" width="12" height="10" rx="1" fill="url(#tech-neon-purple)" />
            <rect x="64" y="100" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="80" y="100" width="12" height="10" rx="1" fill="url(#tech-neon-cyan)" />
            <rect x="96" y="100" width="12" height="10" rx="1" fill="url(#tech-neon-purple)" />
          </g>

          {/* Level 2 (Server Room - glowing LED array) */}
          <rect x="30" y="116" width="90" height="14" fill="#020617" stroke="#22d3ee" strokeWidth="1" />
          <g filter="url(#tech-window-glow)">
            <circle cx="38" cy="123" r="2" fill="#4ade80" />
            <circle cx="46" cy="123" r="2" fill="#22d3ee" />
            <circle cx="54" cy="123" r="2" fill="#22d3ee" />
            <circle cx="62" cy="123" r="2" fill="#a855f7" />
            <circle cx="70" cy="123" r="2" fill="#4ade80" />
            <circle cx="78" cy="123" r="2" fill="#22d3ee" />
            <circle cx="86" cy="123" r="2" fill="#22d3ee" />
            <circle cx="94" cy="123" r="2" fill="#4ade80" />
            <circle cx="102" cy="123" r="2" fill="#a855f7" />
            <circle cx="110" cy="123" r="2" fill="#22d3ee" />
          </g>

          {/* Ground Floor Cyber Entrance Canopy */}
          <rect x="22" y="136" width="106" height="6" fill="#0891b2" />
          <rect x="24" y="138" width="102" height="2" fill="#38bdf8" />

          {/* High-Tech Glass Lobby Entrance */}
          <rect x="44" y="142" width="62" height="38" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
          <g filter="url(#tech-window-glow)">
            <rect x="52" y="146" width="21" height="34" fill="#0369a1" stroke="#bae6fd" strokeWidth="1" />
            <rect x="77" y="146" width="21" height="34" fill="#0369a1" stroke="#bae6fd" strokeWidth="1" />
            {/* Neon turnstile light inside */}
            <line x1="56" y1="162" x2="68" y2="162" stroke="#38bdf8" strokeWidth="2" />
            <line x1="82" y1="162" x2="94" y2="162" stroke="#38bdf8" strokeWidth="2" />
          </g>

          {/* Foundation base */}
          <rect x="20" y="180" width="110" height="5" fill="#0369a1" />
        </svg>
      );

    // ----------------------------------------------------
    // 4. BANK (Locked / Coming soon)
    // ----------------------------------------------------
    case 'bank':
      return (
        <svg
          viewBox="0 0 140 145"
          width="130"
          height="140"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Bank Pediment & Gold Coin Crest */}
          <polygon points="70,14 14,42 126,42" fill="#334155" stroke="#64748b" strokeWidth="2" />
          <circle cx="70" cy="32" r="7" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          <text x="70" y="35" fill="#713f12" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">$</text>

          {/* Architrave */}
          <rect x="18" y="42" width="104" height="6" fill="#475569" />

          {/* Pillars & Body */}
          <rect x="22" y="48" width="96" height="92" fill="#1e293b" />
          {/* Columns */}
          <rect x="26" y="48" width="10" height="90" fill="#64748b" />
          <rect x="52" y="48" width="10" height="90" fill="#64748b" />
          <rect x="78" y="48" width="10" height="90" fill="#64748b" />
          <rect x="104" y="48" width="10" height="90" fill="#64748b" />

          {/* High Security Vault Doors */}
          <rect x="66" y="90" width="28" height="48" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="80" cy="114" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="80" cy="114" r="3" fill="#cbd5e1" />

          {/* Steps */}
          <rect x="12" y="138" width="116" height="4" fill="#475569" />
          <rect x="8" y="142" width="124" height="3" fill="#334155" />
        </svg>
      );

    // ----------------------------------------------------
    // 5. SEKOLAH (School / Academy - Locked)
    // ----------------------------------------------------
    case 'sekolah':
      return (
        <svg
          viewBox="0 0 150 150"
          width="135"
          height="145"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Clock Tower Spire */}
          <polygon points="75,8 63,30 87,30" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
          <rect x="65" y="30" width="20" height="24" fill="#334155" stroke="#475569" strokeWidth="1" />
          {/* Tower Clock */}
          <circle cx="75" cy="42" r="6" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
          <line x1="75" y1="42" x2="75" y2="39" stroke="#78350f" strokeWidth="1" />
          <line x1="75" y1="42" x2="78" y2="42" stroke="#78350f" strokeWidth="1" />

          {/* Main Sloped Roof */}
          <polygon points="15,54 75,34 135,54" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.5" />

          {/* Building Facade */}
          <rect x="20" y="54" width="110" height="90" fill="#1e293b" stroke="#334155" strokeWidth="1" />

          {/* Windows Rows */}
          {/* Row 1 */}
          <rect x="28" y="62" width="12" height="14" fill="#475569" />
          <rect x="46" y="62" width="12" height="14" fill="#475569" />
          <rect x="69" y="62" width="12" height="14" fill="#475569" />
          <rect x="92" y="62" width="12" height="14" fill="#475569" />
          <rect x="110" y="62" width="12" height="14" fill="#475569" />

          {/* Row 2 */}
          <rect x="28" y="86" width="12" height="14" fill="#475569" />
          <rect x="46" y="86" width="12" height="14" fill="#475569" />
          <rect x="92" y="86" width="12" height="14" fill="#475569" />
          <rect x="110" y="86" width="12" height="14" fill="#475569" />

          {/* Double Entrance Arch */}
          <path d="M64 144V102C64 96 69 92 75 92C81 92 86 96 86 102V144H64Z" fill="#0f172a" stroke="#475569" strokeWidth="1" />

          {/* Base */}
          <rect x="16" y="144" width="118" height="6" fill="#334155" />
        </svg>
      );

    // ----------------------------------------------------
    // 6. STUDIO KREATIF (Creative Loft - Locked)
    // ----------------------------------------------------
    case 'studio-kreatif':
      return (
        <svg
          viewBox="0 0 140 155"
          width="130"
          height="150"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Sawtooth Industrial Loft Roof with Skylights */}
          <polygon points="15,44 48,22 48,44" fill="#475569" />
          <polygon points="48,44 82,22 82,44" fill="#475569" />
          <polygon points="82,44 116,22 116,44" fill="#475569" />

          {/* Neon Palette / Brush Signage */}
          <circle cx="68" cy="16" r="8" fill="#a855f7" />
          <circle cx="65" cy="14" r="2" fill="#38bdf8" />
          <circle cx="71" cy="14" r="2" fill="#facc15" />
          <circle cx="68" cy="18" r="2" fill="#f43f5e" />

          {/* Main Loft Walls */}
          <rect x="18" y="44" width="104" height="106" fill="#1e1b4b" stroke="#3730a3" strokeWidth="1.5" />

          {/* Floor 2 Big Multi-pane Artist Window */}
          <rect x="28" y="54" width="84" height="34" rx="2" fill="#312e81" stroke="#6366f1" strokeWidth="1" />
          <line x1="49" y1="54" x2="49" y2="88" stroke="#4338ca" strokeWidth="1" />
          <line x1="70" y1="54" x2="70" y2="88" stroke="#4338ca" strokeWidth="1" />
          <line x1="91" y1="54" x2="91" y2="88" stroke="#4338ca" strokeWidth="1" />
          <line x1="28" y1="71" x2="112" y2="71" stroke="#4338ca" strokeWidth="1" />

          {/* Ground Floor Colorful Garage / Studio Doors */}
          <rect x="36" y="100" width="68" height="50" fill="#0f172a" stroke="#818cf8" strokeWidth="1" />
          <rect x="42" y="106" width="26" height="44" fill="#1e1b4b" />
          <rect x="72" y="106" width="26" height="44" fill="#1e1b4b" />

          {/* Base */}
          <rect x="14" y="150" width="112" height="5" fill="#312e81" />
        </svg>
      );

    // ----------------------------------------------------
    // 7. PASAR / UMKM (Market / Bazaar - Locked)
    // ----------------------------------------------------
    case 'pasar-umkm':
      return (
        <svg
          viewBox="0 0 145 135"
          width="135"
          height="135"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Marketplace Roof / Signboard */}
          <rect x="25" y="24" width="95" height="16" rx="2" fill="#78350f" stroke="#b45309" strokeWidth="1" />
          <text x="72" y="34" fill="#fef08a" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">PASAR KOTA</text>

          {/* Striped Canopy Awning */}
          <path d="M12 40L18 58H127L133 40H12Z" fill="#b91c1c" />
          {/* Stripes */}
          <polygon points="26,40 30,58 38,58 34,40" fill="#f8fafc" />
          <polygon points="46,40 50,58 58,58 54,40" fill="#f8fafc" />
          <polygon points="66,40 70,58 78,58 74,40" fill="#f8fafc" />
          <polygon points="86,40 90,58 98,58 94,40" fill="#f8fafc" />
          <polygon points="106,40 110,58 118,58 114,40" fill="#f8fafc" />

          {/* Market Shopfront Structure */}
          <rect x="20" y="58" width="105" height="72" fill="#1e293b" stroke="#334155" strokeWidth="1" />

          {/* Stalls & Crates Display */}
          <rect x="28" y="70" width="28" height="24" fill="#475569" />
          <rect x="62" y="70" width="28" height="24" fill="#475569" />
          <rect x="96" y="70" width="22" height="24" fill="#475569" />

          {/* Wooden Counter Table */}
          <rect x="24" y="96" width="97" height="34" fill="#78350f" stroke="#92400e" strokeWidth="1" />
          <rect x="30" y="104" width="20" height="20" fill="#451a03" />
          <rect x="58" y="104" width="20" height="20" fill="#451a03" />
          <rect x="86" y="104" width="20" height="20" fill="#451a03" />

          {/* Base */}
          <rect x="16" y="130" width="113" height="5" fill="#334155" />
        </svg>
      );

    // ----------------------------------------------------
    // 8. BENGKEL (Garage / Workshop - Locked)
    // ----------------------------------------------------
    case 'bengkel':
    default:
      return (
        <svg
          viewBox="0 0 140 135"
          width="130"
          height="135"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Industrial Corrugated Roof with Vent */}
          <rect x="62" y="16" width="16" height="8" fill="#475569" />
          <polygon points="10,38 70,22 130,38" fill="#334155" stroke="#475569" strokeWidth="1.5" />

          {/* Wrench & Gear Insignia */}
          <circle cx="70" cy="46" r="6" fill="#ea580c" />
          <rect x="68" y="42" width="4" height="8" fill="#fed7aa" />

          {/* Industrial Workshop Walls */}
          <rect x="16" y="38" width="108" height="92" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

          {/* Caution Stripe Banner */}
          <rect x="18" y="54" width="104" height="6" fill="#facc15" />
          <polygon points="26,54 22,60 26,60 30,54" fill="#000" />
          <polygon points="38,54 34,60 38,60 42,54" fill="#000" />
          <polygon points="50,54 46,60 50,60 54,54" fill="#000" />
          <polygon points="62,54 58,60 62,60 66,54" fill="#000" />
          <polygon points="74,54 70,60 74,60 78,54" fill="#000" />
          <polygon points="86,54 82,60 86,60 90,54" fill="#000" />
          <polygon points="98,54 94,60 98,60 102,54" fill="#000" />
          <polygon points="110,54 106,60 110,60 114,54" fill="#000" />

          {/* Giant Rolling Shutter Doors (Corrugated) */}
          <rect x="28" y="66" width="84" height="64" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <line x1="28" y1="74" x2="112" y2="74" stroke="#334155" strokeWidth="1.5" />
          <line x1="28" y1="82" x2="112" y2="82" stroke="#334155" strokeWidth="1.5" />
          <line x1="28" y1="90" x2="112" y2="90" stroke="#334155" strokeWidth="1.5" />
          <line x1="28" y1="98" x2="112" y2="98" stroke="#334155" strokeWidth="1.5" />
          <line x1="28" y1="106" x2="112" y2="106" stroke="#334155" strokeWidth="1.5" />
          <line x1="28" y1="114" x2="112" y2="114" stroke="#334155" strokeWidth="1.5" />
          <line x1="28" y1="122" x2="112" y2="122" stroke="#334155" strokeWidth="1.5" />

          {/* Base */}
          <rect x="12" y="130" width="116" height="5" fill="#334155" />
        </svg>
      );
  }
};
