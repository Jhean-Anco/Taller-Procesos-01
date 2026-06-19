# Principios Hexagonales

## Reglas
1. Las dependencias apuntan hacia el dominio.
2. La aplicación depende de puertos, no de implementaciones.
3. Los adaptadores solo traducen transporte o tecnología.
4. El dominio no importa frameworks.
5. Los casos de uso son probables sin infraestructura real.

## Criterios de validacion
- Ninguna entidad de dominio depende de TypeORM, React o FastAPI.
- Ningun caso de uso depende de NestJS, Express o fetch.
- Ningun componente React depende de TypeORM.
- Ningun endpoint contiene reglas de negocio.

