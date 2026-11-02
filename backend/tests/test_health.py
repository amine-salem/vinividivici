from fastapi.testclient import TestClient

from app.main import create_app
from app.platform.config import Settings

# Nothing listens on port 1, so connecting fails with "connection refused".
UNREACHABLE_DB = "postgresql+asyncpg://nobody:nothing@127.0.0.1:1/nothing"


def test_ready_returns_ok_when_database_answers() -> None:
    # Needs the local Postgres container running (docker start vinividivici-db).
    app = create_app(Settings(_env_file=None))
    with TestClient(app) as client:
        response = client.get("/api/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_ready_returns_problem_details_when_database_is_down() -> None:
    app = create_app(Settings(_env_file=None, database_url=UNREACHABLE_DB))
    with TestClient(app) as client:
        response = client.get("/api/health/ready")

    assert response.status_code == 503
    assert response.headers["content-type"] == "application/problem+json"
    body = response.json()
    assert body["code"] == "service_unavailable"
    assert body["request_id"] == response.headers["X-Request-ID"]