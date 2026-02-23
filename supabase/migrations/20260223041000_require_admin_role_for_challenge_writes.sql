/*
  # Restrict challenge writes to admin role claims

  1. Security Changes
    - Keep policy names used by the app for insert/update operations
    - Require authenticated JWTs with app_metadata.role = 'admin' for writes
    - Keep public reads unchanged

  2. Notes
    - Set user app metadata, e.g.:
      update auth.users set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role','admin') where email = 'admin@example.com';
*/

DROP POLICY IF EXISTS "Authenticated users can insert challenges" ON challenges;
DROP POLICY IF EXISTS "Authenticated users can update challenges" ON challenges;

CREATE POLICY "Authenticated users can insert challenges"
  ON challenges
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Authenticated users can update challenges"
  ON challenges
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
