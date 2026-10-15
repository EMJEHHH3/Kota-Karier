/**
 * BuildingInteriorPage — Interior of a building with clickable profession objects.
 * Route: /gedung/:id
 * Displays 2-4 interactive objects representing professions, with checkmarks for tried professions.
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInterior, getBuildingById } from '../data/city';
import { getProfessionsByBuilding } from '../data/professions';
import { useUserState } from '../lib/context';

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

  return (
    <div className="page-enter" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-sm) var(--space-md)',
          borderBottom: '2px solid var(--color-border-cyan)',
          background: 'var(--color-bg-panel)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="btn btn--ghost"
          style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}
          aria-label="Kembali ke kota"
        >
          ← Kota
        </button>
        <h1 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)' }}>
          {interior.nama}
        </h1>
      </header>

      {/* Interior room */}
      <main
        style={{
          position: 'relative',
          flex: 1,
          background: interior.tema === 'hospital'
            ? 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 70%, #020617 100%)'
            : 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f172a 70%, #020617 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-lg)',
          padding: 'var(--space-md)',
        }}
      >
        {/* Room Header Info */}
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <p className="pixel-text" style={{ fontSize: '0.55rem', color: 'var(--color-accent-yellow)', marginBottom: '4px' }}>
            {interior.tema === 'hospital' ? '🏥 Ruang Praktik & Rawat' : '🏢 Kantor & Lab Rekayasa'}
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
            Sentuh benda pemicu di bawah untuk mencoba simulasi atau melihat Reality Check profesi tersebut.
          </p>
        </div>

        {/* Profession objects */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: professions.length > 2 ? 'repeat(2, 1fr)' : `repeat(${professions.length}, 1fr)`,
            gap: 'var(--space-md)',
            width: '100%',
            maxWidth: '440px',
          }}
        >
          {professions.map((prof) => {
            const isTried = Boolean(state.simulationResults[prof.id]);

            return (
              <Link
                key={prof.id}
                to={`/profesi/${prof.id}`}
                className="panel panel--hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  padding: 'var(--space-md)',
                  textDecoration: 'none',
                  minHeight: '170px',
                  justifyContent: 'center',
                  position: 'relative',
                  borderColor: isTried ? 'var(--color-accent-green)' : 'var(--color-border-cyan)',
                }}
                aria-label={`${prof.bendaPemicu.label} - Jelajahi profesi ${prof.nama}`}
              >
                {/* Tried checkmark badge */}
                {isTried && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '0.65rem',
                      background: 'rgba(74, 222, 128, 0.2)',
                      border: '1px solid var(--color-accent-green)',
                      color: 'var(--color-accent-green)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-pixel)',
                    }}
                  >
                    ✓ Dicoba
                  </span>
                )}

                {/* Object icon */}
                <div style={{ fontSize: '2.6rem', marginTop: '6px' }}>
                  {prof.id === 'dokter' ? '🩺' : prof.id === 'perawat' ? '📋' : prof.id === 'software-engineer' ? '💻' : '🧮'}
                </div>
                <span className="pixel-text" style={{ fontSize: '0.45rem', color: 'var(--color-accent-cyan)', textAlign: 'center' }}>
                  {prof.bendaPemicu.nama}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  → {prof.nama}
                </span>
                {prof.hasSimulation ? (
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-accent-green)' }}>
                    🎮 Simulasi 1 Hari
                  </span>
                ) : (
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-accent-yellow)' }}>
                    📋 Reality Check
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
