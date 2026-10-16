/**
 * HomePage — The pixel-art city map.
 * Horizontally scrollable with parallax layers and clickable building hotspots.
 * Supports highlighting buildings based on RIASEC test results.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BUILDINGS } from '../data/city';
import { useUserState } from '../lib/context';
import { BuildingSprite } from '../components/BuildingSprite';
import { StreetLamp } from '../components/StreetLamp';
import { NightSky } from '../components/NightSky';
import { CitySkyline } from '../components/CitySkyline';
import { NavbarAuth } from '../components/NavbarAuth';
import { GuestSyncBanner } from '../components/GuestSyncBanner';

export default function HomePage() {
  const { state } = useUserState();
  const testCompleted = Boolean(state.testResult);
  const topRiasec = state.testResult?.topTypes || [];
  const navHeight = testCompleted ? '86px' : '52px';
  const [scrollX, setScrollX] = React.useState<number>(0);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrollX(e.currentTarget.scrollLeft);
  };

  // Sort buildings from data (urutan 1..8)
  const sortedBuildings = [...BUILDINGS].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));

  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Langsung ke konten utama
      </a>

      {/* Navigation bar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-sm) var(--space-md)',
          borderBottom: '2px solid var(--color-border-cyan)',
          background: 'var(--color-bg-panel)',
          zIndex: 10,
        }}
      >
        <span className="pixel-text" style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)' }}>
          🏙️ Kota Karier
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
          <Link to="/hasil" className="btn btn--ghost" style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}>
            Hasilku
          </Link>
          <Link to="/kandidat" className="btn btn--ghost" style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}>
            Kandidat {state.candidates.length > 0 ? `(${state.candidates.length})` : ''}
          </Link>
          <NavbarAuth />
          <Link to="/pengaturan" className="btn btn--ghost" style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }} aria-label="Pengaturan">
            ⚙️
          </Link>
        </div>
      </nav>

      {/* Guest sync prompt banner */}
      <GuestSyncBanner />

      {/* Notification banner if test completed */}
      {testCompleted && (
        <div
          style={{
            background: 'rgba(34, 211, 238, 0.12)',
            borderBottom: '1px solid var(--color-border-cyan)',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
          }}
        >
          <span style={{ color: 'var(--color-accent-cyan)' }}>
            ✨ Kecenderunganmu: <strong>{topRiasec.join(', ')}</strong>. Gedung yang bersinar mungkin cocok untukmu!
          </span>
          <Link to="/hasil" style={{ color: 'var(--color-accent-yellow)', textDecoration: 'underline', fontSize: '0.65rem', marginLeft: '8px' }}>
            Lihat Analisis →
          </Link>
        </div>
      )}

      {/* City viewport */}
      <main
        id="main-content"
        onScroll={handleScroll}
        style={{
          position: 'relative',
          overflowX: 'auto',
          overflowY: 'hidden',
          flex: 1,
          height: `calc(100dvh - ${navHeight})`,
          minHeight: `calc(100vh - ${navHeight})`,
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Animated Night Sky (Moon, Twinkling Stars, Drifting Clouds) - FIXED FULLSCREEN WITH PARALLAX */}
        <NightSky scrollX={scrollX} />

        {/* Centered Neon Welcome Banner: Pinned to viewport center horizontally */}
        <header
          className="sky-welcome-header"
          style={{
            position: 'sticky',
            left: 0,
            width: '100vw',
            maxWidth: '100%',
            alignSelf: 'flex-start',
            zIndex: 10,
            textAlign: 'center',
            padding: '24px 20px 12px 20px',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <h1
            className="welcome-title pixel-text"
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-accent-cyan)',
              letterSpacing: '1px',
              margin: 0,
              textShadow: '0 0 10px rgba(34, 211, 238, 0.7), 0 0 20px rgba(34, 211, 238, 0.35)',
            }}
          >
            Selamat datang di Kota Karier
          </h1>
          <p
            className="welcome-subtitle"
            style={{
              fontSize: '0.82rem',
              color: '#cbd5e1',
              margin: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.95)',
              fontWeight: 500,
            }}
          >
            Pilih sebuah gedung untuk mulai menjelajahi kariermu
          </p>
        </header>

        {/* Scrollable City Canvas Track */}
        <div
          className="city-canvas"
          style={{
            position: 'relative',
            minWidth: 'max-content',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            flex: 1,
            zIndex: 2,
          }}
        >
          {/* City Ground Scene: pinned to the bottom */}
          <div
            className="city-ground-scene"
            style={{
              position: 'relative',
              marginTop: 'auto',
              width: '100%',
              minWidth: 'max-content',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            {/* Skyline Silhouette in background (rests on street behind buildings) */}
            <CitySkyline />

            {/* Building Hotspots & Street Lamps Row */}
            <div
              className="buildings-track"
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '24px',
                padding: '0 48px',
                marginBottom: 0,
              }}
            >
              {sortedBuildings.map((building, index) => {
                const isActive = building.status === 'active';
                const isRecommended =
                  testCompleted &&
                  building.riasec.some((r) => topRiasec.includes(r));
                const isEvenLamp = index % 2 === 1;

                if (building.id === 'pusat-informasi') {
                  return (
                    <React.Fragment key={building.id}>
                      {/* 1. Pusat Informasi (Special Gold/Yellow Theme) */}
                      <Link
                        to="/tes-minat"
                        className="building-hotspot"
                        aria-label={building.ariaLabel}
                      >
                        {/* Info above building */}
                        <div className="building-header">
                          <span className="building-title building-title--gold">
                            {building.nama}
                          </span>
                          <span className="building-desc">
                            {testCompleted ? 'Tes Sudah Diisi' : 'Bingung mau mulai?'}
                          </span>
                          <span className="building-action building-action--gold">
                            {testCompleted ? '🔄 Ulangi Tes' : '⚡ Mulai Tes →'}
                          </span>
                        </div>

                        {/* Pixel-art building graphic */}
                        <div className="building-sprite-wrapper">
                          <BuildingSprite
                            id={building.id}
                            className="building-sprite building-sprite--gold"
                          />
                        </div>
                      </Link>

                      {/* Street lamp in the gap after Pusat Informasi */}
                      <StreetLamp isDesktopOnly={isEvenLamp} />
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={building.id}>
                    {isActive ? (
                      <Link
                        to={`/gedung/${building.id}`}
                        className="building-hotspot"
                        aria-label={building.ariaLabel}
                      >
                        {/* Info above building */}
                        <div className="building-header">
                          {isRecommended && (
                            <span className="building-badge-rec">
                              ✨ Rekomendasi
                            </span>
                          )}
                          <span className="building-title building-title--cyan">
                            {building.nama}
                          </span>
                          <span className="building-desc">
                            {building.deskripsi}
                          </span>
                          <span className="building-action building-action--cyan">
                            Masuk Gedung →
                          </span>
                        </div>

                        {/* Pixel-art building graphic */}
                        <div className="building-sprite-wrapper">
                          <BuildingSprite
                            id={building.id}
                            className={`building-sprite ${
                              isRecommended
                                ? 'building-sprite--recommended'
                                : 'building-sprite--cyan'
                            }`}
                          />
                        </div>
                      </Link>
                    ) : (
                      <div
                        className="building-hotspot building-hotspot--locked"
                        aria-label={building.ariaLabel}
                        role="img"
                      >
                        {/* Info above building */}
                        <div className="building-header">
                          <span className="building-title building-title--locked">
                            {building.nama}
                          </span>
                          <span className="building-desc">
                            {building.deskripsi}
                          </span>
                          <span className="building-action building-action--locked">
                            🔒 Segera Dibuka
                          </span>
                        </div>

                        {/* Pixel-art building graphic */}
                        <div className="building-sprite-wrapper">
                          <BuildingSprite
                            id={building.id}
                            className="building-sprite building-sprite--locked"
                          />
                        </div>
                      </div>
                    )}

                    {/* Street lamp in the gap after each building */}
                    <StreetLamp isDesktopOnly={isEvenLamp} />
                  </React.Fragment>
                );
              })}
            </div>

            {/* Ground / Street (Bottom-most element, zero gap beneath it) */}
            <div
              className="city-street"
              style={{
                position: 'relative',
                zIndex: 2,
                height: '76px',
                width: '100%',
                background: 'linear-gradient(180deg, #18182b 0%, #0d0d17 100%)',
                borderTop: '4px solid #3b4252',
                boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Sidewalk curb strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '10px',
                  background: 'linear-gradient(180deg, #2e3440 0%, #1e232e 100%)',
                  borderBottom: '1px solid #1a1e27',
                }}
              />

              {/* Road center markings */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundImage:
                    'repeating-linear-gradient(90deg, var(--color-accent-yellow) 0, var(--color-accent-yellow) 28px, transparent 28px, transparent 56px)',
                  opacity: 0.45,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
