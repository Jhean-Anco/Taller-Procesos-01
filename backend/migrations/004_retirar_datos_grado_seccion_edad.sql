DROP VIEW IF EXISTS v_anonymous_reports_active;

ALTER TABLE anonymous_reports
  DROP COLUMN IF EXISTS grade_reference,
  DROP COLUMN IF EXISTS section_reference,
  DROP COLUMN IF EXISTS age_range;

DROP FUNCTION IF EXISTS sp_dashboard_estadisticas_grado(INTEGER);

CREATE OR REPLACE VIEW v_anonymous_reports_active AS
SELECT *
FROM anonymous_reports
WHERE archive_status = 'ACTIVE';
