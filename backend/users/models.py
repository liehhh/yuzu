from django.db import models
import secrets
from django.conf import settings
from .utils import get_week_start
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserProfile(AbstractUser):
    avatar_url = models.URLField(blank=True, null=True)

    # Keep default USERNAME_FIELD = "username"
    # Keep default manager (no custom UserProfileManager needed)

    def save(self, *args, **kwargs):
        if self.username:
            self.username = self.username.strip().lower()
        return super().save(*args, **kwargs)


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