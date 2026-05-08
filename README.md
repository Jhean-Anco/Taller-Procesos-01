<<<<<<< HEAD
# taller-proyectos

SafeSchool AI es un sistema académico de alerta temprana de bullying con servicio local de IA, construido con arquitectura hexagonal en backend y frontend.

## Objetivo

Permitir reportes emocionales y de riesgo de forma completamente anónima, evaluar el riesgo con el servicio Python de IA, canalizar la primera recepción del caso al área de psicología y registrar la ejecución institucional de acciones por parte de alta directiva.

## Tecnologías

- Backend: NestJS
- Frontend: React + Vite
- Servicio IA: Python + FastAPI
- Base de datos: PostgreSQL
- ORM: TypeORM
- Estilos: Tailwind CSS
- Pruebas: Jest unitario

## Principios aplicados

- Arquitectura hexagonal al 100%
- Dominio limpio y aislado de frameworks
- Controladores sin lógica de negocio
- Persistencia detrás de puertos de salida
- Casos de uso detrás de puertos de entrada
- Monolito modular
- Servicio IA desacoplado como proceso local FastAPI
- Sin Docker
- Nombres de código, clases, funciones y archivos `.ts` en español

## Endpoints

- `POST /autenticacion/iniciar-sesion`
- `GET /autenticacion/perfil`
- `POST /encuestas`
- `GET /encuestas`
- `GET /alertas`
- `GET /alertas/:id`
- `PATCH /alertas/:id`
- `POST /alertas/:id/seguimientos`
- `GET /administracion/incidencias`
- `GET /administracion/incidencias/:id`
- `POST /administracion/incidencias/:id/procesos`
- `POST /administracion/incidencias/procesos/:procesoId/avances`
- `GET /dashboard`

## Servicio IA

El backend consume `services/app.py` en `http://127.0.0.1:8000`.

- `GET /`
- `POST /api/evaluar_alerta`

El servicio combina NLP con el modelo `modelo_arbol.pkl` y retorna nivel, puntaje, prioridad, recomendacion, factores detectados, factores protectores, confianza y detalle tecnico. Si el servicio IA no esta disponible, el backend aplica el calculo local existente como fallback controlado.

Se genera alerta cuando `puntaje_riesgo >= 40`.

## Modelo de datos

### Tabla `usuarios`

- `id`
- `nombre_usuario`
- `clave_hash`
- `rol`
- `activo`
- `fecha_creacion`

### Tabla `estudiantes`

- `id`
- `usuario_id`
- `codigo_anonimo`
- `fecha_creacion`

Nota:
- En el flujo actual esta tabla representa el sujeto técnico anónimo del reporte. No existe gestión manual de estudiantes ni cuentas estudiantiles.

### Tabla `encuestas_emocionales`

- `id`
- `estudiante_id`
- `texto_emocional`
- `nivel_animo`
- `nivel_seguridad`
- `puntaje_riesgo` calculado por IA o fallback local
- variables IA: `grado`, `zona_junin`, `recreo_solo`, `animo_manana`, `miedo_participar`, `redes_sociales`, `apoyo_familiar`, `rendimiento`, `habilidades_sociales`, `entorno_violento`
- resultado IA: `evaluacion_ia_disponible`, `nivel_riesgo_ia`, `prioridad_atencion_ia`, `analisis_psicologico_ia`, `accion_recomendada_ia`, `factores_detectados_ia`, `factores_protectores_ia`, `prediccion_arbol`, `sentimiento_texto_ia`, `confianza_texto_ia`, `confianza_global_ia`
- `fecha_creacion`

### Tabla `alertas`

- `id`
- `encuesta_id`
- `estudiante_id`
- `psicologo_asignado_id`
- `puntaje_riesgo`
- `estado`
- `mensaje_etico`
- `fecha_creacion`
- `ultima_actualizacion`

### Tabla `seguimientos_alerta`

- `id`
- `alerta_id`
- `psicologo_id`
- `accion_global`
- `descripcion`
- `fecha_creacion`

### Tabla `procesos_administrativos`

- `id`
- `alerta_id`
- `administrativo_id`
- `accion_institucional`
- `descripcion_inicial`
- `responsable`
- `fecha_objetivo`
- `estado`
- `fecha_creacion`
- `fecha_actualizacion`

### Tabla `avances_procesos_administrativos`

- `id`
- `proceso_administrativo_id`
- `administrativo_id`
- `descripcion_avance`
- `tipo`
- `estado`
- `fecha_creacion`

## Flujo operativo actual

- El reporte estudiantil es público y anónimo; no requiere cuenta.
- El backend envia los datos al servicio IA y registra el puntaje resultante.
- Psicología recibe primero las incidencias de riesgo y registra acciones globales de orientación.
- Alta directiva ve solo las incidencias anónimas derivadas por psicología, toma como base las acciones sugeridas, inicia acciones institucionales y luego registra avances o resultados sobre el mismo proceso.
- El historial de cada incidencia integra orientaciones psicológicas, inicio administrativo, avances y resultados posteriores.
- El dashboard administrativo se alimenta con KPIs de procesos iniciados, activos, completados, avances registrados y porcentaje de cumplimiento.
- El sistema no diagnostica bullying; orienta revisión humana preventiva.

## Configuración

### Backend

1. Copiar `backend/.env.ejemplo` a `backend/.env`
2. Ajustar credenciales PostgreSQL

Variables:

```env
PUERTO=3000
BASE_DATOS_HOST=localhost
BASE_DATOS_PUERTO=5432
BASE_DATOS_USUARIO=postgres
BASE_DATOS_CLAVE=postgres
BASE_DATOS_NOMBRE=safeschool_ai
BASE_DATOS_SINCRONIZAR=false
JWT_SECRETO=clave_super_segura_cambiar_en_produccion
JWT_EXPIRACION=1d
IA_SERVICIO_URL=http://127.0.0.1:8000
IA_SERVICIO_TIMEOUT_MS=7000
```

### Servicio IA

Requisito: Python 3.11+ instalado. Los scripts buscan Python en `PYTHON`, instalaciones locales de Windows y PATH.

Instalar dependencias:

```bash
npm run instalar:ia
```

Ejecutar el servicio:

```bash
npm run dev:ia
```

### Frontend

1. Copiar `frontend/.env.ejemplo` a `frontend/.env`
2. Ajustar URL del backend

```env
VITE_API_URL=http://localhost:3000
```

## SQL

Archivos principales:

1. [base-datos-postgresql.sql](D:\Proyectos-React\taller-procesos\base-datos-postgresql.sql)
   Crea toda la base desde cero con la estructura vigente.
2. [datos-semilla-postgresql.sql](D:\Proyectos-React\taller-procesos\datos-semilla-postgresql.sql)
   Inserta usuarios internos, reportes anónimos de ejemplo, alertas, seguimientos y procesos administrativos.
3. [limpieza-postgresql.sql](D:\Proyectos-React\taller-procesos\limpieza-postgresql.sql)
   Limpia las tablas operativas y reinicia secuencias para volver a sembrar en desarrollo.

Orden recomendado:

1. Ejecutar [base-datos-postgresql.sql](D:\Proyectos-React\taller-procesos\base-datos-postgresql.sql)
2. Ejecutar [datos-semilla-postgresql.sql](D:\Proyectos-React\taller-procesos\datos-semilla-postgresql.sql)

## Usuarios semilla

- `PSICOLOGO01 / clave123`
- `ADMIN01 / clave123`

## Ejecución

Terminal 1:

```bash
npm run dev:ia
```

Terminal 2:

```bash
npm run dev:backend
```

Terminal 3:

```bash
npm run dev:frontend
```

Tambien se puede levantar todo en paralelo:

```bash
npm run dev
```

## Validación

```bash
npm test
```

Casos cubiertos actualmente:

- iniciar sesión válido
- calcular riesgo bajo
- calcular riesgo medio
- calcular riesgo alto
- generar alerta cuando el riesgo supera el umbral
<<<<<<< HEAD
- bloquear proceso administrativo si psicologia aun no derivo la incidencia
- registrar proceso administrativo cuando ya existe seguimiento psicologico
=======

## Usuarios semilla

Credenciales iniciales disponibles en [datos-semilla-postgresql.sql](D:\Proyectos-React\taller-procesos\datos-semilla-postgresql.sql):

- `PSICOLOGO01 / clave123`
- `ADMIN01 / clave123`

Los reportes estudiantiles ahora son publicos y anonimos, sin cuenta.

## Scripts SQL unificados

Usa solo estos dos archivos:

1. [base-datos-postgresql.sql](D:\Proyectos-React\taller-procesos\base-datos-postgresql.sql)
   Crea la base completa desde cero con autenticación, reportes anónimos, alertas, seguimientos y procesos administrativos.
2. [datos-semilla-postgresql.sql](D:\Proyectos-React\taller-procesos\datos-semilla-postgresql.sql)
   Inserta usuarios, estudiantes técnicos anónimos, encuestas, alertas, seguimientos y procesos administrativos de prueba.
3. [limpieza-postgresql.sql](D:\Proyectos-React\taller-procesos\limpieza-postgresql.sql)
   Limpia las tablas operativas y reinicia secuencias para volver a sembrar en desarrollo.

## Flujo operativo actual

- El reporte estudiantil es público y anónimo; no requiere cuenta.
- Psicología recibe primero las incidencias de riesgo y registra acciones globales de orientación.
- Administración ve las incidencias anónimas, toma como base las acciones sugeridas por psicología, inicia acciones institucionales y luego registra avances o resultados sobre el mismo proceso.
- El historial de cada incidencia integra orientaciones psicológicas, inicio administrativo, avances y resultados posteriores.
- El dashboard administrativo se alimenta con KPIs de procesos iniciados, activos, completados, avances registrados y porcentaje de cumplimiento.
- El sistema no diagnostica bullying; orienta revisión humana preventiva.

## Estado actual del entregable

Se dejó implementado:

- Backend NestJS con arquitectura hexagonal
- Frontend React + Vite con arquitectura hexagonal
- Configuración TypeORM para PostgreSQL
- Tailwind CSS activo en frontend
- Endpoints de autenticación interna, psicología y administración
- Casos de uso, puertos y adaptadores
- Pruebas unitarias del cálculo de riesgo, autenticación y generación de alerta

## Nota operativa

Para validar compilación, ejecución y pruebas en este entorno hace falta instalar dependencias con `npm install` en `backend` y `frontend`. Si el entorno no tiene PostgreSQL local disponible, el backend no podrá conectarse hasta que se configure una instancia accesible.
=======
# Taller-Procesos-01
>>>>>>> 863922cbcd111a3017c42c50aab51d40d8bf0f74
>>>>>>> e0eea8016864828a41c20f70502c5d1e8d13e17a
