"""baseline

Revision ID: 708ec76c198e
Revises: 
Create Date: 2026-11-02 13:43:39.270552

"""
from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = '708ec76c198e'
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
