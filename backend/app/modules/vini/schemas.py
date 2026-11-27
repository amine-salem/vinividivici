"""Public shapes of the VINI studio: services and portfolio projects."""

from datetime import datetime
from enum import StrEnum

from pydantic import Field

from app.platform.api import Image, ItemList, Page, Schema


class Service(Schema):
    slug: str
    name: str
    description: str


class ServiceList(ItemList[Service]):
    """All published services, in display order."""


class VideoProvider(StrEnum):
    YOUTUBE = "youtube"
    VIMEO = "vimeo"


class Video(Schema):
    provider: VideoProvider
    video_id: str
    embed_url: str = Field(description="Ready to use as <iframe src>. YouTube uses youtube-nocookie.com.")


class ProjectSummary(Schema):
    """A project as shown in the portfolio grid."""

    slug: str
    title: str
    summary: str
    thumbnail: Image
    published_at: datetime


class ProjectPage(Page[ProjectSummary]):
    """Published projects, newest first."""


class ProjectDetail(ProjectSummary):
    """A project page: everything in the summary, plus the full content."""

    description: str
    video: Video | None
    photos: list[Image]