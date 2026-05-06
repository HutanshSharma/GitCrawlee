from .utils import safe_get_text


def extract(soup):
    data = safe_get_text(soup.find('pre'))
    return data
