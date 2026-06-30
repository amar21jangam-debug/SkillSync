"""Multi-agent AI chat using Claude Sonnet 4.5 via emergentintegrations."""
import os
from typing import AsyncIterator

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]
MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-sonnet-4-5-20250929"


AGENT_PROMPTS = {
    "educational": (
        "You are the SkillSync Educational Agent — the lead tutor for tech learners. "
        "Explain concepts, DSA problems, and trade-offs clearly with simple examples. "
        "When the user is stuck on a problem, never give the full solution first: "
        "ask one clarifying question or give a small hint, then progressively reveal "
        "more. Use short paragraphs and code blocks. Be warm but direct."
    ),
    "planning": (
        "You are the SkillSync Planning Agent. You help learners design realistic "
        "study plans and project strategies. You produce structured plans with "
        "milestones, weekly goals, and concrete actions. You ask about the learner's "
        "current level, available hours per week, and target outcome before drafting "
        "a plan. Keep plans tight, prioritized, and measurable."
    ),
    "group_support": (
        "You are the SkillSync Group Support Agent. You help small (max 5) project "
        "teams coordinate: break work into tasks, unblock members, suggest who should "
        "own what, and resolve disagreements with facts. Output is action-oriented: "
        "task lists, owner assignments, and follow-ups. Tone is calm and constructive."
    ),
    "team": (
        "You are the SkillSync Agent Team — a coordinated trio (Planning + "
        "Educational + Group Support). For each user request you respond in three "
        "labeled sections:\n\n"
        "1. **[Planning]** — the next 1–3 concrete actions, ordered.\n"
        "2. **[Educational]** — the core concept or hint needed to make progress.\n"
        "3. **[Group Support]** — how the team should coordinate (owners, "
        "communication, blockers).\n\n"
        "Be concise (no fluff). Use code blocks when helpful."
    ),
}


def get_agent_label(mode: str) -> str:
    return {
        "educational": "Educational Agent",
        "planning": "Planning Agent",
        "group_support": "Group Support Agent",
        "team": "Agent Team",
    }.get(mode, "Educational Agent")


async def stream_agent_response(
    message: str,
    agent_mode: str = "educational",
    session_id: str = "default",
    context: str | None = None,
) -> AsyncIterator[str]:
    """Stream tokens from the selected agent."""
    system = AGENT_PROMPTS.get(agent_mode, AGENT_PROMPTS["educational"])
    if context:
        system = f"{system}\n\nCurrent context for the learner:\n{context}"

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)

    user_msg = UserMessage(text=message)
    async for ev in chat.stream_message(user_msg):
        if isinstance(ev, TextDelta):
            yield ev.content
        elif isinstance(ev, StreamDone):
            break
