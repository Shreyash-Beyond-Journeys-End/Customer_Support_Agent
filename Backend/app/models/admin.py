from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AnalyticsSummaryResponse(BaseModel):
    total_queries: int
    resolved_queries: int
    escalated_queries: int
    resolution_rate: float

class UnansweredQuery(BaseModel):
    query_id: str
    query: Optional[str]
    session_id: str
    transform_query: Optional[str]
    created_at: datetime
    score: Optional[float]
    status: Optional[str]

class UnansweredQueryResponse(BaseModel):
    data: List[UnansweredQuery]

class EscalationTopic(BaseModel):
    topic: Optional[str]
    escalation_count: int

class EscalationTopicResponse(BaseModel):
    data: List[EscalationTopic]

class ResolveQueryRequest(BaseModel):
    query_id: str
    admin_response: str

class ResolveQueryResponse(BaseModel):
    message: str

class FeedbackQuery(BaseModel):
    query_id: str
    query: Optional[str]
    session_id: str
    transform_query: Optional[str]
    response: Optional[str]
    review: Optional[str]
    created_at: datetime

class FeedbackQueryResponse(BaseModel):
    data: List[FeedbackQuery]

class SessionContextQuery(BaseModel):
    query_id: str
    query: Optional[str]
    transform_query: Optional[str]
    response: Optional[str]
    created_at: datetime
    score: Optional[float]
    status: Optional[str]

class SessionContextResponse(BaseModel):
    data: List[SessionContextQuery]

class UploadFileResponse(BaseModel):
    message: str
    chunks_processed: int
