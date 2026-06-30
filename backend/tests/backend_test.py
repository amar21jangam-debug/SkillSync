"""SkillSync backend API tests.

Covers: health, auth (register/login/me), onboarding, roadmap, problems
(list/get/solve), performance, contests, groups (list/detail/chat),
mentors, connect (lock state, match), AI chat SSE streaming.
"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://skillsync-build.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

# Unique user for this run to avoid duplicate-email collisions
RUN_ID = uuid.uuid4().hex[:8]
TEST_EMAIL = f"test_{RUN_ID}@skillsync.io"
TEST_PASSWORD = "Test1234!"
TEST_NAME = "Test User"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth(session):
    """Register a fresh user and return (token, user)."""
    r = session.post(f"{API}/auth/register", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME,
    })
    assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
    data = r.json()
    return data["token"], data["user"]


@pytest.fixture(scope="session")
def auth_headers(auth):
    token, _ = auth
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ---------------- Health ----------------
class TestHealth:
    def test_root_ok(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("service") == "SkillSync API"


# ---------------- Auth ----------------
class TestAuth:
    def test_register_returns_token_and_user(self, auth):
        token, user = auth
        assert isinstance(token, str) and len(token) > 20
        assert user["email"] == TEST_EMAIL
        assert user["name"] == TEST_NAME
        assert user["onboarding_complete"] is False
        assert user["level"] == 1
        assert user["xp"] == 0

    def test_register_duplicate_email_returns_400(self, session):
        r = session.post(f"{API}/auth/register", json={
            "email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME,
        })
        assert r.status_code == 400
        assert "already" in r.text.lower() or "registered" in r.text.lower()

    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={
            "email": TEST_EMAIL, "password": TEST_PASSWORD,
        })
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and "user" in data
        assert data["user"]["email"] == TEST_EMAIL

    def test_login_wrong_password_returns_401(self, session):
        r = session.post(f"{API}/auth/login", json={
            "email": TEST_EMAIL, "password": "wrongpassword",
        })
        assert r.status_code == 401

    def test_me_with_token_returns_user(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == TEST_EMAIL

    def test_me_without_token_returns_401(self, session):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ---------------- Onboarding ----------------
class TestOnboarding:
    def test_onboarding_marks_complete(self, session, auth_headers):
        r = session.post(f"{API}/onboarding", headers=auth_headers, json={
            "goal": "backend",
            "personality": ["tech", "math"],
            "personality_text": "loves systems",
            "connect_with": ["peers", "mentors"],
            "connect_text": "want to learn",
        })
        assert r.status_code == 200
        user = r.json()
        assert user["onboarding_complete"] is True
        assert user["goal"] == "backend"
        assert "tech" in user["personality"]


# ---------------- Roadmap ----------------
class TestRoadmap:
    def test_roadmap_returns_steps_and_progress(self, session, auth_headers):
        r = session.get(f"{API}/roadmap", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["goal"] == "backend"
        assert isinstance(data["steps"], list) and len(data["steps"]) >= 4
        s0 = data["steps"][0]
        assert "index" in s0 and "completed" in s0 and "in_progress" in s0
        assert isinstance(data["progress"], int)
        assert 0 <= data["progress"] <= 100


# ---------------- Problems ----------------
class TestProblems:
    def test_list_problems(self, session, auth_headers):
        r = session.get(f"{API}/problems", headers=auth_headers)
        assert r.status_code == 200
        problems = r.json()
        assert isinstance(problems, list) and len(problems) == 6
        for p in problems:
            for k in ("id", "title", "difficulty", "topic", "xp", "solved"):
                assert k in p, f"missing key {k} in {p}"

    def test_get_problem_detail(self, session, auth_headers):
        r = session.get(f"{API}/problems/p1", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["id"] == "p1"

    def test_get_problem_not_found(self, session, auth_headers):
        r = session.get(f"{API}/problems/nope", headers=auth_headers)
        assert r.status_code == 404

    def test_solve_problem_increments_xp_and_streak(self, session, auth_headers):
        # solve p1 -> xp +50
        r = session.post(f"{API}/problems/solve", headers=auth_headers, json={"problem_id": "p1"})
        assert r.status_code == 200
        user = r.json()
        assert user["xp"] >= 50
        assert "p1" in user["completed_problems"]
        assert user["streak"] >= 1
        assert user["last_active"] is not None
        # level derived from xp -> still level 1 (xp<200)
        assert user["level"] == 1

    def test_solve_invalid_problem_404(self, session, auth_headers):
        r = session.post(f"{API}/problems/solve", headers=auth_headers, json={"problem_id": "nope"})
        assert r.status_code == 404


# ---------------- Performance ----------------
class TestPerformance:
    def test_performance_chart(self, session, auth_headers):
        r = session.get(f"{API}/performance", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["chart"], list) and len(data["chart"]) == 14
        assert "total_solved" in data and "total_xp" in data
        assert "recent" in data and isinstance(data["recent"], list)
        # we just solved p1, so total_solved >= 1
        assert data["total_solved"] >= 1


# ---------------- Contests ----------------
class TestContests:
    def test_list_contests(self, session):
        r = session.get(f"{API}/contests")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["contests"], list) and len(data["contests"]) >= 1
        assert isinstance(data["leaderboard"], list) and len(data["leaderboard"]) >= 1


# ---------------- Groups ----------------
class TestGroups:
    def test_list_groups(self, session, auth_headers):
        r = session.get(f"{API}/groups", headers=auth_headers)
        assert r.status_code == 200
        groups = r.json()
        assert isinstance(groups, list) and len(groups) == 3
        ids = {g["id"] for g in groups}
        assert {"g1", "g2", "g3"}.issubset(ids)

    def test_get_group_detail(self, session, auth_headers):
        r = session.get(f"{API}/groups/g1", headers=auth_headers)
        assert r.status_code == 200
        g = r.json()
        assert g["id"] == "g1"
        assert "members" in g and "tasks" in g and "chat" in g

    def test_post_group_chat_persists(self, session, auth_headers):
        msg = f"Hello from test {RUN_ID}"
        r = session.post(f"{API}/groups/chat", headers=auth_headers, json={
            "group_id": "g1", "message": msg,
        })
        assert r.status_code == 200
        assert r.json()["ok"] is True
        # Verify persistence via GET
        r2 = session.get(f"{API}/groups/g1", headers=auth_headers)
        assert r2.status_code == 200
        texts = [c["text"] for c in r2.json()["chat"]]
        assert msg in texts


# ---------------- Mentors ----------------
class TestMentors:
    def test_list_mentors(self, session):
        r = session.get(f"{API}/mentors")
        assert r.status_code == 200
        mentors = r.json()
        assert isinstance(mentors, list) and len(mentors) >= 3
        for m in mentors:
            for k in ("id", "name", "role", "expertise", "rating"):
                assert k in m


# ---------------- Connect ----------------
class TestConnect:
    def test_connect_locked_for_low_level(self, session, auth_headers):
        r = session.get(f"{API}/connect/users", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["locked"] is True
        assert data["unlocks_at"] == 5
        assert data["current_level"] < 5
        assert data["users"] == []

    def test_connect_match_blocked_below_level_5(self, session, auth_headers):
        r = session.post(f"{API}/connect/match", headers=auth_headers, json={})
        assert r.status_code == 403


# ---------------- AI Chat SSE ----------------
class TestAIChat:
    def test_ai_chat_streams_text(self, auth_headers):
        url = f"{API}/ai/chat"
        payload = {
            "message": "Say hello in 5 words.",
            "agent_mode": "educational",
            "session_id": f"test_session_{RUN_ID}",
        }
        with requests.post(url, json=payload, headers=auth_headers, stream=True, timeout=60) as r:
            assert r.status_code == 200
            ctype = r.headers.get("content-type", "")
            assert "text/event-stream" in ctype, f"unexpected content-type: {ctype}"
            raw_chunks = []
            saw_meta = False
            saw_done = False
            saw_text_data = False
            start = time.time()
            for line in r.iter_lines(decode_unicode=True):
                if line is None:
                    continue
                raw_chunks.append(line)
                if line.startswith("event: meta"):
                    saw_meta = True
                if line.startswith("event: done"):
                    saw_done = True
                    break
                if line.startswith("data: ") and not line.startswith("data: end"):
                    payload_text = line[6:]
                    # ignore meta label line which is also a data: line
                    if payload_text and any(c.isalpha() for c in payload_text):
                        saw_text_data = True
                if time.time() - start > 55:
                    break
        body = "\n".join(raw_chunks)
        assert saw_meta, f"missing meta event. body=\n{body[:500]}"
        assert saw_text_data, f"no text data chunks received. body=\n{body[:500]}"
        assert saw_done, f"missing done event. body=\n{body[:500]}"
