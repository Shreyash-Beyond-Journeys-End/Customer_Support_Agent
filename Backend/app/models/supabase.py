from pydantic import BaseModel , Field 
from datetime import datetime 
from typing_extensions import Literal
import uuid


class User(BaseModel):
    
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str 
    email: str
    password: str
    


class Session(BaseModel):
    
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    
    
    
    
class Query(BaseModel):
    
    query_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    query: str
    transform_query: str | None = Field(default=None)
    response: str | None = Field(default=None)
    review: Literal["like" , "dislike" , None] = Field(default=None)
    status : Literal['Pending' , 'InProgress' , 'Resolved']
    score: float | None = Field(default=None)
    
    