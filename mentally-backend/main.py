from fastapi import FastAPI, APIRouter, HTTPException
import uvicorn
from dotenv import load_dotenv

from app.routes.user.user import router as user_router

load_dotenv()  # Load environment variables from .env file


app = FastAPI(
    description = "Mentally app",
    title="Mentally Backend Server with Firebase")

app.include_router(user_router, prefix="/user")


@app.get("/")
def read_root():
    #api_url = os.getenv("API_URL", "default_value")
    return {"message": "hello-update"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)


# Run command: .\venv\Scripts\Activate.ps1, pytho main.py