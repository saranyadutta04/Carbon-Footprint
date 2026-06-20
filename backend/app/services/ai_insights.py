from google import genai
import logging
from sqlalchemy.orm import Session
from app.models.user import User

logger = logging.getLogger(__name__)

def generate_priority_insight(user_id: str, db: Session):
    """
    Background task to analyze the user's footprint via Gemini and 
    save a one-sentence actionable insight to their profile.
    This runs asynchronously so the main API response is not blocked.
    """
    try:
        # DB execution placeholder for real integration:
        # user = db.query(User).filter(User.id == user_id).first()
        # if not user: return
        #
        # profile_data = f"Lifestyle: {user.lifestyle_type}, Diet: {user.diet_preference}"
        
        profile_data = "Lifestyle: Moderate, Diet: Medium Meat, Energy Habits: Average, Transport: Car"
        
        # Initialize the GenAI Client (automatically uses GEMINI_API_KEY from .env)
        client = genai.Client()
        
        prompt = (
            f"You are an expert sustainability coach. Based on this user's profile: "
            f"[{profile_data}]. "
            f"Provide exactly one short, highly actionable sentence recommending the best "
            f"way they can reduce their carbon footprint."
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        insight = response.text.strip()
        
        # Save to DB placeholder
        # user.priority_insight = insight
        # db.commit()
        
        logger.info(f"Successfully generated AI insight for user {user_id}: {insight}")
        
    except Exception as e:
        logger.error(f"Failed to generate priority insight via Gemini: {e}")
