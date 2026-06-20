import pandas as pd
from typing import List, Dict, Any, Optional

from app.models.activity import ActivityCategory
from app.schemas.activity import ActivityResponse

# --- Mocked EPA Baseline Conversion Factors (Daily Activities) ---
COMMUTE_FACTORS_PER_KM = {
    "CAR_GASOLINE": 0.192,
    "CAR_ELECTRIC": 0.053,
    "BUS": 0.105,
    "TRAIN": 0.041,
    "BICYCLE": 0.0,
    "WALKING": 0.0,
}

DIET_FACTORS_PER_DAY = {
    "HIGH_MEAT": 7.2,
    "MEDIUM_MEAT": 5.6,
    "LOW_MEAT": 3.8,
    "PESCATARIAN": 3.9,
    "VEGETARIAN": 3.8,
    "VEGAN": 2.9,
}

ENERGY_FACTOR_PER_KWH = 0.385

# --- Monthly Baseline Profile Factors (kg CO2e / month) ---
# Derived from general global/national averages for quick profiling

BASELINE_LIFESTYLE = {
    "Active": 150.0,    # Frequent travel, consumer goods, dining out
    "Moderate": 100.0,  # Average consumer
    "Sedentary": 80.0   # Minimal travel, mostly home-bound
}

BASELINE_DIET = {
    "HIGH_MEAT": 210.0,
    "MEDIUM_MEAT": 150.0,
    "LOW_MEAT": 100.0,
    "PESCATARIAN": 110.0,
    "VEGETARIAN": 90.0,
    "VEGAN": 60.0
}

BASELINE_ENERGY = {
    "High": 200.0,
    "Average": 150.0,
    "Low": 100.0,
    "Renewable": 20.0
}

BASELINE_TRANSPORT = {
    "Car (Gasoline)": 250.0,
    "Car (Electric)": 80.0,
    "Public Transit": 60.0,
    "Bicycle/Walking": 0.0
}

class EmissionsCalculator:
    """
    Service class handling core carbon footprint math using Pandas.
    Now merges static user profiles with dynamic daily activities.
    """
    
    def __init__(self, activities: List[ActivityResponse], user_profile: Optional[Dict[str, Any]] = None):
        self.df = pd.DataFrame([act.model_dump() for act in activities])
        self.user_profile = user_profile or {}

    def _calculate_baseline(self) -> Dict[str, float]:
        """Calculates the baseline footprint based on static profile demographics."""
        lifestyle = BASELINE_LIFESTYLE.get(self.user_profile.get("lifestyle_type"), 100.0)
        diet = BASELINE_DIET.get(self.user_profile.get("diet_preference"), 150.0)
        
        # Energy is generally a household metric, so we divide by household size for per-capita tracking
        household_size = max(self.user_profile.get("household_size") or 1, 1)
        raw_energy = BASELINE_ENERGY.get(self.user_profile.get("energy_habits"), 150.0)
        energy = raw_energy / household_size
        
        transport = BASELINE_TRANSPORT.get(self.user_profile.get("transportation_habits"), 150.0)

        return {
            "COMMUTE": round(transport, 2),
            "DIET": round(diet, 2),
            "ENERGY": round(energy, 2),
            "LIFESTYLE_OVERHEAD": round(lifestyle, 2)
        }
        
    def _calculate_vectorized(self) -> None:
        if self.df.empty:
            self.df['emissions_kg'] = 0.0
            self.df['category_str'] = pd.Series(dtype=str)
            return

        self.df['emissions_kg'] = 0.0
        self.df['category_str'] = self.df['category'].apply(
            lambda x: x.value if hasattr(x, 'value') else x
        )

        commute_mask = self.df['category_str'] == ActivityCategory.COMMUTE.value
        if commute_mask.any():
            tm_col = self.df.loc[commute_mask, 'transport_mode'].apply(lambda x: x.value if hasattr(x, 'value') else x)
            factors = tm_col.map(COMMUTE_FACTORS_PER_KM).fillna(0.0)
            distances = self.df.loc[commute_mask, 'distance_km'].fillna(0.0)
            self.df.loc[commute_mask, 'emissions_kg'] = distances * factors

        diet_mask = self.df['category_str'] == ActivityCategory.DIET.value
        if diet_mask.any():
            dt_col = self.df.loc[diet_mask, 'diet_type'].apply(lambda x: x.value if hasattr(x, 'value') else x)
            self.df.loc[diet_mask, 'emissions_kg'] = dt_col.map(DIET_FACTORS_PER_DAY).fillna(0.0)

        energy_mask = self.df['category_str'] == ActivityCategory.ENERGY.value
        if energy_mask.any():
            energy_usage = self.df.loc[energy_mask, 'energy_kwh'].fillna(0.0)
            self.df.loc[energy_mask, 'emissions_kg'] = energy_usage * ENERGY_FACTOR_PER_KWH

    def generate_report(self) -> Dict[str, Any]:
        """Outputs the combined structured footprint report."""
        self._calculate_vectorized()

        # Generate the Baseline metrics
        baseline_breakdown = self._calculate_baseline()
        baseline_total = sum(baseline_breakdown.values())

        # Generate the Activity metrics
        if self.df.empty:
            activity_breakdown = {
                ActivityCategory.COMMUTE.value: 0.0,
                ActivityCategory.DIET.value: 0.0,
                ActivityCategory.ENERGY.value: 0.0
            }
            activity_total = 0.0
        else:
            activity_total = float(self.df['emissions_kg'].sum())
            grouped = self.df.groupby('category_str')['emissions_kg'].sum()
            activity_breakdown = {
                ActivityCategory.COMMUTE.value: float(grouped.get(ActivityCategory.COMMUTE.value, 0.0)),
                ActivityCategory.DIET.value: float(grouped.get(ActivityCategory.DIET.value, 0.0)),
                ActivityCategory.ENERGY.value: float(grouped.get(ActivityCategory.ENERGY.value, 0.0)),
            }

        return {
            "baseline_emissions_kg": round(baseline_total, 2),
            "activity_emissions_kg": round(activity_total, 2),
            "total_emissions_kg": round(baseline_total + activity_total, 2),
            "baseline_breakdown": baseline_breakdown,
            "activity_breakdown": activity_breakdown
        }
