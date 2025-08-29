from django.db import models; import secrets
from django.conf import settings
from .utils import get_week_start


class UserProfile(models.Model):
    lastfm_username = models.CharField(max_length=64, unique=True)
    display_name = models.CharField(max_length=255, blank=True, default="")
    avatar_url = models.URLField(blank=True, null=True)
    auth_token = models.CharField(max_length=128, unique=True, default="", editable=False)

    def save(self,*a,**k):
        if not self.auth_token: self.auth_token = secrets.token_urlsafe(48)
        return super().save(*a,**k)


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