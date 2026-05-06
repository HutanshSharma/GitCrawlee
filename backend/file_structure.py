import io
import os
import shutil
import tempfile
import zipfile

import requests
from bs4 import BeautifulSoup

def build_tree(path):
    tree = {}
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            tree[item] = build_tree(item_path)
        else:
            tree[item] = None
    return tree


def get_default_branch(owner, repo, fallback="main"):
    url = f"https://github.com/{owner}/{repo}"
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
    except requests.RequestException:
        return fallback

    soup = BeautifulSoup(response.text, "html.parser")
    meta = soup.find(
        "meta", {"property": "octolytics-dimension-repository_default_branch"}
    )
    if meta and meta.get("content"):
        return meta["content"]
    return fallback


def get_archive_root(z: zipfile.ZipFile) -> str:
    top_levels = {name.split("/")[0] for name in z.namelist() if "/" in name}
    if not top_levels:
        return ""
    return sorted(top_levels)[0]


def get_repo_structure(owner, repo, branch=None):
    branch = branch or get_default_branch(owner, repo)
    url = f"https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip"
    response = requests.get(url)
    response.raise_for_status()

    temp_dir = tempfile.mkdtemp(prefix="repo_temp_")
    try:
        with zipfile.ZipFile(io.BytesIO(response.content)) as z:
            z.extractall(temp_dir)
            root_folder = get_archive_root(z)

        base_path = os.path.join(temp_dir, root_folder) if root_folder else temp_dir
        file_tree = build_tree(base_path)
        return file_tree
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

