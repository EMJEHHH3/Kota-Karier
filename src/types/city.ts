/**
 * Type definitions for the city map, buildings, and interiors.
 */

import type { RiasecType } from './profession';

/** Status of a building — active or coming soon */
export type BuildingStatus = 'active' | 'segera-dibuka';

/** A clickable hotspot on the city map */
export interface BuildingHotspot {
  /** Unique building ID (matches gedung field in professions) */
  id: string;
  /** Display order from left to right on the city map */
  urutan: number;
  /** Display name (Indonesian) */
  nama: string;
  /** Position on the city map (percentage-based for responsiveness) */
  posisi: { x: number; y: number };
  /** Size of the hotspot area */
  ukuran: { width: number; height: number };
  /** Whether the building is active or coming soon */
  status: BuildingStatus;
  /** RIASEC types associated with this building's professions */
  riasec: RiasecType[];
  /** Aria label for accessibility */
  ariaLabel: string;
  /** Short description shown on hover */
  deskripsi: string;
}

/** Interior room data for a building */
export interface BuildingInterior {
  /** Building ID this interior belongs to */
  gedungId: string;
  /** Display name of the interior */
  nama: string;
  /** Background description/theme for the room */
  tema: string;
  /** Profession IDs available in this interior */
  profesiIds: string[];
}
