from .utils import safe_get_text


def extract(soup):
    commit_data = {}

    data = soup.find_all("div",class_="mt-0 prc-Timeline-TimelineBody-WWZY0")
    if data:
        for i in data:
            date = safe_get_text(i.select_one("h3"))
            date_stripped = date[11:] if len(date) > 11 else date
            ul = i.find('ul')
            li = ul.find_all('li') if ul else []
            commit_data[date_stripped] = len(li)
    return commit_data