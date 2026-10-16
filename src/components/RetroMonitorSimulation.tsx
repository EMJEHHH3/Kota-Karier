/**
 * RetroMonitorSimulation — Interactive CRT retro monitor day simulation
 * for IT & computer-based professions.
 *
 * Features:
 * - 100% CSS/SVG retro CRT casing, stand, and desk styling (no external images)
 * - Monospace terminal with scanlines, phosphor glow, flicker, and screen shake
 * - Pattern-matching command validation without eval/exec
 * - Step-by-step typing mechanic with friendly error handling & hints after 2 misses
 * - In-monitor pop-up World Events with branching choices and consequences
 * - Clock progression from 08.00 to 16.00 WIB
 * - Final terminal "LOG KERJA" screen with score breakdown and export to HASILKU
 * - Road-sign task board on the right side showing live task progress
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TerminalSimulation, TerminalTask, TerminalEvent } from '../types/terminalSimulation';
import type { ScoreImpact, SimulationResult } from '../types';
import { testCommandPattern } from '../lib/terminalMatcher';
import { retroSound } from '../lib/sound';
import { aggregateSimulationScores } from '../lib/scoring';
import { useUserState } from '../lib/context';

interface RetroMonitorSimulationProps {
  simulation: TerminalSimulation;
  preInterest: number;
  onFinish?: (result: SimulationResult) => void;
  onExit: () => void;
}

interface LogEntry {
  id: string;
  type: 'system' | 'prompt' | 'output' | 'error' | 'success';
  text: string;
  timestamp?: string;
}

export default function RetroMonitorSimulation({
  simulation,
  preInterest,
  onFinish,
  onExit,
}: RetroMonitorSimulationProps) {
  const { saveSimulationResult } = useUserState();
  const idRef = useRef<number>(1);

  // Progress state
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>(simulation.jamMulai);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [_totalErrors, setTotalErrors] = useState<number>(0);
  const [_hintsUsed, setHintsUsed] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [subStepPhase, setSubStepPhase] = useState<number>(0);
  const [lastCompletedIndex, setLastCompletedIndex] = useState<number | null>(null);

  // Sound & animation states
  const [isMuted, setIsMuted] = useState<boolean>(retroSound.muted);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);

  // World Event state
  const [activeEvent, setActiveEvent] = useState<TerminalEvent | null>(null);
  const [eventConsequence, setEventConsequence] = useState<{
    text: string;
    choiceIdx: number;
    choiceText: string;
  } | null>(null);
  const [_eventHistory, setEventHistory] = useState<
    Array<{ eventTitle: string; choiceText: string; consequence: string }>
  >([]);

  // Scores & logs
  const [accumulatedImpacts, setAccumulatedImpacts] = useState<ScoreImpact[]>([]);
  const [chosenEventIndices, setChosenEventIndices] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Post-evaluation state in Log Kerja
  const [postEnjoyment, setPostEnjoyment] = useState<number>(4);
  const [mostExciting, setMostExciting] = useState<string>('');
  const [mostBoring, setMostBoring] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Clean initial terminal log (no long banner wall of text)
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'boot-1',
      type: 'system',
      text: `KOTA-OS // TERMINAL [${simulation.jamMulai} WIB]`,
    },
  ]);

  const sceneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const eventDialogRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolledRef = useRef(false);

  // Smooth scroll once when starting simulation so monitor is visible
  useEffect(() => {
    if (!hasInitialScrolledRef.current) {
      hasInitialScrolledRef.current = true;
      sceneRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Auto-scroll ONLY inside the terminal output area, never on window/page
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [logs]);

  // Focus input without scrolling page
  const focusInput = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  // Finish day simulation
  const finishSimulation = useCallback(() => {
    setCurrentTime(simulation.jamSelesai);
    setIsCompleted(true);
    retroSound.playSuccess();
  }, [simulation.jamSelesai]);

  // Inspect current item in sequence
  const currentItem = simulation.urutan[stepIndex];

  // Trigger World Event if current step is an event
  useEffect(() => {
    if (!currentItem) {
      finishSimulation();
      return;
    }

    if (currentItem.tipe === 'event') {
      const eventData = currentItem.data;
      setActiveEvent(eventData);
      setEventConsequence(null);
      setCurrentTime(eventData.jam);

      // Trigger retro screen shake & audio ding
      setIsScreenShaking(true);
      retroSound.playEventDing();
      const shakeTimer = setTimeout(() => setIsScreenShaking(false), 450);

      return () => clearTimeout(shakeTimer);
    } else {
      // Update clock to task time
      setCurrentTime(currentItem.data.jam);
    }
  }, [stepIndex, currentItem, finishSimulation]);

  // Shift focus to event dialog safely with preventScroll
  useEffect(() => {
    if (activeEvent) {
      eventDialogRef.current?.focus({ preventScroll: true });
    }
  }, [activeEvent]);

  const handleToggleMute = () => {
    const muted = retroSound.toggleMute();
    setIsMuted(muted);
  };

  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    retroSound.playKeypress();
  };

  // Submit command
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || currentItem.tipe !== 'tugas' || !currentInput.trim()) return;

    const task: TerminalTask = currentItem.data;
    const submittedText = currentInput.trim();
    const activePrompt =
      subStepPhase === 1 && task.subLangkah
        ? task.subLangkah.promptLanjutan
        : task.prompt;

    // Log the user's command
    const promptEntry: LogEntry = {
      id: `cmd-${idRef.current++}`,
      type: 'prompt',
      text: `${activePrompt}${submittedText}`,
      timestamp: currentTime,
    };

    // Sub-step phase logic (e.g. variable assignment first, then print)
    if (task.subLangkah && subStepPhase === 0) {
      // Check if user did full combined command in one go
      const isFullMatch = testCommandPattern(submittedText, task.polaJawabanBenar);
      if (isFullMatch) {
        handleTaskSuccess(promptEntry, task.outputBenar);
        return;
      }

      // Check if user did the first step
      const isFirstMatch = testCommandPattern(submittedText, task.subLangkah.polaAwal);
      if (isFirstMatch) {
        retroSound.playSuccess();
        setLogs((prev) => [
          ...prev.slice(-3),
          promptEntry,
          {
            id: `out-${idRef.current++}`,
            type: 'output',
            text: `${task.subLangkah!.outputAwal}`,
          },
        ]);
        setCurrentInput('');
        setSubStepPhase(1);
        setWrongAttempts(0);
        focusInput();
        return;
      }
    } else if (task.subLangkah && subStepPhase === 1) {
      // User is on second phase of sub-step
      const isSecondMatch = testCommandPattern(
        submittedText,
        task.subLangkah.polaLanjutan
      );
      if (isSecondMatch) {
        handleTaskSuccess(promptEntry, task.subLangkah.outputLanjutan);
        return;
      }
    } else {
      // Standard single-step task
      const isMatch = testCommandPattern(submittedText, task.polaJawabanBenar);
      if (isMatch) {
        handleTaskSuccess(promptEntry, task.outputBenar);
        return;
      }
    }

    // --- WRONG ANSWER ---
    retroSound.playError();
    const newWrongCount = wrongAttempts + 1;
    setWrongAttempts(newWrongCount);
    setTotalErrors((prev) => prev + 1);

    const errorMessage =
      task.pesanError ||
      `Perintah belum sesuai format. Coba periksa petunjuk di atas.`;

    setLogs((prev) => [
      ...prev.slice(-3),
      promptEntry,
      {
        id: `err-${idRef.current++}`,
        type: 'error',
        text: `[ERROR] ${errorMessage}${
          newWrongCount >= 2 ? `\n[PETUNJUK] Tombol petunjuk siap digunakan di bawah!` : ''
        }`,
      },
    ]);
    setCurrentInput('');
    focusInput();
  };

  const handleTaskSuccess = (
    promptEntry: LogEntry,
    outputText: string
  ) => {
    retroSound.playSuccess();

    // Reward score for completing task
    const taskImpact: ScoreImpact = {
      interest: 1,
      ability: wrongAttempts === 0 ? 2 : 1,
      resilience: 1,
      workStyle: {
        analytical: 1,
        social: 0,
        creative: 0,
        technical: 2,
      },
    };
    setAccumulatedImpacts((prev) => [...prev, taskImpact]);

    // Clean output: Program output only + single status line "✓ Berhasil"
    // Remove duplicate [OK] and [BERHASIL] lines
    const cleanOutput = outputText.replace(/\n*\[OK\].*$/is, '').trim();

    setLogs((prev) => {
      // Keep only recent logs so the terminal doesn't become a wall of text
      const recent = prev.slice(-2);
      return [
        ...recent,
        promptEntry,
        {
          id: `out-${Date.now()}`,
          type: 'success',
          text: `${cleanOutput}\n✓ Berhasil`,
        },
      ];
    });

    // Mark current task completed for road-sign animation
    setLastCompletedIndex(stepIndex);
    setTimeout(() => setLastCompletedIndex(null), 600);

    setCurrentInput('');
    setWrongAttempts(0);
    setSubStepPhase(0);
    focusInput();

    // Proceed to next sequence step
    setTimeout(() => {
      if (stepIndex + 1 < simulation.urutan.length) {
        setStepIndex((prev) => prev + 1);
      } else {
        finishSimulation();
      }
    }, 600);
  };

  // Skip current task
  const handleSkipTask = () => {
    if (!currentItem || currentItem.tipe !== 'tugas') return;
    const task = currentItem.data;

    retroSound.playKeypress();
    setLogs((prev) => [
      ...prev.slice(-2),
      {
        id: `skip-${idRef.current++}`,
        type: 'system',
        text: `[LEWATI] ${task.contohPerintah}\n${task.outputBenar.replace(/\n*\[OK\].*$/is, '').trim()}\n✓ Selesai`,
      },
    ]);

    setLastCompletedIndex(stepIndex);
    setTimeout(() => setLastCompletedIndex(null), 600);

    setWrongAttempts(0);
    setSubStepPhase(0);
    setCurrentInput('');
    focusInput();

    if (stepIndex + 1 < simulation.urutan.length) {
      setStepIndex((prev) => prev + 1);
    } else {
      finishSimulation();
    }
  };

  // Open Hint
  const handleOpenHint = () => {
    if (!currentItem || currentItem.tipe !== 'tugas') return;
    setHintsUsed((prev) => prev + 1);
    setShowHintModal(true);
    retroSound.playKeypress();
  };

  // Event choice selection
  const handleSelectEventChoice = (choiceIndex: number) => {
    if (!activeEvent) return;
    const choice = activeEvent.pilihan[choiceIndex];

    retroSound.playKeypress();
    setAccumulatedImpacts((prev) => [...prev, choice.dampak]);
    setChosenEventIndices((prev) => [...prev, choiceIndex]);

    if (choice.jamBaru) {
      setCurrentTime(choice.jamBaru);
    }

    setEventConsequence({
      text: choice.konsekuensi,
      choiceIdx: choiceIndex,
      choiceText: choice.teks,
    });

    setEventHistory((prev) => [
      ...prev,
      {
        eventTitle: activeEvent.judul,
        choiceText: choice.teks,
        consequence: choice.konsekuensi,
      },
    ]);
  };

  // Close Event dialog and resume tasks
  const handleCloseEvent = () => {
    if (activeEvent && eventConsequence) {
      // Short 1-line consequence in terminal
      const shortChoice = eventConsequence.choiceText.split('—')[0].trim();
      const firstImpactSentence = eventConsequence.text.split('.')[0];
      setLogs((prev) => {
        const recent = prev.slice(-2);
        return [
          ...recent,
          {
            id: `ev-log-${idRef.current++}`,
            type: 'system',
            text: `[EVENT] ${shortChoice}: ${firstImpactSentence}. (${currentTime} WIB)`,
          },
        ];
      });
    }

    setLastCompletedIndex(stepIndex);
    setTimeout(() => setLastCompletedIndex(null), 600);

    setActiveEvent(null);
    setEventConsequence(null);
    focusInput();

    if (stepIndex + 1 < simulation.urutan.length) {
      setStepIndex((prev) => prev + 1);
    } else {
      finishSimulation();
    }
  };

  // Save results to user state & context
  const handleSaveResult = () => {
    const totalScores = aggregateSimulationScores(accumulatedImpacts);
    const ekspektasiDelta = postEnjoyment - preInterest;

    const result: SimulationResult = {
      professionId: simulation.profesi,
      choices: chosenEventIndices,
      totalScores,
      preInterest,
      postEnjoyment,
      mostExciting: mostExciting.trim() || 'Menyelesaikan tantangan di terminal',
      mostBoring: mostBoring.trim() || 'Menganalisis galat kode dan syntax error',
      ekspektasiDelta,
      completedAt: Date.now(),
    };

    saveSimulationResult(result);
    setIsSaved(true);

    if (onFinish) {
      onFinish(result);
    }
  };

  // Restart simulation
  const handleRestart = () => {
    setStepIndex(0);
    setCurrentTime(simulation.jamMulai);
    setCurrentInput('');
    setWrongAttempts(0);
    setTotalErrors(0);
    setHintsUsed(0);
    setSubStepPhase(0);
    setLastCompletedIndex(null);
    setActiveEvent(null);
    setEventConsequence(null);
    setEventHistory([]);
    setAccumulatedImpacts([]);
    setChosenEventIndices([]);
    setIsCompleted(false);
    setIsSaved(false);
    setLogs([
      {
        id: `boot-restart-${Date.now()}`,
        type: 'system',
        text: `KOTA-OS // TERMINAL [${simulation.jamMulai} WIB]`,
      },
    ]);
  };

  // Consistent task numbering calculation (matches road-sign board)
  const totalTasks = simulation.urutan.filter((i) => i.tipe === 'tugas').length;
  const currentTaskNumber =
    simulation.urutan.slice(0, stepIndex + 1).filter((i) => i.tipe === 'tugas').length;

  // Current task guidance text
  const currentTask: TerminalTask | null =
    currentItem && currentItem.tipe === 'tugas' ? currentItem.data : null;

  const activePromptText =
    currentTask?.subLangkah && subStepPhase === 1
      ? currentTask.subLangkah.promptLanjutan
      : currentTask?.prompt || '>>> ';

  const activeGuideText =
    currentTask?.subLangkah && subStepPhase === 1
      ? currentTask.subLangkah.panduanLanjutan
      : currentTask?.penjelasan || currentTask?.panduan || 'Menunggu jadwal pekerjaan...';

  // Calculate aggregated scores for final display
  const finalScores = aggregateSimulationScores(accumulatedImpacts);

  return (
    <div
      ref={sceneRef}
      className="retro-desk-scene"
      onClick={focusInput}
      style={{ overflowAnchor: 'none' }}
    >
      {/* ============================================================
          WORKSTATION LAYOUT: [CLIPBOARD] [MONITOR-COLUMN]
          ============================================================ */}
      <div className="retro-workstation-layout">
        {/* ============================================================
            CLIPBOARD TUGAS DI SISI KIRI MONITOR (tasks only, no events)
            ============================================================ */}
        <aside
          className="retro-clipboard-taskboard retro-task-board-sign"
          aria-label="Papan tugas clipboard hari ini"
        >
          {/* Wooden Hardboard Base */}
          <div className="clipboard-board">
            {/* Hanging hole at top */}
            <div className="clipboard-hanging-hole" aria-hidden="true" />

            {/* Metallic Clip at Top Center */}
            <div className="clipboard-metal-clip" aria-hidden="true">
              <div className="clipboard-clip-spring" />
              <div className="clipboard-clip-clamp" />
            </div>

            {/* Lined paper sheet slightly tilted (1-2 deg) */}
            <div className="clipboard-paper">
              <div className="clipboard-paper-header">
                <span className="clipboard-paper-title">TUGAS HARI INI</span>
                <span className="clipboard-paper-subtitle">08.00 - 16.00 WIB</span>
              </div>

              <ol className="clipboard-task-list">
                {simulation.urutan
                  .filter((item) => item.tipe === 'tugas')
                  .map((item) => {
                    // Find the original index in urutan for status comparison
                    const origIdx = simulation.urutan.indexOf(item);
                    const isCompletedItem = origIdx < stepIndex;
                    const isActiveItem = origIdx === stepIndex;
                    const isJustCompleted = lastCompletedIndex === origIdx;

                    const time = item.data.jam;
                    const title = item.data.judul || item.data.panduan.slice(0, 16);

                    let statusClass = 'clipboard-task-item--pending';
                    let icon = '☐';
                    let statusLabel = 'Belum dikerjakan';

                    if (isCompletedItem) {
                      statusClass = 'clipboard-task-item--completed';
                      icon = '✓';
                      statusLabel = 'Selesai';
                    } else if (isActiveItem) {
                      statusClass = 'clipboard-task-item--active';
                      icon = '▶';
                      statusLabel = 'Sedang dikerjakan';
                    }

                    return (
                      <li
                        key={item.data.id}
                        className={`clipboard-task-item ${statusClass} ${isJustCompleted ? 'clipboard-task-item--just-completed' : ''}`}
                        aria-current={isActiveItem ? 'step' : undefined}
                      >
                        <span
                          className="clipboard-status-icon"
                          aria-hidden="true"
                        >
                          {icon}
                        </span>
                        <span className="clipboard-time">
                          {time}
                        </span>
                        <span className="clipboard-text">
                          {title}
                        </span>
                        <span className="sr-only">
                          ({statusLabel})
                        </span>
                      </li>
                    );
                  })}
              </ol>
            </div>
          </div>
          {/* Subtle desk contact shadow */}
          <div className="clipboard-desk-shadow" aria-hidden="true" />
        </aside>

        {/* MONITOR STATION: bezel + neck + base + keyboard (all in one flex column) */}
        <div className="monitor-station retro-monitor-column">
        {/* CRT RETRO MONITOR CASING */}
        <div
          className={`retro-monitor-outer ${isScreenShaking ? 'screen-shake' : ''}`}
        >
          {/* Top casing vent slots */}
          <div className="retro-monitor-vents" aria-hidden="true">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="retro-monitor-vent-slot" />
            ))}
          </div>

          {/* Recessed bezel frame */}
          <div className="retro-bezel-inner">
            {/* CRT Screen Face */}
            <div className="retro-crt-screen" tabIndex={0}>
              {/* Scanline layer overlay */}
              <div className="retro-scanlines-layer" aria-hidden="true" />
              <div className="retro-screen-glare" aria-hidden="true" />

              {/* SCREEN TOP STATUS BAR: Simplified clean header */}
              <header
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  background: 'rgba(2, 6, 12, 0.9)',
                  borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
                  fontSize: '0.65rem',
                  zIndex: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 6px #22c55e',
                    }}
                  />
                  <span className="terminal-glow-text" style={{ fontWeight: 600 }}>
                    KOTA-OS // TERMINAL
                  </span>
                </div>

                {/* Simulation Clock & Mute */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    className="terminal-glow-amber"
                    style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '0.6rem',
                      letterSpacing: '1px',
                    }}
                  >
                    <i className="fa-solid fa-clock" aria-hidden="true" style={{ marginRight: '6px' }} />
                    {currentTime} WIB
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMute();
                    }}
                    title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                    aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {isMuted ? (
                      <i className="fa-solid fa-volume-xmark" aria-hidden="true" />
                    ) : (
                      <i className="fa-solid fa-volume-high" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </header>

              {/* ============================================================
                  SCREEN CONTENT: EITHER LOG KERJA OR ACTIVE SIMULATION
                  ============================================================ */}
              {isCompleted ? (
                /* --- SCREEN: LOG KERJA (SELESAI SHIFT) --- */
                <div
                  style={{
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto',
                    zIndex: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      borderBottom: '1px dashed #38bdf8',
                      paddingBottom: '8px',
                    }}
                  >
                    <h2
                      className="pixel-text terminal-glow-cyan"
                      style={{ fontSize: '0.85rem', margin: '0 0 4px 0' }}
                    >
                      LOG KERJA HARIAN
                    </h2>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                      Shift selesai: {simulation.jamMulai} - {simulation.jamSelesai} WIB
                    </p>
                  </div>

                  {/* Score breakdown per aspect */}
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                    }}
                  >
                    <div
                      className="terminal-glow-green"
                      style={{ fontSize: '0.65rem', fontWeight: 600, marginBottom: '6px' }}
                    >
                      <i className="fa-solid fa-chart-simple" aria-hidden="true" style={{ marginRight: '6px' }} />
                      Skor Penilaian Kerja:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.7rem' }}>
                      <div>
                        Kemampuan (Ability): <strong>+{finalScores.ability}</strong>
                      </div>
                      <div>
                        Ketahanan (Resilience): <strong>+{finalScores.resilience}</strong>
                      </div>
                      <div>
                        Minat Kerja (Interest): <strong>+{finalScores.interest}</strong>
                      </div>
                      <div>
                        Gaya Dominan:{' '}
                        <strong style={{ color: '#38bdf8', textTransform: 'capitalize' }}>
                          {Object.entries(finalScores.workStyle).sort((a, b) => b[1] - a[1])[0][0]}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Post enjoyment & reflection */}
                  <div
                    style={{
                      background: 'rgba(8, 14, 26, 0.8)',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #38bdf8',
                    }}
                  >
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        color: '#fbbf24',
                        marginBottom: '6px',
                        fontWeight: 600,
                      }}
                    >
                      Seberapa seru pengalaman kerja ini dibanding bayanganmu? (1 - 5{' '}
                      <i className="fa-solid fa-star" aria-hidden="true" style={{ color: '#fbbf24' }} />)
                    </label>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostEnjoyment(star);
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            border: '1px solid #38bdf8',
                            background:
                              postEnjoyment === star ? '#38bdf8' : 'rgba(15, 23, 42, 0.8)',
                            color: postEnjoyment === star ? '#020617' : '#38bdf8',
                            fontFamily: 'var(--font-pixel)',
                            fontSize: '0.65rem',
                            cursor: 'pointer',
                          }}
                        >
                          {star}
                        </button>
                      ))}
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>
                        Bagian paling seru / memuaskan:
                      </label>
                      <input
                        type="text"
                        value={mostExciting}
                        onChange={(e) => setMostExciting(e.target.value)}
                        placeholder="Contoh: Mengetik perintah & memecahkan bug"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: '#040913',
                          border: '1px solid #334155',
                          borderRadius: '3px',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>
                        Bagian paling menantang:
                      </label>
                      <input
                        type="text"
                        value={mostBoring}
                        onChange={(e) => setMostBoring(e.target.value)}
                        placeholder="Contoh: Kesalahan sintaks & gangguan mendadak"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: '#040913',
                          border: '1px solid #334155',
                          borderRadius: '3px',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>
                  </div>

                  {/* Final action buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveResult();
                      }}
                      disabled={isSaved}
                      className="btn btn--primary"
                      style={{ flex: 1, minWidth: '160px', fontSize: '0.6rem' }}
                    >
                      {isSaved ? (
                        '✓ Tersimpan di HASILKU'
                      ) : (
                        <>
                          <i className="fa-solid fa-floppy-disk" aria-hidden="true" style={{ marginRight: '6px' }} />
                          Simpan ke HASILKU
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestart();
                      }}
                      className="btn btn--ghost"
                      style={{ fontSize: '0.6rem' }}
                    >
                      <i className="fa-solid fa-rotate-right" aria-hidden="true" style={{ marginRight: '6px' }} />
                      Ulangi
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExit();
                      }}
                      className="btn btn--ghost"
                      style={{ fontSize: '0.6rem' }}
                    >
                      <i className="fa-solid fa-building" aria-hidden="true" style={{ marginRight: '6px' }} />
                      Kembali ke Gedung
                    </button>
                  </div>
                </div>
              ) : (
                /* --- SCREEN: ACTIVE TERMINAL RUNNER --- */
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 12,
                  }}
                >
                  {/* 1. SHORTENED GUIDANCE PANEL WITH SEPARATE CODE BOX */}
                  <section
                    style={{
                      flexShrink: 0,
                      background: 'rgba(8, 18, 30, 0.9)',
                      borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '8px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        className="terminal-glow-amber"
                        style={{
                          fontFamily: 'var(--font-pixel)',
                          fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)',
                          fontWeight: 600,
                        }}
                      >
                        [TUGAS {currentTaskNumber}/{totalTasks}] {currentTask?.judul || 'Perintah Kerja'}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: 'clamp(0.72rem, 1.05vw, 0.88rem)',
                        lineHeight: 1.45,
                        color: '#f0fdf4',
                        margin: 0,
                      }}
                    >
                      {subStepPhase === 1 && currentTask?.subLangkah
                        ? currentTask.subLangkah.panduanLanjutan
                        : currentTask?.penjelasan || activeGuideText}
                    </p>

                    {/* Compact Code Box showing exact command to type */}
                    <div
                      style={{
                        marginTop: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(2, 6, 15, 0.85)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '3px',
                        padding: '4px 10px',
                        color: '#38bdf8',
                        fontFamily: 'monospace',
                        fontSize: 'clamp(0.75rem, 1.15vw, 0.92rem)',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <span style={{ color: '#4ade80' }}>$</span>
                      <code>
                        {subStepPhase === 1 && currentTask?.subLangkah
                          ? 'print(nama)'
                          : currentTask?.contohPerintah}
                      </code>
                    </div>
                  </section>

                  {/* 2. TERMINAL OUTPUT LOGS: Clean & concise history */}
                  <div
                    ref={terminalOutputRef}
                    style={{
                      flex: 1,
                      minHeight: 0,
                      overflowY: 'auto',
                      overflowAnchor: 'none',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
                      lineHeight: 1.45,
                    }}
                  >
                    {logs.map((log) => {
                      let color = '#38bdf8';
                      if (log.type === 'system') color = '#94a3b8';
                      if (log.type === 'error') color = '#f87171';
                      if (log.type === 'success') color = '#4ade80';

                      return (
                        <div
                          key={log.id}
                          style={{
                            color,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {log.text}
                        </div>
                      );
                    })}
                  </div>

                  {/* 3. ACTIVE COMMAND PROMPT INPUT */}
                  <form
                    onSubmit={handleCommandSubmit}
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(4, 9, 16, 0.95)',
                      borderTop: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '8px 12px',
                      gap: '8px',
                    }}
                  >
                    <span
                      className="terminal-glow-green"
                      style={{ fontWeight: 600, flexShrink: 0, fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)' }}
                    >
                      {activePromptText}
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={handleCommandChange}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      placeholder="ketik di sini..."
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#e0f2fe',
                        fontFamily: 'inherit',
                        fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn--primary"
                      style={{
                        fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)',
                        padding: '4px 12px',
                        minHeight: '30px',
                        minWidth: 'auto',
                      }}
                    >
                      KIRIM ↵
                    </button>
                  </form>

                  {/* 4. BOTTOM ACTION TOOLBAR */}
                  <footer
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 12px',
                      background: 'rgba(2, 6, 12, 0.9)',
                      borderTop: '1px solid rgba(56, 189, 248, 0.15)',
                      fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenHint();
                        }}
                        className="btn"
                        style={{
                          fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)',
                          padding: '4px 10px',
                          minHeight: '28px',
                          borderColor: wrongAttempts >= 2 ? '#fbbf24' : '#334155',
                          color: wrongAttempts >= 2 ? '#fbbf24' : '#94a3b8',
                          background:
                            wrongAttempts >= 2
                              ? 'rgba(251, 191, 36, 0.15)'
                              : 'transparent',
                        }}
                      >
                        <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ marginRight: '4px' }} />
                        {wrongAttempts >= 2 ? 'PETUNJUK' : 'Petunjuk'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSkipTask();
                        }}
                        className="btn btn--ghost"
                        style={{
                          fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)',
                          padding: '4px 10px',
                          minHeight: '28px',
                          color: '#64748b',
                        }}
                      >
                        <i className="fa-solid fa-forward-step" aria-hidden="true" style={{ marginRight: '4px' }} />
                        Lewati
                      </button>
                    </div>
                  </footer>
                </div>
              )}

              {/* ============================================================
                  WORLD EVENT POP-UP (INSIDE MONITOR)
                  ============================================================ */}
              {activeEvent && (
                <div
                  ref={eventDialogRef}
                  tabIndex={-1}
                  className="retro-modal-overlay"
                  style={{ outline: 'none' }}
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="event-dialog-title"
                >
                  <div className="retro-modal-window">
                    {/* Titlebar */}
                    <div className="retro-modal-titlebar">
                      <span id="event-dialog-title">
                        <i className="fa-solid fa-bell" aria-hidden="true" style={{ marginRight: '6px' }} />
                        WORLD EVENT: {activeEvent.jam} WIB
                      </span>
                      <span style={{ fontSize: '0.5rem', opacity: 0.8 }}>[POPUP-OS]</span>
                    </div>

                    {/* Body Content */}
                    <div className="retro-modal-content">
                      {!eventConsequence ? (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '10px',
                            }}
                          >
                            <span style={{ fontSize: '1.4rem' }}>{activeEvent.avatar}</span>
                            <div>
                              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.75rem' }}>
                                {activeEvent.karakter}
                              </div>
                              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                                {activeEvent.judul}
                              </div>
                            </div>
                          </div>

                          <p
                            style={{
                              fontSize: '0.78rem',
                              lineHeight: 1.5,
                              color: '#f8fafc',
                              marginBottom: '14px',
                              background: 'rgba(2, 6, 15, 0.6)',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid rgba(56, 189, 248, 0.2)',
                            }}
                          >
                            "{activeEvent.cerita}"
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {activeEvent.pilihan.map((pil, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectEventChoice(idx)}
                                className="btn btn--ghost"
                                style={{
                                  textAlign: 'left',
                                  justifyContent: 'flex-start',
                                  fontSize: '0.65rem',
                                  padding: '8px 10px',
                                  minHeight: '38px',
                                  color: '#e0f2fe',
                                  borderColor: 'rgba(56, 189, 248, 0.4)',
                                  background: 'rgba(15, 23, 42, 0.7)',
                                }}
                              >
                                <span
                                  style={{
                                    color: '#38bdf8',
                                    marginRight: '6px',
                                    fontFamily: 'var(--font-pixel)',
                                  }}
                                >
                                  [{idx + 1}]
                                </span>
                                {pil.teks}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        /* Consequence screen */
                        <div style={{ textAlign: 'center', padding: '6px 0' }}>
                          <div
                            className="terminal-glow-green"
                            style={{
                              fontFamily: 'var(--font-pixel)',
                              fontSize: '0.65rem',
                              marginBottom: '8px',
                            }}
                          >
                            ✓ KEPUTUSAN TERCATAT
                          </div>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              lineHeight: 1.5,
                              color: '#e0f2fe',
                              marginBottom: '14px',
                              background: 'rgba(2, 6, 15, 0.6)',
                              padding: '10px',
                              borderRadius: '4px',
                            }}
                          >
                            {eventConsequence.text}
                          </p>
                          <button
                            type="button"
                            onClick={handleCloseEvent}
                            className="btn btn--primary"
                            style={{ width: '100%', fontSize: '0.65rem' }}
                          >
                            Lanjut ke Pekerjaan ({currentTime} WIB) →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  HINT MODAL (INSIDE MONITOR)
                  ============================================================ */}
              {showHintModal && currentTask && (
                <div
                  className="retro-modal-overlay"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHintModal(false);
                    focusInput();
                  }}
                >
                  <div
                    className="retro-modal-window"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="retro-modal-titlebar">
                      <span>
                        <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ marginRight: '6px' }} />
                        PETUNJUK KODE
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowHintModal(false);
                          focusInput();
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="retro-modal-content">
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                        {currentTask.hint}
                      </p>
                      <div
                        style={{
                          background: '#040913',
                          border: '1px solid #38bdf8',
                          padding: '10px',
                          borderRadius: '4px',
                          color: '#4ade80',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          marginBottom: '12px',
                          userSelect: 'all',
                        }}
                      >
                        {currentTask.contohPerintah}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentInput(currentTask.contohPerintah);
                          setShowHintModal(false);
                          focusInput();
                        }}
                        className="btn btn--primary"
                        style={{ width: '100%', fontSize: '0.6rem' }}
                      >
                        Salin ke Prompt & Tutup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================
              BOTTOM MONITOR BEZEL (Brand Logo, Power Button & LED)
              ============================================================ */}
          <div className="retro-bottom-bezel">
            <div className="retro-monitor-brand">
              <span>
                <i className="fa-solid fa-tv" aria-hidden="true" />
              </span>
              <span>KOTA-VISION 1994 CRT</span>
            </div>

            <div className="retro-power-section">
              <span style={{ fontSize: '0.5rem', color: '#787164', fontFamily: 'monospace' }}>
                POWER
              </span>
              <div className="retro-power-led" />
              <button
                type="button"
                className="retro-power-btn"
                onClick={handleRestart}
                title="Reset Monitor"
              >
                ⏻
              </button>
            </div>
          </div>
        </div>

          {/* Monitor Stand Neck */}
          <div className="retro-monitor-stand" />

          {/* Monitor Pedestal Base */}
          <div className="retro-monitor-base" />

          {/* Keyboard (centered in monitor station flex column) */}
          <div className="retro-keyboard" aria-hidden="true">
            <div className="retro-key-row">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="retro-key" />
              ))}
            </div>
            <div className="retro-key-row">
              {[...Array(13)].map((_, i) => (
                <div key={i} className="retro-key" />
              ))}
            </div>
            <div className="retro-key-row">
              <div className="retro-key" />
              <div className="retro-key retro-spacebar" />
              <div className="retro-key" />
            </div>
          </div>
        </div>{/* end monitor-station */}
      </div>{/* end retro-workstation-layout */}
    </div>
  );
}
