from fastapi import FastAPI

from app.platform.health import router as health_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="VINIVIDIVICI API",
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url=None,
        openapi_url="/api/v1/openapi.json",
    )
    app.include_router(health_router, prefix="/api")
    return app


app = create_app()