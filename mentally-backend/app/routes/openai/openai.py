from fastapi import FastAPI, APIRouter, HTTPException
from app.models.models_openai import OpenAIRequest
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
            temperature=0.7
        )
        return {"response": response.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")