from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


# ── Allowed Enquiries Options ──────────────────────────────────────────────────
ALLOWED_SERVICES = {
    "Custom Web Applications",
    "Internal Tools & Automation",
    "Technical Consulting",
    "Other",
}

ALLOWED_BUDGETS = {
    "under_5k",
    "5k_20k",
    "20k_50k",
    "50k_plus",
    "undisclosed",
}

ALLOWED_TIMELINES = {
    "asap",
    "1_3_months",
    "3_6_months",
    "6_plus_months",
    "unsure",
}


# ── Enquiries Schemas ──────────────────────────────────────────────────────────

class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=100)
    service: Optional[str] = Field(None, max_length=100)
    message: str = Field(..., min_length=20, max_length=2000)
    budget: Optional[str] = Field(None, max_length=50)
    timeline: Optional[str] = Field(None, max_length=50)

    @field_validator("service")
    @classmethod
    def validate_service(cls, v: Optional[str]) -> Optional[str]:
        if v and v.strip() and v not in ALLOWED_SERVICES:
            raise ValueError(
                f"Invalid service interest. Must be one of: {', '.join(sorted(ALLOWED_SERVICES))}"
            )
        return v

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v: Optional[str]) -> Optional[str]:
        if v and v.strip() and v not in ALLOWED_BUDGETS:
            raise ValueError(
                f"Invalid budget option. Must be one of: {', '.join(sorted(ALLOWED_BUDGETS))}"
            )
        return v

    @field_validator("timeline")
    @classmethod
    def validate_timeline(cls, v: Optional[str]) -> Optional[str]:
        if v and v.strip() and v not in ALLOWED_TIMELINES:
            raise ValueError(
                f"Invalid timeline option. Must be one of: {', '.join(sorted(ALLOWED_TIMELINES))}"
            )
        return v


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


# ── Auth Schemas ───────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class MeResponse(BaseModel):
    username: str


class OkResponse(BaseModel):
    ok: bool = True
