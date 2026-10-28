"""Gives every request an id, logs one line per request, and returns the id in a header."""

import re
import time
import uuid
from collections.abc import Awaitable, Callable

import structlog
from fastapi import Request, Response

REQUEST_ID_HEADER = "X-Request-ID"
_VALID_REQUEST_ID = re.compile(r"[A-Za-z0-9-]{8,64}")

logger = structlog.get_logger(__name__)


async def request_context_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    # 1. Choose the id: keep a valid one sent by the caller, otherwise make a new one.
    incoming = request.headers.get(REQUEST_ID_HEADER, "")
    request_id = incoming if _VALID_REQUEST_ID.fullmatch(incoming) else uuid.uuid4().hex

    # 2. Make it available: to error handlers (request.state) and to every log line (contextvars).
    request.state.request_id = request_id
    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(request_id=request_id)

    # 3. Run the request, and log one line when it ends, even if it crashed.
    started = time.perf_counter()
    status_code = 500
    try:
        response = await call_next(request)
        status_code = response.status_code
    finally:
        logger.info(
            "request_finished",
            method=request.method,
            path=request.url.path,
            status_code=status_code,
            duration_ms=round((time.perf_counter() - started) * 1000, 1),
        )

    # 4. Return the id to the caller.
    response.headers[REQUEST_ID_HEADER] = request_id
    return response