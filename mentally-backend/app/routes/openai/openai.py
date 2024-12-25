from fastapi import FastAPI, APIRouter, HTTPException
from app.models.models_openai import OpenAIRequest
from app.models.models_user_data import MentalHealthData
import openai
from openai import OpenAI

import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

client = OpenAI(
    api_key = os.getenv('OPENAI_API_KEY'),
)
@router.post("/generate-mental-health-tests/")
async def generate_text_mental(request: OpenAIRequest):
    """
    Endpoint to generate text using OpenAI API.
    """
    # Prepare the instruction prompt that includes your requirements
    trained_prompt = f"""
    1. You are an AI Chatbot for a Mental health Tracking app called 'Mentally'.

    Respond in only 2-4 sentences with advice based on the following. Also, be aware of this format and respond according:

    ** Only one of these will be evaluated per request, so don't include the other one in your response if not provided **
    PHQ: (score) - respond with how someone with a PHQ score of (score) should try to improve their score
    Beckman: (score) - respond with how someone with a PHQ score of (score) should try to improve their score

    Start by stating their score and what test they just submitted, then provide ways to improve their score / mental health,
    make it seem like you are talking to a person as if you are a therapist and concerned for their well-being.

    If their score is good (low) then encourage them to keep going and congratulate them on their score, but still provide input on improvements if any.


    {request.prompt}  # Access the prompt from the request

    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": trained_prompt}],
            max_tokens=100,
            temperature=0.7,
        )
        return {"response": response.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    
from pydantic import BaseModel

class MentalHealthData(BaseModel):
    fear: int
    surprise: int
    disgust: int
    PHQ_score: int
    happiness: int
    BDI_score: int
    anger: int
    sadness: int
    notes: str

@router.post("/chat-bot-buddy/")
async def generate_buddy_response(request: OpenAIRequest, data: MentalHealthData):
    """
    Endpoint to generate text using OpenAI API.
    """
    # Verify the incoming data and prompt
    print("Received mental health data:", data)
    print("Received user prompt:", request.prompt)

    trained_prompt = f"""
    1. You are an AI Chatbot for a Mental health Tracking app called 'Mentally'.

    You have access to the users' mental health profile consisting of:
    PHQ-9 Score, Beckman's Depression Inventory Score, 
    and values from [-100, 100] for the user's Ekman's emotions that include:
    Happiness, Disgust, Surprise, Anger, Sadness, and Fear.

    - A more negative value indicates a less intense level of that emotion, while a more positive is more intense .ex -100 Happiness : Very Unhappy, +100 Happiness : Very Happy
    - You should initially prompt the user with a summary of their emotions and which ones are more critically good or bad.
        - Logically, higher happiness is good, but higher emotional values for disgust and fear are bad

    - YOU SHOULD ACT AS A THERAPIST AND PSYCHOLOGIST WHEN REVIEWING DATA. Stay neutral and positive, while also listening to whatever the user prompts, as well as 
        proprely analyzing their data thoroughly
    {data}  # User's current Mental health profile
    {request.prompt} # User's prompt
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": trained_prompt}],
            max_tokens=200,
            temperature=0.7,
        )
        return {"response": response.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

    
"""
For Chatbuddy, I want to be able to analyze user's time-series data and give responses based on that. Initially should prompt with the user's emotional data and PHQ and Beckman score, then ask them if they have any questions, if not then they should ask questions based on this data, acting as a therapist.
"""