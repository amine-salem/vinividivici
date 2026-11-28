from app.export_openapi import CONTRACT, build


def test_contract_file_is_up_to_date() -> None:
    """Fails when a schema or route changed and contract/openapi.json was not re-exported."""
    assert CONTRACT.read_text(encoding="utf-8") == build(), (
        "The contract is out of date: run `python -m app.export_openapi` and commit contract/openapi.json"
    )