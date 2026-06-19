# Arquitectura Backend

## Diagrama
```text
[REST Controllers / Jobs]
          |
          v
[Input Ports]
          |
          v
[Application Use Cases]
          |
          v
[Domain]
          |
          v
[Output Ports]
          |
          +----> [TypeORM Adapter]
          +----> [AI Client Adapter]
          +----> [Session Adapter]
          +----> [Audit Adapter]
          +----> [Crypto Adapter]
```

## Mapa inicial
- Auth: controlador HTTP, casos de uso, JWT, fallback legacy.
- Users: casos de uso de gestion y repositorios en memoria/TypeORM.
- Reports: analisis, revision, derivacion, archivado y presentacion.
- Alerts: generacion y actualizacion.
- Activities: actividades preventivas.
- Dashboard: agregados y resumen.
- Audit: trazabilidad.

