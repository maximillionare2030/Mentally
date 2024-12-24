from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

import os
from dotenv import load_dotenv

from app.routes.user.user import router as user_router
from app.routes.user.snapshots import router as snapshot_router
from app.routes.openai.openai import router as openai_router

load_dotenv()  # Load environment variables from .env file


app = FastAPI(
    description = "Mentally app",
    title="Mentally Backend Server with Firebase")


# Define CORS settings
origins = [
    os.getenv("REACT_APP_URL", "http://localhost:3000"),
]

# Add CORSMiddleware to the app
app.add_middleware(
CORSMiddleware,
allow_origins=["*"], # Allows all origins
allow_credentials=True,
allow_methods=["*"], # Allows all methods
allow_headers=["*"], # Allows all headers
)

app.include_router(user_router, prefix="/user")
app.include_router(snapshot_router, prefix="/db")
app.include_router(openai_router, prefix="/openai")


@app.get("/")
def read_root():
    #api_url = os.getenv("API_URL", "default_value")
    return {"message": "hello-update"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)


# Run command: .\venv\Scripts\Activate.ps1, pytho main.py2