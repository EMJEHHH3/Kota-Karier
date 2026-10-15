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

export default function ResultPage() {
  const { state } = useUserState();
  const [counselorCode, setCounselorCode] = useState<string>('');
  const [counselorResult, setCounselorResult] = useState<DecodedResultCode | null>(null);
  const [counselorError, setCounselorError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

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
          📄 Cetak / PDF
        </button>
      </header>

      {/* Print Document Title */}
      <div className="print-only" style={{ padding: '16px 0', borderBottom: '2px solid #000', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 'bold' }}>Kota Karier — Laporan Eksplorasi Siswa</h1>
        <p style={{ fontSize: '10pt', color: '#4b5563' }}>
          Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })} · Kode Hasil: <strong>{shareCode}</strong>
        </p>
      </div>

      <main className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
        {/* If no test & no simulation done yet */}
        {!hasTest && !hasSimulations && (
          <div className="panel no-print" style={{ textAlign: 'center', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>📜</div>
            <h2 className="pixel-text" style={{ fontSize: '0.7rem', color: 'var(--color-accent-yellow)', marginBottom: 'var(--space-sm)' }}>
              Belum Ada Data Eksplorasi
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
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
          <div className="panel" style={{ borderColor: 'var(--color-accent-purple)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <h2 style={{ fontSize: '0.7rem', color: 'var(--color-accent-purple)' }}>
                👨‍🏫 Tampilan Guru BK (Kode: {counselorCode.toUpperCase()})
              </h2>
              <button onClick={() => setCounselorResult(null)} className="btn btn--ghost" style={{ fontSize: '0.5rem', padding: '2px 6px' }}>
                ✕ Tutup
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
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
          <section className="panel" style={{ marginBottom: 'var(--space-lg)', borderColor: 'var(--color-border-cyan)' }}>
            <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)', marginBottom: '4px' }}>
              🏆 Top 3 Rekomendasi Profesi
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Berdasarkan performa simulasi, ketahanan kerja, dan kecenderungan minatmu:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {top3Professions.map(({ id, reason }, idx) => {
                const prof = getProfessionById(id);
                if (!prof) return null;

                return (
                  <div
                    key={id}
                    style={{
                      padding: '12px',
                      background: 'rgba(34, 211, 238, 0.05)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-accent-cyan)' }}>
                        #{idx + 1} {prof.nama}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-accent-yellow)' }}>
                        💰 {prof.realityCheck.prospek.rentangGaji}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                      💡 <em>"{reason}"</em>
                    </p>

                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                      <strong>Jurusan Utama:</strong> {prof.realityCheck.jurusanKuliah.utama.join(', ')}
                    </p>

                    <div className="no-print" style={{ marginTop: '8px' }}>
                      <Link to={`/profesi/${prof.id}`} className="btn btn--ghost" style={{ fontSize: '0.55rem', padding: '4px 8px' }}>
                        Buka Reality Check →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. EKSPEKTASI VS REALITA CARDS */}
        {hasSimulations && (
          <section className="panel" style={{ marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-yellow)', marginBottom: 'var(--space-md)' }}>
              ⚖️ Ekspektasi vs Realita
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {Object.values(state.simulationResults).map((sim) => {
                const prof = getProfessionById(sim.professionId);
                if (!prof) return null;

                return (
                  <div key={sim.professionId} style={{ padding: '10px 14px', background: 'var(--color-bg-dark)', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>{prof.nama}</strong>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: sim.ekspektasiDelta >= 0 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                          color: sim.ekspektasiDelta >= 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
                        }}
                      >
                        Delta: {sim.ekspektasiDelta > 0 ? `+${sim.ekspektasiDelta}` : sim.ekspektasiDelta}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      Ekspektasi: {sim.preInterest}/5 ⭐ → Realita Pengalaman: {sim.postEnjoyment}/5 ⭐
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      🎉 <em>Paling seru:</em> {sim.mostExciting}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      ⚡ <em>Paling menantang:</em> {sim.mostBoring}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. 6-MONTH ACTION PLAN */}
        <section className="panel" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-green)', marginBottom: 'var(--space-md)' }}>
            🗓️ Rencana Aksi 6 Bulan (Action Plan)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ borderLeft: '3px solid var(--color-accent-cyan)', paddingLeft: '12px' }}>
              <h3 style={{ fontSize: '0.65rem', color: 'var(--color-accent-cyan)', marginBottom: '4px' }}>
                Bulan 1 - 2: Eksplorasi & Validasi Awal
              </h3>
              <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '14px' }}>
                <li>Tonton video "Day in the Life" praktisi di YouTube/TikTok untuk melihat rutinitas harian.</li>
                <li>Wawancarai minimal 1 orang mahasiswa jurusan terkait (tanyakan mata kuliah paling sulit).</li>
                <li>Coba 1 mini project mandiri (misal: buat web portofolio atau ikut seminar kesehatan).</li>
              </ul>
            </div>

            <div style={{ borderLeft: '3px solid var(--color-accent-yellow)', paddingLeft: '12px' }}>
              <h3 style={{ fontSize: '0.65rem', color: 'var(--color-accent-yellow)', marginBottom: '4px' }}>
                Bulan 3 - 4: Pemetaan Jurusan & Kampus
              </h3>
              <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '14px' }}>
                <li>Riset daya tampung & keketatan jalur SNBP, SNBT, dan Jalur Mandiri di PTN/PTS tujuan.</li>
                <li>Bandingkan kurikulum universitas utama vs politeknik/vokasi D4.</li>
                <li>Diskusikan estimasi biaya kuliah (UKT) dan opsi beasiswa bersama orang tua.</li>
              </ul>
            </div>

            <div style={{ borderLeft: '3px solid var(--color-accent-green)', paddingLeft: '12px' }}>
              <h3 style={{ fontSize: '0.65rem', color: 'var(--color-accent-green)', marginBottom: '4px' }}>
                Bulan 5 - 6: Persiapan Portofolio & Konsultasi BK
              </h3>
              <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '14px' }}>
                <li>Mulai drill soal try-out SNBT secara berkala untuk subtes penalaran matematika & logika.</li>
                <li>Bawa lembar PDF hasil Kota Karier ini ke Guru BK untuk sesi konseling personal.</li>
                <li>Kunci pilihan 1 dan pilihan 2 program studi dengan pertimbangan matang.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. SHAREABLE CODE & COUNSELOR LOOKUP */}
        <section className="panel no-print" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)', marginBottom: 'var(--space-sm)' }}>
            🔗 Kode Hasil & Akses Guru BK
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
            Bagikan kode 8 karakter ini kepada orang tua atau Guru BK tanpa perlu membuat akun atau login:
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--color-bg-dark)',
              border: '2px dashed var(--color-border-cyan)',
              borderRadius: '4px',
              marginBottom: 'var(--space-md)',
            }}
          >
            <span className="pixel-text" style={{ fontSize: '1.1rem', letterSpacing: '4px', color: 'var(--color-accent-yellow)' }}>
              {shareCode}
            </span>
            <button onClick={handleCopyCode} className="btn btn--primary" style={{ fontSize: '0.55rem', marginLeft: 'auto' }}>
              {copied ? '✓ Disalin!' : '📋 Salin Kode'}
            </button>
          </div>

          {/* Counselor Code Lookup Input */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--color-border-subtle)' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
              Punya kode hasil dari siswa lain / teman? Masukkan di sini:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
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
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  width: '180px',
                }}
              />
              <button onClick={handleLookupCode} className="btn" style={{ fontSize: '0.55rem' }}>
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
        <div className="no-print" style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handlePrint} className="btn btn--primary">
            📄 Cetak / Download PDF
          </button>
          <Link to="/" className="btn">
            ← Kembali ke Kota
          </Link>
          <Link to="/bandingkan" className="btn btn--ghost">
            ⚖️ Bandingkan Profesi
          </Link>
        </div>
      </main>
    </div>
  );
}
