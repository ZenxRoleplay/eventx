from sqlalchemy.orm import Session
from app.models import Event

def get_all_events(db: Session):
    return db.query(Event).order_by(Event.date.desc()).all()

def get_event_by_id(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()