from .utils import (
    parse_number,
    text_by_labels,
    text_by_selectors,
)

import re

def extract(soup):
    pulls = {
        "open":0,
        "closed":0,
        "milestones":0,
        "labels":0
    }
    search_root = soup
    for tag in search_root.select("a[href*='/pulls']"):
        text = tag.get_text(" ", strip=True)
        match = re.search(r"\d+", text)
        if not match:
            continue

        count = int(match.group())

        if "Open" in text:
            pulls["open"] = count
        elif "Closed" in text:
            pulls["closed"] = count

    milestones_number = text_by_selectors(
        search_root,
        [
            "a[href*='/milestones'] span",
            "a[href*='/milestones'] strong",
        ],
    ) or text_by_labels(search_root, ["Milestones"])
    if milestones_number:
        pulls['milestones'] = int(parse_number(milestones_number))

    labels_number = text_by_selectors(
        search_root,
        [
            "a[href*='/labels'] span",
            "a[href*='/labels'] strong",
        ],
    ) or text_by_labels(search_root, ["Labels"])
    if labels_number:
        pulls['labels'] = int(parse_number(labels_number))
    
    return pulls
