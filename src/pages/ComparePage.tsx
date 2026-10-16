/**
 * ComparePage — Data-driven side-by-side profession comparison.
 * Supports 0, 1, 2, or 3 professions without duplicates.
 * Route: /bandingkan
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROFESSIONS, getProfessionById } from '../data/professions';
import type { Profession } from '../types';
import { storage } from '../lib/storage';

const COMPARE_STORAGE_KEY = 'kota-karier-compare-list';

// Meta styling for profession slots
const PROF_SLOTS = [
  { letter: 'A', accent: 'var(--cmp-accent-a)', badgeClass: 'cmp-badge-a' },
  { letter: 'B', accent: 'var(--cmp-accent-b)', badgeClass: 'cmp-badge-b' },
  { letter: 'C', accent: 'var(--cmp-accent-c)', badgeClass: 'cmp-badge-c' },
];

interface ResolvedCompactData {
  gajiMin: number;
  gajiMax: number;
  gajiRingkas: string;
  prospekRingkas: string;
  jurusanUtama: string;
  jalurTercepat: string;
  tantanganUtama: string;
  seruUtama: string;
}

/**
 * Safely resolves compact comparison data.
 * If any field is missing, derive it from realityCheck with graceful text trimming.
 */
function getCompactData(p: Profession): ResolvedCompactData {
  const rc = p.realityCheck;

  // 1. Gaji Min & Max
  let gMin = p.gajiMin;
  let gMax = p.gajiMax;
  if (typeof gMin !== 'number' || typeof gMax !== 'number') {
    const matches = rc.prospek.rentangGaji.match(/\d[\d.]+/g)?.map((s) => parseInt(s.replace(/\./g, ''), 10)) || [];
    gMin = matches[0] || 4000000;
    gMax = matches[1] || 12000000;
  }

  // 2. Gaji Ringkas
  let gRingkas = p.gajiRingkas;
  if (!gRingkas) {
    gRingkas = `Rp ${(gMin / 1000000).toLocaleString('id-ID')} - ${(gMax / 1000000).toLocaleString('id-ID')} jt`;
  }

  // 3. Prospek Ringkas (1-3 words)
  let pRingkas = p.prospekRingkas;
  if (!pRingkas) {
    const raw = rc.prospek.permintaan.split(/[—–-]/)[0].trim();
    pRingkas = raw.split(/\s+/).slice(0, 3).join(' ') || 'Tinggi';
  }

  // 4. Jurusan Utama (single major name)
  let jUtama = p.jurusanUtama;
  if (!jUtama) {
    jUtama = rc.jurusanKuliah.utama[0] || 'Umum';
  }

  // 5. Jalur Tercepat
  let jTercepat = p.jalurTercepat;
  if (!jTercepat) {
    const alt = rc.jalurAlternatif[0];
    if (alt) {
      jTercepat = `${alt.jenis}: ${alt.deskripsi.slice(0, 32)}...`;
    } else {
      jTercepat = 'Vokasi / Pelatihan Praktik';
    }
  }

  // 6. Tantangan Utama (<= 8 words)
  let tUtama = p.tantanganUtama;
  if (!tUtama) {
    const firstChallenge = rc.sisiTidakEnak[0] || 'Tuntutan kerja harian';
    tUtama = firstChallenge.split(/\s+/).slice(0, 8).join(' ');
  }

  // 7. Seru Utama (<= 8 words)
  let sUtama = p.seruUtama;
  if (!sUtama) {
    const firstExcitement = rc.tugasHarian[0] || 'Aktivitas profesional menarik';
    sUtama = firstExcitement.split(/\s+/).slice(0, 8).join(' ');
  }

  return {
    gajiMin: gMin,
    gajiMax: gMax,
    gajiRingkas: gRingkas,
    prospekRingkas: pRingkas,
    jurusanUtama: jUtama,
    jalurTercepat: jTercepat,
    tantanganUtama: tUtama,
    seruUtama: sUtama,
  };
}

/**
 * Filter unique IDs and ensure they belong to valid registered professions.
 */
function deduplicateIds(rawList: unknown[]): string[] {
  const seen = new Set<string>();
  const valid: string[] = [];
  for (const item of rawList) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed && !seen.has(trimmed) && getProfessionById(trimmed)) {
        seen.add(trimmed);
        valid.push(trimmed);
      }
    }
  }
  return valid.slice(0, 3);
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize compared IDs: URL params take priority, fallback to storage
  const [comparedIds, setComparedIds] = useState<string[]>(() => {
    const p1 = searchParams.get('p1');
    const p2 = searchParams.get('p2');
    const p3 = searchParams.get('p3');
    const urlIds = [p1, p2, p3].filter(Boolean);

    const storedIds = storage.getItem<string[]>(COMPARE_STORAGE_KEY) || [];

    if (urlIds.length > 0) {
      return deduplicateIds(urlIds);
    }
    if (storedIds.length > 0) {
      return deduplicateIds(storedIds);
    }
    return [];
  });

  // Keep storage and searchParams in sync
  useEffect(() => {
    storage.setItem(COMPARE_STORAGE_KEY, comparedIds);
    const params = new URLSearchParams();
    if (comparedIds[0]) params.set('p1', comparedIds[0]);
    if (comparedIds[1]) params.set('p2', comparedIds[1]);
    if (comparedIds[2]) params.set('p3', comparedIds[2]);
    setSearchParams(params, { replace: true });
  }, [comparedIds, setSearchParams]);

  // Active mobile tab index
  const [activeMobileTab, setActiveMobileTab] = useState<number>(0);

  // Single open row detail state (opening one closes previous)
  const [openRowDetail, setOpenRowDetail] = useState<string | null>(null);

  // Dropdown states for slot replacement and empty slot
  const [replacingSlotIndex, setReplacingSlotIndex] = useState<number | null>(null);
  const [emptySlotSelectedId, setEmptySlotSelectedId] = useState<string>('');

  // Resolved list of professions
  const professions: Profession[] = useMemo(() => {
    return comparedIds
      .map((id) => getProfessionById(id))
      .filter((p): p is Profession => Boolean(p));
  }, [comparedIds]);

  // Unselected professions that can be added
  const availableToAdd = useMemo(() => {
    return PROFESSIONS.filter((p) => !comparedIds.includes(p.id));
  }, [comparedIds]);

  // Set default selection for empty slot dropdown
  useEffect(() => {
    if (availableToAdd.length > 0 && !availableToAdd.some((p) => p.id === emptySlotSelectedId)) {
      setEmptySlotSelectedId(availableToAdd[0].id);
    }
  }, [availableToAdd, emptySlotSelectedId]);

  // Handlers
  const handleRemoveProfession = (index: number) => {
    const next = comparedIds.filter((_, i) => i !== index);
    setComparedIds(next);
    if (activeMobileTab >= next.length && next.length > 0) {
      setActiveMobileTab(next.length - 1);
    }
  };

  const handleAddProfession = (idToAdd: string) => {
    if (!idToAdd || comparedIds.includes(idToAdd) || comparedIds.length >= 3) return;
    const next = [...comparedIds, idToAdd];
    setComparedIds(next);
  };

  const handleReplaceProfession = (slotIndex: number, newId: string) => {
    if (!newId || comparedIds.includes(newId)) return;
    const next = [...comparedIds];
    next[slotIndex] = newId;
    setComparedIds(next);
    setReplacingSlotIndex(null);
  };

  const toggleRowDetail = (rowKey: string) => {
    setOpenRowDetail((prev) => (prev === rowKey ? null : rowKey));
  };

  // -------------------------------------------------------------
  // ZERO PROFESSION STATE
  // -------------------------------------------------------------
  if (professions.length === 0) {
    return (
      <div className="cmp-wrapper">
        <header className="cmp-sticky-header">
          <div className="cmp-header-inner">
            <div className="cmp-header-left">
              <Link to="/" className="cmp-btn-icon" title="Kembali ke Kota">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Kota</span>
              </Link>
              <h1 className="cmp-title">Bandingkan Profesi</h1>
            </div>
          </div>
        </header>

        <main className="cmp-container">
          <div className="cmp-zero-card">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--cmp-accent-a)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }} aria-hidden="true">
              <line x1="12" y1="3" x2="12" y2="21" />
              <path d="m6 8 6-3 6 3" />
              <path d="m6 8-4 6a4 4 0 0 0 8 0L6 8Z" />
              <path d="m18 8-4 6a4 4 0 0 0 8 0l-4-6Z" />
              <line x1="4" y1="21" x2="20" y2="21" />
            </svg>
            <p className="cmp-zero-msg">
              Belum ada profesi yang dipilih untuk dibandingkan. Pilih satu atau dua profesi untuk melihat perbedaan gaji, syarat kuliah, dan realita kerjanya.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <select
                className="cmp-select"
                value={emptySlotSelectedId}
                onChange={(e) => setEmptySlotSelectedId(e.target.value)}
                aria-label="Pilih profesi awal"
              >
                {PROFESSIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleAddProfession(emptySlotSelectedId || PROFESSIONS[0].id)}
                className="cmp-btn-add"
              >
                Pilih Profesi
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Column count in unified grid: 2 if 1 or 2 professions, 3 if 3 professions
  const isOneProfessionMode = professions.length === 1;
  const colCount = isOneProfessionMode ? 2 : professions.length;

  return (
    <div className="cmp-wrapper">
      {/* 1. STICKY HEADER: Kartu kecil per profesi (huruf A/B/C, nama, RIASEC, ganti, hapus) */}
      <header className="cmp-sticky-header">
        <div className="cmp-header-inner">
          <div className="cmp-header-left">
            <Link to="/" className="cmp-btn-icon" title="Kembali ke Kota">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Kota</span>
            </Link>
            <h1 className="cmp-title">Bandingkan Profesi</h1>
          </div>

          <div className="cmp-header-cards">
            {professions.map((p, idx) => {
              const slot = PROF_SLOTS[idx] || PROF_SLOTS[0];
              const isReplacing = replacingSlotIndex === idx;

              return (
                <div key={p.id} className="cmp-mini-card">
                  <span className={`cmp-badge-letter ${slot.badgeClass}`}>{slot.letter}</span>
                  <div style={{ minWidth: 0 }}>
                    <span className="cmp-mini-name">{p.nama}</span>
                  </div>

                  <div className="cmp-mini-actions">
                    {/* Ganti button & inline selector */}
                    {isReplacing ? (
                      <select
                        className="cmp-select"
                        style={{ padding: '2px 6px', fontSize: '0.75rem', maxWidth: '140px', margin: 0 }}
                        autoFocus
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) handleReplaceProfession(idx, e.target.value);
                        }}
                        onBlur={() => setReplacingSlotIndex(null)}
                        aria-label={`Ganti profesi ${p.nama}`}
                      >
                        <option value="" disabled>Pilih pengganti...</option>
                        {availableToAdd.map((avail) => (
                          <option key={avail.id} value={avail.id}>
                            {avail.nama}
                          </option>
                        ))}
                      </select>
                    ) : (
                      availableToAdd.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setReplacingSlotIndex(idx)}
                          className="cmp-btn-icon"
                          title={`Ganti profesi ${p.nama}`}
                          aria-label={`Ganti ${p.nama}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 21h5v-5" />
                          </svg>
                          <span>Ganti</span>
                        </button>
                      )
                    )}

                    {/* Hapus button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveProfession(idx)}
                      className="cmp-btn-icon cmp-btn-icon--danger"
                      title={`Hapus profesi ${p.nama} dari perbandingan`}
                      aria-label={`Hapus ${p.nama}`}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* If 1 profession, show empty badge indicator */}
            {isOneProfessionMode && (
              <div className="cmp-mini-card" style={{ borderStyle: 'dashed', opacity: 0.85 }}>
                <span className="cmp-badge-letter cmp-badge-b">B</span>
                <span className="cmp-mini-name" style={{ color: 'var(--cmp-text-soft)' }}>
                  Pilih profesi pembanding
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="cmp-container">
        {/* 2. KOTAK "BEDA UTAMANYA": 3 poin singkat satu baris dari data (gaji, jalur tercepat, tantangan utama) */}
        <section className="cmp-diff-box" aria-label="Ringkasan perbedaan utama">
          <h2 className="cmp-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 3h5v5" />
              <path d="M8 3H3v5" />
              <path d="M12 22v-8.3" />
              <path d="m8 16 4-2.5 4 2.5" />
            </svg>
            Beda Utamanya
          </h2>

          <div className="cmp-diff-list">
            {/* Poin 1: Gaji Junior */}
            <div className="cmp-diff-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cmp-diff-icon" aria-hidden="true">
                <line x1="12" y1="2" x2="12" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <div>
                <span className="cmp-diff-label">Gaji Junior:</span>
                {professions.map((p, i) => (
                  <span key={p.id}>
                    {i > 0 && <span style={{ color: 'var(--cmp-text-soft)', margin: '0 6px' }}>vs</span>}
                    <strong>{p.nama}</strong> ({getCompactData(p).gajiRingkas})
                  </span>
                ))}
                {isOneProfessionMode && <span style={{ color: 'var(--cmp-text-soft)', marginLeft: '6px' }}>(Pilih profesi kedua untuk membandingkan)</span>}
              </div>
            </div>

            {/* Poin 2: Jalur Tercepat */}
            <div className="cmp-diff-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cmp-diff-icon" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <div>
                <span className="cmp-diff-label">Jalur Tercepat:</span>
                {professions.map((p, i) => (
                  <span key={p.id}>
                    {i > 0 && <span style={{ color: 'var(--cmp-text-soft)', margin: '0 6px' }}>vs</span>}
                    <strong>{p.nama}</strong> ({getCompactData(p).jalurTercepat})
                  </span>
                ))}
              </div>
            </div>

            {/* Poin 3: Tantangan Utama */}
            <div className="cmp-diff-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cmp-diff-icon" aria-hidden="true">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <span className="cmp-diff-label">Tantangan Kunci:</span>
                {professions.map((p, i) => (
                  <span key={p.id}>
                    {i > 0 && <span style={{ color: 'var(--cmp-text-soft)', margin: '0 6px' }}>vs</span>}
                    <strong>{p.nama}</strong> ({getCompactData(p).tantanganUtama})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* RESPONSIVE SEGMENTED TABS (< 720px)                           */}
        {/* ------------------------------------------------------------- */}
        <div className="cmp-mobile-tabs" role="tablist" aria-label="Pilih profesi yang ingin dilihat di layar ponsel">
          {professions.map((p, idx) => {
            const slot = PROF_SLOTS[idx] || PROF_SLOTS[0];
            const isActive = activeMobileTab === idx;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveMobileTab(idx)}
                className={`cmp-tab-btn ${isActive ? 'cmp-tab-btn--active' : ''}`}
                style={{ borderColor: isActive ? slot.accent : 'var(--cmp-border)' }}
              >
                <span className={`cmp-badge-letter ${slot.badgeClass}`} style={{ width: '18px', height: '18px', fontSize: '0.65rem' }}>
                  {slot.letter}
                </span>
                <span>{p.nama}</span>
              </button>
            );
          })}
          {isOneProfessionMode && availableToAdd.length > 0 && (
            <button
              type="button"
              className="cmp-tab-btn"
              onClick={() => setActiveMobileTab(1)}
              style={{ borderStyle: 'dashed' }}
            >
              <span className="cmp-badge-letter cmp-badge-b" style={{ width: '18px', height: '18px', fontSize: '0.65rem' }}>B</span>
              <span>+ Tambah Profesi</span>
            </button>
          )}
        </div>

        {/* MOBILE CARD VIEW (< 720px) */}
        <div className="cmp-mobile-view">
          {activeMobileTab < professions.length ? (
            (() => {
              const activeProf = professions[activeMobileTab];
              const slot = PROF_SLOTS[activeMobileTab] || PROF_SLOTS[0];
              const data = getCompactData(activeProf);
              const rc = activeProf.realityCheck;

              return (
                <div className="cmp-mobile-card">
                  {/* Header info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`cmp-badge-letter ${slot.badgeClass}`}>{slot.letter}</span>
                      <h3 className="cmp-prof-title">{activeProf.nama}</h3>
                    </div>
                    <div className="cmp-riasec-chips">
                      {activeProf.riasec.map((r) => (
                        <span key={r} className="cmp-chip">{r}</span>
                      ))}
                    </div>
                  </div>

                  {/* Gaji (Hanya teks gajiRingkas tebal tanpa visual grafis) */}
                  <div className="cmp-mobile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p className="cmp-row-title">Gaji Junior</p>
                      <button
                        type="button"
                        onClick={() => toggleRowDetail('gaji')}
                        className="cmp-btn-detail"
                        aria-expanded={openRowDetail === 'gaji'}
                      >
                        {openRowDetail === 'gaji' ? 'Tutup' : 'Detail'}
                      </button>
                    </div>
                    <p className="cmp-val-highlight">{data.gajiRingkas}</p>
                    {openRowDetail === 'gaji' && (
                      <div className="cmp-mobile-detail-box">
                        <strong style={{ color: 'var(--cmp-text)' }}>Rentang lengkap:</strong>{' '}
                        <span>{rc.prospek.rentangGaji}</span>
                      </div>
                    )}
                  </div>

                  {/* Prospek */}
                  <div className="cmp-mobile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p className="cmp-row-title">Prospek Karier</p>
                      <button
                        type="button"
                        onClick={() => toggleRowDetail('prospek')}
                        className="cmp-btn-detail"
                        aria-expanded={openRowDetail === 'prospek'}
                      >
                        {openRowDetail === 'prospek' ? 'Tutup' : 'Detail'}
                      </button>
                    </div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{data.prospekRingkas}</p>
                    {openRowDetail === 'prospek' && (
                      <div className="cmp-mobile-detail-box">
                        <strong style={{ color: 'var(--cmp-text)' }}>Kebutuhan industri:</strong>{' '}
                        <span>{rc.prospek.permintaan}</span>
                      </div>
                    )}
                  </div>

                  {/* Jurusan Utama */}
                  <div className="cmp-mobile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p className="cmp-row-title">Jurusan Kuliah Utama</p>
                      <button
                        type="button"
                        onClick={() => toggleRowDetail('jurusan')}
                        className="cmp-btn-detail"
                        aria-expanded={openRowDetail === 'jurusan'}
                      >
                        {openRowDetail === 'jurusan' ? 'Tutup' : 'Detail'}
                      </button>
                    </div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{data.jurusanUtama}</p>
                    {openRowDetail === 'jurusan' && (
                      <div className="cmp-mobile-detail-box">
                        <div style={{ marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--cmp-text)' }}>Alternatif:</strong>{' '}
                          <span>{rc.jurusanKuliah.alternatif.join(', ')}</span>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--cmp-text)' }}>Mata kuliah inti:</strong>{' '}
                          <span>{rc.jurusanKuliah.mataKuliahInti.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Jalur Tercepat */}
                  <div className="cmp-mobile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p className="cmp-row-title">Jalur Tercepat (Non-S1)</p>
                      <button
                        type="button"
                        onClick={() => toggleRowDetail('jalur')}
                        className="cmp-btn-detail"
                        aria-expanded={openRowDetail === 'jalur'}
                      >
                        {openRowDetail === 'jalur' ? 'Tutup' : 'Detail'}
                      </button>
                    </div>
                    <p className="cmp-val-highlight" style={{ fontSize: '0.9375rem' }}>{data.jalurTercepat}</p>
                    {openRowDetail === 'jalur' && (
                      <div className="cmp-mobile-detail-box">
                        {rc.jalurAlternatif.map((alt, i) => (
                          <div key={i} style={{ marginBottom: i < rc.jalurAlternatif.length - 1 ? '6px' : 0 }}>
                            <strong style={{ color: 'var(--cmp-text)' }}>{alt.jenis}:</strong>{' '}
                            <span>{alt.deskripsi}</span>
                            {alt.contoh && alt.contoh.length > 0 && (
                              <span style={{ display: 'block', color: 'var(--cmp-text-faint)', fontSize: '0.8rem', marginTop: '1px' }}>
                                Contoh: {alt.contoh.join(', ')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Yang Seru (Maks 3 poin, tanpa tombol detail/expander) */}
                  <div className="cmp-mobile-section">
                    <p className="cmp-row-title">Yang Seru</p>
                    <ul className="cmp-bullet-list">
                      {rc.tugasHarian.slice(0, 3).map((t, idx) => (
                        <li key={idx} className="cmp-bullet-item">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Yang Berat (Maks 3 poin, tanpa tombol detail/expander) */}
                  <div className="cmp-mobile-section">
                    <p className="cmp-row-title">Yang Berat</p>
                    <ul className="cmp-bullet-list">
                      {rc.sisiTidakEnak.slice(0, 3).map((s, idx) => (
                        <li key={idx} className="cmp-bullet-item">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tombol aksi */}
                  <Link to={`/profesi/${activeProf.id}`} className="cmp-btn-explore" style={{ width: '100%' }}>
                    Jelajahi {activeProf.nama} →
                  </Link>
                </div>
              );
            })()
          ) : (
            // Empty slot on mobile
            <div className="cmp-mobile-card">
              <div className="cmp-empty-slot" style={{ border: 'none', background: 'transparent', padding: '16px 0' }}>
                <h3 className="cmp-empty-title">Pilih profesi pembanding</h3>
                <p className="cmp-empty-desc">Pilih profesi lain untuk melengkapi perbandingan.</p>
                <select
                  className="cmp-select"
                  value={emptySlotSelectedId}
                  onChange={(e) => setEmptySlotSelectedId(e.target.value)}
                  aria-label="Pilih profesi pembanding"
                >
                  {availableToAdd.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAddProfession(emptySlotSelectedId)}
                  className="cmp-btn-add"
                >
                  + Tambah Pembanding
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP TABLE VIEW (>= 721px)                                 */}
        {/* SATU GRID DENGAN DISPLAY: CONTENTS AGAR SEMUA BARIS SEJAJAR   */}
        {/* ------------------------------------------------------------- */}
        <div className="cmp-desktop-table">
          <div className="cmp-table-grid" style={{ '--n': colCount } as React.CSSProperties}>
            {/* Header Row: Nama Profesi & RIASEC */}
            <div className="cmp-grid-row">
              <div className="cmp-cell-label" style={{ justifyContent: 'center' }}>
                <span className="cmp-row-title" style={{ fontSize: '0.8rem', color: 'var(--cmp-text-faint)' }}>
                  ASPEK PERBANDINGAN
                </span>
              </div>

              {professions.map((p, idx) => {
                const slot = PROF_SLOTS[idx] || PROF_SLOTS[0];
                const isLast = idx === colCount - 1;
                return (
                  <div key={p.id} className={`cmp-head-col ${isLast ? 'cmp-cell-last' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`cmp-badge-letter ${slot.badgeClass}`}>{slot.letter}</span>
                      <h3 className="cmp-prof-title">{p.nama}</h3>
                    </div>
                    <div className="cmp-riasec-chips">
                      {p.riasec.map((r) => (
                        <span key={r} className="cmp-chip">{r}</span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {isOneProfessionMode && (
                <div className="cmp-head-col cmp-cell-last" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="cmp-badge-letter cmp-badge-b">B</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cmp-text-soft)' }}>
                      Profesi Pembanding
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* BARIS 1: GAJI JUNIOR (TEKS RINGKAS TEBAL TANPA GRAFIS) */}
            <div className="cmp-grid-row">
              <div className="cmp-cell-label">
                <span className="cmp-row-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Gaji Junior
                </span>
                <button
                  type="button"
                  id="btn-detail-gaji"
                  onClick={() => toggleRowDetail('gaji')}
                  className="cmp-btn-detail"
                  aria-expanded={openRowDetail === 'gaji'}
                  aria-controls="detail-row-gaji"
                >
                  <span>{openRowDetail === 'gaji' ? 'Tutup' : 'Detail'}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={openRowDetail === 'gaji' ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
                  </svg>
                </button>
              </div>

              {professions.map((p, idx) => {
                const data = getCompactData(p);
                const isLast = idx === colCount - 1;
                return (
                  <div key={p.id} className={`cmp-cell-value ${isLast ? 'cmp-cell-last' : ''}`}>
                    <div className="cmp-val-highlight">{data.gajiRingkas}</div>
                  </div>
                );
              })}

              {isOneProfessionMode && (
                <div className="cmp-cell-value cmp-cell-last" style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <div className="cmp-empty-slot">
                    <p className="cmp-empty-title">Pilih profesi pembanding</p>
                    <p className="cmp-empty-desc">Bandingkan gaji dan prospek dengan karier lain.</p>
                    <select
                      className="cmp-select"
                      value={emptySlotSelectedId}
                      onChange={(e) => setEmptySlotSelectedId(e.target.value)}
                      aria-label="Pilih profesi pembanding"
                    >
                      {availableToAdd.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddProfession(emptySlotSelectedId)}
                      className="cmp-btn-add"
                    >
                      + Tambah Pembanding
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DETAIL BARIS GAJI: Baris grid sejajar dengan tabel */}
            {openRowDetail === 'gaji' && (
              <div className="cmp-grid-row" id="detail-row-gaji" role="region" aria-labelledby="btn-detail-gaji">
                <div className="cmp-cell-detail-lead" aria-hidden="true" />
                {professions.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`cmp-cell-detail ${idx === colCount - 1 ? 'cmp-cell-last' : ''}`}
                  >
                    <div>
                      <strong style={{ color: 'var(--cmp-text)' }}>Rentang lengkap:</strong>{' '}
                      <span>{p.realityCheck.prospek.rentangGaji}</span>
                    </div>
                  </div>
                ))}
                {isOneProfessionMode && (
                  <div className="cmp-cell-detail cmp-cell-last" style={{ color: 'var(--cmp-text-faint)', fontStyle: 'italic' }}>
                    -
                  </div>
                )}
              </div>
            )}

            {/* BARIS 2: PROSPEK */}
            <div className="cmp-grid-row">
              <div className="cmp-cell-label">
                <span className="cmp-row-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  Prospek
                </span>
                <button
                  type="button"
                  id="btn-detail-prospek"
                  onClick={() => toggleRowDetail('prospek')}
                  className="cmp-btn-detail"
                  aria-expanded={openRowDetail === 'prospek'}
                  aria-controls="detail-row-prospek"
                >
                  <span>{openRowDetail === 'prospek' ? 'Tutup' : 'Detail'}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={openRowDetail === 'prospek' ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
                  </svg>
                </button>
              </div>

              {professions.map((p, idx) => {
                const data = getCompactData(p);
                const isLast = idx === colCount - 1;
                return (
                  <div key={p.id} className={`cmp-cell-value ${isLast ? 'cmp-cell-last' : ''}`}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cmp-text)' }}>
                      {data.prospekRingkas}
                    </span>
                  </div>
                );
              })}

              {isOneProfessionMode && (
                <div className="cmp-cell-value cmp-cell-last" style={{ color: 'var(--cmp-text-soft)', fontStyle: 'italic' }}>
                  Belum dipilih
                </div>
              )}
            </div>

            {/* DETAIL BARIS PROSPEK: Baris grid sejajar */}
            {openRowDetail === 'prospek' && (
              <div className="cmp-grid-row" id="detail-row-prospek" role="region" aria-labelledby="btn-detail-prospek">
                <div className="cmp-cell-detail-lead" aria-hidden="true" />
                {professions.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`cmp-cell-detail ${idx === colCount - 1 ? 'cmp-cell-last' : ''}`}
                  >
                    <div>
                      <strong style={{ color: 'var(--cmp-text)' }}>Kebutuhan industri:</strong>{' '}
                      <span>{p.realityCheck.prospek.permintaan}</span>
                    </div>
                  </div>
                ))}
                {isOneProfessionMode && (
                  <div className="cmp-cell-detail cmp-cell-last" style={{ color: 'var(--cmp-text-faint)', fontStyle: 'italic' }}>
                    -
                  </div>
                )}
              </div>
            )}

            {/* BARIS 3: JURUSAN UTAMA */}
            <div className="cmp-grid-row">
              <div className="cmp-cell-label">
                <span className="cmp-row-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  Jurusan Utama
                </span>
                <button
                  type="button"
                  id="btn-detail-jurusan"
                  onClick={() => toggleRowDetail('jurusan')}
                  className="cmp-btn-detail"
                  aria-expanded={openRowDetail === 'jurusan'}
                  aria-controls="detail-row-jurusan"
                >
                  <span>{openRowDetail === 'jurusan' ? 'Tutup' : 'Detail'}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={openRowDetail === 'jurusan' ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
                  </svg>
                </button>
              </div>

              {professions.map((p, idx) => {
                const data = getCompactData(p);
                const isLast = idx === colCount - 1;
                return (
                  <div key={p.id} className={`cmp-cell-value ${isLast ? 'cmp-cell-last' : ''}`}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cmp-text)' }}>
                      {data.jurusanUtama}
                    </span>
                  </div>
                );
              })}

              {isOneProfessionMode && (
                <div className="cmp-cell-value cmp-cell-last" style={{ color: 'var(--cmp-text-soft)', fontStyle: 'italic' }}>
                  Belum dipilih
                </div>
              )}
            </div>

            {/* DETAIL BARIS JURUSAN: Baris grid sejajar */}
            {openRowDetail === 'jurusan' && (
              <div className="cmp-grid-row" id="detail-row-jurusan" role="region" aria-labelledby="btn-detail-jurusan">
                <div className="cmp-cell-detail-lead" aria-hidden="true" />
                {professions.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`cmp-cell-detail ${idx === colCount - 1 ? 'cmp-cell-last' : ''}`}
                  >
                    <div style={{ marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--cmp-text)' }}>Alternatif:</strong>{' '}
                      <span>{p.realityCheck.jurusanKuliah.alternatif.join(', ')}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--cmp-text)' }}>Mata kuliah inti:</strong>{' '}
                      <span>{p.realityCheck.jurusanKuliah.mataKuliahInti.join(', ')}</span>
                    </div>
                  </div>
                ))}
                {isOneProfessionMode && (
                  <div className="cmp-cell-detail cmp-cell-last" style={{ color: 'var(--cmp-text-faint)', fontStyle: 'italic' }}>
                    -
                  </div>
                )}
              </div>
            )}

            {/* BARIS 4: JALUR TERCEPAT (NON-S1) */}
            <div className="cmp-grid-row">
              <div className="cmp-cell-label">
                <span className="cmp-row-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Jalur Tercepat
                </span>
                <button
                  type="button"
                  id="btn-detail-jalur"
                  onClick={() => toggleRowDetail('jalur')}
                  className="cmp-btn-detail"
                  aria-expanded={openRowDetail === 'jalur'}
                  aria-controls="detail-row-jalur"
                >
                  <span>{openRowDetail === 'jalur' ? 'Tutup' : 'Detail'}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={openRowDetail === 'jalur' ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
                  </svg>
                </button>
              </div>

              {professions.map((p, idx) => {
                const data = getCompactData(p);
                const isLast = idx === colCount - 1;
                return (
                  <div key={p.id} className={`cmp-cell-value ${isLast ? 'cmp-cell-last' : ''}`}>
                    <span className="cmp-val-highlight" style={{ fontSize: '0.9375rem' }}>
                      {data.jalurTercepat}
                    </span>
                  </div>
                );
              })}

              {isOneProfessionMode && (
                <div className="cmp-cell-value cmp-cell-last" style={{ color: 'var(--cmp-text-soft)', fontStyle: 'italic' }}>
                  Belum dipilih
                </div>
              )}
            </div>

            {/* DETAIL BARIS JALUR NON-S1: Baris grid sejajar */}
            {openRowDetail === 'jalur' && (
              <div className="cmp-grid-row" id="detail-row-jalur" role="region" aria-labelledby="btn-detail-jalur">
                <div className="cmp-cell-detail-lead" aria-hidden="true" />
                {professions.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`cmp-cell-detail ${idx === colCount - 1 ? 'cmp-cell-last' : ''}`}
                  >
                    {p.realityCheck.jalurAlternatif.map((alt, i) => (
                      <div key={i} style={{ marginBottom: i < p.realityCheck.jalurAlternatif.length - 1 ? '6px' : 0 }}>
                        <strong style={{ color: 'var(--cmp-text)' }}>{alt.jenis}:</strong>{' '}
                        <span>{alt.deskripsi}</span>
                        {alt.contoh && alt.contoh.length > 0 && (
                          <span style={{ display: 'block', color: 'var(--cmp-text-faint)', fontSize: '0.8rem', marginTop: '1px' }}>
                            Contoh: {alt.contoh.join(', ')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                {isOneProfessionMode && (
                  <div className="cmp-cell-detail cmp-cell-last" style={{ color: 'var(--cmp-text-faint)', fontStyle: 'italic' }}>
                    -
                  </div>
                )}
              </div>
            )}

            {/* BARIS 5: YANG SERU (MAKS 3 POIN, LINE-CLAMP 2, TANPA TOMBOL DETAIL/EXPANDER) */}
            <div className="cmp-grid-row">
              <div className="cmp-cell-label">
                <span className="cmp-row-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                  Yang Seru
                </span>
              </div>

              {professions.map((p, idx) => {
                const isLast = idx === colCount - 1;
                return (
                  <div key={p.id} className={`cmp-cell-value ${isLast ? 'cmp-cell-last' : ''}`}>
                    <ul className="cmp-bullet-list">
                      {p.realityCheck.tugasHarian.slice(0, 3).map((item, i) => (
                        <li key={i} className="cmp-bullet-item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {isOneProfessionMode && (
                <div className="cmp-cell-value cmp-cell-last" style={{ color: 'var(--cmp-text-soft)', fontStyle: 'italic' }}>
                  Belum dipilih
                </div>
              )}
            </div>

            {/* BARIS 6: YANG BERAT (MAKS 3 POIN, LINE-CLAMP 2, TANPA TOMBOL DETAIL/EXPANDER) */}
            <div className="cmp-grid-row">
              <div className="cmp-cell-label">
                <span className="cmp-row-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="15" x2="16" y2="15" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                  Yang Berat
                </span>
              </div>

              {professions.map((p, idx) => {
                const isLast = idx === colCount - 1;
                return (
                  <div key={p.id} className={`cmp-cell-value ${isLast ? 'cmp-cell-last' : ''}`}>
                    <ul className="cmp-bullet-list">
                      {p.realityCheck.sisiTidakEnak.slice(0, 3).map((item, i) => (
                        <li key={i} className="cmp-bullet-item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {isOneProfessionMode && (
                <div className="cmp-cell-value cmp-cell-last" style={{ color: 'var(--cmp-text-soft)', fontStyle: 'italic' }}>
                  Belum dipilih
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. BARIS AKSI DI BAWAH: "Jelajahi [profesi]" per kolom, dan "Tambah profesi" bila masih di bawah 3 */}
        <section
          className="cmp-actions-row"
          style={{
            gridTemplateColumns:
              professions.length === 2 && availableToAdd.length > 0
                ? 'repeat(2, minmax(0, 1fr)) minmax(180px, 240px)'
                : `repeat(${professions.length}, minmax(0, 1fr))`,
          }}
          aria-label="Aksi lanjut per profesi"
        >
          {professions.map((p) => (
            <Link key={p.id} to={`/profesi/${p.id}`} className="cmp-btn-explore">
              <span>Jelajahi {p.nama}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ))}

          {/* If 2 professions, allow adding 3rd profession */}
          {professions.length === 2 && availableToAdd.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                className="cmp-select"
                style={{ margin: 0, flex: 1 }}
                value={emptySlotSelectedId}
                onChange={(e) => setEmptySlotSelectedId(e.target.value)}
                aria-label="Pilih profesi ketiga"
              >
                {availableToAdd.map((p) => (
                  <option key={p.id} value={p.id}>
                    + {p.nama}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleAddProfession(emptySlotSelectedId)}
                className="cmp-btn-add"
                style={{ whiteSpace: 'nowrap' }}
              >
                Tambah
              </button>
            </div>
          )}
        </section>

        {/* 5. SUMBER DATA DAN TAHUN: Satu catatan kecil di bawah tabel, bukan di tiap sel */}
        <footer className="cmp-footnote">
          <strong>Sumber Data & Tahun:</strong>{' '}
          {professions.map((p, idx) => (
            <span key={p.id}>
              {idx > 0 && ' · '}
              <strong>{p.nama}</strong>: {p.realityCheck.prospek.sumber} ({p.realityCheck.prospek.tahun})
            </span>
          ))}
          . Data gaji junior merupakan estimasi pasar awal karier di Indonesia dan dapat bervariasi bergantung pada kualifikasi, sertifikasi, serta domisili tempat kerja.
        </footer>
      </main>
    </div>
  );
}
