from app.services.DataBases.Supabase.supabase_service import update_query_response
from app.models.graph import State

def answer_node(state: State):
    """In order to answer user query it updated supabase with response, score and change status to Resolved"""
    
    query_id = state.get("query_id")
   
    response = state.get("resposne") 
    score = state.get("score")
    
    if query_id:
        update_query_response(
            query_id=query_id,
            response=response ,
            score=score ,
            status='Resolved'
        )
        
    return {}