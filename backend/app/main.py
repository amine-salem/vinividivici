from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware

from app.platform.api import operation_id
from app.platform.config import Settings, get_settings
from app.platform.db import build_engine, build_session_factory
from app.platform.errors import register_error_handlers
from app.platform.health import router as health_router
from app.platform.logs import configure_logging
from app.platform.request_context import request_context_middleware

from app.modules.vini.public import router as vini_public_router


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging(settings)
    logger = structlog.get_logger(__name__)
    logger.info(
        "app_configured",
        environment=settings.environment.value,
        log_level=settings.log_level,
    )
    show_docs = not settings.is_production

    # Creating the engine does not connect: the first connection opens on the first query.
    engine = build_engine(settings)

    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        yield  # ← the app serves requests here
        await engine.dispose()  # shutdown: close every pooled connection cleanly
        logger.info("database_engine_disposed")

    app = FastAPI(
        title="VINIVIDIVICI API",
        version="0.1.0",
        docs_url="/api/docs" if show_docs else None,
        redoc_url=None,
        openapi_url="/api/v1/openapi.json" if show_docs else None,
        lifespan=lifespan,
        generate_unique_id_function=operation_id
    )
    app.state.settings = settings
    app.state.engine = engine
    app.state.session_factory = build_session_factory(engine)
    register_error_handlers(app)
    app.add_middleware(BaseHTTPMiddleware, dispatch=request_context_middleware)
    app.include_router(health_router, prefix="/api")
    app.include_router(vini_public_router, prefix="/api/v1")
    return app