# Plan Tecnico de Autenticacion y Perfiles

Proyecto: `taller-proyectos`  
Sistema: `SafeSchool AI - version sin IA`

## Objetivo

Extender el sistema actual para soportar autenticacion y autorizacion por perfiles, manteniendo arquitectura hexagonal estricta en backend y frontend.

Perfiles requeridos:

- `estudiante_anonimo`
- `psicologo`
- `administrativo`

## Decision de arquitectura

El estudiante no puede ser anonimo absoluto si necesita iniciar sesion.  
La solucion correcta es usar identidad **seudonima**:

- el sistema autentica con un usuario tecnico
- el estudiante opera con codigo anonimo
- no se expone nombre real en los flujos de negocio

## Estado actual impactado

El cambio afecta:

- base de datos PostgreSQL
- dominio backend
- aplicacion backend
- adaptadores HTTP backend
- persistencia TypeORM backend
- seguridad NestJS
- frontend React
- navegacion y sesion
- semillas SQL
- README

---

## 1. Cambios de base de datos

### 1.1 Nuevas tablas

#### `usuarios`

Campos:

- `id UUID PRIMARY KEY`
- `nombre_usuario VARCHAR(60) UNIQUE NOT NULL`
- `clave_hash VARCHAR(255) NOT NULL`
- `rol VARCHAR(30) NOT NULL`
- `activo BOOLEAN NOT NULL DEFAULT TRUE`
- `fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()`

Restriccion:

- `rol IN ('estudiante_anonimo', 'psicologo', 'administrativo')`

#### `sesiones`

Si se implementa refresh token persistido:

- `id UUID PRIMARY KEY`
- `usuario_id UUID NOT NULL`
- `refresh_token_hash VARCHAR(255) NOT NULL`
- `fecha_expiracion TIMESTAMP NOT NULL`
- `revocada BOOLEAN NOT NULL DEFAULT FALSE`
- `fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()`

Si se implementa JWT simple sin refresh token, esta tabla se puede omitir en fase 1.

#### `seguimientos_alerta`

- `id UUID PRIMARY KEY`
- `alerta_id UUID NOT NULL`
- `psicologo_id UUID NOT NULL`
- `accion_global TEXT NOT NULL`
- `descripcion TEXT NOT NULL`
- `fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()`

### 1.2 Cambios a tablas existentes

#### `estudiantes`

Agregar:

- `usuario_id UUID NOT NULL UNIQUE`

Relacion:

- `FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`

#### `alertas`

Agregar:

- `psicologo_asignado_id UUID NULL`
- `ultima_actualizacion TIMESTAMP NOT NULL DEFAULT NOW()`

Relacion:

- `FOREIGN KEY (psicologo_asignado_id) REFERENCES usuarios(id)`

### 1.3 Indices nuevos

- `idx_usuarios_nombre_usuario`
- `idx_usuarios_rol`
- `idx_seguimientos_alerta_alerta_id`
- `idx_alertas_psicologo_asignado_id`

---

## 2. Cambios de dominio backend

Crear nuevo modulo transversal de seguridad y acceso.

### 2.1 Nuevas entidades

Ruta sugerida:

`backend/src/dominio/entidades/`

Archivos nuevos:

- `usuario.entidad.ts`
- `sesion.entidad.ts`
- `seguimiento-alerta.entidad.ts`

### 2.2 Nuevos objetos de valor

Ruta:

`backend/src/dominio/objetos-valor/`

Archivos nuevos:

- `rol-usuario.vo.ts`
- `nombre-usuario.vo.ts`
- `clave-hash.vo.ts`

### 2.3 Nuevos servicios de dominio

Ruta:

`backend/src/dominio/servicios/`

Archivos nuevos:

- `autenticador-usuario.servicio.ts`
- `autorizador-usuario.servicio.ts`

Responsabilidades:

- validar reglas de rol
- validar si un usuario activo puede operar
- encapsular decisiones de acceso del dominio

### 2.4 Entidades existentes a modificar

#### `estudiante.entidad.ts`

Agregar:

- `usuarioId: string`

#### `alerta.entidad.ts`

Agregar:

- `psicologoAsignadoId: string | null`
- `ultimaActualizacion: Date`

#### Nueva posibilidad

Si quieres mayor trazabilidad profesional:

- no guardar acciones del psicologo dentro de `alerta`
- usar `seguimiento-alerta.entidad.ts` como agregado separado

---

## 3. Cambios de aplicacion backend

### 3.1 Nuevos DTO

Ruta:

`backend/src/aplicacion/dto/`

Archivos nuevos:

- `iniciar-sesion.dto.ts`
- `respuesta-sesion.dto.ts`
- `registrar-seguimiento-alerta.dto.ts`
- `crear-usuario.dto.ts` si vas a gestionar usuarios desde el sistema

### 3.2 Nuevos puertos de entrada

Ruta:

`backend/src/aplicacion/puertos/entrada/`

Archivos nuevos:

- `iniciar-sesion.caso-uso.ts`
- `cerrar-sesion.caso-uso.ts`
- `obtener-perfil-actual.caso-uso.ts`
- `registrar-seguimiento-alerta.caso-uso.ts`
- `obtener-panel-psicologo.caso-uso.ts`
- `obtener-panel-administrativo.caso-uso.ts`

### 3.3 Nuevos puertos de salida

Ruta:

`backend/src/aplicacion/puertos/salida/`

Archivos nuevos:

- `repositorio-usuario.puerto.ts`
- `repositorio-sesion.puerto.ts`
- `repositorio-seguimiento-alerta.puerto.ts`
- `cifrador-clave.puerto.ts`
- `emisor-token.puerto.ts`

### 3.4 Nuevos casos de uso

Ruta:

`backend/src/aplicacion/casos-uso/`

Archivos nuevos:

- `iniciar-sesion.servicio.ts`
- `cerrar-sesion.servicio.ts`
- `obtener-perfil-actual.servicio.ts`
- `registrar-seguimiento-alerta.servicio.ts`
- `panel-psicologo.servicio.ts`
- `panel-administrativo.servicio.ts`

### 3.5 Casos de uso existentes a modificar

#### `registrar-estudiante.servicio.ts`

Cambios:

- crear simultaneamente `usuario` y `estudiante`
- o exigir que el usuario ya exista y vincularlo

Recomendacion:

- el alta del estudiante cree su cuenta seudonima automaticamente

#### `registrar-encuesta.servicio.ts`

Cambios:

- no recibir libremente `estudianteId` desde frontend
- obtener estudiante desde el usuario autenticado
- validar que el rol sea `estudiante_anonimo`

Esto elimina un riesgo actual de suplantacion por id.

#### `alerta.servicio.ts`

Cambios:

- solo `psicologo` puede cambiar estado
- permitir asignacion a psicologo
- permitir recuperar seguimientos

#### `panel.servicio.ts`

Decision:

- dejarlo para administrativo
- crear servicio separado para psicologo

Recomendacion:

- `panel.servicio.ts` debe convertirse en panel administrativo
- crear `panel-psicologo.servicio.ts`

---

## 4. Cambios de adaptadores backend

### 4.1 Entrada HTTP

Ruta nueva o extendida:

`backend/src/adaptadores/entrada/http/`

Archivos nuevos:

- `controladores/autenticacion.controlador.ts`
- `controladores/panel-psicologo.controlador.ts`
- `controladores/panel-administrativo.controlador.ts`
- `decoradores/usuario-actual.decorador.ts`
- `decoradores/roles.decorador.ts`
- `guardias/jwt.guard.ts`
- `guardias/roles.guard.ts`

### 4.2 Endpoints nuevos

#### Autenticacion

- `POST /autenticacion/iniciar-sesion`
- `POST /autenticacion/cerrar-sesion`
- `GET /autenticacion/perfil`

#### Psicologo

- `GET /panel-psicologo`
- `GET /alertas`
- `PATCH /alertas/:id`
- `POST /alertas/:id/seguimientos`
- `GET /alertas/:id/seguimientos`

#### Administrativo

- `GET /dashboard`
- `GET /estadisticas/alertas`
- `GET /estadisticas/riesgo`

#### Estudiante anonimo

- `POST /encuestas`
- `GET /mis-encuestas` opcional

### 4.3 Restricciones de acceso

#### `estudiante_anonimo`

- puede iniciar sesion
- puede registrar encuesta
- no puede listar alertas
- no puede ver estadisticas globales

#### `psicologo`

- puede listar y actualizar alertas
- puede registrar seguimientos
- puede ver textos emocionales anonimizados

#### `administrativo`

- puede ver dashboard y agregados
- no debe actualizar alertas clinicas
- no debe ver detalles sensibles innecesarios

### 4.4 Adaptadores de salida

Ruta:

`backend/src/adaptadores/salida/persistencia/typeorm/`

Archivos nuevos:

- `entidades/usuario.orm-entidad.ts`
- `entidades/sesion.orm-entidad.ts`
- `entidades/seguimiento-alerta.orm-entidad.ts`
- `mapeadores/usuario.mapeador.ts`
- `mapeadores/sesion.mapeador.ts`
- `mapeadores/seguimiento-alerta.mapeador.ts`
- `repositorios/repositorio-usuario.typeorm.ts`
- `repositorios/repositorio-sesion.typeorm.ts`
- `repositorios/repositorio-seguimiento-alerta.typeorm.ts`

### 4.5 Adaptadores de seguridad

Ruta sugerida:

`backend/src/adaptadores/salida/seguridad/`

Archivos nuevos:

- `bcrypt-cifrador-clave.adaptador.ts`
- `jwt-emisor-token.adaptador.ts`

Dependencias nuevas:

- `@nestjs/jwt`
- `@nestjs/passport`
- `passport`
- `passport-jwt`
- `bcrypt`
- `@types/bcrypt`

---

## 5. Cambios de configuracion backend

### 5.1 Archivos a modificar

- `backend/src/configuracion/inyeccion-dependencias.modulo.ts`
- `backend/src/aplicacion.modulo.ts`
- `backend/src/configuracion/base-datos.config.ts`
- `backend/.env.ejemplo`

### 5.2 Variables nuevas

Agregar a `.env`:

- `JWT_SECRETO`
- `JWT_EXPIRACION`
- `JWT_REFRESH_EXPIRACION` si se implementa refresh token

Ejemplo:

```env
JWT_SECRETO=clave_super_segura
JWT_EXPIRACION=1d
JWT_REFRESH_EXPIRACION=7d
```

---

## 6. Cambios de frontend

## 6.1 Nuevas entidades de dominio

Ruta:

`frontend/src/dominio/entidades/`

Archivos nuevos:

- `usuario-autenticado.entidad.ts`
- `sesion.entidad.ts`
- `seguimiento-alerta.entidad.ts`
- `panel-psicologo.entidad.ts`
- `panel-administrativo.entidad.ts`

### 6.2 Nuevos DTO frontend

Ruta:

`frontend/src/aplicacion/dto/`

Archivos nuevos:

- `iniciar-sesion.dto.ts`
- `registrar-seguimiento-alerta.dto.ts`

### 6.3 Nuevos puertos de salida frontend

Ruta:

`frontend/src/aplicacion/puertos/salida/`

Archivos nuevos:

- `cliente-autenticacion.puerto.ts`
- `almacen-sesion.puerto.ts`

### 6.4 Nuevos casos de uso frontend

Ruta:

`frontend/src/aplicacion/casos-uso/`

Archivos nuevos:

- `iniciar-sesion.servicio.ts`
- `cerrar-sesion.servicio.ts`
- `obtener-sesion-actual.servicio.ts`
- `registrar-seguimiento-alerta.servicio.ts`
- `obtener-panel-psicologo.servicio.ts`
- `obtener-panel-administrativo.servicio.ts`

### 6.5 Nuevos adaptadores de salida frontend

Ruta:

`frontend/src/adaptadores/salida/`

Archivos nuevos:

- `api/autenticacion-api.ts`
- `api/psicologo-api.ts`
- `api/administrativo-api.ts`
- `almacenamiento/sesion-local.ts`

### 6.6 Nuevos adaptadores de entrada frontend

Ruta:

`frontend/src/adaptadores/entrada/`

Archivos nuevos:

- `paginas/inicio-sesion.pagina.tsx`
- `paginas/panel-psicologo.pagina.tsx`
- `paginas/panel-administrativo.pagina.tsx`
- `paginas/seguimiento-alerta.pagina.tsx`

Archivos a modificar:

- `contenedor-aplicacion.tsx`
- `componentes/barra-navegacion.tsx`

---

## 7. Rediseño de navegacion frontend

### 7.1 Flujo objetivo

Si no hay sesion:

- mostrar solo login

Si hay sesion `estudiante_anonimo`:

- mostrar encuesta
- mostrar etica
- opcionalmente mostrar historial propio

Si hay sesion `psicologo`:

- mostrar panel psicologo
- mostrar alertas
- mostrar seguimientos

Si hay sesion `administrativo`:

- mostrar panel administrativo
- mostrar estadisticas
- mostrar etica institucional

### 7.2 Cambio importante de seguridad

Actualmente el frontend envia `estudianteId` al registrar encuesta.  
Eso debe eliminarse.

Nuevo flujo:

- el usuario inicia sesion
- el backend resuelve el estudiante asociado
- el frontend no envia ids sensibles del estudiante

---

## 8. Politicas de visibilidad de datos

### `estudiante_anonimo`

Puede ver:

- su propia experiencia
- mensajes eticos

No puede ver:

- otras encuestas
- alertas globales
- estadisticas institucionales

### `psicologo`

Puede ver:

- todas las alertas
- textos emocionales anonimizados
- estado y severidad
- seguimientos

No necesita ver:

- nombres reales
- datos personales directos

### `administrativo`

Puede ver:

- totales
- tendencias
- distribuciones
- metricas por estado

No debe ver por defecto:

- textos emocionales completos
- comentarios profesionales sensibles

---

## 9. Cambios de pruebas backend

Agregar pruebas para:

- login valido
- login invalido
- rol estudiante puede registrar encuesta
- rol psicologo puede listar alertas
- rol administrativo no puede cambiar estado de alerta
- creacion de seguimiento de alerta
- denegacion de acceso sin token

Archivos sugeridos:

- `iniciar-sesion.servicio.spec.ts`
- `autorizacion.servicio.spec.ts`
- `registrar-seguimiento-alerta.servicio.spec.ts`

---

## 10. Cambios de pruebas frontend

Agregar pruebas si luego incorporas Vitest:

- render de login
- flujo de sesion persistida
- menu por rol
- cierre de sesion
- bloqueo visual de modulos no autorizados

No es obligatorio en la primera fase si quieres concentrarte en backend, pero es recomendable.

---

## 11. Cambios de SQL raiz

Archivos a actualizar o crear:

- `base-datos-postgresql.sql`
- `datos-semilla-postgresql.sql`
- `migracion-autenticacion-perfiles.sql` recomendado

### Semillas nuevas

Crear usuarios iniciales:

- `psicologo01`
- `admin01`
- `EST-001`
- `EST-002`

Con hash de clave y rol correspondiente.

Relacionar:

- `EST-001` con estudiante `EST-001`
- `EST-002` con estudiante `EST-002`

---

## 12. Cambios de README

Actualizar:

- arquitectura hexagonal con modulo autenticacion
- instrucciones de login
- perfiles y permisos
- variables JWT
- endpoints protegidos
- nuevas semillas

---

## 13. Orden de implementacion recomendado

### Fase 1. Base de autenticacion

1. Crear tablas `usuarios` y relacion con `estudiantes`
2. Crear entidades de dominio y ORM
3. Implementar `repositorio-usuario`
4. Implementar `cifrador-clave` con bcrypt
5. Implementar `emisor-token` con JWT
6. Crear login y perfil actual

### Fase 2. Seguridad sobre casos de uso existentes

1. Proteger endpoints con guardias
2. Restringir `POST /encuestas` a estudiante
3. Restringir `GET /alertas` y `PATCH /alertas/:id` a psicologo
4. Restringir `GET /dashboard` a administrativo

### Fase 3. Seguimiento profesional

1. Crear tabla `seguimientos_alerta`
2. Implementar entidad y repositorio
3. Crear caso de uso de seguimiento
4. Exponer endpoints de seguimiento

### Fase 4. Frontend autenticado

1. Crear pagina de login
2. Persistir sesion
3. Renderizar menu por rol
4. Reorganizar vistas por perfil

### Fase 5. Documentacion y semillas

1. SQL de migracion
2. nuevas semillas
3. README
4. pruebas finales

---

## 14. Propuesta concreta de endpoints finales

### Autenticacion

- `POST /autenticacion/iniciar-sesion`
- `POST /autenticacion/cerrar-sesion`
- `GET /autenticacion/perfil`

### Estudiante anonimo

- `POST /encuestas`
- `GET /mis-encuestas`
- `GET /mi-panel`

### Psicologo

- `GET /panel-psicologo`
- `GET /alertas`
- `PATCH /alertas/:id`
- `GET /alertas/:id/seguimientos`
- `POST /alertas/:id/seguimientos`

### Administrativo

- `GET /dashboard`
- `GET /estadisticas/alertas`
- `GET /estadisticas/riesgo`

---

## 15. Riesgos tecnicos actuales que este cambio corrige

- hoy cualquiera podria registrar encuesta con cualquier `estudianteId`
- no existe restriccion de acceso por rol
- el dashboard no diferencia publico objetivo
- no existe trazabilidad profesional del psicologo
- no existe sesion ni control de identidad tecnica

---

## 16. Recomendacion final de implementacion

La mejor ruta para este proyecto es:

- JWT simple en fase 1
- bcrypt para claves
- roles en guardias Nest
- panel separado para psicologo y administrativo
- estudiante autenticado por usuario seudonimo
- seguimiento de alertas como agregado separado

No recomiendo intentar hacer:

- anonimato absoluto con login
- un solo dashboard para todos los roles
- permisos resueltos solo en frontend
- observaciones clinicas mezcladas dentro de la entidad `alerta`

---

## 17. Siguiente paso de ejecucion

Si se aprueba este plan, el siguiente bloque de implementacion deberia ser:

1. SQL de migracion de autenticacion y perfiles
2. backend de login con JWT
3. guardias y roles
4. ajuste de `registrar-encuesta` para usar usuario autenticado
5. frontend de inicio de sesion y navegacion por rol

Ese siguiente paso ya implica cambios de codigo sobre backend, frontend, SQL y semillas.
