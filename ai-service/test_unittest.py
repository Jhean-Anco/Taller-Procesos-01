from unittest import TestCase

from fastapi.testclient import TestClient

from main import app


class AiServiceContractTests(TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_requires_message(self) -> None:
        response = self.client.post("/analyze", json={"message": "", "emotional_form": {}})
        self.assertEqual(response.status_code, 422)

    def test_accepts_valid_payload(self) -> None:
        response = self.client.post(
            "/analyze",
            json={
                "message": "Me siento triste y me insultan en el recreo",
                "emotional_form": {"sadness": True},
            },
        )
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertIn(body["risk_ai"], {"LOW", "MEDIUM", "HIGH"})
        self.assertIn("model_version", body)

