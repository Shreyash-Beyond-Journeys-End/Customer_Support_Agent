from app.services.DataBases.Supabase.supabase_service import supabase
from app.services.DataBases.Qdrant.chunking import getChunks
from app.services.DataBases.Qdrant.service_files import store_query
from app.models.admin import (
    AnalyticsSummaryResponse,
    UnansweredQueryResponse,
    UnansweredQuery,
    EscalationTopicResponse,
    EscalationTopic,
    FeedbackQueryResponse,
    FeedbackQuery,
    SessionContextResponse,
    SessionContextQuery,
)
from fastapi import HTTPException
from datetime import datetime
from typing import Optional

class AdminService:
    @staticmethod
    def get_analytics_summary(start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> AnalyticsSummaryResponse:
        try:
            params = {}
            if start_date:
                params["p_start_date"] = start_date.isoformat()
            if end_date:
                params["p_end_date"] = end_date.isoformat()
                
            response = supabase.rpc("admin_get_analytics_summary", params).execute()
            if not response.data:
                return AnalyticsSummaryResponse(
                    total_queries=0, 
                    resolved_queries=0, 
                    escalated_queries=0, 
                    resolution_rate=0.0
                )
            data = response.data[0]
            return AnalyticsSummaryResponse(**data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_top_unanswered_questions(limit: int = 50) -> UnansweredQueryResponse:
        try:
            response = supabase.rpc("admin_get_top_unanswered_questions", {"p_limit": limit}).execute()
            return UnansweredQueryResponse(data=[UnansweredQuery(**item) for item in response.data])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_escalation_frequency_by_topic(start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> EscalationTopicResponse:
        try:
            params = {}
            if start_date:
                params["p_start_date"] = start_date.isoformat()
            if end_date:
                params["p_end_date"] = end_date.isoformat()
                
            response = supabase.rpc("admin_get_escalation_frequency_by_topic", params).execute()
            return EscalationTopicResponse(data=[EscalationTopic(**item) for item in response.data])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def resolve_query(query_id: str, admin_response: str) -> None:
        try:
            supabase.rpc("admin_resolve_query", {
                "p_query_id": query_id, 
                "p_admin_response": admin_response
            }).execute()
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_negative_feedback_queries(limit: int = 50) -> FeedbackQueryResponse:
        try:
            response = supabase.rpc("admin_get_negative_feedback_queries", {"p_limit": limit}).execute()
            return FeedbackQueryResponse(data=[FeedbackQuery(**item) for item in response.data])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_session_context(session_id: str) -> SessionContextResponse:
        try:
            response = supabase.rpc("admin_get_session_context", {"p_session_id": session_id}).execute()
            return SessionContextResponse(data=[SessionContextQuery(**item) for item in response.data])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def upload_knowledge_base_file(content: str) -> dict:
        try:
            chunks = getChunks(content, max_token=500)
            store_query(chunks)
            return {"message": "File processed and added to Qdrant successfully", "chunks_processed": len(chunks)}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def upload_knowledge_base_pdf(content: bytes) -> dict:
        try:
            import io
            from pypdf import PdfReader
            
            reader = PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                extracted_text = page.extract_text()
                if extracted_text:
                    text += extracted_text + "\n"
                    
            chunks = getChunks(text, max_token=500)
            store_query(chunks)
            return {"message": "PDF processed and added to Qdrant successfully", "chunks_processed": len(chunks)}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def upload_knowledge_base_url(url: str) -> dict:
        try:
            import requests
            from bs4 import BeautifulSoup
            
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")
            
            text = soup.get_text(separator="\n", strip=True)
            
            chunks = getChunks(text, max_token=500)
            store_query(chunks)
            return {"message": "URL processed and added to Qdrant successfully", "chunks_processed": len(chunks)}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

