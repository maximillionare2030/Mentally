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
import jwt

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

@router.post('/user/update-mental-data')
async def update_mental_data(request: Request, data: MentalHealthData):
    # Get the JWT token from the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise HTTPException(status_code=400, detail="Authorization header is missing")
    
    # Extract the token from the header (e.g. "Bearer <token>")
    token = auth_header.split(" ")[1]  # Assuming "Bearer <token>"
    
    # Get user_id from the token
    user_id = get_user_id_from_jwt(token)
    
    # Get the user document reference from Firestore
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the mental health data
    user_ref.update({
        "mental_health_data": {
            "surprise": data.surprise,
            "disgust": data.disgust,
            "happiness": data.happiness,
            "PHQ_score": data.PHQ_score,
            "anger": data.anger,
            "sadness": data.sadness,
            "fear": data.fear,
        }
    })
    
    return {"message": "Mental health data updated successfully"}


# Helper function to extract user_id from JWT
def get_user_id_from_request(request: Request):
    try:
        # Extract the token from the Authorization header (e.g., "Bearer <token>")
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            raise HTTPException(status_code=400, detail="Authorization header is missing")
        
        # Extract the token (Assuming the header format is "Bearer <token>")
        token = auth_header.split(" ")[1]
        
        # Decode the JWT
        payload = jwt.decode(token, options={"verify_signature": False})  # You can verify the signature if you have the secret
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid JWT, no user_id found")
        
        return user_id
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="JWT has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid JWT token")
    except IndexError:
        raise HTTPException(status_code=400, detail="Token format is invalid")