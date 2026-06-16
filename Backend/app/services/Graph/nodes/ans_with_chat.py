import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from app.models.graph import State, AgentResponse
from langchain_core.messages import SystemMessage, HumanMessage
from app.services.Graph.nodes.tools.evaluator import evaluate

load_dotenv()

llm = ChatOpenAI(model=os.getenv("model")).with_structured_output(AgentResponse)

sys_prompt = """You are a Supabase customer support agent. Answer the user's query using only their chat history, strictly ignoring your pretrained knowledge.
If the user is engaging in basic small talk and not asking about our products or services, simply respond politely and naturally without referencing the chat history"""

sys_message = SystemMessage(content=sys_prompt)

def ans_with_chat_node(state: State):
    """Try to answer user query final query only using his chat history"""
    
    chat = state.get('chat') or ""
    query = state.get('query') or ""
    
    chat_context = f"Chat:\n{chat}"
    
    human_msg = HumanMessage(content=f"Query: {query}\n\n{chat_context}")
    response = llm.invoke([sys_message, human_msg])
    
    if response and response.response:
        actual_response = response.response
        
        score = evaluate(query , actual_response , chat_context)
            
        if score == 0:
            return {"response": None}
                
        return {"response": actual_response , "score" : score}
            
    return {"response": None}