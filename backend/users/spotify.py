import base64
import time
import requests
from django.conf import settings

_token_cache = {"access_token": None, "exp": 0}

def _fetch_app_token():
    if not settings.SPOTIFY_CLIENT_ID or not settings.SPOTIFY_CLIENT_SECRET:
        raise RuntimeError("Missing SPOTIFY_CLIENT_ID/SECRET")

    auth = f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}"
    b64 = base64.b64encode(auth.encode()).decode()

    r = requests.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "client_credentials"},
        headers={
            "Authorization": f"Basic {b64}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout=10,
    )
    r.raise_for_status()
    j = r.json()
    _token_cache["access_token"] = j["access_token"]
    _token_cache["exp"] = time.time() + j.get("expires_in", 3600) - 30

def _app_token():
    if not _token_cache["access_token"] or time.time() > _token_cache["exp"]:
        _fetch_app_token()
    return _token_cache["access_token"]

def search_tracks(q: str, limit: int = 15, market: str = "US"):
    token = _app_token()
    r = requests.get(
        "https://api.spotify.com/v1/search",
        params={"q": q, "type": "track", "limit": limit, "market": market},
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    )
    r.raise_for_status()
    items = r.json().get("tracks", {}).get("items", []) or []

    results = []
    for t in items:
        album = t.get("album", {}) or {}
        images = album.get("images") or []
        # smallest image (last) if available
        img = images[-1]["url"] if images else None
        results.append({
            "id": t["id"],
            "name": t["name"],
            "artist": ", ".join(a["name"] for a in t.get("artists", [])),
            "album": album.get("name"),
            "image": img,
            "preview_url": t.get("preview_url"),
            "url": t.get("external_urls", {}).get("spotify"),
            "uri": t.get("uri"),
        })
    return results
