"""
Content Router - Chapters, content, and translation endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
from openai import OpenAI

router = APIRouter()

# Import textbook content
from data.textbook_content import CHAPTERS

# Lazy initialization for Groq client
_groq_client = None

def get_groq_client():
    global _groq_client
    if _groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        _groq_client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1"
        )
    return _groq_client


class TranslateRequest(BaseModel):
    text: str
    target_language: str = "urdu"


class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str


@router.post("/translate", response_model=TranslateResponse)
async def translate_content(request: TranslateRequest):
    """
    Translate text to Urdu (or other languages).
    Keeps technical terms in English for clarity.
    """
    try:
        system_prompt = """You are an expert translator specializing in technical and educational content.
Translate the following content to Urdu while:
1. Keeping technical terms (like ROS 2, URDF, NVIDIA, Python, Gazebo, Isaac, LLM, API, etc.) in English
2. Using proper Urdu script (نستعلیق)
3. Keeping code blocks and commands exactly as they are
4. Preserving the educational and clear tone
5. Making the translation natural and easy to understand for Urdu speakers

Only return the translated text, nothing else."""

        user_prompt = f"Translate this to Urdu:\n\n{request.text}"

        response = get_groq_client().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )

        translated = response.choices[0].message.content

        return TranslateResponse(
            original_text=request.text,
            translated_text=translated,
            target_language=request.target_language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chapters")
async def get_chapters():
    """
    Get list of all chapters.
    """
    return {
        "modules": [
            {
                "id": "module-1",
                "title": "The Robotic Nervous System (ROS 2)",
                "chapters": [
                    {"id": "1-1", "title": "Introduction to Physical AI"},
                    {"id": "1-2", "title": "ROS 2 Architecture"},
                    {"id": "1-3", "title": "Building ROS 2 Packages"},
                    {"id": "1-4", "title": "URDF for Humanoids"}
                ]
            },
            {
                "id": "module-2",
                "title": "The Digital Twin (Gazebo & Unity)",
                "chapters": [
                    {"id": "2-1", "title": "Gazebo Simulation Environment"},
                    {"id": "2-2", "title": "Sensor Simulation"},
                    {"id": "2-3", "title": "Unity for Robot Visualization"}
                ]
            },
            {
                "id": "module-3",
                "title": "The AI-Robot Brain (NVIDIA Isaac)",
                "chapters": [
                    {"id": "3-1", "title": "NVIDIA Isaac Sim"},
                    {"id": "3-2", "title": "Isaac ROS"},
                    {"id": "3-3", "title": "Navigation with Nav2"},
                    {"id": "3-4", "title": "Sim-to-Real Transfer"}
                ]
            },
            {
                "id": "module-4",
                "title": "Vision-Language-Action (VLA)",
                "chapters": [
                    {"id": "4-1", "title": "Voice-to-Action"},
                    {"id": "4-2", "title": "Cognitive Planning with LLMs"},
                    {"id": "4-3", "title": "Multi-Modal Interaction"},
                    {"id": "4-4", "title": "Capstone Project"}
                ]
            }
        ]
    }


@router.get("/chapter/{chapter_id}")
async def get_chapter(chapter_id: str):
    """
    Get content for a specific chapter.
    """
    # Convert chapter_id format (e.g., "1-1" to "1.1")
    normalized_id = chapter_id.replace("-", ".")

    for chapter in CHAPTERS:
        if chapter["chapter"] == normalized_id:
            return {
                "chapter": chapter["chapter"],
                "title": chapter["title"],
                "content": chapter["content"]
            }

    return {"error": "Chapter not found"}


@router.get("/status")
async def get_status():
    """
    Get the status of the content service.
    """
    return {
        "status": "ready",
        "total_chapters": len(CHAPTERS),
        "chapters": [
            {"id": ch["chapter"], "title": ch["title"]}
            for ch in CHAPTERS
        ]
    }
