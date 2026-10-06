import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, Request, Response, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory revocation tracking: maps jti -> expiry datetime
_revoked_sessions: dict[str, datetime] = {}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_tokens(subject: str) -> tuple[str, str]:
    """Return (jwt_token, csrf_token). The csrf claim and unique jti are embedded in the JWT."""
    csrf_token = secrets.token_hex(32)
    jti = secrets.token_hex(16)
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {
        "sub": subject,
        "exp": expire,
        "csrf": csrf_token,
        "jti": jti,
    }
    jwt_token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    return jwt_token, csrf_token


def decode_session(request: Request) -> dict:
    """Decode the session cookie, verify expiration and revocation; raise 401 on any failure."""
    token = request.cookies.get("session")
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        jti = payload.get("jti")
        if jti and jti in _revoked_sessions:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session has been invalidated")
        return payload
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired session")


def get_current_user(request: Request) -> dict:
    return decode_session(request)


def verify_csrf(request: Request, token_data: dict) -> None:
    """Double-submit CSRF check for state-changing requests."""
    csrf_header = request.headers.get("X-CSRF-Token")
    csrf_cookie = request.cookies.get("csrf_token")
    csrf_in_jwt = token_data.get("csrf")

    if not (csrf_header and csrf_cookie and csrf_in_jwt):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "CSRF token missing")

    if not (csrf_header == csrf_cookie == csrf_in_jwt):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "CSRF token mismatch")


def set_auth_cookies(response: Response, jwt_token: str, csrf_token: str) -> None:
    max_age = settings.access_token_expire_minutes * 60
    secure = settings.is_production

    response.set_cookie(
        "session",
        jwt_token,
        httponly=True,
        secure=secure,
        samesite="strict",
        max_age=max_age,
        path="/",
    )
    response.set_cookie(
        "csrf_token",
        csrf_token,
        httponly=False,
        secure=secure,
        samesite="strict",
        max_age=max_age,
        path="/",
    )


def clear_auth_cookies(response: Response, request: Optional[Request] = None) -> None:
    # Server-side revocation if request is provided
    if request:
        try:
            token = request.cookies.get("session")
            if token:
                payload = jwt.decode(
                    token, settings.secret_key, algorithms=[settings.algorithm]
                )
                jti = payload.get("jti")
                exp = payload.get("exp")
                if jti:
                    exp_dt = (
                        datetime.fromtimestamp(exp, timezone.utc)
                        if exp
                        else datetime.now(timezone.utc) + timedelta(hours=1)
                    )
                    _revoked_sessions[jti] = exp_dt
        except Exception:
            pass

    response.delete_cookie("session", path="/", samesite="strict")
    response.delete_cookie("csrf_token", path="/", samesite="strict")


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
