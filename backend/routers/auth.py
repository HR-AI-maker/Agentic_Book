"""
Auth Router - User authentication endpoints
Simple JWT-based authentication with in-memory storage
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
import os
import jwt
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Simple in-memory user storage (replace with database in production)
users_db: Dict[str, dict] = {}

# Security
security = HTTPBearer(auto_error=False)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
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


def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[UserProfile]:
    """Get current user from JWT token"""
    if not credentials:
        return None

    payload = verify_token(credentials.credentials)
    if not payload:
        return None

    user_id = payload.get("sub")
    if user_id and user_id in users_db:
        user = users_db[user_id]
        return UserProfile(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            programming_experience=user["programming_experience"],
            hardware_experience=user["hardware_experience"],
            primary_interest=user["primary_interest"]
        )
    return None


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """
    Register a new user with background information.
    """
    # Check if email already exists
    for user in users_db.values():
        if user["email"] == request.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash(request.password)

    users_db[user_id] = {
        "id": user_id,
        "email": request.email,
        "name": request.name,
        "password": hashed_password,
        "programming_experience": request.programming_experience,
        "hardware_experience": request.hardware_experience,
        "primary_interest": request.primary_interest,
        "created_at": datetime.utcnow().isoformat()
    }

    # Create token
    token = create_access_token({"sub": user_id, "email": request.email})

    return AuthResponse(
        success=True,
        message="User registered successfully",
        user=UserProfile(
            id=user_id,
            email=request.email,
            name=request.name,
            programming_experience=request.programming_experience,
            hardware_experience=request.hardware_experience,
            primary_interest=request.primary_interest
        ),
        token=token
    )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Authenticate a user and return JWT token.
    """
    # Find user by email
    user = None
    for u in users_db.values():
        if u["email"] == request.email:
            user = u
            break

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if not pwd_context.verify(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create token
    token = create_access_token({"sub": user["id"], "email": user["email"]})

    return AuthResponse(
        success=True,
        message="Login successful",
        user=UserProfile(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            programming_experience=user["programming_experience"],
            hardware_experience=user["hardware_experience"],
            primary_interest=user["primary_interest"]
        ),
        token=token
    )


@router.get("/me", response_model=UserProfile)
async def get_me(current_user: UserProfile = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user


@router.post("/logout")
async def logout():
    """
    Logout current user.
    Note: With JWT, logout is handled client-side by removing the token.
    """
    return {"success": True, "message": "Logged out successfully"}


@router.get("/verify")
async def verify_auth(current_user: UserProfile = Depends(get_current_user)):
    """
    Verify if the current token is valid.
    """
    if not current_user:
        return {"authenticated": False}
    return {"authenticated": True, "user": current_user}
