/**
 * InterestTestPage — Tes Minat Karier Berbasis Tugas Kerja Nyata.
 * Route: /tes-minat
 *
 * 4 Bagian (Total 35 pertanyaan/langkah):
 * - Bagian 1: 24 kartu Aktivitas Kerja (4 per tipe RIASEC)
 * - Bagian 2: 6 skenario Hari Pertama Magang (pilih 1 dari 4)
 * - Bagian 3: 1 pertanyaan Mapel Favorit (pilih maks 3)
 * - Bagian 4: 4 pilihan A/B Gaya Kerja
 *
 * Skor dinormalisasi agar kompatibel penuh dengan sistem rekomendasi.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BAGIAN_1_CARDS,
  BAGIAN_2_SCENARIOS,
  BAGIAN_3_MAPEL,
  BAGIAN_4_GAYA_KERJA,
  getNonAdjacentShuffledCards,
  getShuffledScenarioOptions,
} from '../data/interestQuestions.js';
import { computeInterestTestResultV2 } from '../lib/scoring';
import { useUserState } from '../lib/context';
import { storage } from '../lib/storage';
import { BUILDINGS } from '../data/city';
import type { RiasecType } from '../types';

const PROGRESS_STORAGE_KEY = 'kota-karier-interest-test-progress';

const RIASEC_DESCRIPTIONS: Record<RiasecType, { label: string; desc: string }> = {
  Realistic: {
    label: 'Praktikal & Teknis (Realistic)',
    desc: 'Kamu menyukai hal nyata, bekerja langsung dengan alat, teknologi, mesin, atau fisik.',
  },
  Investigative: {
    label: 'Analitis & Peneliti (Investigative)',
    desc: 'Kamu senang menganalisis masalah rumit, mencari tahu alasan di balik hal-hal, dan berpikir logis.',
  },
  Artistic: {
    label: 'Kreatif & Ekspresif (Artistic)',
    desc: 'Kamu suka menciptakan ide orisinal, mengekspresikan diri melalui desain, tulisan, atau seni.',
  },
  Social: {
    label: 'Sosial & Menolong (Social)',
    desc: 'Kamu peduli sesama, senang mengajar, membantu, dan berkolaborasi dalam tim.',
  },
  Enterprising: {
    label: 'Inisiatif & Kepemimpinan (Enterprising)',
    desc: 'Kamu suka mengambil inisiatif, memimpin, bernegosiasi, dan melihat peluang wirausaha.',
  },
  Conventional: {
    label: 'Terstruktur & Rapi (Conventional)',
    desc: 'Kamu teliti, menyukai organisasi data, prosedur yang jelas, dan manajemen informasi.',
  },
};

interface TestDraftState {
  stage: 'b1' | 'pause1' | 'b2' | 'pause2' | 'b3' | 'pause3' | 'b4';
  b1Index: number;
  b1Answers: Record<string, 'mau_banget' | 'biasa_aja' | 'nggak_minat'>;
  b2Index: number;
  b2Answers: Record<string, string>; // scenarioId -> chosenOptionId
  b3Selected: string[]; // subject IDs (max 3)
  b4Index: number;
  b4Answers: Record<string, string>; // questionId -> chosenOptionId
  shuffledB1Cards: typeof BAGIAN_1_CARDS;
  shuffledB2Options: Record<string, any[]>;
}

export default function InterestTestPage() {
  const navigate = useNavigate();
  const { state, saveTestResult } = useUserState();

  // Check if saved draft exists in storage
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(() => {
    return Boolean(storage.getItem<TestDraftState>(PROGRESS_STORAGE_KEY));
  });

  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(Boolean(state.testResult));
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  // Test progression state
  const [stage, setStage] = useState<'b1' | 'pause1' | 'b2' | 'pause2' | 'b3' | 'pause3' | 'b4'>('b1');
  const [b1Index, setB1Index] = useState<number>(0);
  const [b1Answers, setB1Answers] = useState<Record<string, 'mau_banget' | 'biasa_aja' | 'nggak_minat'>>({});
  const [b2Index, setB2Index] = useState<number>(0);
  const [b2Answers, setB2Answers] = useState<Record<string, string>>({});
  const [b3Selected, setB3Selected] = useState<string[]>([]);
  const [b4Index, setB4Index] = useState<number>(0);
  const [b4Answers, setB4Answers] = useState<Record<string, string>>({});

  // Shuffled order of Part 1 cards (no two adjacent with same type)
  const [b1Cards, setB1Cards] = useState<typeof BAGIAN_1_CARDS>(() => getNonAdjacentShuffledCards());

  // Shuffled order of Part 2 scenario options
  const [b2OptionsMap, setB2OptionsMap] = useState<Record<string, any[]>>(() => {
    const map: Record<string, any[]> = {};
    BAGIAN_2_SCENARIOS.forEach((s) => {
      map[s.id] = getShuffledScenarioOptions(s);
    });
    return map;
  });

  // Touch and drag swipe state for Bagian 1
  const [dragOffset, setDragOffset] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<number>(0);

  // Autosave progress whenever answers change
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    const draft: TestDraftState = {
      stage,
      b1Index,
      b1Answers,
      b2Index,
      b2Answers,
      b3Selected,
      b4Index,
      b4Answers,
      shuffledB1Cards: b1Cards,
      shuffledB2Options: b2OptionsMap,
    };
    storage.setItem(PROGRESS_STORAGE_KEY, draft);
    setHasSavedDraft(true);
  }, [
    isStarted,
    isCompleted,
    stage,
    b1Index,
    b1Answers,
    b2Index,
    b2Answers,
    b3Selected,
    b4Index,
    b4Answers,
    b1Cards,
    b2OptionsMap,
  ]);

  // Handle ESC key for exit modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExitModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resume saved draft
  const handleResume = () => {
    const draft = storage.getItem<TestDraftState>(PROGRESS_STORAGE_KEY);
    if (draft) {
      setStage(draft.stage || 'b1');
      setB1Index(draft.b1Index || 0);
      setB1Answers(draft.b1Answers || {});
      setB2Index(draft.b2Index || 0);
      setB2Answers(draft.b2Answers || {});
      setB3Selected(draft.b3Selected || []);
      setB4Index(draft.b4Index || 0);
      setB4Answers(draft.b4Answers || {});
      if (draft.shuffledB1Cards && draft.shuffledB1Cards.length > 0) {
        setB1Cards(draft.shuffledB1Cards);
      }
      if (draft.shuffledB2Options) {
        setB2OptionsMap(draft.shuffledB2Options);
      }
    }
    setIsStarted(true);
    setIsCompleted(false);
  };

  // Start fresh test
  const handleStartFresh = () => {
    storage.removeItem(PROGRESS_STORAGE_KEY);
    setStage('b1');
    setB1Index(0);
    setB1Answers({});
    setB2Index(0);
    setB2Answers({});
    setB3Selected([]);
    setB4Index(0);
    setB4Answers({});
    const newCards = getNonAdjacentShuffledCards();
    setB1Cards(newCards);
    const newMap: Record<string, any[]> = {};
    BAGIAN_2_SCENARIOS.forEach((s) => {
      newMap[s.id] = getShuffledScenarioOptions(s);
    });
    setB2OptionsMap(newMap);
    setIsStarted(true);
    setIsCompleted(false);
    setHasSavedDraft(false);
  };

  // Compute total questions completed across 35 items
  const currentTotalQuestionNumber = useMemo(() => {
    if (stage === 'b1') return b1Index + 1;
    if (stage === 'pause1') return 24;
    if (stage === 'b2') return 24 + b2Index + 1;
    if (stage === 'pause2') return 30;
    if (stage === 'b3') return 31;
    if (stage === 'pause3') return 31;
    if (stage === 'b4') return 31 + b4Index + 1;
    return 35;
  }, [stage, b1Index, b2Index, b4Index]);

  const currentStageNumber = useMemo(() => {
    if (stage === 'b1' || stage === 'pause1') return 1;
    if (stage === 'b2' || stage === 'pause2') return 2;
    if (stage === 'b3' || stage === 'pause3') return 3;
    return 4;
  }, [stage]);

  // Finish test and calculate normalized score
  const handleFinishTest = useCallback(() => {
    const part1List = Object.entries(b1Answers).map(([cardId, rating]) => ({
      cardId,
      rating,
    }));
    const part2List = Object.entries(b2Answers).map(([scenarioId, chosenOptionId]) => ({
      scenarioId,
      chosenOptionId,
    }));

    const finalResult = computeInterestTestResultV2({
      part1: part1List,
      part2: part2List,
      part3: b3Selected,
      part4: b4Answers,
    });

    saveTestResult(finalResult);
    storage.removeItem(PROGRESS_STORAGE_KEY);
    setHasSavedDraft(false);
    setIsCompleted(true);
  }, [b1Answers, b2Answers, b3Selected, b4Answers, saveTestResult]);

  // Handlers for Bagian 1
  const handleRatePart1 = useCallback(
    (rating: 'mau_banget' | 'biasa_aja' | 'nggak_minat') => {
      const currentCard = b1Cards[b1Index];
      if (!currentCard) return;

      const nextAnswers = { ...b1Answers, [currentCard.id]: rating };
      setB1Answers(nextAnswers);
      setDragOffset(0);

      if (b1Index + 1 < b1Cards.length) {
        setB1Index((prev) => prev + 1);
      } else {
        setStage('pause1');
      }
    },
    [b1Cards, b1Index, b1Answers]
  );

  // Keyboard navigation for Bagian 1
  useEffect(() => {
    if (!isStarted || isCompleted || stage !== 'b1') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleRatePart1('mau_banget');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleRatePart1('biasa_aja');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleRatePart1('nggak_minat');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, isCompleted, stage, handleRatePart1]);

  // Drag / swipe handlers for Bagian 1
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (dragOffset > 70) {
      handleRatePart1('mau_banget');
    } else if (dragOffset < -70) {
      handleRatePart1('nggak_minat');
    }
    setDragOffset(0);
  };

  // Previous button handler
  const handleGoPrevious = () => {
    if (stage === 'b1') {
      if (b1Index > 0) setB1Index((prev) => prev - 1);
    } else if (stage === 'pause1') {
      setStage('b1');
      setB1Index(b1Cards.length - 1);
    } else if (stage === 'b2') {
      if (b2Index > 0) {
        setB2Index((prev) => prev - 1);
      } else {
        setStage('pause1');
      }
    } else if (stage === 'pause2') {
      setStage('b2');
      setB2Index(BAGIAN_2_SCENARIOS.length - 1);
    } else if (stage === 'b3') {
      setStage('pause2');
    } else if (stage === 'pause3') {
      setStage('b3');
    } else if (stage === 'b4') {
      if (b4Index > 0) {
        setB4Index((prev) => prev - 1);
      } else {
        setStage('pause3');
      }
    }
  };

  // Helper icon renderer (SVG line icons)
  const renderIcon = (iconName: string, size: number = 24) => {
    switch (iconName) {
      case 'wrench':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        );
      case 'hammer':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
            <path d="M17.64 15 22 10.64" />
            <path d="m20.91 3.26-6.36 6.36" />
          </svg>
        );
      case 'compass':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      case 'gears':
      case 'gear':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      case 'chart-line':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      case 'flask':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 2v7.31L4.1 19.4A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.7-2.6L14 9.31V2" />
            <line x1="8" y1="2" x2="16" y2="2" />
            <line x1="6.5" y1="16" x2="17.5" y2="16" />
          </svg>
        );
      case 'bug':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="8" height="14" x="8" y="6" rx="4" />
            <path d="m19 7-3 2" />
            <path d="m5 7 3 2" />
            <path d="m19 19-3-2" />
            <path d="m5 19 3-2" />
            <path d="M20 13h-4" />
            <path d="M4 13h4" />
            <path d="m10 4 1 2" />
            <path d="m14 4-1 2" />
          </svg>
        );
      case 'book-open':
      case 'book':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'palette':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
          </svg>
        );
      case 'pen-nib':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19 7-7 3 3-7 7-3-3z" />
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        );
      case 'video':
      case 'clapperboard':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
            <path d="m4 11 16-6" />
            <path d="m4 4 16 7" />
          </svg>
        );
      case 'sparkles':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        );
      case 'heart-pulse':
      case 'heart':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M12 5 9.04 11l6.35 2L12 21" />
          </svg>
        );
      case 'chalkboard-user':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="12" x="3" y="3" rx="2" />
            <path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
            <circle cx="12" cy="11" r="2" />
          </svg>
        );
      case 'hands-holding-child':
      case 'hand-holding-heart':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
            <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L15 13" />
          </svg>
        );
      case 'bullhorn':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3 11 18-5v12L3 13v-2z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
        );
      case 'users':
      case 'user':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'rocket':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          </svg>
        );
      case 'handshake':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a2 2 0 0 0 0-2.8l-3-3a2 2 0 0 0-2.8 0L9 13" />
            <path d="m3 11 6.6-6.6a2 2 0 0 1 2.8 0l3 3a2 2 0 0 1 0 2.8L9 17" />
          </svg>
        );
      case 'calculator':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="16" y1="14" x2="16" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
          </svg>
        );
      case 'folder-tree':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
            <path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 14.6 14H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
            <path d="M3 5v14a2 2 0 0 0 2 2h7" />
            <path d="M3 10h9" />
          </svg>
        );
      case 'clipboard-check':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="m9 14 2 2 4-4" />
          </svg>
        );
      case 'clock':
      case 'calendar-check':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  // -----------------------------------------------------------------
  // 1. RENDER COMPLETED SUMMARY
  // -----------------------------------------------------------------
  if (isCompleted && state.testResult) {
    const activeResult = state.testResult;
    const recommendedBuildings = BUILDINGS.filter(
      (b) => b.status === 'active' && b.riasec.some((r) => activeResult.topTypes.includes(r))
    );

    return (
      <div className="itest-wrapper">
        <div className="itest-stars-bg" aria-hidden="true" />
        <div className="itest-skyline-bg" aria-hidden="true" />

        {/* Header Bar matching Kantor Teknologi / BuildingInteriorPage */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-sm) var(--space-md)',
            borderBottom: '1px solid rgba(34, 211, 238, 0.25)',
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Link
              to="/"
              className="btn btn--ghost"
              style={{ fontSize: '0.55rem', minHeight: '36px', padding: '4px 10px' }}
              aria-label="Kembali ke kota"
            >
              ← Kota
            </Link>
            <h1 style={{ fontSize: '0.7rem', color: 'var(--color-accent-cyan)', margin: 0, fontFamily: 'var(--font-pixel)' }}>
              Pusat Informasi
            </h1>
          </div>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-accent-green)', fontFamily: 'var(--font-pixel)' }}>
            ✓ SELESAI
          </span>
        </header>

        <main className="container" style={{ paddingTop: '28px', paddingBottom: '48px', position: 'relative', zIndex: 10, maxWidth: '840px' }}>
          {/* Room Header Info matching Kantor Teknologi */}
          <div style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto 24px', width: '100%' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-accent-yellow, #fbbf24)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '6px',
                fontFamily: 'var(--font-body)',
              }}
            >
              HASIL EVALUASI MINAT
            </p>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 8px 0',
                fontFamily: 'var(--font-body)',
                letterSpacing: '-0.01em',
              }}
            >
              Kecenderungan Minat Kariermu
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary, #94a3b8)',
                fontSize: '0.875rem',
                margin: 0,
                lineHeight: 1.5,
                fontFamily: 'var(--font-body)',
              }}
            >
              Hasil ini memetakan preferensi aktivitas kerja nyata untuk membantumu mengeksplorasi gedung kota dengan lebih terarah.
            </p>
          </div>

          {/* Top RIASEC Types */}
          <section className="panel" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: 'var(--color-accent-yellow)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-star" aria-hidden="true" />
              Top Minat Terbesar
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeResult.topTypes.map((type) => {
                const info = RIASEC_DESCRIPTIONS[type];
                const score = activeResult.scores[type];
                return (
                  <div
                    key={type}
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-accent-cyan)' }}>
                        {info.label}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-yellow)', fontFamily: 'var(--font-pixel)' }}>
                        Skor: {score} / 10
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {info.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recommended Buildings */}
          <section className="panel" style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: 'var(--color-accent-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-city" aria-hidden="true" />
              Gedung Kota yang Direkomendasikan
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recommendedBuildings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '6px',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {b.nama}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {b.deskripsi}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/gedung/${b.id}`)}
                    className="btn btn--primary"
                    style={{ padding: '6px 14px', fontSize: '0.65rem' }}
                  >
                    Kunjungi Gedung →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn btn--primary">
              <i className="fa-solid fa-map" style={{ marginRight: '6px' }} aria-hidden="true" />
              Jelajahi Kota Sekarang
            </Link>
            <button
              type="button"
              onClick={handleStartFresh}
              className="btn btn--ghost"
            >
              Ulangi Tes
            </button>
            <Link to="/hasil" className="btn">
              Lihat Ringkasan Hasil →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 2. RENDER START SCREEN
  // -----------------------------------------------------------------
  if (!isStarted) {
    return (
      <div className="itest-wrapper">
        <div className="itest-stars-bg" aria-hidden="true" />
        <div className="itest-skyline-bg" aria-hidden="true" />

        {/* Header Bar matching Kantor Teknologi / BuildingInteriorPage */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-sm) var(--space-md)',
            borderBottom: '1px solid rgba(34, 211, 238, 0.25)',
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Link
              to="/"
              className="btn btn--ghost"
              style={{ fontSize: '0.55rem', minHeight: '36px', padding: '4px 10px' }}
              aria-label="Kembali ke kota"
            >
              ← Kota
            </Link>
            <h1 style={{ fontSize: '0.7rem', color: 'var(--color-accent-cyan)', margin: 0, fontFamily: 'var(--font-pixel)' }}>
              Pusat Informasi
            </h1>
          </div>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-accent-yellow)', fontFamily: 'var(--font-pixel)' }}>
            TES MINAT
          </span>
        </header>

        <main className="container" style={{ paddingTop: '28px', paddingBottom: '48px', position: 'relative', zIndex: 10, maxWidth: '640px' }}>
          {/* Room Header Info matching Kantor Teknologi */}
          <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto 24px', width: '100%' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-accent-yellow, #fbbf24)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '6px',
                fontFamily: 'var(--font-body)',
              }}
            >
              AREA EKSPLORASI
            </p>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 8px 0',
                fontFamily: 'var(--font-body)',
                letterSpacing: '-0.01em',
              }}
            >
              Tes Minat & Gaya Kerja
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary, #94a3b8)',
                fontSize: '0.875rem',
                margin: 0,
                lineHeight: 1.5,
                fontFamily: 'var(--font-body)',
              }}
            >
              Kenali kecenderungan minat dan bakatmu lewat simulasi tugas kerja nyata untuk menemukan gedung kota yang tepat.
            </p>
          </div>

          <div className="panel" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
            <div className="itest-card-icon-bubble" style={{ width: '64px', height: '64px', margin: '0 auto 16px' }}>
              <i className="fa-solid fa-compass" style={{ fontSize: '1.75rem', color: 'var(--color-accent-cyan)' }} aria-hidden="true" />
            </div>

            <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-pixel)', color: 'var(--color-accent-cyan)', margin: '0 0 12px 0' }}>
              Petualangan Dimulai
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Sekitar 5 menit · 35 langkah interaktif · Tanpa jawaban benar atau salah. Hasil tes langsung memetakan rekomendasi gedung kota dan profesi yang paling cocok untukmu.
            </p>

            {hasSavedDraft ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleResume}
                  className="btn btn--primary"
                  style={{ width: '100%', maxWidth: '280px', padding: '12px 20px', fontSize: '0.68rem' }}
                >
                  <i className="fa-solid fa-play" style={{ marginRight: '6px' }} aria-hidden="true" />
                  Lanjutkan Tes
                </button>
                <button
                  type="button"
                  onClick={handleStartFresh}
                  className="btn btn--ghost"
                  style={{ width: '100%', maxWidth: '280px', fontSize: '0.62rem' }}
                >
                  Mulai Ulang dari Awal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartFresh}
                className="btn btn--primary"
                style={{ padding: '12px 32px', fontSize: '0.72rem' }}
              >
                <i className="fa-solid fa-bolt" style={{ marginRight: '8px' }} aria-hidden="true" />
                Mulai Tes Minat →
              </button>
            )}

            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '20px', marginBottom: 0 }}>
              *Progres tersimpan otomatis di perangkatmu. Kamu bisa keluar kapan saja dan melanjutkan nanti.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 3. RENDER ACTIVE TEST SECTIONS & INTERMISSIONS
  // -----------------------------------------------------------------
  const currentCard = b1Cards[b1Index];
  const currentScenario = BAGIAN_2_SCENARIOS[b2Index];
  const currentScenarioOptions = currentScenario ? (b2OptionsMap[currentScenario.id] || currentScenario.opsi) : [];
  const currentWorkStyle = BAGIAN_4_GAYA_KERJA[b4Index];

  return (
    <div className="itest-wrapper">
      <div className="itest-stars-bg" aria-hidden="true" />
      <div className="itest-skyline-bg" aria-hidden="true" />

      {/* Header Bar matching Kantor Teknologi / BuildingInteriorPage */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-sm) var(--space-md)',
          borderBottom: '1px solid rgba(34, 211, 238, 0.25)',
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="btn btn--ghost"
            style={{ fontSize: '0.55rem', minHeight: '36px', padding: '4px 10px' }}
            aria-label="Kembali ke kota"
          >
            ← Kota
          </button>
          <h1 style={{ fontSize: '0.7rem', color: 'var(--color-accent-cyan)', margin: 0, fontFamily: 'var(--font-pixel)' }}>
            Pusat Informasi
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-accent-yellow)', fontFamily: 'var(--font-pixel)' }}>
            Bagian {currentStageNumber}/4
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.65rem' }}>·</span>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-pixel)' }}>
            Soal {currentTotalQuestionNumber}/35
          </span>
        </div>
      </header>

      {/* MINI ROAD PROGRESS BAR (JALAN KOTA) */}
      <div className="itest-road-wrapper">
        <div className="itest-road-track">
          <div className="itest-road-line" aria-hidden="true" />
          {[
            { id: 1, label: 'Aktivitas' },
            { id: 2, label: 'Magang' },
            { id: 3, label: 'Mapel' },
            { id: 4, label: 'Gaya Kerja' },
          ].map((milestone) => {
            const isActive = currentStageNumber === milestone.id;
            const isPassed = currentStageNumber > milestone.id;
            return (
              <div
                key={milestone.id}
                className={`itest-road-stop ${isActive ? 'itest-road-stop--active' : ''} ${isPassed ? 'itest-road-stop--passed' : ''}`}
              >
                <div className="itest-road-dot" />
              </div>
            );
          })}
        </div>
        <div className="itest-road-labels">
          <span className={currentStageNumber === 1 ? 'itest-road-label--active' : ''}>1. Aktivitas</span>
          <span className={currentStageNumber === 2 ? 'itest-road-label--active' : ''}>2. Magang</span>
          <span className={currentStageNumber === 3 ? 'itest-road-label--active' : ''}>3. Mapel</span>
          <span className={currentStageNumber === 4 ? 'itest-road-label--active' : ''}>4. Gaya Kerja</span>
        </div>
      </div>

      <main className="container" style={{ paddingTop: '8px', paddingBottom: '48px', position: 'relative', zIndex: 10, maxWidth: '680px' }}>
        {/* ============================================================= */}
        {/* BAGIAN 1: AKTIVITAS KERJA (24 KARTU)                          */}
        {/* ============================================================= */}
        {stage === 'b1' && currentCard && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--itest-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Bagian 1: Aktivitas Kerja ({b1Index + 1} / {b1Cards.length})
              </span>
              <p style={{ fontSize: '0.9375rem', color: 'var(--itest-text-soft)', margin: '4px 0 0 0' }}>
                Seberapa mau kamu mengerjakan ini sebagai pekerjaan?
              </p>
            </div>

            {/* Card Stack with touch/drag support */}
            <div className="itest-stack-container">
              <div className="itest-card-under" aria-hidden="true" />
              <div
                className="itest-card-active"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                }}
              >
                <div className="itest-card-icon-bubble">
                  {renderIcon(currentCard.ikon, 32)}
                </div>

                <h2 className="itest-card-question">
                  {currentCard.teks}
                </h2>

                <div className="itest-rating-actions">
                  <button
                    type="button"
                    onClick={() => handleRatePart1('nggak_minat')}
                    className="itest-btn-rating itest-btn-rating--dislike"
                    aria-label="Nggak minat (Panah Kiri)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span>Nggak minat</span>
                    <span className="itest-key-hint">← Kiri</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRatePart1('biasa_aja')}
                    className="itest-btn-rating itest-btn-rating--neutral"
                    aria-label="Biasa aja (Panah Bawah)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Biasa aja</span>
                    <span className="itest-key-hint">↓ Bawah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRatePart1('mau_banget')}
                    className="itest-btn-rating itest-btn-rating--like"
                    aria-label="Mau banget (Panah Kanan)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Mau banget</span>
                    <span className="itest-key-hint">→ Kanan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Row */}
            <div className="itest-nav-row" style={{ maxWidth: '540px', margin: '20px auto 0' }}>
              <button
                type="button"
                onClick={handleGoPrevious}
                disabled={b1Index === 0}
                className="itest-btn-prev"
                style={{ visibility: b1Index === 0 ? 'hidden' : 'visible' }}
              >
                ← Sebelumnya
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--itest-text-faint)' }}>
                Tersimpan otomatis
              </span>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* JEDA 1 (SETELAH BAGIAN 1)                                     */}
        {/* ============================================================= */}
        {stage === 'pause1' && (
          <div className="itest-pause-card">
            <h2 className="itest-pause-title">Bagian 1 Selesai!</h2>
            <p className="itest-pause-desc">
              Pilihan 24 aktivitas kerjamu sudah tersimpan. Sekarang, bayangkan kamu sedang menjalani hari pertama magang di berbagai lingkungan kerja. Tugas apa yang paling ingin kamu kerjakan?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleGoPrevious}
                className="itest-btn-prev"
              >
                ← Cek Bagian 1
              </button>
              <button
                type="button"
                onClick={() => setStage('b2')}
                className="itest-btn-primary"
              >
                Lanjut ke Bagian 2 (Magang) →
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* BAGIAN 2: HARI PERTAMA MAGANG (6 SKENARIO)                    */}
        {/* ============================================================= */}
        {stage === 'b2' && currentScenario && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--itest-yellow)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Bagian 2: Hari Pertama Magang ({b2Index + 1} / {BAGIAN_2_SCENARIOS.length})
              </span>
            </div>

            {/* Scenario Header with Building Silhouette */}
            <div className="itest-intern-header">
              <div className="itest-intern-icon-frame">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 className="itest-intern-title">{currentScenario.tempat}</h2>
                <p className="itest-intern-sub">Tugas mana yang paling kamu mau?</p>
              </div>
            </div>

            {/* 4 Option Cards */}
            <div className="itest-options-grid">
              {currentScenarioOptions.map((opt) => {
                const isSelected = b2Answers[currentScenario.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      const next = { ...b2Answers, [currentScenario.id]: opt.id };
                      setB2Answers(next);
                      if (b2Index + 1 < BAGIAN_2_SCENARIOS.length) {
                        setB2Index((prev) => prev + 1);
                      } else {
                        setStage('pause2');
                      }
                    }}
                    className={`itest-option-card ${isSelected ? 'itest-option-card--selected' : ''}`}
                  >
                    <div style={{ color: 'var(--itest-cyan)', flexShrink: 0 }}>
                      {renderIcon(opt.ikon, 22)}
                    </div>
                    <span className="itest-option-text">{opt.teks}</span>
                  </button>
                );
              })}
            </div>

            <div className="itest-nav-row">
              <button
                type="button"
                onClick={handleGoPrevious}
                className="itest-btn-prev"
              >
                ← Sebelumnya
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--itest-text-faint)' }}>
                Pilih salah satu tugas untuk lanjut
              </span>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* JEDA 2 (SETELAH BAGIAN 2)                                     */}
        {/* ============================================================= */}
        {stage === 'pause2' && (
          <div className="itest-pause-card">
            <h2 className="itest-pause-title">Bagian 2 Selesai!</h2>
            <p className="itest-pause-desc">
              Pilihan tugas magangmu sudah tercatat. Selanjutnya, mari kita lihat mata pelajaran apa saja yang paling kamu minati di sekolah.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleGoPrevious}
                className="itest-btn-prev"
              >
                ← Cek Magang
              </button>
              <button
                type="button"
                onClick={() => setStage('b3')}
                className="itest-btn-primary"
              >
                Lanjut ke Bagian 3 (Mapel) →
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* BAGIAN 3: MAPEL FAVORIT (PILIH MAKSIMAL 3)                    */}
        {/* ============================================================= */}
        {stage === 'b3' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--itest-green)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Bagian 3: Mapel Favoritmu
              </span>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--itest-text)', margin: '6px 0 8px 0', fontWeight: 700 }}>
                Pilih maksimal 3 mata pelajaran yang paling kamu sukai
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--itest-text-soft)', margin: 0 }}>
                {b3Selected.length} dari 3 dipilih
              </p>
            </div>

            <div className="itest-chips-wrap" style={{ justifyContent: 'center' }}>
              {BAGIAN_3_MAPEL.map((subject) => {
                const isSelected = b3Selected.includes(subject.id);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setB3Selected((prev) => prev.filter((id) => id !== subject.id));
                      } else if (b3Selected.length < 3) {
                        setB3Selected((prev) => [...prev, subject.id]);
                      }
                    }}
                    className={`itest-chip ${isSelected ? 'itest-chip--selected' : ''}`}
                    aria-pressed={isSelected}
                  >
                    {renderIcon(subject.ikon, 16)}
                    <span>{subject.nama}</span>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="itest-nav-row">
              <button
                type="button"
                onClick={handleGoPrevious}
                className="itest-btn-prev"
              >
                ← Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setStage('pause3')}
                disabled={b3Selected.length === 0}
                className="itest-btn-primary"
              >
                Lanjut ({b3Selected.length} dipilih) →
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* JEDA 3 (SETELAH BAGIAN 3)                                     */}
        {/* ============================================================= */}
        {stage === 'pause3' && (
          <div className="itest-pause-card">
            <h2 className="itest-pause-title">Bagian 3 Selesai!</h2>
            <p className="itest-pause-desc">
              Tinggal satu langkah lagi. Terakhir, tentukan gaya kerja yang paling nyaman untuk keseharianmu.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleGoPrevious}
                className="itest-btn-prev"
              >
                ← Cek Mapel
              </button>
              <button
                type="button"
                onClick={() => setStage('b4')}
                className="itest-btn-primary"
              >
                Lanjut ke Bagian 4 (Gaya Kerja) →
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* BAGIAN 4: GAYA KERJA (4 PASANGAN A/B)                         */}
        {/* ============================================================= */}
        {stage === 'b4' && currentWorkStyle && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--itest-purple)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Bagian 4: Gaya Kerja ({b4Index + 1} / {BAGIAN_4_GAYA_KERJA.length})
              </span>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--itest-text)', margin: '6px 0 0 0', fontWeight: 700 }}>
                Mana yang lebih mencerminkan dirimu?
              </h2>
            </div>

            <div className="itest-ab-grid">
              {/* Opsi A */}
              <button
                type="button"
                onClick={() => {
                  const next = { ...b4Answers, [currentWorkStyle.id]: currentWorkStyle.opsiA.id };
                  setB4Answers(next);
                  if (b4Index + 1 < BAGIAN_4_GAYA_KERJA.length) {
                    setB4Index((prev) => prev + 1);
                  } else {
                    handleFinishTest();
                  }
                }}
                className={`itest-ab-card ${b4Answers[currentWorkStyle.id] === currentWorkStyle.opsiA.id ? 'itest-ab-card--selected' : ''}`}
              >
                <div style={{ color: 'var(--itest-cyan)' }}>
                  {renderIcon(currentWorkStyle.opsiA.ikon, 32)}
                </div>
                <span className="itest-ab-label">{currentWorkStyle.opsiA.teks}</span>
              </button>

              {/* Opsi B */}
              <button
                type="button"
                onClick={() => {
                  const next = { ...b4Answers, [currentWorkStyle.id]: currentWorkStyle.opsiB.id };
                  setB4Answers(next);
                  if (b4Index + 1 < BAGIAN_4_GAYA_KERJA.length) {
                    setB4Index((prev) => prev + 1);
                  } else {
                    handleFinishTest();
                  }
                }}
                className={`itest-ab-card ${b4Answers[currentWorkStyle.id] === currentWorkStyle.opsiB.id ? 'itest-ab-card--selected' : ''}`}
              >
                <div style={{ color: 'var(--itest-yellow)' }}>
                  {renderIcon(currentWorkStyle.opsiB.ikon, 32)}
                </div>
                <span className="itest-ab-label">{currentWorkStyle.opsiB.teks}</span>
              </button>
            </div>

            <div className="itest-nav-row">
              <button
                type="button"
                onClick={handleGoPrevious}
                className="itest-btn-prev"
              >
                ← Sebelumnya
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--itest-text-faint)' }}>
                {b4Index === BAGIAN_4_GAYA_KERJA.length - 1 ? 'Pilihan terakhir menyelesaikan tes' : 'Pilih salah satu untuk lanjut'}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================= */}
      {/* DIALOG KONFIRMASI KELUAR (ESC BISA TUTUP)                     */}
      {/* ============================================================= */}
      {showExitModal && (
        <div
          className="itest-modal-backdrop"
          onClick={() => setShowExitModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-exit-title"
        >
          <div
            className="itest-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-exit-title" className="itest-modal-title">
              Keluar dari Tes Minat?
            </h3>
            <p className="itest-modal-desc">
              Progres kamu tersimpan, kamu bisa lanjut nanti.
            </p>
            <div className="itest-modal-actions">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="itest-btn-prev"
                style={{ color: 'var(--itest-red)', borderColor: 'rgba(248, 113, 113, 0.4)' }}
              >
                Keluar
              </button>
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="itest-btn-primary"
              >
                Lanjut tes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
