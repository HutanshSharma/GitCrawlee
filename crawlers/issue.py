from .utils import (
    find_section_by_heading,
    parse_number,
    text_by_labels,
    text_by_selectors,
)


def extract(soup):
    issues = {
        "open":0,
        "closed":0
    }

    issues_section = find_section_by_heading(soup, ["Issues"])
    search_root = issues_section if issues_section else soup
    open_text = text_by_selectors(
        search_root,
        [
            "a[href*='/issues'] span",
            "a[href*='/issues'] strong",
        ],
    ) or text_by_labels(search_root, ["Open"])
    closed_text = text_by_selectors(
        search_root,
        [
            "a[href*='/issues'] span",
            "a[href*='/issues'] strong",
        ],
    ) or text_by_labels(search_root, ["Closed"])
    if open_text:
        issues['open'] = int(parse_number(open_text))
    if closed_text:
        issues['closed'] = int(parse_number(closed_text))

    return issues