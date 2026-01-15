"""
Content Router - Chapters, content, and translation endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
import httpx
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

def call_gemini(prompt: str, max_tokens: int = 4000) -> str:
    """Call Gemini API directly via REST as fallback."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not configured")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": 0.3
        }
    }

    # Retry up to 2 times on timeout
    for attempt in range(2):
        try:
            response = httpx.post(url, json=payload, timeout=120.0)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except httpx.TimeoutException:
            if attempt == 1:
                raise Exception("Request timed out.")
            print(f"Gemini timeout, retrying... (attempt {attempt + 1})")
        except Exception as e:
            raise e

def call_llm(system_prompt: str, user_prompt: str, max_tokens: int = 4000) -> str:
    """Call LLM with automatic fallback from Groq to Gemini on rate limit."""
    full_prompt = f"{system_prompt}\n\n{user_prompt}"

    # Try Groq first
    try:
        response = get_groq_client().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content or ""
    except Exception as e:
        error_str = str(e)
        # Check if it's a rate limit error (429)
        if "429" in error_str or "rate_limit" in error_str.lower():
            print(f"Groq rate limit hit, falling back to Gemini")
            # Fall back to Gemini
            return call_gemini(full_prompt, max_tokens)
        else:
            raise e


class TranslateRequest(BaseModel):
    content: str
    chapter_id: Optional[str] = None
    target_language: str = "urdu"


class TranslateResponse(BaseModel):
    translated_content: str
    target_language: str


class PersonalizeRequest(BaseModel):
    content: str
    chapter_id: Optional[str] = None
    user_level: str = "intermediate"


class PersonalizeResponse(BaseModel):
    personalized_content: str


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

        user_prompt = f"Translate this to Urdu:\n\n{request.content}"

        translated = call_llm(system_prompt, user_prompt, max_tokens=4000)

        return TranslateResponse(
            translated_content=translated,
            target_language=request.target_language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/personalize", response_model=PersonalizeResponse)
async def personalize_content(request: PersonalizeRequest):
    """
    Personalize content based on user's experience level.
    Adjusts complexity, adds explanations, or provides advanced insights.
    """
    try:
        level_instructions = {
            "beginner": """Explain concepts in simpler terms.
Add more context and background information.
Use analogies to explain technical concepts.
Break down complex ideas into smaller steps.
Define technical terms when first used.""",
            "intermediate": """Maintain the current level of technical detail.
Add practical tips and common pitfalls to avoid.
Include connections to related concepts.
Provide context for why things work the way they do.""",
            "advanced": """Add more technical depth and nuances.
Include advanced use cases and optimizations.
Reference underlying implementations.
Discuss trade-offs and alternative approaches.
Add links to further reading for deep dives."""
        }

        level_instruction = level_instructions.get(request.user_level, level_instructions["intermediate"])

        system_prompt = f"""You are an expert educator specializing in robotics and AI.
Personalize the following educational content for a {request.user_level} level learner.

Guidelines:
{level_instruction}

Keep all code examples intact but add comments if helpful.
Maintain the overall structure but adjust explanations.
Keep technical terms but explain them appropriately for the level.

Return the personalized content only, no meta-commentary."""

        user_prompt = f"Personalize this content:\n\n{request.content}"

        personalized = call_llm(system_prompt, user_prompt, max_tokens=4000)

        return PersonalizeResponse(
            personalized_content=personalized
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
