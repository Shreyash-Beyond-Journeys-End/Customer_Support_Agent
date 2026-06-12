from fastapi import APIRouter, Body, BackgroundTasks, Path
from app.models.chatbox import UserCreateRequest, UserLoginRequest, SessionCreateRequest, QueryCreateRequest, QueryReviewRequest
from app.services.Chatbox.chatbox_service import (
    handel_create_user,
    handel_autorization,
    handel_get_user_sessions,
    handel_get_session_queries,
    handel_create_session,
    handel_create_query,
    handel_submit_review
)

router = APIRouter(prefix="/chatbox", tags=["Chatbox"])

@router.post("/users")
def create_user(request: UserCreateRequest = Body(...)):
    """Create a new user."""
    handel_create_user(
        name=request.name,
        email=request.email,
        password=request.password
    )
    return {"message": "User created successfully"}

@router.post("/login")
def login_user(request: UserLoginRequest = Body(...)):
    """Authenticate a user."""
    return handel_autorization(
        email=request.email,
        password=request.password
    )

@router.get("/users/{user_id}/sessions")
def get_user_sessions(user_id: str = Path(...)):
    """Get all sessions for a specific user."""
    return handel_get_user_sessions(user_id=user_id)

@router.post("/sessions")
def create_session(request: SessionCreateRequest = Body(...)):
    """Create a new session for a user."""
    handel_create_session(user_id=request.user_id)
    return {"message": "Session created successfully"}

@router.get("/sessions/{session_id}/queries")
def get_session_queries(session_id: str = Path(...)):
    """Get all queries within a specific session."""
    return handel_get_session_queries(session_id=session_id)

@router.post("/queries")
def create_query(
    background_tasks: BackgroundTasks,
    request: QueryCreateRequest = Body(...)
):
    """Create a new query in a session and process it in the background."""
    handel_create_query(
        query=request.query,
        session_id=request.session_id,
        background_tasks=background_tasks
    )
    return {"message": "Query received and is being processed"}

@router.post("/queries/{query_id}/review")
def submit_review(query_id: str = Path(...), request: QueryReviewRequest = Body(...)):
    """Submit feedback (thumbs up/down) for a specific query."""
    return handel_submit_review(query_id=query_id, review=request.review)
