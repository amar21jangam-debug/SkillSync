"""Iteration 3 tests for SkillSync backend:
- /api/dev/set-level seeds streak + activity history with level cap at 10
- /api/groups exposes min_level/niche/can_video + lockstep gating
- /api/certificates uses new L5/L7/L10 achievements scheme
"""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://skillsync-build.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

RUN_ID = uuid.uuid4().hex[:8]
TEST_EMAIL = f"iter3_{RUN_ID}@skillsync.io"
TEST_PASSWORD = "Test1234!"
TEST_NAME = "Iter3 User"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth_headers(session):
    r = session.post(f"{API}/auth/register", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME,
    })
    assert r.status_code == 200, f"register failed {r.status_code} {r.text}"
    token = r.json()["token"]
    # complete onboarding
    session.post(f"{API}/onboarding", headers={"Authorization": f"Bearer {token}"}, json={
        "goal": "fullstack",
        "personality": ["tech"],
        "personality_text": "",
        "connect_with": ["peers"],
        "connect_text": "",
    })
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ---------------- /dev/set-level seeding ----------------
class TestDevSetLevel:
    def test_set_level_7_seeds_streak_and_activity(self, session, auth_headers):
        r = session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 7})
        assert r.status_code == 200
        u = r.json()
        assert u["level"] == 7
        assert u["xp"] == 1200  # (7-1)*200
        # streak = min(45, 7*4+2) = 30
        assert 28 <= u["streak"] <= 30, f"expected ~28-30 streak, got {u['streak']}"

        # GET /performance should have multiple non-zero bars and total_solved>=6 of 6
        perf = session.get(f"{API}/performance", headers=auth_headers).json()
        assert perf["streak"] == u["streak"]
        assert perf["level"] == 7
        non_zero_bars = [c for c in perf["chart"] if c["solved"] > 0]
        assert len(non_zero_bars) >= 2, f"expected multiple non-zero bars in 14-day chart, got {perf['chart']}"
        # total_solved is len(completed_problems) — set-level loops over PROBLEMS (6 items)
        assert perf["total_solved"] >= 6, f"expected >=6, got {perf['total_solved']}"

    def test_set_level_10_seeds_longer_history(self, session, auth_headers):
        r = session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 10})
        assert r.status_code == 200
        u = r.json()
        assert u["level"] == 10
        assert u["xp"] == 1800
        # streak = min(45, 10*4+2) = 42
        assert u["streak"] == 42, f"expected 42, got {u['streak']}"

    def test_set_level_12_clamps_to_10(self, session, auth_headers):
        r = session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 12})
        assert r.status_code == 200
        u = r.json()
        assert u["level"] == 10, f"expected clamp to 10, got {u['level']}"
        assert u["xp"] == 1800

    def test_set_level_1_baseline(self, session, auth_headers):
        r = session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 1})
        assert r.status_code == 200
        u = r.json()
        assert u["level"] == 1
        assert u["xp"] == 0


# ---------------- /api/groups can_video gating ----------------
class TestGroupsLockstep:
    def test_groups_list_exposes_min_level_niche_can_video(self, session, auth_headers):
        # set user to L7
        session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 7})
        r = session.get(f"{API}/groups", headers=auth_headers)
        assert r.status_code == 200
        groups = r.json()
        ids = {g["id"]: g for g in groups}
        for gid in ("g1", "g2", "g3"):
            assert gid in ids, f"missing group {gid}"
            g = ids[gid]
            assert "min_level" in g
            assert "niche" in g
            assert "can_video" in g
            assert "user_level" in g
            assert g["user_level"] == 7

        # g3 has min_level=10 → user L7 cannot video
        assert ids["g3"]["min_level"] == 10
        assert ids["g3"]["can_video"] is False
        # g1 has min_level=5 → can_video true
        assert ids["g1"]["min_level"] == 5
        assert ids["g1"]["can_video"] is True
        # g2 has min_level=7 → can_video true
        assert ids["g2"]["min_level"] == 7
        assert ids["g2"]["can_video"] is True

    def test_g3_detail_lockstep_message_at_L7(self, session, auth_headers):
        session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 7})
        r = session.get(f"{API}/groups/g3", headers=auth_headers)
        assert r.status_code == 200
        g = r.json()
        assert g["can_video"] is False
        msg = g.get("lockstep_message") or ""
        assert "Level 10" in msg, f"missing 'Level 10' in lockstep_message: {msg}"
        assert "Level 7" in msg, f"missing 'Level 7' in lockstep_message: {msg}"

    def test_g3_detail_unlocked_at_L10(self, session, auth_headers):
        session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 10})
        r = session.get(f"{API}/groups/g3", headers=auth_headers)
        assert r.status_code == 200
        g = r.json()
        assert g["can_video"] is True
        assert g.get("lockstep_message") is None


# ---------------- Certificates use new L5/L7/L10 scheme ----------------
class TestCertificatesScheme:
    def test_certificates_at_L10_returns_all_three_levels(self, session, auth_headers):
        session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 10})
        r = session.get(f"{API}/certificates", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        earned_ids = {c["id"] for c in data["earned"]}
        # All three achievement certs should be earned at L10
        assert "cert_lvl5" in earned_ids
        assert "cert_lvl7" in earned_ids
        assert "cert_lvl10" in earned_ids
        # No legacy cert_lvl15 / cert_lvl20
        all_ids = earned_ids | {c["id"] for c in data["locked"]}
        assert "cert_lvl15" not in all_ids
        assert "cert_lvl20" not in all_ids
        # Titles correct
        titles = {c["id"]: c["title"] for c in data["earned"]}
        assert titles["cert_lvl5"] == "Squad Unlocked"
        assert titles["cert_lvl7"] == "Niche Owner"
        assert titles["cert_lvl10"] == "Multi-Group + Video"

    def test_certificates_at_L1_locks_all_achievements(self, session, auth_headers):
        session.post(f"{API}/dev/set-level", headers=auth_headers, json={"level": 1})
        r = session.get(f"{API}/certificates", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        earned_ids = {c["id"] for c in data["earned"]}
        assert "cert_lvl5" not in earned_ids
        assert "cert_lvl7" not in earned_ids
        assert "cert_lvl10" not in earned_ids
        locked_ids = {c["id"] for c in data["locked"]}
        assert {"cert_lvl5", "cert_lvl7", "cert_lvl10"}.issubset(locked_ids)
