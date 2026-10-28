from fastapi import FastAPI
import structlog
from starlette.middleware.base import BaseHTTPMiddleware

from app.platform.config import Settings, get_settings
from app.platform.errors import register_error_handlers
from app.platform.health import router as health_router
from app.platform.logs import configure_logging
from app.platform.request_context import request_context_middleware


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging(settings)
    structlog.get_logger(__name__).info(
        "app_configured",
        environment=settings.environment.value,
        log_level=settings.log_level,
    )
    show_docs = not settings.is_production

    app = FastAPI(
        title="VINIVIDIVICI API",
        version="0.1.0",
        docs_url="/api/docs" if show_docs else None,
        redoc_url=None,
        openapi_url="/api/v1/openapi.json" if show_docs else None,
    )
    app.state.settings = settings
    register_error_handlers(app)
    app.add_middleware(BaseHTTPMiddleware, dispatch=request_context_middleware)
    app.include_router(health_router, prefix="/api")
    return app