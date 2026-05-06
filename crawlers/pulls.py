from .utils import parse_number, safe_get_text


def extract(soup):
    pulls = {
        "open":0,
        "closed":0,
        "milestones":0,
        "labels":0
    }
    div = soup.find('div',id="js-issues-toolbar")
    if div:
        anchor = div.find_all("a",href=lambda href: href and '/pulls' in href)
        if anchor:
            open_text = safe_get_text(anchor[0])
            closed_text = safe_get_text(anchor[1])
            pulls['open'] = int(parse_number(open_text.split(' ')[0] if open_text else ""))
            pulls['closed'] = int(parse_number(closed_text.split(' ')[0] if closed_text else ""))

    milestones = soup.find('a',href=lambda href: href and '/milestones' in href)
    if milestones:
        milestones_number = safe_get_text(milestones.select_one('span'))
        pulls['milestones'] = int(parse_number(milestones_number))
    labels = soup.find('a',href=lambda href: href and '/labels' in href)
    if labels:
        labels_number = safe_get_text(labels.select_one('span'))
        pulls['labels'] = int(parse_number(labels_number))
    
    return pulls
