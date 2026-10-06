import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from auth import hash_password
from config import get_settings
from database import Base, SessionLocal, engine
from models import User
from routers.auth_router import router as auth_router
from routers.enquiries_router import router as enquiries_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables (idempotent)
    Base.metadata.create_all(bind=engine)

    # Sync admin user: create or update credentials from env on every startup
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == settings.admin_username).first()
        new_hash = hash_password(settings.admin_password)
        if admin is None:
            admin = User(username=settings.admin_username, hashed_password=new_hash)
            db.add(admin)
            print(f"[startup] Admin user '{settings.admin_username}' created.", file=sys.stderr)
        else:
            admin.hashed_password = new_hash
        db.commit()
    finally:
        db.close()

    yield  # application runs here


app = FastAPI(
    title="Auryvex API",
    version="1.0.0",
    docs_url="/api/docs" if not settings.is_production else None,
    redoc_url="/api/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "X-CSRF-Token"],
)


# In production, suppress internal details from error responses
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    if settings.is_production:
        return JSONResponse(status_code=500, content={"detail": "An internal error occurred."})
    raise exc


app.include_router(auth_router)
app.include_router(enquiries_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
