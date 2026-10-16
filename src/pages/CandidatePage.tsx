/**
 * CandidatePage — List of saved candidate professions (Daftar Kandidat).
 * Route: /kandidat
 */

import { Link } from 'react-router-dom';
import { useUserState } from '../lib/context';
import { getProfessionById } from '../data/professions';

export default function CandidatePage() {
  const { state, toggleCandidate } = useUserState();

  const candidateProfessions = state.candidates
    .map((c) => getProfessionById(c.professionId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="page-enter" style={{ minHeight: '100dvh' }}>
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
        <Link to="/" className="btn btn--ghost" style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}>
          ← Kota
        </Link>
        <h1 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)' }}>
          Daftar Kandidat ({candidateProfessions.length})
        </h1>
      </header>

      <main className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
        {candidateProfessions.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-yellow)' }}>
              <i className="fa-solid fa-star" aria-hidden="true" />
            </div>
            <p className="pixel-text" style={{ fontSize: '0.6rem', color: 'var(--color-accent-yellow)', marginBottom: 'var(--space-md)' }}>
              Belum Ada Profesi Disimpan
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
              Saat menjelajahi profesi di gedung kota, klik tombol "Simpan ke Kandidat" untuk membandingkan pilihan kariermu di sini.
            </p>
            <Link to="/" className="btn btn--primary">
              Mulai Jelajahi Kota
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Profesi yang kamu pertimbangkan:
              </p>
              {candidateProfessions.length >= 2 && (
                <Link to="/bandingkan" className="btn btn--primary" style={{ fontSize: '0.55rem', padding: '4px 10px' }}>
                  <i className="fa-solid fa-scale-balanced" aria-hidden="true" style={{ marginRight: '6px' }} />
                  Bandingkan Pilihan
                </Link>
              )}
            </div>

            {candidateProfessions.map((prof) => (
              <div
                key={prof.id}
                className="panel"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-md)',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)', marginBottom: '4px' }}>
                    {prof.nama}
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {prof.realityCheck.jurusanKuliah.utama.join(', ')}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-accent-yellow)', marginTop: '4px' }}>
                    <i className="fa-solid fa-money-bill-wave" aria-hidden="true" style={{ marginRight: '6px' }} />
                    {prof.realityCheck.prospek.rentangGaji}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link
                    to={`/profesi/${prof.id}`}
                    className="btn"
                    style={{ fontSize: '0.55rem', padding: '6px 12px' }}
                  >
                    Buka Detail
                  </Link>
                  <button
                    onClick={() => toggleCandidate(prof.id)}
                    className="btn btn--ghost"
                    style={{ fontSize: '0.55rem', color: 'var(--color-accent-red)' }}
                    title="Hapus dari kandidat"
                  >
                    ✕ Hapus
                  </button>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
              <Link to="/" className="btn">
                ← Kembali ke Kota
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
