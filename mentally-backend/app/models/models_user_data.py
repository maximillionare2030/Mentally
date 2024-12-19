from pydantic import BaseModel
from typing import Optional

class MentalHealthData(BaseModel):
    happiness: Optional[int] = 0
    sadness: Optional[int] = 0
    fear: Optional[int] = 0
    anger: Optional[int] = 0
    surprise: Optional[int] = 0
    disgust: Optional[int] = 0
    PHQ_score: Optional[int] = 0

class UserSchema(BaseModel):
    user_id: str
    email: str
    nickname: str
    currentJWT: str  # You can store the JWT, but consider its expiration
    mental_health_data: MentalHealthData
