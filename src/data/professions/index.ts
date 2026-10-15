/**
 * Profession registry — auto-imports all profession data files.
 *
 * To add a new profession:
 * 1. Create a new file in /src/data/professions/<id>.ts
 * 2. Export a default object satisfying the Profession interface
 * 3. Import it here and add to the PROFESSIONS array
 *
 * That's it — ZERO other code changes needed.
 */

import type { Profession } from '../../types';
import dokter from './dokter';
import softwareEngineer from './software-engineer';
import perawat from './perawat';
import akuntan from './akuntan';
import dataAnalyst from './data-analyst';

/** All registered professions */
export const PROFESSIONS: Profession[] = [
  dokter,
  softwareEngineer,
  dataAnalyst,
  perawat,
  akuntan,
];

/** Get a profession by its ID */
export function getProfessionById(id: string): Profession | undefined {
  return PROFESSIONS.find((p) => p.id === id);
}

/** Get all professions in a specific building */
export function getProfessionsByBuilding(buildingId: string): Profession[] {
  return PROFESSIONS.filter((p) => p.gedung === buildingId);
}

/** Get professions that have a full simulation */
export function getSimulationProfessions(): Profession[] {
  return PROFESSIONS.filter((p) => p.hasSimulation);
}
