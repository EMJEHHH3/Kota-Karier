/**
 * ComparePage — Compare 2 professions side-by-side.
 * Route: /bandingkan
 */

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROFESSIONS, getProfessionById } from '../data/professions';

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const initP1 = searchParams.get('p1') || PROFESSIONS[0].id;
  const initP2 = searchParams.get('p2') || PROFESSIONS[1]?.id || PROFESSIONS[0].id;

  const [p1Id, setP1Id] = useState<string>(initP1);
  const [p2Id, setP2Id] = useState<string>(initP2);

  const prof1 = getProfessionById(p1Id) || PROFESSIONS[0];
  const prof2 = getProfessionById(p2Id) || PROFESSIONS[1];

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
          Bandingkan Profesi
        </h1>
      </header>

      <main className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)', maxWidth: '840px' }}>
        {/* Selector row */}
        <div
          className="panel"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
              Profesi A:
            </label>
            <select
              value={p1Id}
              onChange={(e) => setP1Id(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--color-bg-dark)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-cyan)',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
              }}
            >
              {PROFESSIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
              Profesi B:
            </label>
            <select
              value={p2Id}
              onChange={(e) => setP2Id(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--color-bg-dark)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-cyan)',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
              }}
            >
              {PROFESSIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side comparison grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)',
          }}
        >
          {/* Column 1 */}
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)' }}>{prof1.nama}</h2>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {prof1.riasec.map((r) => (
                <span key={r} style={{ fontSize: '0.6rem', padding: '2px 6px', border: '1px solid var(--color-accent-purple)', borderRadius: '4px' }}>
                  {r}
                </span>
              ))}
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-yellow)', marginBottom: '4px' }}>
                <i className="fa-solid fa-money-bill-wave" aria-hidden="true" style={{ marginRight: '6px' }} />
                Prospek Gaji
              </h3>
              <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{prof1.realityCheck.prospek.rentangGaji}</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                {prof1.realityCheck.prospek.sumber} ({prof1.realityCheck.prospek.tahun})
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-green)', marginBottom: '4px' }}>
                <i className="fa-solid fa-clipboard-list" aria-hidden="true" style={{ marginRight: '6px' }} />
                Tugas Utama
              </h3>
              <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '16px' }}>
                {prof1.realityCheck.tugasHarian.map((t, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-red)', marginBottom: '4px' }}>
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px' }} />
                Sisi Tidak Enak
              </h3>
              <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '16px' }}>
                {prof1.realityCheck.sisiTidakEnak.map((s, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-cyan)', marginBottom: '4px' }}>
                <i className="fa-solid fa-graduation-cap" aria-hidden="true" style={{ marginRight: '6px' }} />
                Jurusan Kuliah
              </h3>
              <p style={{ fontSize: '0.75rem' }}><strong>Utama:</strong> {prof1.realityCheck.jurusanKuliah.utama.join(', ')}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                <strong>Alternatif:</strong> {prof1.realityCheck.jurusanKuliah.alternatif.join(', ')}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-orange)', marginBottom: '4px' }}>
                <i className="fa-solid fa-bolt" aria-hidden="true" style={{ marginRight: '6px' }} />
                Jalur Non-S1
              </h3>
              {prof1.realityCheck.jalurAlternatif.map((j, i) => (
                <div key={i} style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                  <strong>{j.jenis}:</strong> {j.deskripsi}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <Link to={`/profesi/${prof1.id}`} className="btn" style={{ width: '100%', fontSize: '0.55rem' }}>
                Jelajahi {prof1.nama}
              </Link>
            </div>
          </div>

          {/* Column 2 */}
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)' }}>{prof2.nama}</h2>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {prof2.riasec.map((r) => (
                <span key={r} style={{ fontSize: '0.6rem', padding: '2px 6px', border: '1px solid var(--color-accent-purple)', borderRadius: '4px' }}>
                  {r}
                </span>
              ))}
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-yellow)', marginBottom: '4px' }}>
                <i className="fa-solid fa-money-bill-wave" aria-hidden="true" style={{ marginRight: '6px' }} />
                Prospek Gaji
              </h3>
              <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{prof2.realityCheck.prospek.rentangGaji}</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                {prof2.realityCheck.prospek.sumber} ({prof2.realityCheck.prospek.tahun})
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-green)', marginBottom: '4px' }}>
                <i className="fa-solid fa-clipboard-list" aria-hidden="true" style={{ marginRight: '6px' }} />
                Tugas Utama
              </h3>
              <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '16px' }}>
                {prof2.realityCheck.tugasHarian.map((t, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-red)', marginBottom: '4px' }}>
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px' }} />
                Sisi Tidak Enak
              </h3>
              <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '16px' }}>
                {prof2.realityCheck.sisiTidakEnak.map((s, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-cyan)', marginBottom: '4px' }}>
                <i className="fa-solid fa-graduation-cap" aria-hidden="true" style={{ marginRight: '6px' }} />
                Jurusan Kuliah
              </h3>
              <p style={{ fontSize: '0.75rem' }}><strong>Utama:</strong> {prof2.realityCheck.jurusanKuliah.utama.join(', ')}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                <strong>Alternatif:</strong> {prof2.realityCheck.jurusanKuliah.alternatif.join(', ')}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.55rem', color: 'var(--color-accent-orange)', marginBottom: '4px' }}>
                <i className="fa-solid fa-bolt" aria-hidden="true" style={{ marginRight: '6px' }} />
                Jalur Non-S1
              </h3>
              {prof2.realityCheck.jalurAlternatif.map((j, i) => (
                <div key={i} style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                  <strong>{j.jenis}:</strong> {j.deskripsi}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <Link to={`/profesi/${prof2.id}`} className="btn" style={{ width: '100%', fontSize: '0.55rem' }}>
                Jelajahi {prof2.nama}
              </Link>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <Link to="/" className="btn">
            ← Kembali ke Kota
          </Link>
        </div>
      </main>
    </div>
  );
}
