from .utils import (
    find_section_by_heading,
    parse_number,
    safe_get_text,
    text_by_labels,
    text_by_selectors,
)

def extract(soup):
    
    repo_info = {
        "stars": "N/A",
        "forks": "N/A",
        "watchers": 'N/A',
        "description": '',
        "branches": 'N/A',
        "languages": [],
        "topics":[]
    }   

    branches_text = text_by_selectors(
        soup,
        [
            "a[href$='/branches'] strong",
            "a[href$='/branches'] span",
            "a[href*='/branches'] strong",
            "a[href*='/branches'] span",
        ],
    ) or text_by_labels(soup, ["Branches"])
    repo_info['branches'] = parse_number(branches_text) if branches_text else repo_info['branches']

    watchers_text = text_by_selectors(
        soup,
        [
            "a[href$='/watchers'] strong",
            "a[href$='/watchers'] span",
            "a[href*='/watchers'] strong",
            "a[href*='/watchers'] span",
        ],
    ) or text_by_labels(soup, ["Watchers", "Watching"])
    repo_info['watchers'] = parse_number(watchers_text) if watchers_text else repo_info['watchers']

    forks_text = text_by_selectors(
        soup,
        [
            "a[href$='/forks'] strong",
            "a[href$='/forks'] span",
            "a[href*='/forks'] strong",
            "a[href*='/forks'] span",
        ],
    ) or text_by_labels(soup, ["Forks", "Fork"])
    repo_info['forks'] = parse_number(forks_text) if forks_text else repo_info['forks']

    stars_text = text_by_selectors(
        soup,
        [
            "a[href$='/stargazers'] strong",
            "a[href$='/stargazers'] span",
            "a[href*='/stargazers'] strong",
            "a[href*='/stargazers'] span",
        ],
    ) or text_by_labels(soup, ["Stars", "Star"])
    repo_info['stars'] = parse_number(stars_text) if stars_text else repo_info['stars']

    languages_section = find_section_by_heading(soup, ["Languages"])
    if languages_section:
        languages_list = languages_section.find('ul', class_='list-style-none')
        if languages_list:
            language_items = languages_list.find_all('li')
            for item in language_items:
                language_name = safe_get_text(item.find('span', class_='color-fg-default'))
                language_percentage = safe_get_text(item.find('span', class_=None))
                repo_info['languages'].append({
                    'name': language_name,
                    'percentage': language_percentage
                })

    sidebar = soup.find('div', class_="Layout-sidebar")
    if sidebar:
        p = sidebar.find('p')
        if p:
            description = safe_get_text(p)
            repo_info['description'] = description
        topic_a = sidebar.find_all('a', href=lambda href: href and '/topics' in href)
        topics = []
        if topic_a:
            for i in topic_a:
                text = safe_get_text(i)
                topics.append(text)
            repo_info['topics'] = topics
            

    return repo_info

