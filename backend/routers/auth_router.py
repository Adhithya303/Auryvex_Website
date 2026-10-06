from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from auth import (
    clear_auth_cookies,
    create_tokens,
    get_client_ip,
    get_current_user,
    set_auth_cookies,
    verify_password,
)
from database import get_db
from models import User
from rate_limit import check_login_allowed, clear_login_failures, record_login_failure
from schemas import LoginRequest, MeResponse, OkResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=OkResponse)
def login(body: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    ip = get_client_ip(request)
    check_login_allowed(ip)

    user = db.query(User).filter(User.username == body.username).first()
    if not user or not verify_password(body.password, user.hashed_password):
        record_login_failure(ip)
        from fastapi import HTTPException, status
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid username or password")

    clear_login_failures(ip)
    jwt_token, csrf_token = create_tokens(subject=user.username)
    set_auth_cookies(response, jwt_token, csrf_token)
    return OkResponse()


@router.post("/logout", response_model=OkResponse)
def logout(response: Response):
    clear_auth_cookies(response)
    return OkResponse()


@router.get("/me", response_model=MeResponse)
def me(token_data: dict = Depends(get_current_user)):
    return MeResponse(username=token_data["sub"])
