from fastapi import APIRouter, Query, Body, Path, UploadFile, File
from datetime import datetime
from typing import Optional
from app.services.Admin.admin_service import AdminService
from app.models.admin import (
    AnalyticsSummaryResponse,
    UnansweredQueryResponse,
    EscalationTopicResponse,
    ResolveQueryRequest,
    ResolveQueryResponse,
    FeedbackQueryResponse,
    SessionContextResponse,
    UploadFileResponse
)

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/analytics", response_model=AnalyticsSummaryResponse)
def get_analytics_summary(
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics")
):
    """Get overall analytics summary for the Admin Dashboard."""
    return AdminService.get_analytics_summary(start_date=start_date, end_date=end_date)


@router.get("/unanswered", response_model=UnansweredQueryResponse)
def get_top_unanswered_questions(
    limit: int = Query(50, description="Limit the number of questions returned")
):
    """Get the top unanswered questions (escalation queue)."""
    return AdminService.get_top_unanswered_questions(limit=limit)


@router.get("/escalations/topics", response_model=EscalationTopicResponse)
def get_escalation_frequency_by_topic(
    start_date: Optional[datetime] = Query(None, description="Start date"),
    end_date: Optional[datetime] = Query(None, description="End date")
):
    """Get escalation frequency grouped by topic."""
    return AdminService.get_escalation_frequency_by_topic(start_date=start_date, end_date=end_date)


@router.post("/resolve", response_model=ResolveQueryResponse)
def resolve_query(request: ResolveQueryRequest = Body(...)):
    """Admin manual resolution of an escalated query."""
    AdminService.resolve_query(query_id=request.query_id, admin_response=request.admin_response)
    return ResolveQueryResponse(message="Query resolved successfully")


@router.get("/feedback/negative", response_model=FeedbackQueryResponse)
def get_negative_feedback_queries(
    limit: int = Query(50, description="Limit the number of queries returned")
):
    """Get queries with negative feedback for Knowledge Base review."""
    return AdminService.get_negative_feedback_queries(limit=limit)


@router.get("/session/{session_id}/context", response_model=SessionContextResponse)
def get_session_context(
    session_id: str = Path(..., description="The ID of the session")
):
    """Get the full conversation context for an escalated query session."""
    return AdminService.get_session_context(session_id=session_id)


@router.post("/knowledge-base/upload", response_model=UploadFileResponse)
async def upload_knowledge_base_file(file: UploadFile = File(...)):
    """Upload a Markdown file to be chunked and stored in Qdrant (Knowledge Base)."""
    content = await file.read()
    decoded_content = content.decode("utf-8")
    result = AdminService.upload_knowledge_base_file(decoded_content)
    return UploadFileResponse(**result)
