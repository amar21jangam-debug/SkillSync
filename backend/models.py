"""Pydantic models for SkillSync."""
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict
import uuid


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class OnboardingData(BaseModel):
    goal: str
    personality: List[str] = []
    personality_text: Optional[str] = ""
    connect_with: List[str] = []
    connect_text: Optional[str] = ""
    education: Optional[str] = ""  # UG / PG / Other
    college: Optional[str] = ""


class UserPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    goal: Optional[str] = None
    personality: List[str] = []
    personality_text: Optional[str] = ""
    connect_with: List[str] = []
    connect_text: Optional[str] = ""
    education: Optional[str] = ""
    college: Optional[str] = ""
    about: Optional[str] = ""
    currently: Optional[str] = ""
    stories: List[dict] = []
    level: int = 1
    xp: int = 0
    streak: int = 0
    last_active: Optional[str] = None
    onboarding_complete: bool = False
    completed_problems: List[str] = []
    bio: Optional[str] = ""
    created_at: str = Field(default_factory=now_iso)


class TokenResponse(BaseModel):
    token: str
    user: UserPublic


class ChatMessageIn(BaseModel):
    message: str
    agent_mode: str = "educational"  # educational | planning | group_support | team
    session_id: Optional[str] = None
    context: Optional[str] = None  # e.g. problem statement


class SolveProblemIn(BaseModel):
    problem_id: str


class ConnectRequestIn(BaseModel):
    to_user_id: str


class AIMatchIn(BaseModel):
    pass


class GroupChatIn(BaseModel):
    group_id: str
    message: str


class SetLevelIn(BaseModel):
    level: int  # 1..25


class BookMentorIn(BaseModel):
    mentor_id: str
    slot: str  # ISO datetime string
    note: Optional[str] = ""


class MessageIn(BaseModel):
    text: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    about: Optional[str] = None
    currently: Optional[str] = None
    college: Optional[str] = None
    education: Optional[str] = None


class StoryIn(BaseModel):
    text: str
    emoji: Optional[str] = "✨"
    theme: Optional[str] = "lime"  # lime | violet | peach | ocean | sand
