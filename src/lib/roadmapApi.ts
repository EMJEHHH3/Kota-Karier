/**
 * Client helper for fetching Career Roadmaps and managing user preference.
 */

import type { ProfessionRoadmap, RoadmapProfessionSummary } from '../types/roadmap';
import {
  handleGetRoadmap,
  handleGetProfessionsList,
  handleGetPreference,
  handleSetPreference,
} from '../../server/api/roadmapRoutes';
import { storage } from './storage';

const STORAGE_LAST_ROADMAP_KEY = 'kota-karier-last-roadmap-id';

/**
 * Fetch roadmap for a given profession ID.
 * Makes HTTP GET to /roadmaps/:professionId with robust fallback.
 */
export async function fetchRoadmapByProfession(professionId: string): Promise<ProfessionRoadmap> {
  const cleanId = professionId.trim().toLowerCase();
  try {
    const res = await fetch(`/roadmaps/${cleanId}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      return json.data as ProfessionRoadmap;
    }
    throw new Error(json.error || 'Failed to retrieve roadmap data');
  } catch (err) {
    // Graceful offline/test fallback
    return handleGetRoadmap(cleanId);
  }
}

/**
 * Fetch all available professions list for exploration.
 * Makes HTTP GET to /roadmaps with robust fallback.
 */
export async function fetchAllProfessionsList(): Promise<RoadmapProfessionSummary[]> {
  try {
    const res = await fetch('/roadmaps', {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data as RoadmapProfessionSummary[];
    }
    throw new Error(json.error || 'Failed to retrieve professions list');
  } catch (err) {
    return handleGetProfessionsList();
  }
}

/**
 * Fetch the last viewed profession ID.
 * Tries backend endpoint first, falls back to local storage cache.
 */
export async function fetchLastViewedProfessionId(): Promise<string | null> {
  // First check local unified storage
  const localSaved = storage.getItem<string>(STORAGE_LAST_ROADMAP_KEY);

  try {
    const res = await fetch('/roadmaps/preference', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.professionId) {
        return json.professionId;
      }
    }
  } catch {
    // Use fallback
  }

  if (localSaved) {
    return localSaved;
  }

  return handleGetPreference();
}

/**
 * Save the last viewed profession ID to backend and local storage.
 */
export async function saveLastViewedProfessionId(professionId: string): Promise<void> {
  const cleanId = professionId.trim().toLowerCase();

  // Save to unified local storage
  storage.setItem(STORAGE_LAST_ROADMAP_KEY, cleanId);

  // Send to backend
  try {
    await fetch('/roadmaps/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionId: cleanId }),
    });
  } catch {
    handleSetPreference(cleanId);
  }
}
