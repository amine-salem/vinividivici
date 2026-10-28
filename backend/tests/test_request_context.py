import json
import re
from typing import Any

import pytest
import structlog
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import SecretStr

from app.main import create_app
from app.platform.config import Environment, Settings


def production_settings() -> Settings:
    return Settings(
        _env_file=None,
        environment=Environment.PRODUCTION,
        database_url="postgresql+asyncpg://user:pass@db:5432/vinividivici",
        secret_key=SecretStr("x" * 40),
    )


def make_app(settings: Settings) -> FastAPI:
    """A real app, plus test-only routes."""
    app = create_app(settings)
    logger = structlog.get_logger("test")

    @app.get("/test/log")
    async def write_a_log() -> dict[str, str]:
        logger.info("inside_endpoint")
        return {"status": "ok"}

    @app.get("/test/crash")
    async def crash() -> None:
        raise RuntimeError("boom")

    return app


@pytest.fixture
def client() -> TestClient:
    return TestClient(make_app(Settings(_env_file=None)), raise_server_exceptions=False)


def json_lines(output: str) -> list[dict[str, Any]]:
    return [json.loads(line) for line in output.splitlines() if line.startswith("{")]


def test_every_response_has_a_request_id(client: TestClient) -> None:
    response = client.get("/api/health/live")

    assert re.fullmatch(r"[0-9a-f]{32}", response.headers["X-Request-ID"])


def test_each_request_gets_a_different_id(client: TestClient) -> None:
    first = client.get("/api/health/live").headers["X-Request-ID"]
    second = client.get("/api/health/live").headers["X-Request-ID"]

    assert first != second


def test_a_valid_incoming_request_id_is_kept(client: TestClient) -> None:
    response = client.get("/api/health/live", headers={"X-Request-ID": "frontend-1234abcd"})

    assert response.headers["X-Request-ID"] == "frontend-1234abcd"


def test_an_invalid_incoming_request_id_is_replaced(client: TestClient) -> None:
    response = client.get("/api/health/live", headers={"X-Request-ID": "bad id {injected}"})

    assert re.fullmatch(r"[0-9a-f]{32}", response.headers["X-Request-ID"])


def test_error_body_and_header_carry_the_same_id(client: TestClient) -> None:
    response = client.get("/api/nothing-here")

    assert response.json()["request_id"] == response.headers["X-Request-ID"]


def test_a_crash_response_still_carries_the_id(client: TestClient) -> None:
    response = client.get("/test/crash")

    assert response.status_code == 500
    assert response.json()["request_id"] == response.headers["X-Request-ID"]


def test_production_writes_one_json_line_per_request(capsys: pytest.CaptureFixture[str]) -> None:
    client = TestClient(make_app(production_settings()))

    client.get("/api/health/live", headers={"X-Request-ID": "test-request-0001"})

    lines = json_lines(capsys.readouterr().err)
    finished = [line for line in lines if line["event"] == "request_finished"]
    assert len(finished) == 1
    line = finished[0]
    assert line["request_id"] == "test-request-0001"
    assert line["method"] == "GET"
    assert line["path"] == "/api/health/live"
    assert line["status_code"] == 200
    assert line["duration_ms"] >= 0
    assert line["level"] == "info"
    assert "timestamp" in line


def test_logs_written_inside_an_endpoint_carry_the_request_id(
    capsys: pytest.CaptureFixture[str],
) -> None:
    client = TestClient(make_app(production_settings()))

    client.get("/test/log", headers={"X-Request-ID": "test-request-0002"})

    lines = json_lines(capsys.readouterr().err)
    inside = [line for line in lines if line["event"] == "inside_endpoint"]
    assert inside[0]["request_id"] == "test-request-0002"


def test_a_crash_is_logged_with_its_traceback_and_request_id(
    capsys: pytest.CaptureFixture[str],
) -> None:
    client = TestClient(make_app(production_settings()), raise_server_exceptions=False)

    client.get("/test/crash", headers={"X-Request-ID": "test-request-0003"})

    lines = json_lines(capsys.readouterr().err)
    crash = [line for line in lines if line["event"] == "unhandled_error"][0]
    assert crash["request_id"] == "test-request-0003"
    assert crash["level"] == "error"
    assert "RuntimeError: boom" in crash["exception"]
    finished = [line for line in lines if line["event"] == "request_finished"][0]
    assert finished["status_code"] == 500