"""
Auth Router - User authentication endpoints
Using Better-auth compatible patterns
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import os

router = APIRouter()


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    # Background questions for personalization
    programming_experience: str  # "beginner", "intermediate", "advanced"
    hardware_experience: str  # "none", "some", "extensive"
    primary_interest: str  # "ros2", "simulation", "ai", "all"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    programming_experience: str
    hardware_experience: str
    primary_interest: str


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserProfile] = None
    token: Optional[str] = None


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """
    Register a new user with background information.
    This info is used for content personalization.
    """
    try:
        # TODO: Implement with Better-auth and database
        # For now, return mock response
        return AuthResponse(
            success=True,
            message="User registered successfully",
            user=UserProfile(
                id="mock-user-id",
                email=request.email,
                name=request.name,
                programming_experience=request.programming_experience,
                hardware_experience=request.hardware_experience,
                primary_interest=request.primary_interest
            ),
            token="mock-jwt-token"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Authenticate a user and return JWT token.
    """
    try:
        # TODO: Implement with Better-auth
        return AuthResponse(
            success=True,
            message="Login successful",
            user=UserProfile(
                id="mock-user-id",
                email=request.email,
                name="User",
                programming_experience="intermediate",
                hardware_experience="some",
                primary_interest="all"
            ),
            token="mock-jwt-token"
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/me", response_model=UserProfile)
async def get_current_user():
    """
    Get current authenticated user's profile.
    """
    # TODO: Implement JWT verification
    return UserProfile(
        id="mock-user-id",
        email="user@example.com",
        name="User",
        programming_experience="intermediate",
        hardware_experience="some",
        primary_interest="all"
    )


@router.post("/logout")
async def logout():
    """
    Logout current user.
    """
    return {"success": True, "message": "Logged out successfully"}
