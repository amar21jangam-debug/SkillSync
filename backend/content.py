"""Static content: roadmaps, problems, contests, mentors."""

ROADMAPS = {
    "backend": [
        {"title": "DSA Fundamentals", "topics": ["Arrays", "Hashmaps", "Trees", "Graphs"], "hours": 40},
        {"title": "Databases (DBMS)", "topics": ["SQL", "Indexing", "Normalization", "Transactions"], "hours": 25},
        {"title": "Node.js & Express", "topics": ["REST APIs", "Middleware", "Auth", "Validation"], "hours": 30},
        {"title": "MongoDB & NoSQL", "topics": ["Schemas", "Aggregation", "Performance"], "hours": 20},
        {"title": "System Design Basics", "topics": ["Caching", "Load Balancers", "Queues"], "hours": 35},
        {"title": "DevOps & Deployment", "topics": ["Docker", "CI/CD", "Cloud (AWS)"], "hours": 25},
    ],
    "frontend": [
        {"title": "HTML / CSS Mastery", "topics": ["Flexbox", "Grid", "Animations", "Responsive"], "hours": 20},
        {"title": "JavaScript Deep Dive", "topics": ["ES6+", "Async", "Closures", "DOM"], "hours": 30},
        {"title": "React Fundamentals", "topics": ["Hooks", "State", "Routing"], "hours": 35},
        {"title": "Advanced React", "topics": ["Context", "Performance", "Suspense"], "hours": 25},
        {"title": "State Management", "topics": ["Redux", "Zustand", "Query Caches"], "hours": 20},
        {"title": "Build Tooling & Deploy", "topics": ["Vite", "Webpack", "Vercel"], "hours": 15},
    ],
    "aiml": [
        {"title": "Math for ML", "topics": ["Linear Algebra", "Calculus", "Probability"], "hours": 40},
        {"title": "Python for Data Science", "topics": ["NumPy", "Pandas", "Matplotlib"], "hours": 25},
        {"title": "Classical ML", "topics": ["Regression", "Classification", "Clustering"], "hours": 35},
        {"title": "Deep Learning", "topics": ["CNNs", "RNNs", "Transformers"], "hours": 45},
        {"title": "LLMs & Generative AI", "topics": ["Prompting", "RAG", "Fine-tuning"], "hours": 30},
        {"title": "MLOps", "topics": ["Model Serving", "Monitoring", "Pipelines"], "hours": 25},
    ],
    "data_science": [
        {"title": "Statistics Foundations", "topics": ["Descriptive", "Inferential", "Hypothesis"], "hours": 30},
        {"title": "Python & Pandas", "topics": ["Data Wrangling", "EDA"], "hours": 25},
        {"title": "SQL for Analysts", "topics": ["Joins", "Window Functions", "CTEs"], "hours": 20},
        {"title": "Visualization", "topics": ["Matplotlib", "Plotly", "Tableau"], "hours": 20},
        {"title": "ML for DS", "topics": ["Feature Engineering", "Model Selection"], "hours": 35},
        {"title": "Business Storytelling", "topics": ["Reports", "Stakeholder Comms"], "hours": 15},
    ],
    "fullstack": [
        {"title": "Frontend Core", "topics": ["HTML", "CSS", "JavaScript", "React"], "hours": 40},
        {"title": "Backend Core", "topics": ["Node/Express or FastAPI", "REST"], "hours": 35},
        {"title": "Databases", "topics": ["SQL", "MongoDB", "Schema Design"], "hours": 25},
        {"title": "Auth & Security", "topics": ["JWT", "OAuth", "CSRF", "CORS"], "hours": 20},
        {"title": "DevOps Basics", "topics": ["Docker", "CI/CD", "Cloud"], "hours": 25},
        {"title": "Real-World Project", "topics": ["End-to-end App", "Deploy"], "hours": 40},
    ],
}


PROBLEMS_BY_GOAL = {
    "backend": [
        {
            "id": "be1", "title": "Two Sum", "difficulty": "Easy", "topic": "Arrays · DSA", "xp": 50,
            "description": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.",
            "example": "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
            "youtube_query": "two sum leetcode explanation",
        },
        {
            "id": "be2", "title": "Design a Rate Limiter", "difficulty": "Medium", "topic": "System Design", "xp": 120,
            "description": "Design a sliding-window rate limiter that allows N requests per user per minute. Discuss in-memory vs Redis-backed approaches, and how to handle distributed deployments.",
            "example": "API: allow_request(user_id) → bool\nLimit: 100 req/min/user",
            "youtube_query": "sliding window rate limiter system design",
        },
        {
            "id": "be3", "title": "SQL: Top 3 Customers", "difficulty": "Easy", "topic": "Databases", "xp": 60,
            "description": "Given an `orders(user_id, amount, created_at)` table, write a SQL query that returns the top 3 users by total amount spent in the last 30 days.",
            "example": "SELECT user_id, SUM(amount) AS total\nFROM orders\nWHERE created_at >= NOW() - INTERVAL '30 days'\nGROUP BY user_id ORDER BY total DESC LIMIT 3;",
            "youtube_query": "sql group by order by top n query",
        },
        {
            "id": "be4", "title": "REST API for Todos", "difficulty": "Easy", "topic": "APIs · Express", "xp": 70,
            "description": "Implement REST endpoints (GET, POST, PUT, DELETE) for a Todo list. Include validation, idempotent IDs, and proper status codes.",
            "example": "POST /todos → 201\nGET /todos/:id → 200 | 404",
            "youtube_query": "rest api todo crud node express",
        },
        {
            "id": "be5", "title": "LRU Cache", "difficulty": "Hard", "topic": "DSA · Design", "xp": 200,
            "description": "Design a Least Recently Used cache supporting `get(key)` and `put(key, value)` in O(1). Hash map + doubly linked list.",
            "example": "put(1,1); put(2,2); get(1)=1; put(3,3) → evicts key 2",
            "youtube_query": "lru cache implementation",
        },
        {
            "id": "be6", "title": "Idempotent Payments", "difficulty": "Medium", "topic": "System Design", "xp": 140,
            "description": "Design an idempotent /charge endpoint so retries from clients don't double-charge users. Discuss idempotency keys, DB constraints, and retry windows.",
            "example": "POST /charge\nHeader: Idempotency-Key: abc-123",
            "youtube_query": "idempotent api design stripe pattern",
        },
    ],
    "frontend": [
        {
            "id": "fe1", "title": "Debounce a Search Input", "difficulty": "Easy", "topic": "JS · React", "xp": 60,
            "description": "Build a search box that debounces user input by 300ms and only fires the API call after typing stops.",
            "example": "useDebounce(value, 300) → debouncedValue",
            "youtube_query": "debounce react hook explained",
        },
        {
            "id": "fe2", "title": "CSS: Center Anything", "difficulty": "Easy", "topic": "CSS · Layout", "xp": 40,
            "description": "Center a div both horizontally and vertically inside its parent — solve with Flexbox, Grid, and absolute positioning. Which is best for what context?",
            "example": "display: grid; place-items: center;",
            "youtube_query": "css center div flexbox grid",
        },
        {
            "id": "fe3", "title": "Build a Custom <Tabs />", "difficulty": "Medium", "topic": "React · A11y", "xp": 100,
            "description": "Build an accessible, keyboard-navigable Tabs component (ARIA roles, arrow-key cycling, focus management). No third-party libs.",
            "example": "<Tabs><Tab label=\"One\">...</Tab>...</Tabs>",
            "youtube_query": "accessible react tabs component",
        },
        {
            "id": "fe4", "title": "Render 10k Items Smoothly", "difficulty": "Medium", "topic": "Performance", "xp": 120,
            "description": "You need to render a list of 10,000 items without freezing. Explain virtualization, why DOM size matters, and implement with `react-window`.",
            "example": "<FixedSizeList itemCount={10000} ... />",
            "youtube_query": "react virtualization react-window tutorial",
        },
        {
            "id": "fe5", "title": "Type a Form with TS Generics", "difficulty": "Hard", "topic": "TypeScript", "xp": 160,
            "description": "Build a fully type-safe <Form values={…}> component where `onSubmit` and `errors` are inferred from the schema, using generic types.",
            "example": "type FormProps<T> = { schema: ZodType<T>; onSubmit: (v: T) => void }",
            "youtube_query": "typescript generics react form",
        },
        {
            "id": "fe6", "title": "Animated Counter with rAF", "difficulty": "Medium", "topic": "Animations", "xp": 90,
            "description": "Animate a number from 0 → N over 1.2s using requestAnimationFrame, with an easing function. No animation libraries.",
            "example": "animateTo(2480) // tween 0→2480",
            "youtube_query": "requestAnimationFrame number tween easing",
        },
    ],
    "aiml": [
        {
            "id": "ai1", "title": "Linear Algebra: Dot Product", "difficulty": "Easy", "topic": "Math · LinAlg", "xp": 50,
            "description": "Compute `a · b` for two vectors in R^n by hand for n=3, then write a numpy one-liner. Why is dot product the foundation of attention in transformers?",
            "example": "a = [1,2,3]; b = [4,5,6]\nnp.dot(a, b) → 32",
            "youtube_query": "dot product intuition linear algebra",
        },
        {
            "id": "ai2", "title": "Gradient Descent by Hand", "difficulty": "Medium", "topic": "Math · Calculus", "xp": 110,
            "description": "Given f(x) = (x-3)^2, compute the gradient and perform 5 steps of gradient descent from x=0 with η=0.1. Show your work.",
            "example": "f'(x) = 2(x-3); x_{t+1} = x_t - η·f'(x_t)",
            "youtube_query": "gradient descent intuition derivative",
        },
        {
            "id": "ai3", "title": "Probability: Bayes' Theorem", "difficulty": "Easy", "topic": "Probability", "xp": 60,
            "description": "Disease has 1% prevalence. Test is 99% accurate. Patient tests positive — what's the probability they actually have the disease?",
            "example": "P(D|+) = P(+|D)P(D)/P(+) ≈ 0.5",
            "youtube_query": "bayes theorem disease test example",
        },
        {
            "id": "ai4", "title": "Implement Softmax", "difficulty": "Easy", "topic": "ML · Numpy", "xp": 70,
            "description": "Write a numerically stable softmax in numpy. Why do we subtract the max before exp? Compare with naïve version.",
            "example": "softmax(x) = exp(x - max(x)) / sum(exp(x - max(x)))",
            "youtube_query": "softmax numerical stability",
        },
        {
            "id": "ai5", "title": "Build a Tiny MLP", "difficulty": "Medium", "topic": "Deep Learning", "xp": 140,
            "description": "Build a 2-layer MLP in PyTorch that classifies MNIST > 95% accuracy. Show the forward pass and loss curve.",
            "example": "nn.Sequential(Linear(784, 128), ReLU(), Linear(128, 10))",
            "youtube_query": "pytorch mlp mnist from scratch",
        },
        {
            "id": "ai6", "title": "Self-Attention From Scratch", "difficulty": "Hard", "topic": "Transformers", "xp": 200,
            "description": "Implement scaled dot-product self-attention: given Q, K, V (each n×d), compute softmax(QK^T / √d) · V. Explain why √d scaling matters.",
            "example": "Attention(Q, K, V) = softmax(QKᵀ / √d_k) V",
            "youtube_query": "scaled dot product attention from scratch",
        },
    ],
    "data_science": [
        {
            "id": "ds1", "title": "Pandas: Cohort Retention", "difficulty": "Medium", "topic": "Pandas · EDA", "xp": 110,
            "description": "Given an events table with (user_id, signup_date, event_date), compute weekly cohort retention as a matrix.",
            "example": "df.groupby([cohort_week, event_week])['user_id'].nunique().unstack()",
            "youtube_query": "pandas cohort retention analysis",
        },
        {
            "id": "ds2", "title": "SQL: Window Functions", "difficulty": "Medium", "topic": "SQL", "xp": 100,
            "description": "Using a `sales(date, region, amount)` table, write a query that returns each region's 7-day moving average using a window function.",
            "example": "AVG(amount) OVER (PARTITION BY region ORDER BY date ROWS 6 PRECEDING)",
            "youtube_query": "sql window functions moving average",
        },
        {
            "id": "ds3", "title": "A/B Test: Significance?", "difficulty": "Easy", "topic": "Stats", "xp": 80,
            "description": "Variant A: 1000 visits, 110 conversions. Variant B: 1000 visits, 135. Is the difference statistically significant at α=0.05? Use a two-proportion z-test.",
            "example": "z = (p1 - p2) / sqrt(p*(1-p)*(1/n1 + 1/n2))",
            "youtube_query": "ab test two proportion z test",
        },
        {
            "id": "ds4", "title": "Outlier Detection", "difficulty": "Easy", "topic": "EDA", "xp": 60,
            "description": "Given a series of numeric values, identify outliers using both the IQR method and z-score method. When does each fail?",
            "example": "IQR: x < Q1 - 1.5·IQR  or  x > Q3 + 1.5·IQR",
            "youtube_query": "outlier detection iqr z score",
        },
        {
            "id": "ds5", "title": "Feature Engineering: Dates", "difficulty": "Medium", "topic": "ML · Features", "xp": 100,
            "description": "From a datetime column, extract features that boost a sales-forecasting model: cyclic encoding (sin/cos) for hour-of-day, day-of-week, plus holidays.",
            "example": "df['hour_sin'] = np.sin(2π * hour/24)",
            "youtube_query": "cyclic feature engineering datetime",
        },
        {
            "id": "ds6", "title": "Storytelling with One Chart", "difficulty": "Medium", "topic": "Viz · Comms", "xp": 90,
            "description": "Given quarterly revenue and churn data, design the ONE chart you'd put in a board deck. Explain your choice of chart type, color, and annotations.",
            "example": "Line chart with shaded recession band + delta callouts",
            "youtube_query": "executive dashboard chart design best practices",
        },
    ],
    "fullstack": [
        {
            "id": "fs1", "title": "Two Sum", "difficulty": "Easy", "topic": "DSA", "xp": 50,
            "description": "Classic warmup. Return indices of two numbers that add up to target.",
            "example": "twoSum([2,7,11,15], 9) → [0,1]",
            "youtube_query": "two sum leetcode explanation",
        },
        {
            "id": "fs2", "title": "REST API + React List", "difficulty": "Easy", "topic": "Fullstack", "xp": 80,
            "description": "Build a FastAPI endpoint that returns a list of items + a React component that fetches and renders them with loading/error states.",
            "example": "GET /items → [{id, name}]\n<ItemList />",
            "youtube_query": "fastapi react fetch list crud",
            },
        {
            "id": "fs3", "title": "JWT Auth End-to-End", "difficulty": "Medium", "topic": "Auth", "xp": 130,
            "description": "Implement /register, /login (returns JWT), and /me (requires Bearer token). Frontend should store the token and call /me on load.",
            "example": "Authorization: Bearer <token>",
            "youtube_query": "jwt authentication fullstack tutorial",
        },
        {
            "id": "fs4", "title": "Optimistic UI Update", "difficulty": "Medium", "topic": "Frontend · UX", "xp": 110,
            "description": "Implement a 'like' button that updates the UI instantly and rolls back on server error. Show the loading and error states.",
            "example": "setLikes(prev => prev+1); try { await api.like(); } catch { setLikes(prev => prev-1) }",
            "youtube_query": "optimistic ui update react pattern",
        },
        {
            "id": "fs5", "title": "Image Upload + Resize", "difficulty": "Medium", "topic": "Fullstack", "xp": 130,
            "description": "Frontend: file input with drag-and-drop. Backend: receive multipart, resize to 800x800 with Pillow, return URL. Show progress.",
            "example": "POST /upload (multipart) → {url, w, h}",
            "youtube_query": "fastapi image upload pillow resize",
        },
        {
            "id": "fs6", "title": "Ship It: Deploy to Prod", "difficulty": "Hard", "topic": "DevOps", "xp": 200,
            "description": "Take a small fullstack app from localhost to a public URL: Dockerize, set up CI on push, deploy to a cloud provider, configure HTTPS.",
            "example": "Dockerfile → GitHub Actions → Fly.io / Vercel",
            "youtube_query": "fullstack app deploy docker ci cd",
        },
    ],
}

# Backwards-compat alias used elsewhere
PROBLEMS = PROBLEMS_BY_GOAL["fullstack"]


def problems_for_goal(goal: str | None):
    if not goal or goal not in PROBLEMS_BY_GOAL:
        return PROBLEMS_BY_GOAL["fullstack"]
    return PROBLEMS_BY_GOAL[goal]


CONTESTS = [
    # Individual
    {
        "id": "c1", "kind": "individual",
        "title": "SkillSync Weekly #42",
        "starts_in": "2d 4h", "duration_min": 90,
        "participants": 1287, "prize": "500 XP + Lime Badge",
        "status": "upcoming",
    },
    {
        "id": "c2", "kind": "individual",
        "title": "Frontend Sprint",
        "starts_in": "5d 12h", "duration_min": 120,
        "participants": 642, "prize": "300 XP",
        "status": "upcoming",
    },
    {
        "id": "c3", "kind": "individual",
        "title": "AI/ML Monthly Showdown",
        "starts_in": "Live", "duration_min": 180,
        "participants": 2103, "prize": "1000 XP + Mentor Session",
        "status": "live",
    },
    {
        "id": "c4", "kind": "individual",
        "title": "DSA Marathon",
        "starts_in": "Ended", "duration_min": 240,
        "participants": 4521, "prize": "Cert + 800 XP",
        "status": "ended",
    },
    # Group (unlocks at Level 5)
    {
        "id": "g_c1", "kind": "group",
        "title": "Squad Build-a-Thon — 48h",
        "starts_in": "3d 1h", "duration_min": 2880,
        "participants": 184, "prize": "Team Certificate + 1500 XP/member",
        "status": "upcoming",
        "team_size": "3–5",
        "subtitle": "Form a squad, ship a working product in 48h.",
    },
    {
        "id": "g_c2", "kind": "group",
        "title": "Open-Source Sprint",
        "starts_in": "1w 2d", "duration_min": 1440,
        "participants": 96, "prize": "OSS Contribution Cert",
        "status": "upcoming",
        "team_size": "2–4",
        "subtitle": "Your squad ships PRs to a real OSS repo over one weekend.",
    },
    {
        "id": "g_c3", "kind": "group",
        "title": "AI Agent Showdown",
        "starts_in": "Live", "duration_min": 720,
        "participants": 312, "prize": "Top squad → Mentor Pairing + 2000 XP",
        "status": "live",
        "team_size": "3",
        "subtitle": "Build a multi-agent system that beats the baseline.",
    },
]


LEADERBOARD = [
    {"rank": 1, "name": "Ada Lovelace", "xp": 12480, "level": 22},
    {"rank": 2, "name": "Grace Hopper", "xp": 11320, "level": 20},
    {"rank": 3, "name": "Linus T.", "xp": 10870, "level": 19},
    {"rank": 4, "name": "Margaret H.", "xp": 9540, "level": 18},
    {"rank": 5, "name": "Dennis R.", "xp": 8800, "level": 17},
    {"rank": 6, "name": "Ken T.", "xp": 7920, "level": 16},
    {"rank": 7, "name": "Barbara L.", "xp": 7100, "level": 15},
]


MENTORS = [
    {
        "id": "m1",
        "name": "Priya Raghavan",
        "role": "Senior Backend Engineer @ Stripe",
        "expertise": ["Backend", "System Design", "Go"],
        "rating": 4.9,
        "sessions": 184,
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        "bio": "10+ years building payment infra. Mentoring on system design and career growth.",
    },
    {
        "id": "m2",
        "name": "Marcus Chen",
        "role": "Staff Frontend @ Vercel",
        "expertise": ["React", "Performance", "Design Systems"],
        "rating": 4.8,
        "sessions": 142,
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        "bio": "Frontend craft, web performance, and DX. Open source maintainer.",
    },
    {
        "id": "m3",
        "name": "Anika Sharma",
        "role": "ML Researcher @ DeepMind",
        "expertise": ["AI/ML", "LLMs", "PyTorch"],
        "rating": 5.0,
        "sessions": 98,
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
        "bio": "Research on multimodal LLMs. Helps mentees navigate AI careers.",
    },
    {
        "id": "m4",
        "name": "David Okafor",
        "role": "DevOps Lead @ Cloudflare",
        "expertise": ["DevOps", "Kubernetes", "SRE"],
        "rating": 4.7,
        "sessions": 211,
        "avatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
        "bio": "SRE at scale. Loves coaching engineers transitioning into platform roles.",
    },
]


SAMPLE_GROUPS = [
    {
        "id": "g1",
        "name": "Pixel Pioneers",
        "project": "Build a Real-time Code Collaboration Tool",
        "progress": 62,
        "min_level": 5,  # group required level — all members must match or exceed
        "niche": "Fullstack",
        "roles": [
            {"member_id": "u_a", "role": "Frontend (Monaco + UI)"},
            {"member_id": "u_b", "role": "Backend (WebSocket + Auth)"},
            {"member_id": "u_c", "role": "Realtime sync (CRDT)"},
            {"member_id": "u_d", "role": "Design + Rooms UX"},
        ],
        "members": [
            {"id": "u_a", "name": "Aarav", "avatar": "https://i.pravatar.cc/100?img=12", "level": 5},
            {"id": "u_b", "name": "Sara", "avatar": "https://i.pravatar.cc/100?img=32", "level": 6},
            {"id": "u_c", "name": "Diego", "avatar": "https://i.pravatar.cc/100?img=47", "level": 5},
            {"id": "u_d", "name": "Mei", "avatar": "https://i.pravatar.cc/100?img=49", "level": 5},
        ],
        "tasks": [
            {"id": "t1", "title": "Set up WebSocket server", "done": True, "assigned": "Aarav"},
            {"id": "t2", "title": "Design Monaco editor integration", "done": True, "assigned": "Sara"},
            {"id": "t3", "title": "Build CRDT sync layer", "done": False, "assigned": "Diego"},
            {"id": "t4", "title": "Auth + Rooms UI", "done": False, "assigned": "Mei"},
        ],
        "chat": [
            {"from": "Aarav", "text": "Pushed the websocket boilerplate to main!", "time": "2h ago"},
            {"from": "Sara", "text": "Monaco hooks ready, reviewing PR now.", "time": "1h ago"},
        ],
    },
    {
        "id": "g2",
        "name": "Neural Net Ninjas",
        "project": "Fine-tune an LLM for Code Review",
        "progress": 38,
        "min_level": 7,
        "niche": "AI/ML",
        "roles": [
            {"member_id": "u_e", "role": "Data curation"},
            {"member_id": "u_f", "role": "Eval harness"},
            {"member_id": "u_g", "role": "Model training (LoRA)"},
        ],
        "members": [
            {"id": "u_e", "name": "Hiro", "avatar": "https://i.pravatar.cc/100?img=15", "level": 7},
            {"id": "u_f", "name": "Zara", "avatar": "https://i.pravatar.cc/100?img=44", "level": 7},
            {"id": "u_g", "name": "Leo", "avatar": "https://i.pravatar.cc/100?img=51", "level": 8},
        ],
        "tasks": [
            {"id": "t1", "title": "Curate code-review dataset", "done": True, "assigned": "Hiro"},
            {"id": "t2", "title": "Baseline eval harness", "done": False, "assigned": "Zara"},
            {"id": "t3", "title": "LoRA training config", "done": False, "assigned": "Leo"},
        ],
        "chat": [
            {"from": "Hiro", "text": "Dataset is 12k samples now.", "time": "5h ago"},
        ],
    },
    {
        "id": "g3",
        "name": "Cloud Crusaders",
        "project": "Multi-region URL Shortener",
        "progress": 81,
        "min_level": 10,
        "niche": "Backend / DevOps",
        "roles": [
            {"member_id": "u_h", "role": "Edge routing"},
            {"member_id": "u_i", "role": "Database schema"},
            {"member_id": "u_j", "role": "Analytics dashboard"},
            {"member_id": "u_k", "role": "Custom domain flow"},
            {"member_id": "u_l", "role": "Frontend dashboard"},
        ],
        "members": [
            {"id": "u_h", "name": "Nia", "avatar": "https://i.pravatar.cc/100?img=20", "level": 10},
            {"id": "u_i", "name": "Kai", "avatar": "https://i.pravatar.cc/100?img=33", "level": 10},
            {"id": "u_j", "name": "Maya", "avatar": "https://i.pravatar.cc/100?img=45", "level": 10},
            {"id": "u_k", "name": "Theo", "avatar": "https://i.pravatar.cc/100?img=52", "level": 10},
            {"id": "u_l", "name": "Iris", "avatar": "https://i.pravatar.cc/100?img=48", "level": 10},
        ],
        "tasks": [
            {"id": "t1", "title": "Edge worker routing", "done": True, "assigned": "Nia"},
            {"id": "t2", "title": "DynamoDB schema", "done": True, "assigned": "Kai"},
            {"id": "t3", "title": "Analytics dashboard", "done": True, "assigned": "Maya"},
            {"id": "t4", "title": "Custom domain CNAME flow", "done": False, "assigned": "Theo"},
        ],
        "chat": [
            {"from": "Nia", "text": "Edge routing latency ~14ms p99.", "time": "1d ago"},
            {"from": "Iris", "text": "Dashboard PR ready for review.", "time": "3h ago"},
        ],
    },
]


CONNECT_USERS = [
    {
        "id": "cu_1", "name": "Ravi Iyer", "goal": "backend",
        "bio": "Backend engineer obsessed with distributed systems and Postgres internals.",
        "avatar": "https://i.pravatar.cc/200?img=11", "level": 8, "tags": ["Go", "Postgres", "Kafka"],
        "education": "UG", "college": "IIT Bombay",
    },
    {
        "id": "cu_2", "name": "Sofia Martins", "goal": "frontend",
        "bio": "Building beautiful UIs with React + GSAP. Currently exploring WebGL shaders.",
        "avatar": "https://i.pravatar.cc/200?img=23", "level": 7, "tags": ["React", "GSAP", "Design"],
        "education": "UG", "college": "BITS Pilani",
    },
    {
        "id": "cu_3", "name": "Karim Hassan", "goal": "aiml",
        "bio": "MS in ML, currently fine-tuning small language models for code.",
        "avatar": "https://i.pravatar.cc/200?img=34", "level": 9, "tags": ["PyTorch", "LLMs", "Math"],
        "education": "PG", "college": "Stanford",
    },
    {
        "id": "cu_4", "name": "Emma O'Connell", "goal": "fullstack",
        "bio": "Indie hacker, shipped 4 SaaS products. Loves rapid prototyping.",
        "avatar": "https://i.pravatar.cc/200?img=29", "level": 10, "tags": ["Next.js", "FastAPI", "SaaS"],
        "education": "Other", "college": "Self-taught",
    },
    {
        "id": "cu_5", "name": "Yusuf Bello", "goal": "data_science",
        "bio": "Data scientist turning messy data into clear insights and dashboards.",
        "avatar": "https://i.pravatar.cc/200?img=36", "level": 6, "tags": ["SQL", "Pandas", "Tableau"],
        "education": "UG", "college": "IIT Bombay",
    },
    {
        "id": "cu_6", "name": "Lin Wei", "goal": "backend",
        "bio": "Site reliability engineer. Kubernetes wrangler, chaos engineering fan.",
        "avatar": "https://i.pravatar.cc/200?img=14", "level": 10, "tags": ["K8s", "SRE", "Go"],
        "education": "PG", "college": "NUS Singapore",
    },
]


def level_for_xp(xp: int) -> int:
    # 200 XP per level, capped at 10 (beyond L10, projects just get harder)
    return min(10, 1 + xp // 200)
