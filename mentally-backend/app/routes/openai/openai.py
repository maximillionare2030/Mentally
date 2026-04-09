from fastapi import APIRouter, HTTPException
from app.models.models_openai import OpenAIRequest, BuddyChatRequest
from openai import OpenAI

from app.core.config import get_settings
router = APIRouter()

settings = get_settings()
client = OpenAI(
    api_key=settings.openai_api_key,
)


def _create_chat_completion(prompt: str, max_tokens: int) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are the Mentally assistant. Respond with concise, supportive guidance, "
                    "avoid overclaiming, and do not present yourself as a licensed clinician."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=max_tokens,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


@router.post("/generate-mental-health-tests/")
async def generate_text_mental(request: OpenAIRequest):
    """
    @brief   Endpoint to generate text using OpenAI API.
    @params  request (OpenAIRequest) : the user prompt, entered as a string normally
    """
    # Prepare the instruction prompt that includes your requirements
    trained_prompt = f"""
    1. You are an AI Chatbot for a Mental health Tracking app called 'Mentally'.

    Respond in only 2-4 sentences with advice based on the following. Also, be aware of this format and respond according:

    ** Only one of these will be evaluated per request, so don't include the other one in your response if not provided **
    PHQ: (score) - respond with how someone with a PHQ score of (score) should try to improve their score
    Beckman: (score) - respond with how someone with a PHQ score of (score) should try to improve their score
    emotion : value **AND** Difference : value). Here, a current mental score will be provided, as well as a score from -100 to 100.
                            this measures how intense of an emotion is felt, so for example if fear : 100, then the person is very fearful


    Start by stating their score and what test they just submitted, then provide ways to improve their score / in the given area.
    - For PHQ and Beckman, focus on mental health
    - For emotion scores, forcus on improving that specific emotion. (example, if someone is sad, try to help them improve happiness)
    make it seem like you are talking to a person as if you are a therapist and concerned for their well-being.

    If their score is good (low) then encourage them to keep going and congratulate them on their score, but still provide input on improvements if any.

    


    {request.prompt}  # Access the prompt from the request

    """
    
    try:
        return {"response": _create_chat_completion(trained_prompt, max_tokens=100)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail="OpenAI API error.") from exc

@router.post("/chat-bot-buddy/")
async def generate_buddy_response(payload: BuddyChatRequest):
    """
    @brief  Endpoint to generate text using OpenAI API, but for the ChatBOT feature

    @param  
    """
    request = payload.request
    data = payload.data

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
        proprely analyzing their data thoroughly.

    - If you see any critical values like intense fear, please try to ask the user about it.

    - Keep responses concise, no more than 5 sentences
    {data}  # User's current Mental health profile
    {request.prompt} # User's prompt
    """

    try:
        return {"response": _create_chat_completion(trained_prompt, max_tokens=200)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail="OpenAI API error.") from exc

    
"""
For Chatbuddy, I want to be able to analyze user's time-series data and give responses based on that. Initially should prompt with the user's emotional data and PHQ and Beckman score, then ask them if they have any questions, if not then they should ask questions based on this data, acting as a therapist.
"""
