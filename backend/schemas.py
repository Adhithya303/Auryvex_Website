from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ── Enquiries ──────────────────────────────────────────────────────────────────

class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=100)
    service: Optional[str] = Field(None, max_length=100)
    message: str = Field(..., min_length=20, max_length=2000)
    budget: Optional[str] = Field(None, max_length=50)
    timeline: Optional[str] = Field(None, max_length=50)


class EnquiryCreatedResponse(BaseModel):
    """Returned after a successful submission — no PII."""
    id: int
    created_at: datetime


class EnquiryListItem(BaseModel):
    """Used in paginated list — message body excluded."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    company: Optional[str]
    service: Optional[str]
    budget: Optional[str]
    timeline: Optional[str]
    status: str
    created_at: datetime


class EnquiryDetail(EnquiryListItem):
    """Full detail view including message and admin notes."""
    message: str
    notes: Optional[str]


class PaginatedEnquiries(BaseModel):
    items: list[EnquiryListItem]
    total: int
    page: int
    size: int


class EnquiryStatusUpdate(BaseModel):
    status: Optional[Literal["new", "in_progress", "closed"]] = None
    notes: Optional[str] = None


# ── Auth ───────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class MeResponse(BaseModel):
    username: str


class OkResponse(BaseModel):
    ok: bool = True
