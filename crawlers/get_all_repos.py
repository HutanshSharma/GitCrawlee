from .utils import (
    find_section_by_heading_with_listitem,
    parse_number,
    parse_date,
    safe_get_attr,
    safe_get_text,
)

def extract(soup):
    div = soup.find("div", id="user-repositories-list")
    if not div:
        div = find_section_by_heading_with_listitem(
            soup, ["Repositories", "All repositories", "Popular repositories"]
        )
    data = []
    if div:
        ul = div.find("ul") if div else None
        if ul:
            li = ul.find_all('li')
            if li:
                for i in li:
                    repo = i.select_one('a')
                    repo_name = safe_get_text(repo)
                    repo_description = i.find("p",{"itemprop":"description"})
                    description = safe_get_text(repo_description)
                    star_tag = i.find("a",href=lambda href: href and '/stargazers' in href)
                    stars = parse_number(safe_get_text(star_tag))
                    lang_tag = i.select_one('span[itemprop="programmingLanguage"]')
                    most_used_language = safe_get_text(lang_tag, "N/A")
                    languages = i.select_one("div.topics-row-container")
                    langanchor = languages.select("a") if languages else []
                    langlist = [safe_get_text(j).lower() for j in langanchor]
                    updated_at = parse_date(safe_get_attr(i.select_one("relative-time"), "title"))

                    data.append({'name':repo_name,
                                 'description':description,
                                 'stars':stars,
                                 'most_used_language':most_used_language,
                                 "languages":langlist,
                                 "updated_at":updated_at})

    return data