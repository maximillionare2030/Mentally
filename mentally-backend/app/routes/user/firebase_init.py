import os
from dotenv import load_dotenv
load_dotenv()
import firebase_admin
from firebase_admin import credentials, firestore
import pyrebase

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    serviceAccount = os.path.join(BASE_DIR, "serviceAccount.json")
    cred = credentials.Certificate(serviceAccount)
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