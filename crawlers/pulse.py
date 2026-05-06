from .utils import parse_number, safe_get_text

def extract(soup):
    data = {
        "merges_data":{
            "authors":1,
            "commits_pushed_to_main":0,
            "commits_pushed_to_all_branches":0,
            "files_changed":0,
            "additions":0,
            "deletions":0,
        },
        "merged_pull":{
            "Pull requests":0,
            "merged by":0
        },
        "proposed_pull":{
            "Pull requests":0,
            "opened by":0
        },
        "closed_issues":{
            "issues":0,
            "closed by":0
        },
        "new_issues":{
            "issues":0,
            "opened by":0
        },
        "active_discussions":0
    }

    p = soup.find("div",class_="js-pulse-contribution-data")
    if p:
        strongs = p.find_all("strong")
        strong_data = list()
        for i in strongs:
            text = safe_get_text(i)
            strong_data.append(text)

        if len(strong_data) >= 7:
            merges_data = {
                "authors": strong_data[0],
                "commits_pushed_to_main": strong_data[1],
                "commits_pushed_to_all_branches": strong_data[2],
                "files_changed": strong_data[3],
                "additions": strong_data[4],
                "deletions": strong_data[6]
            }
            data['merges_data'] = merges_data

    merged_pull_requests = soup.find("h3",id="merged-pull-requests")
    if merged_pull_requests:
        mpr_span = merged_pull_requests.find("span")
        mpr_inner_spans = mpr_span.find_all('span') if mpr_span else []
        if len(mpr_inner_spans) >= 2:
            mpr = {
                "Pull requests": parse_number(safe_get_text(mpr_inner_spans[0])),
                "merged by": parse_number(safe_get_text(mpr_inner_spans[1]))
            }
            data["merged_pull"] = mpr

    proposed_pull_requests = soup.find("h3",id="proposed-pull-requests")
    if proposed_pull_requests:
        ppr_span = proposed_pull_requests.find("span")
        ppr_inner_spans = ppr_span.find_all('span') if ppr_span else []
        if len(ppr_inner_spans) >= 2:
            ppr = {
                "Pull requests": parse_number(safe_get_text(ppr_inner_spans[0])),
                "opened by": parse_number(safe_get_text(ppr_inner_spans[1]))
            }
            data["proposed_pull"] = ppr

    closed_issues = soup.find("h3",id="closed-issues")
    if closed_issues:
        ci_span = closed_issues.find("span")
        ci_inner_spans = ci_span.find_all('span') if ci_span else []
        if len(ci_inner_spans) >= 2:
            ci = {
                "issues": parse_number(safe_get_text(ci_inner_spans[0])),
                "closed by": parse_number(safe_get_text(ci_inner_spans[1]))
            }
            data["closed_issues"] = ci

    new_issues = soup.find("h3",id="new-issues")
    if new_issues:
        ni_span = new_issues.find("span")
        ni_inner_spans = ni_span.find_all('span') if ni_span else []
        if len(ni_inner_spans) >= 2:
            ni = {
                "issues": parse_number(safe_get_text(ni_inner_spans[0])),
                "opened by": parse_number(safe_get_text(ni_inner_spans[1]))
            }
            data["new_issues"] = ni

    active_discussions = soup.find("h3",class_="conversation-list-heading")
    if active_discussions:
        ad_span = parse_number(
            safe_get_text(active_discussions.find("span", class_="text-emphasized"))
        )
        data["active_discussions"] = ad_span

    return data