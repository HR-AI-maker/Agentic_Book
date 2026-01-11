"""
Physical AI & Humanoid Robotics Textbook - Backend API
FastAPI backend with RAG chatbot functionality
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import chat, auth, content

app = FastAPI(
    title="Physical AI Textbook API",
    description="RAG Chatbot API for Physical AI & Humanoid Robotics Textbook",
    version="1.0.0"
)

# CORS configuration - allow all origins for this educational project
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(content.router, prefix="/api/content", tags=["content"])


@app.get("/")
async def root():
    return {
        "message": "Physical AI & Humanoid Robotics Textbook API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
