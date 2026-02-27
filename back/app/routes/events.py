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