from langchain_core.tools import tool
from app.services.DataBases.Qdrant.answered_collection import hybrid_search
from app.services.DataBases.Supabase.supabase_service import fetch_queries_by_ids

@tool
def get_answered_query(query: str) -> dict:
    """
    Search for answered queries relevant to the given query.
    Executes a vector search to find relevant query IDs and then fetches the complete query data.
    """
    query_ids = hybrid_search(query)
    
    if not query_ids:
        return {"data": []}
        
    results = fetch_queries_by_ids(query_ids)
    return results
