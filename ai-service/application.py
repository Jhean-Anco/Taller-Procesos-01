from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from domain import AnalyzeResult, classify_risk, detect_signals, normalize, score_emotions


@dataclass(frozen=True)
class AnalyzeRequestModel:
    message: str
    emotional_form: dict[str, Any]


def analyze_report(payload: AnalyzeRequestModel) -> AnalyzeResult:
    text = normalize(payload.message)
    if not text:
        raise ValueError("message is required")
    if len(payload.emotional_form) > 64:
        raise ValueError("payload too large")

    scores = score_emotions(text, payload.emotional_form)
    risk = classify_risk(text, scores, payload.emotional_form)
    signals = detect_signals(text)
    has_form_risk = any(
        value in [True, 1, "true", "1", "si", "sí", "yes"]
        for value in payload.emotional_form.values()
    )
    dominant_emotion = (
        "neutral"
        if not signals and not has_form_risk and max(scores.values()) <= 0.1
        else max(scores, key=scores.get)
    )
    confidence = round(min(0.85, 0.35 + len(signals) * 0.06 + max(scores.values()) * 0.25), 4)
    return AnalyzeResult(
        dominant_emotion=dominant_emotion,
        emotion_scores=scores,
        risk_ai=risk,
        confidence=confidence,
        relevant_signals=signals,
    )
