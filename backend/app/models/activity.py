import enum
import uuid
from sqlalchemy import Column, Date, Enum, Float, ForeignKey, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class ActivityCategory(str, enum.Enum):
    COMMUTE = "COMMUTE"
    DIET = "DIET"
    ENERGY = "ENERGY"

class TransportMode(str, enum.Enum):
    CAR_GASOLINE = "CAR_GASOLINE"
    CAR_ELECTRIC = "CAR_ELECTRIC"
    BUS = "BUS"
    TRAIN = "TRAIN"
    BICYCLE = "BICYCLE"
    WALKING = "WALKING"

class DietType(str, enum.Enum):
    HIGH_MEAT = "HIGH_MEAT"
    MEDIUM_MEAT = "MEDIUM_MEAT"
    LOW_MEAT = "LOW_MEAT"
    PESCATARIAN = "PESCATARIAN"
    VEGETARIAN = "VEGETARIAN"
    VEGAN = "VEGAN"

class ActivityLog(Base):
    """
    SQLAlchemy model for tracking daily carbon-emitting activities.
    Utilizes a Single Table Inheritance-like approach with nullable fields 
    for category-specific data to reduce JOIN overhead and improve performance.
    """
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    category = Column(Enum(ActivityCategory), nullable=False, index=True)
    
    # Commute specific fields
    distance_km = Column(Float, nullable=True)
    transport_mode = Column(Enum(TransportMode), nullable=True)
    
    # Diet specific fields
    diet_type = Column(Enum(DietType), nullable=True)
    
    # Energy specific fields
    energy_kwh = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="activities")
