from .utils import (
    find_section_by_heading_with_listitem,
    parse_number,
    parse_date,
    safe_get_attr,
    safe_get_text,
)

def extract(soup):
    data = {}

    username = safe_get_text(soup.select_one("span.p-name"))
    if username:
        data['username'] = username
    nickname = safe_get_text(soup.select_one("span.p-nickname"))
    if nickname:
        data['nickname'] = nickname

    if nickname:
        followersanchor = soup.find("a", {"href": f"https://github.com/{nickname}?tab=followers"})
        if followersanchor:
            followers = safe_get_text(followersanchor.select_one("span"))
            data['followers'] = followers

        followinganchor = soup.find("a", {"href": f"https://github.com/{nickname}?tab=following"})
        if followinganchor:
            following = safe_get_text(followinganchor.select_one("span"))
            data['following'] = following

    repos = soup.find(
        "ul",
        {
            "data-filterable-for": "your-repos-filter",
            "data-filterable-type": "substring",
        },
    )
    if not repos:
        repos = find_section_by_heading_with_listitem(
            soup, ["Repositories", "Popular repositories"]
        )

    if repos:
        repo_items = repos.find_all('li')

        repolist = list()
        for i in repo_items:
            repo = dict()
            repo_name = safe_get_text(i.select_one("a"))
            lang_tag = i.select_one('span[itemprop="programmingLanguage"]')
            most_used_language = safe_get_text(lang_tag, "N/A")
            updated_at = parse_date(safe_get_attr(i.select_one("relative-time"), "title"))
            description = i.select_one('p[itemprop="description"]')
            description_text = safe_get_text(description)
            star_tag = i.find("a",href=lambda href: href and '/stargazers' in href)
            stars = parse_number(safe_get_text(star_tag))
            languages = i.select_one("div.topics-row-container")
            langanchor = languages.select("a") if languages else []
            langlist = [safe_get_text(j) for j in langanchor]

            repo['name']=repo_name
            repo['updated_at'] = updated_at
            repo['stars'] = stars
            repo['languages'] = langlist
            repo['most_used_language'] = most_used_language
            repo['description'] = description_text
            repolist.append(repo)
        
        data['repos_list']=repolist

    return data

