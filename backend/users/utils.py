import datetime
from django.utils import timezone


def get_week_start(now=None):
    if now is None:
        now = timezone.now()
    monday = now - datetime.timedelta(days=now.isoweekday() - 1)
    monday = monday.replace(hour=0, minute=0, second=0, microsecond=0)
    return monday.date()

print(get_week_start())