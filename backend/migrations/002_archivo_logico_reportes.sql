-- 002_archivo_logico_reportes.sql
-- Aplicacion: archivado logico versionado para anonymous_reports.
-- Aplicar:
--   psql -d safeschool_ai -f backend/migrations/002_archivo_logico_reportes.sql
-- Rollback:
--   psql -d safeschool_ai -f backend/migrations/002_archivo_logico_reportes.rollback.sql

ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS archived_by VARCHAR(64),
  ADD COLUMN IF NOT EXISTS archive_reason TEXT,
  ADD COLUMN IF NOT EXISTS archive_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_anonymous_reports_archive_status'
  ) THEN
    ALTER TABLE anonymous_reports
      ADD CONSTRAINT chk_anonymous_reports_archive_status
      CHECK (archive_status IN ('ACTIVE', 'ARCHIVED'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_anonymous_reports_active_created_at
  ON anonymous_reports(created_at DESC)
  WHERE archive_status = 'ACTIVE';

CREATE OR REPLACE VIEW v_anonymous_reports_active AS
SELECT *
FROM anonymous_reports
WHERE archive_status = 'ACTIVE';
