from __future__ import annotations

import re
import unicodedata
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


app = FastAPI(title="SafeSchool Local AI", version="2.0.0")


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


KEYWORDS = {
    "fear": {
        "terms": ["miedo", "temor", "amenaza", "amenazan", "asusta", "no quiero ir"],
        "weight": 0.22,
    },
    "sadness": {
        "terms": ["triste", "lloro", "llorar", "solo", "sola", "aislado", "nadie"],
        "weight": 0.18,
    },
    "anxiety": {
        "terms": ["ansiedad", "nervioso", "nerviosa", "angustia", "no duermo"],
        "weight": 0.2,
    },
    "anger": {
        "terms": ["rabia", "enojo", "golpe", "pegan", "insultan", "burlan"],
        "weight": 0.14,
    },
}

HIGH_RISK_TERMS = [
    "matarme",
    "suicidio",
    "no quiero vivir",
    "abuso",
    "violacion",
    "me toca",
    "arma",
    "amenaza",
    "golpe",
    "sangre",
]

MEDIUM_RISK_TERMS = [
    "miedo",
    "burlan",
    "insultan",
    "solo",
    "aislado",
    "ansiedad",
    "triste",
    "whatsapp",
    "redes",
    "fotos",
]

RISK_FORM_KEYS = [
    "fear",
    "miedo",
    "anxiety",
    "ansiedad",
    "isolation",
    "aislamiento",
    "school_insecurity",
    "recreo_solo",
    "miedo_participar",
    "entorno_violento",
]


def normalize(text: str) -> str:
    normalized = unicodedata.normalize("NFD", text.lower())
    without_accents = "".join(
        char for char in normalized if unicodedata.category(char) != "Mn"
    )
    return re.sub(r"\s+", " ", without_accents).strip()


def score_emotions(text: str, emotional_form: dict[str, Any]) -> dict[str, float]:
    scores = {emotion: 0.05 for emotion in KEYWORDS}
    for emotion, config in KEYWORDS.items():
        matches = [term for term in config["terms"] if term in text]
        scores[emotion] += min(0.75, len(matches) * float(config["weight"]))

    if emotional_form.get("fear") is True or emotional_form.get("miedo") is True:
        scores["fear"] += 0.25
    if emotional_form.get("sadness") is True or emotional_form.get("tristeza") is True:
        scores["sadness"] += 0.25
    if emotional_form.get("anxiety") is True or emotional_form.get("ansiedad") is True:
        scores["anxiety"] += 0.25
    if emotional_form.get("isolation") is True or emotional_form.get("aislamiento") is True:
        scores["sadness"] += 0.15
        scores["fear"] += 0.1
    if emotional_form.get("school_insecurity") is True:
        scores["fear"] += 0.2

    return {emotion: round(min(value, 1.0), 4) for emotion, value in scores.items()}


def detect_signals(text: str) -> list[str]:
    signals = []
    for term in HIGH_RISK_TERMS + MEDIUM_RISK_TERMS:
        if term in text and term not in signals:
            signals.append(term)
    return signals[:8]


def is_truthy(value: Any) -> bool:
    return value in [True, 1, "true", "1", "si", "sí", "yes"]


def classify_risk(text: str, scores: dict[str, float], emotional_form: dict[str, Any]) -> str:
    high_matches = sum(1 for term in HIGH_RISK_TERMS if term in text)
    medium_matches = sum(1 for term in MEDIUM_RISK_TERMS if term in text)
    form_risk = sum(1 for key in RISK_FORM_KEYS if is_truthy(emotional_form.get(key)))
    max_score = max(scores.values())

    risk_points = high_matches * 3.5 + medium_matches * 0.85 + form_risk * 0.55
    if max_score >= 0.75:
        risk_points += 1.8
    elif max_score >= 0.55:
        risk_points += 1.0
    elif max_score >= 0.4:
        risk_points += 0.4

    if high_matches >= 1 or risk_points >= 6.5 or (max_score >= 0.9 and form_risk >= 4):
        return "HIGH"
    if (
        risk_points >= 2.7
        or (medium_matches >= 2 and form_risk >= 1)
        or max_score >= 0.65
    ):
        return "MEDIUM"
    return "LOW"


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "ok", "model": "rules-baseline-2.0"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    text = normalize(payload.message)
    if not text:
        raise HTTPException(status_code=400, detail="message is required")

    scores = score_emotions(text, payload.emotional_form)
    risk = classify_risk(text, scores, payload.emotional_form)
    signals = detect_signals(text)
    has_form_risk = any(is_truthy(payload.emotional_form.get(key)) for key in RISK_FORM_KEYS)
    dominant_emotion = (
        "neutral"
        if not signals and not has_form_risk and max(scores.values()) <= 0.1
        else max(scores, key=scores.get)
    )
    confidence = round(min(0.85, 0.35 + len(signals) * 0.06 + max(scores.values()) * 0.25), 4)

    return AnalyzeResponse(
        dominant_emotion=dominant_emotion,
        emotion_scores=scores,
        risk_ai=risk,
        confidence=confidence,
        relevant_signals=signals,
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


@app.post("/api/evaluar_alerta")
def legacy_analyze(payload: LegacyRequest) -> dict[str, Any]:
    response = analyze(
        AnalyzeRequest(
            message=payload.frase_alumno,
            emotional_form={
                "recreo_solo": payload.Recreo_Solo,
                "miedo_participar": payload.Miedo_Participar,
                "entorno_violento": payload.Entorno_Violento,
            },
        )
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
