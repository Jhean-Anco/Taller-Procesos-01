-- SafeSchool AI
-- Datos semilla para PostgreSQL
-- Ejecutar despues de base-datos-postgresql.sql

\c safeschool_ai;

INSERT INTO usuarios (id, nombre_usuario, clave_hash, rol, activo, fecha_creacion)
VALUES
  (
    '90000000-0000-0000-0000-000000000001',
    'PSICOLOGO01',
    '$2b$10$p.gVOIBmVzDWhXJmdupxWeOau/m8p4t.IFGYdfbVuPs.aqDMYVf1C',
    'psicologo',
    TRUE,
    NOW() - INTERVAL '7 days'
  ),
  (
    '90000000-0000-0000-0000-000000000002',
    'ADMIN01',
    '$2b$10$p.gVOIBmVzDWhXJmdupxWeOau/m8p4t.IFGYdfbVuPs.aqDMYVf1C',
    'administrativo',
    TRUE,
    NOW() - INTERVAL '7 days'
  )
ON CONFLICT (nombre_usuario) DO NOTHING;

INSERT INTO estudiantes (id, usuario_id, codigo_anonimo, fecha_creacion)
VALUES
  ('11111111-1111-1111-1111-111111111111', NULL, 'REP-SEM-001', NOW() - INTERVAL '5 days'),
  ('22222222-2222-2222-2222-222222222222', NULL, 'REP-SEM-002', NOW() - INTERVAL '4 days'),
  ('33333333-3333-3333-3333-333333333333', NULL, 'REP-SEM-003', NOW() - INTERVAL '3 days'),
  ('44444444-4444-4444-4444-444444444444', NULL, 'REP-SEM-004', NOW() - INTERVAL '2 days')
ON CONFLICT (codigo_anonimo) DO NOTHING;

INSERT INTO encuestas_emocionales (
  id,
  estudiante_id,
  texto_emocional,
  nivel_animo,
  nivel_seguridad,
  puntaje_riesgo,
  grado,
  zona_junin,
  recreo_solo,
  animo_manana,
  miedo_participar,
  redes_sociales,
  apoyo_familiar,
  rendimiento,
  habilidades_sociales,
  entorno_violento,
  evaluacion_ia_disponible,
  nivel_riesgo_ia,
  prioridad_atencion_ia,
  analisis_psicologico_ia,
  accion_recomendada_ia,
  factores_detectados_ia,
  factores_protectores_ia,
  prediccion_arbol,
  sentimiento_texto_ia,
  confianza_texto_ia,
  confianza_global_ia,
  fecha_creacion
)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'Hoy me siento tranquilo y acompanado en clases',
    5,
    5,
    20,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    TRUE,
    'BAJO RIESGO',
    'monitoreo',
    'Estable. Mantener monitoreo.',
    'Mantener monitoreo preventivo sin generar alarma institucional.',
    '[]',
    '["apoyo familiar disponible","habilidades sociales adecuadas"]',
    0,
    'POS',
    0.910000,
    0.570000,
    NOW() - INTERVAL '4 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '22222222-2222-2222-2222-222222222222',
    'A veces me siento triste y algo inseguro cuando salgo al recreo',
    3,
    3,
    75,
    1,
    1,
    1,
    0,
    1,
    0,
    1,
    1,
    0,
    0,
    TRUE,
    'ALTO RIESGO',
    'alta',
    'Alerta psicologica. Se detecto patron de riesgo numerico o texto agresivo/depresivo.',
    'Asignar revision psicologica prioritaria y preparar seguimiento institucional.',
    '["aislamiento durante recreo","miedo de participar","rendimiento afectado"]',
    '["apoyo familiar disponible"]',
    0,
    'NEG',
    0.940000,
    0.820000,
    NOW() - INTERVAL '3 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '33333333-3333-3333-3333-333333333333',
    'Tengo miedo porque recibo insultos y me siento solo',
    2,
    2,
    95,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    1,
    0,
    1,
    TRUE,
    'RIESGO CRITICO',
    'inmediata',
    'Alerta psicologica. Se detecto patron de riesgo numerico y texto agresivo/depresivo.',
    'Derivar hoy a psicologia y activar revision institucional preventiva.',
    '["patron conductual compatible con alerta","relato con carga emocional negativa","aislamiento durante recreo","animo bajo al iniciar el dia","miedo de participar","bajo apoyo familiar percibido","rendimiento afectado","habilidades sociales limitadas","exposicion a entorno violento"]',
    '[]',
    1,
    'NEG',
    0.970000,
    0.980000,
    NOW() - INTERVAL '2 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    '44444444-4444-4444-4444-444444444444',
    'Me preocupa una amenaza y tambien he visto golpes cerca de mi salon',
    2,
    1,
    100,
    1,
    0,
    1,
    1,
    1,
    0,
    0,
    1,
    0,
    1,
    TRUE,
    'RIESGO CRITICO',
    'inmediata',
    'Alerta psicologica. Se detecto patron de riesgo numerico y texto agresivo/depresivo.',
    'Derivar hoy a psicologia y activar revision institucional preventiva.',
    '["patron conductual compatible con alerta","relato con carga emocional negativa","aislamiento durante recreo","animo bajo al iniciar el dia","miedo de participar","bajo apoyo familiar percibido","rendimiento afectado","habilidades sociales limitadas","exposicion a entorno violento"]',
    '[]',
    1,
    'NEG',
    0.980000,
    0.990000,
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO UPDATE SET
  estudiante_id = EXCLUDED.estudiante_id,
  texto_emocional = EXCLUDED.texto_emocional,
  nivel_animo = EXCLUDED.nivel_animo,
  nivel_seguridad = EXCLUDED.nivel_seguridad,
  puntaje_riesgo = EXCLUDED.puntaje_riesgo,
  grado = EXCLUDED.grado,
  zona_junin = EXCLUDED.zona_junin,
  recreo_solo = EXCLUDED.recreo_solo,
  animo_manana = EXCLUDED.animo_manana,
  miedo_participar = EXCLUDED.miedo_participar,
  redes_sociales = EXCLUDED.redes_sociales,
  apoyo_familiar = EXCLUDED.apoyo_familiar,
  rendimiento = EXCLUDED.rendimiento,
  habilidades_sociales = EXCLUDED.habilidades_sociales,
  entorno_violento = EXCLUDED.entorno_violento,
  evaluacion_ia_disponible = EXCLUDED.evaluacion_ia_disponible,
  nivel_riesgo_ia = EXCLUDED.nivel_riesgo_ia,
  prioridad_atencion_ia = EXCLUDED.prioridad_atencion_ia,
  analisis_psicologico_ia = EXCLUDED.analisis_psicologico_ia,
  accion_recomendada_ia = EXCLUDED.accion_recomendada_ia,
  factores_detectados_ia = EXCLUDED.factores_detectados_ia,
  factores_protectores_ia = EXCLUDED.factores_protectores_ia,
  prediccion_arbol = EXCLUDED.prediccion_arbol,
  sentimiento_texto_ia = EXCLUDED.sentimiento_texto_ia,
  confianza_texto_ia = EXCLUDED.confianza_texto_ia,
  confianza_global_ia = EXCLUDED.confianza_global_ia,
  fecha_creacion = EXCLUDED.fecha_creacion;

INSERT INTO alertas (
  id,
  encuesta_id,
  estudiante_id,
  psicologo_asignado_id,
  puntaje_riesgo,
  estado,
  mensaje_etico,
  fecha_creacion,
  ultima_actualizacion
)
VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '22222222-2222-2222-2222-222222222222',
    '90000000-0000-0000-0000-000000000001',
    75,
    'evaluacion',
    'Este sistema no emite diagnosticos. La alerta solo orienta una revision humana. IA ALTO RIESGO: Alerta psicologica. Se detecto patron de riesgo numerico o texto agresivo/depresivo. Detalle tecnico: arbol=0, sentimiento=NEG.',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '33333333-3333-3333-3333-333333333333',
    '90000000-0000-0000-0000-000000000001',
    95,
    'evaluacion',
    'Este sistema no emite diagnosticos. La alerta solo orienta una revision humana. IA ALTO RIESGO: Alerta psicologica. Se detecto patron de riesgo numerico y texto agresivo/depresivo. Detalle tecnico: arbol=1, sentimiento=NEG.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    '44444444-4444-4444-4444-444444444444',
    '90000000-0000-0000-0000-000000000001',
    100,
    'cerrada',
    'Este sistema no emite diagnosticos. La alerta solo orienta una revision humana. IA ALTO RIESGO: Alerta psicologica. Se detecto patron de riesgo numerico y texto agresivo/depresivo. Detalle tecnico: arbol=1, sentimiento=NEG.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO UPDATE SET
  encuesta_id = EXCLUDED.encuesta_id,
  estudiante_id = EXCLUDED.estudiante_id,
  psicologo_asignado_id = EXCLUDED.psicologo_asignado_id,
  puntaje_riesgo = EXCLUDED.puntaje_riesgo,
  estado = EXCLUDED.estado,
  mensaje_etico = EXCLUDED.mensaje_etico,
  fecha_creacion = EXCLUDED.fecha_creacion,
  ultima_actualizacion = EXCLUDED.ultima_actualizacion;

INSERT INTO seguimientos_alerta (
  id,
  alerta_id,
  psicologo_id,
  accion_global,
  descripcion,
  fecha_creacion
)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    '90000000-0000-0000-0000-000000000001',
    'Refuerzo de vigilancia en recreo',
    'Se recomienda observacion preventiva y coordinacion institucional general.',
    NOW() - INTERVAL '2 days'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc2',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    '90000000-0000-0000-0000-000000000001',
    'Entrevistas de contencion',
    'Se plantea seguimiento profesional y monitoreo del entorno escolar.',
    NOW() - INTERVAL '1 day'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc3',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    '90000000-0000-0000-0000-000000000001',
    'Cierre con medidas preventivas',
    'Se deja constancia de acciones institucionales ejecutadas y observacion posterior sin nuevos reportes.',
    NOW() - INTERVAL '18 hours'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO procesos_administrativos (
  id,
  alerta_id,
  administrativo_id,
  accion_institucional,
  descripcion_inicial,
  responsable,
  fecha_objetivo,
  estado,
  fecha_creacion,
  fecha_actualizacion
)
VALUES
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    '90000000-0000-0000-0000-000000000002',
    'Refuerzo de supervision en recreos',
    'Se coordino con tutoria y vigilancia una mayor supervision institucional en zonas de riesgo.',
    'Direccion de convivencia',
    NOW() + INTERVAL '3 days',
    'en_proceso',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '8 hours'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    '90000000-0000-0000-0000-000000000002',
    'Jornada institucional de convivencia',
    'Se programo una intervencion preventiva con docentes y equipo de convivencia para toda la comunidad escolar.',
    'Direccion academica',
    NOW() + INTERVAL '5 days',
    'pendiente',
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '12 hours'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd3',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    '90000000-0000-0000-0000-000000000002',
    'Activacion de protocolo de convivencia',
    'Alta directiva documento medidas institucionales, coordinacion con tutoria y cierre preventivo del caso anonimo.',
    'Alta directiva',
    NOW() - INTERVAL '6 hours',
    'completado',
    NOW() - INTERVAL '16 hours',
    NOW() - INTERVAL '4 hours'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO avances_procesos_administrativos (
  id,
  proceso_administrativo_id,
  administrativo_id,
  descripcion_avance,
  tipo,
  estado,
  fecha_creacion
)
VALUES
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    '90000000-0000-0000-0000-000000000002',
    'Se realizo la reunion inicial con tutores y personal de patio para redistribuir zonas de supervision.',
    'avance',
    'en_proceso',
    NOW() - INTERVAL '18 hours'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    '90000000-0000-0000-0000-000000000002',
    'Durante dos recreos consecutivos no se reportaron nuevas incidencias en la zona observada; se mantiene seguimiento.',
    'resultado',
    'en_proceso',
    NOW() - INTERVAL '6 hours'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3',
    'dddddddd-dddd-dddd-dddd-ddddddddddd3',
    '90000000-0000-0000-0000-000000000002',
    'Se cerro el proceso con registro de medidas preventivas y comunicacion interna a tutoria.',
    'resultado',
    'completado',
    NOW() - INTERVAL '4 hours'
  )
ON CONFLICT (id) DO NOTHING;
