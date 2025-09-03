from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile
from .serializers import UserProfileSerializer, WeeklyPickSerializer
from .spotify import search_tracks
from .utils import get_week_start
from django.utils import timezone
from .models import WeeklyPick
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

@api_view(["GET"])
def ping(request):
    return Response({"ok": True})


@api_view(["POST"])
@permission_classes([AllowAny])
def lastfm_connect(request):
    data = request.data or {}
    raw = (data.get("lastfm_username") or "").strip()
    if not raw:
        return Response({"detail": "lastfm_username required"}, status=400)

    lfm = raw.lower()
    avatar_url = data.get("avatar_url")

    User = get_user_model()
    user, created = User.objects.get_or_create(username=lfm)

    # App users don't use a local password
    if created or not user.has_usable_password():
        user.set_unusable_password()

    # Persist avatar if providedd
    if avatar_url and user.avatar_url != avatar_url:
        user.avatar_url = avatar_url

    if created or avatar_url:
        user.save()

    # DRF token auth
    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "id": user.id,
            "auth_token": token.key,
            "username": user.username,     # this IS the Last.fm username
            "avatar_url": user.avatar_url,
        },
        status=200,
    )


@api_view(["GET"])
def spotify_search(request):
    q = (request.query_params.get("q") or "").strip()
    if not q:
        return Response({"results": []})
    try:
        results = search_tracks(q, limit=15, market="US")
        return Response({"results": results})
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
    
    
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])   
def current_week_picks(request):
    week_start = get_week_start()
    obj, _created = WeeklyPick.objects.get_or_create(
        user=request.user,
        week_start=week_start,
        defaults={"tracks": []},
    )
    if request.method == "GET":
        ser = WeeklyPickSerializer(obj)
        return Response(ser.data, status=status.HTTP_200_OK)
    
    payload = {"tracks": request.data.get("tracks", [])}
    ser = WeeklyPickSerializer(instance=obj, data=payload, context={"request": request})
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data, status=status.HTTP_200_OK)
