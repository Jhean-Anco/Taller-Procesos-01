CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL CHECK (role IN ('PSYCHOLOGIST', 'ADMIN_DIRECTOR')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO users (id, name, email, password_hash, role, active, created_at, updated_at)
VALUES
  (
    COALESCE(current_setting('app.bootstrap_admin_id', true), 'usr_seed_admin_agora'),
    COALESCE(current_setting('app.bootstrap_admin_name', true), 'Administrador Agora'),
    current_setting('app.bootstrap_admin_email', true),
    current_setting('app.bootstrap_admin_password_hash', true),
    'ADMIN_DIRECTOR',
    TRUE,
    now(),
    now()
  ),
  (
    COALESCE(current_setting('app.bootstrap_psychologist_id', true), 'usr_seed_psicologo_agora'),
    COALESCE(current_setting('app.bootstrap_psychologist_name', true), 'Psicologia Agora'),
    current_setting('app.bootstrap_psychologist_email', true),
    current_setting('app.bootstrap_psychologist_password_hash', true),
    'PSYCHOLOGIST',
    TRUE,
    now(),
    now()
  )
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  active = TRUE,
  updated_at = now();

CREATE TABLE IF NOT EXISTS anonymous_reports (
  id VARCHAR(64) PRIMARY KEY,
  public_code VARCHAR(40) NOT NULL UNIQUE,
  grade_reference VARCHAR(40),
  section_reference VARCHAR(20),
  age_range VARCHAR(30),
  emotional_form JSONB NOT NULL DEFAULT '{}'::jsonb,
  message_text TEXT NOT NULL,
  consent_accepted BOOLEAN NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'IN_REVIEW', 'ADDRESSED', 'CLOSED')),
  analysis_queue_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (analysis_queue_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  analysis_attempts INTEGER NOT NULL DEFAULT 0,
  analysis_next_attempt_at TIMESTAMP,
  analysis_last_error TEXT,
  analysis_requested_at TIMESTAMP NOT NULL DEFAULT now(),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS analysis_queue_status VARCHAR(20) NOT NULL DEFAULT 'PENDING';
ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS analysis_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS analysis_next_attempt_at TIMESTAMP;
ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS analysis_last_error TEXT;
ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS analysis_requested_at TIMESTAMP NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS ai_analyses (
  id VARCHAR(64) PRIMARY KEY,
  report_id VARCHAR(64) NOT NULL REFERENCES anonymous_reports(id) ON DELETE CASCADE,
  dominant_emotion VARCHAR(80) NOT NULL,
  emotion_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  risk_ai VARCHAR(20) NOT NULL CHECK (risk_ai IN ('LOW', 'MEDIUM', 'HIGH')),
  confidence NUMERIC(5,4),
  relevant_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
  model_version VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS psychological_reviews (
  id VARCHAR(64) PRIMARY KEY,
  report_id VARCHAR(64) NOT NULL REFERENCES anonymous_reports(id) ON DELETE CASCADE,
  psychologist_id VARCHAR(64) NOT NULL,
  validated_risk VARCHAR(20) NOT NULL CHECK (validated_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  observation_internal TEXT,
  reviewed_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(64) PRIMARY KEY,
  report_id VARCHAR(64) NOT NULL REFERENCES anonymous_reports(id) ON DELETE CASCADE,
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'IN_REVIEW', 'ADDRESSED', 'CLOSED')),
  generated_by VARCHAR(30) NOT NULL CHECK (generated_by IN ('AI', 'PSYCHOLOGIST')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_active_alert_per_report
  ON alerts(report_id)
  WHERE status <> 'CLOSED';

CREATE TABLE IF NOT EXISTS derivations (
  id VARCHAR(64) PRIMARY KEY,
  report_id VARCHAR(64) NOT NULL REFERENCES anonymous_reports(id) ON DELETE CASCADE,
  psychologist_id VARCHAR(64) NOT NULL,
  admin_director_id VARCHAR(64),
  non_sensitive_summary TEXT NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING', 'REVIEWED', 'CLOSED')),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS preventive_activities (
  id VARCHAR(64) PRIMARY KEY,
  report_id VARCHAR(64) REFERENCES anonymous_reports(id) ON DELETE SET NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  objective TEXT NOT NULL,
  activity_type VARCHAR(120) NOT NULL,
  responsible VARCHAR(160) NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  created_by VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE preventive_activities
  ADD COLUMN IF NOT EXISTS report_id VARCHAR(64);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_preventive_activities_report'
  ) THEN
    ALTER TABLE preventive_activities
      ADD CONSTRAINT fk_preventive_activities_report
      FOREIGN KEY (report_id) REFERENCES anonymous_reports(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  actor_user_id VARCHAR(64),
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(64),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip VARCHAR(80),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE OR REPLACE PROCEDURE sp_limpiar_carga_reportes_masivos()
LANGUAGE sql
AS $$
  DELETE FROM anonymous_reports WHERE id LIKE 'rep_massivo_%';
$$;

CREATE OR REPLACE FUNCTION sp_dashboard_resumen()
RETURNS TABLE (
  reports_received INTEGER,
  alerts_generated INTEGER,
  cases_addressed INTEGER,
  preventive_activities INTEGER,
  ai_classified_reports INTEGER,
  ai_degraded_reports INTEGER,
  ai_pending_reports INTEGER
)
LANGUAGE sql
AS $$
  SELECT
    (SELECT COUNT(*)::int FROM anonymous_reports) AS reports_received,
    (SELECT COUNT(*)::int FROM alerts) AS alerts_generated,
    (SELECT COUNT(*)::int FROM anonymous_reports WHERE status = 'ADDRESSED') AS cases_addressed,
    (SELECT COUNT(*)::int FROM preventive_activities) AS preventive_activities,
    (SELECT COUNT(DISTINCT report_id)::int FROM ai_analyses) AS ai_classified_reports,
    (
      SELECT COUNT(DISTINCT report_id)::int
      FROM ai_analyses
      WHERE relevant_signals ? 'ai_service_unavailable_local_fallback'
    ) AS ai_degraded_reports,
    (
      SELECT COUNT(*)::int
      FROM anonymous_reports report
      WHERE NOT EXISTS (
        SELECT 1
        FROM ai_analyses analysis
        WHERE analysis.report_id = report.id
      )
    ) AS ai_pending_reports;
$$;

CREATE OR REPLACE FUNCTION sp_dashboard_estadisticas_riesgo(min_group_size INTEGER DEFAULT 3)
RETURNS TABLE (metric_label TEXT, metric_value TEXT)
LANGUAGE sql
AS $$
  WITH latest_analysis AS (
    SELECT DISTINCT ON (report_id) report_id, risk_ai
    FROM ai_analyses
    ORDER BY report_id, created_at DESC
  ),
  latest_review AS (
    SELECT DISTINCT ON (report_id) report_id, validated_risk
    FROM psychological_reviews
    ORDER BY report_id, reviewed_at DESC
  ),
  counts AS (
    SELECT
      COALESCE(
        CASE COALESCE(latest_review.validated_risk, latest_analysis.risk_ai)
          WHEN 'LOW' THEN 'Bajo'
          WHEN 'MEDIUM' THEN 'Moderado'
          WHEN 'HIGH' THEN 'Alto'
        END,
        'Sin clasificar'
      ) AS label,
      COUNT(*)::int AS total
    FROM anonymous_reports report
    LEFT JOIN latest_analysis ON latest_analysis.report_id = report.id
    LEFT JOIN latest_review ON latest_review.report_id = report.id
    GROUP BY 1
  )
  SELECT
    label AS metric_label,
    CASE
      WHEN total < min_group_size THEN 'datos insuficientes para proteger anonimato'
      ELSE total::text
    END AS metric_value
  FROM counts
  ORDER BY label;
$$;

CREATE OR REPLACE FUNCTION sp_dashboard_estadisticas_emocion(min_group_size INTEGER DEFAULT 3)
RETURNS TABLE (metric_label TEXT, metric_value TEXT)
LANGUAGE sql
AS $$
  WITH latest_analysis AS (
    SELECT DISTINCT ON (report_id) report_id, dominant_emotion
    FROM ai_analyses
    ORDER BY report_id, created_at DESC
  ),
  counts AS (
    SELECT
      COALESCE(
        CASE latest_analysis.dominant_emotion
          WHEN 'fear' THEN 'miedo'
          WHEN 'sadness' THEN 'tristeza'
          WHEN 'anxiety' THEN 'ansiedad'
          WHEN 'anger' THEN 'enojo'
          WHEN 'uncertain' THEN 'indeterminado'
          WHEN 'joy' THEN 'alegria'
          WHEN 'neutral' THEN 'neutral'
          WHEN 'isolation' THEN 'aislamiento'
          WHEN 'school_insecurity' THEN 'inseguridad escolar'
          ELSE REPLACE(latest_analysis.dominant_emotion, '_', ' ')
        END,
        'Sin clasificar'
      ) AS label,
      COUNT(*)::int AS total
    FROM anonymous_reports report
    LEFT JOIN latest_analysis ON latest_analysis.report_id = report.id
    GROUP BY 1
  )
  SELECT
    label AS metric_label,
    CASE
      WHEN total < min_group_size THEN 'datos insuficientes para proteger anonimato'
      ELSE total::text
    END AS metric_value
  FROM counts
  ORDER BY label;
$$;

CREATE OR REPLACE FUNCTION sp_dashboard_tendencia_reportes(min_group_size INTEGER DEFAULT 3)
RETURNS TABLE (metric_label TEXT, metric_value TEXT)
LANGUAGE sql
AS $$
  WITH counts AS (
    SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS label, COUNT(*)::int AS total
    FROM anonymous_reports
    GROUP BY 1
  )
  SELECT
    label AS metric_label,
    CASE
      WHEN total < min_group_size THEN 'datos insuficientes para proteger anonimato'
      ELSE total::text
    END AS metric_value
  FROM counts
  ORDER BY label;
$$;

CREATE OR REPLACE FUNCTION sp_dashboard_estadisticas_grado(min_group_size INTEGER DEFAULT 3)
RETURNS TABLE (metric_label TEXT, metric_value TEXT)
LANGUAGE sql
AS $$
  WITH counts AS (
    SELECT COALESCE(NULLIF(grade_reference, ''), 'SIN_DATO') AS label, COUNT(*)::int AS total
    FROM anonymous_reports
    GROUP BY 1
  )
  SELECT
    label AS metric_label,
    CASE
      WHEN total < min_group_size THEN 'datos insuficientes para proteger anonimato'
      ELSE total::text
    END AS metric_value
  FROM counts
  ORDER BY label;
$$;

CREATE OR REPLACE FUNCTION sp_validar_carga_reportes_masivos(expected_total INTEGER DEFAULT NULL)
RETURNS TABLE (
  total_masivos INTEGER,
  total_visibles_psicologo INTEGER,
  analisis_masivos INTEGER,
  pendientes_ia INTEGER,
  carga_exitosa BOOLEAN,
  observacion TEXT
)
LANGUAGE sql
AS $$
  WITH counts AS (
    SELECT
      (SELECT COUNT(*)::int FROM anonymous_reports WHERE id LIKE 'rep_massivo_%') AS total_masivos,
      (
        SELECT COUNT(*)::int
        FROM anonymous_reports
        WHERE id LIKE 'rep_massivo_%'
          AND status IN ('PENDING', 'IN_REVIEW', 'ADDRESSED', 'CLOSED')
      ) AS total_visibles_psicologo,
      (SELECT COUNT(*)::int FROM ai_analyses WHERE report_id LIKE 'rep_massivo_%') AS analisis_masivos,
      (
        SELECT COUNT(*)::int
        FROM anonymous_reports
        WHERE id LIKE 'rep_massivo_%'
          AND analysis_queue_status = 'PENDING'
      ) AS pendientes_ia
  )
  SELECT
    total_masivos,
    total_visibles_psicologo,
    analisis_masivos,
    pendientes_ia,
    (
      (expected_total IS NULL OR total_masivos = expected_total)
      AND total_visibles_psicologo = total_masivos
      AND analisis_masivos = 0
      AND pendientes_ia = total_masivos
    ) AS carga_exitosa,
    CASE
      WHEN expected_total IS NOT NULL AND total_masivos <> expected_total
        THEN 'No coincide el total esperado de reportes masivos'
      WHEN total_visibles_psicologo <> total_masivos
        THEN 'Hay reportes masivos que no quedan visibles para psicologia'
      WHEN analisis_masivos <> 0
        THEN 'La carga masiva genero analisis IA aunque debe quedar pendiente'
      WHEN pendientes_ia <> total_masivos
        THEN 'Hay reportes masivos que no quedaron pendientes de IA'
      ELSE 'Carga masiva validada como datos crudos para procesar IA bajo demanda'
    END AS observacion
  FROM counts;
$$;
