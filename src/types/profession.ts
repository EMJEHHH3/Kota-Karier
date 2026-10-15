/**
 * Core type definitions for the profession data model.
 * Each profession is a standalone typed data file — adding a new profession
 * requires ZERO code changes, just a new file that satisfies this interface.
 */

// --- RIASEC Framework Types ---

/** Holland's RIASEC interest types */
export type RiasecType =
  | 'Realistic'    // Hands-on, practical
  | 'Investigative' // Analytical, intellectual
  | 'Artistic'     // Creative, expressive
  | 'Social'       // Helping, teaching
  | 'Enterprising' // Leading, persuading
  | 'Conventional'; // Organizing, data-oriented

// --- Simulation Types ---

/** Score impacts from a single simulation choice */
export interface ScoreImpact {
  /** How much the user enjoyed/found the task interesting (-2 to +2) */
  interest: number;
  /** How well the user performed the task (-2 to +2) */
  ability: number;
  /** How the user handles stress/adversity (-2 to +2) */
  resilience: number;
  /** Work style alignment */
  workStyle: {
    analytical: number;
    social: number;
    creative: number;
    technical: number;
  };
}

/** A single choice in a simulation step */
export interface SimulationChoice {
  /** Display text for this option (Indonesian) */
  teks: string;
  /** Score impacts of choosing this option */
  dampak: ScoreImpact;
  /** Optional short feedback after choosing (Indonesian) */
  umpanBalik?: string;
}

/** A single step/scene in the day simulation */
export interface SimulationStep {
  /** Time of day (e.g., "08.00", "10.30") */
  jam: string;
  /** Narrative text describing the scene (Indonesian) */
  narasi: string;
  /** Available choices for this step */
  pilihan: SimulationChoice[];
  /** Whether this step includes a mini skill task */
  isMiniTask?: boolean;
  /** Whether this step represents an unpleasant moment */
  isUnpleasantMoment?: boolean;
}

/** Complete simulation data for a profession */
export interface Simulation {
  /** Title shown to user, e.g., "Sehari Jadi Dokter" */
  judul: string;
  /** Brief intro text before simulation starts */
  intro: string;
  /** Ordered steps of the simulation */
  langkah: SimulationStep[];
}

// --- Reality Check Types ---

/** A skill with its learnability tag */
export interface Skill {
  /** Skill name (Indonesian) */
  nama: string;
  /** Whether technical or non-technical */
  jenis: 'teknis' | 'non-teknis';
  /** Can it be learned on the job or is it required from the start? */
  kategori: 'wajib sejak awal' | 'bisa dipelajari sambil jalan';
}

/** University major information */
export interface JurusanKuliah {
  /** Main recommended majors */
  utama: string[];
  /** Alternative/related majors */
  alternatif: string[];
  /** Core courses to expect */
  mataKuliahInti: string[];
}

/** Non-S1 (non-bachelor) pathway */
export interface JalurAlternatif {
  /** Type of pathway */
  jenis: 'D3/D4 Vokasi' | 'SMK' | 'Bootcamp' | 'Sertifikasi' | 'Otodidak';
  /** Description of this pathway */
  deskripsi: string;
  /** Examples of institutions/programs if known */
  contoh?: string[];
}

/** Salary/prospect data — NEVER invent numbers */
export interface Prospek {
  /** Salary range string, or "Data belum tersedia" */
  rentangGaji: string;
  /** Source of the salary data */
  sumber: string;
  /** Year of data */
  tahun: number | string; // string for "Data belum tersedia"
  /** Demand description in Indonesia */
  permintaan: string;
}

/** Complete Reality Check card for a profession */
export interface RealityCheck {
  /** 3-4 daily tasks */
  tugasHarian: string[];
  /** 2-3 honest unpleasant aspects */
  sisiTidakEnak: string[];
  /** Required skills */
  keterampilan: Skill[];
  /** University major info */
  jurusanKuliah: JurusanKuliah;
  /** Non-degree pathways */
  jalurAlternatif: JalurAlternatif[];
  /** Career prospects */
  prospek: Prospek;
}

// --- Main Profession Interface ---

/** The trigger object in a building interior */
export interface TriggerObject {
  /** Object ID (used in hotspot mapping) */
  id: string;
  /** Object name (Indonesian), e.g., "Stetoskop" */
  nama: string;
  /** Brief label shown on hover */
  label: string;
  /** CSS position within the interior (percentage-based) */
  posisi: { x: number; y: number };
}

// --- Specialized Degree / Education Path Interface ---

export interface LangkahPendidikanKhusus {
  nomor: number;
  tahap: string;
  keterangan: string;
  catatan?: string;
}

export interface PendidikanKhususInfo {
  judulTentang?: string;
  judulDialog?: string;
  catatan?: string;
  penjelasan?: string;
  durasiUmum?: string;
  langkah: LangkahPendidikanKhusus[];
  alternatifProfesiId?: string;
  alternatifNama?: string;
  alternatifLabelTombol?: string;
}

/**
 * Complete profession data file interface.
 * Each profession lives in /src/data/professions/<id>.ts
 * and exports a single object satisfying this interface.
 */
export interface Profession {
  /** Unique slug identifier, e.g., "dokter" */
  id: string;
  /** Display name (Indonesian), e.g., "Dokter" */
  nama: string;
  /** Which building this profession belongs to */
  gedung: string;
  /** Urutan tampilan dalam gedung (angka lebih kecil tampil lebih dulu) */
  urutan?: number;
  /** The clickable object in the interior that triggers this profession */
  bendaPemicu: TriggerObject;
  /** RIASEC types associated with this profession (1-3) */
  riasec: RiasecType[];
  /** Branching simulation data (null if reality-check-only) */
  simulasi: Simulation | null;
  /** Reality Check card data */
  realityCheck: RealityCheck;
  /** Last review date for the data (ISO date string) */
  terakhirDitinjau: string;
  /** Whether this profession has a full simulation or only reality check */
  hasSimulation: boolean;
  /** Alias flag apakah memiliki simulasi interaktif sehari */
  punyaSimulasi?: boolean;
  /** Whether this profession requires special formal degree/license so a day simulation is unavailable */
  butuhGelar?: boolean;
  /** Structured educational pathway information for professions requiring degrees */
  pendidikanKhusus?: PendidikanKhususInfo;
}


