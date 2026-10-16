/**
 * NurseWardSimulation — Bangsal Rumah Sakit Pixel Neon Interactive Simulation.
 * Features:
 * - 100% CSS/SVG pixel neon hospital aesthetic (floor, bed, medical EKG wave line)
 * - 4 interactive mini-games:
 *   1. Cek Tanda Vital (tap abnormal values with reference card)
 *   2. Pemberian Obat 5 Benar (spot mismatch & hold/confirm)
 *   3. Triase Pasien (order priorities with up/down keyboard/touch buttons)
 *   4. Menenangkan Pasien (therapeutic communication & trust meter)
 * - 2 World Events with emergency flash & consequences
 * - Clock progression from 07.00 to 14.00 WIB
 * - Laporan Shift handover summary & seamless integration into HASILKU
 */

import { useState, useRef, useEffect } from 'react';
import type {
  NurseSimulationData,
  NurseAspectScores,
  TriagePatient,
} from '../types/nurseSimulation';
import type { ScoreImpact, SimulationResult } from '../types';
import { perawatNurseSimulation } from '../data/nurseSimulation';
import { retroSound } from '../lib/sound';
import { useUserState } from '../lib/context';

interface NurseWardSimulationProps {
  simulation?: NurseSimulationData;
  preInterest: number;
  onFinish?: (result: SimulationResult) => void;
  onExit: () => void;
}

export default function NurseWardSimulation({
  simulation = perawatNurseSimulation,
  preInterest,
  onFinish,
  onExit,
}: NurseWardSimulationProps) {
  const { saveSimulationResult } = useUserState();

  // Progress state
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>(simulation.jamMulai);
  const [patientTrust, setPatientTrust] = useState<number>(75);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isEmergencyFlashing, setIsEmergencyFlashing] = useState<boolean>(false);

  // Aspect Scores
  const [scores, setScores] = useState<NurseAspectScores>({
    ketelitian: 2,
    prioritas: 2,
    empati: 3,
    komunikasi: 2,
    kolaborasi: 2,
    manajemenWaktu: 2,
  });

  // World Event state
  const [activeEventChoice, setActiveEventChoice] = useState<number | null>(null);
  const [eventHistory, setEventHistory] = useState<
    Array<{ eventTitle: string; choiceText: string; consequence: string }>
  >([]);

  // Mini-game 1: Tanda Vital
  const [selectedVitals, setSelectedVitals] = useState<string[]>([]);
  const [vitalFeedback, setVitalFeedback] = useState<string | null>(null);

  // Mini-game 2: 5 Benar
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [medicationFeedback, setMedicationFeedback] = useState<string | null>(null);

  // Mini-game 3: Triase
  const [triageList, setTriageList] = useState<TriagePatient[]>([
    ...simulation.misi.triase.pasienList,
  ]);
  const [triageFeedback, setTriageFeedback] = useState<string | null>(null);

  // Mini-game 4: Menenangkan Pasien
  const [selectedCalmingId, setSelectedCalmingId] = useState<string | null>(null);
  const [calmingFeedback, setCalmingFeedback] = useState<string | null>(null);

  // Post-evaluation state in Laporan Shift
  const [postEnjoyment, setPostEnjoyment] = useState<number>(4);
  const [mostExciting, setMostExciting] = useState<string>('');
  const [mostBoring, setMostBoring] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentStep = simulation.urutan[stepIndex];

  // Update clock when step changes
  useEffect(() => {
    if (!currentStep) {
      setCurrentTime(simulation.jamSelesai);
      setIsCompleted(true);
      return;
    }

    if (currentStep.tipe === 'event') {
      setIsEmergencyFlashing(true);
      retroSound.playEventDing();
      const timer = setTimeout(() => setIsEmergencyFlashing(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, currentStep, simulation.jamSelesai]);

  const advanceStep = (nextTime?: string) => {
    setWrongAttempts(0);
    setShowHintModal(false);
    if (nextTime) setCurrentTime(nextTime);

    if (stepIndex + 1 < simulation.urutan.length) {
      setStepIndex((prev) => prev + 1);
      const nextStep = simulation.urutan[stepIndex + 1];
      if (nextStep && !nextTime) {
        setCurrentTime(nextStep.jam);
      }
    } else {
      setCurrentTime(simulation.jamSelesai);
      setIsCompleted(true);
      retroSound.playSuccess();
    }
  };

  // --- MISI 1: Cek Tanda Vital ---
  const handleToggleVital = (id: string) => {
    retroSound.playKeypress();
    setSelectedVitals((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSubmitVitals = () => {
    const isCorrect =
      selectedVitals.length === 1 && selectedVitals.includes('suhu');

    if (isCorrect) {
      retroSound.playSuccess();
      setScores((prev) => ({ ...prev, ketelitian: prev.ketelitian + 2 }));
      setPatientTrust((prev) => Math.min(100, prev + 10));
      setVitalFeedback(
        '✓ Tepat sekali! Suhu 38,6 °C berada di atas rentang normal (36,5 - 37,5 °C) yang mengindikasikan demam (febris). Tanda vital lainnya berada dalam batas aman.'
      );
    } else {
      retroSound.playError();
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setTotalErrors((prev) => prev + 1);
      setPatientTrust((prev) => Math.max(20, prev - 5));

      if (selectedVitals.length === 0) {
        setVitalFeedback('Kamu belum memilih nilai abnormal. Coba bandingkan data suhu dengan tabel rujukan!');
      } else {
        setVitalFeedback(
          'Laporan belum akurat. Perhatikan parameter suhu tubuh pasien (38,6 °C). Bandingkan dengan tabel rujukan normal di samping!'
        );
      }
    }
  };

  // --- MISI 2: 5 Benar ---
  const handleSelectAspect = (aspect: string) => {
    retroSound.playKeypress();
    setSelectedAspect(aspect);
  };

  const handleMedicationAction = (action: 'berikan' | 'tahan') => {
    if (selectedAspect === 'pasien' && action === 'tahan') {
      retroSound.playSuccess();
      setScores((prev) => ({ ...prev, ketelitian: prev.ketelitian + 3 }));
      setPatientTrust((prev) => Math.min(100, prev + 15));
      setMedicationFeedback(
        '✓ Sangat Tepat! Nama pasien pada resep ("Ny. Siti Rahma") berbeda dengan label obat ("Ny. Sri Rahayu"). Tindakan menahan obat dan mengonfirmasi ke apoteker/dokter mencegah risiko medication error yang fatal!'
      );
    } else {
      retroSound.playError();
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setTotalErrors((prev) => prev + 1);
      setPatientTrust((prev) => Math.max(20, prev - 15));

      if (action === 'berikan') {
        setMedicationFeedback(
          'Bahaya Klinis! Jangan memberikan obat jika ada ketidaksesuaian identitas pasien! Obat harus ditahan dan dikonfirmasi.'
        );
      } else {
        setMedicationFeedback(
          'Aspek yang kamu tandai belum tepat. Cermati nama pasien di resep vs nama di label obat!'
        );
      }
    }
  };

  // --- EVENT 1 & 2 ---
  const handleSelectEventOption = (idx: number) => {
    if (currentStep.tipe !== 'event') return;
    const eventObj = simulation.event[currentStep.id];
    if (!eventObj) return;

    retroSound.playKeypress();
    const chosen = eventObj.pilihan[idx];
    setActiveEventChoice(idx);

    // Apply scores
    setScores((prev) => ({
      ketelitian: prev.ketelitian + (chosen.dampak.ketelitian || 0),
      prioritas: prev.prioritas + (chosen.dampak.prioritas || 0),
      empati: prev.empati + (chosen.dampak.empati || 0),
      komunikasi: prev.komunikasi + (chosen.dampak.komunikasi || 0),
      kolaborasi: prev.kolaborasi + (chosen.dampak.kolaborasi || 0),
      manajemenWaktu: prev.manajemenWaktu + (chosen.dampak.manajemenWaktu || 0),
    }));

    setEventHistory((prev) => [
      ...prev,
      {
        eventTitle: eventObj.judul,
        choiceText: chosen.teks,
        consequence: chosen.konsekuensi,
      },
    ]);
  };

  const handleFinishEvent = () => {
    if (currentStep.tipe !== 'event') return;
    const eventObj = simulation.event[currentStep.id];
    const chosen = activeEventChoice !== null ? eventObj.pilihan[activeEventChoice] : null;
    const newJam = chosen?.jamBaru;
    setActiveEventChoice(null);
    advanceStep(newJam);
  };

  // --- MISI 3: Triase ---
  const moveTriagePatient = (index: number, direction: 'up' | 'down') => {
    retroSound.playKeypress();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= triageList.length) return;

    const updated = [...triageList];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setTriageList(updated);
  };

  const handleSubmitTriage = () => {
    const isCorrect =
      triageList[0].urutanBenar === 1 &&
      triageList[1].urutanBenar === 2 &&
      triageList[2].urutanBenar === 3;

    if (isCorrect) {
      retroSound.playSuccess();
      setScores((prev) => ({ ...prev, prioritas: prev.prioritas + 3 }));
      setPatientTrust((prev) => Math.min(100, prev + 15));
      setTriageFeedback(
        '✓ Urutan Triase Sempurna! Gangguan pernapasan akut (Tn. Aris) adalah prioritas Segera (mengancam nyawa), disusul demam tinggi anak (An. Dani - Cepat), dan luka lecet (Sdr. Rian - Biasa).'
      );
    } else {
      retroSound.playError();
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setTotalErrors((prev) => prev + 1);
      setPatientTrust((prev) => Math.max(20, prev - 5));

      setTriageFeedback(
        'Urutan triase belum optimal. Ingat prinsip gawat darurat: masalah jalan napas / sesak napas berat selalu menjadi prioritas Segera pertama!'
      );
    }
  };

  // --- MISI 4: Menenangkan Pasien ---
  const handleSelectCalming = (optionId: string) => {
    setSelectedCalmingId(optionId);
    const option = simulation.misi.komunikasi.pilihan.find((o) => o.id === optionId);
    if (!option) return;

    if (option.tipe === 'empatik') {
      retroSound.playSuccess();
      setScores((prev) => ({
        ...prev,
        empati: prev.empati + 3,
        komunikasi: prev.komunikasi + 2,
      }));
      setPatientTrust((prev) => Math.min(100, prev + option.dampakTrust));
      setCalmingFeedback(
        `✓ Pasien: ${option.responPasien}\n\n${option.umpanBalik}`
      );
    } else {
      retroSound.playError();
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setTotalErrors((prev) => prev + 1);
      setPatientTrust((prev) => Math.max(20, prev + option.dampakTrust));
      setCalmingFeedback(
        `Pasien: ${option.responPasien}\n\n${option.umpanBalik}`
      );
    }
  };

  // --- SIMPAN HASIL KE HASILKU ---
  const handleSaveResult = () => {
    // Map to standard ScoreImpact
    const totalScores: ScoreImpact = {
      interest: Math.round((patientTrust / 100) * 4) - 2, // -2 to +2
      ability: Math.min(2, Math.max(-2, Math.round((scores.ketelitian + scores.prioritas) / 4) - 1)),
      resilience: Math.min(2, Math.max(-2, Math.round(scores.manajemenWaktu / 2) - 1)),
      workStyle: {
        analytical: scores.ketelitian,
        social: scores.empati + scores.komunikasi + scores.kolaborasi,
        creative: 1,
        technical: scores.prioritas,
      },
    };

    const ekspektasiDelta = postEnjoyment - preInterest;

    const result: SimulationResult = {
      professionId: 'perawat',
      choices: [1, 1, 1, 1],
      totalScores,
      preInterest,
      postEnjoyment,
      mostExciting: mostExciting.trim() || 'Melakukan triase dan menenangkan pasien yang cemas',
      mostBoring: mostBoring.trim() || 'Menghadapi komplain keluarga dan tekanan waktu',
      ekspektasiDelta,
      completedAt: Date.now(),
    };

    saveSimulationResult(result);
    setIsSaved(true);

    if (onFinish) {
      onFinish(result);
    }
  };

  const handleRestart = () => {
    setStepIndex(0);
    setCurrentTime(simulation.jamMulai);
    setPatientTrust(75);
    setWrongAttempts(0);
    setTotalErrors(0);
    setHintsUsed(0);
    setShowHintModal(false);
    setIsCompleted(false);
    setSelectedVitals([]);
    setVitalFeedback(null);
    setSelectedAspect(null);
    setMedicationFeedback(null);
    setTriageList([...simulation.misi.triase.pasienList]);
    setTriageFeedback(null);
    setSelectedCalmingId(null);
    setCalmingFeedback(null);
    setEventHistory([]);
    setIsSaved(false);
    setScores({
      ketelitian: 2,
      prioritas: 2,
      empati: 3,
      komunikasi: 2,
      kolaborasi: 2,
      manajemenWaktu: 2,
    });
  };

  // Helper for current mission hint
  const getCurrentHint = () => {
    if (!currentStep) return '';
    if (currentStep.tipe === 'misi') {
      return simulation.misi[currentStep.id]?.hint || '';
    }
    return 'Pilihlah tindakan yang mengutamakan keselamatan pasien dan komunikasi empati.';
  };

  return (
    <div
      ref={containerRef}
      className={`nurse-ward-scene ${isEmergencyFlashing ? 'hospital-event-pulse' : ''}`}
    >
      {/* ============================================================
          TOP HEADER BAR
          ============================================================ */}
      <header className="ward-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="ward-shift-badge">
            <i className="fa-solid fa-hospital" aria-hidden="true" style={{ marginRight: '6px' }} />
            {simulation.namaProfesi.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              color: '#34d399',
              background: 'rgba(52, 211, 153, 0.1)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}
          >
            SHIFT PAGI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Patient Trust Indicator */}
          <div className="ward-trust-container" title={`Kepercayaan Pasien: ${patientTrust}%`}>
            <span>
              <i className="fa-solid fa-heart" aria-hidden="true" style={{ color: '#f43f5e', marginRight: '4px' }} />
              Kepercayaan:
            </span>
            <div className="ward-trust-bar-bg">
              <div
                className="ward-trust-bar-fill"
                style={{
                  width: `${patientTrust}%`,
                  background:
                    patientTrust < 50
                      ? 'linear-gradient(90deg, #f87171, #ef4444)'
                      : 'linear-gradient(90deg, #34d399, #10b981)',
                }}
              />
            </div>
            <strong style={{ fontSize: '0.75rem', color: patientTrust < 50 ? '#f87171' : '#34d399' }}>
              {patientTrust}%
            </strong>
          </div>

          {/* Clock */}
          <span className="ward-clock">
            <i className="fa-solid fa-clock" aria-hidden="true" style={{ marginRight: '6px' }} />
            {currentTime} WIB
          </span>
        </div>
      </header>

      {/* Educational Disclaimer Banner */}
      <div className="ward-disclaimer">
        <span><i className="fa-solid fa-circle-info" aria-hidden="true" /></span>
        <span>{simulation.disclaimer}</span>
      </div>

      {/* ============================================================
          DECORATIVE HOSPITAL BACKDROP (PIXEL BED & EKG MONITOR)
          ============================================================ */}
      <div className="ward-backdrop" aria-hidden="true">
        {/* Pixel Hospital Bed */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '4px' }}>
          {/* IV Drip Stand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '16px',
                background: 'rgba(56, 189, 248, 0.7)',
                borderRadius: '3px',
                border: '1px solid #38bdf8',
                marginBottom: '1px',
              }}
            />
            <div style={{ width: '2px', height: '55px', background: '#94a3b8' }} />
          </div>

          {/* Bed & Pillow */}
          <div
            style={{
              width: '110px',
              height: '38px',
              background: '#1e293b',
              borderRadius: '6px 6px 0 0',
              border: '2px solid #334155',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Pillow */}
            <div
              style={{
                position: 'absolute',
                left: '6px',
                top: '4px',
                width: '24px',
                height: '14px',
                background: '#f8fafc',
                borderRadius: '3px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            />
            {/* Cyan Blanket */}
            <div
              style={{
                position: 'absolute',
                right: '0',
                top: '0',
                bottom: '0',
                width: '74px',
                background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
                borderLeft: '2px solid #38bdf8',
              }}
            />
          </div>
        </div>

        {/* Schedule Board on wall */}
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '4px 8px',
            marginBottom: '12px',
            fontSize: '0.55rem',
            color: '#94a3b8',
            fontFamily: 'monospace',
          }}
        >
          <div style={{ color: '#38bdf8', fontWeight: 600 }}>
            <i className="fa-solid fa-clipboard-list" aria-hidden="true" style={{ marginRight: '6px' }} />
            JADWAL DINAS
          </div>
          <div>Kmr 201-206: Ns. Aktif</div>
        </div>

        {/* Medical EKG Monitor */}
        <div className="ward-ekg-device">
          <div className="ward-ekg-header">
            <span>BED 204</span>
            <span>BPM: 82</span>
          </div>
          <div className="ward-ekg-screen">
            <svg
              className="ekg-wave-path"
              width="280"
              height="60"
              viewBox="0 0 280 60"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <path
                d="M0,30 L20,30 L25,20 L30,42 L35,10 L40,48 L45,30 L70,30 L90,30 L95,20 L100,42 L105,10 L110,48 L115,30 L140,30 L160,30 L165,20 L170,42 L175,10 L180,48 L185,30 L210,30 L230,30 L235,20 L240,42 L245,10 L250,48 L255,30 L280,30"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 4px #10b981)' }}
              />
            </svg>
          </div>
        </div>

        {/* Floor Tiles */}
        <div className="ward-tile-grid" />
      </div>

      {/* ============================================================
          MAIN INTERACTIVE CONTENT (CLIPBOARD / GAMEPLAY / REPORT)
          ============================================================ */}
      {isCompleted ? (
        /* --- FINAL REPORT: LAPORAN SHIFT (07.00 - 14.00) --- */
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              textAlign: 'center',
              borderBottom: '1px dashed #34d399',
              paddingBottom: '12px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.8rem',
                color: '#34d399',
                marginBottom: '4px',
              }}
            >
              <i className="fa-solid fa-clipboard-check" aria-hidden="true" style={{ marginRight: '6px' }} />
              LAPORAN OPERAN SHIFT PAGI (SELESAI)
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Waktu Dinas: 07.00 - 14.00 WIB · Bangsal Rawat Inap & IGD
            </p>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            <div style={{ background: '#0b1322', padding: '10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Tugas Bangsal</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#34d399' }}>4/4 Tuntas ✓</div>
            </div>
            <div style={{ background: '#0b1322', padding: '10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Kepercayaan Akhir</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: patientTrust >= 70 ? '#38bdf8' : '#fbbf24' }}>
                <i className="fa-solid fa-heart" aria-hidden="true" style={{ color: '#f43f5e', marginRight: '4px' }} />
                {patientTrust}%
              </div>
            </div>
            <div style={{ background: '#0b1322', padding: '10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Koreksi Klinis</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: totalErrors === 0 ? '#34d399' : '#fbbf24' }}>
                {totalErrors} kali
              </div>
            </div>
            <div style={{ background: '#0b1322', padding: '10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Petunjuk Digunakan</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#38bdf8' }}>
                {hintsUsed} kali
              </div>
            </div>
          </div>

          {/* Event decisions history */}
          {eventHistory.length > 0 && (
            <div style={{ background: '#0b1322', padding: '12px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>
                <i className="fa-solid fa-bolt" aria-hidden="true" style={{ marginRight: '6px' }} />
                Keputusan Penanganan Situasi Kritis:
              </div>
              {eventHistory.map((ev, i) => (
                <div key={i} style={{ fontSize: '0.75rem', marginBottom: '8px', borderLeft: '2px solid #38bdf8', paddingLeft: '8px' }}>
                  <strong style={{ color: '#e0f2fe' }}>{ev.eventTitle}</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Pilihan: "{ev.choiceText}"</div>
                  <div style={{ color: '#34d399', fontSize: '0.7rem' }}>↳ {ev.consequence}</div>
                </div>
              ))}
            </div>
          )}

          {/* Aspect Scores Breakdown */}
          <div style={{ background: '#0b1322', padding: '14px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <h3 style={{ fontSize: '0.75rem', color: '#38bdf8', marginBottom: '10px' }}>
              <i className="fa-solid fa-chart-simple" aria-hidden="true" style={{ marginRight: '6px' }} />
              Penilaian Kinerja Aspek Keperawatan:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Ketelitian Medis</span>
                  <strong>{scores.ketelitian} / 5</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (scores.ketelitian / 5) * 100)}%`, height: '100%', background: '#38bdf8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Prioritas Triase</span>
                  <strong>{scores.prioritas} / 5</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (scores.prioritas / 5) * 100)}%`, height: '100%', background: '#10b981' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Empati Pasien</span>
                  <strong>{scores.empati} / 5</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (scores.empati / 5) * 100)}%`, height: '100%', background: '#f43f5e' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Komunikasi Terapeutik</span>
                  <strong>{scores.komunikasi} / 5</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (scores.komunikasi / 5) * 100)}%`, height: '100%', background: '#a855f7' }} />
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(52, 211, 153, 0.1)',
                borderRadius: '4px',
                borderLeft: '3px solid #34d399',
                fontSize: '0.75rem',
                color: '#e2e8f0',
              }}
            >
              <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ marginRight: '6px' }} />
              <strong>Kesimpulan Evaluasi:</strong> Kamu teliti dalam memeriksa kondisi pasien, sigap dalam triase darurat, dan mampu berkomunikasi dengan empati tinggi. Karakter ini sangat cocok untuk profesi di bidang kesehatan!
            </div>
          </div>

          {/* Ekspektasi vs Realita Rating */}
          <div style={{ background: '#0b1322', padding: '14px', borderRadius: '6px', border: '1px solid #38bdf8' }}>
            <label style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Seberapa kamu menikmati peran sebagai perawat? (1 - 5 <i className="fa-solid fa-star" aria-hidden="true" style={{ color: '#fbbf24' }} />)
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setPostEnjoyment(star)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    border: '1px solid #38bdf8',
                    background: postEnjoyment === star ? '#38bdf8' : 'transparent',
                    color: postEnjoyment === star ? '#020617' : '#38bdf8',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                  }}
                >
                  {star}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Bagian apa yang paling berkesan bagimu?
              </label>
              <input
                type="text"
                value={mostExciting}
                onChange={(e) => setMostExciting(e.target.value)}
                placeholder="Contoh: Menenangkan pasien yang cemas / menentukan triase IGD"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#040913',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Bagian apa yang paling menantang atau berat?
              </label>
              <input
                type="text"
                value={mostBoring}
                onChange={(e) => setMostBoring(e.target.value)}
                placeholder="Contoh: Tekanan waktu saat IGD darurat / keluarga pasien marah"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#040913',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSaveResult}
              disabled={isSaved}
              className="btn btn--primary"
              style={{ flex: 1, minWidth: '160px', fontSize: '0.65rem' }}
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
              onClick={handleRestart}
              className="btn btn--ghost"
              style={{ fontSize: '0.65rem' }}
            >
              <i className="fa-solid fa-rotate-right" aria-hidden="true" style={{ marginRight: '6px' }} />
              Ulangi
            </button>
            <button
              type="button"
              onClick={onExit}
              className="btn btn--ghost"
              style={{ fontSize: '0.65rem' }}
            >
              <i className="fa-solid fa-building" aria-hidden="true" style={{ marginRight: '6px' }} />
              Kembali ke Gedung
            </button>
          </div>
        </div>
      ) : (
        /* --- NURSE CLIPBOARD: ACTIVE MISSIONS & EVENTS --- */
        <div className="nurse-clipboard">
          <div className="nurse-clipboard-clip" />

          {/* Header */}
          <div className="nurse-clipboard-header">
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: '#38bdf8' }}>
                {currentStep.judul.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Pukul {currentStep.jam} WIB
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setHintsUsed((prev) => prev + 1);
                  setShowHintModal(true);
                  retroSound.playKeypress();
                }}
                className="btn"
                style={{
                  fontSize: '0.55rem',
                  padding: '4px 8px',
                  minHeight: '28px',
                  borderColor: wrongAttempts >= 2 ? '#fbbf24' : '#334155',
                  color: wrongAttempts >= 2 ? '#fbbf24' : '#94a3b8',
                  background: wrongAttempts >= 2 ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                }}
              >
                {wrongAttempts >= 2 ? (
                  <>
                    <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ marginRight: '4px' }} />
                    PETUNJUK (SIAP PAKAI)
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ marginRight: '4px' }} />
                    Petunjuk
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="nurse-clipboard-body">
            {/* ============================================================
                MISI 1: CEK TANDA VITAL
                ============================================================ */}
            {currentStep.tipe === 'misi' && currentStep.id === 'vital' && (
              <div>
                {/* Patient Card */}
                <div
                  style={{
                    background: '#040b17',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.8rem' }}>
                      <i className="fa-solid fa-user" aria-hidden="true" style={{ marginRight: '6px' }} />
                      {simulation.misi.vital.pasien.nama} ({simulation.misi.vital.pasien.usia} thn)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {simulation.misi.vital.pasien.kamar}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                    <strong>Keluhan:</strong> {simulation.misi.vital.pasien.keluhan}
                  </p>
                </div>

                {/* Instructions */}
                <p style={{ fontSize: '0.75rem', color: '#e2e8f0', marginBottom: '12px' }}>
                  {simulation.misi.vital.pasien.nama} sedang dalam perawatan. Periksa monitor tanda vital di bawah. <strong>Ketuk nilai yang menurutmu ABNORMAL</strong>, lalu klik LAPORKAN.
                </p>

                {/* Grid of Vital Signs + Normal Range Side Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '16px' }}>
                  {/* Parameter Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    {simulation.misi.vital.tandaVital.map((vital) => {
                      const isSelected = selectedVitals.includes(vital.id);
                      return (
                        <button
                          key={vital.id}
                          type="button"
                          onClick={() => handleToggleVital(vital.id)}
                          style={{
                            background: isSelected ? 'rgba(239, 68, 68, 0.2)' : '#071224',
                            border: `2px solid ${isSelected ? '#f87171' : 'rgba(56, 189, 248, 0.3)'}`,
                            borderRadius: '6px',
                            padding: '10px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{vital.label}</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: isSelected ? '#f87171' : '#f8fafc' }}>
                            {vital.nilai} <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>{vital.unit}</span>
                          </span>
                          <span style={{ fontSize: '0.65rem', color: isSelected ? '#f87171' : '#64748b' }}>
                            {isSelected ? (
                              <>
                                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '4px' }} />
                                DITANDAI ABNORMAL
                              </>
                            ) : (
                              '◯ Normal? Ketuk jika anomali'
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Reference Table */}
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '6px',
                      padding: '10px',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 600, marginBottom: '6px' }}>
                      <i className="fa-solid fa-book-medical" aria-hidden="true" style={{ marginRight: '6px' }} />
                      TABEL RUJUKAN RENTANG NORMAL:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px', fontSize: '0.7rem' }}>
                      {simulation.misi.vital.rentangNormal.map((item, i) => (
                        <div key={i} style={{ color: '#cbd5e1' }}>
                          • {item.parameter}: <strong>{item.rujukan}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feedback & Proceed Button */}
                {vitalFeedback ? (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      background: vitalFeedback.startsWith('✓') ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${vitalFeedback.startsWith('✓') ? '#34d399' : '#f87171'}`,
                      marginBottom: '14px',
                      fontSize: '0.75rem',
                      color: '#f8fafc',
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {!vitalFeedback.startsWith('✓') && (
                        <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px', color: '#f87171' }} />
                      )}
                      {vitalFeedback}
                    </p>
                    {vitalFeedback.startsWith('✓') && (
                      <button
                        type="button"
                        onClick={() => {
                          setVitalFeedback(null);
                          advanceStep();
                        }}
                        className="btn btn--primary"
                        style={{ marginTop: '10px', width: '100%', fontSize: '0.65rem' }}
                      >
                        Lanjut ke Jadwal Berikutnya (08.30 WIB) →
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitVitals}
                    className="btn btn--primary"
                    style={{ width: '100%', fontSize: '0.65rem' }}
                  >
                    KIRIM LAPORAN TANDA VITAL ↵
                  </button>
                )}
              </div>
            )}

            {/* ============================================================
                MISI 2: PEMBERIAN OBAT 5 BENAR
                ============================================================ */}
            {currentStep.tipe === 'misi' && currentStep.id === 'obat' && (
              <div>
                <p style={{ fontSize: '0.75rem', color: '#e2e8f0', marginBottom: '12px' }}>
                  Sebelum memberikan obat kepada pasien, perawat wajib menerapkan prinsip <strong>5 Benar</strong>. Periksa kartu resep dan label obat di bawah. <strong>Ketuk aspek yang TIDAK COCOK</strong>, lalu tentukan tindakanmu!
                </p>

                {/* Resep vs Label Obat Side by Side */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  {/* Resep Dokter */}
                  <div style={{ background: '#071224', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 600, marginBottom: '8px' }}>
                      <i className="fa-solid fa-clipboard-list" aria-hidden="true" style={{ marginRight: '6px' }} />
                      KARTU RESEP DOKTER
                    </div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div><strong>Pasien:</strong> {simulation.misi.obat.resep.pasien}</div>
                      <div><strong>Obat:</strong> {simulation.misi.obat.resep.obat}</div>
                      <div><strong>Dosis:</strong> {simulation.misi.obat.resep.dosis}</div>
                      <div><strong>Rute:</strong> {simulation.misi.obat.resep.rute}</div>
                      <div><strong>Waktu:</strong> {simulation.misi.obat.resep.waktu}</div>
                    </div>
                  </div>

                  {/* Label Botol Obat */}
                  <div style={{ background: '#0a1628', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 600, marginBottom: '8px' }}>
                      <i className="fa-solid fa-tag" aria-hidden="true" style={{ marginRight: '6px' }} />
                      LABEL DARI INSTALASI FARMASI
                    </div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div><strong>Pasien:</strong> {simulation.misi.obat.labelObat.pasien}</div>
                      <div><strong>Obat:</strong> {simulation.misi.obat.labelObat.obat}</div>
                      <div><strong>Dosis:</strong> {simulation.misi.obat.labelObat.dosis}</div>
                      <div><strong>Rute:</strong> {simulation.misi.obat.labelObat.rute}</div>
                      <div><strong>Waktu:</strong> {simulation.misi.obat.labelObat.waktu}</div>
                    </div>
                  </div>
                </div>

                {/* Aspect Selector */}
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Manakah aspek yang tidak sesuai?
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(['pasien', 'obat', 'dosis', 'rute', 'waktu'] as const).map((aspect) => (
                      <button
                        key={aspect}
                        type="button"
                        onClick={() => handleSelectAspect(aspect)}
                        style={{
                          background: selectedAspect === aspect ? '#f87171' : '#071224',
                          color: selectedAspect === aspect ? '#020617' : '#e2e8f0',
                          border: `1px solid ${selectedAspect === aspect ? '#f87171' : '#334155'}`,
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontWeight: selectedAspect === aspect ? 'bold' : 'normal',
                          textTransform: 'capitalize',
                        }}
                      >
                        Benar {aspect}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => handleMedicationAction('tahan')}
                    disabled={!selectedAspect}
                    className="btn btn--primary"
                    style={{ flex: 1, minWidth: '180px', fontSize: '0.65rem' }}
                  >
                    <i className="fa-solid fa-hand" aria-hidden="true" style={{ marginRight: '6px' }} />
                    Tahan & Konfirmasi ke Dokter/Farmasi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMedicationAction('berikan')}
                    disabled={!selectedAspect}
                    className="btn btn--ghost"
                    style={{ flex: 1, minWidth: '150px', fontSize: '0.65rem', color: '#f87171', borderColor: '#f87171' }}
                  >
                    <i className="fa-solid fa-pills" aria-hidden="true" style={{ marginRight: '6px' }} />
                    Berikan Obat Langsung
                  </button>
                </div>

                {/* Feedback */}
                {medicationFeedback && (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      background: medicationFeedback.startsWith('✓') ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${medicationFeedback.startsWith('✓') ? '#34d399' : '#f87171'}`,
                      fontSize: '0.75rem',
                      color: '#f8fafc',
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {!medicationFeedback.startsWith('✓') && (
                        <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px', color: '#f87171' }} />
                      )}
                      {medicationFeedback}
                    </p>
                    {medicationFeedback.startsWith('✓') && (
                      <button
                        type="button"
                        onClick={() => {
                          setMedicationFeedback(null);
                          advanceStep();
                        }}
                        className="btn btn--primary"
                        style={{ marginTop: '10px', width: '100%', fontSize: '0.65rem' }}
                      >
                        Lanjut ke Jadwal Berikutnya →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================
                WORLD EVENTS (IGD & KELUARGA MARAH)
                ============================================================ */}
            {currentStep.tipe === 'event' && (
              <div>
                {(() => {
                  const eventObj = simulation.event[currentStep.id];
                  if (!eventObj) return null;

                  return (
                    <div>
                      {/* Event Banner */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid #f87171',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          marginBottom: '14px',
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{eventObj.avatar}</span>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f87171' }}>
                            <i className="fa-solid fa-bell" aria-hidden="true" style={{ marginRight: '6px' }} />
                            {eventObj.judul}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
                            Pihak Terkait: <strong>{eventObj.karakter}</strong>
                          </div>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: '0.8rem',
                          lineHeight: 1.55,
                          color: '#f8fafc',
                          background: '#040b17',
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #1e293b',
                          marginBottom: '16px',
                        }}
                      >
                        "{eventObj.cerita}"
                      </p>

                      {/* Options */}
                      {activeEventChoice === null ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>
                            Pilihlah tindakan responsmu:
                          </span>
                          {eventObj.pilihan.map((pil, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectEventOption(idx)}
                              className="btn btn--ghost"
                              style={{
                                textAlign: 'left',
                                justifyContent: 'flex-start',
                                fontSize: '0.7rem',
                                padding: '10px 12px',
                                minHeight: '44px',
                                color: '#e0f2fe',
                                borderColor: 'rgba(56, 189, 248, 0.4)',
                                background: 'rgba(15, 23, 42, 0.6)',
                              }}
                            >
                              <span style={{ color: '#38bdf8', marginRight: '8px', fontFamily: 'var(--font-pixel)' }}>
                                [{String.fromCharCode(65 + idx)}]
                              </span>
                              {pil.teks}
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Consequence Screen */
                        <div
                          style={{
                            padding: '14px',
                            borderRadius: '6px',
                            background: 'rgba(52, 211, 153, 0.12)',
                            border: '1px solid #34d399',
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34d399', marginBottom: '6px' }}>
                            ✓ KONSEKUENSI PILIHAN:
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#f8fafc', lineHeight: 1.5, marginBottom: '12px' }}>
                            {eventObj.pilihan[activeEventChoice].konsekuensi}
                          </p>
                          <button
                            type="button"
                            onClick={handleFinishEvent}
                            className="btn btn--primary"
                            style={{ width: '100%', fontSize: '0.65rem' }}
                          >
                            Lanjut ke Jadwal Tugas ({eventObj.pilihan[activeEventChoice].jamBaru || currentTime} WIB) →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ============================================================
                MISI 3: TRIASE
                ============================================================ */}
            {currentStep.tipe === 'misi' && currentStep.id === 'triase' && (
              <div>
                <p style={{ fontSize: '0.75rem', color: '#e2e8f0', marginBottom: '12px' }}>
                  Triase adalah proses penentuan prioritas penanganan medis. <strong>Urutkan 3 pasien berikut dari yang paling kritis (Paling Atas = Prioritas 1) ke yang paling stabil</strong> menggunakan tombol panah naik/turun.
                </p>

                {/* Patient List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {triageList.map((pt, index) => {
                    let badgeColor = '#94a3b8';
                    if (index === 0) badgeColor = '#f87171'; // Priority 1
                    if (index === 1) badgeColor = '#fbbf24'; // Priority 2
                    if (index === 2) badgeColor = '#34d399'; // Priority 3

                    return (
                      <div
                        key={pt.id}
                        style={{
                          background: '#071224',
                          border: `1px solid ${badgeColor}`,
                          borderRadius: '6px',
                          padding: '10px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              background: badgeColor,
                              color: '#020617',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.85rem',
                              fontFamily: 'var(--font-pixel)',
                            }}
                          >
                            #{index + 1}
                          </span>
                          <div>
                            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.8rem' }}>
                              {pt.nama}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                              {pt.keluhan}
                            </div>
                          </div>
                        </div>

                        {/* Reorder Buttons (Accessible) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <button
                            type="button"
                            onClick={() => moveTriagePatient(index, 'up')}
                            disabled={index === 0}
                            title="Naikkan prioritas"
                            style={{
                              background: '#1e293b',
                              border: '1px solid #475569',
                              color: index === 0 ? '#475569' : '#38bdf8',
                              padding: '2px 8px',
                              borderRadius: '3px',
                              cursor: index === 0 ? 'default' : 'pointer',
                              fontSize: '0.65rem',
                            }}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveTriagePatient(index, 'down')}
                            disabled={index === triageList.length - 1}
                            title="Turunkan prioritas"
                            style={{
                              background: '#1e293b',
                              border: '1px solid #475569',
                              color: index === triageList.length - 1 ? '#475569' : '#38bdf8',
                              padding: '2px 8px',
                              borderRadius: '3px',
                              cursor: index === triageList.length - 1 ? 'default' : 'pointer',
                              fontSize: '0.65rem',
                            }}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback or Submit */}
                {triageFeedback ? (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      background: triageFeedback.startsWith('✓') ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${triageFeedback.startsWith('✓') ? '#34d399' : '#f87171'}`,
                      fontSize: '0.75rem',
                      color: '#f8fafc',
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {!triageFeedback.startsWith('✓') && (
                        <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px', color: '#f87171' }} />
                      )}
                      {triageFeedback}
                    </p>
                    {triageFeedback.startsWith('✓') && (
                      <button
                        type="button"
                        onClick={() => {
                          setTriageFeedback(null);
                          advanceStep();
                        }}
                        className="btn btn--primary"
                        style={{ marginTop: '10px', width: '100%', fontSize: '0.65rem' }}
                      >
                        Lanjut ke Jadwal Berikutnya →
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitTriage}
                    className="btn btn--primary"
                    style={{ width: '100%', fontSize: '0.65rem' }}
                  >
                    KONFIRMASI URUTAN TRIASE ↵
                  </button>
                )}
              </div>
            )}

            {/* ============================================================
                MISI 4: MENENANGKAN PASIEN
                ============================================================ */}
            {currentStep.tipe === 'misi' && currentStep.id === 'komunikasi' && (
              <div>
                {/* Dialogue Box */}
                <div
                  style={{
                    background: '#040b17',
                    border: '1px solid #38bdf8',
                    borderRadius: '6px',
                    padding: '14px',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.3rem', color: '#38bdf8' }}>
                      <i className="fa-solid fa-hospital-user" aria-hidden="true" />
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.78rem' }}>
                        {simulation.misi.komunikasi.pasien.nama} ({simulation.misi.komunikasi.pasien.usia} thn)
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                        {simulation.misi.komunikasi.pasien.kondisi}
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      color: '#f8fafc',
                      background: 'rgba(56, 189, 248, 0.08)',
                      padding: '10px',
                      borderRadius: '4px',
                      margin: 0,
                    }}
                  >
                    "{simulation.misi.komunikasi.pasien.dialog}"
                  </p>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#e2e8f0', marginBottom: '10px' }}>
                  Pilihlah kalimat respons yang menunjukkan <strong>komunikasi terapeutik</strong> yang empatik, menenangkan, dan jelas bagi pasien:
                </p>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {simulation.misi.komunikasi.pilihan.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectCalming(opt.id)}
                      className="btn btn--ghost"
                      style={{
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        fontSize: '0.72rem',
                        lineHeight: 1.45,
                        padding: '10px 12px',
                        minHeight: '44px',
                        color: selectedCalmingId === opt.id ? '#38bdf8' : '#e0f2fe',
                        borderColor: selectedCalmingId === opt.id ? '#38bdf8' : '#334155',
                        background: selectedCalmingId === opt.id ? 'rgba(56, 189, 248, 0.15)' : '#071224',
                      }}
                    >
                      {opt.teks}
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {calmingFeedback && (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      background: calmingFeedback.startsWith('✓') ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${calmingFeedback.startsWith('✓') ? '#34d399' : '#f87171'}`,
                      fontSize: '0.75rem',
                      color: '#f8fafc',
                    }}
                  >
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                      {!calmingFeedback.startsWith('✓') && (
                        <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '6px', color: '#f87171' }} />
                      )}
                      {calmingFeedback}
                    </p>
                    {calmingFeedback.startsWith('✓') && (
                      <button
                        type="button"
                        onClick={() => {
                          setCalmingFeedback(null);
                          advanceStep('14.00');
                        }}
                        className="btn btn--primary"
                        style={{ marginTop: '10px', width: '100%', fontSize: '0.65rem' }}
                      >
                        Selesaikan Shift & Lihat Laporan (14.00 WIB) →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          HINT MODAL (PETUNJUK)
          ============================================================ */}
      {showHintModal && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(4, 10, 20, 0.85)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 30,
          }}
          onClick={() => setShowHintModal(false)}
        >
          <div
            style={{
              background: '#0b1322',
              border: '2px solid #fbbf24',
              borderRadius: '8px',
              maxWidth: '440px',
              width: '100%',
              padding: '16px',
              boxShadow: '0 0 25px rgba(251, 191, 36, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24' }}>
                <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ marginRight: '6px' }} />
                PETUNJUK PERAWAT
              </span>
              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#f8fafc', lineHeight: 1.5, marginBottom: '14px' }}>
              {getCurrentHint()}
            </p>
            <button
              type="button"
              onClick={() => setShowHintModal(false)}
              className="btn btn--primary"
              style={{ width: '100%', fontSize: '0.65rem' }}
            >
              Paham, Kembali ke Misi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
