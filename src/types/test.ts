/**
 * Type definitions for the Interest & Work-Style Test (Tes Minat & Gaya Kerja).
 * Based on RIASEC (Holland) framework — original questions only.
 */

import type { RiasecType } from './profession';

/** A single option in a test question */
export interface TestOption {
  /** Display text (Indonesian) */
  teks: string;
  /** Which RIASEC types this option maps to (can be 1-2) */
  riasec: RiasecType[];
  /** Weight of this option's mapping (default 1) */
  bobot?: number;
}

/** A single test question */
export interface TestQuestion {
  /** Unique question ID */
  id: string;
  /** Question text / scenario (Indonesian) */
  pertanyaan: string;
  /** 4 answer options */
  opsi: [TestOption, TestOption, TestOption, TestOption];
}

/** User's answer to a single question */
export interface TestAnswer {
  /** Question ID */
  questionId: string;
  /** Index of chosen option (0-3) */
  chosenIndex: number;
  /** Timestamp when answered (for speed detection) */
  timestamp: number;
}

/** Aggregated RIASEC scores from the test */
export interface RiasecScores {
  Realistic: number;
  Investigative: number;
  Artistic: number;
  Social: number;
  Enterprising: number;
  Conventional: number;
}

/** Final test result */
export interface TestResult {
  /** All RIASEC scores */
  scores: RiasecScores;
  /** Top 2-3 RIASEC types */
  topTypes: RiasecType[];
  /** Whether answers were suspiciously fast/uniform */
  isSuspicious: boolean;
  /** Timestamp of completion */
  completedAt: number;
  /** Version of test taken (2 for realistic work-task test) */
  testVersion?: number;
  /** Additional data (subjects, work styles) that do not affect RIASEC */
  extras?: {
    favoriteSubjects?: string[];
    workStyles?: Record<string, string>;
  };
}
