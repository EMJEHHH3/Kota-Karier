import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useUserState } from '../lib/context';

export function GuestSyncBanner() {
  const { user, loading, signInWithGoogle } = useAuth();
  const { state } = useUserState();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem('guest_sync_banner_closed') === 'true';
    } catch {
      return false;
    }
  });

  // Tampilkan hanya untuk guest (tidak loading, belum login) dan belum ditutup di sesi ini
  if (loading || user || isDismissed) {
    return null;
  }

  // Tampilkan setelah selesai tes atau simulasi
  const hasFinishedActivity = Boolean(
    state.testResult || Object.keys(state.simulationResults || {}).length > 0
  );

  if (!hasFinishedActivity) {
    return null;
  }

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('guest_sync_banner_closed', 'true');
    } catch (e) {
      console.warn('Failed to access sessionStorage', e);
    }
    setIsDismissed(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print"
      style={{
        background: 'rgba(34, 211, 238, 0.08)',
        borderBottom: '1px solid var(--color-border-cyan)',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.65rem',
        fontFamily: 'var(--font-pixel)',
        color: 'var(--color-text-primary)',
        gap: '8px',
        flexWrap: 'wrap',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span aria-hidden="true"><i className="fa-solid fa-cloud" /></span>
        <span>Login to save your results across devices</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="btn btn--primary"
          style={{
            fontSize: '0.5rem',
            padding: '3px 8px',
            minHeight: '26px',
          }}
        >
          LOGIN
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            lineHeight: 1,
            padding: '2px 4px',
          }}
          aria-label="Tutup notifikasi"
          title="Tutup"
        >
          ×
        </button>
      </div>
    </div>
  );
}
