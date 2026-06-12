from app.services.DataBases.Supabase.supabase_service import create_session , create_query , fetch_user_sessions , fetch_session_queries , create_user , fetch_user_by_email
from app.models.supabase import User 
from app.models.supabase import Session , Query
from fastapi import HTTPException



async def handel_create_user(name: str , email: str , password: str):
    
    user = User(name= name , email = email , password = password)
       
    try:
        
        create_user(user=user)
        
    except HTTPException:
        
        raise
    
    except Exception as e:
       
       raise HTTPException(status_code=400 , detail=str(e))
   
   
   
   
async def handel_autorization(email: str , password: str):
    
    
    try:
        
        user= fetch_user_by_email(email)["data"]
        
        user_password = user['password']
        
        if password != user_password:
            
            raise HTTPException(status_code=401 , detail="Invalid password")
        
        
        return {"user_data" : user}
    
    except HTTPException:
        
        raise
    
    except Exception as e:
       
       raise HTTPException(status_code=400 , detail=str(e))


async def handel_get_user_sessions(user_id: str):
    
    try:
        
        return fetch_user_sessions(user_id)
    
    except Exception as e:
       
        raise HTTPException(status_code=400 , detail=str(e)) 




async def handel_get_session_queries(session_id: str):
    
    try:
        
        return fetch_session_queries(session_id)
    
    except Exception as e:
       
        raise HTTPException(status_code=400 , detail=str(e)) 
    
        
        
        


async def handel_create_session(user_id: str):
    
    session = Session(user_id = user_id)
       
    try:
        
        create_session(session)
        
    except Exception as e:
       
       raise HTTPException(status_code=400 , detail=str(e))
   
   
   

   
async def handel_create_query(user_id: str , session_id: str):
    
    
    
    session = Session(user_id = user_id)
       
    try:
        
        create_session(session)
        
    except Exception as e:
       
       raise HTTPException(status_code=400 , detail=str(e))