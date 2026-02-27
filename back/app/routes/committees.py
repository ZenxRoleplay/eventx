from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth.dependencies import require_organizer

router = APIRouter()

@router.post("/{event_id}/committees", response_model=schemas.CommitteeOut)
def create_committee(event_id: int, data: schemas.CommitteeCreate, db: Session = Depends(get_db), current_user=Depends(require_organizer)):
    event = db.query(models.Event).filter(models.Event.id == event_id, models.Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    c = models.Committee(event_id=event_id, name=data.name)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.post("/committees/{committee_id}/departments", response_model=schemas.DepartmentOut)
def create_department(committee_id: int, data: schemas.DepartmentCreate, db: Session = Depends(get_db), _=Depends(require_organizer)):
    d = models.Department(committee_id=committee_id, name=data.name)
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

@router.post("/departments/{department_id}/members")
def add_member(department_id: int, data: schemas.MemberAdd, db: Session = Depends(get_db), _=Depends(require_organizer)):
    m = models.DepartmentMember(department_id=department_id, user_id=data.user_id, role=data.role)
    db.add(m)
    db.commit()
    return {"message": "Member added"}
    