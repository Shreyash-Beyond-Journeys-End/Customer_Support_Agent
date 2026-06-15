import asyncio
from app.services.Graph.graph import full_graph, half_graph
from app.models.graph import State , State2
from app.services.DataBases.Qdrant.unanswered_collection import dense_search
from app.services.DataBases.Supabase.supabase_service import update_query_status

async def process_single_query(query_id: str, query: str, session_id: str):
    state = State(
        query_id=query_id,
        session_id=session_id,
        query=query,
        transform_query=None,
        response=None,
        score=None,
        chat=None
    )

    config = {"configurable": {"thread_id": session_id}}


    update_query_status(query_id=query_id, status="InProgress")

    result = await full_graph.ainvoke(state, config=config)

    return result

async def process_unanswered_queries_batch(target_query: str):
    search_results = dense_search(target_query)
    
    semaphore = asyncio.Semaphore(10)
    
    async def process_item(item):
        async with semaphore:
            state = State2(
                query_id=item.get("query_id", ""),
                transform_query=item.get("text", ""),
                response=None,
                score=None
            )
            config = {"configurable": {"thread_id": item.get("query_id", "")}}
            return await half_graph.ainvoke(state, config=config)
            
    tasks = [process_item(item) for item in search_results]
    results = await asyncio.gather(*tasks)
    return results
