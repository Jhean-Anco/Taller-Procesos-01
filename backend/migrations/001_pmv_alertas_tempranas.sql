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
    'usr_seed_admin_agora',
    'Administrador Agora',
    'admin@agora.edu.pe',
    '$2b$10$paSvJl9QWNi7RpbXRAyOWOUbCBZqc3L.O4QhhiEHdg1Vexx4TFD8q',
    'ADMIN_DIRECTOR',
    TRUE,
    now(),
    now()
  ),
  (
    'usr_seed_psicologo_agora',
    'Psicologia Agora',
    'psicologo@agora.edu.pe',
    '$2b$10$4UbFKO5uw/lQ1UzawRRBxesnqORCAzmir0Msi4LjZnONhmaoefMIu',
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
