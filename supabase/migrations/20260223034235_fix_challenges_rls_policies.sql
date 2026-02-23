/*
  # Fix RLS Policies for Challenges Table

  1. Security Changes
    - Remove overly permissive insert and update policies
    - Add restrictive policies that only allow authenticated users to insert/update
    - Maintain public read access for all challenges
    - Ensure anonymous users cannot modify challenge data
*/

DROP POLICY IF EXISTS "Authenticated users can insert challenges" ON challenges;
DROP POLICY IF EXISTS "Authenticated users can update challenges" ON challenges;

CREATE POLICY "Authenticated users can insert challenges"
  ON challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update challenges"
  ON challenges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);