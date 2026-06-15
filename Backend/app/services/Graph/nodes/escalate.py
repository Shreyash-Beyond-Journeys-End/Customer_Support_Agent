from app.models.graph import State
from app.services.DataBases.Supabase.supabase_service import update_query_status


def escalate_node(state: State):
    """The AI could not confidently answer. Hand off to a human by marking the
    query 'Pending' (the admin escalation queue picks these up). This prevents
    the query from being left stuck in the 'InProgress' state forever."""

    query_id = state.get("query_id")

    if query_id:
        update_query_status(query_id=query_id, status="Pending")

    return {}
