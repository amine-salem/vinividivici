import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import create_app
from app.platform.config import Settings
from app.platform.errors import (
    AppError,
    BusinessRuleViolation,
    Conflict,
    Forbidden,
    NotFound,
    ServiceUnavailable,
    Unauthorized,
)


def make_app() -> FastAPI:
    """A real app, plus test-only routes that fail on purpose."""
    app = create_app(Settings(_env_file=None))

    @app.get("/test/raise/{name}")
    async def raise_error(name: str) -> None:
        errors: dict[str, AppError] = {
            "not_found": NotFound(),
            "conflict": Conflict(),
            "business": BusinessRuleViolation(),
            "unauthorized": Unauthorized(),
            "forbidden": Forbidden(),
            "unavailable": ServiceUnavailable(),
            "custom": BusinessRuleViolation("Only 2 left in stock.", code="out_of_stock"),
        }
        raise errors[name]

    @app.get("/test/quantity")
    async def needs_quantity(quantity: int) -> dict[str, int]:
        return {"quantity": quantity}

    @app.get("/test/crash")
    async def crash() -> None:
        raise RuntimeError("database password is hunter2")

    return app


@pytest.fixture
def client() -> TestClient:
    # raise_server_exceptions=False: behave like a real server, which answers 500
    # instead of re-raising the crash inside the test.
    return TestClient(make_app(), raise_server_exceptions=False)


@pytest.mark.parametrize(
    ("name", "status", "code"),
    [
        ("not_found", 404, "not_found"),
        ("conflict", 409, "conflict"),
        ("business", 409, "business_rule_violation"),
        ("unauthorized", 401, "unauthorized"),
        ("forbidden", 403, "forbidden"),
        ("unavailable", 503, "service_unavailable"),
    ],
)
def test_app_errors_become_problem_details(
    client: TestClient, name: str, status: int, code: str
) -> None:
    response = client.get(f"/test/raise/{name}")

    assert response.status_code == status
    assert response.headers["content-type"] == "application/problem+json"
    body = response.json()
    assert body["status"] == status
    assert body["code"] == code
    assert body["type"] == "about:blank"
    assert body["title"]
    assert body["detail"]
    assert body["request_id"]


def test_specific_code_and_detail_can_be_given(client: TestClient) -> None:
    body = client.get("/test/raise/custom").json()

    assert body["code"] == "out_of_stock"
    assert body["detail"] == "Only 2 left in stock."


def test_validation_error_lists_the_invalid_fields(client: TestClient) -> None:
    response = client.get("/test/quantity", params={"quantity": "abc"})

    assert response.status_code == 422
    body = response.json()
    assert body["code"] == "validation_error"
    assert body["errors"][0]["field"] == "quantity"
    assert body["errors"][0]["code"] == "int_parsing"


def test_unknown_route_is_a_problem_detail(client: TestClient) -> None:
    response = client.get("/api/does-not-exist")

    assert response.status_code == 404
    assert response.json()["code"] == "not_found"


def test_unexpected_error_hides_internal_details(client: TestClient) -> None:
    response = client.get("/test/crash")

    assert response.status_code == 500
    body = response.json()
    assert body["code"] == "internal_error"
    assert body["request_id"]
    assert "hunter2" not in response.text
    assert "RuntimeError" not in response.text