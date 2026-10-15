// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SpecializedEducationModal from './SpecializedEducationModal';
import type { PendidikanKhususInfo } from '../types';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SpecializedEducationModal', () => {
  afterEach(() => {
    cleanup();
  });
  const dummyInfo: PendidikanKhususInfo = {
    judulDialog: 'Kamu perlu gelar untuk pekerjaan ini',
    penjelasan:
      'Dokter tidak bisa dicoba sehari seperti profesi lain karena membutuhkan pendidikan dan lisensi khusus. Tapi kamu tetap bisa mengenal jalurnya.',
    durasiUmum: 'Membutuhkan waktu bertahun-tahun pendidikan formal dan klinis',
    langkah: [
      {
        nomor: 1,
        tahap: 'Pendidikan S1 Kedokteran',
        keterangan: 'Mempelajari dasar ilmu biomedis dan anatomi di universitas.',
      },
      {
        nomor: 2,
        tahap: 'Pendidikan Profesi / Koas',
        keterangan: 'Praktik rotasi klinis langsung di stase rumah sakit.',
      },
      {
        nomor: 3,
        tahap: 'Internship',
        keterangan: 'Pelatihan pelayanan primer untuk mendapatkan STR definitif.',
      },
      {
        nomor: 4,
        tahap: 'Spesialisasi (Opsional)',
        keterangan: 'Program pendidikan dokter spesialis lanjutan.',
      },
    ],
    alternatifProfesiId: 'perawat',
    alternatifNama: 'Perawat',
    alternatifLabelTombol: 'Coba Simulasi Perawat',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <MemoryRouter>
        <SpecializedEducationModal
          isOpen={false}
          onClose={vi.fn()}
          info={dummyInfo}
          profesiNama="Dokter"
        />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders title, explanation, and duration note when open', () => {
    render(
      <MemoryRouter>
        <SpecializedEducationModal
          isOpen={true}
          onClose={vi.fn()}
          info={dummyInfo}
          profesiNama="Dokter"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Kamu perlu gelar untuk pekerjaan ini')).toBeTruthy();
    expect(
      screen.getByText(/Dokter tidak bisa dicoba sehari seperti profesi lain/i)
    ).toBeTruthy();
    expect(screen.getByText(/bertahun-tahun/i)).toBeTruthy();
  });

  it('renders all 4 educational stepper steps', () => {
    render(
      <MemoryRouter>
        <SpecializedEducationModal
          isOpen={true}
          onClose={vi.fn()}
          info={dummyInfo}
          profesiNama="Dokter"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Pendidikan S1 Kedokteran')).toBeTruthy();
    expect(screen.getByText('Pendidikan Profesi / Koas')).toBeTruthy();
    expect(screen.getByText('Internship')).toBeTruthy();
    expect(screen.getByText('Spesialisasi (Opsional)')).toBeTruthy();
  });

  it('calls onClose when clicking the "Tutup" button', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <SpecializedEducationModal
          isOpen={true}
          onClose={handleClose}
          info={dummyInfo}
          profesiNama="Dokter"
        />
      </MemoryRouter>
    );

    const closeBtn = screen.getByRole('button', { name: /^tutup$/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside on the backdrop overlay', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <SpecializedEducationModal
          isOpen={true}
          onClose={handleClose}
          info={dummyInfo}
          profesiNama="Dokter"
        />
      </MemoryRouter>
    );

    const overlay = container.querySelector('.specialized-modal-overlay');
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay!);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape key', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <SpecializedEducationModal
          isOpen={true}
          onClose={handleClose}
          info={dummyInfo}
          profesiNama="Dokter"
        />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('navigates to /profesi/perawat and closes modal when clicking "Coba Simulasi Perawat"', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <SpecializedEducationModal
          isOpen={true}
          onClose={handleClose}
          info={dummyInfo}
          profesiNama="Dokter"
        />
      </MemoryRouter>
    );

    const altBtn = screen.getByRole('button', { name: /coba simulasi perawat/i });
    fireEvent.click(altBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/profesi/perawat');
  });
});
