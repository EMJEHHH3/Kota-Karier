import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PendidikanKhususInfo } from '../types';

interface SpecializedEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  info?: PendidikanKhususInfo;
  profesiNama: string;
}

export const SpecializedEducationModal: React.FC<SpecializedEducationModalProps> = ({
  isOpen,
  onClose,
  info,
  profesiNama,
}) => {
  const navigate = useNavigate();
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus shift to dialog when opened
  useEffect(() => {
    if (isOpen) {
      const handle = requestAnimationFrame(() => {
        if (primaryButtonRef.current) {
          primaryButtonRef.current.focus();
        } else if (modalContainerRef.current) {
          modalContainerRef.current.focus();
        }
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const title = info?.judulDialog || 'Kamu perlu gelar untuk pekerjaan ini';
  const description =
    info?.penjelasan ||
    `${profesiNama} tidak bisa dicoba sehari seperti profesi lain karena membutuhkan pendidikan dan lisensi khusus. Tapi kamu tetap bisa mengenal jalurnya.`;
  const generalDuration = info?.durasiUmum || 'Jalur ini butuh waktu bertahun-tahun pendidikan formal & klinis intensif';
  const steps = info?.langkah || [];
  const altProfId = info?.alternatifProfesiId || 'perawat';
  const altLabel = info?.alternatifLabelTombol || 'Coba Simulasi Perawat';

  const handleAltClick = () => {
    onClose();
    navigate(`/profesi/${altProfId}`);
  };

  return (
    <div
      className="specialized-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 18, 0.82)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      role="presentation"
    >
      <div
        ref={modalContainerRef}
        className="specialized-modal-content panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="specialized-modal-title"
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(180deg, #111827 0%, #0c1120 100%)',
          border: '2px solid var(--color-border-cyan)',
          boxShadow: '0 0 24px rgba(34, 211, 238, 0.3), inset 0 0 12px rgba(34, 211, 238, 0.08)',
          borderRadius: '8px',
          padding: 'var(--space-lg)',
          position: 'relative',
          outline: 'none',
        }}
      >
        {/* Top Header Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-sm)',
            borderBottom: '1px dashed rgba(34, 211, 238, 0.3)',
            paddingBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--color-accent-cyan)' }}><i className="fa-solid fa-graduation-cap" /></span>
            <span
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.55rem',
                color: 'var(--color-accent-yellow)',
                letterSpacing: '1px',
              }}
            >
              PENDIDIKAN & LISENSI KHUSUS
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn--ghost"
            style={{
              padding: '2px 8px',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1,
            }}
            aria-label="Tutup dialog"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h2
          id="specialized-modal-title"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            color: 'var(--color-accent-cyan)',
            textShadow: '0 0 8px rgba(34, 211, 238, 0.6)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          {title}
        </h2>

        {/* Short Explanation */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-md)',
          }}
        >
          {description}
        </p>

        {/* General Duration banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(251, 191, 36, 0.08)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '4px',
            padding: '8px 12px',
            marginBottom: 'var(--space-md)',
            fontSize: '0.75rem',
            color: 'var(--color-accent-yellow)',
          }}
        >
          <span><i className="fa-solid fa-stopwatch" /></span>
          <span>{generalDuration}</span>
        </div>

        {/* Sequential Stepper */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <div
            style={{
              fontSize: '0.65rem',
              color: 'var(--color-accent-cyan)',
              fontFamily: 'var(--font-pixel)',
              marginBottom: '10px',
              letterSpacing: '0.5px',
            }}
          >
            JALUR PENDIDIKAN BERURUTAN:
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              position: 'relative',
            }}
          >
            {steps.map((step, idx) => (
              <div
                key={step.nomor}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: 'rgba(17, 24, 39, 0.75)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  position: 'relative',
                }}
              >
                {/* Step number badge */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    background: 'rgba(34, 211, 238, 0.15)',
                    border: '1px solid var(--color-accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.6rem',
                    color: 'var(--color-accent-cyan)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {step.nomor}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {step.tahap}
                    </span>
                    {idx < steps.length - 1 && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--color-accent-cyan)',
                          opacity: 0.7,
                        }}
                      >
                        ↓ lanjut
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {step.keterangan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: 'var(--space-md)',
          }}
        >
          <button
            onClick={onClose}
            className="btn btn--ghost"
            style={{
              fontSize: '0.75rem',
              padding: '8px 16px',
            }}
          >
            Tutup
          </button>

          <button
            ref={primaryButtonRef}
            onClick={handleAltClick}
            className="btn btn--primary"
            style={{
              fontSize: '0.75rem',
              padding: '8px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span><i className="fa-solid fa-stethoscope" /></span>
            <span>{altLabel}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecializedEducationModal;
