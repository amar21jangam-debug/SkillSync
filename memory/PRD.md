# SkillSync — Product Requirements (PRD)

## Original problem statement
Build a modern, premium, dark-themed web app called "SkillSync" for tech skill development:
- Strict palette: black bg, dark grey surfaces, white/light grey text, vibrant orange #FF6200 accent
- Heavy GSAP animations (fade-in/slide-up, hover scale 1.03 + orange glow, animated progress, popping level badges)
- Onboarding: ask aim, personality, who to connect with → generate roadmap
- Sidebar nav with 9 sections (Dashboard, Roadmap, Practice, Performance, Contests, Group Discussion, Mentors, Connect, How It Works)
- Levels (5 → Connect unlocks, 15+ → voice AI/meet), XP, streak
- Group projects (max 5 members) with chat, tasks, Start Google Meet, certificate w/ participation %
- Multi-agent AI (Planning, Educational, Group Support + Agent Team mode), floating orange widget
- Responsive

## User personas
- Self-taught developers / students wanting a structured roadmap
- Career switchers wanting accountability, squads, and mentors
- Learners who like gamified streaks and AI hints

## Core architecture (Feb 2026)
- Backend: FastAPI + MongoDB (motor). JWT auth (bcrypt + pyjwt).
- AI: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via `emergentintegrations` + EMERGENT_LLM_KEY, SSE streaming.
- Frontend: React 19 + react-router 7 + Tailwind + Shadcn + GSAP + Recharts + Sonner.
- Mongo collections: `users`, `activity`, `group_chat`, `connections`.

## Implemented in first build (Feb 2026)
- JWT auth (register/login/me)
- Onboarding flow (4 steps) — saved on user record
- Personalized roadmaps per goal (backend/frontend/aiml/data_science/fullstack)
- Practice problems list + detail w/ "I'm Stuck" AI chat + YouTube embed
- Mark solved → XP, streak, level update
- Performance dashboard (14d bar chart + 35d streak calendar + recent solves)
- Contests list + global leaderboard
- Groups grid + group detail (tasks, chat persisted, members, Start Meet → meet.new, certificate when 100% tasks)
- Mentors directory
- Connect/Social (locked until Level 5, AI random match, send connection requests)
- How It Works page
- Floating multi-agent AI chat (Educational, Planning, Group Support, Agent Team)
- Voice mic button locked until Level 15

## Deferred / Backlog
- P1: Real-time voice AI integration (currently button is disabled with tooltip)
- P1: Drag-and-drop tasks, task creation UI in groups
- P2: Real WebSocket group chat
- P2: Email verification + password reset

## Iter 2 (Feb 2026) — Demo enhancements
- Added `POST /api/dev/set-level` and a sidebar "Demo Mode" level switcher (L1/3/5/10/15/20/25) so users can preview Connect, Voice AI, and Architect features during demos/presentations.
- New `Certificates` page (sidebar #10) listing earned certs (DSA Starter, Group team certs, level milestone certs L5/L10/L15/L20) + locked previews. PDF download via jsPDF (landscape, branded). Group detail page also gets a direct "Download PDF" button when project is 100%.
- Mentors: added booking flow. `POST /api/mentors/{id}/book` + `GET /api/mentors/bookings`. Dialog shows next 8 slots; confirmed bookings appear at the top of the Mentors page.
- Practice: added Monaco code editor (`@monaco-editor/react`) with starter code per problem, language switcher (JS/TS/Python), "Get AI review" button that opens the chat with the current code as context.
- How It Works: added a "Levels & Unlocks" vertical timeline showing what you get at each tier (L1 Starter, L5 Connect, L10 Squad Leader, L15 Voice AI Adept, L20 Architect).
