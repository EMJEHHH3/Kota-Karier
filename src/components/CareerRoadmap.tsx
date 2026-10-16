import { useState, useEffect } from 'react';
import type { ProfessionRoadmap, RoadmapProfessionSummary } from '../types/roadmap';
import {
  fetchRoadmapByProfession,
  fetchAllProfessionsList,
  fetchLastViewedProfessionId,
  saveLastViewedProfessionId,
} from '../lib/roadmapApi';
import { getProfessionById } from '../data/professions';

interface CareerRoadmapProps {
  topProfessions: { id: string; score?: number; reason: string }[];
  onActiveProfessionChange?: (professionId: string, roadmap: ProfessionRoadmap | null) => void;
}

export function CareerRoadmap({
  topProfessions,
  onActiveProfessionChange,
}: CareerRoadmapProps) {
  const top3Ids = topProfessions.map((p) => p.id);
  const defaultProfId = top3Ids[0] || 'software-engineer';

  const [activeProfId, setActiveProfId] = useState<string>(defaultProfId);
  const [roadmap, setRoadmap] = useState<ProfessionRoadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Available professions list for the "Lihat profesi lain" modal/selector
  const [allProfessions, setAllProfessions] = useState<RoadmapProfessionSummary[]>([]);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Accordion state: open state per phase ID (first phase open by default)
  const [openPhaseIds, setOpenPhaseIds] = useState<Record<string, boolean>>({});

  // 1. Initial load: restore last viewed profession if saved in backend/storage
  useEffect(() => {
    let isMounted = true;

    async function initSelection() {
      try {
        const lastSaved = await fetchLastViewedProfessionId();
        if (isMounted && lastSaved) {
          setActiveProfId(lastSaved);
        }
      } catch {
        // Keep default
      }

      // Preload all professions list
      try {
        const list = await fetchAllProfessionsList();
        if (isMounted) {
          setAllProfessions(list);
        }
      } catch (e) {
        console.warn('Failed to fetch professions list', e);
      }
    }

    initSelection();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load roadmap data whenever activeProfId changes
  useEffect(() => {
    let isMounted = true;

    async function loadRoadmapData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRoadmapByProfession(activeProfId);
        if (!isMounted) return;
        setRoadmap(data);
        setLoading(false);

        // Open the first phase by default, keep others collapsed
        if (data.phases && data.phases.length > 0) {
          const initialOpen: Record<string, boolean> = {};
          data.phases.forEach((p, idx) => {
            initialOpen[p.id] = idx === 0;
          });
          setOpenPhaseIds(initialOpen);
        }

        if (onActiveProfessionChange) {
          onActiveProfessionChange(activeProfId, data);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat roadmap.');
        setLoading(false);
      }
    }

    loadRoadmapData();

    // Persist to backend & storage
    saveLastViewedProfessionId(activeProfId);

    return () => {
      isMounted = false;
    };
  }, [activeProfId, onActiveProfessionChange]);

  const handleSelectProfession = (profId: string) => {
    if (profId !== activeProfId) {
      setActiveProfId(profId);
      setShowSearchModal(false);
    }
  };

  const togglePhase = (phaseId: string) => {
    setOpenPhaseIds((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const isTopMatch = top3Ids.includes(activeProfId);

  const filteredProfessions = allProfessions.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return p.nama.toLowerCase().includes(q) || p.kategori.toLowerCase().includes(q);
  });

  return (
    <section className="rp-section crm-section">
      {/* Section Header */}
      <div className="rp-section-header">
        <svg
          className="rp-section-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--color-accent-green)' }}
          aria-hidden="true"
        >
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
        <h2 className="rp-section-title">Roadmap Karier</h2>
      </div>

      <p className="rp-section-desc">
        Jalur bertahap dari sekarang (Masa SMA) hingga siap bekerja di industri, disesuaikan dengan minat dan bakatmu.
      </p>

      {/* Profession Selector (Top 3 tabs + Other professions button) */}
      <div className="crm-selector-container no-print">
        <div className="crm-tabs-list" role="tablist" aria-label="Pilih profesi untuk melihat roadmap">
          {topProfessions.slice(0, 3).map((item, idx) => {
            const prof = getProfessionById(item.id);
            const profName = prof ? prof.nama : item.id;
            const isSelected = activeProfId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectProfession(item.id)}
                className={`crm-tab-chip ${isSelected ? 'crm-tab-chip--active' : ''}`}
              >
                <span className="crm-tab-rank">#{idx + 1}</span>
                <span className="crm-tab-label">{profName}</span>
                <span className="crm-tab-match-tag">Sesuai hasilmu</span>
              </button>
            );
          })}

          {/* If the active profession is NOT in Top 3, show it as an active exploration tab */}
          {!isTopMatch && roadmap && (
            <div className="crm-tab-chip crm-tab-chip--active crm-tab-chip--explore">
              <span className="crm-tab-label">{roadmap.professionName}</span>
              <span className="crm-tab-explore-tag">Eksplorasi</span>
            </div>
          )}

          {/* Button to open search modal for other professions */}
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="crm-tab-more-btn"
            title="Pilih profesi lain di luar rekomendasi Top 3"
          >
            <i className="fa-solid fa-compass" aria-hidden="true" style={{ marginRight: '6px' }} />
            Lihat profesi lain
            <i className="fa-solid fa-chevron-right" aria-hidden="true" style={{ marginLeft: '6px', fontSize: '0.7em' }} />
          </button>
        </div>
      </div>

      {/* Modal / Dialog for searching other professions */}
      {showSearchModal && (
        <div className="crm-modal-backdrop no-print" onClick={() => setShowSearchModal(false)}>
          <div className="crm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h3 className="crm-modal-title">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ marginRight: '8px' }} />
                Pilih Profesi untuk Eksplorasi
              </h3>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setShowSearchModal(false)}
                style={{ padding: '2px 8px', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>

            <div className="crm-modal-search-box">
              <input
                type="text"
                placeholder="Cari profesi... (misal: Dokter, Software Engineer, dsb.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="crm-search-input"
              />
            </div>

            <div className="crm-modal-list">
              {filteredProfessions.length === 0 ? (
                <div className="crm-empty-search">
                  Tidak menemukan profesi dengan kata kunci "{searchQuery}".
                </div>
              ) : (
                filteredProfessions.map((p) => {
                  const isCurrent = activeProfId === p.id;
                  const isTop = top3Ids.includes(p.id);

                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`crm-modal-item ${isCurrent ? 'crm-modal-item--selected' : ''}`}
                      onClick={() => handleSelectProfession(p.id)}
                    >
                      <div className="crm-modal-item-info">
                        <span className="crm-modal-item-name">{p.nama}</span>
                        <span className="crm-modal-item-category">{p.kategori}</span>
                      </div>
                      <span className={`crm-status-pill ${isTop ? 'crm-status-pill--match' : 'crm-status-pill--explore'}`}>
                        {isTop ? 'Sesuai hasilmu' : 'Eksplorasi'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="crm-loading-state">
          <div className="crm-spinner" />
          <p className="crm-loading-text">Memuat roadmap karier untukmu...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="crm-error-state">
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.5rem', color: 'var(--color-accent-red)' }} />
          <p style={{ color: 'var(--color-accent-red)', margin: '8px 0' }}>{error}</p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchRoadmapByProfession(activeProfId)
                .then((d) => {
                  setRoadmap(d);
                  setLoading(false);
                })
                .catch((e) => {
                  setError(e.message);
                  setLoading(false);
                });
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Roadmap Content */}
      {!loading && !error && roadmap && (
        <div className="crm-content">
          {/* Active Profession Status Banner */}
          <div className="crm-banner">
            <div className="crm-banner-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  className={`crm-status-badge ${
                    isTopMatch ? 'crm-status-badge--match' : 'crm-status-badge--explore'
                  }`}
                >
                  <i
                    className={`fa-solid ${isTopMatch ? 'fa-star' : 'fa-compass'}`}
                    style={{ marginRight: '6px' }}
                    aria-hidden="true"
                  />
                  {isTopMatch ? 'Sesuai Hasil Minat & Bakatmu' : 'Mode Eksplorasi Profesi'}
                </span>

                {roadmap.isGeneric && (
                  <span className="crm-status-badge crm-status-badge--generic">
                    Roadmap Umum (Fallback)
                  </span>
                )}
              </div>

              <h3 className="crm-profession-heading">{roadmap.professionName}</h3>
              <p className="crm-profession-tagline">{roadmap.tagline}</p>
            </div>
          </div>

          {/* Generic fallback note alert if applicable */}
          {roadmap.isGeneric && (
            <div className="crm-generic-alert">
              <i className="fa-solid fa-circle-info crm-generic-alert-icon" aria-hidden="true" />
              <div>
                <strong>Catatan Panduan Umum:</strong> {roadmap.note || 'Roadmap ini merupakan kerangka umum langkah persiapan karier.'}
              </div>
            </div>
          )}

          {/* Vertical Stepper Timeline */}
          <div className="crm-timeline">
            {roadmap.phases.map((phase, idx) => {
              const isOpen = Boolean(openPhaseIds[phase.id]);
              const isLast = idx === roadmap.phases.length - 1;

              return (
                <div
                  key={phase.id}
                  className={`crm-timeline-node ${isOpen ? 'crm-timeline-node--open' : ''} ${
                    isLast ? 'crm-timeline-node--last' : ''
                  }`}
                >
                  {/* Step Connector Line */}
                  <div className="crm-timeline-track" aria-hidden="true">
                    <div className="crm-timeline-marker">
                      <span>{phase.phaseNumber}</span>
                    </div>
                    {!isLast && <div className="crm-timeline-line" />}
                  </div>

                  {/* Phase Card */}
                  <div className="crm-phase-card">
                    <button
                      type="button"
                      className="crm-phase-header"
                      onClick={() => togglePhase(phase.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="crm-phase-header-left">
                        <span className="crm-phase-badge">{phase.badge}</span>
                        <h4 className="crm-phase-title">{phase.title}</h4>
                        <p className="crm-phase-subtitle">{phase.subtitle}</p>
                      </div>

                      <div className="crm-phase-header-right no-print">
                        <span className="crm-phase-step-count">{phase.steps.length} langkah</span>
                        <svg
                          className={`crm-phase-chevron ${isOpen ? 'crm-phase-chevron--open' : ''}`}
                          width="16"
                          height="16"
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
                      </div>
                    </button>

                    {/* Phase Steps (Expandable accordion) */}
                    <div className={`crm-phase-body ${isOpen ? 'crm-phase-body--open' : 'crm-phase-body--closed'}`}>
                      <div className="crm-steps-list">
                        {phase.steps.map((step, sIdx) => (
                          <div key={step.id} className="crm-step-item">
                            <div className="crm-step-index">{sIdx + 1}</div>
                            <div className="crm-step-content">
                              <h5 className="crm-step-title">{step.title}</h5>
                              <p className="crm-step-desc">{step.description}</p>

                              {step.tips && (
                                <div className="crm-step-tips">
                                  <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ color: 'var(--color-accent-yellow)', marginRight: '6px' }} />
                                  <span>{step.tips}</span>
                                </div>
                              )}

                              {step.links && step.links.length > 0 && (
                                <div className="crm-step-links">
                                  <span className="crm-step-links-label">Sumber Belajar Gratis / Rujukan:</span>
                                  <div className="crm-step-links-wrap">
                                    {step.links.map((link, lIdx) => (
                                      <a
                                        key={lIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="crm-link-pill"
                                        title={`Buka ${link.label} di tab baru`}
                                      >
                                        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" style={{ marginRight: '6px', fontSize: '0.75em' }} />
                                        {link.label}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
