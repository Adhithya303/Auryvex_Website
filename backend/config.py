from functools import lru_cache
from pydantic import model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./data/auryvex.db"
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    allowed_origins: str = "http://localhost:5173"
    admin_username: str = "admin"
    admin_password: str = "admin"
    environment: str = "development"

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.is_production:
            placeholder_secrets = {
                "dev-secret-key-change-in-production",
                "change-me-use-openssl-rand-hex-32",
                "secret",
                "changeme",
            }
            if not self.secret_key or self.secret_key in placeholder_secrets or len(self.secret_key) < 32:
                raise ValueError(
                    "Production requires a strong SECRET_KEY of at least 32 characters. "
                    "Placeholder secrets are rejected."
                )

            placeholder_passwords = {
                "admin",
                "admin123",
                "change-me-strong-password",
                "password",
            }
            if not self.admin_password or self.admin_password in placeholder_passwords or len(self.admin_password) < 8:
                raise ValueError(
                    "Production requires a strong ADMIN_PASSWORD of at least 8 characters. "
                    "Default and placeholder passwords are rejected."
                )
        return self

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
