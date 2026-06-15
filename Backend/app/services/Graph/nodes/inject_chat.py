from app.models.graph import State
from app.services.DataBases.Supabase.supabase_service import fetch_query , fetch_session_queries





def inject_chat_node(state: State):
    
    """get chat history of a user upto a provided query"""
    
    session_id = state['session_id']
    
    query_id = state['query_id']
    
    queries = fetch_session_queries(session_id).get("data") or []


    chat = ""

    for query in queries:
        if query['query_id'] == query_id:
            chat = chat + "\n\n" + f"query: {query['query']}" 
            break
        
        chat = chat + "\n\n" + f"query: {query['query']}\nresponse: {query['response']}" 
        

    
    
    
    return {
        "chat" : chat.strip()
    }


    
    
    
    