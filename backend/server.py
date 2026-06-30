"""SkillSync FastAPI server."""
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import random
from pathlib import Path
from datetime import datetime, timezone, date, timedelta
from typing import List

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from models import (
    UserRegister, UserLogin, UserPublic, TokenResponse, OnboardingData,
    ChatMessageIn, SolveProblemIn, ConnectRequestIn, GroupChatIn,
    SetLevelIn, BookMentorIn, now_iso, new_id,
)
from auth import hash_password, verify_password, create_token, get_current_user_id
from ai_agents import stream_agent_response, get_agent_label
from content import (
    ROADMAPS, PROBLEMS, CONTESTS, LEADERBOARD, MENTORS, SAMPLE_GROUPS,
    CONNECT_USERS, level_for_xp, problems_for_goal,
)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="SkillSync API")
api = APIRouter(prefix="/api")


def user_doc_to_public(doc: dict) -> UserPublic:
    return UserPublic(
        id=doc["id"], email=doc["email"], name=doc["name"],
        avatar=doc.get("avatar"),
        goal=doc.get("goal"),
        personality=doc.get("personality", []),
        personality_text=doc.get("personality_text", ""),
        connect_with=doc.get("connect_with", []),
        connect_text=doc.get("connect_text", ""),
        education=doc.get("education", ""),
        college=doc.get("college", ""),
        level=doc.get("level", 1),
        xp=doc.get("xp", 0),
        streak=doc.get("streak", 0),
        last_active=doc.get("last_active"),
        onboarding_complete=doc.get("onboarding_complete", False),
        completed_problems=doc.get("completed_problems", []),
        bio=doc.get("bio", ""),
        created_at=doc.get("created_at", now_iso()),
    )


# ---------- Health ----------
@api.get("/")
async def root():
    return {"service": "SkillSync API", "status": "ok"}


# ---------- Auth ----------
@api.post("/auth/register", response_model=TokenResponse)
async def register(body: UserRegister):
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = new_id()
    doc = {
        "id": user_id,
        "email": body.email.lower(),
        "name": body.name,
        "password_hash": hash_password(body.password),
        "avatar": f"https://api.dicebear.com/7.x/initials/svg?seed={body.name}&backgroundColor=CBFF3D&textColor=0A0A0B",
        "goal": None,
        "personality": [],
        "personality_text": "",
        "connect_with": [],
        "connect_text": "",
        "education": "",
        "college": "",
        "level": 1,
        "xp": 0,
        "streak": 0,
        "last_active": None,
        "onboarding_complete": False,
        "completed_problems": [],
        "bio": "",
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    token = create_token(user_id)
    return TokenResponse(token=token, user=user_doc_to_public(doc))


@api.post("/auth/login", response_model=TokenResponse)
async def login(body: UserLogin):
    doc = await db.users.find_one({"email": body.email.lower()})
    if not doc or not verify_password(body.password, doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(doc["id"])
    return TokenResponse(token=token, user=user_doc_to_public(doc))


@api.get("/auth/me", response_model=UserPublic)
async def get_me(user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    return user_doc_to_public(doc)


# ---------- Onboarding ----------
@api.post("/onboarding", response_model=UserPublic)
async def save_onboarding(body: OnboardingData, user_id: str = Depends(get_current_user_id)):
    if body.goal not in ROADMAPS:
        raise HTTPException(status_code=400, detail=f"Unsupported goal: {body.goal}")
    update = {
        "goal": body.goal,
        "personality": body.personality,
        "personality_text": body.personality_text or "",
        "connect_with": body.connect_with,
        "connect_text": body.connect_text or "",
        "education": body.education or "",
        "college": body.college or "",
        "onboarding_complete": True,
    }
    await db.users.update_one({"id": user_id}, {"$set": update})
    doc = await db.users.find_one({"id": user_id})
    return user_doc_to_public(doc)


# ---------- Roadmap ----------
@api.get("/roadmap")
async def get_roadmap(user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    if not doc:
        raise HTTPException(404, "User not found")
    goal = doc.get("goal") or "fullstack"
    steps = ROADMAPS.get(goal, ROADMAPS["fullstack"])
    # Mark progress based on completed problems count -> derive step completion
    solved = len(doc.get("completed_problems", []))
    per_step = max(1, len(PROBLEMS) // len(steps))
    annotated = []
    for i, s in enumerate(steps):
        completed = solved >= (i + 1) * per_step
        in_progress = (not completed) and solved >= i * per_step
        annotated.append({
            **s,
            "index": i + 1,
            "completed": completed,
            "in_progress": in_progress,
        })
    progress = int((solved / max(1, len(PROBLEMS))) * 100)
    return {"goal": goal, "steps": annotated, "progress": min(100, progress)}


# ---------- Practice Problems ----------
@api.get("/problems")
async def list_problems(user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    solved = set(doc.get("completed_problems", []))
    items = problems_for_goal(doc.get("goal"))
    return [{**p, "solved": p["id"] in solved} for p in items]


@api.get("/problems/{problem_id}")
async def get_problem(problem_id: str, user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    items = problems_for_goal(doc.get("goal"))
    p = next((x for x in items if x["id"] == problem_id), None)
    if not p:
        # Allow legacy lookup across all goals
        for goal_items in [problems_for_goal(g) for g in ["backend","frontend","aiml","data_science","fullstack"]]:
            p = next((x for x in goal_items if x["id"] == problem_id), None)
            if p:
                break
        if not p:
            raise HTTPException(404, "Problem not found")
    return {**p, "solved": problem_id in doc.get("completed_problems", [])}


@api.post("/problems/solve")
async def mark_solved(body: SolveProblemIn, user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    items = problems_for_goal(doc.get("goal"))
    p = next((x for x in items if x["id"] == body.problem_id), None)
    if not p:
        for goal_items in [problems_for_goal(g) for g in ["backend","frontend","aiml","data_science","fullstack"]]:
            p = next((x for x in goal_items if x["id"] == body.problem_id), None)
            if p:
                break
        if not p:
            raise HTTPException(404, "Problem not found")
    completed = set(doc.get("completed_problems", []))
    today = date.today().isoformat()
    last = doc.get("last_active")
    streak = doc.get("streak", 0)
    if last == today:
        pass
    elif last and (date.fromisoformat(last) - date.today()).days == -1:
        streak += 1
    else:
        streak = 1
    if body.problem_id in completed:
        await db.users.update_one({"id": user_id}, {"$set": {"streak": streak, "last_active": today}})
    else:
        completed.add(body.problem_id)
        xp = doc.get("xp", 0) + p["xp"]
        await db.users.update_one(
            {"id": user_id},
            {"$set": {
                "completed_problems": list(completed),
                "xp": xp,
                "level": level_for_xp(xp),
                "streak": streak,
                "last_active": today,
            }},
        )
        await db.activity.insert_one({
            "user_id": user_id, "date": today, "problem_id": body.problem_id,
            "xp_earned": p["xp"], "title": p["title"], "at": now_iso(),
        })
    new_doc = await db.users.find_one({"id": user_id})
    return user_doc_to_public(new_doc)


# ---------- Performance ----------
@api.get("/performance")
async def get_performance(user_id: str = Depends(get_current_user_id)):
    activity = await db.activity.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    by_day: dict[str, int] = {}
    for a in activity:
        by_day[a["date"]] = by_day.get(a["date"], 0) + 1
    today = date.today()
    chart = []
    for i in range(13, -1, -1):
        d = (today - timedelta(days=i)).isoformat()
        chart.append({"date": d, "solved": by_day.get(d, 0)})
    doc = await db.users.find_one({"id": user_id})
    return {
        "chart": chart,
        "total_solved": len(doc.get("completed_problems", [])),
        "total_xp": doc.get("xp", 0),
        "streak": doc.get("streak", 0),
        "level": doc.get("level", 1),
        "recent": activity[-10:][::-1],
    }


# ---------- Contests ----------
@api.get("/contests")
async def list_contests(user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    lvl = doc.get("level", 1) if doc else 1
    individual = [c for c in CONTESTS if c.get("kind") == "individual"]
    group = [c for c in CONTESTS if c.get("kind") == "group"]
    return {
        "individual": individual,
        "group": group,
        "group_locked": lvl < 5,
        "group_unlocks_at": 5,
        "user_level": lvl,
        "leaderboard": LEADERBOARD,
    }


# ---------- Groups ----------
@api.get("/groups")
async def list_groups(user_id: str = Depends(get_current_user_id)):
    user = await db.users.find_one({"id": user_id})
    user_lvl = user.get("level", 1) if user else 1
    out = []
    for g in SAMPLE_GROUPS:
        stored_chat = await db.group_chat.find(
            {"group_id": g["id"]}, {"_id": 0}
        ).sort("at", 1).to_list(200)
        chat = list(g["chat"]) + [
            {"from": c["from_name"], "text": c["text"], "time": c["time"]}
            for c in stored_chat
        ]
        out.append({
            **g, "chat": chat,
            "user_level": user_lvl,
            "can_video": user_lvl >= g.get("min_level", 1),
        })
    return out


@api.get("/groups/{group_id}")
async def get_group(group_id: str, user_id: str = Depends(get_current_user_id)):
    g = next((x for x in SAMPLE_GROUPS if x["id"] == group_id), None)
    if not g:
        raise HTTPException(404, "Group not found")
    stored_chat = await db.group_chat.find(
        {"group_id": group_id}, {"_id": 0}
    ).sort("at", 1).to_list(200)
    chat = list(g["chat"]) + [
        {"from": c["from_name"], "text": c["text"], "time": c["time"]}
        for c in stored_chat
    ]
    user = await db.users.find_one({"id": user_id})
    user_lvl = user.get("level", 1) if user else 1
    min_lvl = g.get("min_level", 1)
    can_video = user_lvl >= min_lvl
    return {
        **g, "chat": chat,
        "user_level": user_lvl,
        "can_video": can_video,
        "lockstep_message": (
            None if can_video
            else f"This squad is at Level {min_lvl}. You're at Level {user_lvl}. Level up together to unlock video chat."
        ),
    }


@api.post("/groups/chat")
async def post_group_chat(body: GroupChatIn, user_id: str = Depends(get_current_user_id)):
    g = next((x for x in SAMPLE_GROUPS if x["id"] == body.group_id), None)
    if not g:
        raise HTTPException(404, "Group not found")
    user = await db.users.find_one({"id": user_id})
    msg = {
        "group_id": body.group_id,
        "user_id": user_id,
        "from_name": user["name"],
        "text": body.message,
        "time": "just now",
        "at": now_iso(),
    }
    await db.group_chat.insert_one(msg)
    return {"ok": True, "message": {"from": user["name"], "text": body.message, "time": "just now"}}


# ---------- Mentors ----------
@api.get("/mentors")
async def list_mentors():
    return MENTORS


@api.post("/mentors/{mentor_id}/book")
async def book_mentor(mentor_id: str, body: BookMentorIn, user_id: str = Depends(get_current_user_id)):
    m = next((x for x in MENTORS if x["id"] == mentor_id), None)
    if not m:
        raise HTTPException(404, "Mentor not found")
    booking = {
        "id": new_id(),
        "user_id": user_id,
        "mentor_id": mentor_id,
        "mentor_name": m["name"],
        "mentor_role": m["role"],
        "slot": body.slot,
        "note": body.note or "",
        "status": "confirmed",
        "at": now_iso(),
    }
    await db.bookings.insert_one(booking)
    booking.pop("_id", None)
    return {"ok": True, "booking": booking}


@api.get("/mentors/bookings")
async def list_bookings(user_id: str = Depends(get_current_user_id)):
    items = await db.bookings.find({"user_id": user_id}, {"_id": 0}).sort("at", -1).to_list(50)
    return items


# ---------- Certificates ----------
@api.get("/certificates")
async def list_certificates(user_id: str = Depends(get_current_user_id)):
    """Earned + locked certificates, split by kind (individual vs group)."""
    doc = await db.users.find_one({"id": user_id})
    earned = []
    name = doc["name"]
    today = now_iso()[:10]

    # Individual: DSA / niche starter (when user has solved at least 2 problems)
    if len(doc.get("completed_problems", [])) >= 2:
        earned.append({
            "id": "cert_starter", "kind": "individual",
            "title": "Problem-Solving Starter",
            "issued_to": name, "issued_on": today,
            "skills": ["Practice", "AI-assisted learning"],
            "participation": 100, "effort_percent": 100,
            "project": None, "level_required": 1,
        })

    # Group certificates — completed group projects
    # Effort % is a deterministic-but-varied number per user+group, between 60–100
    import hashlib
    for g in SAMPLE_GROUPS:
        done_ratio = sum(1 for t in g["tasks"] if t["done"]) / len(g["tasks"])
        if done_ratio == 1.0:
            seed = hashlib.md5(f"{user_id}:{g['id']}".encode()).hexdigest()
            effort = 60 + (int(seed[:4], 16) % 41)  # 60..100
            earned.append({
                "id": f"cert_{g['id']}", "kind": "group",
                "title": f"{g['name']} — Team Certificate",
                "issued_to": name, "issued_on": today,
                "skills": [],
                "participation": effort,
                "effort_percent": effort,
                "project": g["project"],
                "team_members": [m["name"] for m in g["members"]],
                "level_required": g.get("min_level", 1),
            })

    # Level achievement individual certs
    lvl = doc.get("level", 1)
    achievements = [
        {"id": "cert_lvl5",  "title": "Squad Unlocked",      "level_required": 5,  "desc": "Reached Level 5 — Connect + Create a Squad"},
        {"id": "cert_lvl7",  "title": "Niche Owner",         "level_required": 7,  "desc": "Reached Level 7 — Specialist in your niche"},
        {"id": "cert_lvl10", "title": "Multi-Group + Video", "level_required": 10, "desc": "Reached Level 10 — Join multiple groups + Video chat"},
    ]
    for a in achievements:
        if lvl >= a["level_required"]:
            earned.append({
                "id": a["id"], "kind": "individual",
                "title": a["title"], "issued_to": name,
                "issued_on": today, "skills": [],
                "participation": 100, "effort_percent": 100,
                "project": a["desc"], "level_required": a["level_required"],
            })
    locked = [a for a in achievements if lvl < a["level_required"]]

    earned_group = [c for c in earned if c["kind"] == "group"]
    earned_individual = [c for c in earned if c["kind"] == "individual"]
    return {
        "earned_individual": earned_individual,
        "earned_group": earned_group,
        "locked": locked,
        "level": lvl,
    }


# ---------- Demo: set level (for presentations) ----------
@api.post("/dev/set-level", response_model=UserPublic)
async def set_level(body: SetLevelIn, user_id: str = Depends(get_current_user_id)):
    lvl = max(1, min(10, body.level))
    xp = (lvl - 1) * 200
    # Synthesize a demo streak and activity history that matches the level.
    # Higher level = longer streak + more solved-history rows for charts.
    today = date.today()
    streak = min(45, lvl * 4 + 2)  # L1=6, L5=22, L10=42
    # Clear previous demo activity for this user and re-seed
    await db.activity.delete_many({"user_id": user_id, "demo": True})
    solved_total = 0
    for d in range(streak):
        day = today - timedelta(days=d)
        solves_that_day = 2 if d < 14 else 1
        for s in range(solves_that_day):
            p = PROBLEMS[(d + s) % len(PROBLEMS)]
            await db.activity.insert_one({
                "user_id": user_id, "date": day.isoformat(),
                "problem_id": p["id"], "xp_earned": p["xp"],
                "title": p["title"], "at": now_iso(), "demo": True,
            })
            solved_total += 1
    completed_problem_ids = list({PROBLEMS[i % len(PROBLEMS)]["id"] for i in range(min(solved_total, len(PROBLEMS)))})
    await db.users.update_one(
        {"id": user_id},
        {"$set": {
            "level": lvl, "xp": xp,
            "streak": streak,
            "last_active": today.isoformat(),
            "completed_problems": completed_problem_ids,
        }},
    )
    doc = await db.users.find_one({"id": user_id})
    return user_doc_to_public(doc)


# ---------- Connect / Social ----------
@api.get("/connect/users")
async def list_connect_users(user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    if doc.get("level", 1) < 5:
        return {"locked": True, "unlocks_at": 5, "current_level": doc.get("level", 1), "users": []}
    requests = await db.connections.find({"from_user": user_id}, {"_id": 0}).to_list(100)
    sent = {r["to_user"] for r in requests}
    my_college = (doc.get("college") or "").strip().lower()
    users = []
    for u in CONNECT_USERS:
        same_college = bool(my_college) and (u.get("college", "").strip().lower() == my_college)
        users.append({**u, "request_sent": u["id"] in sent, "same_college": same_college})
    # Same-college users first
    users.sort(key=lambda x: (not x["same_college"], x["name"]))
    return {"locked": False, "users": users, "my_college": doc.get("college", "")}


@api.post("/connect/request")
async def send_connect_request(body: ConnectRequestIn, user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    if doc.get("level", 1) < 5:
        raise HTTPException(403, "Connect unlocks at Level 5")
    await db.connections.insert_one({
        "from_user": user_id,
        "to_user": body.to_user_id,
        "status": "pending",
        "at": now_iso(),
    })
    return {"ok": True}


@api.post("/connect/match")
async def ai_match(user_id: str = Depends(get_current_user_id)):
    doc = await db.users.find_one({"id": user_id})
    if doc.get("level", 1) < 5:
        raise HTTPException(403, "Connect unlocks at Level 5")
    goal = doc.get("goal")
    # Prefer same goal, else random
    candidates = [u for u in CONNECT_USERS if u["goal"] == goal] or CONNECT_USERS
    pick = random.choice(candidates)
    return {"match": pick, "reason": f"Both focused on {pick['goal']} — strong compatibility."}


# ---------- AI Chat (streaming SSE) ----------
@api.post("/ai/chat")
async def ai_chat(body: ChatMessageIn, user_id: str = Depends(get_current_user_id)):
    session = body.session_id or f"u_{user_id}_{body.agent_mode}"
    label = get_agent_label(body.agent_mode)

    async def event_gen():
        yield f"event: meta\ndata: {label}\n\n"
        try:
            async for chunk in stream_agent_response(
                message=body.message,
                agent_mode=body.agent_mode,
                session_id=session,
                context=body.context,
            ):
                # SSE data lines: escape newlines
                safe = chunk.replace("\r", "").replace("\n", "\ndata: ")
                yield f"data: {safe}\n\n"
        except Exception as e:
            yield f"event: error\ndata: {str(e)}\n\n"
        yield "event: done\ndata: end\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("skillsync")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
