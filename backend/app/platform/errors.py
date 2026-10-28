"""Central error handling: every error leaves the API in one format (RFC 9457 problem details)."""

import uuid
from http import HTTPStatus
from typing import Any

import structlog
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.platform.request_context import REQUEST_ID_HEADER

logger = structlog.get_logger(__name__)

PROBLEM_JSON = "application/problem+json"


# ---------------------------------------------------------------- the response format


class FieldError(BaseModel):
    """One invalid field in a request."""

    field: str
    code: str
    message: str


class ProblemDetail(BaseModel):
    """The body of every error response (RFC 9457), plus our `code` and `request_id`."""

    type: str = "about:blank"
    title: str
    status: int
    detail: str
    code: str
    request_id: str
    errors: list[FieldError] | None = None


# ------------------------------------------------------- the exceptions the code raises


class AppError(Exception):
    """Base class of every error the application raises on purpose."""

    status_code: int = 500
    code: str = "internal_error"
    default_detail: str = "An unexpected error occurred."

    def __init__(self, detail: str | None = None, *, code: str | None = None) -> None:
        self.detail = detail or self.default_detail
        if code is not None:
            self.code = code
        super().__init__(self.detail)


class NotFound(AppError):
    status_code = 404
    code = "not_found"
    default_detail = "The resource was not found."


class Conflict(AppError):
    status_code = 409
    code = "conflict"
    default_detail = "The request conflicts with the current state of the resource."


class BusinessRuleViolation(AppError):
    status_code = 409
    code = "business_rule_violation"
    default_detail = "The request breaks a business rule."


class Unauthorized(AppError):
    status_code = 401
    code = "unauthorized"
    default_detail = "Authentication is required."


class Forbidden(AppError):
    status_code = 403
    code = "forbidden"
    default_detail = "You are not allowed to do this."


# ---------------------------------------------------------------------------- helpers


def _request_id(request: Request) -> str:
    """The id of this request. Task 4's middleware will set it; until then, make one."""
    existing = getattr(request.state, "request_id", None)
    if isinstance(existing, str):
        return existing
    new_id = uuid.uuid4().hex
    request.state.request_id = new_id
    return new_id


def _problem(
    request: Request,
    status: int,
    code: str,
    detail: str,
    errors: list[FieldError] | None = None,
) -> JSONResponse:
    request_id = _request_id(request)
    body = ProblemDetail(
        title=HTTPStatus(status).phrase,
        status=status,
        detail=detail,
        code=code,
        request_id=request_id,
        errors=errors,
    )
    return JSONResponse(
        status_code=status,
        content=body.model_dump(exclude_none=True),
        media_type=PROBLEM_JSON,
        headers={REQUEST_ID_HEADER: request_id},
    )


def _field_name(location: tuple[Any, ...]) -> str:
    """('body', 'items', 0, 'quantity') -> 'items.0.quantity'. The first part says where
    the value was (body, query, path, header); the frontend only needs the field."""
    parts = location[1:] if len(location) > 1 else location
    return ".".join(str(part) for part in parts)


# --------------------------------------------------------------------------- handlers


async def _handle_app_error(request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, AppError)
    return _problem(request, exc.status_code, exc.code, exc.detail)


async def _handle_validation_error(request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, RequestValidationError)
    errors = [
        FieldError(field=_field_name(tuple(err["loc"])), code=err["type"], message=err["msg"])
        for err in exc.errors()
    ]
    return _problem(request, 422, "validation_error", "The request is invalid.", errors)


async def _handle_http_error(request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, StarletteHTTPException)
    codes = {404: "not_found", 405: "method_not_allowed"}
    code = codes.get(exc.status_code, "http_error")
    detail = exc.detail if isinstance(exc.detail, str) else HTTPStatus(exc.status_code).phrase
    return _problem(request, exc.status_code, code, detail)


async def _handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled_error")
    return _problem(request, 500, "internal_error", AppError.default_detail)    


def register_error_handlers(app: FastAPI) -> None:
    """Connect every kind of error to its handler. Called once, in create_app()."""
    app.add_exception_handler(AppError, _handle_app_error)
    app.add_exception_handler(RequestValidationError, _handle_validation_error)
    app.add_exception_handler(StarletteHTTPException, _handle_http_error)
    app.add_exception_handler(Exception, _handle_unexpected_error)