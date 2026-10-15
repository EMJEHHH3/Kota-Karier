/**
 * Type definitions for Retro Terminal Simulation (IT / Computer professions)
 */

import type { ScoreImpact } from './profession';

export interface TerminalTask {
  id: string;
  jam: string;
  /** Short title displayed on the task board and header (e.g. "Halo Dunia", "Perbaiki Bug") */
  judul?: string;
  /** Concise 1-2 sentence explanation separated from command */
  penjelasan?: string;
  panduan: string;
  prompt: string;
  contohPerintah: string;
  /** Regex patterns or string patterns (tested against normalized input) */
  polaJawabanBenar: string[];
  hint: string;
  outputBenar: string;
  pesanError?: string;
  /** Optional secondary step (e.g. variable assignment first, then print) */
  subLangkah?: {
    polaAwal: string[];
    outputAwal: string;
    panduanLanjutan: string;
    promptLanjutan: string;
    polaLanjutan: string[];
    outputLanjutan: string;
  };
}

export interface TerminalEventChoice {
  teks: string;
  dampak: ScoreImpact;
  konsekuensi: string;
  jamBaru?: string; // Optional time advance
}

export interface TerminalEvent {
  id: string;
  jam: string;
  karakter: string;
  avatar: string;
  judul: string;
  cerita: string;
  pilihan: TerminalEventChoice[];
}

export type TerminalStepItem =
  | { tipe: 'tugas'; data: TerminalTask }
  | { tipe: 'event'; data: TerminalEvent };

export interface TerminalSimulation {
  profesi: string;
  namaProfesi: string;
  appTitle: string;
  jamMulai: string;
  jamSelesai: string;
  deskripsi: string;
  urutan: TerminalStepItem[];
}
