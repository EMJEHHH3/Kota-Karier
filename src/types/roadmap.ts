/**
 * Type definitions for Career Roadmaps (Roadmap Karier).
 */

export interface RoadmapLink {
  label: string;
  url: string;
  badge?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  tips?: string;
  links?: RoadmapLink[];
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  steps: RoadmapStep[];
}

export interface ProfessionRoadmap {
  professionId: string;
  professionName: string;
  isGeneric: boolean;
  tagline: string;
  note?: string;
  phases: RoadmapPhase[];
}

export interface RoadmapProfessionSummary {
  id: string;
  nama: string;
  kategori: string;
}
