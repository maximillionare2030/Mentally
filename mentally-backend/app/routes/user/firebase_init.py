import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import pyrebase
from app.core.config import get_settings

load_dotenv()

settings = get_settings()


def _get_service_account_path() -> str:
    if settings.firebase_service_account:
        return settings.firebase_service_account

    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "serviceAccount.json")

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    service_account = _get_service_account_path()
    cred = credentials.Certificate(service_account)
    firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Initialize Pyrebase (for other Firebase features)
fireBaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
    "databaseURL": ""
}

firebase = pyrebase.initialize_app(fireBaseConfig)
