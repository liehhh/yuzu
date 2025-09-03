from django.contrib import admin
from .models import WeeklyPick, UserProfile
from django.contrib.auth.admin import UserAdmin

# Register your models here.
admin.site.register([WeeklyPick, UserProfile])

class UserProfileAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("avatar_url",)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("avatar_url",)}),
    )
    list_display = ("id", "username", "email", "is_staff", "is_superuser")
    search_fields = ("username", "email")