from .utils import find_section_by_heading, safe_get_text


def extract(soup):
    commit_data = {}

    commits_section = find_section_by_heading(soup, ["Commits"])
    search_root = commits_section if commits_section else soup

    data = search_root.find_all("div",class_="mt-0 prc-Timeline-TimelineBody-WWZY0")
    if data:
        for i in data:
            date = safe_get_text(i.select_one("h3"))
            date_stripped = date[11:] if len(date) > 11 else date
            ul = i.find('ul')
            li = ul.find_all('li') if ul else []
            commit_data[date_stripped] = len(li)
    return commit_data