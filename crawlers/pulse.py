from .utils import parse_number, safe_get_text
import re

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

    search_root = soup

    p = soup.find_all(
        "div",
        class_=re.compile(r"PulseSummary-module__summaryBox")
    )
    if p:
        strongs = p[0].find_all("strong")
        strong_data = list()
        for i in strongs:
            text = safe_get_text(i)
            strong_data.append(text)

        if len(strong_data) >= 7:
            merges_data = {
                "authors": parse_number(strong_data[0]),
                "commits_pushed_to_main": parse_number(strong_data[1]),
                "commits_pushed_to_all_branches": parse_number(strong_data[2]),
                "files_changed": parse_number(strong_data[3]),
                "additions": parse_number(strong_data[4]),
                "deletions": parse_number(strong_data[6]),
            }
            data['merges_data'] = merges_data

    merged_pull_requests = search_root.find("h3",id="merged-pull-requests")
    if merged_pull_requests:
        mpr_span = merged_pull_requests.find("span")
        mpr_inner_strongs = mpr_span.find_all('strong') if mpr_span else []
        if len(mpr_inner_strongs) >= 2:
            mpr = {
                "Pull requests": parse_number(safe_get_text(mpr_inner_strongs[0])),
                "merged by": parse_number(safe_get_text(mpr_inner_strongs[1]))
            }
            data["merged_pull"] = mpr

    proposed_pull_requests = search_root.find("h3",id="opened-pull-requests")
    if proposed_pull_requests:
        opr_span = proposed_pull_requests.find("span")
        opr_inner_strongs = opr_span.find_all('strong') if opr_span else []
        if len(opr_inner_strongs) >= 2:
            ppr = {
                "Pull requests": parse_number(safe_get_text(opr_inner_strongs[0])),
                "opened by": parse_number(safe_get_text(opr_inner_strongs[1]))
            }
            data["proposed_pull"] = ppr

    closed_issues = search_root.find("h3",id="closed-issues")
    if closed_issues:
        ci_span = closed_issues.find("span")
        ci_inner_strongs = ci_span.find_all('strong') if ci_span else []
        if len(ci_inner_strongs) >= 2:
            ci = {
                "issues": parse_number(safe_get_text(ci_inner_strongs[0])),
                "closed by": parse_number(safe_get_text(ci_inner_strongs[1]))
            }
            data["closed_issues"] = ci

    new_issues = search_root.find("h3",id="opened-issues")
    if new_issues:
        oi_span = new_issues.find("span")
        oi_inner_strongs = oi_span.find_all('strong') if oi_span else []
        if len(oi_inner_strongs) >= 2:
            ni = {
                "issues": parse_number(safe_get_text(oi_inner_strongs[0])),
                "opened by": parse_number(safe_get_text(oi_inner_strongs[1]))
            }
            data["new_issues"] = ni

    active_discussions = search_root.find("h3",class_="unresolved-conversations")
    if active_discussions:
        ad_span = active_discussions.find("span")
        ad_strong = ad_span.find("strong") if ad_span else 0
        data["active_discussions"] = parse_number(safe_get_text(ad_strong))

    return data