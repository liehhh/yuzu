from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id","lastfm_username","display_name","avatar_url","auth_token"]
        read_only_fields = ["id","auth_token"]
