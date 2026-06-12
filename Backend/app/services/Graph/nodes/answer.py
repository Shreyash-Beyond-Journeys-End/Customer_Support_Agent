from app.services.DataBases.Supabase.supabase_service import update_query_response
from app.models.graph import State
from app.services.DataBases.Qdrant.unanswered_collection import delete_chunk_by_id
from app.services.DataBases.Qdrant.answered_collection import store_query
from app.models.chunking import QueryChunk


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
        
    chunk = QueryChunk(query_id = query_id , transform_query = state['transform_query'])
        
    delete_chunk_by_id(query_id)
    
    store_query(chunk)
        
    return {}