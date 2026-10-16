/**
 * Unified Storage Layer with Local Cache & Supabase Cloud Sync
 * Serves as the single gateway for all app persistence.
 */

import type { UserState } from '../types';
import { DEFAULT_USER_STATE } from '../types/result';
import { supabase, isSupabaseConfigured } from './supabase';

export type SyncStatus = 'synced' | 'syncing' | 'error';

type SyncListener = (status: SyncStatus) => void;
type UserDataListener = (key: string, value: unknown) => void;

class StorageManager {
  private currentUserId: string | null = null;
  private syncStatus: SyncStatus = 'synced';
  private syncListeners: Set<SyncListener> = new Set();
  private dataListeners: Set<UserDataListener> = new Set();
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private retryTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private lastSyncedMap: Map<string, string> = new Map();

  public getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  public setSyncStatus(status: SyncStatus): void {
    if (this.syncStatus !== status) {
      this.syncStatus = status;
      this.notifySyncListeners();
    }
  }

  public onSyncStatusChange(listener: SyncListener): () => void {
    this.syncListeners.add(listener);
    listener(this.syncStatus);
    return () => {
      this.syncListeners.delete(listener);
    };
  }

  public onDataChange(listener: UserDataListener): () => void {
    this.dataListeners.add(listener);
    return () => {
      this.dataListeners.delete(listener);
    };
  }

  private notifySyncListeners(): void {
    for (const listener of this.syncListeners) {
      try {
        listener(this.syncStatus);
      } catch (e) {
        console.warn('[storage] Error in sync status listener', e);
      }
    }
  }

  // --- Core Storage Interface ---

  public getItem<T = unknown>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch (e) {
      console.warn(`[storage] Failed to read key: ${key}`, e);
      return null;
    }
  }

  public setItem<T = unknown>(key: string, value: T, options?: { skipRemote?: boolean }): void {
    if (typeof localStorage === 'undefined') return;

    const strValue = typeof value === 'string' ? value : JSON.stringify(value);

    // 1. Tulis ke localStorage (cache lokal)
    try {
      localStorage.setItem(key, strValue);
    } catch (e) {
      console.warn(`[storage] Failed to write key: ${key}`, e);
    }

    // 2. Mode Guest atau skipRemote: tidak ada remote upsert
    if (options?.skipRemote || !this.currentUserId || !isSupabaseConfigured || !supabase) {
      return;
    }

    // 3. Cek apakah data sama dengan yang sudah tersinkron
    const cacheKey = `${this.currentUserId}:${key}`;
    if (this.lastSyncedMap.get(cacheKey) === strValue) {
      return;
    }

    // 4. Debounced upsert ke user_data (~800ms)
    this.queueUpsert(this.currentUserId, key, value, strValue);
  }

  public removeItem(key: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] Failed to remove key: ${key}`, e);
    }
  }

  public clear(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('[storage] Failed to clear localStorage', e);
    }
  }

  // Convenient aliases
  public get<T = unknown>(key: string, defaultValue?: T): T | null {
    const val = this.getItem<T>(key);
    return val !== null ? val : (defaultValue ?? null);
  }

  public set<T = unknown>(key: string, value: T): void {
    this.setItem(key, value);
  }

  public remove(key: string): void {
    this.removeItem(key);
  }

  // --- Remote Sync Logic ---

  private queueUpsert(userId: string, key: string, value: unknown, strValue: string): void {
    const debounceKey = `${userId}:${key}`;

    if (this.debounceTimers.has(debounceKey)) {
      clearTimeout(this.debounceTimers.get(debounceKey));
      this.debounceTimers.delete(debounceKey);
    }

    if (this.retryTimers.has(debounceKey)) {
      clearTimeout(this.retryTimers.get(debounceKey));
      this.retryTimers.delete(debounceKey);
    }

    this.setSyncStatus('syncing');

    const timer = setTimeout(async () => {
      this.debounceTimers.delete(debounceKey);
      await this.executeUpsert(userId, key, value, strValue);
    }, 800);

    this.debounceTimers.set(debounceKey, timer);
  }

  private async executeUpsert(userId: string, key: string, value: unknown, strValue: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase || this.currentUserId !== userId) {
      return;
    }

    try {
      const { error } = await supabase.from('user_data').upsert(
        {
          user_id: userId,
          key: key,
          value: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,key' }
      );

      if (error) {
        throw error;
      }

      const cacheKey = `${userId}:${key}`;
      this.lastSyncedMap.set(cacheKey, strValue);

      if (this.debounceTimers.size === 0) {
        this.setSyncStatus('synced');
      }
    } catch (err) {
      console.warn(`[storage] Upsert failed for key: ${key}`, err);
      this.setSyncStatus('error');
      this.scheduleRetry(userId, key, value, strValue);
    }
  }

  private scheduleRetry(userId: string, key: string, value: unknown, strValue: string): void {
    const debounceKey = `${userId}:${key}`;
    if (this.retryTimers.has(debounceKey)) {
      clearTimeout(this.retryTimers.get(debounceKey));
    }

    const timer = setTimeout(async () => {
      this.retryTimers.delete(debounceKey);
      if (this.currentUserId === userId) {
        await this.executeUpsert(userId, key, value, strValue);
      }
    }, 5000);

    this.retryTimers.set(debounceKey, timer);
  }

  // --- Auth lifecycle integration ---

  public async handleUserChange(
    userId: string | null,
    onStateUpdated?: (newState: UserState) => void
  ): Promise<void> {
    if (this.currentUserId === userId) return;

    // Bersihkan timer pending dari user sebelumnya
    for (const timer of this.debounceTimers.values()) clearTimeout(timer);
    this.debounceTimers.clear();
    for (const timer of this.retryTimers.values()) clearTimeout(timer);
    this.retryTimers.clear();

    this.currentUserId = userId;

    if (!userId) {
      // Saat Logout: kosongkan cache data pengguna dari localStorage
      this.removeItem('kota-karier-state');
      this.lastSyncedMap.clear();
      this.setSyncStatus('synced');
      if (onStateUpdated) {
        onStateUpdated({ ...DEFAULT_USER_STATE });
      }
      return;
    }

    // User Login / switch account
    if (!isSupabaseConfigured || !supabase) {
      this.setSyncStatus('synced');
      return;
    }

    const migrationFlagKey = `guest_migrated_${userId}`;
    const hasMigrated = this.getItem<string>(migrationFlagKey) === 'true';

    this.setSyncStatus('syncing');

    try {
      const { data: rows, error } = await supabase
        .from('user_data')
        .select('key, value, updated_at')
        .eq('user_id', userId);

      if (error) throw error;

      const remoteStateRow = rows?.find((r) => r.key === 'kota-karier-state');

      if (!hasMigrated) {
        // Login pertama di perangkat: unggah data guest ke akun SEKALI
        if (remoteStateRow && remoteStateRow.value) {
          // Jika key yang sama sudah ada di akun, data akun yang dipakai
          const remoteState = remoteStateRow.value as UserState;
          this.setItem('kota-karier-state', remoteState, { skipRemote: true });
          this.lastSyncedMap.set(`${userId}:kota-karier-state`, JSON.stringify(remoteState));
          if (onStateUpdated) onStateUpdated(remoteState);
        } else {
          // Akun cloud belum punya data: unggah data guest jika ada
          const localGuestState = this.getItem<UserState>('kota-karier-state');
          if (
            localGuestState &&
            (localGuestState.testResult ||
              Object.keys(localGuestState.simulationResults || {}).length > 0 ||
              (localGuestState.candidates || []).length > 0)
          ) {
            await supabase.from('user_data').upsert(
              {
                user_id: userId,
                key: 'kota-karier-state',
                value: localGuestState,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,key' }
            );
            this.lastSyncedMap.set(`${userId}:kota-karier-state`, JSON.stringify(localGuestState));
          }
        }

        // Tandai dengan flag lokal per user_id
        this.setItem(migrationFlagKey, 'true', { skipRemote: true });
      } else {
        // Sudah pernah migrasi di perangkat ini: baca dari user_data
        if (rows && rows.length > 0) {
          for (const row of rows) {
            this.setItem(row.key, row.value, { skipRemote: true });
            this.lastSyncedMap.set(`${userId}:${row.key}`, JSON.stringify(row.value));
            if (row.key === 'kota-karier-state' && onStateUpdated) {
              onStateUpdated(row.value as UserState);
            }
          }
        }
      }

      this.setSyncStatus('synced');
    } catch (err) {
      console.warn('[storage] Failed to sync user data on login:', err);
      this.setSyncStatus('error');
      // Otomatis coba lagi nanti
      setTimeout(() => {
        if (this.currentUserId === userId) {
          this.handleUserChange(userId, onStateUpdated);
        }
      }, 5000);
    }
  }
}

export const storage = new StorageManager();

/**
 * Load user state via storage layer.
 */
export function loadState(): UserState {
  const parsed = storage.getItem<UserState>('kota-karier-state');
  if (!parsed) return { ...DEFAULT_USER_STATE };
  if (parsed.version !== 1) {
    return { ...DEFAULT_USER_STATE };
  }
  return parsed;
}

/**
 * Save user state via storage layer.
 */
export function saveState(state: UserState): void {
  storage.setItem('kota-karier-state', state);
}

/**
 * Clear all saved state via storage layer.
 */
export function clearState(): void {
  storage.removeItem('kota-karier-state');
}
