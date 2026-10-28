"""Structured logging: JSON lines in production, readable lines in development."""

import logging

import structlog
from structlog.typing import Processor

from app.platform.config import Settings


def configure_logging(settings: Settings) -> None:
    """Send every log line (ours, uvicorn's, libraries') through one structlog formatter."""

    # Steps applied to every log line, whoever wrote it.
    shared_processors: list[Processor] = [
        structlog.contextvars.merge_contextvars,  # adds request_id (and anything else bound)
        structlog.stdlib.add_log_level,  # "level": "info"
        structlog.stdlib.add_logger_name,  # "logger": "app.platform.errors"
        structlog.processors.TimeStamper(fmt="iso", utc=True),  # "timestamp": "2026-..."
    ]

    # The last step decides the output format.
    renderers: list[Processor]
    if settings.is_production:
        renderers = [structlog.processors.format_exc_info, structlog.processors.JSONRenderer()]
    else:
        renderers = [structlog.dev.ConsoleRenderer()]

    structlog.configure(
        processors=[*shared_processors, structlog.stdlib.ProcessorFormatter.wrap_for_formatter],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=shared_processors,
        processors=[structlog.stdlib.ProcessorFormatter.remove_processors_meta, *renderers],
    )
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(settings.log_level)

    # Uvicorn's own messages ("Started server process"...) go through our formatter too.
    for name in ("uvicorn", "uvicorn.error"):
        uvicorn_logger = logging.getLogger(name)
        uvicorn_logger.handlers = []
        uvicorn_logger.propagate = True

    # Uvicorn's access log is replaced by our own request log, which carries the request_id.
    access_logger = logging.getLogger("uvicorn.access")
    access_logger.handlers = []
    access_logger.propagate = False