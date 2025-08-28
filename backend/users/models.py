from django.db import models; import secrets


class UserProfile(models.Model):
    lastfm_username = models.CharField(max_length=64, unique=True)
    display_name = models.CharField(max_length=255, blank=True, default="")
    avatar_url = models.URLField(blank=True, null=True)
    auth_token = models.CharField(max_length=128, unique=True, default="", editable=False)

    def save(self,*a,**k):
        if not self.auth_token: self.auth_token = secrets.token_urlsafe(48)
        return super().save(*a,**k)
