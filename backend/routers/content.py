"""
Content Router - Chapters and content endpoints
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

# Import textbook content
from data.textbook_content import CHAPTERS


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
