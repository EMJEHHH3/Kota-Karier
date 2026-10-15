/**
 * localStorage wrapper with try/catch and graceful fallback.
 * All persistence is local — no data leaves the device.
 */

import type { UserState } from '../types';
import { DEFAULT_USER_STATE } from '../types/result';

const STORAGE_KEY = 'kota-karier-state';
const CURRENT_VERSION = 1;

/**
 * Load user state from localStorage.
 * Returns DEFAULT_USER_STATE if localStorage is unavailable or data is corrupted.
 */
export function loadState(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_USER_STATE };

    const parsed = JSON.parse(raw) as UserState;

    // Version migration — extend as needed
    if (parsed.version !== CURRENT_VERSION) {
      // For now, just reset if version doesn't match
      return { ...DEFAULT_USER_STATE };
    }

    return parsed;
  } catch {
    // localStorage unavailable (private browsing, full storage, etc.)
    console.warn('[kota-karier] Gagal membaca localStorage. Menggunakan state default.');
    return { ...DEFAULT_USER_STATE };
  }
}

/**
 * Save user state to localStorage.
 * Silently fails if localStorage is unavailable.
 */
export function saveState(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('[kota-karier] Gagal menyimpan ke localStorage.');
  }
}

/**
 * Clear all saved state.
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('[kota-karier] Gagal menghapus localStorage.');
  }
}
