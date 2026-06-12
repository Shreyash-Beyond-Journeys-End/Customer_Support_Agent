from typing_extensions import TypedDict , Annotated 
from pydantic import BaseModel , Field


# All have "created_at" in supabase it is a timestamp
class State(TypedDict):
    
    query_id: str 
    session_id: str 
    query: str
    transform_query: str  | None 
    response: str | None 
    score: float | None 
    chat: str | None
    
    
class State2(TypedDict):
    
    query_id: str 
    transform_query: str  | None 
    response: str | None 
    score: float | None 
        
    
class AgentResponse(BaseModel):
    
    response : str | None = Field(description="Provide response only if you are sure that you have all details to answer user's query")