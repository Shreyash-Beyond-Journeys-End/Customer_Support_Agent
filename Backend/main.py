from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chatbox_route import router as chatbox_router
from app.routes.admin_route import router as admin_router

app = FastAPI(
    title="Customer Support Agent API",
    description="Backend API for an AI-Powered Multi-Turn Customer Support Agent",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbox_router)
app.include_router(admin_router)

@app.get("/")
def root():
    """Health check endpoint to verify the API is running."""
    return {"message": "Customer Support Agent API is running!"}
