from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class MentalHealthData(BaseModel):
    """
    @brief  MentalHealthData model that is used in user information. Used as params in endpoints, as well as an object
            to be iterated through in frontend

    @attributes
        see below for more information
    """
    happiness: Optional[int] = Field(default=0, ge=-100, le=100)
    sadness: Optional[int] = Field(default=0, ge=-100, le=100)
    fear: Optional[int] = Field(default=0, ge=-100, le=100)
    anger: Optional[int] = Field(default=0, ge=-100, le=100)
    surprise: Optional[int] = Field(default=0, ge=-100, le=100)
    disgust: Optional[int] = Field(default=0, ge=-100, le=100)
    PHQ_score: Optional[int] = Field(default=0, ge=0, le=27)
    BDI_score: Optional[int] = Field(default=0, ge=0, le=63)
    notes: Optional[str] = ""

class UserSchema(BaseModel):
    """
    @brief  UserSchema model to hold user's information. Stored in Firestore
    @attributes
        user_id : unique identifier for user
        email : user's email
        nickname : user's nickname
        currentJWT : JWT token for user
        mental_health_data : MentalHealthData object
    """
    user_id: str
    email: str
    nickname: str
    currentJWT: str  # You can store the JWT, but consider its expiration
    mental_health_data: MentalHealthData

class SnapShotRequest(BaseModel):
    """
    @brief  SnapShotRequest model to hold snapshot data. Stored in Firestore
    @attributes
        timestamp : timestamp of the snapshot
        mental_health_data : MentalHealthData object
    """
    timestamp : datetime
    mental_health_data : MentalHealthData

class UserSnapShots(BaseModel):
    """
    @brief  UserSnapShots model to hold user's snapshot documents. Stored in Firestore
    @attributes
        user_id : unique identifier for user
        snapshot_doc : Firestore document reference to the snapshot data. A Json objet that holds SnapShotRequests as an array of JSON objects
    """
    user_id : str
    snapshot_doc : Any
