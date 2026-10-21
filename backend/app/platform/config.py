from enum import StrEnum
from functools import lru_cache
from typing import Literal, Self

from pydantic import SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Safe defaults for local development only. Production must override them.
DEV_DATABASE_URL = "postgresql+asyncpg://vinividivici:vinividivici@localhost:5432/vinividivici"
DEV_SECRET_KEY = "dev-insecure-change-me"


class Environment(StrEnum):
    DEVELOPMENT = "development"
    TEST = "test"
    PRODUCTION = "production"


class Settings(BaseSettings):
    """All configuration, read from environment variables (and a local .env file)."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: Environment = Environment.DEVELOPMENT
    database_url: str = DEV_DATABASE_URL
    secret_key: SecretStr = SecretStr(DEV_SECRET_KEY)
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    public_site_url: str = "http://localhost:3000"

    @property
    def is_production(self) -> bool:
        return self.environment is Environment.PRODUCTION

    @model_validator(mode="after")
    def _require_real_values_in_production(self) -> Self:
        if not self.is_production:
            return self

        problems: list[str] = []
        if self.database_url == DEV_DATABASE_URL:
            problems.append("DATABASE_URL must be set")
        secret = self.secret_key.get_secret_value()
        if secret == DEV_SECRET_KEY or len(secret) < 32:
            problems.append("SECRET_KEY must be a random value of at least 32 characters")

        if problems:
            raise ValueError("Invalid production configuration: " + "; ".join(problems))
        return self


@lru_cache
def get_settings() -> Settings:
    """Read the settings once and reuse them."""
    return Settings()