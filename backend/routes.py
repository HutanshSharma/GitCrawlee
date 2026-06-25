from fastapi import APIRouter

from crawlers.main import scraper
from crawlers.profile import extract as profile_scrap
from crawlers.pulls import extract as pull_scrap
from crawlers.repo import extract as repo_scrap
from crawlers.issue import extract as issue_scrap
from crawlers.commit import extract as commit_scrap
from crawlers.pulse import extract as pulse_scrap
from crawlers.get_all_repos import extract as get_repos
from backend.file_structure import get_repo_structure
from backend.schemas import (
    CommitsResponse,
    IssuesResponse,
    ProfileResponse,
    PullsResponse,
    PulseResponse,
    RepoInfoResponse,
    RepoListItem,
    RepoStructureResponse,
)

router = APIRouter()

repos_data = []


@router.get('/profile/{nickname}', response_model=ProfileResponse)
def profile(nickname: str) -> ProfileResponse:
    link = f"https://github.com/{nickname}?tab=repositories"
    data = scraper(link,profile_scrap)
    return data

@router.get('/pulls/{nickname}/{repository}', response_model=PullsResponse)
def pulls(nickname: str, repository: str) -> PullsResponse:
    link = f"https://github.com/{nickname}/{repository}/pulls"
    data = scraper(link,pull_scrap)
    return data

@router.get('/repo/{nickname}/{repository}', response_model=RepoInfoResponse)
def repo(nickname: str, repository: str) -> RepoInfoResponse:
    link = f"https://github.com/{nickname}/{repository}"
    data = scraper(link,repo_scrap)
    data["link"] = link
    return data

@router.get('/issues/{nickname}/{repository}', response_model=IssuesResponse)
def issues(nickname: str, repository: str) -> IssuesResponse:
    link = f"https://github.com/{nickname}/{repository}/issues"
    data = scraper(link,issue_scrap)
    return data

@router.get('/commits/{nickname}/{repository}', response_model=CommitsResponse)
def commits(nickname: str, repository: str) -> CommitsResponse:
    link = f"https://github.com/{nickname}/{repository}/commits/main/"
    data = scraper(link,commit_scrap)
    return data

@router.get('/pulse/{nickname}/{repository}', response_model=PulseResponse)
def pulse(nickname: str, repository: str) -> PulseResponse:
    link = f"https://github.com/{nickname}/{repository}/pulse"
    data = scraper(link,pulse_scrap)
    return data

@router.get('/home/{nickname}', response_model=list[RepoListItem])
def home(nickname: str) -> list[RepoListItem]:
    global repos_data
    mainlink = f"https://github.com/{nickname}?tab=repositories"
    data = scraper(mainlink,get_repos)
    i=2
    while(1):
        link = f"https://github.com/{nickname}?page={i}&tab=repositories"
        temp = scraper(link,get_repos)
        if temp:
            data.extend(temp)
        else:
            break
        i+=1

    repos_data = data
    return data

@router.get('/search/{keyword}', response_model=list[RepoListItem])
def search(keyword: str) -> list[RepoListItem]:
    keyword = keyword.lower()
    data = []
    for i in repos_data:
        if keyword in i["name"].lower() or keyword in i["description"].lower():
            data.append(i)

    return data

@router.get('/most_stared', response_model=list[RepoListItem])
def most_stared() -> list[RepoListItem]:
    sorted_data = sorted(repos_data,key = lambda x:-x['stars'])
    if len(sorted_data)>10:
        sorted_data = sorted_data[:10]

    return sorted_data

@router.get("/language/{lang}", response_model=list[RepoListItem])
def search_language(lang: str) -> list[RepoListItem]:
    lang = lang.lower()
    data = []
    for i in repos_data:
        if lang in i['most_used_language'].lower() or lang in i['languages']:
            data.append(i)

    return data

@router.get("/repo-structure/{username}/{repo}", response_model=RepoStructureResponse)
def repo_structure(username: str, repo: str) -> RepoStructureResponse:
    data = get_repo_structure(username,repo)
    return data



