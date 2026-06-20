from fastapi import APIRouter
from app.api.v1.endpoints import activities, users

api_router = APIRouter()

# Grouping all API endpoints
api_router.include_router(activities.router, prefix="/activities", tags=["Activities"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
