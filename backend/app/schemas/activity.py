from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal, Annotated, Union
import datetime
from uuid import UUID

from app.models.activity import ActivityCategory, TransportMode, DietType

class ActivityLogBase(BaseModel):
    """Shared baseline properties for all activities."""
    # Changed from 'date: date' to 'date: datetime.date' to avoid Pydantic namespace collision
    date: datetime.date = Field(..., description="Date the activity occurred")
    category: ActivityCategory

# --- Category-Specific Creation Models ---
# These enforce strict validation dependent on the activity category.

class CommuteActivityCreate(ActivityLogBase):
    category: Literal[ActivityCategory.COMMUTE]
    distance_km: float = Field(..., gt=0, description="Distance traveled in kilometers (> 0)")
    transport_mode: TransportMode

class DietActivityCreate(ActivityLogBase):
    category: Literal[ActivityCategory.DIET]
    diet_type: DietType

class EnergyActivityCreate(ActivityLogBase):
    category: Literal[ActivityCategory.ENERGY]
    energy_kwh: float = Field(..., gt=0, description="Energy consumed in kWh (> 0)")

# Discriminated Union ensures FastAPI correctly routes and validates the payload 
# based entirely on the 'category' field.
ActivityCreate = Annotated[
    Union[CommuteActivityCreate, DietActivityCreate, EnergyActivityCreate],
    Field(discriminator="category")
]

class ActivityUpdate(BaseModel):
    """Properties that can be patched/updated on an existing activity."""
    distance_km: Optional[float] = Field(None, gt=0)
    transport_mode: Optional[TransportMode] = None
    diet_type: Optional[DietType] = None
    energy_kwh: Optional[float] = Field(None, gt=0)

class ActivityResponse(ActivityLogBase):
    """Unified response model for activity logs."""
    id: UUID
    user_id: UUID
    created_at: datetime.datetime
    
    distance_km: Optional[float] = None
    transport_mode: Optional[TransportMode] = None
    diet_type: Optional[DietType] = None
    energy_kwh: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)
