from django.contrib import admin
from .models import WeeklyPick, UserProfile

# Register your models here.
admin.site.register([WeeklyPick, UserProfile])