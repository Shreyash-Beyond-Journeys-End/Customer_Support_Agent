import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from app.models.graph import State
from app.services.DataBases.Supabase.supabase_service import update_transform_query
from app.models.chunking import QueryChunk
from app.services.DataBases.Qdrant.unanswered_collection import store_query

load_dotenv()

class QueryTransform(BaseModel):
    transform_query: str = Field(description="The core standalone query extracted and formulated from the chat history.")

llm = ChatOpenAI(model=os.getenv("model")).with_structured_output(QueryTransform)

sys_prompt = """You are a helpful assistant that reformulates user queries based on their chat history.
Your goal is to extract the user's core standalone query. 
Analyze the provided chat history and the current query. 
If the current query relies on context from the chat history (e.g., uses pronouns or refers to previous messages), rewrite it into a clear, standalone question that can be understood without any context.
If the current query is already standalone or there is no relevant chat history, return it as is."""

sys_message = SystemMessage(content=sys_prompt)

def transform_query_node(state: State):
    """Analyze chat history and return the exact actual standalone user query"""
    
    chat = state.get("chat") 
    current_query = state.get("query") 
    
    if not chat.strip():
        return {"transform_query": current_query}
        
    human_msg_content = f"Chat History:\n{chat}\n\nCurrent Query:\n{current_query}\n\nBased on the chat history above, what is the core standalone query the user is asking now?"
    human_msg = HumanMessage(content=human_msg_content)
    
    
    response = llm.invoke([sys_message, human_msg])
    
    update_transform_query(query_id=state['query_id'] , transform_query=response.transform_query)
    
    chunk = QueryChunk(query_id = state['query_id'] , transform_query = response.transform_query)
    
    store_query(chunk)
        
    return {"transform_query": response.transform_query}

