"""JWT auth helpers for SkillSync."""
import os
from datetime import datetime, timezone, timedelta
from typing import Optional

import bcrypt
import jwt
from fastapi import HTTPException, Depends, Header

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALG = "HS256"
JWT_EXP_DAYS = 30


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXP_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return payload.get("sub")
    except Exception:
        return None


async def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user_id
