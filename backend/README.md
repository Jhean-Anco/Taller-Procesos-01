# Backend SafeSchool

Backend NestJS con arquitectura hexagonal por modulo en `src/modules`.

## Comandos

```powershell
npm install
npm run build
npm run test
npm run test:e2e
npm run dev
```

## Modulos PMV

- `auth`: login JWT, sesion actual y compatibilidad con `/auth/sesion`.
- `users`: usuarios internos `PSYCHOLOGIST` y `ADMIN_DIRECTOR`.
- `reports`: reportes anonimos, analisis IA local, revision psicologica y derivacion.
- `alerts`: alertas tempranas sin duplicar alertas activas por reporte.
- `activities`: actividades preventivas institucionales.
- `dashboard`: estadisticas agregadas con proteccion de grupos pequenos.
- `audit`: trazabilidad sin contenido sensible.

Ver variables, endpoints y ejecucion completa en `../README.md`.
