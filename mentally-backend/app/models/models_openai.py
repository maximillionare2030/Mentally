from pydantic import BaseModel

class OpenAIRequest(BaseModel):
    prompt: str

    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "What time is it?",
            }
        }

