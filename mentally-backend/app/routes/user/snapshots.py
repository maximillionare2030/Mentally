import os
from datetime import datetime
from typing import List

import pyrebase
from fastapi import FastAPI, APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.requests import Request
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore

from .firebase_init import fireBaseConfig, db, firebase
from app.models.models_user_data import UserSchema, MentalHealthData, SnapShotRequest

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR

router = APIRouter()

# Function to run daily tasks (create snapshots)
async def create_snapshots():
    """
    @brief  Helper function for creating snapshots of ENTIRE user information data.
            ** Creates a file for each user, in new collection (user_snapshots).
            ** Uses Firestore for data storage.
            ** Appends a JSON objects of 
                "<timestamp>" : {
                "mental_health_data": "<mental_health_data>"
                "timestampe" : "<deciphered timestamp>
                } 
            ** If a snap shot does not exists, a user file will be just be created
            
    """
    # Get current timestamp in utc-8 
    current_timestamp = datetime.utcnow()

    # Query all users
    users_ref = db.collection('users')
    users = users_ref.stream()      #  Creates a list of all user files

    for user in users:
        user_data = user.to_dict()

        # Prepare the snapshot
        snapshot_data = SnapShotRequest(
            timestamp=current_timestamp,
            mental_health_data=user_data.get('mental_health_data')
        )

        # Retrieve the UserSnapShots document (if exists)
        user_snapshots_ref = db.collection('user_snapshots').document(user.id)
        user_snapshots = user_snapshots_ref.get()

        if user_snapshots.exists:
            # Append snapshot to the existing snapshot_doc
            existing_snapshot_doc = user_snapshots.to_dict().get('snapshot_doc', {})

            # Ensure we don't overwrite, we append instead
            existing_snapshot_doc[current_timestamp.isoformat()] = snapshot_data.dict()

            # Update the UserSnapShots document by appending the new snapshot
            user_snapshots_ref.update({"snapshot_doc": existing_snapshot_doc})
        else:
            # Create a new snapshot document if none exists
            user_snapshots_ref.set({
                "user_id": user.id,
                "snapshot_doc": {
                    current_timestamp.isoformat(): snapshot_data.dict()
                }
            })

    print("Snapshots created for all users.")


"""
@brief  Implementation of daily snapshots taken every 24 hours.
        TODO: Fix lol

"""


from fastapi_utils.tasks import repeat_every

@router.on_event("startup")
@repeat_every(seconds=1 * 60* 60 * 24)  # Run every 24 Hours
async def take_daily_snapshots():
    """
    @brief Periodically take daily snapshots of user data.
    """
    try:
        await create_snapshots()
    except Exception as e:
        # Log the exception instead of raising HTTPException in a background task
        print(f"Error while creating snapshots: {e}")






