import requests

_RAW = "https://raw.githubusercontent.com"
_CANDIDATES = [
    "README.md", "readme.md", "README.MD", "Readme.md",
    "README.markdown", "README.rst", "README.txt", "README",
]


def fetch_readme(owner, repo, branch):
    for name in _CANDIDATES:
        url = f"{_RAW}/{owner}/{repo}/{branch}/{name}"
        try:
            response = requests.get(url, timeout=15)
        except requests.RequestException:
            continue
        if response.status_code == 200 and response.text.strip():
            return response.text
    return ""
