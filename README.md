# taller-proyectos

SafeSchool AI es un sistema académico de alerta temprana de bullying en versión sin IA. El proyecto está construido como monolito modular con arquitectura hexagonal estricta tanto en backend como en frontend.

## Objetivo

Permitir reportes emocionales y de riesgo de forma completamente anónima, calcular un puntaje de riesgo con reglas determinísticas, canalizar la primera recepción del caso al área de psicología y registrar la ejecución institucional de acciones por parte del área administrativa.

## Tecnologías

- Backend: NestJS
- Frontend: React + Vite
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
- Sin IA, sin Docker, sin microservicios
- Nombres de código, clases, funciones y archivos `.ts` en español

## Estructura

```text
taller-proyectos/
├── backend/
│   ├── src/
│   │   ├── dominio/
│   │   ├── aplicacion/
│   │   ├── adaptadores/
│   │   ├── configuracion/
│   │   ├── aplicacion.modulo.ts
│   │   └── principal.ts
│   └── .env.ejemplo
├── frontend/
│   ├── src/
│   │   ├── dominio/
│   │   ├── aplicacion/
│   │   ├── adaptadores/
│   │   ├── aplicacion.tsx
│   │   └── principal.tsx
│   └── .env.ejemplo
└── package.json
```

## Arquitectura hexagonal

### Backend

- `dominio/`
  - Entidades y objetos de valor puros.
  - Servicio de dominio `CalculadorRiesgoServicio`.
- `aplicacion/`
  - Casos de uso que orquestan el flujo.
  - Puertos de entrada para lo que consume HTTP.
  - Puertos de salida para persistencia.
- `adaptadores/entrada/http/`
  - Controladores Nest que traducen HTTP a casos de uso.
- `adaptadores/salida/persistencia/typeorm/`
  - Implementaciones concretas de repositorios TypeORM.
  - Entidades ORM y mapeadores.
- `configuracion/`
  - Módulo de inyección y configuración de base de datos.

### Frontend

- `dominio/`
  - Entidades que representan el modelo de la interfaz.
- `aplicacion/`
  - Casos de uso del cliente.
  - Puerto de salida `ClienteApiPuerto`.
- `adaptadores/salida/api/`
  - Implementación HTTP real con `fetch`.
- `adaptadores/entrada/`
  - Contenedor React y páginas de interfaz.

## Regla de riesgo sin IA

El cálculo usa reglas determinísticas:

- `nivelAnimo <= 2`: aumenta 25 puntos
- `nivelAnimo == 3`: aumenta 10 puntos
- `nivelSeguridad <= 2`: aumenta 30 puntos
- `nivelSeguridad == 3`: aumenta 15 puntos
- Palabras críticas detectadas:
  - `miedo`
  - `triste`
  - `solo`
  - `insultos`
  - `golpes`
  - `amenaza`
- Cada palabra crítica suma 15 puntos, con tope de 45 por texto
- El puntaje final se normaliza entre 0 y 100
- Se genera alerta cuando `riesgo >= 40`

Niveles:

- `0-39`: bajo
- `40-69`: medio
- `70-100`: alto

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

## Modelo de datos

### Tabla `estudiantes`

- `id`
- `usuario_id`
- `codigo_anonimo`
- `fecha_creacion`

### Tabla `encuestas_emocionales`

- `id`
- `estudiante_id`
- `texto_emocional`
- `nivel_animo`
- `nivel_seguridad`
- `puntaje_riesgo`
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

### Tabla `usuarios`

- `id`
- `nombre_usuario`
- `clave_hash`
- `rol`
- `activo`
- `fecha_creacion`

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
JWT_SECRETO=clave_super_segura_cambiar_en_produccion
JWT_EXPIRACION=1d
```

### Frontend

1. Copiar `frontend/.env.ejemplo` a `frontend/.env`
2. Ajustar URL del backend

```env
VITE_API_URL=http://localhost:3000
```

## Instalación

Desde la raíz:

```bash
npm run instalar:todo
```

## Ejecución

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

## Pruebas

```bash
npm test
```

Casos incluidos:

- iniciar sesion valido
- calcular riesgo bajo
- calcular riesgo medio
- calcular riesgo alto
- generar alerta cuando el riesgo supera el umbral

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
