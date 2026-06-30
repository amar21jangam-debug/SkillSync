import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { useAuth } from "../lib/auth";
import { Check, ChevronRight, Sparkles, Youtube, ArrowLeft, Zap, Play } from "lucide-react";
import AIChatWidget from "../components/AIChatWidget";
import Editor from "@monaco-editor/react";

const DIFFICULTY_STYLE = {
  Easy: "text-green-400 border-green-400/30 bg-green-400/10",
  Medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  Hard: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function Practice() {
  const [problems, setProblems] = useState([]);
  const [active, setActive] = useState(null);
  const { setUser } = useAuth();

  useEffect(() => { api.get("/problems").then((r) => setProblems(r.data)); }, []);

  const open = (p) => setActive(p);
  const close = () => setActive(null);

  const markSolved = async () => {
    const { data } = await api.post("/problems/solve", { problem_id: active.id });
    setUser(data);
    const fresh = await api.get("/problems");
    setProblems(fresh.data);
    setActive((a) => a ? { ...a, solved: true } : a);
  };

  if (active) return <ProblemDetail problem={active} onBack={close} onSolved={markSolved} />;

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-2">Practice Problems</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Sharpen the saw.</h1>
        <p className="text-[#CCCCCC] mt-2 text-sm">Pick a problem. Earn XP. Get stuck? Hit the orange button.</p>
      </div>
      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-[#2A2A2A] text-xs mono uppercase tracking-widest text-[#888]">
          <div className="col-span-6">Problem</div>
          <div className="col-span-2">Topic</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2 text-right">XP</div>
        </div>
        {problems.map((p) => (
          <button
            key={p.id}
            data-testid={TID.problemRow(p.id)}
            onClick={() => open(p)}
            className="w-full grid grid-cols-12 items-center px-5 py-4 border-b border-[#1F1F1F] last:border-0 hover:bg-[#141414] transition-colors text-left"
          >
            <div className="col-span-6 flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${p.solved ? "bg-[#FF6200] text-black" : "border border-[#2A2A2A]"}`}>
                {p.solved ? <Check size={13}/> : <span className="text-[10px] mono text-[#888]">{p.id.slice(1)}</span>}
              </div>
              <div className="font-medium">{p.title}</div>
            </div>
            <div className="col-span-2 text-sm text-[#CCCCCC]">{p.topic}</div>
            <div className="col-span-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLE[p.difficulty]}`}>{p.difficulty}</span>
            </div>
            <div className="col-span-2 text-right flex items-center justify-end gap-1.5 mono text-[#FF6200]">
              <Zap size={13} /> {p.xp}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProblemDetail({ problem, onBack, onSolved }) {
  const [stuckOpen, setStuckOpen] = useState(false);
  const [code, setCode] = useState(STARTER_CODE[problem.id] || DEFAULT_STARTER);
  const [language, setLanguage] = useState("javascript");
  const ytSrc = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(problem.youtube_query)}`;

  return (
    <div>
      <button onClick={onBack} className="text-sm text-[#CCCCCC] hover:text-[#FF6200] mb-6 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Back to problems
      </button>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-7">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLE[problem.difficulty]}`}>{problem.difficulty}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#2A2A2A] text-[#CCCCCC] mono">{problem.topic}</span>
              <span className="text-xs mono text-[#FF6200] flex items-center gap-1"><Zap size={12}/> {problem.xp} XP</span>
              {problem.solved && <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF6200] text-black mono">Solved</span>}
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold mb-5">{problem.title}</h1>
            <div className="text-[#CCCCCC] leading-relaxed whitespace-pre-wrap mb-6">{problem.description}</div>
            <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 mono text-sm text-[#CCCCCC] whitespace-pre-wrap">{problem.example}</div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                data-testid={TID.imStuckBtn}
                onClick={() => setStuckOpen(true)}
                className="btn-primary"
              >
                <Sparkles size={16} /> I'm Stuck — Help me
              </button>
              <button
                data-testid={TID.solvedBtn}
                onClick={onSolved}
                disabled={problem.solved}
                className="btn-secondary disabled:opacity-50"
              >
                <Check size={16} /> {problem.solved ? "Already solved" : `Mark Solved (+${problem.xp} XP)`}
              </button>
            </div>
          </div>

          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A2A2A] bg-[#0A0A0A]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6200]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
                </div>
                <div className="text-xs mono uppercase tracking-widest text-[#888]">Solution.{language === "javascript" ? "js" : language === "python" ? "py" : "ts"}</div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={language} onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#1F1F1F] border border-[#2A2A2A] text-white text-xs rounded px-2 py-1 outline-none focus:border-[#FF6200]"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                </select>
                <button
                  onClick={() => setStuckOpen(true)}
                  className="btn-secondary text-xs py-1 px-2"
                  title="Ask the AI tutor about your code"
                >
                  <Play size={12}/> Get AI review
                </button>
              </div>
            </div>
            <Editor
              height="360px"
              language={language}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "JetBrains Mono, monospace",
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        <div className="surface-card p-5 self-start">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <Youtube size={16} className="text-[#FF6200]" /> Suggested Video
          </div>
          <div className="aspect-video rounded-lg overflow-hidden border border-[#2A2A2A] bg-black">
            <iframe
              src={ytSrc}
              title="YouTube explanation"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="text-xs text-[#888] mt-3">Search: <span className="mono text-[#CCCCCC]">{problem.youtube_query}</span></div>
        </div>
      </div>

      {stuckOpen && (
        <AIChatWidget
          initialOpen
          contextHint={`Problem: ${problem.title}\n${problem.description}\n\nExample:\n${problem.example}\n\nLearner's current code (${language}):\n${code}`}
        />
      )}
    </div>
  );
}

const DEFAULT_STARTER = `// Write your solution here\nfunction solve(input) {\n  // ...\n  return input;\n}\n`;

const STARTER_CODE = {
  p1: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n}\n`,
  p2: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const ch of s) {\n    // your logic\n  }\n  return stack.length === 0;\n}\n`,
  p3: `function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    // your logic\n  }\n  return prev;\n}\n`,
  p4: `function maxSubArray(nums) {\n  let best = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    // Kadane's algorithm\n  }\n  return best;\n}\n`,
  p5: `function levelOrder(root) {\n  if (!root) return [];\n  const out = [], q = [root];\n  while (q.length) {\n    // BFS by level\n  }\n  return out;\n}\n`,
  p6: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    // O(1)\n  }\n  put(key, value) {\n    // O(1)\n  }\n}\n`,
};
