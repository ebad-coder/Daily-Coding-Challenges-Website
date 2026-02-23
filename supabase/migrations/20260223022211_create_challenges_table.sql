/*
  # Create Challenges Table for Daily Coding Challenge App

  1. New Tables
    - `challenges`
      - `id` (uuid, primary key) - Unique identifier for each challenge
      - `title` (text) - Challenge title
      - `difficulty` (text) - Difficulty level (Easy, Medium, Hard)
      - `description` (text) - Full problem description
      - `constraints` (text[]) - Array of constraint strings
      - `examples` (jsonb) - Array of example input/output objects
      - `starter_code_cpp` (text) - C++ starter code template
      - `starter_code_python` (text) - Python starter code template
      - `test_cases` (jsonb) - Array of test case objects with input/expected output
      - `created_at` (timestamptz) - Timestamp when challenge was created
      - `is_daily` (boolean) - Flag to mark if this is today's daily challenge
      - `daily_date` (date) - Date when this challenge is/was the daily challenge

  2. Security
    - Enable RLS on `challenges` table
    - Add policy for public read access (anyone can view challenges)
    - Add policy for authenticated insert access (admin can add challenges)
*/

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Medium',
  description text NOT NULL,
  constraints text[] DEFAULT ARRAY[]::text[],
  examples jsonb DEFAULT '[]'::jsonb,
  starter_code_cpp text NOT NULL DEFAULT '// Write your solution here',
  starter_code_python text NOT NULL DEFAULT '# Write your solution here',
  test_cases jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  is_daily boolean DEFAULT false,
  daily_date date
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenges"
  ON challenges
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert challenges"
  ON challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update challenges"
  ON challenges
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_challenges_daily_date ON challenges(daily_date);
CREATE INDEX IF NOT EXISTS idx_challenges_is_daily ON challenges(is_daily);