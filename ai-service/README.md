# SafeSchool Local AI

Servicio FastAPI local para analisis emocional preliminar de reportes anonimos.

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r ai-service\requirements.txt
.\.venv\Scripts\python -m uvicorn services.app:app --host 127.0.0.1 --port 8000
```

Endpoint principal:

```http
POST /analyze
```

El modelo incluido es un baseline explicable basado en reglas. No emite diagnosticos psicologicos ni envia datos a servicios externos.
