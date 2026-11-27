import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.platform.config import Settings


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app(Settings(_env_file=None)))


def test_services_are_published_only_in_display_order(client: TestClient) -> None:
    body = client.get("/api/v1/services").json()

    assert [s["slug"] for s in body["items"]] == ["production-video", "photographie", "marketing-digital"]


def test_services_in_arabic(client: TestClient) -> None:
    first = client.get("/api/v1/services?lang=ar").json()["items"][0]

    assert first["name"] == "إنتاج الفيديو (تجريبي)"


def test_projects_newest_first_without_drafts(client: TestClient) -> None:
    body = client.get("/api/v1/projects").json()

    assert [p["slug"] for p in body["items"]] == [
        "projet-demo-5",
        "projet-demo-4",
        "projet-demo-3",
        "projet-demo-2",
        "projet-demo-1",
    ]
    assert body["total"] == 5


def test_projects_last_page(client: TestClient) -> None:
    body = client.get("/api/v1/projects?page=3&page_size=2").json()

    assert [p["slug"] for p in body["items"]] == ["projet-demo-1"]
    assert body["total"] == 5


def test_project_dates_are_utc_with_z(client: TestClient) -> None:
    first = client.get("/api/v1/projects?page_size=1").json()["items"][0]

    assert first["published_at"] == "2026-10-20T09:00:00Z"


def test_project_detail_with_youtube_video(client: TestClient) -> None:
    body = client.get("/api/v1/projects/projet-demo-1").json()

    assert body["video"] == {
        "provider": "youtube",
        "video_id": "DEMOvideo01",
        "embed_url": "https://www.youtube-nocookie.com/embed/DEMOvideo01",
    }
    assert len(body["photos"]) == 2


def test_project_without_video_has_null_video(client: TestClient) -> None:
    body = client.get("/api/v1/projects/projet-demo-3").json()

    assert "video" in body
    assert body["video"] is None


def test_draft_project_is_not_found(client: TestClient) -> None:
    response = client.get("/api/v1/projects/projet-demo-6")

    assert response.status_code == 404
    assert response.json()["code"] == "not_found"


def test_unknown_project_is_not_found(client: TestClient) -> None:
    assert client.get("/api/v1/projects/nexiste-pas").status_code == 404


def test_badly_formed_slug_is_refused(client: TestClient) -> None:
    assert client.get("/api/v1/projects/Projet_Demo").status_code == 422