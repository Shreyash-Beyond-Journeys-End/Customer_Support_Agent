import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from app.models.graph import State, AgentResponse
from app.services.Graph.nodes.tools.get_answered_query import get_answered_query
from app.services.Graph.nodes.tools.get_file_data import get_file_data
from app.services.Graph.nodes.tools.evaluator import evaluate

load_dotenv()

llm = ChatOpenAI(model=os.getenv("model"))

tools = [get_answered_query, get_file_data]

system_prompt = """You are a highly capable customer support agent.
You must act strictly based on retrieved data.
If the data fully answers the query, return the answer.
If the data is insufficient, you must return nothing/empty.
You cannot call any single tool more than 7 times.
"""

agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt=system_prompt,
    response_format=AgentResponse,
)

def main_agent_node(state: State):
    query = state.get("transform_query")
    
    result = agent.invoke({"messages": [("user", query)]})
    
    structured_data = result.get("structured_response")
    

    actual_response = getattr(structured_data, "response", None)

    if not actual_response:
        return {}
        
    tool_messages = [m.content for m in result["messages"] if m.type == "tool"]
    content = "\n".join(tool_messages)
        

    score = evaluate(query, actual_response, content)
    
    if score > 0:
        return {"response": actual_response, "score": score}
        
    return {}
