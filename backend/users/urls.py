from django.urls import path
from .views import ping, lastfm_connect, spotify_search, current_week_picks

urlpatterns = [
    path("ping/", ping),                    # GET  -> /api/ping/
    path("auth/lastfm/", lastfm_connect),   # POST -> /api/auth/lastfm/
    path("search/", spotify_search),
    path("picks/current/", current_week_picks),
]
