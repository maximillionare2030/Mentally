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

if not firebase_admin._apps:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    serviceAccount = os.path.join(BASE_DIR, "serviceAccount.json")
    cred = credentials.Certificate(serviceAccount)
    firebase_admin.initialize_app(cred)
    db = firestore.client()

load_dotenv()

fireBaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
    "databaseURL" : ""
}

firebase = pyrebase.initialize_app(fireBaseConfig)
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

        return JSONResponse(content={"token": token}, status_code=200)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid credentials")



@router.post('/ping')
async def validate_token(request: Request):
    headers = request.headers
    jwt = headers.get('authorization')
    user = auth.verify_id_token(jwt)

    return user['uid']


@router.post('/user/update-mental-data')
async def update_mental_data(user_id : str, data : MentalHealthData):
    
    return
