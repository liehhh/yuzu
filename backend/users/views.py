from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile
from .serializers import UserProfileSerializer

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
