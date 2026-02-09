from pydantic import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str | None = None

settings = Settings()
