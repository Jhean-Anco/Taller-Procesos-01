ALTER TABLE anonymous_reports
  DROP COLUMN IF EXISTS analysis_worker_id,
  DROP COLUMN IF EXISTS analysis_acquired_at,
  DROP COLUMN IF EXISTS emotional_form_ciphertext,
  DROP COLUMN IF EXISTS message_text_ciphertext;

ALTER TABLE users
  DROP COLUMN IF EXISTS token_version;

DROP INDEX IF EXISTS idx_anonymous_reports_analysis_queue_pending;

