from django.db import models
import secrets
from django.conf import settings
from .utils import get_week_start
from django.contrib.auth.models import AbstractUser


class UserProfile(AbstractUser):
    username = None  # remove default username

    lastfm_username = models.CharField(max_length=64, unique=True)
    display_name = models.CharField(max_length=255, blank=True, default="")
    avatar_url = models.URLField(blank=True, null=True)
    auth_token = models.CharField(max_length=128, unique=True, default="", editable=False)

    USERNAME_FIELD = "lastfm_username"
    REQUIRED_FIELDS: list[str] = []

    def save(self, *args, **kwargs):
        if not self.auth_token:
            self.auth_token = secrets.token_urlsafe(48)
        if self.lastfm_username:
            self.lastfm_username = self.lastfm_username.strip().lower()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.lastfm_username


class WeeklyPick(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="weekly_picks")
    week_start = models.DateField()
    tracks = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "week_start"], name="uniq_user_week"),
        ]
        indexes = [
            models.Index(fields=["user", "week_start"])
        ]

    def save(self, *args, **kwargs):
        if not self.week_start:
            self.week_start = get_week_start()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.user} - {self.week_start}"