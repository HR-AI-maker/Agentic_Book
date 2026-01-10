"""
Chat Router - RAG Chatbot API endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.rag_service import RAGService

router = APIRouter()
rag_service = RAGService()


class ChatRequest(BaseModel):
    question: str
    context: Optional[str] = None
    user_id: Optional[str] = None


class Source(BaseModel):
    chapter: str
    title: str
    relevance: float


class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    message_id: str


class FeedbackRequest(BaseModel):
    message_id: str
    rating: str  # "helpful" or "not_helpful"
    feedback: Optional[str] = None


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Ask a question to the RAG chatbot.
    Optionally provide context (selected text) for more focused answers.
    """
    try:
        result = await rag_service.get_answer(
            question=request.question,
            context=request.context,
            user_id=request.user_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    Submit feedback on a chatbot response.
    """
    try:
        # Store feedback (implement in database service)
        return {"status": "feedback_received", "message_id": request.message_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{user_id}")
async def get_chat_history(user_id: str, limit: int = 50):
    """
    Get chat history for a user.
    """
    try:
        # Retrieve from database (implement in database service)
        return {"user_id": user_id, "messages": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
