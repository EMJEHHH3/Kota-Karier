/**
 * City map data: building hotspots and their positions.
 * Positions are percentage-based for responsive scaling.
 */

import type { BuildingHotspot, BuildingInterior } from '../types';

/** All buildings on the city map */
export const BUILDINGS: BuildingHotspot[] = [
  // --- ACTIVE BUILDINGS ---
  {
    id: 'pusat-informasi',
    urutan: 1,
    nama: 'Pusat Informasi',
    posisi: { x: 10, y: 45 },
    ukuran: { width: 12, height: 30 },
    status: 'active',
    riasec: [], // Special building — hosts the interest test
    ariaLabel: 'Pusat Informasi - Mulai Tes Minat & Gaya Kerja',
    deskripsi: 'Bingung mau mulai dari mana? Masuk sini!',
  },
  {
    id: 'kantor-teknologi',
    urutan: 2,
    nama: 'Kantor Teknologi',
    posisi: { x: 28, y: 38 },
    ukuran: { width: 14, height: 37 },
    status: 'active',
    riasec: ['Investigative', 'Realistic', 'Conventional'],
    ariaLabel: 'Kantor Teknologi - Jelajahi profesi teknologi & bisnis',
    deskripsi: 'Suka ngoding atau angka? Cek di sini!',
  },
  {
    id: 'rumah-sakit',
    urutan: 3,
    nama: 'Rumah Sakit',
    posisi: { x: 48, y: 40 },
    ukuran: { width: 14, height: 35 },
    status: 'active',
    riasec: ['Social', 'Investigative'],
    ariaLabel: 'Rumah Sakit - Jelajahi profesi kesehatan',
    deskripsi: 'Tertarik dunia kesehatan? Masuk dan coba!',
  },

  // --- COMING SOON BUILDINGS ---
  {
    id: 'bank',
    urutan: 4,
    nama: 'Bank',
    posisi: { x: 68, y: 42 },
    ukuran: { width: 11, height: 28 },
    status: 'segera-dibuka',
    riasec: ['Conventional', 'Enterprising'],
    ariaLabel: 'Bank - Segera dibuka',
    deskripsi: 'Segera dibuka!',
  },
  {
    id: 'sekolah',
    urutan: 5,
    nama: 'Sekolah',
    posisi: { x: 82, y: 44 },
    ukuran: { width: 12, height: 30 },
    status: 'segera-dibuka',
    riasec: ['Social', 'Artistic'],
    ariaLabel: 'Sekolah - Segera dibuka',
    deskripsi: 'Segera dibuka!',
  },
  {
    id: 'studio-kreatif',
    urutan: 6,
    nama: 'Studio Kreatif',
    posisi: { x: 96, y: 40 },
    ukuran: { width: 12, height: 32 },
    status: 'segera-dibuka',
    riasec: ['Artistic'],
    ariaLabel: 'Studio Kreatif - Segera dibuka',
    deskripsi: 'Segera dibuka!',
  },
  {
    id: 'pasar-umkm',
    urutan: 7,
    nama: 'Pasar / UMKM',
    posisi: { x: 110, y: 46 },
    ukuran: { width: 13, height: 28 },
    status: 'segera-dibuka',
    riasec: ['Enterprising', 'Social'],
    ariaLabel: 'Pasar / UMKM - Segera dibuka',
    deskripsi: 'Segera dibuka!',
  },
  {
    id: 'bengkel',
    urutan: 8,
    nama: 'Bengkel',
    posisi: { x: 125, y: 44 },
    ukuran: { width: 11, height: 30 },
    status: 'segera-dibuka',
    riasec: ['Realistic'],
    ariaLabel: 'Bengkel - Segera dibuka',
    deskripsi: 'Segera dibuka!',
  },
];

/** Interior data for active buildings */
export const INTERIORS: Record<string, BuildingInterior> = {
  'rumah-sakit': {
    gedungId: 'rumah-sakit',
    nama: 'Dalam Rumah Sakit',
    tema: 'hospital',
    profesiIds: ['dokter', 'perawat'],
  },
  'kantor-teknologi': {
    gedungId: 'kantor-teknologi',
    nama: 'Dalam Kantor Teknologi',
    tema: 'tech-office',
    profesiIds: ['software-engineer', 'data-analyst', 'akuntan'],
  },
};

/** Get a building by ID */
export function getBuildingById(id: string): BuildingHotspot | undefined {
  return BUILDINGS.find((b) => b.id === id);
}

/** Get active buildings only */
export function getActiveBuildings(): BuildingHotspot[] {
  return BUILDINGS.filter((b) => b.status === 'active');
}

/** Get interior data for a building */
export function getInterior(buildingId: string): BuildingInterior | undefined {
  return INTERIORS[buildingId];
}
