from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status

# ── Login failure rate limiting ────────────────────────────────────────────────
_LOGIN_MAX_FAILURES = 5
_LOGIN_WINDOW_MINUTES = 15
_login_failures: dict[str, list[datetime]] = defaultdict(list)


def check_login_allowed(ip: str) -> None:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(minutes=_LOGIN_WINDOW_MINUTES)
    _login_failures[ip] = [t for t in _login_failures[ip] if t > cutoff]
    if len(_login_failures[ip]) >= _LOGIN_MAX_FAILURES:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            f"Too many failed login attempts. Try again in {_LOGIN_WINDOW_MINUTES} minutes.",
        )


def record_login_failure(ip: str) -> None:
    _login_failures[ip].append(datetime.now(timezone.utc))


def clear_login_failures(ip: str) -> None:
    _login_failures.pop(ip, None)


# ── Enquiry submission rate limiting ──────────────────────────────────────────
_ENQUIRY_COOLDOWN_SECONDS = 60
_enquiry_last_submission: dict[str, datetime] = {}


def check_enquiry_allowed(ip: str) -> None:
    now = datetime.now(timezone.utc)
    last = _enquiry_last_submission.get(ip)
    if last:
        elapsed = (now - last).total_seconds()
        if elapsed < _ENQUIRY_COOLDOWN_SECONDS:
            remaining = int(_ENQUIRY_COOLDOWN_SECONDS - elapsed)
            raise HTTPException(
                status.HTTP_429_TOO_MANY_REQUESTS,
                f"Please wait {remaining} seconds before submitting another enquiry.",
            )


def record_enquiry_submission(ip: str) -> None:
    _enquiry_last_submission[ip] = datetime.now(timezone.utc)
