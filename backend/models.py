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
    goal: str  # backend / frontend / aiml / data_science / fullstack
    personality: List[str] = []  # tech, math, others
    personality_text: Optional[str] = ""
    connect_with: List[str] = []  # mentors, peers, etc.
    connect_text: Optional[str] = ""


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
