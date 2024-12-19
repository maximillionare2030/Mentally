from pydantic import BaseModel

class SignUpSchema(BaseModel):
    email: str
    nickname: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "sample@example.com",
                "nickname": "sample_user",
                "password": "Password123!"
            }
        }

class LoginSchema(BaseModel):
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "sample@example.com",
                "password": "Password123!"
            }
        }
 










