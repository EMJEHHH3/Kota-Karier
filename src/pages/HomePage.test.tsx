// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { BUILDINGS } from '../data/city';
import { UserProvider } from '../lib/context';

afterEach(() => {
  cleanup();
});

function renderHomePage() {
  return render(
    <UserProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </UserProvider>
  );
}

describe('HomePage', () => {
  it('renders buildings in the correct updated order: Pusat Informasi, Kantor Teknologi, Rumah Sakit, then locked buildings', () => {
    const { container } = renderHomePage();

    // Get all building titles in DOM order
    const titleElements = container.querySelectorAll('.building-title');
    const titles = Array.from(titleElements).map((el) => el.textContent?.trim());

    expect(titles).toEqual([
      'Pusat Informasi',
      'Kantor Teknologi',
      'Rumah Sakit',
      'Bank',
      'Sekolah',
      'Studio Kreatif',
      'Pasar / UMKM',
      'Bengkel',
    ]);
  });

  it('verifies BUILDINGS data urutan and positions match the new specification', () => {
    const sorted = [...BUILDINGS].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
    expect(sorted.map((b) => b.id)).toEqual([
      'pusat-informasi',
      'kantor-teknologi',
      'rumah-sakit',
      'bank',
      'sekolah',
      'studio-kreatif',
      'pasar-umkm',
      'bengkel',
    ]);

    expect(sorted[0].urutan).toBe(1);
    expect(sorted[1].urutan).toBe(2);
    expect(sorted[2].urutan).toBe(3);
  });

  it('renders the welcome banner in the sky', () => {
    renderHomePage();

    expect(screen.getByText('Selamat datang di Kota Karier')).toBeDefined();
    expect(screen.getByText('Pilih sebuah gedung untuk mulai menjelajahi kariermu')).toBeDefined();
  });

  it('renders links and actions properly for active buildings and locked states for coming soon', () => {
    const { container } = renderHomePage();

    // Pusat Informasi links to /tes-minat
    const pusatInfoLink = container.querySelector('a[href="/tes-minat"]');
    expect(pusatInfoLink).not.toBeNull();

    // Kantor Teknologi links to /gedung/kantor-teknologi
    const kantorTekLink = container.querySelector('a[href="/gedung/kantor-teknologi"]');
    expect(kantorTekLink).not.toBeNull();

    // Rumah Sakit links to /gedung/rumah-sakit
    const rumahSakitLink = container.querySelector('a[href="/gedung/rumah-sakit"]');
    expect(rumahSakitLink).not.toBeNull();

    // Locked buildings have building-hotspot--locked class
    const lockedHotspots = container.querySelectorAll('.building-hotspot--locked');
    expect(lockedHotspots.length).toBe(5); // Bank, Sekolah, Studio Kreatif, Pasar/UMKM, Bengkel
  });

  it('renders fixed NightSky background and repeating CitySkyline', () => {
    const { container } = renderHomePage();

    const nightSky = container.querySelector('.night-sky-container');
    expect(nightSky).not.toBeNull();
    expect((nightSky as HTMLElement).style.position).toBe('fixed');

    const skyline = container.querySelector('.city-skyline-bg');
    expect(skyline).not.toBeNull();
    expect(container.querySelector('#skyline-repeat-pattern')).not.toBeNull();
  });
});
