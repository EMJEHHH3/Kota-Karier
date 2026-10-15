import { describe, it, expect } from 'vitest';
import {
  aggregateRiasecScores,
  getTopRiasecTypes,
  detectSuspiciousAnswers,
  computeTestResult,
  aggregateSimulationScores,
  getDominantWorkStyle,
  computeRankingScore,
  rankProfessions,
  RANKING_WEIGHTS,
} from './scoring';
import type { TestAnswer, ScoreImpact, SimulationResult } from '../types';

describe('Scoring Logic', () => {
  describe('aggregateRiasecScores', () => {
    it('accurately tallies RIASEC answers', () => {
      const answers: TestAnswer[] = [
        { questionId: 'q1', chosenIndex: 0, timestamp: 1000 }, // Realistic
        { questionId: 'q2', chosenIndex: 1, timestamp: 4000 }, // Investigative
      ];

      const scores = aggregateRiasecScores(answers);
      expect(scores.Realistic).toBeGreaterThanOrEqual(1);
      expect(scores.Investigative).toBeGreaterThanOrEqual(1);
      expect(scores.Social).toBe(0);
    });
  });

  describe('getTopRiasecTypes', () => {
    it('returns top 2 types when third is far behind', () => {
      const scores = {
        Realistic: 10,
        Investigative: 8,
        Artistic: 2,
        Social: 1,
        Enterprising: 0,
        Conventional: 0,
      };

      const top = getTopRiasecTypes(scores);
      expect(top).toEqual(['Realistic', 'Investigative']);
    });

    it('returns top 3 types when third is within 1 point of second', () => {
      const scores = {
        Realistic: 10,
        Investigative: 8,
        Artistic: 7, // 8 - 1 = 7, so included!
        Social: 1,
        Enterprising: 0,
        Conventional: 0,
      };

      const top = getTopRiasecTypes(scores);
      expect(top).toEqual(['Realistic', 'Investigative', 'Artistic']);
    });
  });

  describe('detectSuspiciousAnswers', () => {
    it('detects uniform click streaks', () => {
      const uniformAnswers: TestAnswer[] = Array.from({ length: 8 }, (_, i) => ({
        questionId: `q${i + 1}`,
        chosenIndex: 0, // always chose index 0
        timestamp: 10000 + i * 3000,
      }));

      expect(detectSuspiciousAnswers(uniformAnswers)).toBe(true);
    });

    it('detects answers submitted unnaturally fast', () => {
      const fastAnswers: TestAnswer[] = Array.from({ length: 5 }, (_, i) => ({
        questionId: `q${i + 1}`,
        chosenIndex: i % 4,
        timestamp: 10000 + i * 500, // 500ms apart (threshold is 2000ms)
      }));

      expect(detectSuspiciousAnswers(fastAnswers)).toBe(true);
    });

    it('approves natural responses', () => {
      const naturalAnswers: TestAnswer[] = Array.from({ length: 6 }, (_, i) => ({
        questionId: `q${i + 1}`,
        chosenIndex: i % 4,
        timestamp: 10000 + i * 4000, // 4s apart
      }));

      expect(detectSuspiciousAnswers(naturalAnswers)).toBe(false);
    });
  });

  describe('computeTestResult', () => {
    it('produces a full TestResult object', () => {
      const answers: TestAnswer[] = [
        { questionId: 'q1', chosenIndex: 0, timestamp: 1000 },
        { questionId: 'q2', chosenIndex: 1, timestamp: 5000 },
      ];

      const result = computeTestResult(answers);
      expect(result.scores).toBeDefined();
      expect(result.topTypes.length).toBeGreaterThanOrEqual(2);
      expect(result.completedAt).toBeGreaterThan(0);
    });
  });

  describe('aggregateSimulationScores and workStyle', () => {
    it('aggregates impacts correctly across steps', () => {
      const impacts: ScoreImpact[] = [
        {
          interest: 2,
          ability: 1,
          resilience: 0,
          workStyle: { analytical: 2, social: 0, creative: 0, technical: 1 },
        },
        {
          interest: -1,
          ability: 2,
          resilience: 1,
          workStyle: { analytical: 1, social: 1, creative: 0, technical: 0 },
        },
      ];

      const total = aggregateSimulationScores(impacts);
      expect(total.interest).toBe(1);
      expect(total.ability).toBe(3);
      expect(total.resilience).toBe(1);
      expect(total.workStyle.analytical).toBe(3);

      const dominant = getDominantWorkStyle(total.workStyle);
      expect(dominant).toBe('analytical');
    });
  });

  describe('computeRankingScore & rankProfessions', () => {
    it('honors the defined RANKING_WEIGHTS summing to 1.0', () => {
      const sum =
        RANKING_WEIGHTS.interest +
        RANKING_WEIGHTS.ability +
        RANKING_WEIGHTS.resilience +
        RANKING_WEIGHTS.workStyleFit;
      expect(sum).toBeCloseTo(1.0);
    });

    it('ranks professions by computed score descending', () => {
      const makeResult = (interest: number, ability: number): SimulationResult => ({
        professionId: 'test',
        choices: [0, 1],
        totalScores: {
          interest,
          ability,
          resilience: 1,
          workStyle: { analytical: 2, social: 0, creative: 0, technical: 0 },
        },
        preInterest: 3,
        postEnjoyment: 4,
        mostExciting: 'Seru',
        mostBoring: 'Rapat',
        ekspektasiDelta: 1,
        completedAt: Date.now(),
      });

      const results = {
        dokter: makeResult(2, 3), // higher
        akuntan: makeResult(0, 1), // lower
      };

      const dokterScore = computeRankingScore(results.dokter);
      const akuntanScore = computeRankingScore(results.akuntan);
      expect(dokterScore).toBeGreaterThan(akuntanScore);

      const ranked = rankProfessions(results);
      expect(ranked[0][0]).toBe('dokter');
      expect(ranked[1][0]).toBe('akuntan');
      expect(ranked[0][1]).toBeGreaterThan(ranked[1][1]);
    });
  });
});

import { encodeResultCode, decodeResultCode } from './shareCode';

describe('Shareable Result Code', () => {
  it('generates an exact 8-character uppercase code and decodes cleanly', () => {
    const code = encodeResultCode(['Investigative', 'Social', 'Realistic'], ['dokter', 'software-engineer', 'perawat'], 5);
    expect(code).toHaveLength(8);
    expect(code).toBe(code.toUpperCase());

    const decoded = decodeResultCode(code);
    expect(decoded).not.toBeNull();
    expect(decoded?.topRiasec).toEqual(['Investigative', 'Social', 'Realistic']);
    expect(decoded?.topProfessions).toEqual(['dokter', 'software-engineer', 'perawat']);
    expect(decoded?.averageEnjoyment).toBe(5);
  });

  it('gracefully handles invalid codes', () => {
    expect(decodeResultCode('INVALID')).toBeNull();
    expect(decodeResultCode('12345678')).toBeNull();
  });
});
