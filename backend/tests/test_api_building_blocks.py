from fastapi import APIRouter, FastAPI
from fastapi.testclient import TestClient

from app.main import create_app
from app.platform.api import Lang, LangQuery, Page, PageDep, PageParams, Schema
from app.platform.config import Settings

router = APIRouter(prefix="/test")


class Echo(Schema):
    name: str


@router.get("/items")
async def list_test_items(params: PageDep, lang: LangQuery = Lang.FR) -> Page[str]:
    items = [f"{lang.value}-{i}" for i in range(1, 6)]  # 5 items
    return Page[str](
        items=params.window(items),
        page=params.page,
        page_size=params.page_size,
        total=len(items),
    )


@router.post("/echo")
async def echo_test(body: Echo) -> Echo:
    return body


def make_app() -> FastAPI:
    app = create_app(Settings(_env_file=None))
    app.include_router(router)
    return app


def test_page_defaults() -> None:
    response = TestClient(make_app()).get("/test/items")

    assert response.status_code == 200
    body = response.json()
    assert body["page"] == 1
    assert body["page_size"] == 20
    assert body["total"] == 5
    assert len(body["items"]) == 5


def test_second_page_returns_the_right_window() -> None:
    response = TestClient(make_app()).get("/test/items?page=2&page_size=2")

    assert response.json()["items"] == ["fr-3", "fr-4"]


def test_page_size_above_the_limit_is_refused() -> None:
    response = TestClient(make_app()).get("/test/items?page_size=51")

    assert response.status_code == 422


def test_page_zero_is_refused() -> None:
    response = TestClient(make_app()).get("/test/items?page=0")

    assert response.status_code == 422


def test_window_past_the_end_is_empty() -> None:
    assert PageParams(page=4, page_size=2).window([1, 2, 3, 4, 5]) == []


def test_lang_defaults_to_french() -> None:
    response = TestClient(make_app()).get("/test/items?page_size=1")

    assert response.json()["items"] == ["fr-1"]


def test_lang_arabic() -> None:
    response = TestClient(make_app()).get("/test/items?page_size=1&lang=ar")

    assert response.json()["items"] == ["ar-1"]


def test_unknown_lang_is_refused() -> None:
    response = TestClient(make_app()).get("/test/items?lang=en")

    assert response.status_code == 422


def test_unknown_field_in_body_is_refused() -> None:
    response = TestClient(make_app()).post("/test/echo", json={"name": "a", "nmae": "typo"})

    assert response.status_code == 422
    assert response.headers["content-type"] == "application/problem+json"


def test_operation_id_is_the_function_name() -> None:
    schema = make_app().openapi()

    assert schema["paths"]["/test/items"]["get"]["operationId"] == "list_test_items"


def test_operation_ids_are_unique() -> None:
    schema = create_app(Settings(_env_file=None)).openapi()
    ids = [operation["operationId"] for path in schema["paths"].values() for operation in path.values()]

    assert len(ids) == len(set(ids))