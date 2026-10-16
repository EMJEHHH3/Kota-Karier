/**
 * ProfessionPage — Simulation Engine + Reality Check Card.
 * Route: /profesi/:id
 * Full interactive branching simulation for Dokter & Software Engineer,
 * and comprehensive Reality Check cards for all professions.
 */

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProfessionById } from '../data/professions';
import { useUserState } from '../lib/context';
import { aggregateSimulationScores } from '../lib/scoring';
import { getTerminalSimulation } from '../data/terminalSimulations';
import RetroMonitorSimulation from '../components/RetroMonitorSimulation';
import NurseWardSimulation from '../components/NurseWardSimulation';
import SpecializedEducationModal from '../components/SpecializedEducationModal';
import type { ScoreImpact, SimulationResult } from '../types';

export default function ProfessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, saveSimulationResult, toggleCandidate, isCandidate } = useUserState();

  const profession = id ? getProfessionById(id) : undefined;

  // Simulation flow states
  const [simStep, setSimStep] = useState<number>(0);
  const [simStatus, setSimStatus] = useState<'intro' | 'playing' | 'feedback' | 'evaluation' | 'done'>('intro');
  const [preInterest, setPreInterest] = useState<number>(3);
  const [postEnjoyment, setPostEnjoyment] = useState<number>(3);
  const [mostExciting, setMostExciting] = useState<string>('');
  const [mostBoring, setMostBoring] = useState<string>('');
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number | null>(null);
  const [chosenChoices, setChosenChoices] = useState<number[]>([]);
  const [accumulatedImpacts, setAccumulatedImpacts] = useState<ScoreImpact[]>([]);
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  if (!profession) {
    return (
      <div className="page-enter container" style={{ paddingTop: 'var(--space-2xl)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '0.8rem', marginBottom: 'var(--space-md)' }}>Profesi tidak ditemukan</h1>
        <Link to="/" className="btn">← Kembali ke Kota</Link>
      </div>
    );
  }

  const isSavedCandidate = isCandidate(profession.id);
  const existingResult = state.simulationResults[profession.id];
  const simulasi = profession.simulasi;
  const terminalSim = profession ? getTerminalSimulation(profession.id) : undefined;
  const isNurseSim = profession ? profession.id === 'perawat' : false;
  const isTerminalSimActive = !isNurseSim && !!terminalSim && simStatus !== 'intro';

  const handleStartSim = () => {
    if (profession.butuhGelar) {
      setShowLockedModal(true);
      return;
    }
    setSimStep(0);
    setChosenChoices([]);
    setAccumulatedImpacts([]);
    setChosenOptionIndex(null);
    setSimStatus('playing');
  };

  const handleSelectOption = (index: number) => {
    if (!simulasi) return;
    const currentStep = simulasi.langkah[simStep];
    const choice = currentStep.pilihan[index];

    setChosenOptionIndex(index);
    setChosenChoices((prev) => [...prev, index]);
    setAccumulatedImpacts((prev) => [...prev, choice.dampak]);
    setSimStatus('feedback');
  };

  const handleNextStep = () => {
    if (!simulasi) return;
    setChosenOptionIndex(null);

    if (simStep + 1 < simulasi.langkah.length) {
      setSimStep((prev) => prev + 1);
      setSimStatus('playing');
    } else {
      // Completed all steps -> proceed to evaluation
      setSimStatus('evaluation');
    }
  };

  const handleFinishEvaluation = () => {
    const totalScores = aggregateSimulationScores(accumulatedImpacts);
    const ekspektasiDelta = postEnjoyment - preInterest;

    const result: SimulationResult = {
      professionId: profession.id,
      choices: chosenChoices,
      totalScores,
      preInterest,
      postEnjoyment,
      mostExciting: mostExciting || 'Menyelesaikan tantangan hari itu',
      mostBoring: mostBoring || 'Rutinitas dan tekanan pekerjaan',
      ekspektasiDelta,
      completedAt: Date.now(),
    };

    saveSimulationResult(result);
    setSimStatus('done');
  };

  const displayResult = existingResult && simStatus === 'intro' ? existingResult : null;

  return (
    <div className="page-enter" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-sm) var(--space-md)',
          borderBottom: '2px solid var(--color-border-cyan)',
          background: 'var(--color-bg-panel)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            onClick={() => navigate(`/gedung/${profession.gedung}`)}
            className="btn btn--ghost"
            style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}
            aria-label="Kembali ke gedung"
          >
            ← Gedung
          </button>
          <h1 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)' }}>
            {profession.nama}
          </h1>
        </div>

        <button
          onClick={() => toggleCandidate(profession.id)}
          className={`btn ${isSavedCandidate ? 'btn--primary' : 'btn--ghost'}`}
          style={{ fontSize: '0.5rem', padding: '4px 10px' }}
        >
          {isSavedCandidate ? (
            <>
              <i className="fa-solid fa-star" aria-hidden="true" style={{ marginRight: '4px' }} />
              Disimpan
            </>
          ) : (
            <>
              <i className="fa-regular fa-star" aria-hidden="true" style={{ marginRight: '4px' }} />
              Simpan
            </>
          )}
        </button>
      </header>

      <main className={isTerminalSimActive ? 'simulation-active-main' : 'container'} style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
        {/* RIASEC Tags */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
          {profession.riasec.map((type) => (
            <span
              key={type}
              style={{
                fontSize: '0.6rem',
                padding: '3px 8px',
                border: '1px solid var(--color-accent-purple)',
                borderRadius: '4px',
                color: 'var(--color-accent-purple)',
              }}
            >
              <i className="fa-solid fa-tag" aria-hidden="true" style={{ marginRight: '4px' }} />
              {type}
            </span>
          ))}
          {profession.butuhGelar ? (
            <span
              style={{
                fontSize: '0.6rem',
                padding: '3px 8px',
                border: '1px solid var(--color-accent-purple)',
                borderRadius: '4px',
                color: 'var(--color-accent-purple)',
              }}
            >
              <i className="fa-solid fa-graduation-cap" aria-hidden="true" style={{ marginRight: '4px' }} />
              Butuh Pendidikan Khusus
            </span>
          ) : profession.hasSimulation ? (
            <span
              style={{
                fontSize: '0.6rem',
                padding: '3px 8px',
                border: '1px solid var(--color-accent-green)',
                borderRadius: '4px',
                color: 'var(--color-accent-green)',
              }}
            >
              <i className="fa-solid fa-gamepad" aria-hidden="true" style={{ marginRight: '4px' }} />
              Simulasi Sehari Tersedia
            </span>
          ) : null}
        </div>

        {/* ============================================================
            SIMULATION SECTION
            ============================================================ */}
        {profession.hasSimulation && (simulasi || profession.butuhGelar) && (
          <section style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Step 1: Intro & Pre-Interest Rating */}
            {simStatus === 'intro' && (
              <div
                className="panel"
                style={{
                  borderColor: profession.butuhGelar ? 'rgba(34, 211, 238, 0.4)' : 'var(--color-accent-green)',
                  padding: 'var(--space-lg)',
                }}
              >
                <h2
                  style={{
                    fontSize: '0.75rem',
                    color: profession.butuhGelar ? 'var(--color-accent-cyan)' : 'var(--color-accent-green)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {profession.butuhGelar ? (
                    <>
                      <i className="fa-solid fa-graduation-cap" aria-hidden="true" style={{ marginRight: '6px' }} />
                      Simulasi: {profession.nama}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-gamepad" aria-hidden="true" style={{ marginRight: '6px' }} />
                      {simulasi?.judul}
                    </>
                  )}
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
                  {simulasi?.intro ||
                    'Profesi ini mensyaratkan kualifikasi gelar dan registrasi profesi medis resmi sebelum dapat berpraktik langsung.'}
                </p>

                {displayResult && (
                  <div
                    style={{
                      background: 'rgba(74, 222, 128, 0.1)',
                      border: '1px solid var(--color-accent-green)',
                      padding: '10px 14px',
                      borderRadius: '4px',
                      marginBottom: 'var(--space-md)',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div style={{ color: 'var(--color-accent-green)', fontWeight: 600, marginBottom: '4px' }}>
                      ✓ Kamu sudah pernah mencoba simulasi ini
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                      Ekspektasi vs Realita: {displayResult.ekspektasiDelta > 0 ? `+${displayResult.ekspektasiDelta}` : displayResult.ekspektasiDelta} (Rating: {displayResult.postEnjoyment}/5)
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-accent-yellow)', display: 'block', marginBottom: '8px' }}>
                    Sebelum mulai, seberapa tertarik kamu dengan profesi {profession.nama}? (1 - 5)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setPreInterest(star)}
                        className={`btn ${preInterest === star ? 'btn--primary' : 'btn--ghost'}`}
                        style={{ fontSize: '0.75rem', width: '40px', height: '40px' }}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profession.butuhGelar ? (
                    <button
                      onClick={() => setShowLockedModal(true)}
                      className="btn"
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid var(--color-accent-red)',
                        color: 'var(--color-accent-red)',
                        padding: '10px 18px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)',
                      }}
                      aria-haspopup="dialog"
                    >
                      <span><i className="fa-solid fa-lock" aria-hidden="true" /></span>
                      <span>SIMULASI TIDAK TERSEDIA</span>
                    </button>
                  ) : (
                    <button onClick={handleStartSim} className="btn btn--primary">
                      {displayResult ? (
                        <>
                          <i className="fa-solid fa-rotate-right" aria-hidden="true" style={{ marginRight: '6px' }} />
                          Coba Simulasi Lagi
                        </>
                      ) : isNurseSim ? (
                        <>
                          <i className="fa-solid fa-rocket" aria-hidden="true" style={{ marginRight: '6px' }} />
                          Mulai Simulasi (07.00 - 14.00)
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-rocket" aria-hidden="true" style={{ marginRight: '6px' }} />
                          Mulai Simulasi (08.00 - 16.00)
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Perawat Nurse Ward Simulation */}
            {isNurseSim && simStatus !== 'intro' && (
              <NurseWardSimulation
                preInterest={preInterest}
                onFinish={() => {
                  // Saved to context automatically inside component
                }}
                onExit={() => navigate(`/gedung/${profession.gedung}`)}
              />
            )}

            {/* Step 2: IT Professions Retro Monitor Simulation */}
            {!isNurseSim && terminalSim && simStatus !== 'intro' && (
              <RetroMonitorSimulation
                simulation={terminalSim}
                preInterest={preInterest}
                onFinish={() => {
                  // Saved to context automatically inside component
                }}
                onExit={() => navigate(`/gedung/${profession.gedung}`)}
              />
            )}

            {/* Step 2 (Non-IT Professions): Legacy Simulation Runner (Playing & Feedback) */}
            {!isNurseSim && !terminalSim && !profession.butuhGelar && simulasi && (simStatus === 'playing' || simStatus === 'feedback') && (
              <div className="panel" style={{ borderColor: 'var(--color-accent-cyan)', padding: 'var(--space-lg)' }}>
                {/* Header with Clock & Step */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <span className="pixel-text" style={{ fontSize: '0.65rem', color: 'var(--color-accent-yellow)' }}>
                    <i className="fa-solid fa-clock" aria-hidden="true" style={{ marginRight: '6px' }} />
                    {simulasi.langkah[simStep].jam} WIB
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                    Langkah {simStep + 1} dari {simulasi.langkah.length}
                  </span>
                </div>

                {/* Unpleasant Moment or Mini Task Badges */}
                {simulasi.langkah[simStep].isUnpleasantMoment && (
                  <div
                    style={{
                      background: 'rgba(248, 113, 113, 0.15)',
                      border: '1px solid var(--color-accent-red)',
                      color: 'var(--color-accent-red)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      marginBottom: 'var(--space-sm)',
                      display: 'inline-block',
                    }}
                  >
                    <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '4px' }} />
                    Sisi Realita yang Menantang
                  </div>
                )}

                {simulasi.langkah[simStep].isMiniTask && (
                  <div
                    style={{
                      background: 'rgba(167, 139, 250, 0.15)',
                      border: '1px solid var(--color-accent-purple)',
                      color: 'var(--color-accent-purple)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      marginBottom: 'var(--space-sm)',
                      display: 'inline-block',
                    }}
                  >
                    <i className="fa-solid fa-puzzle-piece" aria-hidden="true" style={{ marginRight: '4px' }} />
                    Mini Task Praktik
                  </div>
                )}

                {/* Narrative text */}
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>
                  {simulasi.langkah[simStep].narasi}
                </p>

                {/* Choices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                  {simulasi.langkah[simStep].pilihan.map((pilihan, idx) => {
                    const isSelected = chosenOptionIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={simStatus === 'feedback'}
                        className={`panel ${isSelected ? 'btn--primary' : 'panel--hover'}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          textAlign: 'left',
                          padding: '12px',
                          cursor: simStatus === 'feedback' ? 'default' : 'pointer',
                          borderColor: isSelected ? 'var(--color-accent-cyan)' : 'var(--color-border-subtle)',
                          background: isSelected ? 'rgba(34, 211, 238, 0.2)' : 'var(--color-bg-panel)',
                          opacity: simStatus === 'feedback' && !isSelected ? 0.4 : 1,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            background: 'rgba(34, 211, 238, 0.1)',
                            color: 'var(--color-accent-cyan)',
                            fontFamily: 'var(--font-pixel)',
                            fontSize: '0.55rem',
                            flexShrink: 0,
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
                          {pilihan.teks}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback callout if option picked */}
                {simStatus === 'feedback' && chosenOptionIndex !== null && (
                  <div
                    style={{
                      marginTop: 'var(--space-md)',
                      padding: '12px',
                      background: 'rgba(34, 211, 238, 0.08)',
                      border: '1px solid var(--color-border-cyan)',
                      borderRadius: '4px',
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)', marginBottom: '8px' }}>
                      <i className="fa-solid fa-comment-dots" aria-hidden="true" style={{ marginRight: '6px' }} />
                      Dampak Pilihanmu:
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                      {simulasi.langkah[simStep].pilihan[chosenOptionIndex].umpanBalik || 'Keputusanmu memengaruhi ritme hari kerja ini.'}
                    </p>
                    <button onClick={handleNextStep} className="btn btn--primary" style={{ width: '100%' }}>
                      {simStep + 1 < simulasi.langkah.length ? 'Lanjut ke Waktu Berikutnya →' : 'Selesaikan Hari & Evaluasi →'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 (Non-IT Professions): Evaluation Screen (Ekspektasi vs Realita) */}
            {!isNurseSim && !terminalSim && simStatus === 'evaluation' && (
              <div className="panel" style={{ borderColor: 'var(--color-accent-yellow)', padding: 'var(--space-lg)' }}>
                <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-yellow)', marginBottom: 'var(--space-md)' }}>
                  <i className="fa-solid fa-chart-simple" aria-hidden="true" style={{ marginRight: '6px' }} />
                  Evaluasi "Ekspektasi vs Realita"
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                  Shift kerjamu telah selesai! Mari bandingkan apa yang kamu rasakan dengan ekspektasi awalmu:
                </p>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', display: 'block', marginBottom: '8px' }}>
                    Seberapa kamu menikmati hari kerjamu sebagai {profession.nama}? (1 = Membosankan/Melelahkan, 5 = Sangat Seru)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setPostEnjoyment(star)}
                        className={`btn ${postEnjoyment === star ? 'btn--primary' : 'btn--ghost'}`}
                        style={{ fontSize: '0.75rem', width: '40px', height: '40px' }}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                    Bagian apa yang paling seru menurutmu?
                  </label>
                  <input
                    type="text"
                    value={mostExciting}
                    onChange={(e) => setMostExciting(e.target.value)}
                    placeholder="Contoh: Mendiagnosis pasien tepat waktu / memecahkan bug"
                    style={{
                      width: '100%',
                      background: 'var(--color-bg-dark)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-cyan)',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                    Bagian apa yang paling berat atau membosankan?
                  </label>
                  <input
                    type="text"
                    value={mostBoring}
                    onChange={(e) => setMostBoring(e.target.value)}
                    placeholder="Contoh: Pasien komplain / harus lembur saat deployment"
                    style={{
                      width: '100%',
                      background: 'var(--color-bg-dark)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-cyan)',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>

                <button onClick={handleFinishEvaluation} className="btn btn--primary" style={{ width: '100%' }}>
                  <i className="fa-solid fa-floppy-disk" aria-hidden="true" style={{ marginRight: '6px' }} />
                  Simpan Hasil & Buka Reality Check
                </button>
              </div>
            )}

            {/* Step 4 (Non-IT Professions): Done Screen Summary */}
            {!isNurseSim && !terminalSim && simStatus === 'done' && (
              <div className="panel" style={{ borderColor: 'var(--color-accent-green)', padding: 'var(--space-lg)' }}>
                <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-green)', marginBottom: 'var(--space-sm)' }}>
                  <i className="fa-solid fa-award" aria-hidden="true" style={{ marginRight: '6px' }} />
                  Simulasi Selesai Tersimpan!
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 'var(--space-md)' }}>
                  <div style={{ padding: '8px', background: 'var(--color-bg-dark)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Ekspektasi Awal</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {preInterest} / 5 <i className="fa-solid fa-star" aria-hidden="true" style={{ color: 'var(--color-accent-yellow)', marginLeft: '2px' }} />
                    </div>
                  </div>
                  <div style={{ padding: '8px', background: 'var(--color-bg-dark)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Kenyataan Setelah Coba</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {postEnjoyment} / 5 <i className="fa-solid fa-star" aria-hidden="true" style={{ color: 'var(--color-accent-yellow)', marginLeft: '2px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                  Delta: {postEnjoyment - preInterest > 0 ? `+${postEnjoyment - preInterest} (Lebih menyenangkan dari bayanganmu!)` : postEnjoyment - preInterest === 0 ? '0 (Sesuai dengan bayanganmu)' : `${postEnjoyment - preInterest} (Ternyata cukup menuntut dibanding bayanganmu)`}
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Sekarang pelajari fakta konkret, jalur kuliah, dan realita kariernya pada <strong>Reality Check</strong> di bawah.
                </p>
              </div>
            )}
          </section>

        )}

        {/* ============================================================
            REALITY CHECK CARD
            ============================================================ */}
        <section className="panel" style={{ borderColor: 'var(--color-border-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)' }}>
              <i className="fa-solid fa-clipboard-check" aria-hidden="true" style={{ marginRight: '6px' }} />
              Reality Check: {profession.nama}
            </h2>
            <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
              Ditinjau: {profession.terakhirDitinjau}
            </span>
          </div>

          {/* 1. Tugas Sehari-hari */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.6rem', color: 'var(--color-accent-green)', marginBottom: '8px' }}>
              ✓ Tugas Sehari-hari
            </h3>
            <ul style={{ paddingLeft: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {profession.realityCheck.tugasHarian.map((task, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{task}</li>
              ))}
            </ul>
          </div>

          {/* 2. Sisi Tidak Enak */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.6rem', color: 'var(--color-accent-red)', marginBottom: '8px' }}>
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px' }} />
              Sisi Tidak Enak (Jujur & Nyata)
            </h3>
            <ul style={{ paddingLeft: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {profession.realityCheck.sisiTidakEnak.map((item, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 3. Keterampilan yang Dibutuhkan */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.6rem', color: 'var(--color-accent-purple)', marginBottom: '8px' }}>
              <i className="fa-solid fa-wrench" aria-hidden="true" style={{ marginRight: '6px' }} />
              Keterampilan yang Dibutuhkan
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profession.realityCheck.keterampilan.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.7rem',
                    padding: '4px 8px',
                    border: `1px solid ${skill.kategori === 'wajib sejak awal' ? 'var(--color-accent-red)' : 'var(--color-accent-green)'}`,
                    borderRadius: '4px',
                    color: skill.kategori === 'wajib sejak awal' ? 'var(--color-accent-red)' : 'var(--color-accent-green)',
                    background: 'rgba(0,0,0,0.2)',
                  }}
                >
                  {skill.nama}{' '}
                  <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>
                    ({skill.kategori === 'wajib sejak awal' ? (
                      <>
                        <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '2px' }} />
                        wajib awal
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-seedling" aria-hidden="true" style={{ marginRight: '2px' }} />
                        bisa dipelajari
                      </>
                    )})
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* 4. Jurusan Kuliah */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.6rem', color: 'var(--color-accent-cyan)', marginBottom: '8px' }}>
              <i className="fa-solid fa-graduation-cap" aria-hidden="true" style={{ marginRight: '6px' }} />
              Jurusan Kuliah yang Sesuai
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              <strong>Utama:</strong> {profession.realityCheck.jurusanKuliah.utama.join(', ')}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              <strong>Alternatif:</strong> {profession.realityCheck.jurusanKuliah.alternatif.join(', ')}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              Mata kuliah inti: {profession.realityCheck.jurusanKuliah.mataKuliahInti.join(', ')}
            </p>
          </div>

          {/* 5. Jalur Selain S1 */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.6rem', color: 'var(--color-accent-orange)', marginBottom: '8px' }}>
              <i className="fa-solid fa-bolt" aria-hidden="true" style={{ marginRight: '6px' }} />
              Jalur Selain S1
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {profession.realityCheck.jalurAlternatif.map((jalur, i) => (
                <div key={i} style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  <strong style={{ color: 'var(--color-accent-orange)' }}>{jalur.jenis}:</strong> {jalur.deskripsi}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Prospek & Gaji (Faktual) */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.6rem', color: 'var(--color-accent-yellow)', marginBottom: '8px' }}>
              <i className="fa-solid fa-money-bill-wave" aria-hidden="true" style={{ marginRight: '6px' }} />
              Prospek Karier & Gaji
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
              {profession.realityCheck.prospek.rentangGaji}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
              Sumber: {profession.realityCheck.prospek.sumber} ({profession.realityCheck.prospek.tahun})
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              <i className="fa-solid fa-arrow-trend-up" aria-hidden="true" style={{ marginRight: '6px' }} />
              {profession.realityCheck.prospek.permintaan}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginTop: 'var(--space-lg)' }}>
            <button
              onClick={() => toggleCandidate(profession.id)}
              className={`btn ${isSavedCandidate ? 'btn--primary' : ''}`}
            >
              {isSavedCandidate ? (
                <>
                  <i className="fa-solid fa-star" aria-hidden="true" style={{ marginRight: '4px' }} />
                  Tersimpan di Kandidat
                </>
              ) : (
                <>
                  <i className="fa-regular fa-star" aria-hidden="true" style={{ marginRight: '4px' }} />
                  Simpan ke Kandidat
                </>
              )}
            </button>
            <Link to={`/bandingkan?p1=${profession.id}`} className="btn">
              <i className="fa-solid fa-scale-balanced" aria-hidden="true" style={{ marginRight: '6px' }} />
              Bandingkan
            </Link>
            <Link to={`/gedung/${profession.gedung}`} className="btn btn--ghost">
              ← Kembali ke Gedung
            </Link>
          </div>
        </section>
      </main>

      {/* Specialized Degree / Education Path Modal */}
      {profession.butuhGelar && (
        <SpecializedEducationModal
          isOpen={showLockedModal}
          onClose={() => setShowLockedModal(false)}
          info={profession.pendidikanKhusus}
          profesiNama={profession.nama}
        />
      )}
    </div>
  );
}
