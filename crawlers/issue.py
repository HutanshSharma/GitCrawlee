def extract(soup):
    issues = {"open": 0, "closed": 0}

    for a in soup.select("a[href*='/issues']"):
        title = a.find("div")
        count = a.find("span", attrs={"aria-hidden": "true"})

        if not title or not count:
            continue

        key = title.get_text(strip=True).lower()
        if key in issues:
            issues[key] = int(count.get_text(strip=True))

    return issues