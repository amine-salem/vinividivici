"""Shared building blocks of the API contract: language, lists, pages, images, route names."""

from collections.abc import Sequence
from dataclasses import dataclass
from enum import StrEnum
from typing import Annotated

from fastapi import Depends, Query
from fastapi.routing import APIRoute
from pydantic import BaseModel, ConfigDict, Field


class Schema(BaseModel):
    """Parent of every request and response schema.

    Unknown fields are refused (422), so a typo in a request body fails loudly
    instead of being silently ignored.
    """

    model_config = ConfigDict(extra="forbid")


# --- Language -------------------------------------------------------------------


class Lang(StrEnum):
    FR = "fr"
    AR = "ar"


LangQuery = Annotated[Lang, Query(description="Language of the returned texts.")]


# --- Lists and pages --------------------------------------------------------------


class ItemList[T](Schema):
    """A short list that is never paginated (services, categories)."""

    items: list[T]


class Page[T](Schema):
    """One page of a longer list."""

    items: list[T]
    page: int
    page_size: int
    total: int


MAX_PAGE_SIZE = 50


@dataclass(frozen=True)
class PageParams:
    page: int
    page_size: int

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    def window[T](self, items: Sequence[T]) -> list[T]:
        """The items of this page, from a full in-memory list (used by the stubs)."""
        return list(items[self.offset : self.offset + self.page_size])


def page_params(
    page: Annotated[int, Query(ge=1, description="Page number, starting at 1.")] = 1,
    page_size: Annotated[int, Query(ge=1, le=MAX_PAGE_SIZE, description="Items per page.")] = 20,
) -> PageParams:
    return PageParams(page=page, page_size=page_size)


PageDep = Annotated[PageParams, Depends(page_params)]


# --- Images -----------------------------------------------------------------------


class Image(Schema):
    """An image shown on the public site."""

    url: str = Field(description="Absolute URL.")
    width: int = Field(gt=0)
    height: int = Field(gt=0)
    alt: str


class Media(Schema):
    """An uploaded image, as the admin sees it."""

    id: int
    url: str = Field(description="Absolute URL.")
    width: int = Field(gt=0)
    height: int = Field(gt=0)


# --- Route names in OpenAPI -----------------------------------------------------


def operation_id(route: APIRoute) -> str:
    """Each route's OpenAPI name is its Python function name (list_products)."""
    return route.name