# Arquitectura AI Service

## Estado inicial
- FastAPI expone el transporte.
- El clasificador basado en reglas está dentro del mismo módulo del endpoint.
- Hay un endpoint legacy sin separación de caso de uso.

## Objetivo
- Separar dominio, aplicación, puertos y adaptadores.
- Mantener el endpoint actual.
- Volver intercambiable el modelo basado en reglas.

