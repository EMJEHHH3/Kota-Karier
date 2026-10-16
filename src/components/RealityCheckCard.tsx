import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Profession } from '../types';
import { storage } from '../lib/storage';

interface RealityCheckCardProps {
  profession: Profession;
  isSavedCandidate: boolean;
  onToggleCandidate: () => void;
}

type TabId = 'sehari-hari' | 'skill' | 'kuliah';

export default function RealityCheckCard({
  profession,
  isSavedCandidate,
  onToggleCandidate,
}: RealityCheckCardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('sehari-hari');
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [compareFeedback, setCompareFeedback] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleCompare = () => {
    const rawList = storage.getItem<string[]>('kota-karier-compare-list') || [];
    const valid = Array.from(new Set(rawList.filter((id) => typeof id === 'string' && id.trim() !== '')));
    if (valid.includes(profession.id)) {
      setCompareFeedback('Sudah ada di perbandingan');
      setTimeout(() => {
        setCompareFeedback(null);
      }, 2500);
    } else {
      const next = [...valid, profession.id].slice(-3);
      storage.setItem('kota-karier-compare-list', next);
      navigate(`/bandingkan?p1=${profession.id}`);
    }
  };

  // Expander states for lists (max 3 by default)
  const [isTugasExpanded, setIsTugasExpanded] = useState<boolean>(false);
  const [isSisiTidakEnakExpanded, setIsSisiTidakEnakExpanded] = useState<boolean>(false);
  const [isWajibExpanded, setIsWajibExpanded] = useState<boolean>(false);
  const [isDipelajariExpanded, setIsDipelajariExpanded] = useState<boolean>(false);
  const [isJalurExpanded, setIsJalurExpanded] = useState<boolean>(false);
  const [isUtamaExpanded, setIsUtamaExpanded] = useState<boolean>(false);
  const [isMataKuliahOpen, setIsMataKuliahOpen] = useState<boolean>(false);

  // Close tooltip on ESC or outside click
  useEffect(() => {
    if (!showTooltip) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTooltip(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const { realityCheck } = profession;
  const { prospek, tugasHarian, sisiTidakEnak, keterampilan, jurusanKuliah, jalurAlternatif } =
    realityCheck;

  // 1. Data-driven Summary Metrics
  const salaryRaw = prospek?.rentangGaji || 'Data belum tersedia';
  const cleanSalary = salaryRaw.split('(')[0].trim().replace(/\/bulan$/i, '/bln');

  const demandRaw = prospek?.permintaan || 'Stabil';
  const prospectWord = demandRaw.split(/—|-/)[0].trim();

  const majorRaw = jurusanKuliah?.utama?.[0] || 'Umum';
  const cleanMajor = majorRaw.split('(')[0].trim();

  // Skills split
  const wajibSkills = (keterampilan || []).filter((s) => s.kategori === 'wajib sejak awal');
  const dipelajariSkills = (keterampilan || []).filter((s) => s.kategori === 'bisa dipelajari sambil jalan');

  // Tab definitions
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'sehari-hari',
      label: 'Sehari-hari',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'skill',
      label: 'Skill',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      id: 'kuliah',
      label: 'Kuliah & Jalur',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
        </svg>
      ),
    },
  ];

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % tabs.length;
      setActiveTab(tabs[next].id);
      document.getElementById(`rc-tab-${tabs[next].id}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prev].id);
      document.getElementById(`rc-tab-${tabs[prev].id}`)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(tabs[0].id);
      document.getElementById(`rc-tab-${tabs[0].id}`)?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabs[tabs.length - 1].id);
      document.getElementById(`rc-tab-${tabs[tabs.length - 1].id}`)?.focus();
    }
  };

  return (
    <section id="reality-check" className="rc-section" aria-label={`Reality Check: ${profession.nama}`}>
      {/* Header bar */}
      <div className="rc-header">
        <div className="rc-header-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-cyan)' }} aria-hidden="true">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span>Reality Check: {profession.nama}</span>
        </div>

        {/* Info Icon with Tooltip */}
        <div className="rc-info-wrapper" ref={tooltipRef}>
          <button
            type="button"
            className="rc-info-btn"
            aria-label="Informasi sumber data dan peninjauan"
            aria-expanded={showTooltip}
            onClick={() => setShowTooltip((v) => !v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
          {showTooltip && (
            <div className="rc-tooltip" role="tooltip">
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Verifikasi Data Faktual
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Sumber:</strong> {prospek?.sumber || 'Data internal'} ({prospek?.tahun || '2024'})
              </div>
              <div>
                <strong>Ditinjau:</strong> {profession.terakhirDitinjau || '2024'}
              </div>
              {prospek?.permintaan && (
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {prospek.permintaan}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 1. Ringkasan di Atas (3 Kotak Besar Tanpa Border Tebal) */}
      <div className="rc-summary-grid">
        {/* Box 1: Gaji Junior */}
        <div className="rc-summary-card">
          <div className="rc-summary-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>Gaji Junior</span>
          </div>
          <div className="rc-summary-value" title={salaryRaw}>
            {cleanSalary}
          </div>
        </div>

        {/* Box 2: Prospek */}
        <div className="rc-summary-card">
          <div className="rc-summary-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>Prospek Karier</span>
          </div>
          <div className="rc-summary-value" title={demandRaw}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-yellow)', flexShrink: 0 }} aria-hidden="true">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span>{prospectWord}</span>
          </div>
        </div>

        {/* Box 3: Jurusan Utama */}
        <div className="rc-summary-card">
          <div className="rc-summary-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
            </svg>
            <span>Jurusan Utama</span>
          </div>
          <div className="rc-summary-value" title={jurusanKuliah?.utama?.join(', ') || cleanMajor}>
            {cleanMajor}
          </div>
        </div>
      </div>

      {/* 2. Tab di Bawah Ringkasan */}
      <div className="rc-tablist" role="tablist" aria-label="Navigasi Informasi Profesi">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`rc-tab-${tab.id}`}
              role="tab"
              type="button"
              className={`rc-tab-btn ${isActive ? 'rc-tab-btn--active' : ''}`}
              data-tab={tab.id}
              aria-selected={isActive}
              aria-controls={`rc-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Sehari-hari */}
      {activeTab === 'sehari-hari' && (
        <div
          id="rc-panel-sehari-hari"
          role="tabpanel"
          aria-labelledby="rc-tab-sehari-hari"
          tabIndex={0}
          className="rc-tabpanel"
          style={{ '--rc-accent': 'var(--color-accent-cyan)' } as React.CSSProperties}
        >
          <div className="rc-dual-col">
            {/* Kolom 1: Yang Seru */}
            <div className="rc-column">
              <div className="rc-subheading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-cyan)' }} aria-hidden="true">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                </svg>
                <span>Yang Seru</span>
              </div>
              <ul className="rc-list">
                {(isTugasExpanded ? tugasHarian : tugasHarian.slice(0, 3)).map((item, i) => (
                  <li key={i} className="rc-list-item" title={item}>
                    <span className="rc-list-item-bullet" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className={`rc-list-item-text ${!isTugasExpanded ? 'rc-list-item-text--truncated' : ''}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              {tugasHarian.length > 3 && (
                <button
                  type="button"
                  className="rc-inline-expand"
                  onClick={() => setIsTugasExpanded((v) => !v)}
                  aria-expanded={isTugasExpanded}
                >
                  {isTugasExpanded
                    ? 'Tampilkan ringkas'
                    : `Lihat semua (${tugasHarian.length})`}
                </button>
              )}
            </div>

            {/* Kolom 2: Yang Berat */}
            <div className="rc-column">
              <div className="rc-subheading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-cyan)' }} aria-hidden="true">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Yang Berat</span>
              </div>
              <ul className="rc-list">
                {(isSisiTidakEnakExpanded ? sisiTidakEnak : sisiTidakEnak.slice(0, 3)).map((item, i) => (
                  <li key={i} className="rc-list-item" title={item}>
                    <span className="rc-list-item-bullet" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                    <span className={`rc-list-item-text ${!isSisiTidakEnakExpanded ? 'rc-list-item-text--truncated' : ''}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              {sisiTidakEnak.length > 3 && (
                <button
                  type="button"
                  className="rc-inline-expand"
                  onClick={() => setIsSisiTidakEnakExpanded((v) => !v)}
                  aria-expanded={isSisiTidakEnakExpanded}
                >
                  {isSisiTidakEnakExpanded
                    ? 'Tampilkan ringkas'
                    : `Lihat semua (${sisiTidakEnak.length})`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Skill */}
      {activeTab === 'skill' && (
        <div
          id="rc-panel-skill"
          role="tabpanel"
          aria-labelledby="rc-tab-skill"
          tabIndex={0}
          className="rc-tabpanel"
          style={{ '--rc-accent': 'var(--color-accent-purple)' } as React.CSSProperties}
        >
          <div className="rc-skill-groups">
            {/* Group 1: Wajib dari Awal */}
            <div>
              <div className="rc-subheading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-purple)' }} aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Wajib dari Awal</span>
              </div>
              <div className="rc-chip-group">
                {(isWajibExpanded ? wajibSkills : wajibSkills.slice(0, 3)).map((skill, i) => (
                  <span key={i} className="rc-skill-chip" title={skill.nama}>
                    <svg className="rc-skill-chip-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                    <span>{skill.nama}</span>
                  </span>
                ))}
              </div>
              {wajibSkills.length > 3 && (
                <button
                  type="button"
                  className="rc-inline-expand"
                  onClick={() => setIsWajibExpanded((v) => !v)}
                  aria-expanded={isWajibExpanded}
                >
                  {isWajibExpanded ? 'Tampilkan ringkas' : `+ ${wajibSkills.length - 3} lainnya (Lihat semua)`}
                </button>
              )}
            </div>

            {/* Group 2: Bisa Dipelajari */}
            <div>
              <div className="rc-subheading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-purple)' }} aria-hidden="true">
                  <path d="M12 22v-9" />
                  <path d="M9 7a4 4 0 0 1 4 4v1H9a4 4 0 0 1-4-4 4 4 0 0 1 4-1Z" />
                  <path d="M15 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-2V8a4 4 0 0 1 2-4Z" />
                </svg>
                <span>Bisa Dipelajari Sambil Jalan</span>
              </div>
              <div className="rc-chip-group">
                {(isDipelajariExpanded ? dipelajariSkills : dipelajariSkills.slice(0, 3)).map((skill, i) => (
                  <span key={i} className="rc-skill-chip" title={skill.nama}>
                    <svg className="rc-skill-chip-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span>{skill.nama}</span>
                  </span>
                ))}
              </div>
              {dipelajariSkills.length > 3 && (
                <button
                  type="button"
                  className="rc-inline-expand"
                  onClick={() => setIsDipelajariExpanded((v) => !v)}
                  aria-expanded={isDipelajariExpanded}
                >
                  {isDipelajariExpanded ? 'Tampilkan ringkas' : `+ ${dipelajariSkills.length - 3} lainnya (Lihat semua)`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Kuliah & Jalur */}
      {activeTab === 'kuliah' && (
        <div
          id="rc-panel-kuliah"
          role="tabpanel"
          aria-labelledby="rc-tab-kuliah"
          tabIndex={0}
          className="rc-tabpanel"
          style={{ '--rc-accent': 'var(--color-accent-green)' } as React.CSSProperties}
        >
          <div className="rc-pathways-stack">
            {/* Jurusan Kuliah Rekomendasi */}
            <div className="rc-major-box">
              <div className="rc-subheading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-green)' }} aria-hidden="true">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
                </svg>
                <span>Jurusan Kuliah</span>
              </div>

              {/* Jurusan utama sebagai chips */}
              <div className="rc-chip-group">
                {(isUtamaExpanded ? (jurusanKuliah?.utama || []) : (jurusanKuliah?.utama || []).slice(0, 3)).map((j, i) => (
                  <span key={i} className="rc-skill-chip" style={{ borderColor: 'rgba(74, 222, 128, 0.25)' }}>
                    <svg className="rc-skill-chip-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{j}</span>
                  </span>
                ))}
              </div>
              {(jurusanKuliah?.utama || []).length > 3 && (
                <button
                  type="button"
                  className="rc-inline-expand"
                  onClick={() => setIsUtamaExpanded((v) => !v)}
                  aria-expanded={isUtamaExpanded}
                >
                  {isUtamaExpanded ? 'Tampilkan ringkas' : `+ ${(jurusanKuliah?.utama || []).length - 3} lainnya (Lihat semua)`}
                </button>
              )}

              {/* Jurusan alternatif sebagai teks satu baris */}
              {jurusanKuliah?.alternatif && jurusanKuliah.alternatif.length > 0 && (
                <div className="rc-alt-majors" title={jurusanKuliah.alternatif.join(', ')}>
                  <strong>Alternatif:</strong> {jurusanKuliah.alternatif.join(', ')}
                </div>
              )}
            </div>

            {/* Jalur Selain S1 sebagai kartu kecil */}
            <div>
              <div className="rc-subheading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-green)' }} aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
                <span>Jalur Selain S1</span>
              </div>
              <div className="rc-jalur-list">
                {(isJalurExpanded ? jalurAlternatif : jalurAlternatif.slice(0, 3)).map((jalur, i) => (
                  <div key={i} className="rc-jalur-card">
                    <span className="rc-jalur-name">{jalur.jenis}</span>
                    <span
                      className={`rc-jalur-desc ${!isJalurExpanded ? 'rc-jalur-desc--truncated' : ''}`}
                      title={jalur.deskripsi}
                    >
                      {jalur.deskripsi}
                    </span>
                  </div>
                ))}
              </div>
              {jalurAlternatif.length > 3 && (
                <button
                  type="button"
                  className="rc-inline-expand"
                  onClick={() => setIsJalurExpanded((v) => !v)}
                  aria-expanded={isJalurExpanded}
                >
                  {isJalurExpanded ? 'Tampilkan ringkas' : `Lihat semua jalur (${jalurAlternatif.length})`}
                </button>
              )}
            </div>

            {/* Expander: Mata Kuliah Inti */}
            {jurusanKuliah?.mataKuliahInti && jurusanKuliah.mataKuliahInti.length > 0 && (
              <div className="rc-expander">
                <button
                  type="button"
                  className="rc-expander-btn"
                  onClick={() => setIsMataKuliahOpen((v) => !v)}
                  aria-expanded={isMataKuliahOpen}
                >
                  <span>Mata Kuliah Inti</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', opacity: 0.8, textTransform: 'none' }}>
                      {isMataKuliahOpen ? 'Tutup' : 'Lihat detail'}
                    </span>
                    <svg
                      className={`rc-expander-chevron ${isMataKuliahOpen ? 'rc-expander-chevron--open' : ''}`}
                      width="14"
                      height="14"
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
                  </span>
                </button>
                {isMataKuliahOpen && (
                  <div className="rc-expander-content">
                    <div className="rc-chip-group">
                      {jurusanKuliah.mataKuliahInti.map((mk, i) => (
                        <span key={i} className="rc-skill-chip" style={{ fontSize: '0.78rem' }}>
                          {mk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Bar Aksi di Bawah (Sticky on mobile) */}
      <div className="rc-action-bar">
        <button
          type="button"
          onClick={onToggleCandidate}
          className={`btn ${isSavedCandidate ? 'btn--primary' : ''}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={isSavedCandidate ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ marginRight: '4px' }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{isSavedCandidate ? 'Tersimpan di Kandidat' : 'Simpan ke Kandidat'}</span>
        </button>

        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <button
            type="button"
            onClick={handleCompare}
            className="btn"
            title="Bandingkan profesi ini"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ marginRight: '6px' }}
            >
              <line x1="12" y1="3" x2="12" y2="21" />
              <path d="m6 8 6-3 6 3" />
              <path d="m6 8-4 6a4 4 0 0 0 8 0L6 8Z" />
              <path d="m18 8-4 6a4 4 0 0 0 8 0l-4-6Z" />
              <line x1="4" y1="21" x2="20" y2="21" />
            </svg>
            <span>Bandingkan</span>
          </button>
          {compareFeedback && (
            <div
              role="status"
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #38bdf8',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                zIndex: 50,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{compareFeedback}</span>
              <Link
                to="/bandingkan"
                style={{
                  color: '#38bdf8',
                  textDecoration: 'underline',
                  fontSize: '0.75rem',
                }}
              >
                Buka
              </Link>
            </div>
          )}
        </div>

        <Link to={`/gedung/${profession.gedung}`} className="btn btn--ghost">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ marginRight: '6px' }}
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Kembali ke Gedung</span>
        </Link>
      </div>
    </section>
  );
}
