from rest_framework import serializers
from .models import UserProfile, WeeklyPick
from typing import List
from .utils import get_week_start
from django.utils import timezone


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id","lastfm_username","display_name","avatar_url","app_token"]
        read_only_fields = ["id","auth_token"]


class WeeklyPickSerializer(serializers.ModelSerializer):
    week_start = serializers.DateField(read_only=True)
    tracks = serializers.ListField()

    class Meta:
        model = WeeklyPick
        fields = ["week_start", "tracks"]
        read_only_fields = ["week_start"]

    def validate_tracks(self, value):
        if type(value) is not list or len(value) > 3:
            raise serializers.ValidationError("You can only pick 3 tracks")
        return value
    
    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")
        
        user = request.user
        week_start = get_week_start(timezone.now)

        obj, _created = WeeklyPick.objects.get_or_create(
            user=user,
            week_start=week_start,
            defaults={"tracks": []},
        )
        obj.tracks = validated_data["tracks"]
        obj.save()
        return obj
    
    def update(self, instance, validated_data):
        instance.tracks = validated_data["tracks"]
        instance.save()
        return instance