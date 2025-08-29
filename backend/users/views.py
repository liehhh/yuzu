from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile
from .serializers import UserProfileSerializer, WeeklyPickSerializer
from .spotify import search_tracks
from .utils import get_week_start
from django.utils import timezone
from .models import WeeklyPick

@api_view(["GET"])
def ping(request):
    return Response({"ok": True})

@csrf_exempt
@api_view(["POST"])
def lastfm_connect(request):
    username = request.data.get("lastfm_username")
    display_name = request.data.get("display_name", "")
    avatar_url = request.data.get("avatar_url", "")
    if not username:
        return Response({"detail":"lastfm_username required"}, status=status.HTTP_400_BAD_REQUEST)
    profile, _ = UserProfile.objects.update_or_create(
        lastfm_username=username,
        defaults={"display_name": display_name, "avatar_url": avatar_url},
    )
    return Response(UserProfileSerializer(profile).data, status=status.HTTP_200_OK)

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
