from datetime import datetime
from typing import Any, Optional


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return " ".join(value.split())


def safe_get_text(element: Any, default: str = "") -> str:
    if not element:
        return default
    return clean_text(element.get_text(strip=True))


def safe_get_attr(element: Any, attr: str, default: str = "") -> str:
    if not element:
        return default
    return element.get(attr, default)


def parse_number(value: Optional[str]) -> float:
    if value is None:
        return 0.0
    text = clean_text(str(value)).lower().replace(",", "")
    if not text:
        return 0.0
    multipliers = {
        "k": 1_000,
        "m": 1_000_000,
        "b": 1_000_000_000,
    }
    suffix = text[-1]
    if suffix in multipliers:
        try:
            return float(text[:-1]) * multipliers[suffix]
        except ValueError:
            return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def parse_date(value: Optional[str]) -> str:
    if value is None:
        return ""
    text = clean_text(str(value))
    if not text:
        return ""
    patterns = [
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%d %H:%M:%S %Z",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ]
    for pattern in patterns:
        try:
            return datetime.strptime(text, pattern).isoformat()
        except ValueError:
            continue
    return text
