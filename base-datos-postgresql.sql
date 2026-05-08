SELECT 'CREATE DATABASE safeschool_ai'
WHERE NOT EXISTS (
  SELECT 1 FROM pg_database WHERE datname = 'safeschool_ai'
)\gexec

\c safeschool_ai;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_usuario VARCHAR(60) NOT NULL UNIQUE,
  clave_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(30) NOT NULL CHECK (rol IN ('estudiante_anonimo', 'psicologo', 'administrativo')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID UNIQUE,
  codigo_anonimo VARCHAR(30) NOT NULL UNIQUE,
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_estudiantes_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS encuestas_emocionales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL,
  texto_emocional TEXT NOT NULL,
  nivel_animo INTEGER NOT NULL CHECK (nivel_animo BETWEEN 1 AND 5),
  nivel_seguridad INTEGER NOT NULL CHECK (nivel_seguridad BETWEEN 1 AND 5),
  puntaje_riesgo INTEGER NOT NULL DEFAULT 0 CHECK (puntaje_riesgo BETWEEN 0 AND 100),
  grado SMALLINT NOT NULL DEFAULT 1 CHECK (grado IN (0, 1)),
  zona_junin SMALLINT NOT NULL DEFAULT 1 CHECK (zona_junin IN (0, 1)),
  recreo_solo SMALLINT NOT NULL DEFAULT 0 CHECK (recreo_solo IN (0, 1)),
  animo_manana SMALLINT NOT NULL DEFAULT 0 CHECK (animo_manana IN (0, 1)),
  miedo_participar SMALLINT NOT NULL DEFAULT 0 CHECK (miedo_participar IN (0, 1)),
  redes_sociales SMALLINT NOT NULL DEFAULT 0 CHECK (redes_sociales IN (0, 1)),
  apoyo_familiar SMALLINT NOT NULL DEFAULT 1 CHECK (apoyo_familiar IN (0, 1)),
  rendimiento SMALLINT NOT NULL DEFAULT 0 CHECK (rendimiento IN (0, 1)),
  habilidades_sociales SMALLINT NOT NULL DEFAULT 1 CHECK (habilidades_sociales IN (0, 1)),
  entorno_violento SMALLINT NOT NULL DEFAULT 0 CHECK (entorno_violento IN (0, 1)),
  evaluacion_ia_disponible BOOLEAN NOT NULL DEFAULT FALSE,
  nivel_riesgo_ia VARCHAR(60) NULL,
  prioridad_atencion_ia VARCHAR(30) NULL,
  analisis_psicologico_ia TEXT NULL,
  accion_recomendada_ia TEXT NULL,
  factores_detectados_ia TEXT NULL,
  factores_protectores_ia TEXT NULL,
  prediccion_arbol INTEGER NULL CHECK (prediccion_arbol IS NULL OR prediccion_arbol IN (0, 1)),
  sentimiento_texto_ia VARCHAR(30) NULL,
  confianza_texto_ia DOUBLE PRECISION NULL CHECK (
    confianza_texto_ia IS NULL OR confianza_texto_ia BETWEEN 0 AND 1
  ),
  confianza_global_ia DOUBLE PRECISION NULL CHECK (
    confianza_global_ia IS NULL OR confianza_global_ia BETWEEN 0 AND 1
  ),
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_encuestas_estudiante
    FOREIGN KEY (estudiante_id)
    REFERENCES estudiantes (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

ALTER TABLE encuestas_emocionales
  ADD COLUMN IF NOT EXISTS grado SMALLINT NOT NULL DEFAULT 1 CHECK (grado IN (0, 1)),
  ADD COLUMN IF NOT EXISTS zona_junin SMALLINT NOT NULL DEFAULT 1 CHECK (zona_junin IN (0, 1)),
  ADD COLUMN IF NOT EXISTS recreo_solo SMALLINT NOT NULL DEFAULT 0 CHECK (recreo_solo IN (0, 1)),
  ADD COLUMN IF NOT EXISTS animo_manana SMALLINT NOT NULL DEFAULT 0 CHECK (animo_manana IN (0, 1)),
  ADD COLUMN IF NOT EXISTS miedo_participar SMALLINT NOT NULL DEFAULT 0 CHECK (miedo_participar IN (0, 1)),
  ADD COLUMN IF NOT EXISTS redes_sociales SMALLINT NOT NULL DEFAULT 0 CHECK (redes_sociales IN (0, 1)),
  ADD COLUMN IF NOT EXISTS apoyo_familiar SMALLINT NOT NULL DEFAULT 1 CHECK (apoyo_familiar IN (0, 1)),
  ADD COLUMN IF NOT EXISTS rendimiento SMALLINT NOT NULL DEFAULT 0 CHECK (rendimiento IN (0, 1)),
  ADD COLUMN IF NOT EXISTS habilidades_sociales SMALLINT NOT NULL DEFAULT 1 CHECK (habilidades_sociales IN (0, 1)),
  ADD COLUMN IF NOT EXISTS entorno_violento SMALLINT NOT NULL DEFAULT 0 CHECK (entorno_violento IN (0, 1)),
  ADD COLUMN IF NOT EXISTS evaluacion_ia_disponible BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS nivel_riesgo_ia VARCHAR(60) NULL,
  ADD COLUMN IF NOT EXISTS prioridad_atencion_ia VARCHAR(30) NULL,
  ADD COLUMN IF NOT EXISTS analisis_psicologico_ia TEXT NULL,
  ADD COLUMN IF NOT EXISTS accion_recomendada_ia TEXT NULL,
  ADD COLUMN IF NOT EXISTS factores_detectados_ia TEXT NULL,
  ADD COLUMN IF NOT EXISTS factores_protectores_ia TEXT NULL,
  ADD COLUMN IF NOT EXISTS prediccion_arbol INTEGER NULL CHECK (prediccion_arbol IS NULL OR prediccion_arbol IN (0, 1)),
  ADD COLUMN IF NOT EXISTS sentimiento_texto_ia VARCHAR(30) NULL,
  ADD COLUMN IF NOT EXISTS confianza_texto_ia DOUBLE PRECISION NULL CHECK (
    confianza_texto_ia IS NULL OR confianza_texto_ia BETWEEN 0 AND 1
  ),
  ADD COLUMN IF NOT EXISTS confianza_global_ia DOUBLE PRECISION NULL CHECK (
    confianza_global_ia IS NULL OR confianza_global_ia BETWEEN 0 AND 1
  );

CREATE TABLE IF NOT EXISTS alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encuesta_id UUID NOT NULL,
  estudiante_id UUID NOT NULL,
  psicologo_asignado_id UUID NULL,
  puntaje_riesgo INTEGER NOT NULL CHECK (puntaje_riesgo BETWEEN 0 AND 100),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'evaluacion', 'cerrada')),
  mensaje_etico TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  ultima_actualizacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_alertas_encuesta
    FOREIGN KEY (encuesta_id)
    REFERENCES encuestas_emocionales (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_alertas_estudiante
    FOREIGN KEY (estudiante_id)
    REFERENCES estudiantes (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_alertas_psicologo
    FOREIGN KEY (psicologo_asignado_id)
    REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS seguimientos_alerta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alerta_id UUID NOT NULL,
  psicologo_id UUID NOT NULL,
  accion_global TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_seguimientos_alerta_alerta
    FOREIGN KEY (alerta_id)
    REFERENCES alertas (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_seguimientos_alerta_psicologo
    FOREIGN KEY (psicologo_id)
    REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS procesos_administrativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alerta_id UUID NOT NULL,
  administrativo_id UUID NOT NULL,
  accion_institucional TEXT NOT NULL,
  descripcion_inicial TEXT NOT NULL,
  responsable VARCHAR(140) NULL,
  fecha_objetivo TIMESTAMP WITHOUT TIME ZONE NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_procesos_administrativos_alerta
    FOREIGN KEY (alerta_id)
    REFERENCES alertas (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_procesos_administrativos_administrativo
    FOREIGN KEY (administrativo_id)
    REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS avances_procesos_administrativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_administrativo_id UUID NOT NULL,
  administrativo_id UUID NOT NULL,
  descripcion_avance TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('avance', 'resultado')),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_avances_procesos_administrativos_proceso
    FOREIGN KEY (proceso_administrativo_id)
    REFERENCES procesos_administrativos (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_avances_procesos_administrativos_administrativo
    FOREIGN KEY (administrativo_id)
    REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_usuarios_nombre_usuario
  ON usuarios (nombre_usuario);

CREATE INDEX IF NOT EXISTS idx_usuarios_rol
  ON usuarios (rol);

CREATE INDEX IF NOT EXISTS idx_estudiantes_codigo_anonimo
  ON estudiantes (codigo_anonimo);

CREATE INDEX IF NOT EXISTS idx_encuestas_estudiante_id
  ON encuestas_emocionales (estudiante_id);

CREATE INDEX IF NOT EXISTS idx_encuestas_fecha_creacion
  ON encuestas_emocionales (fecha_creacion DESC);

CREATE INDEX IF NOT EXISTS idx_encuestas_puntaje_riesgo
  ON encuestas_emocionales (puntaje_riesgo);

CREATE INDEX IF NOT EXISTS idx_encuestas_evaluacion_ia_disponible
  ON encuestas_emocionales (evaluacion_ia_disponible);

CREATE INDEX IF NOT EXISTS idx_encuestas_prioridad_atencion_ia
  ON encuestas_emocionales (prioridad_atencion_ia);

CREATE INDEX IF NOT EXISTS idx_alertas_estado
  ON alertas (estado);

CREATE INDEX IF NOT EXISTS idx_alertas_estudiante_id
  ON alertas (estudiante_id);

CREATE INDEX IF NOT EXISTS idx_alertas_psicologo_asignado_id
  ON alertas (psicologo_asignado_id);

CREATE INDEX IF NOT EXISTS idx_alertas_fecha_creacion
  ON alertas (fecha_creacion DESC);

CREATE INDEX IF NOT EXISTS idx_seguimientos_alerta_alerta_id
  ON seguimientos_alerta (alerta_id);

CREATE INDEX IF NOT EXISTS idx_procesos_administrativos_alerta_id
  ON procesos_administrativos (alerta_id);

CREATE INDEX IF NOT EXISTS idx_avances_procesos_administrativos_proceso_id
  ON avances_procesos_administrativos (proceso_administrativo_id);
