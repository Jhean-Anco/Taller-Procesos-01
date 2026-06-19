DROP VIEW IF EXISTS v_anonymous_reports_active;
DROP INDEX IF EXISTS idx_anonymous_reports_active_created_at;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_anonymous_reports_archive_status'
  ) THEN
    ALTER TABLE anonymous_reports
      DROP CONSTRAINT chk_anonymous_reports_archive_status;
  END IF;
END $$;

ALTER TABLE anonymous_reports
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS archived_by,
  DROP COLUMN IF EXISTS archive_reason,
  DROP COLUMN IF EXISTS archive_status;
