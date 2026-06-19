from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_analyze_requires_message():
    response = client.post("/analyze", json={"message": "", "emotional_form": {}})
    if response.status_code != 422:
        raise AssertionError(f"expected 422, got {response.status_code}")


def test_analyze_accepts_valid_payload_without_api_key_when_disabled():
    response = client.post(
        "/analyze",
        json={
            "message": "Me siento triste y me insultan en el recreo",
            "emotional_form": {"sadness": True},
        },
    )
    if response.status_code != 200:
        raise AssertionError(f"expected 200, got {response.status_code}")
    body = response.json()
    if body["risk_ai"] not in {"LOW", "MEDIUM", "HIGH"}:
        raise AssertionError(f"unexpected risk_ai: {body['risk_ai']}")
    if "model_version" not in body:
        raise AssertionError("missing model_version")
