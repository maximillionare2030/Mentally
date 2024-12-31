from pydantic import BaseModel

class SignUpSchema(BaseModel):
    """
    @brief  Model used for SignUp endpoint. Signs up if all parameters are valid
    
    @attributes
        email(str): User' email address
        nickname(str): User's chosen nickname
        password(str): User's password
    """
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
    """
    @brief  Model used for Login endpoint.

    @attributes
        email(str): User' email address
        password(str): User's password
    """
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "sample@example.com",
                "password": "Password123!"
            }
        }
 










