import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv

load_dotenv()


def _split_csv(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    def __init__(self) -> None:
        self.app_title = os.getenv("APP_TITLE", "Mentally Backend Server")
        self.app_description = os.getenv(
            "APP_DESCRIPTION",
            "API for user authentication, mental health tracking, snapshots, and AI insights.",
        )
        self.api_host = os.getenv("API_HOST", "127.0.0.1")
        self.api_port = int(os.getenv("API_PORT", "8000"))
        self.react_app_url = os.getenv("REACT_APP_URL", "http://localhost:3000")
        self.allowed_origins = _split_csv(os.getenv("ALLOWED_ORIGINS")) or [self.react_app_url]
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.firebase_service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
