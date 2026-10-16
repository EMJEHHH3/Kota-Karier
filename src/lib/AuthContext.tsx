import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { storage, type SyncStatus } from './storage';

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  syncStatus: SyncStatus;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(isSupabaseConfigured && supabase));
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => storage.getSyncStatus());

  useEffect(() => {
    return storage.onSyncStatusChange((status) => {
      setSyncStatus(status);
    });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    let isMounted = true;

    // Ambil sesi awal
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error: sessionError }) => {
        if (!isMounted) return;
        if (sessionError) {
          console.warn('Gagal membaca sesi Supabase:', sessionError.message);
          setError(sessionError.message);
        }
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Gagal menginisialisasi sesi.';
        console.warn('Kesalahan saat getSession:', msg);
        setLoading(false);
      });

    // Langganan perubahan status auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      setError('Konfigurasi Supabase (.env) belum diisi.');
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (signInError) {
        setError(signInError.message || 'Gagal masuk dengan Google.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk.';
      setError(msg);
    }
  };

  const signOut = async () => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      return;
    }

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal keluar.';
      setError(msg);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        syncStatus,
        signInWithGoogle,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const defaultAuthValue: AuthContextValue = {
  user: null,
  session: null,
  loading: false,
  error: null,
  syncStatus: 'synced',
  signInWithGoogle: async () => {},
  signOut: async () => {},
  clearError: () => {},
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthValue;
  }
  return context;
}
