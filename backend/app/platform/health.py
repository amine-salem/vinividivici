from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health/live")
async def live() -> dict[str, str]:
    """The process is running. It does not check the database (that is /health/ready)."""
    return {"status": "ok"}