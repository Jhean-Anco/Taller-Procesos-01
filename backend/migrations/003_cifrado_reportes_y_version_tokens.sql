-- 003_cifrado_reportes_y_version_tokens.sql
-- Agrega columnas para cifrado y control de revocacion.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE anonymous_reports
  ADD COLUMN IF NOT EXISTS emotional_form_ciphertext TEXT,
  ADD COLUMN IF NOT EXISTS message_text_ciphertext TEXT,
  ADD COLUMN IF NOT EXISTS analysis_worker_id VARCHAR(80),
  ADD COLUMN IF NOT EXISTS analysis_acquired_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_anonymous_reports_analysis_queue_pending
  ON anonymous_reports(analysis_queue_status, analysis_next_attempt_at, analysis_requested_at);

CREATE UNIQUE INDEX IF NOT EXISTS uq_anonymous_reports_public_code
  ON anonymous_reports(public_code);

