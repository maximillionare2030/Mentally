from pydantic import BaseModel

class OpenAIRequest(BaseModel):
    """
    @brief  Model used for AI Model Request. Used mainly in mental health tests completion reviews and Chatbot responses

    @attributes
        prompt : str - API Call input requests that get added to content of OpenAI call
    """
    prompt: str

    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "What time is it?",
            }
        }

