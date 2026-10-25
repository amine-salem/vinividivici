from fastapi.testclient import TestClient

from app.main import create_app
from app.platform.config import Settings


def test_live_returns_ok() -> None:
    client = TestClient(create_app(Settings(_env_file=None)))

    response = client.get("/api/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}