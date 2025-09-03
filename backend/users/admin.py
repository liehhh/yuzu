from django.contrib import admin
from .models import WeeklyPick, UserProfile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
admin.site.register([WeeklyPick, UserProfile])

class UserProfileAdmin(BaseUserAdmin):
    model = UserProfile
    list_display = ("id", "lastfm_username", "display_name", "is_staff", "is_active")
    ordering = ("id",)
    search_fields = ("lastfm_username", "display_name")

    fieldsets = (
        (None, {"fields": ("lastfm_username", "password")}),
        ("Profile", {"fields": ("display_name", "avatar_url", "app_token")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("lastfm_username", "password1", "password2", "is_staff", "is_superuser", "is_active"),
        }),
    )
