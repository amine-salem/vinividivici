import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr, ValidationError

from app.main import create_app
from app.platform.config import Environment, Settings

REAL_SECRET = "x" * 40
REAL_DB = "postgresql+asyncpg://user:pass@db:5432/vinividivici"


def test_development_starts_with_defaults() -> None:
    settings = Settings(_env_file=None)

    assert settings.environment is Environment.DEVELOPMENT


def test_production_refuses_default_values() -> None:
    with pytest.raises(ValidationError) as error:
        Settings(_env_file=None, environment=Environment.PRODUCTION)

    message = str(error.value)
    assert "DATABASE_URL must be set" in message
    assert "SECRET_KEY" in message


def test_production_refuses_short_secret() -> None:
    with pytest.raises(ValidationError):
        Settings(
            _env_file=None,
            environment=Environment.PRODUCTION,
            database_url=REAL_DB,
            secret_key=SecretStr("too-short"),
        )


def test_production_accepts_real_values() -> None:
    settings = Settings(
        _env_file=None,
        environment=Environment.PRODUCTION,
        database_url=REAL_DB,
        secret_key=SecretStr(REAL_SECRET),
    )

    assert settings.is_production


def test_secret_is_hidden_when_printed() -> None:
    settings = Settings(_env_file=None, secret_key=SecretStr(REAL_SECRET))

    assert REAL_SECRET not in repr(settings)


def test_docs_are_hidden_in_production() -> None:
    settings = Settings(
        _env_file=None,
        environment=Environment.PRODUCTION,
        database_url=REAL_DB,
        secret_key=SecretStr(REAL_SECRET),
    )
    client = TestClient(create_app(settings))

    assert client.get("/api/docs").status_code == 404