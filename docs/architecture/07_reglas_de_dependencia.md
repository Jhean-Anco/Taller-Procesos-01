# Reglas de Dependencia

## Permitido
- Infraestructura -> adaptadores -> aplicacion -> dominio

## Prohibido
- Dominio -> frameworks
- Aplicacion -> controladores HTTP
- Aplicacion -> React o fetch
- UI -> TypeORM o persistencia
- Servicio IA -> FastAPI en dominio

