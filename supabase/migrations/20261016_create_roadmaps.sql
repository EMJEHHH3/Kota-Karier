-- Migration: 20261016_create_roadmaps.sql
-- Description: Create career_roadmaps table for storing profession roadmap sequences and fallback status

CREATE TABLE IF NOT EXISTS career_roadmaps (
  profession_id TEXT PRIMARY KEY,
  profession_name TEXT NOT NULL,
  is_generic BOOLEAN DEFAULT FALSE,
  tagline TEXT,
  note TEXT,
  phases JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Public Read Access
ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to career roadmaps"
  ON career_roadmaps
  FOR SELECT
  USING (true);

-- Index for fast lookup by profession_id
CREATE INDEX IF NOT EXISTS idx_career_roadmaps_profession_id
  ON career_roadmaps (profession_id);
