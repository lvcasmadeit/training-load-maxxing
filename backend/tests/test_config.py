import pytest

from app.config import DEFAULT_CORS_ORIGINS, get_cors_origins


def test_cors_defaults_are_explicit_local_origins() -> None:
    assert get_cors_origins("") == list(DEFAULT_CORS_ORIGINS)
    assert "*" not in get_cors_origins("")


def test_cors_origins_accept_a_comma_separated_production_setting() -> None:
    assert get_cors_origins(" https://squadpulse.example,https://admin.example/ ") == [
        "https://squadpulse.example",
        "https://admin.example",
    ]


def test_cors_origins_reject_wildcards() -> None:
    with pytest.raises(ValueError, match="Wildcard CORS"):
        get_cors_origins("*")
