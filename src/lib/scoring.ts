/**
 * Scoring configuration and pure scoring functions.
 *
 * All scoring is deterministic and testable.
 * Weights and thresholds are centralized here.
 */

import type { RiasecType, ScoreImpact } from '../types';
import type { RiasecScores, TestAnswer, TestResult, SimulationResult } from '../types';
import { TEST_QUESTIONS } from '../data/tes-minat';
import {
  BAGIAN_1_CARDS,
  BAGIAN_2_SCENARIOS,
  RIASEC_MAX_POINTS,
} from '../data/interestQuestions.js';

// ============================================================
// SCORING WEIGHTS — single config object for easy tuning
// ============================================================

/**
 * Weights for final profession ranking.
 * Must sum to 1.0.
 *
 * - interest (40%): How much the user enjoyed the work
 * - ability (25%): How well they performed tasks
 * - resilience (20%): How they handled adversity/stress
 * - workStyleFit (15%): How their work style aligns with the profession
 */
export const RANKING_WEIGHTS = {
  interest: 0.40,
  ability: 0.25,
  resilience: 0.20,
  workStyleFit: 0.15,
} as const;

/**
 * Thresholds for suspicious answer detection.
 * - minAvgTimeMs: minimum average time per question (below = too fast)
 * - maxUniformStreak: max consecutive same-position answers
 */
export const SUSPICION_THRESHOLDS = {
  minAvgTimeMs: 2000, // 2 seconds average → suspiciously fast
  maxUniformStreak: 6, // 6 consecutive same-option picks → suspicious pattern
} as const;

// ============================================================
// RIASEC SCORING (Interest Test)
// ============================================================

/**
 * Aggregate RIASEC scores from test answers.
 * Each answer maps to 1-2 RIASEC types; weight defaults to 1.
 *
 * @param answers - Array of user's test answers
 * @returns Aggregated RIASEC scores
 */
export function aggregateRiasecScores(answers: TestAnswer[]): RiasecScores {
  const scores: RiasecScores = {
    Realistic: 0,
    Investigative: 0,
    Artistic: 0,
    Social: 0,
    Enterprising: 0,
    Conventional: 0,
  };

  for (const answer of answers) {
    const question = TEST_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const option = question.opsi[answer.chosenIndex];
    if (!option) continue;

    const weight = option.bobot ?? 1;
    for (const type of option.riasec) {
      scores[type] += weight;
    }
  }

  return scores;
}

/**
 * Get top N RIASEC types from scores.
 * Returns 2-3 types depending on score distribution.
 *
 * @param scores - Aggregated RIASEC scores
 * @returns Array of top RIASEC types (2-3)
 */
export function getTopRiasecTypes(scores: RiasecScores): RiasecType[] {
  const sorted = (Object.entries(scores) as [RiasecType, number][])
    .sort((a, b) => b[1] - a[1]);

  // Always include top 2
  const top: RiasecType[] = [sorted[0][0], sorted[1][0]];

  // Include 3rd if it's close to the 2nd (within 1 point)
  if (sorted.length > 2 && sorted[2][1] >= sorted[1][1] - 1) {
    top.push(sorted[2][0]);
  }

  return top;
}

/**
 * Detect suspiciously fast or uniform answers.
 *
 * Checks two things:
 * 1. Average answer time is below threshold
 * 2. There's a streak of same-position answers exceeding threshold
 *
 * @param answers - Array of answers with timestamps
 * @returns true if answers appear suspicious
 */
export function detectSuspiciousAnswers(answers: TestAnswer[]): boolean {
  if (answers.length < 2) return false;

  // Check average time between answers
  let totalTime = 0;
  for (let i = 1; i < answers.length; i++) {
    totalTime += answers[i].timestamp - answers[i - 1].timestamp;
  }
  const avgTime = totalTime / (answers.length - 1);
  if (avgTime < SUSPICION_THRESHOLDS.minAvgTimeMs) return true;

  // Check for uniform pattern (same option position in a row)
  let streak = 1;
  for (let i = 1; i < answers.length; i++) {
    if (answers[i].chosenIndex === answers[i - 1].chosenIndex) {
      streak++;
      if (streak >= SUSPICION_THRESHOLDS.maxUniformStreak) return true;
    } else {
      streak = 1;
    }
  }

  return false;
}

/**
 * Compute the complete test result from answers.
 *
 * @param answers - All test answers
 * @returns Complete test result with scores, top types, and suspicion flag
 */
export function computeTestResult(answers: TestAnswer[]): TestResult {
  const scores = aggregateRiasecScores(answers);
  const topTypes = getTopRiasecTypes(scores);
  const isSuspicious = detectSuspiciousAnswers(answers);

  return {
    scores,
    topTypes,
    isSuspicious,
    completedAt: Date.now(),
  };
}

// ============================================================
// RIASEC SCORING V2 (Work-Task Based Interest Test)
// ============================================================

export interface Part1Answer {
  cardId: string;
  rating: 'mau_banget' | 'biasa_aja' | 'nggak_minat';
}

export interface Part2Answer {
  scenarioId: string;
  chosenOptionId: string;
}

export interface InterestTestV2Answers {
  part1: Part1Answer[];
  part2: Part2Answer[];
  part3?: string[];
  part4?: Record<string, string>;
}

/**
 * Normalizes scores per type:
 * Raw points = (points Part 1 + points Part 2)
 * Normalized fraction = raw points / max possible points for that type
 * Scaled to 0-10 range (matching old test scale).
 */
export function calculateNormalizedRiasecScores(
  part1: Part1Answer[],
  part2: Part2Answer[]
): RiasecScores {
  const rawPoints: RiasecScores = {
    Realistic: 0,
    Investigative: 0,
    Artistic: 0,
    Social: 0,
    Enterprising: 0,
    Conventional: 0,
  };

  // Bagian 1: Mau banget = 2, Biasa aja = 1, Nggak minat = 0
  for (const a of part1) {
    const card = BAGIAN_1_CARDS.find((c) => c.id === a.cardId);
    if (!card) continue;
    const pts = a.rating === 'mau_banget' ? 2 : a.rating === 'biasa_aja' ? 1 : 0;
    rawPoints[card.tipe as RiasecType] += pts;
  }

  // Bagian 2: 2 poin ke tipe opsi yang dipilih
  for (const a of part2) {
    const scenario = BAGIAN_2_SCENARIOS.find((s) => s.id === a.scenarioId);
    if (!scenario) continue;
    const option = scenario.opsi.find((o) => o.id === a.chosenOptionId);
    if (!option) continue;
    rawPoints[option.tipe as RiasecType] += 2;
  }

  // Normalisasi tiap tipe dan skala ke rentang lama (0-10)
  const OLD_SCALE = 10;
  const normalizedScores: RiasecScores = {
    Realistic: 0,
    Investigative: 0,
    Artistic: 0,
    Social: 0,
    Enterprising: 0,
    Conventional: 0,
  };

  for (const typeKey of Object.keys(rawPoints) as RiasecType[]) {
    const maxPossible = RIASEC_MAX_POINTS[typeKey] || 18;
    const fraction = rawPoints[typeKey] / maxPossible;
    normalizedScores[typeKey] = Math.round(fraction * OLD_SCALE);
  }

  return normalizedScores;
}

/**
 * Compute final test result for Test V2.
 * Output maintains exact RiasecScores format and scale, plus testVersion: 2 and extras.
 */
export function computeInterestTestResultV2(
  answers: InterestTestV2Answers
): TestResult {
  const scores = calculateNormalizedRiasecScores(answers.part1, answers.part2);
  const topTypes = getTopRiasecTypes(scores);

  return {
    scores,
    topTypes,
    isSuspicious: false,
    completedAt: Date.now(),
    testVersion: 2,
    extras: {
      favoriteSubjects: answers.part3 || [],
      workStyles: answers.part4 || {},
    },
  };
}

// ============================================================
// SIMULATION SCORING
// ============================================================

/**
 * Aggregate score impacts from simulation choices.
 *
 * @param impacts - Array of score impacts from each step
 * @returns Totaled score impacts
 */
export function aggregateSimulationScores(impacts: ScoreImpact[]): ScoreImpact {
  const total: ScoreImpact = {
    interest: 0,
    ability: 0,
    resilience: 0,
    workStyle: { analytical: 0, social: 0, creative: 0, technical: 0 },
  };

  for (const impact of impacts) {
    total.interest += impact.interest;
    total.ability += impact.ability;
    total.resilience += impact.resilience;
    total.workStyle.analytical += impact.workStyle.analytical;
    total.workStyle.social += impact.workStyle.social;
    total.workStyle.creative += impact.workStyle.creative;
    total.workStyle.technical += impact.workStyle.technical;
  }

  return total;
}

/**
 * Compute the dominant work style from aggregated scores.
 *
 * @param workStyle - Aggregated work style scores
 * @returns The dominant work style label
 */
export function getDominantWorkStyle(
  workStyle: ScoreImpact['workStyle']
): 'analytical' | 'social' | 'creative' | 'technical' {
  const entries = Object.entries(workStyle) as [keyof typeof workStyle, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

// ============================================================
// FINAL RANKING
// ============================================================

/**
 * Score a single simulation result for ranking purposes.
 * Uses the configured RANKING_WEIGHTS.
 *
 * Formula:
 *   finalScore = interest * 0.40
 *              + ability * 0.25
 *              + resilience * 0.20
 *              + workStyleFit * 0.15
 *
 * workStyleFit is the highest work style sub-score,
 * normalized to the same scale as the other dimensions.
 *
 * @param result - A completed simulation result
 * @returns Numeric score for ranking (higher = better fit)
 */
export function computeRankingScore(result: SimulationResult): number {
  const { totalScores } = result;

  // Get the dominant work style value as the "fit" score
  const workStyleValues = Object.values(totalScores.workStyle);
  const maxWorkStyle = Math.max(...workStyleValues);

  const score =
    totalScores.interest * RANKING_WEIGHTS.interest +
    totalScores.ability * RANKING_WEIGHTS.ability +
    totalScores.resilience * RANKING_WEIGHTS.resilience +
    maxWorkStyle * RANKING_WEIGHTS.workStyleFit;

  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Rank multiple simulation results and return top N.
 *
 * @param results - Record of profession ID -> simulation result
 * @param topN - Number of top results to return (default 3)
 * @returns Sorted array of [professionId, score] tuples
 */
export function rankProfessions(
  results: Record<string, SimulationResult>,
  topN: number = 3
): [string, number][] {
  const ranked = Object.entries(results)
    .map(([id, result]) => [id, computeRankingScore(result)] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return ranked.slice(0, topN);
}
