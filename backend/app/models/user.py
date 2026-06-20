import uuid
from sqlalchemy import Boolean, Column, DateTime, String, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class User(Base):
    """
    SQLAlchemy model for User profiles.
    Security: Passwords are only stored as hashes.
    Performance: id and email are indexed for fast lookups.
    """
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Demographics & Lifestyle (Onboarding Fields)
    country = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    household_size = Column(Integer, nullable=True)
    lifestyle_type = Column(String(255), nullable=True)
    diet_preference = Column(String(255), nullable=True)
    energy_habits = Column(String(255), nullable=True)
    transportation_habits = Column(String(255), nullable=True)

    # AI Insights
    priority_insight = Column(String(500), nullable=True)

    # One-to-Many relationship with activities
    activities = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
