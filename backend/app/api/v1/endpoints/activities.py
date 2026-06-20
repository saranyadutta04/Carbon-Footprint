from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Any, Dict
import uuid

# from app.api.deps import get_db, get_current_user
from app.schemas.activity import ActivityCreate, ActivityResponse
from app.services.emissions import EmissionsCalculator
from app.services.ai_insights import generate_priority_insight

router = APIRouter()

def get_db(): yield "db_session"
def get_current_user(): return "user_instance"

@router.post("/logs", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity_log(
    *,
    db: Session = Depends(get_db),
    activity_in: ActivityCreate,
    background_tasks: BackgroundTasks,
    current_user: Any = Depends(get_current_user)
) -> Any:
    try:
        # Enqueue the AI insight generation to run in the background
        background_tasks.add_task(generate_priority_insight, "user_123", db)
        pass 
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred.")


@router.get("/dashboard", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
def get_dashboard_insights(
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    Retrieves activity logs AND the static user profile, merges them in the 
    Pandas engine, and returns the comprehensive baseline + activity metrics.
    """
    try:
        # Mocking user profile DB fetch (simulating the onboarding data)
        mock_user_profile = {
            "country": "USA",
            "city": "Seattle",
            "household_size": 2,
            "lifestyle_type": "Moderate",
            "diet_preference": "MEDIUM_MEAT",
            "energy_habits": "Average",
            "transportation_habits": "Car (Gasoline)"
        }

        # Mocking activity logs DB fetch
        mock_logs = [
            ActivityResponse(id=uuid.uuid4(), user_id=uuid.uuid4(), date="2026-06-20", category="COMMUTE", distance_km=15.0, transport_mode="CAR_GASOLINE", created_at="2026-06-20T12:00:00Z"),
            ActivityResponse(id=uuid.uuid4(), user_id=uuid.uuid4(), date="2026-06-20", category="DIET", diet_type="HIGH_MEAT", created_at="2026-06-20T12:00:00Z"),
            ActivityResponse(id=uuid.uuid4(), user_id=uuid.uuid4(), date="2026-06-20", category="ENERGY", energy_kwh=10.5, created_at="2026-06-20T12:00:00Z")
        ] 

        # Initialize the engine with both datasets
        calculator = EmissionsCalculator(activities=mock_logs, user_profile=mock_user_profile)
        
        report = calculator.generate_report()
        # Mocking the AI insight from the user's DB profile
        report["priority_insight"] = "Carpooling twice a week can instantly reduce your transportation emissions by 30%."
        
        return report

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while calculating dashboard insights."
        )
