// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BuildingInteriorPage from './BuildingInteriorPage';
import { UserProvider } from '../lib/context';

afterEach(() => {
  cleanup();
});

function renderBuildingInterior(buildingId: string) {
  return render(
    <UserProvider>
      <MemoryRouter initialEntries={[`/gedung/${buildingId}`]}>
        <Routes>
          <Route path="/gedung/:id" element={<BuildingInteriorPage />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );
}

describe('BuildingInteriorPage', () => {
  it('renders header and column view for Kantor Teknologi matching reference design', () => {
    const { container } = renderBuildingInterior('kantor-teknologi');

    // Header info
    expect(screen.getByText('AREA EKSPLORASI')).toBeDefined();
    expect(screen.getByText('Kantor & Lab Rekayasa')).toBeDefined();
    expect(screen.getByText('Kenali profesi teknologi lewat simulasi interaktif.')).toBeDefined();

    // Verify column list container
    const columnContainer = container.querySelector('.interior-column-container');
    expect(columnContainer).not.toBeNull();

    // Verify Software Engineer card details
    expect(screen.getByText('MONITOR KODE')).toBeDefined();
    expect(screen.getByText('Software Engineer')).toBeDefined();
    expect(screen.getAllByText('Simulasi 1 hari · 1 aktivitas').length).toBeGreaterThanOrEqual(1);

    // Verify link to profession page
    const softwareEngLink = container.querySelector('a[href="/profesi/software-engineer"]');
    expect(softwareEngLink).not.toBeNull();
    expect(softwareEngLink?.classList.contains('interior-card')).toBe(true);
  });

  it('renders column view for Rumah Sakit', () => {
    const { container } = renderBuildingInterior('rumah-sakit');

    expect(screen.getByText('AREA EKSPLORASI')).toBeDefined();
    expect(screen.getByText('Ruang Praktik & Rawat')).toBeDefined();
    expect(screen.getByText('Kenali profesi kesehatan lewat simulasi interaktif.')).toBeDefined();

    // Professions in Rumah Sakit: Dokter, Perawat
    expect(screen.getByText('Dokter')).toBeDefined();
    expect(screen.getByText('Perawat')).toBeDefined();

    const dokterLink = container.querySelector('a[href="/profesi/dokter"]');
    expect(dokterLink).not.toBeNull();
  });
});
