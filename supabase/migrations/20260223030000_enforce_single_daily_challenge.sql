/*
  # Enforce a single daily challenge row

  1. Constraints
    - Adds a partial unique index so at most one row can have `is_daily = true`
*/

CREATE UNIQUE INDEX IF NOT EXISTS idx_challenges_single_daily_true
  ON challenges (is_daily)
  WHERE is_daily = true;
