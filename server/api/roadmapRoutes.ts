import {
  ROADMAP_SEED,
  generateGenericRoadmap,
  getAllAvailableProfessionsList,
} from '../data/roadmaps.ts';
import type { ProfessionRoadmap, RoadmapProfessionSummary } from '../../src/types/roadmap.ts';

// In-memory preference store on backend (persisted per server runtime session)
let serverLastViewedProfessionId: string = 'software-engineer';

export interface RoadmapApiResponse {
  success: boolean;
  data?: ProfessionRoadmap;
  error?: string;
}

export interface ProfessionsListResponse {
  success: boolean;
  data: RoadmapProfessionSummary[];
}

export interface PreferenceResponse {
  success: boolean;
  professionId: string;
}

/**
 * Handle GET /roadmaps/:professionId
 */
export function handleGetRoadmap(professionId: string): ProfessionRoadmap {
  const normalizedId = professionId.trim().toLowerCase();
  if (ROADMAP_SEED[normalizedId]) {
    return ROADMAP_SEED[normalizedId];
  }
  return generateGenericRoadmap(normalizedId);
}

/**
 * Handle GET /roadmaps
 */
export function handleGetProfessionsList(): RoadmapProfessionSummary[] {
  return getAllAvailableProfessionsList();
}

/**
 * Handle GET /roadmaps/preference
 */
export function handleGetPreference(): string {
  return serverLastViewedProfessionId;
}

/**
 * Handle POST /roadmaps/preference
 */
export function handleSetPreference(professionId: string): string {
  if (professionId && typeof professionId === 'string') {
    serverLastViewedProfessionId = professionId.trim().toLowerCase();
  }
  return serverLastViewedProfessionId;
}
