from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = FastAPI()

@app.get("/")
def read_root():
    #api_url = os.getenv("API_URL", "default_value")
    return {"message": "hello-update"}
