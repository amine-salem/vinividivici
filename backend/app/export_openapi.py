"""Writes the API contract to contract/openapi.json. Run from backend/: python -m app.export_openapi"""

import json
from pathlib import Path

from app.main import create_app
from app.platform.config import Settings

CONTRACT = Path(__file__).resolve().parents[2] / "contract" / "openapi.json"


def build() -> str:
    """The contract as text: sorted keys and fixed indentation, so diffs stay readable."""
    schema = create_app(Settings(_env_file=None)).openapi()
    return json.dumps(schema, indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def main() -> None:
    CONTRACT.parent.mkdir(exist_ok=True)
    CONTRACT.write_text(build(), encoding="utf-8", newline="\n")
    print(f"Wrote {CONTRACT}")


if __name__ == "__main__":
    main()