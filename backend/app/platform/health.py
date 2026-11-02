import structlog
from fastapi import APIRouter, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.platform.errors import ServiceUnavailable

router = APIRouter(tags=["health"])
logger = structlog.get_logger(__name__)


@router.get("/health/live")
async def live() -> dict[str, str]:
    """The process is running. It does not check the database (that is /health/ready)."""
    return {"status": "ok"}


@router.get("/health/ready")
async def ready(request: Request) -> dict[str, str]:
    """The API can serve traffic: the database answers."""
    engine: AsyncEngine = request.app.state.engine
    try:
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
    except Exception as exc:
        # Any failure here (refused, timeout, wrong password...) means "not ready".
        # The details go to the log, never to the caller.
        logger.warning("database_unreachable", error_type=type(exc).__name__, error=str(exc))
        raise ServiceUnavailable("The database is not reachable.") from exc
    return {"status": "ok", "database": "ok"}