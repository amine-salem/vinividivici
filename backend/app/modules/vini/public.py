"""Public VINI routes: services and portfolio. Published items only."""

from fastapi import APIRouter

from app.modules.vini.demo import PROJECTS, SERVICES, DemoImage, DemoProject, DemoService, DemoVideo
from app.modules.vini.demo import DEMO_TEXT_AR, DEMO_TEXT_FR
from app.modules.vini.schemas import (
    ProjectDetail,
    ProjectPage,
    ProjectSummary,
    Service,
    ServiceList,
    Video,
    VideoProvider,
)
from app.platform.api import Image, Lang, LangQuery, PageDep, SlugPath, pick
from app.platform.errors import NotFound

router = APIRouter(tags=["vini"])

EMBED_URLS: dict[VideoProvider, str] = {
    VideoProvider.YOUTUBE: "https://www.youtube-nocookie.com/embed/{}",
    VideoProvider.VIMEO: "https://player.vimeo.com/video/{}",
}


# --- rows → public shapes ---------------------------------------------------------


def _image(image: DemoImage, alt: str) -> Image:
    return Image(url=image.url, width=image.width, height=image.height, alt=alt)


def _video(video: DemoVideo) -> Video:
    return Video(
        provider=video.provider,
        video_id=video.video_id,
        embed_url=EMBED_URLS[video.provider].format(video.video_id),
    )


def _service(service: DemoService, lang: Lang) -> Service:
    return Service(
        slug=service.slug,
        name=pick(lang, service.name_fr, service.name_ar),
        description=pick(lang, DEMO_TEXT_FR, DEMO_TEXT_AR),
    )


def _project_summary(project: DemoProject, lang: Lang) -> ProjectSummary:
    title = pick(lang, project.title_fr, project.title_ar)
    return ProjectSummary(
        slug=project.slug,
        title=title,
        summary=pick(lang, DEMO_TEXT_FR, DEMO_TEXT_AR),
        thumbnail=_image(project.thumbnail, alt=title),
        published_at=project.published_at,
    )


def _project_detail(project: DemoProject, lang: Lang) -> ProjectDetail:
    summary = _project_summary(project, lang)
    return ProjectDetail(
        **summary.model_dump(),
        description=pick(lang, DEMO_TEXT_FR, DEMO_TEXT_AR),
        video=_video(project.video) if project.video else None,
        photos=[_image(photo, alt=f"{summary.title} — {n}") for n, photo in enumerate(project.photos, start=1)],
    )


def _published_projects() -> list[DemoProject]:
    published = [p for p in PROJECTS if p.published]
    return sorted(published, key=lambda p: p.published_at, reverse=True)


# --- routes -------------------------------------------------------------------------


@router.get("/services")
async def list_services(lang: LangQuery = Lang.FR) -> ServiceList:
    services = sorted((s for s in SERVICES if s.published), key=lambda s: s.position)
    return ServiceList(items=[_service(s, lang) for s in services])


@router.get("/projects")
async def list_projects(params: PageDep, lang: LangQuery = Lang.FR) -> ProjectPage:
    projects = _published_projects()
    return ProjectPage(
        items=[_project_summary(p, lang) for p in params.window(projects)],
        page=params.page,
        page_size=params.page_size,
        total=len(projects),
    )


@router.get("/projects/{slug}")
async def get_project(slug: SlugPath, lang: LangQuery = Lang.FR) -> ProjectDetail:
    for project in PROJECTS:
        if project.slug == slug and project.published:
            return _project_detail(project, lang)
    raise NotFound("Project not found.")