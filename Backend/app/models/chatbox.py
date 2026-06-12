from pydantic import BaseModel, EmailStr
from typing_extensions import Literal

class UserCreateRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class SessionCreateRequest(BaseModel):
    user_id: str

class QueryCreateRequest(BaseModel):
    session_id: str
    query: str

class QueryReviewRequest(BaseModel):
    review: Literal["like", "dislike"]
