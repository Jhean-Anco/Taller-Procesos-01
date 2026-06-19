# Arquitectura Frontend

## Diagrama
```text
[React UI]
    |
    v
[Input Adapters / View Controllers]
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
    +----> [HTTP API Adapter]
    +----> [Session Storage Adapter]
    +----> [Notification Adapter]
```

## Estado actual
- `aplicacion.tsx` contiene muchas decisiones de UI y aplicación.
- Existe adaptador API y adaptador de sesión, pero sin un composition root claro.
- La navegación y notificaciones estan mezcladas en el shell principal.

