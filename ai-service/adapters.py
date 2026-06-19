from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

from application import AnalyzeRequestModel, analyze_report


docs_url = None if os.environ.get("NODE_ENV") == "production" else "/docs"
redoc_url = None if os.environ.get("NODE_ENV") == "production" else "/redoc"
openapi_url = None if os.environ.get("NODE_ENV") == "production" else "/openapi.json"
app = FastAPI(
    title="SafeSchool Local AI",
    version="2.0.0",
    docs_url=docs_url,
    redoc_url=redoc_url,
    openapi_url=openapi_url,
)
INTERNAL_API_KEY = os.environ.get("AI_INTERNAL_API_KEY", "").strip()


class AnalyzeRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    emotional_form: dict[str, Any] = Field(default_factory=dict)


class AnalyzeResponse(BaseModel):
    dominant_emotion: str
    emotion_scores: dict[str, float]
    risk_ai: str
    confidence: float
    relevant_signals: list[str]
    model_version: str = "rules-baseline-2.0"
    note: str = "Clasificacion preliminar; no es diagnostico y requiere revision humana."


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "ok", "model": "rules-baseline-2.0"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: Request, payload: AnalyzeRequest) -> AnalyzeResponse:
    if INTERNAL_API_KEY:
        header = request.headers.get("x-internal-api-key", "").strip()
        if header != INTERNAL_API_KEY:
            raise HTTPException(status_code=401, detail="invalid api key")

    result = analyze_report(
        AnalyzeRequestModel(message=payload.message, emotional_form=payload.emotional_form)
    )
    return AnalyzeResponse(
        dominant_emotion=result.dominant_emotion,
        emotion_scores=result.emotion_scores,
        risk_ai=result.risk_ai,
        confidence=result.confidence,
        relevant_signals=result.relevant_signals,
        model_version=result.model_version,
        note=result.note,
    )


class LegacyRequest(BaseModel):
    frase_alumno: str
    Grado: int = 0
    Zona_Junin: int = 0
    Recreo_Solo: int = 0
    Animo_Manana: int = 0
    Miedo_Participar: int = 0
    Redes_Sociales: int = 0
    Apoyo_Familiar: int = 1
    Rendimiento: int = 0
    Hab_Sociales: int = 1
    Entorno_Violento: int = 0


@app.post("/api/evaluar_alerta", include_in_schema=False)
async def legacy_analyze(request: Request, payload: LegacyRequest) -> dict[str, Any]:
    response = await analyze(
        request,
        AnalyzeRequest(
            message=payload.frase_alumno,
            emotional_form={
                "recreo_solo": payload.Recreo_Solo,
                "miedo_participar": payload.Miedo_Participar,
                "entorno_violento": payload.Entorno_Violento,
            },
        ),
    )
    return {
        "nivel_de_riesgo": {
            "LOW": "BAJO RIESGO",
            "MEDIUM": "RIESGO MEDIO",
            "HIGH": "ALTO RIESGO",
        }[response.risk_ai],
        "puntaje_riesgo": int(response.confidence * 100),
        "prioridad_atencion": {
            "LOW": "monitoreo",
            "MEDIUM": "seguimiento",
            "HIGH": "alta",
        }[response.risk_ai],
        "analisis_psicologico": response.note,
        "accion_recomendada": "Revision humana por psicologia escolar.",
        "factores_detectados": response.relevant_signals,
        "factores_protectores": [],
        "confianza_global": response.confidence,
        "detalles_tecnicos": {
            "sentimiento_texto": response.dominant_emotion,
            "confianza_texto": response.confidence,
            "modelo": response.model_version,
        },
    }
