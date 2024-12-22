import pyrebase
from fastapi import FastAPI, APIRouter
from app.models.models_user_auth import LoginSchema, SignUpSchema
from app.models.models_user_data import UserSchema, MentalHealthData
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.requests import Request

import os
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, auth, firestore

from .firebase_init import fireBaseConfig, db, firebase

router = APIRouter()    # Creates Blueprint for router to main.py

@router.post('/signup')
async def create_account(user_data: SignUpSchema):
    email = user_data.email
    password = user_data.password
    nickname = user_data.nickname

    try:
        # Create user with Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password
        )

        # Create UserSchema instance with empty MentalHealthData
        user_schema = UserSchema(
            user_id=user.uid,
            email=email,
            nickname=nickname,
            currentJWT="",  # Store JWT after login
            mental_health_data=MentalHealthData()  # Initialize with default values (empty)
        )

        # Store the user data in Firestore
        user_dict = user_schema.dict()  # Convert UserSchema to dictionary
        doc_ref = db.collection("users").document(user_schema.user_id)
        doc_ref.set(user_dict)  # Store the dictionary in Firestore

        return JSONResponse(content={"message": f"User account created successfully"},
                            status_code=202)

    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=400,
            detail=f"Account already created for the email {email}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"An error occurred: {str(e)}"
        )





@router.post('/login')
async def create_access_token(user_data: LoginSchema):
    email = user_data.email
    password = user_data.password

    try:
        user = firebase.auth().sign_in_with_email_and_password(email=email, password=password)
        token = user['idToken']
        
        # Fetch the user by their UID from Firestore
        user_ref = db.collection("users").document(user['localId'])
        
        # Update the JWT in Firestore
        user_ref.update({"currentJWT": token})

        return JSONResponse(content={
                                        "message": "Log in Successful",
                                        "token": token}, status_code=200)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid credentials")



@router.post('/ping')
async def validate_token(request: Request):
    headers = request.headers
    jwt = headers.get('authorization')
    user = auth.verify_id_token(jwt)

    return user['uid']

@router.post('/get_user_data')
async def get_user_data(request: Request):
    headers = request.headers
    jwt = headers.get('Authorization')

    if not jwt:
        raise HTTPException(status_code=400, detail="Token not provided")

    try:
        # Verify the token
        user = auth.verify_id_token(jwt)
        uid = user['uid']

        # Fetch the user data from Firestore
        user_data_ref = db.collection("users").document(uid)
        user_data = user_data_ref.get()

        if not user_data.exists:
            raise HTTPException(status_code=404, detail="User data not found")

        return user_data.to_dict()  # Return the user data as a dictionary
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid credentials: {str(e)}")

@router.post('/update-mental-data')
async def update_mental_data(request: Request, data: MentalHealthData):
    headers = request.headers
    jwt = headers.get('Authorization')

    if not jwt:
        raise HTTPException(status_code=400, detail="Token not provided")
    
    try:
        # Verify the token
        user = auth.verify_id_token(jwt)
        uid = user['uid']

        # Get the existing mental_health_data
        user_data_ref = db.collection("users").document(uid)
        user_doc = user_data_ref.get()

        if user_doc.exists:
            current_data = user_doc.to_dict().get('mental_health_data', {})

            # Update the existing data with the new fields provided (excluding unset fields)
            updated_data = {**current_data, **data.dict(exclude_unset=True)}

            # Save the merged data back to Firestore
            user_data_ref.update({"mental_health_data": updated_data})
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid credentials: {str(e)}")

    return "Successfully updated data"


