from langchain_core.tools import tool
from app.services.DataBases.Qdrant.service_files import hybrid_search

@tool
def get_file_data(query: str) -> str:
    """
    Search Qdrant for content relevant to the query and return the fetched data.
    """
    return hybrid_search(query)
