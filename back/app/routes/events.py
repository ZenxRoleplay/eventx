from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth.dependencies import get_current_user, require_organizer

router = APIRouter()

@router.get("/", response_model=List[schemas.EventOut])
def get_events(db: Session = Depends(get_db)):
    """Return all approved events across both branches (used by homepage feed)."""
    return (
        db.query(models.Event)
        .filter(models.Event.status == models.StatusEnum.approved)
        .order_by(models.Event.date.desc())
        .all()
    )

@router.get("/city", response_model=List[schemas.EventOut])
def get_city_events(db: Session = Depends(get_db)):
    """Return only standalone City Events (event_type='city', approved)."""
    events = (
        db.query(models.Event)
        .filter(
            models.Event.event_type == models.EventTypeEnum.city,
            models.Event.status == models.StatusEnum.approved,
        )
        .order_by(models.Event.date.desc())
        .all()
    )
    # Fallback only within the city branch — never leak fest or pending events
    if not events:
        events = (
            db.query(models.Event)
            .filter(models.Event.event_type == models.EventTypeEnum.city)
            .order_by(models.Event.date.desc())
            .all()
        )
    return events

@router.get("/mine", response_model=List[schemas.EventOut])
def get_my_events(db: Session = Depends(get_db), current_user=Depends(require_organizer)):
    """Return city events owned by the current organizer.
    Fest events are managed via /fests/:slug, not here.
    """
    return (
        db.query(models.Event)
        .filter(
            models.Event.event_type == models.EventTypeEnum.city,
            models.Event.organizer_id == current_user.id,
        )
        .order_by(models.Event.date.desc())
        .all()
    )

@router.get("/feed", response_model=List[schemas.EventOut])
def get_feed(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_interests = db.query(models.UserInterest).filter(models.UserInterest.user_id == current_user.id).all()
    interest_names = []
    for ui in user_interests:
        interest = db.query(models.Interest).filter(models.Interest.id == ui.interest_id).first()
        if interest:
            interest_names.append(interest.name)

    all_events = db.query(models.Event).filter(models.Event.status == models.StatusEnum.approved).all()

    priority = [e for e in all_events if e.category in interest_names]
    others   = [e for e in all_events if e.category not in interest_names]

    return priority + others

@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/", response_model=schemas.EventOut)
def create_event(data: schemas.EventCreate, db: Session = Depends(get_db), current_user=Depends(require_organizer)):
    """Create an event.
    - event_type="city":  organizer_id is set to current_user; fest_id must be null (enforced by schema).
    - event_type="fest":  fest_id required (enforced by schema); organizer_id stays NULL.
    """
    event_data = data.model_dump()

    if data.event_type == "city":
        event_data["organizer_id"] = current_user.id
    # fest events: organizer_id intentionally NULL; committee managed via FestMember

    event = models.Event(**event_data, status=models.StatusEnum.pending)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.patch("/{event_id}", response_model=schemas.EventOut)
def update_event(
    event_id: int,
    data: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_organizer),
):
    """
    Partial update of an event.

    Protected fields (rejected if any EventRegistrations exist):
      - requires_registration
      - is_paid
      - price (decrease only — increasing or keeping same is fine)
      - registration_limit (cannot decrease below current active registration count)

    Always allowed:
      - title, description, location, date, time, image_url, category
      - increasing registration_limit
      - approval_mode
    """
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Ownership check: city event organizer or fest owner/core or admin
    if current_user.role != models.RoleEnum.admin:
        if event.event_type == models.EventTypeEnum.city:
            if event.organizer_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not your event")
        else:
            is_member = (
                db.query(models.FestMember)
                .filter(
                    models.FestMember.fest_id == event.fest_id,
                    models.FestMember.user_id == current_user.id,
                    models.FestMember.role.in_([
                        models.FestMemberRoleEnum.owner,
                        models.FestMemberRoleEnum.core,
                    ]),
                )
                .first()
            )
            if not is_member:
                raise HTTPException(status_code=403, detail="Forbidden")

    # Count active registrations for this event
    active_reg_count = (
        db.query(models.EventRegistration)
        .filter(
            models.EventRegistration.event_id == event_id,
            models.EventRegistration.approval_status.in_([
                models.RegApprovalStatusEnum.approved,
                models.RegApprovalStatusEnum.pending,
            ]),
        )
        .count()
    ) if event.event_type == models.EventTypeEnum.fest else 0

    has_registrations = active_reg_count > 0

    updates = data.model_dump(exclude_unset=True)

    # Guard locked fields if registrations exist
    if has_registrations:
        locked = []
        if "requires_registration" in updates:
            locked.append("requires_registration")
        if "is_paid" in updates:
            locked.append("is_paid")
        if "price" in updates and updates["price"] < (event.price or 0):
            locked.append("price (cannot decrease)")
        if "registration_limit" in updates:
            new_limit = updates["registration_limit"]
            if new_limit is not None and new_limit < active_reg_count:
                locked.append(
                    f"registration_limit (cannot set below current count of {active_reg_count})"
                )
        if locked:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot change locked fields while registrations exist: {', '.join(locked)}",
            )

    for field, value in updates.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event