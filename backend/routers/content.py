"""
Content Router - Personalization and Translation endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from openai import OpenAI

router = APIRouter()

# Lazy initialization for OpenAI client
_openai_client = None

def get_openai_client():
    global _openai_client
    if _openai_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        _openai_client = OpenAI(api_key=api_key)
    return _openai_client


class PersonalizeRequest(BaseModel):
    content: str
    chapter_id: str
    user_level: str  # "beginner", "intermediate", "advanced"
    user_background: Optional[str] = None


class PersonalizeResponse(BaseModel):
    original_chapter: str
    personalized_content: str
    adjustments_made: list[str]


class TranslateRequest(BaseModel):
    content: str
    chapter_id: str
    target_language: str = "urdu"


class TranslateResponse(BaseModel):
    original_chapter: str
    translated_content: str
    target_language: str


@router.post("/personalize", response_model=PersonalizeResponse)
async def personalize_content(request: PersonalizeRequest):
    """
    Personalize chapter content based on user's experience level.
    - Beginners: More explanations, simpler code, additional context
    - Intermediate: Standard content with some advanced tips
    - Advanced: More technical depth, optimization tips
    """
    try:
        system_prompt = f"""You are an expert technical writer adapting content for a {request.user_level} level student.

For BEGINNER level:
- Add more explanations for technical terms
- Simplify code examples with more comments
- Add analogies to everyday concepts
- Break down complex steps into smaller pieces

For INTERMEDIATE level:
- Keep the content mostly as-is
- Add occasional tips for best practices
- Include brief mentions of advanced topics

For ADVANCED level:
- Add performance optimization tips
- Include edge cases and advanced configurations
- Reference deeper technical resources
- Add architectural considerations"""

        user_prompt = f"""Please adapt the following textbook content for a {request.user_level} level student:

{request.content}

User background: {request.user_background or 'Not specified'}

Return the adapted content maintaining the same structure but adjusted for the user's level."""

        response = get_openai_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5,
            max_tokens=4000
        )

        personalized = response.choices[0].message.content

        adjustments = []
        if request.user_level == "beginner":
            adjustments = ["Added more explanations", "Simplified code examples", "Added analogies"]
        elif request.user_level == "intermediate":
            adjustments = ["Added best practice tips", "Maintained technical depth"]
        else:
            adjustments = ["Added advanced optimizations", "Included edge cases", "Added architecture notes"]

        return PersonalizeResponse(
            original_chapter=request.chapter_id,
            personalized_content=personalized,
            adjustments_made=adjustments
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/translate", response_model=TranslateResponse)
async def translate_content(request: TranslateRequest):
    """
    Translate chapter content to Urdu.
    Maintains technical terms in English where appropriate.
    """
    try:
        system_prompt = """You are an expert translator specializing in technical content.
Translate the following content to Urdu while:
1. Keeping technical terms (like ROS 2, URDF, NVIDIA, Python, etc.) in English
2. Using proper Urdu script
3. Maintaining code blocks exactly as they are
4. Preserving the educational tone
5. Using right-to-left formatting appropriate for Urdu"""

        user_prompt = f"""Translate this textbook content to Urdu:

{request.content}

Remember to keep technical terms and code in English."""

        response = get_openai_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=4000
        )

        translated = response.choices[0].message.content

        return TranslateResponse(
            original_chapter=request.chapter_id,
            translated_content=translated,
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
