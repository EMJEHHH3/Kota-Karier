/**
 * InterestTestPage — Tes Minat & Gaya Kerja
 * Route: /tes-minat
 * 18 scenario-based questions based on RIASEC framework.
 * Pure deterministic scoring with suspicious answer detection.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TEST_QUESTIONS } from '../data/tes-minat';
import { computeTestResult } from '../lib/scoring';
import { useUserState } from '../lib/context';
import type { TestAnswer, RiasecType } from '../types';
import { BUILDINGS } from '../data/city';

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

export default function InterestTestPage() {
  const navigate = useNavigate();
  const { state, saveTestResult } = useUserState();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(Boolean(state.testResult));
  const [lastAnswerTime, setLastAnswerTime] = useState<number>(Date.now());
  const [showSpeedWarning, setShowSpeedWarning] = useState<boolean>(false);

  const activeResult = state.testResult;

  const handleStart = () => {
    setIsStarted(true);
    setIsCompleted(false);
    setCurrentIndex(0);
    setAnswers([]);
    setLastAnswerTime(Date.now());
    setShowSpeedWarning(false);
  };

  const handleAnswer = (optionIndex: number) => {
    const now = Date.now();
    const timeSpent = now - lastAnswerTime;

    if (timeSpent < 1200) {
      setShowSpeedWarning(true);
    } else {
      setShowSpeedWarning(false);
    }

    const newAnswer: TestAnswer = {
      questionId: TEST_QUESTIONS[currentIndex].id,
      chosenIndex: optionIndex,
      timestamp: now,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setLastAnswerTime(now);

    if (currentIndex + 1 < TEST_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Test complete
      const finalResult = computeTestResult(updatedAnswers);
      saveTestResult(finalResult);
      setIsCompleted(true);
    }
  };

  // Render Completed Summary
  if (isCompleted && activeResult) {
    const recommendedBuildings = BUILDINGS.filter(
      (b) => b.status === 'active' && b.riasec.some((r) => activeResult.topTypes.includes(r))
    );

    return (
      <div className="page-enter" style={{ minHeight: '100dvh' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)',
            borderBottom: '2px solid var(--color-border-cyan)',
            background: 'var(--color-bg-panel)',
          }}
        >
          <Link to="/" className="btn btn--ghost" style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}>
            ← Kota
          </Link>
          <h1 style={{ fontSize: '0.65rem', color: 'var(--color-accent-green)' }}>
            Hasil Tes Minat & Gaya Kerja
          </h1>
        </header>

        <main className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
          {/* Important exploration notice */}
          <div className="panel" style={{ marginBottom: 'var(--space-lg)', borderColor: 'var(--color-accent-yellow)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-accent-yellow)', marginBottom: '4px' }}>
              ⚠️ Ini alat eksplorasi, bukan vonis.
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Kamu menunjukkan kecenderungan minat di bawah ini. Hasil ini bukan pembatas, melainkan panduan awal untuk mencoba profesi di kota!
            </p>
          </div>

          {activeResult.isSuspicious && (
            <div className="panel" style={{ marginBottom: 'var(--space-lg)', borderColor: 'var(--color-accent-orange)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-accent-orange)' }}>
                💡 Catatan: Beberapa jawaban terisi cukup cepat atau berpola seragam. Jika merasa hasil kurang sesuai, kamu bisa mengulang tes lebih santai ya!
              </p>
            </div>
          )}

          {/* Top RIASEC Types */}
          <section className="panel" style={{ marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '0.7rem', color: 'var(--color-accent-cyan)', marginBottom: 'var(--space-md)' }}>
              🌟 Kecenderungan Minat Terbesarmu
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {activeResult.topTypes.map((type) => {
                const info = RIASEC_DESCRIPTIONS[type];
                const score = activeResult.scores[type];
                return (
                  <div
                    key={type}
                    style={{
                      padding: '12px',
                      background: 'rgba(34, 211, 238, 0.05)',
                      border: '1px solid var(--color-border-cyan)',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="pixel-text" style={{ fontSize: '0.55rem', color: 'var(--color-accent-cyan)' }}>
                        {info.label}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-yellow)', fontWeight: 600 }}>
                        Skor: {score}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {info.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Building recommendations */}
          <section className="panel" style={{ marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '0.65rem', color: 'var(--color-accent-yellow)', marginBottom: 'var(--space-md)' }}>
              🏙️ Gedung yang Direkomendasikan
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Gedung-gedung ini memiliki lingkungan kerja yang paling relevan dengan kecenderunganmu:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {recommendedBuildings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: 'var(--color-bg-panel-hover)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '4px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {b.nama}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                      {b.deskripsi}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/gedung/${b.id}`)}
                    className="btn btn--primary"
                    style={{ fontSize: '0.55rem', padding: '6px 10px' }}
                  >
                    Kunjungi →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn btn--primary">
              🏙️ Jelajahi Kota Sekarang
            </Link>
            <button onClick={handleStart} className="btn">
              🔄 Ulangi Tes
            </button>
            <Link to="/hasil" className="btn btn--ghost">
              Lihat Ringkasan Hasil
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Render Start Screen
  if (!isStarted) {
    return (
      <div className="page-enter" style={{ minHeight: '100dvh' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)',
            borderBottom: '2px solid var(--color-border-cyan)',
            background: 'var(--color-bg-panel)',
          }}
        >
          <Link to="/" className="btn btn--ghost" style={{ fontSize: '0.5rem', minHeight: '36px', padding: '4px 8px' }}>
            ← Kota
          </Link>
          <h1 style={{ fontSize: '0.65rem', color: 'var(--color-accent-yellow)' }}>
            Pusat Informasi
          </h1>
        </header>

        <main className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
          <div className="panel" style={{ textAlign: 'center', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🧭</div>
            <h2 className="pixel-text" style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)', marginBottom: 'var(--space-sm)' }}>
              Tes Minat & Gaya Kerja
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Bukan tes kepribadian atau vonis karier. Ini simulasi skenario santai untuk memetakan kecenderungan minatmu berdasarkan teori RIASEC (Holland).
            </p>

            <div
              style={{
                display: 'inline-flex',
                gap: '16px',
                padding: '8px 16px',
                background: 'rgba(34, 211, 238, 0.08)',
                borderRadius: '4px',
                fontSize: '0.7rem',
                color: 'var(--color-accent-cyan)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <span>⏱️ ~5-7 menit</span>
              <span>📝 18 skenario nyata</span>
              <span>🔒 100% di HP-mu</span>
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <button onClick={handleStart} className="btn btn--primary" style={{ padding: '12px 24px', fontSize: '0.75rem' }}>
                🚀 Mulai Eksplorasi
              </button>
            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              *Kamu bebas melewati tes ini dan langsung menjelajahi gedung kota jika mau.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Render Question Step
  const currentQ = TEST_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex) / TEST_QUESTIONS.length) * 100);

  return (
    <div className="page-enter" style={{ minHeight: '100dvh' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-sm) var(--space-md)',
          borderBottom: '2px solid var(--color-border-cyan)',
          background: 'var(--color-bg-panel)',
        }}
      >
        <span className="pixel-text" style={{ fontSize: '0.55rem', color: 'var(--color-accent-cyan)' }}>
          Skenario {currentIndex + 1} / {TEST_QUESTIONS.length}
        </span>
        <button
          onClick={() => {
            if (window.confirm('Keluar dari tes? Progres tes ini belum tersimpan.')) {
              setIsStarted(false);
            }
          }}
          className="btn btn--ghost"
          style={{ fontSize: '0.5rem', padding: '4px 8px' }}
        >
          ✕ Batal
        </button>
      </header>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: '#1e293b', width: '100%' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'var(--color-accent-cyan)',
            transition: 'width 250ms ease',
          }}
        />
      </div>

      <main className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
        {showSpeedWarning && (
          <div
            className="panel"
            style={{
              marginBottom: 'var(--space-md)',
              borderColor: 'var(--color-accent-yellow)',
              padding: '8px 12px',
              fontSize: '0.7rem',
              color: 'var(--color-accent-yellow)',
            }}
          >
            ☕ Santai aja ya, baca skenarionya pelan-pelan agar rekomendasinya lebih tepat.
          </div>
        )}

        {/* Question Panel */}
        <div className="panel" style={{ marginBottom: 'var(--space-lg)' }}>
          <p className="pixel-text" style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            Pertanyaan {currentIndex + 1}
          </p>
          <h2 style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
            {currentQ.pertanyaan}
          </h2>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {currentQ.opsi.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="panel panel--hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                padding: 'var(--space-md)',
                cursor: 'pointer',
                border: '2px solid var(--color-border-subtle)',
                background: 'var(--color-bg-panel)',
                width: '100%',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  background: 'rgba(34, 211, 238, 0.1)',
                  color: 'var(--color-accent-cyan)',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.6rem',
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                {opt.teks}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
