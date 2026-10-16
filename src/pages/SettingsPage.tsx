/**
 * SettingsPage — User settings and accessibility preferences.
 * Route: /pengaturan
 */

import { Link } from 'react-router-dom';
import { useUserState } from '../lib/context';

export default function SettingsPage() {
  const { state, updateSettings, resetState } = useUserState();

  const handleReset = () => {
    if (window.confirm('Apakah kamu yakin ingin mereset semua data progres dan hasil eksplorasi? Tindakan ini tidak dapat dibatalkan.')) {
      resetState();
      alert('Data berhasil direset.');
    }
  };

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
          Pengaturan
        </h1>
      </header>

      <main className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
        {/* Tampilan & Aksesibilitas */}
        <section className="panel" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)', marginBottom: 'var(--space-md)' }}>
            <i className="fa-solid fa-gamepad" aria-hidden="true" style={{ marginRight: '6px' }} />
            Tampilan & Aksesibilitas
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Efek Garis Layar (Scanlines)</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                  Matikan jika layar terasa silau atau berkedip
                </div>
              </div>
              <input
                type="checkbox"
                checked={!state.settings.disableScanlines}
                onChange={(e) => updateSettings({ disableScanlines: !e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--color-accent-cyan)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Animasi Retro & Transisi</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                  Kurangi gerakan jika sensitif terhadap animasi (motion reduction)
                </div>
              </div>
              <input
                type="checkbox"
                checked={!state.settings.disableAnimations}
                onChange={(e) => updateSettings({ disableAnimations: !e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--color-accent-cyan)' }}
              />
            </label>
          </div>
        </section>

        {/* Privasi & Data */}
        <section className="panel" style={{ marginBottom: 'var(--space-lg)', borderColor: 'var(--color-border-subtle)' }}>
          <h2 style={{ fontSize: '0.65rem', color: 'var(--color-accent-yellow)', marginBottom: 'var(--space-sm)' }}>
            <i className="fa-solid fa-lock" aria-hidden="true" style={{ marginRight: '6px' }} />
            Privasi & Penyimpanan
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
            Kota Karier tidak mengumpulkan data pribadi dan tidak memerlukan akun. Semua progres, jawaban tes, serta simulasi disimpan secara aman 100% hanya di perangkatmu (localStorage).
          </p>

          <button
            onClick={handleReset}
            className="btn"
            style={{ borderColor: 'var(--color-accent-red)', color: 'var(--color-accent-red)' }}
          >
            <i className="fa-solid fa-trash-can" aria-hidden="true" style={{ marginRight: '6px' }} />
            Reset Semua Progres & Data
          </button>
        </section>

        {/* Tentang Kota Karier */}
        <section className="panel" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <h2 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)', marginBottom: 'var(--space-sm)' }}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" style={{ marginRight: '6px' }} />
            Tentang Kota Karier
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
            Platform eksplorasi karier interaktif untuk siswa SMA Indonesia.
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            Versi Hackathon MVP v1.0.0 · Dibangun dengan React + Vite + Tailwind CSS.
          </p>
        </section>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <Link to="/" className="btn">
            ← Kembali ke Kota
          </Link>
        </div>
      </main>
    </div>
  );
}
