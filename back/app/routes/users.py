from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user=Depends(get_current_user)):
    return current_user

@router.post("/interests")
def set_interests(data: schemas.SetInterests, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db.query(models.UserInterest).filter(models.UserInterest.user_id == current_user.id).delete()
    for iid in data.interest_ids:
        db.add(models.UserInterest(user_id=current_user.id, interest_id=iid))
    current_user.interests_set = True
    db.commit()
    return {"message": "Interests saved"}

@router.get("/interests/all", response_model=list[schemas.InterestOut])
def get_all_interests(db: Session = Depends(get_db)):
    return db.query(models.Interest).all()

@router.post("/request-organizer")
def request_organizer(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    existing = db.query(models.OrganizerRequest).filter(models.OrganizerRequest.user_id == current_user.id).first()
    if existing:
        return {"message": "Request already submitted", "status": existing.status}
    req = models.OrganizerRequest(user_id=current_user.id)
    db.add(req)
    db.commit()
    return {"message": "Request submitted successfully"}