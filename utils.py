import os
from datetime import datetime


def format_date(dt):
    """Format a datetime object to ISO string, with None safety."""
    if dt is None:
        return None
    return dt.strftime("%Y-%m-%d")


def get_app_version():
    """Return the current app version from environment."""
    return os.getenv("APP_VERSION", "0.0.1-dev")
