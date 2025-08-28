from django.urls import path
from .views import ping, lastfm_connect

urlpatterns = [
    path("ping/", ping),                    # GET  -> /api/ping/
    path("auth/lastfm/", lastfm_connect),   # POST -> /api/auth/lastfm/
]
