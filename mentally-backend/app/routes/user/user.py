from fastapi import APIRouter, Query, Request, status
from app.models.models_user_auth import LoginSchema, SignUpSchema
from app.models.models_user_data import UserSchema, MentalHealthData
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from firebase_admin import auth

from .firebase_init import db, firebase
from app.core.auth import get_authenticated_user_id

router = APIRouter()    # Creates Blueprint for router to main.py

@router.post('/signup')
async def create_account(user_data: SignUpSchema):
    """
    @brief  Endpoint that signs up a user with email, password, and nickname

    @params See below

    @returns JSON Success/Fail Response 
    """
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
        user_dict = user_schema.dict()
        doc_ref = db.collection("users").document(user_schema.user_id)
        doc_ref.set(user_dict)

        return JSONResponse(
            content={"message": "User account created successfully"},
            status_code=status.HTTP_201_CREATED,
        )

    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Account already created for the email {email}",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create account.",
        ) from exc




@router.post('/login')
async def create_access_token(user_data: LoginSchema):
    """
    @brief  Endpoint that logs in a user with email, password, and nickname

    @params See below

    @returns  A success/fail message and a JWt token that expires in 1 hour.
    """
    email = user_data.email
    password = user_data.password

    try:
        user = firebase.auth().sign_in_with_email_and_password(email=email, password=password)
        token = user['idToken']

        # Fetch the user by their UID from Firestore
        user_ref = db.collection("users").document(user['localId'])

        # Update the JWT in Firestore
        user_ref.update({"currentJWT": token})

        return JSONResponse(
            content={
                "message": "Log in successful",
                "token": token,
            },
            status_code=status.HTTP_200_OK,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        ) from exc



@router.post('/ping')
async def validate_token(request: Request):
    return {"user_id": get_authenticated_user_id(request)}

@router.post('/get_user_data')
def get_user_data(request: Request):
    """
    @brief  Endpoint that gets user data from Firestore ("users") collection. A JWT is used as a parameter to get the user_id of the individual to index their file

    @param  request (Request): Normally holds a string object with the JWT

    @returns  A dictionary of user data
    """
    try:
        uid = get_authenticated_user_id(request)

        # Fetch the user data from Firestore
        user_data_ref = db.collection("users").document(uid)
        user_data = user_data_ref.get()

        if not user_data.exists:
            raise HTTPException(status_code=404, detail="User data not found")

        return user_data.to_dict()  # Return the user data as a dictionary
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch user data.",
        ) from exc


@router.post('/update-mental-data')
async def update_mental_data(request: Request, data: MentalHealthData):
    """
    @brief  Endpoint used for updating a user's mental health data. Takes a JWT token, gets user -> gets data.

    @param  request (Request): primarily just a JWT token
            data (MentalHealthData) : a JSON object MentalHealthData. Not all attributes need to be filled, so overwriting only happens when included
    @returns  A success/fail message
    """
    try:
        uid = get_authenticated_user_id(request)

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

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update mental health data.",
        ) from exc

    return {"message": "Successfully updated data"}


@router.post('/get-user-history')
async def get_user_history(request: Request, user_id: str = Query(...)):
    """
    @brief  Endpoint that gets the user_snapshots doc from their user_id
    @param  user_id: The document ID (primary key)
    @returns User's snapshot doc in JSON format
    """
    try:
        requester_user_id = get_authenticated_user_id(request)
        if requester_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only access your own snapshot history.",
            )

        # Reference the document
        user_data_ref = db.collection("user_snapshots").document(user_id)

        # Fetch the document
        user_doc = user_data_ref.get()

        if user_doc.exists:
            return user_doc.to_dict()
        else:
            raise HTTPException(status_code=404, detail=f"User document with ID {user_id} not found.")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while fetching user history.",
        ) from exc
