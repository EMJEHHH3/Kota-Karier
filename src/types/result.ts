/**
 * Type definitions for user results, saved state, and sharing.
 */

import type { RiasecType, ScoreImpact } from './profession';
import type { RiasecScores, TestResult } from './test';

/** Result of a single profession simulation */
export interface SimulationResult {
  /** Profession ID */
  professionId: string;
  /** Choices made at each step (index of chosen option) */
  choices: number[];
  /** Aggregated score impacts */
  totalScores: ScoreImpact;
  /** Pre-simulation interest rating (1-5) */
  preInterest: number;
  /** Post-simulation enjoyment rating (1-5) */
  postEnjoyment: number;
  /** Most exciting part (user's text) */
  mostExciting: string;
  /** Most boring part (user's text) */
  mostBoring: string;
  /** Expectation vs Reality delta (postEnjoyment - preInterest) */
  ekspektasiDelta: number;
  /** Timestamp of completion */
  completedAt: number;
}

/** A profession saved to the user's candidate list */
export interface CandidateProfession {
  professionId: string;
  savedAt: number;
}

/** 6-month action plan step */
export interface ActionStep {
  /** Month range, e.g., "Bulan 1-2" */
  periode: string;
  /** Action items */
  langkah: string[];
}

/** Complete user state saved to localStorage */
export interface UserState {
  /** RIASEC test result (null if not taken) */
  testResult: TestResult | null;
  /** Simulation results per profession */
  simulationResults: Record<string, SimulationResult>;
  /** Saved candidate professions */
  candidates: CandidateProfession[];
  /** User settings */
  settings: UserSettings;
  /** Schema version for migration */
  version: number;
}

/** User preferences */
export interface UserSettings {
  /** Whether to disable scanlines/CRT effects */
  disableScanlines: boolean;
  /** Whether to disable animations */
  disableAnimations: boolean;
}

/** Shareable result code data (encoded locally) */
export interface ShareableResult {
  /** Top RIASEC types */
  topRiasec: RiasecType[];
  /** RIASEC scores (rounded to save space) */
  scores: RiasecScores;
  /** Top 3 profession IDs with reasons */
  topProfessions: {
    id: string;
    reason: string;
  }[];
  /** Timestamp */
  createdAt: number;
}

/** Default initial user state */
export const DEFAULT_USER_STATE: UserState = {
  testResult: null,
  simulationResults: {},
  candidates: [],
  settings: {
    disableScanlines: false,
    disableAnimations: false,
  },
  version: 1,
};
