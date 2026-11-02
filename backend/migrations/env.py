"""Alembic environment: runs migrations with our Settings and our async engine."""

import asyncio

from alembic import context
from sqlalchemy.engine import Connection

from app.platform.config import get_settings
from app.platform.db import Base, build_engine
from app.platform.logs import configure_logging

# Import every module that defines tables, so Base.metadata knows them.
# Nothing yet; Sprint 1 adds lines like: import app.modules.catalog.models  # noqa: F401

settings = get_settings()
configure_logging(settings)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """`alembic upgrade head --sql`: print the SQL instead of running it."""
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    engine = build_engine(settings)
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())