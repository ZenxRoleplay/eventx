from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models, schemas
from app.auth.dependencies import require_admin

router = APIRouter()

@router.get("/organizer-requests")
def get_organizer_requests(db: Session = Depends(get_db), _=Depends(require_admin)):
    requests = db.query(models.OrganizerRequest).filter(models.OrganizerRequest.status == "pending").all()
    return requests

@router.post("/organizer-requests/{request_id}/approve")
def approve_organizer(request_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    req = db.query(models.OrganizerRequest).filter(models.OrganizerRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = models.StatusEnum.approved
    req.reviewed_at = datetime.utcnow()
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    user.role = models.RoleEnum.organizer
    db.commit()
    return {"message": "Organizer approved"}

@router.post("/organizer-requests/{request_id}/reject")
def reject_organizer(request_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    req = db.query(models.OrganizerRequest).filter(models.OrganizerRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = models.StatusEnum.rejected
    req.reviewed_at = datetime.utcnow()
    db.commit()
    return {"message": "Request rejected"}

@router.get("/events/pending")
def get_pending_events(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(models.Event).filter(models.Event.status == "pending").all()

@router.post("/events/{event_id}/approve")
def approve_event(event_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.status = models.StatusEnum.approved
    db.commit()
    return {"message": "Event approved"}

@router.post("/events/{event_id}/reject")
def reject_event(event_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.status = models.StatusEnum.rejected
    db.commit()
    return {"message": "Event rejected"}