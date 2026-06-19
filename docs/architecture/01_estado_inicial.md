# Estado Inicial

## Resumen
SafeSchool AI mezcla módulos relativamente separados con dependencias directas a infraestructura en varios puntos.

## Backend
- NestJS como framework de composición.
- TypeORM en persistencia.
- JWT, sesiones HTTP y guards compartidos.
- Casos de uso existen, pero varios controladores aún dependen de clases concretas.
- `ReportsUseCases` y `AuthUseCases` concentran la orquestación principal.

## Frontend
- React/Vite con una SPA grande.
- `src/aplicacion.tsx` concentra sesión, navegación, API, filtros y paneles.
- Existe separación parcial en `adaptadores` y `dominio`, pero todavía no es hexagonal estricta.

## AI Service
- FastAPI con endpoint principal de análisis.
- Reglas de clasificación y transporte viven en el mismo archivo.
- Existe endpoint legacy heredado.

## Riesgos de arquitectura
- Imports directos de infraestructura hacia capas internas.
- Dependencias calculadas en import time.
- UI con demasiada lógica de aplicación.
- Fallbacks y compatibilidades mezclados con reglas.

