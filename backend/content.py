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


PROBLEMS = [
    {
        "id": "p1",
        "title": "Two Sum",
        "difficulty": "Easy",
        "topic": "Arrays",
        "xp": 50,
        "description": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input has exactly one solution and you cannot use the same element twice.",
        "example": "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] == 9",
        "youtube_query": "two sum leetcode explanation",
    },
    {
        "id": "p2",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "topic": "Stack",
        "xp": 50,
        "description": "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid. Brackets must close in the correct order.",
        "example": "Input: s = \"()[]{}\"\nOutput: true",
        "youtube_query": "valid parentheses stack explanation",
    },
    {
        "id": "p3",
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "topic": "Linked List",
        "xp": 60,
        "description": "Given the head of a singly linked list, reverse the list and return the new head.",
        "example": "Input: 1 -> 2 -> 3 -> 4 -> 5\nOutput: 5 -> 4 -> 3 -> 2 -> 1",
        "youtube_query": "reverse linked list iterative explanation",
    },
    {
        "id": "p4",
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "xp": 100,
        "description": "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. Kadane's algorithm is the classic approach.",
        "example": "Input: [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6 (subarray [4,-1,2,1])",
        "youtube_query": "kadane algorithm maximum subarray",
    },
    {
        "id": "p5",
        "title": "Binary Tree Level Order Traversal",
        "difficulty": "Medium",
        "topic": "Trees",
        "xp": 120,
        "description": "Given the root of a binary tree, return the level order traversal of its nodes' values (left to right, level by level).",
        "example": "Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]",
        "youtube_query": "binary tree level order traversal BFS",
    },
    {
        "id": "p6",
        "title": "LRU Cache",
        "difficulty": "Hard",
        "topic": "Design",
        "xp": 200,
        "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `get(key)` and `put(key, value)` in O(1).",
        "example": "Operations: put(1,1), put(2,2), get(1)=1, put(3,3) evicts key 2",
        "youtube_query": "LRU cache implementation explanation",
    },
]


CONTESTS = [
    {
        "id": "c1",
        "title": "SkillSync Weekly #42",
        "starts_in": "2d 4h",
        "duration_min": 90,
        "participants": 1287,
        "prize": "500 XP + Orange Badge",
        "status": "upcoming",
    },
    {
        "id": "c2",
        "title": "Frontend Sprint",
        "starts_in": "5d 12h",
        "duration_min": 120,
        "participants": 642,
        "prize": "300 XP",
        "status": "upcoming",
    },
    {
        "id": "c3",
        "title": "AI/ML Monthly Showdown",
        "starts_in": "Live",
        "duration_min": 180,
        "participants": 2103,
        "prize": "1000 XP + Mentor Session",
        "status": "live",
    },
    {
        "id": "c4",
        "title": "DSA Marathon",
        "starts_in": "Ended",
        "duration_min": 240,
        "participants": 4521,
        "prize": "Cert + 800 XP",
        "status": "ended",
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
    },
    {
        "id": "cu_2", "name": "Sofia Martins", "goal": "frontend",
        "bio": "Building beautiful UIs with React + GSAP. Currently exploring WebGL shaders.",
        "avatar": "https://i.pravatar.cc/200?img=23", "level": 7, "tags": ["React", "GSAP", "Design"],
    },
    {
        "id": "cu_3", "name": "Karim Hassan", "goal": "aiml",
        "bio": "MS in ML, currently fine-tuning small language models for code.",
        "avatar": "https://i.pravatar.cc/200?img=34", "level": 9, "tags": ["PyTorch", "LLMs", "Math"],
    },
    {
        "id": "cu_4", "name": "Emma O'Connell", "goal": "fullstack",
        "bio": "Indie hacker, shipped 4 SaaS products. Loves rapid prototyping.",
        "avatar": "https://i.pravatar.cc/200?img=29", "level": 10, "tags": ["Next.js", "FastAPI", "SaaS"],
    },
    {
        "id": "cu_5", "name": "Yusuf Bello", "goal": "data_science",
        "bio": "Data scientist turning messy data into clear insights and dashboards.",
        "avatar": "https://i.pravatar.cc/200?img=36", "level": 6, "tags": ["SQL", "Pandas", "Tableau"],
    },
    {
        "id": "cu_6", "name": "Lin Wei", "goal": "backend",
        "bio": "Site reliability engineer. Kubernetes wrangler, chaos engineering fan.",
        "avatar": "https://i.pravatar.cc/200?img=14", "level": 11, "tags": ["K8s", "SRE", "Go"],
    },
]


def level_for_xp(xp: int) -> int:
    # 200 XP per level, capped at 10 (beyond L10, projects just get harder)
    return min(10, 1 + xp // 200)
