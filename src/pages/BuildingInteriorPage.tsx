/**
 * BuildingInteriorPage — Interior of a building with clickable profession objects in column list view.
 * Route: /gedung/:id
 * Displays interactive profession cards in a sleek column view, with checkmarks for tried professions.
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInterior, getBuildingById } from '../data/city';
import { getProfessionsByBuilding } from '../data/professions';
import { useUserState } from '../lib/context';
import type { Profession } from '../types';

function renderProfessionIcon(profId: string) {
  switch (profId) {
    case 'software-engineer':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      );
    case 'data-analyst':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="7" y1="13" x2="7" y2="10" />
          <line x1="12" y1="13" x2="12" y2="7" />
          <line x1="17" y1="13" x2="17" y2="9" />
          <line x1="1" y1="20" x2="23" y2="20" />
        </svg>
      );
    case 'akuntan':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="11" x2="10" y2="11" />
          <line x1="14" y1="11" x2="16" y2="11" />
          <line x1="8" y1="15" x2="10" y2="15" />
          <line x1="14" y1="15" x2="16" y2="15" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
      );
    case 'dokter':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 3v5a5.5 5.5 0 0 0 11 0V3" />
          <path d="M10 13.5v3.5a3 3 0 0 0 3 3h2" />
          <circle cx="19" cy="20" r="2" />
          <circle cx="4.5" cy="3" r="1.5" />
          <circle cx="15.5" cy="3" r="1.5" />
        </svg>
      );
    case 'perawat':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 14h2l1-2 2 4 1-2h2" />
        </svg>
      );
    default:
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
  }
}

function getProfessionSubtitle(prof: Profession): string {
  if (prof.id === 'software-engineer') {
    return 'Simulasi 1 hari · 1 aktivitas';
  }
  if (prof.butuhGelar) {
    return 'Jalur Gelar & Lisensi Khusus';
  }
  if (prof.hasSimulation) {
    return 'Simulasi 1 hari · 1 aktivitas';
  }
  return 'Reality Check · Informasi Karier';
}

export default function BuildingInteriorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useUserState();

  const interior = id ? getInterior(id) : undefined;
  const building = id ? getBuildingById(id) : undefined;
  const professions = id ? getProfessionsByBuilding(id) : [];

  if (!interior || !building) {
    return (
      <div className="page-enter container" style={{ paddingTop: 'var(--space-2xl)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '0.8rem', marginBottom: 'var(--space-md)' }}>Gedung tidak ditemukan</h1>
        <Link to="/" className="btn">← Kembali ke Kota</Link>
      </div>
    );
  }

  const roomTitle = interior.tema === 'hospital' ? 'Ruang Praktik & Rawat' : 'Kantor & Lab Rekayasa';
  const roomSubtitle = interior.tema === 'hospital'
    ? 'Kenali profesi kesehatan lewat simulasi interaktif.'
    : 'Kenali profesi teknologi lewat simulasi interaktif.';

  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-sm) var(--space-md)',
          borderBottom: '1px solid rgba(34, 211, 238, 0.25)',
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="btn btn--ghost"
          style={{ fontSize: '0.55rem', minHeight: '36px', padding: '4px 10px' }}
          aria-label="Kembali ke kota"
        >
          ← Kota
        </button>
        <h1 style={{ fontSize: '0.7rem', color: 'var(--color-accent-cyan)' }}>
          {interior.nama}
        </h1>
      </header>

      {/* Interior room */}
      <main
        style={{
          position: 'relative',
          flex: 1,
          background: interior.tema === 'hospital'
            ? 'radial-gradient(ellipse at center top, #1e293b 0%, #0f172a 70%, #020617 100%)'
            : 'radial-gradient(ellipse at center top, #1e1b4b 0%, #0f172a 70%, #020617 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 'var(--space-lg)',
          padding: 'var(--space-xl) var(--space-md) var(--space-2xl)',
        }}
      >
        {/* Room Header Info matching reference screenshot */}
        <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-accent-yellow, #fbbf24)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '6px',
              fontFamily: 'var(--font-body)',
            }}
          >
            AREA EKSPLORASI
          </p>
          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 8px 0',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.01em',
            }}
          >
            {roomTitle}
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary, #94a3b8)',
              fontSize: '0.875rem',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: 'var(--font-body)',
            }}
          >
            {roomSubtitle}
          </p>
        </div>

        {/* Profession objects — Column View */}
        <div className="interior-column-container" role="list">
          {professions.map((prof) => {
            const isTried = Boolean(state.simulationResults[prof.id]);

            return (
              <Link
                key={prof.id}
                to={`/profesi/${prof.id}`}
                className={`interior-card ${isTried ? 'interior-card--tried' : ''}`}
                role="listitem"
                aria-label={`${prof.bendaPemicu.nama} - Jelajahi profesi ${prof.nama}`}
              >
                {/* Eyebrow Label + Tried Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span
                    style={{
                      color: 'var(--color-accent-cyan, #22d3ee)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {prof.bendaPemicu.nama.toUpperCase()}
                  </span>
                  {isTried && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--color-accent-green, #4ade80)',
                        background: 'rgba(74, 222, 128, 0.12)',
                        border: '1px solid rgba(74, 222, 128, 0.35)',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      ✓ Dicoba
                    </span>
                  )}
                </div>

                {/* Main Content: Icon, Title & Details, Action Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                    {/* Profession Icon */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-accent-cyan, #22d3ee)',
                        flexShrink: 0,
                      }}
                    >
                      {renderProfessionIcon(prof.id)}
                    </div>

                    {/* Titles */}
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'var(--color-text-primary, #ffffff)',
                          margin: 0,
                          lineHeight: 1.3,
                          letterSpacing: '0.01em',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {prof.nama}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-secondary, #94a3b8)',
                          margin: '3px 0 0 0',
                          lineHeight: 1.4,
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {getProfessionSubtitle(prof)}
                      </p>
                    </div>
                  </div>

                  {/* Right Arrow Action */}
                  <div
                    className="interior-card-arrow"
                    style={{
                      color: 'var(--color-accent-cyan, #22d3ee)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
