from typing import Any, Dict, List, Union
from pydantic import BaseModel, Field

class RepoListItem(BaseModel):
    name: str = ""
    description: str = ""
    stars: float = 0.0
    most_used_language: str = "N/A"
    languages: List[str] = Field(default_factory=list)
    updated_at: str = ""


class ProfileResponse(BaseModel):
    username: str = ""
    nickname: str = ""
    followers: str = "0"
    following: str = "0"
    repos_list: List[RepoListItem] = Field(default_factory=list)


class RepoLanguageBreakdown(BaseModel):
    name: str = ""
    percentage: str = "0%"


class RepoInfoResponse(BaseModel):
    stars: Union[float, str] = "N/A"
    forks: Union[float, str] = "N/A"
    watchers: Union[float, str] = "N/A"
    description: str = ""
    branches: Union[float, str] = "N/A"
    languages: List[RepoLanguageBreakdown] = Field(default_factory=list)
    topics: List[str] = Field(default_factory=list)
    link: str = ""


class IssuesResponse(BaseModel):
    open: int = 0
    closed: int = 0


class PullsResponse(BaseModel):
    open: int = 0
    closed: int = 0
    milestones: int = 0
    labels: int = 0


class PulseMergesData(BaseModel):
    authors: float = 1.0
    commits_pushed_to_main: float = 0.0
    commits_pushed_to_all_branches: float = 0.0
    files_changed: float = 0.0
    additions: float = 0.0
    deletions: float = 0.0


class PulseMergedPullStats(BaseModel):
    model_config = {"populate_by_name": True}

    pull_requests: float = Field(0.0, alias="Pull requests")
    merged_by: float = Field(0.0, alias="merged by")


class PulseProposedPullStats(BaseModel):
    model_config = {"populate_by_name": True}

    pull_requests: float = Field(0.0, alias="Pull requests")
    opened_by: float = Field(0.0, alias="opened by")


class PulseClosedIssuesStats(BaseModel):
    model_config = {"populate_by_name": True}

    issues: float = 0.0
    closed_by: float = Field(0.0, alias="closed by")


class PulseNewIssuesStats(BaseModel):
    model_config = {"populate_by_name": True}

    issues: float = 0.0
    opened_by: float = Field(0.0, alias="opened by")


class PulseResponse(BaseModel):
    merges_data: PulseMergesData = Field(default_factory=PulseMergesData)
    merged_pull: PulseMergedPullStats = Field(default_factory=PulseMergedPullStats)
    proposed_pull: PulseProposedPullStats = Field(default_factory=PulseProposedPullStats)
    closed_issues: PulseClosedIssuesStats = Field(default_factory=PulseClosedIssuesStats)
    new_issues: PulseNewIssuesStats = Field(default_factory=PulseNewIssuesStats)
    active_discussions: float = 0.0


RepoStructureResponse = Dict[str, Any]
CommitsResponse = Dict[str, int]
ReadmeResponse = str
