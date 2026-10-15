/**
 * Type definitions for Nurse Day Simulation (Bangsal Rumah Sakit Pixel Neon)
 */

export interface VitalSignItem {
  id: 'suhu' | 'nadi' | 'tensi' | 'saturasi';
  label: string;
  nilai: string | number;
  unit: string;
  isAbnormal: boolean;
  alasan: string;
}

export interface VitalSignsData {
  pasien: {
    nama: string;
    usia: number;
    kamar: string;
    keluhan: string;
  };
  tandaVital: VitalSignItem[];
  rentangNormal: Array<{ parameter: string; rujukan: string }>;
  hint: string;
}

export interface FiveRightsData {
  resep: {
    pasien: string;
    obat: string;
    dosis: string;
    rute: string;
    waktu: string;
  };
  labelObat: {
    pasien: string;
    obat: string;
    dosis: string;
    rute: string;
    waktu: string;
  };
  mismatchedAspect: 'pasien' | 'obat' | 'dosis' | 'rute' | 'waktu';
  penjelasanMismatched: string;
  hint: string;
}

export interface TriagePatient {
  id: string;
  nama: string;
  usia: number;
  keluhan: string;
  prioritas: 'Segera' | 'Cepat' | 'Biasa';
  urutanBenar: number; // 1 (highest priority) to 3
  penjelasan: string;
}

export interface TriageData {
  pasienList: TriagePatient[];
  hint: string;
}

export interface CalmingResponseOption {
  id: string;
  tipe: 'empatik' | 'cuek' | 'jargon';
  teks: string;
  responPasien: string;
  dampakTrust: number; // e.g. +20, -5, -10
  umpanBalik: string;
}

export interface CalmingPatientData {
  pasien: {
    nama: string;
    usia: number;
    kondisi: string;
    dialog: string;
  };
  pilihan: CalmingResponseOption[];
  hint: string;
}

export interface NurseAspectScores {
  ketelitian: number;
  prioritas: number;
  empati: number;
  komunikasi: number;
  kolaborasi: number;
  manajemenWaktu: number;
}

export interface NurseEventChoice {
  teks: string;
  dampak: Partial<NurseAspectScores>;
  konsekuensi: string;
  jamBaru?: string;
  menitTambahan: number;
}

export interface NurseEvent {
  id: string;
  jam: string;
  judul: string;
  karakter: string;
  avatar: string;
  cerita: string;
  pilihan: NurseEventChoice[];
}

export type NurseStep =
  | { tipe: 'misi'; id: 'vital'; jam: string; judul: string; deskripsi: string }
  | { tipe: 'misi'; id: 'obat'; jam: string; judul: string; deskripsi: string }
  | { tipe: 'event'; id: 'igd'; jam: string; judul: string }
  | { tipe: 'misi'; id: 'triase'; jam: string; judul: string; deskripsi: string }
  | { tipe: 'event'; id: 'keluarga'; jam: string; judul: string }
  | { tipe: 'misi'; id: 'komunikasi'; jam: string; judul: string; deskripsi: string };

export interface NurseSimulationData {
  profesi: string;
  namaProfesi: string;
  jamMulai: string; // "07.00"
  jamSelesai: string; // "14.00"
  disclaimer: string;
  urutan: NurseStep[];
  misi: {
    vital: VitalSignsData;
    obat: FiveRightsData;
    triase: TriageData;
    komunikasi: CalmingPatientData;
  };
  event: Record<string, NurseEvent>;
}
