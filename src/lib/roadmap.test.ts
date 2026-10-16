import { describe, it, expect } from 'vitest';
import {
  handleGetRoadmap,
  handleGetProfessionsList,
  handleGetPreference,
  handleSetPreference,
} from '../../server/api/roadmapRoutes.ts';

describe('Career Roadmap API & Seed Data', () => {
  it('returns a comprehensive 4-phase roadmap for software-engineer', () => {
    const roadmap = handleGetRoadmap('software-engineer');
    expect(roadmap).toBeDefined();
    expect(roadmap.professionId).toBe('software-engineer');
    expect(roadmap.professionName).toBe('Software Engineer');
    expect(roadmap.isGeneric).toBe(false);
    expect(roadmap.phases).toHaveLength(4);

    // Phase 1: SMA
    const phase1 = roadmap.phases[0];
    expect(phase1.title).toContain('Di SMA');
    expect(phase1.steps.some((s) => s.description.toLowerCase().includes('coding') || s.description.toLowerCase().includes('algoritma'))).toBe(true);
    expect(phase1.steps.some((s) => s.links && s.links.some((l) => l.url.includes('freecodecamp')))).toBe(true);

    // Phase 2: Kuliah / Pendidikan
    const phase2 = roadmap.phases[1];
    expect(phase2.title).toContain('Kuliah');
    expect(phase2.steps.some((s) => s.description.includes('Informatika') || s.description.includes('Ilmu Komputer'))).toBe(true);
    expect(phase2.steps.some((s) => s.description.toLowerCase().includes('bootcamp') || s.description.toLowerCase().includes('vokasi'))).toBe(true);

    // Phase 3: Bangun Pengalaman
    const phase3 = roadmap.phases[2];
    expect(phase3.title).toContain('Pengalaman');
    expect(phase3.steps.some((s) => (s.title + ' ' + s.description).toLowerCase().includes('github'))).toBe(true);
    expect(phase3.steps.some((s) => (s.title + ' ' + s.description).toLowerCase().includes('magang'))).toBe(true);

    // Phase 4: Karier Awal
    const phase4 = roadmap.phases[3];
    expect(phase4.title).toContain('Karier Awal');
    expect(phase4.steps.some((s) => s.description.toLowerCase().includes('junior'))).toBe(true);
    expect(phase4.steps.some((s) => s.description.includes('Perkiraan') || (s.tips && s.tips.includes('Perkiraan')))).toBe(true);
  });

  it('returns a comprehensive 4-phase roadmap for dokter', () => {
    const roadmap = handleGetRoadmap('dokter');
    expect(roadmap).toBeDefined();
    expect(roadmap.professionId).toBe('dokter');
    expect(roadmap.professionName).toBe('Dokter Umum');
    expect(roadmap.isGeneric).toBe(false);
    expect(roadmap.phases).toHaveLength(4);

    // Phase 1: SMA (Biologi, Kimia, PMR, KIR)
    const p1 = roadmap.phases[0];
    expect(p1.steps.some((s) => (s.title + ' ' + s.description).includes('Biologi') && (s.title + ' ' + s.description).includes('Kimia'))).toBe(true);
    expect(p1.steps.some((s) => (s.title + ' ' + s.description).includes('PMR') || (s.title + ' ' + s.description).includes('KIR'))).toBe(true);

    // Phase 2: Kuliah Kedokteran
    const p2 = roadmap.phases[1];
    expect(p2.steps.some((s) => s.description.includes('Kedokteran'))).toBe(true);

    // Phase 3: Koas & Internship
    const p3 = roadmap.phases[2];
    expect(p3.steps.some((s) => (s.title + ' ' + s.description).toLowerCase().includes('koas'))).toBe(true);
    expect(p3.steps.some((s) => (s.title + ' ' + s.description).toLowerCase().includes('internship'))).toBe(true);

    // Phase 4: Karier Awal & Spesialisasi
    const p4 = roadmap.phases[3];
    expect(p4.steps.some((s) => s.description.toLowerCase().includes('dokter umum'))).toBe(true);
    expect(p4.steps.some((s) => s.description.toLowerCase().includes('spesialis'))).toBe(true);
  });

  it('ensures domain isolation: no medical terms in software engineer, no coding terms in dokter', () => {
    const seRoadmap = JSON.stringify(handleGetRoadmap('software-engineer')).toLowerCase();
    const drRoadmap = JSON.stringify(handleGetRoadmap('dokter')).toLowerCase();

    // Software engineer should not have medical terms
    expect(seRoadmap).not.toContain('koas');
    expect(seRoadmap).not.toContain('pasien');
    expect(seRoadmap).not.toContain('stetoskop');

    // Dokter should not have software engineering terms
    expect(drRoadmap).not.toContain('github');
    expect(drRoadmap).not.toContain('freecodecamp');
    expect(drRoadmap).not.toContain('frontend');
  });

  it('generates a generic fallback roadmap for unknown professions with warning note', () => {
    const fallback = handleGetRoadmap('arsitek');
    expect(fallback.isGeneric).toBe(true);
    expect(fallback.professionName).toBe('Arsitek');
    expect(fallback.note).toBeDefined();
    expect(fallback.note).toContain('umum');
    expect(fallback.phases).toHaveLength(4);
    expect(fallback.phases[0].title).toContain('Di SMA');
    expect(fallback.phases[1].title).toContain('Kuliah');
    expect(fallback.phases[2].title).toContain('Pengalaman');
    expect(fallback.phases[3].title).toContain('Karier Awal');
  });

  it('manages last viewed profession preference', () => {
    handleSetPreference('dokter');
    expect(handleGetPreference()).toBe('dokter');

    handleSetPreference('software-engineer');
    expect(handleGetPreference()).toBe('software-engineer');
  });

  it('returns all available professions list', () => {
    const list = handleGetProfessionsList();
    expect(list.length).toBeGreaterThanOrEqual(5);
    const ids = list.map((p) => p.id);
    expect(ids).toContain('software-engineer');
    expect(ids).toContain('dokter');
    expect(ids).toContain('data-analyst');
    expect(ids).toContain('perawat');
    expect(ids).toContain('akuntan');
  });
});
