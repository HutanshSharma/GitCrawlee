from .utils import parse_number, safe_get_text


def extract(soup):
    issues = {
        "open":0,
        "closed":0
    }

    div = soup.find('div',class_="ListItems-module__listContainer--sgptj")
    if div:
        anchor = div.find_all("a",href=lambda href: href and '/issues' in href)
        if anchor:
            open_text = safe_get_text(anchor[0].select_one('span'))
            closed_text = safe_get_text(anchor[1].select_one('span'))
            issues['open'] = int(parse_number(open_text))
            issues['closed'] = int(parse_number(closed_text))

    return issues