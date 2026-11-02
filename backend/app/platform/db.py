"""Database access: one engine per app, one session per request."""

from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.platform.config import Settings

# Predictable names for every constraint, so migrations can find them later.
NAMING_CONVENTION = {
    "pk": "pk_%(table_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "ix": "ix_%(column_0_label)s",
}


class Base(DeclarativeBase):
    """Parent class of every table model (products, inquiries, orders...)."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)


def build_engine(settings: Settings) -> AsyncEngine:
    """The engine and its connection pool. Creating it does not connect yet."""
    return create_async_engine(
        settings.database_url,
        pool_size=5,  # connections kept open
        max_overflow=5,  # extra temporary connections when all 5 are busy
        pool_timeout=10,  # seconds a request waits for a free connection, then fails
        pool_pre_ping=True,  # check a connection is alive before lending it
        connect_args={"timeout": 5},  # asyncpg: give up opening a connection after 5 s
    )


def build_session_factory(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    """Makes new sessions bound to the engine."""
    return async_sessionmaker(engine, expire_on_commit=False)


async def get_session(request: Request) -> AsyncIterator[AsyncSession]:
    """FastAPI dependency: one session per request, closed when the request ends.

    It never commits. Business code calls `await session.commit()` itself;
    anything not committed is rolled back when the session closes.
    """
    session_factory: async_sessionmaker[AsyncSession] = request.app.state.session_factory
    async with session_factory() as session:
        yield session


SessionDep = Annotated[AsyncSession, Depends(get_session)]