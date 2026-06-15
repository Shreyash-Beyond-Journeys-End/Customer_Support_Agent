from app.services.Graph.nodes.ans_with_chat import ans_with_chat_node
from app.services.Graph.nodes.answer import answer_node
from app.services.Graph.nodes.inject_chat import inject_chat_node
from app.services.Graph.nodes.transform_query import transform_query_node
from app.services.Graph.nodes.main_agent import main_agent_node
from app.services.Graph.nodes.escalate import escalate_node

from langgraph.graph import START , END  , StateGraph
from app.models.graph import State , State2




def router(state: State):
    
    if state["response"]:
        return "answer"
    
    return "continue"




builder = StateGraph(State)

builder.add_node("ans_with_chat_node" , ans_with_chat_node)
builder.add_node("answer_node" , answer_node)
builder.add_node("inject_chat_node" , inject_chat_node)
builder.add_node("transform_query_node" , transform_query_node)
builder.add_node("main_agent_node" , main_agent_node)
builder.add_node("escalate_node" , escalate_node)


builder.add_edge(START , "inject_chat_node")
builder.add_edge("inject_chat_node" , "ans_with_chat_node" )
builder.add_conditional_edges("ans_with_chat_node" , router , {"answer": "answer_node" , "continue" : "transform_query_node"})
builder.add_edge("transform_query_node" , "main_agent_node")
builder.add_conditional_edges("main_agent_node" , router , {"answer": "answer_node" , "continue" : "escalate_node"})
builder.add_edge("escalate_node" , END)
builder.add_edge("answer_node" , END)


full_graph = builder.compile()



builder_2 = StateGraph(State2)

builder_2.add_node("main_agent_node", main_agent_node)
builder_2.add_node("answer_node", answer_node)

builder_2.add_edge(START, "main_agent_node")
builder_2.add_conditional_edges("main_agent_node" , router , {"answer": "answer_node" , "continue" : END})
builder_2.add_edge("answer_node" , END)


half_graph = builder_2.compile()





















