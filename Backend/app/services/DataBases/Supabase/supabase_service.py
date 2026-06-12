import os
from dotenv import load_dotenv
from supabase import create_client , Client
from app.models.supabase import User , Session , Query
from fastapi import HTTPException

load_dotenv()


# Initialize the Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)






def create_user(user: User):
    
   """Store user into supabase"""
   
   
   try:
       
       response = supabase.table("User").insert(user.model_dump()).execute()
       
       return {"message": "User created successfully", "data": response.data} 
   
   except Exception as e:
       
       raise HTTPException(status_code=400 , detail=str(e))
   
   
   
   
   
   
def create_session(session: Session):
    
   """Store session into supabase"""
   
   
   try:
       
       response = supabase.table("Session").insert(session.model_dump()).execute()
       
       
   
   except Exception as e:
       
       raise HTTPException(status_code=400 , detail=str(e))
   
   
   
   
   
   
def create_query(query: Query):
    
   """Store query into supabase"""
   
   
   try:
       
       response = supabase.table("Query").insert(query.model_dump()).execute()
       
       return {"message": "Session created successfully", "data": response.data} 
   
   except Exception as e:
       
       raise HTTPException(status_code=400 , detail=str(e))
   
   
   
   
   
   
def fetch_user_data(user_id: str):
       
    """Fetches all data for a specific user"""
       
    try:
           
        response = supabase.rpc(fn="get_user_data" , params={'p_user_id' : user_id}).execute()
           
        if not response.data:
               
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"data": response.data[0]}
    
    except Exception as e:
       
        raise HTTPException(status_code=400 , detail=str(e))    
    


    
    

def fetch_user_by_email(email: str):
    """Fetches user data using their email address"""
    
    try:

        response = supabase.rpc("get_user_by_email", {"p_email": email}).execute()
                
        if not response.data:
            
            raise HTTPException(status_code=404, detail="Invalid email")
            
        return {"data": response.data[0]}
    
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=str(e))  



def fetch_query(query_id: str):
    """Fetches complete query data using the query_id."""
    try:
        response = supabase.rpc("get_query_by_id", {"p_query_id": query_id}).execute()
        
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Query not found")
            
        query_data = response.data[0]
        
        return {"data": query_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



def fetch_user_sessions(user_id: str):
    """Fetches all sessions belonging to a specific user"""
    
    try:
        
        response = supabase.rpc("get_user_sessions", {"p_user_id": user_id}).execute()
        
        return {"data": response.data}
    
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
    
    
    
def fetch_session_queries(session_id: str):
    """Fetches all queries associated with a specific session"""
    
    try:
       
        response = supabase.rpc("get_session_queries", {"p_session_id": session_id}).execute()
        
        return {"data": response.data}
    
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
    
    
    
    
def update_response(query_id: str, response: str , status):
    """Updates the response field for a specific query_id."""
    try:

        response = supabase.rpc(
            "update_query_response", 
            {
                "p_query_id": query_id, 
                "p_new_response": response
            }
        ).execute()
        

        if not response.data:
            
            raise HTTPException(status_code=404, detail="Query not found")
            
        return {"message": "Response updated successfully", "data": response.data}
    
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
    
    
    
def update_query_response(query_id: str, response: str , score: float , status: str):
    
    """Updates the response, score, and status fields for a specific query_id."""
    
    try:
        
        response = supabase.rpc(
            "update_query_response_score_status", 
            {
                "p_query_id": query_id, 
                "p_new_response": response,
                "p_new_score": score,
                "p_new_status": status
            }
        ).execute()
        
        if not response.data:
            
            raise HTTPException(status_code=404, detail="Query not found")
            
        return {"message": "Query updated successfully", "data": response.data}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
    
    
    
def update_transform_query(query_id: str, transform_query: str):
    """Updates the transform_query field for a specific query_id."""
    try:
        
        response = supabase.rpc(
            "update_transform_query", 
            {
                "p_query_id": query_id, 
                "p_new_transform_query": transform_query
            }
        ).execute()
        
 
        if not response.data:
            raise HTTPException(status_code=404, detail="Query not found")
            
        return {"message": "Transform query updated successfully", "data": response.data}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
    
def fetch_queries_by_ids(query_ids: list[str]):
    try:
        response = supabase.rpc(
            "get_queries_by_ids", 
            {"p_query_ids": query_ids}
        ).execute()
        
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def update_query_review(query_id: str, review: str):
    """Updates the review field for a specific query."""
    try:
        response = supabase.rpc(
            "update_query_review", 
            {
                "p_query_id": query_id, 
                "p_new_review": review
            }
        ).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Query not found")
            
        return {"message": "Review submitted successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))