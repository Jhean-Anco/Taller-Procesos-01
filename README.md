# SafeSchool AI - Alertas tempranas anonimas

Aplicativo web para recibir reportes anonimos de estudiantes, analizarlos con IA local en Python y apoyar la revision psicologica e institucional sin registrar identidad estudiantil.

## Alcance PMV

- PMV 1: reporte anonimo, consentimiento, login interno, usuarios internos y control por rol.
- PMV 2: analisis emocional local, riesgo `LOW | MEDIUM | HIGH`, priorizacion y validacion humana.
- PMV 3: alertas tempranas, derivacion, dashboard agregado, actividades preventivas y auditoria.

## Estructura principal

```text
backend/src/modules/
  auth/
  users/
  reports/
  alerts/
  activities/
  dashboard/
  audit/
  shared/
ai-service/
frontend/
```

Cada modulo backend separa `domain`, `application` e `infrastructure`. El dominio no importa NestJS, TypeORM, HTTP ni clientes externos. TypeORM, controladores, JWT, bcrypt y el cliente Python viven en infraestructura.

## Variables de entorno

Backend (`backend/.env`):

```env
PORT=3000
APP_NAME=backend
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
JWT_SECRET=cambia_esta_clave_jwt
JWT_EXPIRES_IN=8h
SESSION_SECRET=cambia_esta_clave_sesion
DATABASE_ENABLED=true
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=safeschool_ai
DATABASE_SYNC=false
DATABASE_SSL=false
AI_SERVICE_URL=http://127.0.0.1:8000/analyze
AI_SERVICE_TIMEOUT_MS=7000
AI_SERVICE_REQUIRED=false
PUBLIC_REPORT_RATE_LIMIT_WINDOW_MS=60000
PUBLIC_REPORT_RATE_LIMIT_MAX=10
REPORT_AI_QUEUE_CONCURRENCY=2
REPORT_AI_QUEUE_TICK_MS=500
REPORT_AI_QUEUE_MAX_RETRIES=10
ANONYMITY_MIN_GROUP_SIZE=3
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_REPORT_REFRESH_MS=10000
```

## Ejecucion local

```powershell
createdb safeschool_ai
psql -d safeschool_ai -f backend\migrations\001_pmv_alertas_tempranas.sql
python -m venv .venv
.\.venv\Scripts\python -m pip install -r ai-service\requirements.txt
.\.venv\Scripts\python -m uvicorn services.app:app --host 127.0.0.1 --port 8000
npm --prefix backend install
npm --prefix backend run dev
npm --prefix frontend install
npm --prefix frontend run dev
```

Usuarios seed en modo memoria:

- `psicologo@agora.edu.pe` / `psicolog2024`
- `admin@agora.edu.pe` / `admin2024`

## Carga masiva manual

Para cargar 1000 reportes anonimos directamente en la base de datos, ejecuta:

```powershell
npm run seed:carga-masiva
```

Variables opcionales:

```powershell
$env:CARGA_TOTAL='1000'
```

El script inserta los reportes directo en PostgreSQL, retira cargas masivas previas y deja la IA pendiente. La carga incluye textos, grados, secciones, rangos de edad, formularios emocionales, fechas y estados variados en orden mezclado para evidenciar que la IA responde distinto al abrir cada detalle.
Al finalizar ejecuta `sp_validar_carga_reportes_masivos` y debe mostrar los reportes visibles para psicologia, sin analisis IA precalculados y pendientes de procesamiento.

Al levantar `npm run dev`, el entorno usa PostgreSQL por defecto, vacia los datos de la base de datos y conserva las tablas. Ejecuta `npm run seed:carga-masiva` despues de iniciar el entorno si quieres ver los 1000 datos de prueba en la aplicacion.

La IA se calcula cuando el usuario abre el detalle de un reporte en psicologia o administracion. Hasta ese momento el reporte queda como dato crudo.

Si el psicologo no ve reportes, reinicia el backend con `npm run dev:stop` y `npm run dev`, valida que `backend/.env` y `frontend/.env` apunten a la misma API/base de datos (`DATABASE_NAME=safeschool_ai` y `VITE_API_URL=http://localhost:3000/api/v1`) y vuelve a ejecutar la carga despues de iniciar el entorno.

## Procedimientos almacenados

La migracion `backend/migrations/001_pmv_alertas_tempranas.sql` consigna procedimientos y funciones almacenadas para reportes:

- `sp_limpiar_carga_reportes_masivos()` retira cargas masivas previas antes de sembrar nuevamente.
- `sp_validar_carga_reportes_masivos(expected_total)` valida total masivo, visibilidad para psicologia y que la IA quede pendiente.
- `sp_dashboard_resumen()` consolida reportes, alertas, actividades y estado IA.
- `sp_dashboard_estadisticas_riesgo(min_group_size)`, `sp_dashboard_estadisticas_emocion(min_group_size)`, `sp_dashboard_tendencia_reportes(min_group_size)` y `sp_dashboard_estadisticas_grado(min_group_size)` entregan agregados para dashboard con proteccion de anonimato.

## Endpoints PMV

- Publico: `POST /api/v1/anonymous-reports`
- Auth: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- Usuarios: `POST /api/v1/users`, `GET /api/v1/users`, `PATCH /api/v1/users/:id`, `PATCH /api/v1/users/:id/status`
- Psicologo: `GET /api/v1/psychologist/reports`, `GET /api/v1/psychologist/reports/:id`, `POST /api/v1/psychologist/reports/:id/review`, `PATCH /api/v1/psychologist/reports/:id/status`, `POST /api/v1/psychologist/reports/:id/derive`
- Alertas: `GET /api/v1/alerts`, `GET /api/v1/alerts/:id`, `PATCH /api/v1/alerts/:id/status`
- Admin/director: `GET /api/v1/dashboard/summary`, `GET /api/v1/dashboard/risk-statistics`, `GET /api/v1/dashboard/emotion-statistics`, `GET /api/v1/dashboard/alerts-statistics`, `POST /api/v1/preventive-activities`, `GET /api/v1/preventive-activities`, `PATCH /api/v1/preventive-activities/:id`, `PATCH /api/v1/preventive-activities/:id/status`, `GET /api/v1/audit-logs`

## Pruebas

```powershell
npm --prefix backend run build
npm --prefix backend run test
npm --prefix backend run test:e2e
npm --prefix frontend run build
```

## Privacidad y seguridad

- El formulario publico no solicita nombre, DNI, correo, telefono ni direccion.
- El endpoint publico no retorna riesgo ni analisis IA.
- El administrador trabaja con dashboard agregado y resumen no sensible.
- El psicologo puede ver texto original por necesidad de revision.
- Auditoria no guarda `message_text`, password ni observaciones internas completas.
- IA local: no se envia texto anonimo a APIs externas.
- El endpoint anonimo tiene rate limiting en memoria.

## Cobertura HU-01 a HU-24

HU-01 a HU-04 quedan cubiertas por `POST /anonymous-reports` y el frontend publico. HU-05 a HU-07 por `users`, `auth`, JWT y roles. HU-08 a HU-16 por `reports`, `PythonAiClientAdapter`, validacion psicologica y generacion de alertas. HU-17 a HU-19 por `alerts` y `psychologist/reports/*`. HU-20 a HU-24 por dashboard agregado, actividades preventivas y auditoria.

## Pendientes recomendados

- Sustituir el baseline de reglas por un modelo entrenado y evaluado con dataset institucional anonimo.
- Agregar cifrado de `message_text` con llave gestionada por entorno.
- Persistir rate limiting en Redis para produccion.
- Agregar migraciones TypeORM versionadas si se elimina el SQL manual.
