/**
 * ResultPage — User's Comprehensive Career Exploration Results.
 * Route: /hasil
 * Features:
 * - Top 3 professions with personalized rationale
 * - Ekspektasi vs Realita comparison
 * - Relevant majors & alternative pathways
 * - 6-month concrete action plan
 * - 8-character shareable result code
 * - Counselor lookup mode (Guru BK)
 * - 1-page printable PDF export
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserState } from '../lib/context';
import { rankProfessions } from '../lib/scoring';
import { PROFESSIONS, getProfessionById } from '../data/professions';
import { encodeResultCode, decodeResultCode, type DecodedResultCode } from '../lib/shareCode';
import { GuestSyncBanner } from '../components/GuestSyncBanner';
import { storage } from '../lib/storage';

interface ActionPlanPhase {
  id: string;
  periode: string;
  langkah: { id: string; text: string }[];
}

const ACTION_PLAN_PHASES: ActionPlanPhase[] = [
  {
    id: 'fase-1',
    periode: 'Bulan 1 - 2: Eksplorasi & Validasi Awal',
    langkah: [
      { id: 'b1-1', text: 'Tonton video "Day in the Life" praktisi di YouTube/TikTok untuk melihat rutinitas harian.' },
      { id: 'b1-2', text: 'Wawancarai minimal 1 orang mahasiswa jurusan terkait (tanyakan mata kuliah paling sulit).' },
      { id: 'b1-3', text: 'Coba 1 mini project mandiri (misal: buat web portofolio atau ikut seminar kesehatan).' },
    ],
  },
  {
    id: 'fase-2',
    periode: 'Bulan 3 - 4: Pemetaan Jurusan & Kampus',
    langkah: [
      { id: 'b2-1', text: 'Riset daya tampung & keketatan jalur SNBP, SNBT, dan Jalur Mandiri di PTN/PTS tujuan.' },
      { id: 'b2-2', text: 'Bandingkan kurikulum universitas utama vs politeknik/vokasi D4.' },
      { id: 'b2-3', text: 'Diskusikan estimasi biaya kuliah (UKT) dan opsi beasiswa bersama orang tua.' },
    ],
  },
  {
    id: 'fase-3',
    periode: 'Bulan 5 - 6: Persiapan Portofolio & Konsultasi BK',
    langkah: [
      { id: 'b3-1', text: 'Mulai drill soal try-out SNBT secara berkala untuk subtes penalaran matematika & logika.' },
      { id: 'b3-2', text: 'Bawa lembar PDF hasil Kota Karier ini ke Guru BK untuk sesi konseling personal.' },
      { id: 'b3-3', text: 'Kunci pilihan 1 dan pilihan 2 program studi dengan pertimbangan matang.' },
    ],
  },
];

export default function ResultPage() {
  const { state } = useUserState();
  const [counselorCode, setCounselorCode] = useState<string>('');
  const [counselorResult, setCounselorResult] = useState<DecodedResultCode | null>(null);
  const [counselorError, setCounselorError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Accordion state for 6-Month Action Plan (first phase open by default)
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({
    'fase-1': true,
    'fase-2': false,
    'fase-3': false,
  });

  // Action plan checklist state persisted to unified storage layer
  const [checkedStepIds, setCheckedStepIds] = useState<string[]>(() => {
    return storage.getItem<string[]>('kota-karier-action-checklist') || [];
  });

  // Note expansion state for Ekspektasi vs Realita
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const hasSimulations = Object.keys(state.simulationResults).length > 0;
  const hasTest = Boolean(state.testResult);

  // Compute Top 3 Professions
  let top3Professions: { id: string; score?: number; reason: string }[] = [];

  if (hasSimulations) {
    const ranked = rankProfessions(state.simulationResults, 3);
    top3Professions = ranked.map(([id, score]) => {
      const sim = state.simulationResults[id];
      const dominantStyle = Object.entries(sim.totalScores.workStyle).sort((a, b) => b[1] - a[1])[0][0];
      let reason = `Kamu menunjukkan kecocokan gaya kerja ${dominantStyle}.`;
      if (id === 'dokter') {
        reason = 'Ketahananmu tinggi saat menghadapi situasi pasien kritis dan kamu teliti dalam anamnesis.';
      } else if (id === 'software-engineer') {
        reason = 'Kamu bertahan fokus pada analisis teknis dan debugging saat menghadapi masalah kode.';
      } else if (id === 'data-analyst') {
        reason = 'Kamu teliti dalam mengekstrak query SQL dan tanggap dalam menganalisis anomali data bisnis.';
      } else if (id === 'perawat') {
        reason = 'Kamu teliti dalam memeriksa kondisi pasien, sigap dalam triase darurat, dan memiliki empati komunikasi yang hangat.';
      }
      return { id, score, reason };
    });
  } else if (hasTest && state.testResult) {
    const topTypes = state.testResult.topTypes;
    const matched = PROFESSIONS.filter((p) => p.riasec.some((r) => topTypes.includes(r)));
    top3Professions = matched.slice(0, 3).map((p) => ({
      id: p.id,
      reason: `Sesuai dengan kecenderungan minat ${p.riasec.join(' & ')} pada tes minatmu.`,
    }));
  }

  // Generate 8-character share code
  const currentTopTypes = state.testResult?.topTypes || ['Investigative', 'Social'];
  const currentTopProfIds = top3Professions.map((p) => p.id);
  const shareCode = encodeResultCode(
    currentTopTypes,
    currentTopProfIds.length > 0 ? currentTopProfIds : ['dokter', 'software-engineer'],
    4
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLookupCode = () => {
    setCounselorError('');
    const decoded = decodeResultCode(counselorCode);
    if (!decoded) {
      setCounselorError('Kode tidak valid. Pastikan memasukkan 8 karakter huruf dan angka dengan benar.');
      setCounselorResult(null);
    } else {
      setCounselorResult(decoded);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleStep = (stepId: string) => {
    setCheckedStepIds((prev) => {
      const next = prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId];
      storage.setItem('kota-karier-action-checklist', next);
      return next;
    });
  };

  const togglePhase = (phaseId: string) => {
    setOpenPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const toggleNotes = (profId: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [profId]: !prev[profId],
    }));
  };

  const totalStepsCount = ACTION_PLAN_PHASES.reduce((acc, p) => acc + p.langkah.length, 0);
  const completedStepsCount = checkedStepIds.length;

  return (
    <div className="page-enter" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-sm) var(--space-md)',
          borderBottom: '2px solid var(--color-border-cyan)',
          background: 'var(--color-bg-panel)',
        }}
      >
        <Link to="/" className="btn btn--ghost" style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}>
          ← Kota
        </Link>
        <h1 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)' }}>
          Laporan Hasil Eksplorasi
        </h1>
        <button onClick={handlePrint} className="btn btn--primary" style={{ fontSize: '0.5rem', padding: '4px 8px' }}>
          <i className="fa-solid fa-file-pdf" aria-hidden="true" style={{ marginRight: '6px' }} />
          Cetak / PDF
        </button>
      </header>

      {/* Guest sync prompt banner */}
      <GuestSyncBanner />

      {/* Print Document Title */}
      <div className="print-only" style={{ padding: '16px 0', borderBottom: '2px solid #000', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 'bold' }}>Kota Karier — Laporan Eksplorasi Siswa</h1>
        <p style={{ fontSize: '10pt', color: '#4b5563' }}>
          Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })} · Kode Hasil: <strong>{shareCode}</strong>
        </p>
      </div>

      <main className="rp-container">
        {/* If no test & no simulation done yet */}
        {!hasTest && !hasSimulations && (
          <div className="rp-section no-print" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-yellow)' }}>
              <i className="fa-solid fa-scroll" aria-hidden="true" />
            </div>
            <h2 className="pixel-text" style={{ fontSize: '0.7rem', color: 'var(--color-accent-yellow)', marginBottom: 'var(--space-sm)' }}>
              Belum Ada Data Eksplorasi
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)', overflowWrap: 'anywhere' }}>
              Untuk melihat rekomendasi Top 3 profesi, Ekspektasi vs Realita, dan Rencana Aksi 6 Bulan, silakan mulai dari Tes Minat atau coba simulasi di gedung kota!
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/tes-minat" className="btn btn--primary">
                Mulai Tes Minat & Gaya Kerja
              </Link>
              <Link to="/" className="btn">
                Jelajahi Gedung Kota
              </Link>
            </div>
          </div>
        )}

        {/* Counselor Result View (if looked up) */}
        {counselorResult && (
          <div className="rp-section" style={{ borderColor: 'var(--color-accent-purple)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-purple)', fontWeight: 700 }}>
                Tampilan Guru BK (Kode: {counselorCode.toUpperCase()})
              </h2>
              <button onClick={() => setCounselorResult(null)} className="btn btn--ghost" style={{ fontSize: '0.5rem', padding: '2px 6px' }}>
                ✕ Tutup
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Kecenderungan Minat Siswa: <strong>{counselorResult.topRiasec.join(', ')}</strong>
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {counselorResult.topProfessions.map((profId) => {
                const prof = getProfessionById(profId);
                return prof ? (
                  <div key={prof.id} style={{ padding: '8px 12px', background: 'var(--color-bg-dark)', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent-cyan)' }}>{prof.nama}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Jurusan: {prof.realityCheck.jurusanKuliah.utama[0]}</div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* 1. TOP 3 PROFESSIONS */}
        {top3Professions.length > 0 && (
          <section className="rp-section">
            <div className="rp-section-header">
              <svg className="rp-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-cyan)' }} aria-hidden="true">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <h2 className="rp-section-title">Top 3 Rekomendasi Profesi</h2>
            </div>

            <p className="rp-section-desc">
              Berdasarkan performa simulasi, ketahanan kerja, dan kecenderungan minatmu.
            </p>

            {/* Card #1 (Bigger) */}
            {(() => {
              const p1 = top3Professions[0];
              const prof1 = getProfessionById(p1.id);
              if (!prof1) return null;
              const salary1 = prof1.realityCheck.prospek.rentangGaji.split('(')[0].trim().replace(/\/bulan$/i, '/bln');
              return (
                <div className="rp-top1-card">
                  <div className="rp-top1-topbar">
                    <div>
                      <span className="rp-rank-badge">#1 Rekomendasi Utama</span>
                      <h3 className="rp-top1-name">{prof1.nama}</h3>
                    </div>
                    <span className="rp-salary-pill" title={prof1.realityCheck.prospek.rentangGaji}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      <span>{salary1}</span>
                    </span>
                  </div>

                  <div className="rp-chips-wrap">
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jurusan Utama:</span>
                    {prof1.realityCheck.jurusanKuliah.utama.map((j, i) => (
                      <span key={i} className="rp-chip">{j}</span>
                    ))}
                  </div>

                  <p className="rp-quote" title={p1.reason}>"{p1.reason}"</p>

                  <div className="no-print" style={{ marginTop: '4px' }}>
                    <Link to={`/profesi/${prof1.id}`} className="btn btn--primary" style={{ fontSize: '0.65rem' }}>
                      Buka Reality Check →
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Cards #2 and #3 (Smaller, side-by-side) */}
            {top3Professions.length > 1 && (
              <div className="rp-secondary-grid">
                {top3Professions.slice(1, 3).map(({ id }, idx) => {
                  const prof = getProfessionById(id);
                  if (!prof) return null;
                  const salary = prof.realityCheck.prospek.rentangGaji.split('(')[0].trim().replace(/\/bulan$/i, '/bln');
                  const mainMajor = prof.realityCheck.jurusanKuliah.utama[0];
                  return (
                    <Link key={id} to={`/profesi/${prof.id}`} className="rp-secondary-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="rp-rank-badge" style={{ color: 'var(--color-text-secondary)', borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>
                          #{idx + 2}
                        </span>
                        <span className="rp-salary-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          {salary}
                        </span>
                      </div>
                      <div className="rp-secondary-name">{prof.nama}</div>
                      {mainMajor && (
                        <div className="rp-chips-wrap">
                          <span className="rp-chip">{mainMajor}</span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 2. EKSPEKTASI VS REALITA */}
        {hasSimulations && (
          <section className="rp-section">
            <div className="rp-section-header">
              <svg className="rp-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-yellow)' }} aria-hidden="true">
                <line x1="12" y1="3" x2="12" y2="21" />
                <path d="m6 8 6-3 6 3" />
                <path d="m6 8-4 6a4 4 0 0 0 8 0L6 8Z" />
                <path d="m18 8-4 6a4 4 0 0 0 8 0l-4-6Z" />
                <line x1="4" y1="21" x2="20" y2="21" />
              </svg>
              <h2 className="rp-section-title">Ekspektasi vs Realita</h2>
            </div>

            <p className="rp-section-desc">
              Perbandingan bayangan awalanmu dengan kenyataan ritme kerja selama simulasi.
            </p>

            <div className="rp-sim-list">
              {Object.values(state.simulationResults).map((sim) => {
                const prof = getProfessionById(sim.professionId);
                if (!prof) return null;
                const isNotesOpen = Boolean(expandedNotes[sim.professionId]);
                const prePct = Math.min(100, Math.max(0, (sim.preInterest / 5) * 100));
                const postPct = Math.min(100, Math.max(0, (sim.postEnjoyment / 5) * 100));

                return (
                  <div key={sim.professionId} className="rp-sim-row">
                    <div className="rp-sim-main">
                      <div className="rp-sim-title">{prof.nama}</div>

                      <div className="rp-rating-bars">
                        <div className="rp-mini-bar-item" title={`Ekspektasi Awal: ${sim.preInterest}/5`}>
                          <span>Ekspektasi {sim.preInterest}/5</span>
                          <div className="rp-mini-bar-track">
                            <div className="rp-mini-bar-fill" style={{ width: `${prePct}%`, background: 'var(--color-accent-cyan)' }} />
                          </div>
                        </div>

                        <div className="rp-mini-bar-item" title={`Realita Pengalaman: ${sim.postEnjoyment}/5`}>
                          <span>Realita {sim.postEnjoyment}/5</span>
                          <div className="rp-mini-bar-track">
                            <div className="rp-mini-bar-fill" style={{ width: `${postPct}%`, background: 'var(--color-accent-yellow)' }} />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className={`rp-delta-badge ${
                            sim.ekspektasiDelta > 0
                              ? 'rp-delta-positive'
                              : sim.ekspektasiDelta < 0
                              ? 'rp-delta-negative'
                              : 'rp-delta-neutral'
                          }`}
                        >
                          Delta: {sim.ekspektasiDelta > 0 ? `+${sim.ekspektasiDelta}` : sim.ekspektasiDelta}
                        </span>

                        <button
                          type="button"
                          className="rc-inline-expand"
                          onClick={() => toggleNotes(sim.professionId)}
                          aria-expanded={isNotesOpen}
                          style={{ padding: '0 4px', fontSize: '0.75rem', marginTop: 0 }}
                        >
                          {isNotesOpen ? 'Tutup' : 'Lihat catatan'}
                        </button>
                      </div>
                    </div>

                    {isNotesOpen && (
                      <div className="rp-notes-expand">
                        <div>
                          <strong style={{ color: 'var(--color-text-primary)' }}>Paling seru:</strong> {sim.mostExciting}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--color-text-primary)' }}>Paling menantang:</strong> {sim.mostBoring}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. 6-MONTH ACTION PLAN (ACCORDION & CHECKLIST) */}
        <section className="rp-section">
          <div className="rp-section-header">
            <svg className="rp-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-green)' }} aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h2 className="rp-section-title">Rencana Aksi 6 Bulan</h2>
          </div>

          <p className="rp-section-desc">
            Panduan bertahap menyiapkan diri menuju perkuliahan dan karier impianmu.
          </p>

          {/* Small progress display */}
          <div className="rp-progress-box">
            <div className="rp-progress-text">
              <span>Progres Aksi</span>
              <span>{completedStepsCount} dari {totalStepsCount} langkah selesai</span>
            </div>
            <div className="rp-progress-track">
              <div
                className="rp-progress-bar"
                style={{ width: `${(completedStepsCount / totalStepsCount) * 100}%` }}
              />
            </div>
          </div>

          {/* 3 Accordion Cards */}
          <div className="rp-accordion-stack">
            {ACTION_PLAN_PHASES.map((phase) => {
              const isOpen = Boolean(openPhases[phase.id]);
              return (
                <div key={phase.id} className="rp-accordion-card">
                  <button
                    type="button"
                    className="rp-accordion-btn"
                    onClick={() => togglePhase(phase.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="rp-accordion-title-wrap">
                      <span className="rp-accordion-title">{phase.periode}</span>
                      <span className="rp-accordion-count">{phase.langkah.length} langkah</span>
                    </div>
                    <svg
                      className={`rp-accordion-chevron ${isOpen ? 'rp-accordion-chevron--open' : ''}`}
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <ul className="rp-checklist">
                      {phase.langkah.map((item) => {
                        const isChecked = checkedStepIds.includes(item.id);
                        return (
                          <li key={item.id} style={{ listStyle: 'none' }}>
                            <label className="rp-checklist-item">
                              <input
                                type="checkbox"
                                className="rp-checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleStep(item.id)}
                                aria-label={item.text}
                              />
                              <span className={`rp-checklist-text ${isChecked ? 'rp-checklist-text--done' : ''}`}>
                                {item.text}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SHAREABLE CODE & COUNSELOR LOOKUP */}
        <section className="rp-section no-print">
          <div className="rp-section-header">
            <svg className="rp-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-purple)' }} aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <h2 className="rp-section-title">Kode Hasil & Akses Guru BK</h2>
          </div>

          <div className="rp-bk-card">
            <div className="rp-bk-row">
              <span className="rp-code-display">{shareCode}</span>
              <button onClick={handleCopyCode} className="btn btn--primary" style={{ fontSize: '0.65rem' }}>
                {copied ? (
                  <>
                    <i className="fa-solid fa-check" aria-hidden="true" style={{ marginRight: '4px' }} />
                    Disalin!
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-clipboard" aria-hidden="true" style={{ marginRight: '4px' }} />
                    Salin Kode
                  </>
                )}
              </button>
            </div>
            <p className="rp-bk-desc">
              Bagikan kode 8 karakter ini kepada orang tua atau Guru BK tanpa perlu membuat akun atau login.
            </p>
          </div>

          {/* Counselor Code Lookup Input */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
              Punya kode hasil dari siswa lain / teman? Masukkan di sini:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                maxLength={8}
                value={counselorCode}
                onChange={(e) => setCounselorCode(e.target.value.toUpperCase())}
                placeholder="Misal: ABCD2345"
                style={{
                  background: 'var(--color-bg-dark)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-cyan)',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  width: '160px',
                }}
              />
              <button onClick={handleLookupCode} className="btn" style={{ fontSize: '0.6rem' }}>
                Cek Hasil
              </button>
            </div>
            {counselorError && (
              <p style={{ fontSize: '0.7rem', color: 'var(--color-accent-red)', marginTop: '4px' }}>
                {counselorError}
              </p>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <button onClick={handlePrint} className="btn btn--primary">
            <i className="fa-solid fa-file-pdf" aria-hidden="true" style={{ marginRight: '6px' }} />
            Cetak / Download PDF
          </button>
          <Link to="/" className="btn">
            ← Kembali ke Kota
          </Link>
          <Link to="/bandingkan" className="btn btn--ghost">
            <i className="fa-solid fa-scale-balanced" aria-hidden="true" style={{ marginRight: '6px' }} />
            Bandingkan Profesi
          </Link>
        </div>
      </main>
    </div>
  );
}
