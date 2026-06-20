from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    """Shared properties for User models."""
    email: EmailStr = Field(..., description="A valid email address for the user")
    full_name: Optional[str] = Field(None, max_length=255, description="User's full name")
    is_active: bool = True

    # Demographics & Lifestyle (Onboarding Fields)
    country: Optional[str] = Field(None, max_length=255, description="User's country of residence")
    city: Optional[str] = Field(None, max_length=255, description="User's city of residence")
    household_size: Optional[int] = Field(None, ge=1, description="Number of people in the household")
    lifestyle_type: Optional[str] = Field(None, max_length=255, description="General lifestyle category")
    diet_preference: Optional[str] = Field(None, max_length=255, description="Primary diet type")
    energy_habits: Optional[str] = Field(None, max_length=255, description="Home energy usage habits")
    transportation_habits: Optional[str] = Field(None, max_length=255, description="Primary transportation methods")
    priority_insight: Optional[str] = Field(None, max_length=500, description="Pre-generated AI actionable insight")

class UserCreate(UserBase):
    """
    Properties expected when registering a new user during onboarding.
    Security: Enforces a minimum password length.
    """
    password: str = Field(..., min_length=8, description="Strong password for the user")

class UserUpdate(UserBase):
    """Properties allowed to be updated by the user."""
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)

class UserResponse(UserBase):
    """
    Properties returned to the client.
    Security: Ensures hashed_password is NOT serialized and exposed.
    """
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
