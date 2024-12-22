from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class MentalHealthData(BaseModel):
    happiness: Optional[int] = 0
    sadness: Optional[int] = 0
    fear: Optional[int] = 0
    anger: Optional[int] = 0
    surprise: Optional[int] = 0
    disgust: Optional[int] = 0
    PHQ_score: Optional[int] = 0
    notes : Optional[str] = ""

class UserSchema(BaseModel):
    user_id: str
    email: str
    nickname: str
    currentJWT: str  # You can store the JWT, but consider its expiration
    mental_health_data: MentalHealthData

class SnapShotRequest(BaseModel):
    timestamp : datetime
    mental_health_data : MentalHealthData

class UserSnapShots(BaseModel):
    user_id : str
    snapshot_doc : Any