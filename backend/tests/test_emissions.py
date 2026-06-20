import pytest
import uuid
from pydantic import ValidationError

from app.services.emissions import (
    EmissionsCalculator, 
    COMMUTE_FACTORS_PER_KM, 
    DIET_FACTORS_PER_DAY, 
    ENERGY_FACTOR_PER_KWH
)
from app.models.activity import ActivityCategory, TransportMode, DietType
from app.schemas.activity import ActivityResponse, CommuteActivityCreate, EnergyActivityCreate

# Mock basic attributes required by the Response schema
def _base_kwargs():
    return {
        "id": uuid.uuid4(),
        "user_id": uuid.uuid4(),
        "date": "2026-06-12",
        "created_at": "2026-06-12T12:00:00Z"
    }

def test_standard_inputs():
    """Verify that the Pandas engine accurately calculates standard expected inputs."""
    activities = [
        ActivityResponse(**_base_kwargs(), category=ActivityCategory.COMMUTE, distance_km=15.0, transport_mode=TransportMode.CAR_GASOLINE),
        ActivityResponse(**_base_kwargs(), category=ActivityCategory.DIET, diet_type=DietType.VEGAN)
    ]
    
    calc = EmissionsCalculator(activities)
    report = calc.generate_report()
    
    expected_commute = 15.0 * COMMUTE_FACTORS_PER_KM[TransportMode.CAR_GASOLINE.value]
    expected_diet = DIET_FACTORS_PER_DAY[DietType.VEGAN.value]
    
    assert report["breakdown"][ActivityCategory.COMMUTE.value] == round(expected_commute, 2)
    assert report["breakdown"][ActivityCategory.DIET.value] == round(expected_diet, 2)
    assert report["total_emissions_kg"] == round(expected_commute + expected_diet, 2)

def test_zero_values():
    """Verify that valid zero inputs do not cause DivisionByZero or math errors."""
    activities = [
        ActivityResponse(**_base_kwargs(), category=ActivityCategory.ENERGY, energy_kwh=0.0)
    ]
    calc = EmissionsCalculator(activities)
    report = calc.generate_report()
    
    assert report["total_emissions_kg"] == 0.0
    assert report["breakdown"][ActivityCategory.ENERGY.value] == 0.0

def test_missing_optional_fields():
    """
    Verify the Pandas engine's resilience. If a DB entry is somehow missing 
    a core metric (like distance_km being None), `.fillna(0.0)` should catch it 
    gracefully without throwing a TypeError.
    """
    activities = [
        ActivityResponse(**_base_kwargs(), category=ActivityCategory.COMMUTE, transport_mode=TransportMode.BUS) 
        # distance_km is implicitly None here
    ]
    calc = EmissionsCalculator(activities)
    report = calc.generate_report()
    
    assert report["total_emissions_kg"] == 0.0

def test_negative_values_rejected_by_pydantic():
    """
    Security/Validation Test: Verify that malicious or erroneous negative values 
    are strictly rejected by Pydantic before they can ever reach the calculator.
    """
    with pytest.raises(ValidationError) as exc_info:
        CommuteActivityCreate(
            date="2026-06-12", 
            category="COMMUTE", 
            distance_km=-10.0, # Intentional negative injection
            transport_mode="BUS"
        )
    
    # Assert that the validation error specifically targets the distance_km constraint (gt=0)
    assert "Input should be greater than 0" in str(exc_info.value)

def test_extremely_large_inputs():
    """
    Stress Test: Verify that Pandas handles extremely large floats without 
    memory overflow or unhandled Infinity conversions.
    """
    large_val = 1e12 # 1 Trillion kilometers
    activities = [
        ActivityResponse(**_base_kwargs(), category=ActivityCategory.COMMUTE, distance_km=large_val, transport_mode=TransportMode.TRAIN)
    ]
    calc = EmissionsCalculator(activities)
    report = calc.generate_report()
    
    expected = large_val * COMMUTE_FACTORS_PER_KM[TransportMode.TRAIN.value]
    assert report["total_emissions_kg"] == round(expected, 2)

def test_empty_dataframe():
    """Verify that submitting an empty list of activities does not crash the DataFrame generation."""
    calc = EmissionsCalculator([])
    report = calc.generate_report()
    
    assert report["total_emissions_kg"] == 0.0
    assert report["breakdown"][ActivityCategory.COMMUTE.value] == 0.0
