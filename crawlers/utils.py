from datetime import datetime
from typing import Any, Iterable, Optional


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


def first_by_selectors(soup: Any, selectors: Iterable[str]) -> Any:
    for selector in selectors:
        element = soup.select_one(selector)
        if element:
            return element
    return None


def text_by_selectors(soup: Any, selectors: Iterable[str], default: str = "") -> str:
    return safe_get_text(first_by_selectors(soup, selectors), default)


def text_by_labels(soup: Any, labels: Iterable[str], default: str = "") -> str:
    for label in labels:
        label_lower = label.lower()
        tag = soup.find(
            lambda t: t.name in {"a", "button", "summary", "span"}
            and label_lower in t.get_text(strip=True).lower()
        )
        if not tag:
            continue
        count_el = tag.find(["strong", "span"])
        if count_el:
            return safe_get_text(count_el)
        return safe_get_text(tag)
    return default


def find_section_by_heading(soup: Any, headings: Iterable[str]) -> Any:
    for heading in headings:
        heading_lower = heading.lower()
        header = soup.find(
            lambda t: t.name in {"h1", "h2", "h3", "h4", "h5", "h6"}
            and heading_lower == t.get_text(strip=True).lower()
        )
        if not header:
            header = soup.find(
                lambda t: t.name in {"h1", "h2", "h3", "h4", "h5", "h6"}
                and heading_lower in t.get_text(strip=True).lower()
            )
        if header:
            return header.parent or header
    return None


def find_section_by_heading_with_listitem(
    soup: Any, headings: Iterable[str]
) -> Any:
    section = find_section_by_heading(soup, headings)
    if not section:
        return None
    list_node = section.find("ul") or section.find("ol")
    if list_node:
        return list_node
    list_item = section.find("li")
    return list_item.parent if list_item and list_item.parent else section


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
