-- SafeSchool AI
-- Limpieza rapida para entorno de desarrollo
-- Ejecutar sobre una base ya creada

\c safeschool_ai;

TRUNCATE TABLE
  avances_procesos_administrativos,
  procesos_administrativos,
  seguimientos_alerta,
  alertas,
  encuestas_emocionales,
  estudiantes,
  usuarios
RESTART IDENTITY CASCADE;
