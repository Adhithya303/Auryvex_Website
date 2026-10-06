from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from auth import get_client_ip, get_current_user, verify_csrf
from database import get_db
from models import Enquiry
from rate_limit import check_enquiry_allowed, record_enquiry_submission
from schemas import (
    EnquiryCreate,
    EnquiryCreatedResponse,
    EnquiryDetail,
    EnquiryStatusUpdate,
    PaginatedEnquiries,
)

router = APIRouter(prefix="/api/enquiries", tags=["enquiries"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=EnquiryCreatedResponse)
def create_enquiry(body: EnquiryCreate, request: Request, db: Session = Depends(get_db)):
    ip = get_client_ip(request)
    check_enquiry_allowed(ip)

    enquiry = Enquiry(
        name=body.name,
        email=body.email,
        company=body.company,
        service=body.service,
        message=body.message,
        budget=body.budget,
        timeline=body.timeline,
        ip_address=ip,
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    record_enquiry_submission(ip)

    # Return only id + created_at — no PII
    return EnquiryCreatedResponse(id=enquiry.id, created_at=enquiry.created_at)


@router.get("", response_model=PaginatedEnquiries)
def list_enquiries(
    request: Request,
    page: int = 1,
    size: int = 20,
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user),
):
    if page < 1:
        page = 1
    if size < 1 or size > 100:
        size = 20

    offset = (page - 1) * size
    total = db.query(Enquiry).count()
    rows = (
        db.query(Enquiry)
        .order_by(Enquiry.created_at.desc())
        .offset(offset)
        .limit(size)
        .all()
    )

    from schemas import EnquiryListItem
    items = [EnquiryListItem.model_validate(r) for r in rows]
    return PaginatedEnquiries(items=items, total=total, page=page, size=size)


@router.get("/{enquiry_id}", response_model=EnquiryDetail)
def get_enquiry(
    enquiry_id: int,
    request: Request,
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Enquiry not found")
    return EnquiryDetail.model_validate(enquiry)


@router.patch("/{enquiry_id}", response_model=EnquiryDetail)
def update_enquiry(
    enquiry_id: int,
    body: EnquiryStatusUpdate,
    request: Request,
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user),
):
    verify_csrf(request, token_data)

    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Enquiry not found")

    if body.status is not None:
        enquiry.status = body.status
    if body.notes is not None:
        enquiry.notes = body.notes

    db.commit()
    db.refresh(enquiry)
    return EnquiryDetail.model_validate(enquiry)
