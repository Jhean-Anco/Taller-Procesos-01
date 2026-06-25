ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS grade_reference VARCHAR(40),
  ADD COLUMN IF NOT EXISTS section_reference VARCHAR(20),
  ADD COLUMN IF NOT EXISTS age_range VARCHAR(30);
