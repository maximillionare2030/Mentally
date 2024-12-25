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
    # Get current timestamp
    current_timestamp = datetime.utcnow()

    # Query all users
    users_ref = db.collection('users')
    users = users_ref.stream()

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

# Initialize the BackgroundScheduler
scheduler = BackgroundScheduler()

# Schedule the `create_snapshots` function to run every 24 hours (86400 seconds)
scheduler.add_job(create_snapshots, 'interval', seconds=15)

# Start the scheduler
scheduler.start()

@router.post("/take-daily-snapshots")
async def take_daily_snapshots(background_tasks: BackgroundTasks):
    try:
        # You can still manually trigger the task if needed, but it will run every 24 hours automatically
        background_tasks.add_task(create_snapshots)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "Snapshot creation is scheduled to run every 24 hours."}
