from fastapi import FastAPI

from app.platform.config import Settings, get_settings
from app.platform.health import router as health_router


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    show_docs = not settings.is_production

    app = FastAPI(
        title="VINIVIDIVICI API",
        version="0.1.0",
        docs_url="/api/docs" if show_docs else None,
        redoc_url=None,
        openapi_url="/api/v1/openapi.json" if show_docs else None,
    )
    app.state.settings = settings
    app.include_router(health_router, prefix="/api")
    return app
