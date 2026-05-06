from .utils import parse_number, safe_get_text

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

    branch = soup.find_all('a',href=lambda href: href and '/branches' in href)
    if len(branch) > 1:
        branch_count = branch[1].find('strong')
        if branch_count:
            repo_info['branches'] = parse_number(safe_get_text(branch_count))

    watchers = soup.find('a',href=lambda href: href and '/watchers' in href)
    if watchers:
        watchers_element = watchers.find('span')
        if not watchers_element:
            watchers_element = watchers.find('strong')
        if watchers_element:
            repo_info['watchers'] = parse_number(safe_get_text(watchers_element))
    
    fork_element = soup.find('a',href=lambda href: href and '/forks' in href)
    if fork_element:
        forks_count_element = fork_element.find('span')
        if not forks_count_element:
            forks_count_element = fork_element.find('strong')
        if forks_count_element:
            repo_info['forks'] = parse_number(safe_get_text(forks_count_element))

    stars_element = soup.find('a', href=lambda href: href and '/stargazers' in href)
    if stars_element:
        stars_count_element = stars_element.find('span')
        if not stars_count_element:
            stars_count_element = stars_element.find('strong')
        if stars_count_element:
            repo_info['stars'] = parse_number(safe_get_text(stars_count_element))

    temp = soup.find('h2',string='Languages')
    if temp:
        languages_list = temp.find_next_sibling('ul', class_='list-style-none')
        if languages_list:
            language_items = languages_list.find_all('li')
            for item in language_items:
                language_name = safe_get_text(item.find('span', class_='color-fg-default'))
                language_percentage = safe_get_text(item.find('span', class_=None))
                repo_info['languages'].append({
                    'name': language_name,
                    'percentage': language_percentage
                })

    sidebar = soup.find('div',class_="Layout-sidebar")
    if sidebar:
        p = sidebar.find('p')
        if p:
            description = safe_get_text(p)
            repo_info['description'] = description
        topic_a = sidebar.find_all('a',href=lambda href: href and '/topics' in href)
        topics = []
        if topic_a:
            for i in topic_a:
                text = safe_get_text(i)
                topics.append(text)
            
            repo_info['topics'] = topics
            

    return repo_info

