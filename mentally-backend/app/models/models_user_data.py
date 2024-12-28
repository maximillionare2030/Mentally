from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class MentalHealthData(BaseModel):
    """
    @brief  MentalHealthData model that is used in user information. Used as params in endpoints, as well as an object
            to be iterated through in frontend

    @attributes
        see below for more information
    """
    happiness: Optional[int] = 0
    sadness: Optional[int] = 0
    fear: Optional[int] = 0
    anger: Optional[int] = 0
    surprise: Optional[int] = 0
    disgust: Optional[int] = 0
    PHQ_score: Optional[int] = 0
    BDI_score: Optional[int] = 0
    notes : Optional[str] = ""

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