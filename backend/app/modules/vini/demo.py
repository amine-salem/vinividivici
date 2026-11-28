"""Demo data for the VINI stubs. Replaced by database tables in Sprint 1."""

from dataclasses import dataclass
from datetime import UTC, datetime

from app.modules.vini.schemas import VideoProvider

DEMO_TEXT_FR = "Texte de démonstration, remplacé plus tard par le vrai contenu."
DEMO_TEXT_AR = "نص تجريبي سيتم استبداله بالمحتوى الحقيقي."


@dataclass(frozen=True)
class DemoImage:
    url: str
    width: int
    height: int


def demo_image(width: int = 1200, height: int = 675) -> DemoImage:
    return DemoImage(url=f"https://placehold.co/{width}x{height}.webp?text=DEMO", width=width, height=height)


@dataclass(frozen=True)
class DemoService:
    slug: str
    name_fr: str
    name_ar: str
    position: int
    published: bool = True


@dataclass(frozen=True)
class DemoVideo:
    provider: VideoProvider
    video_id: str


@dataclass(frozen=True)
class DemoProject:
    slug: str
    title_fr: str
    title_ar: str
    thumbnail: DemoImage
    video: DemoVideo | None
    photos: tuple[DemoImage, ...]
    published_at: datetime
    published: bool = True


SERVICES: tuple[DemoService, ...] = (
    DemoService("production-video", "Production vidéo (DÉMO)", "إنتاج الفيديو (تجريبي)", position=1),
    DemoService("photographie", "Photographie (DÉMO)", "التصوير الفوتوغرافي (تجريبي)", position=2),
    DemoService("marketing-digital", "Marketing digital (DÉMO)", "التسويق الرقمي (تجريبي)", position=3),
    DemoService("service-brouillon", "Service brouillon (DÉMO)", "خدمة مسودة (تجريبي)", position=4, published=False),
)


def _project(number: int, day: int, video: DemoVideo | None, published: bool = True) -> DemoProject:
    return DemoProject(
        slug=f"projet-demo-{number}",
        title_fr=f"Projet {number} (DÉMO)",
        title_ar=f"مشروع {number} (تجريبي)",
        thumbnail=demo_image(),
        video=video,
        photos=(demo_image(1200, 900), demo_image(900, 1200)),
        published_at=datetime(2026, 10, day, 9, 0, tzinfo=UTC),
        published=published,
    )


PROJECTS: tuple[DemoProject, ...] = (
    _project(1, day=1, video=DemoVideo(VideoProvider.YOUTUBE, "DEMOvideo01")),
    _project(2, day=5, video=DemoVideo(VideoProvider.VIMEO, "100000002")),
    _project(3, day=9, video=None),
    _project(4, day=14, video=DemoVideo(VideoProvider.YOUTUBE, "DEMOvideo04")),
    _project(5, day=20, video=None),
    _project(6, day=25, video=None, published=False),
)