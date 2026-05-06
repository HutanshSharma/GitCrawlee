from .utils import (
    find_section_by_heading,
    parse_number,
    text_by_labels,
    text_by_selectors,
)

def extract(soup):
    pulls = {
        "open":0,
        "closed":0,
        "milestones":0,
        "labels":0
    }
    pulls_section = find_section_by_heading(soup, ["Pull requests", "Pulls"])
    search_root = pulls_section if pulls_section else soup
    open_text = text_by_selectors(
        search_root,
        [
            "a[href*='/pulls'] span",
            "a[href*='/pulls'] strong",
        ],
    ) or text_by_labels(search_root, ["Open"])
    closed_text = text_by_selectors(
        search_root,
        [
            "a[href*='/pulls'] span",
            "a[href*='/pulls'] strong",
        ],
    ) or text_by_labels(search_root, ["Closed"])
    if open_text:
        pulls['open'] = int(parse_number(open_text.split(' ')[0] if open_text else ""))
    if closed_text:
        pulls['closed'] = int(parse_number(closed_text.split(' ')[0] if closed_text else ""))

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
