import { describe, it, expect } from 'vitest';
import dokter from './professions/dokter';
import perawat from './professions/perawat';
import softwareEngineer from './professions/software-engineer';

describe('Specialized Education & Degree Requirements', () => {
  it('dokter has butuhGelar set to true with complete educational pathway info', () => {
    expect(dokter.butuhGelar).toBe(true);
    expect(dokter.hasSimulation).toBe(true);
    expect(dokter.pendidikanKhusus).toBeDefined();

    const info = dokter.pendidikanKhusus!;
    expect(info.judulDialog).toBe('Kamu perlu gelar untuk pekerjaan ini');
    expect(info.penjelasan).toContain('Dokter tidak bisa dicoba sehari seperti profesi lain');
    expect(info.penjelasan).toContain('membutuhkan pendidikan dan lisensi khusus');
    expect(info.durasiUmum).toBeDefined();
    expect(info.durasiUmum).toContain('bertahun-tahun');

    // Stepper sequential steps
    expect(info.langkah).toHaveLength(4);
    expect(info.langkah[0].tahap).toContain('S1 Kedokteran');
    expect(info.langkah[1].tahap).toMatch(/profesi|koas/i);
    expect(info.langkah[2].tahap).toMatch(/internship/i);
    expect(info.langkah[3].tahap).toMatch(/spesialisasi/i);

    // Numbering order
    info.langkah.forEach((step, idx) => {
      expect(step.nomor).toBe(idx + 1);
      expect(step.keterangan.length).toBeGreaterThan(10);
    });

    // Alternative recommendation points to perawat
    expect(info.alternatifProfesiId).toBe('perawat');
    expect(info.alternatifLabelTombol).toContain('Perawat');
  });

  it('preserves dokter reality check, riasec, and essential metadata', () => {
    expect(dokter.id).toBe('dokter');
    expect(dokter.nama).toBe('Dokter');
    expect(dokter.riasec).toEqual(['Investigative', 'Social']);
    expect(dokter.realityCheck.tugasHarian.length).toBeGreaterThan(0);
    expect(dokter.realityCheck.sisiTidakEnak.length).toBeGreaterThan(0);
    expect(dokter.realityCheck.keterampilan.length).toBeGreaterThan(0);
    expect(dokter.realityCheck.jurusanKuliah.utama).toContain('Pendidikan Dokter (Kedokteran)');
    expect(dokter.realityCheck.prospek.rentangGaji).toBeDefined();
  });

  it('keeps other professions untouched without butuhGelar flag', () => {
    expect(perawat.butuhGelar).toBeFalsy();
    expect(perawat.hasSimulation).toBe(true);
    expect(softwareEngineer.butuhGelar).toBeFalsy();
    expect(softwareEngineer.hasSimulation).toBe(true);
  });
});
