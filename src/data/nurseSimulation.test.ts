import { describe, it, expect } from 'vitest';
import { perawatNurseSimulation } from './nurseSimulation';

describe('NurseSimulationData (perawat)', () => {
  it('has proper sequence of 4 missions and 2 events from 07.00 to 14.00', () => {
    expect(perawatNurseSimulation.jamMulai).toBe('07.00');
    expect(perawatNurseSimulation.jamSelesai).toBe('14.00');
    expect(perawatNurseSimulation.urutan.length).toBe(6);

    const stepTypes = perawatNurseSimulation.urutan.map((s) => s.tipe);
    expect(stepTypes).toEqual(['misi', 'misi', 'event', 'misi', 'event', 'misi']);

    const stepIds = perawatNurseSimulation.urutan.map((s) => s.id);
    expect(stepIds).toEqual(['vital', 'obat', 'igd', 'triase', 'keluarga', 'komunikasi']);
  });

  describe('Misi 1: Cek Tanda Vital', () => {
    const { tandaVital, rentangNormal } = perawatNurseSimulation.misi.vital;

    it('has 4 vital sign parameters with exactly 1 abnormal value (Suhu 38,6 °C)', () => {
      expect(tandaVital.length).toBe(4);
      const abnormalList = tandaVital.filter((v) => v.isAbnormal);
      expect(abnormalList.length).toBe(1);
      expect(abnormalList[0].id).toBe('suhu');
      expect(abnormalList[0].nilai).toBe('38,6');
    });

    it('provides standard normal ranges for reference', () => {
      expect(rentangNormal.length).toBe(4);
      expect(rentangNormal.some((r) => r.parameter === 'Suhu Tubuh')).toBe(true);
    });
  });

  describe('Misi 2: Pemberian Obat 5 Benar', () => {
    const { resep, labelObat, mismatchedAspect } = perawatNurseSimulation.misi.obat;

    it('identifies patient name mismatch between prescription and medicine label', () => {
      expect(mismatchedAspect).toBe('pasien');
      expect(resep.pasien).not.toBe(labelObat.pasien);
      expect(resep.pasien).toContain('Ny. Siti');
      expect(labelObat.pasien).toContain('Ny. Sri');
      // Medication, dosage, route, time match
      expect(resep.obat).toBe(labelObat.obat);
      expect(resep.dosis).toBe(labelObat.dosis);
      expect(resep.rute).toBe(labelObat.rute);
      expect(resep.waktu).toBe(labelObat.waktu);
    });
  });

  describe('Misi 3: Triase Pasien', () => {
    const { pasienList } = perawatNurseSimulation.misi.triase;

    it('has 3 patients with clear clinical priority order (Segera -> Cepat -> Biasa)', () => {
      expect(pasienList.length).toBe(3);
      const p1 = pasienList.find((p) => p.urutanBenar === 1);
      const p2 = pasienList.find((p) => p.urutanBenar === 2);
      const p3 = pasienList.find((p) => p.urutanBenar === 3);

      expect(p1?.prioritas).toBe('Segera');
      expect(p1?.keluhan).toContain('Sesak napas');

      expect(p2?.prioritas).toBe('Cepat');
      expect(p2?.keluhan).toContain('Demam tinggi');

      expect(p3?.prioritas).toBe('Biasa');
      expect(p3?.keluhan).toContain('Luka lecet');
    });
  });

  describe('Misi 4: Menenangkan Pasien', () => {
    const { pilihan } = perawatNurseSimulation.misi.komunikasi;

    it('offers empathetic, dismissive, and jargon options with different trust impacts', () => {
      expect(pilihan.length).toBe(3);
      const empathetic = pilihan.find((p) => p.tipe === 'empatik');
      const dismissive = pilihan.find((p) => p.tipe === 'cuek');
      const jargon = pilihan.find((p) => p.tipe === 'jargon');

      expect(empathetic).toBeDefined();
      expect(empathetic!.dampakTrust).toBeGreaterThan(0);

      expect(dismissive).toBeDefined();
      expect(dismissive!.dampakTrust).toBeLessThan(0);

      expect(jargon).toBeDefined();
    });
  });

  describe('World Events (IGD & Keluarga Marah)', () => {
    it('contains IGD and Keluarga events with 3 choices each and consequences', () => {
      const igd = perawatNurseSimulation.event.igd;
      const keluarga = perawatNurseSimulation.event.keluarga;

      expect(igd).toBeDefined();
      expect(igd.pilihan.length).toBe(3);
      igd.pilihan.forEach((p) => {
        expect(p.teks.length).toBeGreaterThan(0);
        expect(p.konsekuensi.length).toBeGreaterThan(0);
        expect(p.menitTambahan).toBeGreaterThan(0);
      });

      expect(keluarga).toBeDefined();
      expect(keluarga.pilihan.length).toBe(3);
      keluarga.pilihan.forEach((p) => {
        expect(p.teks.length).toBeGreaterThan(0);
        expect(p.konsekuensi.length).toBeGreaterThan(0);
        expect(p.menitTambahan).toBeGreaterThan(0);
      });
    });
  });
});
