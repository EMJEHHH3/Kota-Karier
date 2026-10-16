import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

export function NavbarAuth() {
  const { user, loading, error, syncStatus, signInWithGoogle, signOut, clearError } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isErrorDismissed, setIsErrorDismissed] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayError = isErrorDismissed ? null : (localError || error);

  // Tutup menu saat klik di luar atau tekan Escape (keyboard accessible)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleSignIn = async () => {
    setIsErrorDismissed(false);
    setLocalError(null);
    clearError();
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setLocalError(msg);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDismissError = () => {
    setIsErrorDismissed(true);
    setLocalError(null);
    clearError();
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    try {
      await signOut();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Logout failed.';
      setLocalError(msg);
    }
  };

  // Status loading: pill kecil "CHECKING..." (jangan tampilkan LOGIN atau nama dulu)
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Checking authentication status"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '34px',
          padding: '3px 10px',
          fontSize: '0.5rem',
          fontFamily: 'var(--font-pixel)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '9999px',
          background: 'rgba(100, 116, 139, 0.15)',
          gap: '5px',
          letterSpacing: '0.5px',
        }}
      >
        <span aria-hidden="true"><i className="fa-solid fa-hourglass-half" /></span>
        <span>CHECKING...</span>
      </div>
    );
  }

  // Jika sudah login: pill hijau neon dengan foto profil (fallback inisial), nama depan, dan titik hijau.
  // Menu kecil berisi email, status sync, dan "Logout".
  if (user) {
    const rawName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.given_name ||
      user.email?.split('@')[0] ||
      'User';
    const firstName = String(rawName).trim().split(/\s+/)[0];
    const avatarUrl = (user.user_metadata?.avatar_url || user.user_metadata?.picture) as string | undefined;

    let syncText = 'Synced';
    let syncIcon: React.ReactNode = <i className="fa-solid fa-check" />;
    let syncColor = '#4ade80';

    if (syncStatus === 'syncing') {
      syncText = 'Syncing...';
      syncIcon = <i className="fa-solid fa-rotate fa-spin" />;
      syncColor = 'var(--color-accent-cyan)';
    } else if (syncStatus === 'error') {
      syncText = 'Sync failed, retrying';
      syncIcon = <i className="fa-solid fa-triangle-exclamation" />;
      syncColor = 'var(--color-accent-yellow)';
    }

    return (
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="btn"
          style={{
            fontSize: '0.5rem',
            fontFamily: 'var(--font-pixel)',
            minHeight: '34px',
            padding: '2px 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '9999px',
            borderColor: '#4ade80',
            background: 'rgba(74, 222, 128, 0.12)',
            boxShadow: '0 0 10px rgba(74, 222, 128, 0.35)',
            cursor: 'pointer',
          }}
          aria-label={`User: ${firstName}. Status: ${syncText}. Toggle menu`}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={firstName}
              referrerPolicy="no-referrer"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1px solid #4ade80',
                objectFit: 'cover',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(74, 222, 128, 0.25)',
                border: '1px solid #4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.55rem',
                color: '#4ade80',
                fontWeight: 'bold',
              }}
              aria-hidden="true"
            >
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            style={{
              maxWidth: '85px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--color-text-primary)',
            }}
          >
            {firstName}
          </span>

          {/* Titik hijau neon */}
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
              display: 'inline-block',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />

          <span style={{ fontSize: '0.45rem', color: '#4ade80', opacity: 0.8 }} aria-hidden="true">
            ▾
          </span>
        </button>

        {/* Menu kecil berisi email, status sync, dan Logout */}
        {isMenuOpen && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              minWidth: '185px',
              background: 'var(--color-bg-panel)',
              border: '1px solid #4ade80',
              borderRadius: '6px',
              padding: '6px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.85), 0 0 12px rgba(74, 222, 128, 0.2)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {user.email && (
              <div
                style={{
                  padding: '4px 8px',
                  fontSize: '0.55rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={user.email}
              >
                {user.email}
              </div>
            )}

            {/* Status sync di menu: "Synced" / "Syncing..." / "Sync failed, retrying" */}
            <div
              role="status"
              aria-label={`Sync status: ${syncText}`}
              style={{
                padding: '4px 8px',
                fontSize: '0.5rem',
                fontFamily: 'var(--font-pixel)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: syncColor,
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              <span aria-hidden="true">{syncIcon}</span>
              <span>{syncText}</span>
            </div>

            {/* Tombol Logout */}
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="btn btn--ghost"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                fontSize: '0.5rem',
                fontFamily: 'var(--font-pixel)',
                padding: '6px 8px',
                minHeight: '30px',
                color: 'var(--color-accent-red)',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span aria-hidden="true"><i className="fa-solid fa-arrow-right-from-bracket" /></span> Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  // Guest: pill abu-abu dengan ikon orang dan teks "GUEST", plus tombol "LOGIN".
  // Tooltip: "Guest mode: data is saved on this browser only"
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
      <div
        title="Guest mode: data is saved on this browser only"
        role="status"
        aria-label="Guest mode: data is saved on this browser only"
        tabIndex={0}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          minHeight: '34px',
          padding: '3px 10px',
          fontSize: '0.5rem',
          fontFamily: 'var(--font-pixel)',
          borderRadius: '9999px',
          background: 'rgba(100, 116, 139, 0.2)',
          border: '1px solid #475569',
          color: '#94a3b8',
          letterSpacing: '0.5px',
          cursor: 'help',
        }}
      >
        <span aria-hidden="true"><i className="fa-solid fa-user" /></span>
        <span>GUEST</span>
      </div>

      <button
        type="button"
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="btn"
        style={{
          fontSize: '0.5rem',
          minHeight: '34px',
          padding: '4px 10px',
          borderColor: 'var(--color-accent-cyan)',
          color: 'var(--color-accent-cyan)',
          background: 'rgba(34, 211, 238, 0.1)',
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          cursor: isSigningIn ? 'wait' : 'pointer',
          letterSpacing: '1px',
        }}
        title="Login with Google"
        aria-label="Login with Google"
      >
        <span
          style={{ fontSize: '0.6rem', filter: 'drop-shadow(0 0 4px var(--color-accent-cyan))' }}
          aria-hidden="true"
        >
          <i className="fa-solid fa-bolt" />
        </span>
        {isSigningIn ? '...' : 'LOGIN'}
      </button>

      {/* Pesan error singkat jika gagal / env kosong */}
      {displayError && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-accent-red)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.8), 0 0 10px rgba(248, 113, 113, 0.3)',
            color: '#fca5a5',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '0.6rem',
            fontFamily: 'var(--font-body)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            zIndex: 100,
          }}
          role="alert"
        >
          <span>
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px' }} />
            {displayError}
          </span>
          <button
            type="button"
            onClick={handleDismissError}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              lineHeight: 1,
              padding: 0,
            }}
            title="Tutup pesan"
            aria-label="Tutup pesan"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
