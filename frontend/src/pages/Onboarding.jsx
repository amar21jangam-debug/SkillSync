import { useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { ArrowLeft, ArrowRight, Check, Sparkles, Code2, Cpu, Brain, Database, Layers } from "lucide-react";
import { gsap } from "gsap";

const GOALS = [
  { key: "backend", label: "Backend", icon: Cpu, desc: "APIs, databases, systems." },
  { key: "frontend", label: "Frontend", icon: Code2, desc: "UI, React, design systems." },
  { key: "aiml", label: "AI / ML", icon: Brain, desc: "Models, LLMs, deep learning." },
  { key: "data_science", label: "Data Science", icon: Database, desc: "Analytics, viz, insights." },
  { key: "fullstack", label: "Fullstack", icon: Layers, desc: "End-to-end product builder." },
];

const PERSONALITY = ["Tech-leaning", "Math-leaning", "Design-leaning", "Product-minded", "Researcher", "Builder"];
const CONNECT = ["Peers at my level", "Senior mentors", "Project collaborators", "Study buddies", "Interview partners"];

export default function Onboarding() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const [personality, setPersonality] = useState([]);
  const [personalityText, setPersonalityText] = useState("");
  const [connectWith, setConnectWith] = useState([]);
  const [connectText, setConnectText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current,
        { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
    }
  }, [step]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.onboarding_complete) return <Navigate to="/app" replace />;

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const finish = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/onboarding", {
        goal, personality, personality_text: personalityText,
        connect_with: connectWith, connect_text: connectText,
      });
      setUser(data);
      navigate("/app");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#FFFFFF]/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] flex items-center justify-center">
            <Sparkles size={14} className="text-black" />
          </div>
          <div className="font-bold tracking-tight">SkillSync · Onboarding</div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-[#FFFFFF]" : "bg-[#2A2A2A]"}`} />
          ))}
        </div>

        <div ref={stepRef} data-testid={TID.onbStep(step)} className="surface-card p-8">
          {step === 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-2">What is your main aim?</h2>
              <p className="text-sm text-[#CCCCCC] mb-6">Pick your primary track — we'll generate a personalized roadmap.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {GOALS.map((g) => {
                  const Icon = g.icon;
                  const active = goal === g.key;
                  return (
                    <button
                      key={g.key}
                      data-testid={TID.onbGoalCard(g.key)}
                      onClick={() => setGoal(g.key)}
                      className={`text-left p-4 rounded-xl border transition-all ${active ? "border-[#FFFFFF] bg-[#FFFFFF]/10 shadow-[0_0_18px_rgba(255,255,255,0.25)]" : "border-[#2A2A2A] bg-[#1F1F1F] hover:border-[#FFFFFF]/40"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? "bg-[#FFFFFF] text-black" : "bg-[#2A2A2A] text-[#FFFFFF]"}`}>
                          <Icon size={18} />
                        </div>
                        <div className="font-semibold">{g.label}</div>
                      </div>
                      <div className="text-xs text-[#CCCCCC]">{g.desc}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-2">What kind of person are you?</h2>
              <p className="text-sm text-[#CCCCCC] mb-6">Pick what fits, and tell us in your own words.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {PERSONALITY.map((p) => {
                  const active = personality.includes(p);
                  return (
                    <button
                      key={p}
                      data-testid={TID.onbPersonalityChip(p.toLowerCase().replace(/\W/g, "-"))}
                      onClick={() => toggle(personality, setPersonality, p)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${active ? "bg-[#FFFFFF] text-black border-[#FFFFFF]" : "bg-[#1F1F1F] border-[#2A2A2A] hover:border-[#FFFFFF]/50"}`}
                    >
                      {active && <Check size={12} className="inline mr-1" />}
                      {p}
                    </button>
                  );
                })}
              </div>
              <textarea
                data-testid={TID.onbPersonalityText}
                value={personalityText} onChange={(e) => setPersonalityText(e.target.value)}
                placeholder="Anything else about how you think / learn..."
                className="input-skill min-h-[100px] resize-y"
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Who do you want to connect with?</h2>
              <p className="text-sm text-[#CCCCCC] mb-6">We'll suggest matches and squad opportunities.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {CONNECT.map((c) => {
                  const active = connectWith.includes(c);
                  return (
                    <button
                      key={c}
                      data-testid={TID.onbConnectChip(c.toLowerCase().replace(/\W/g, "-"))}
                      onClick={() => toggle(connectWith, setConnectWith, c)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${active ? "bg-[#FFFFFF] text-black border-[#FFFFFF]" : "bg-[#1F1F1F] border-[#2A2A2A] hover:border-[#FFFFFF]/50"}`}
                    >
                      {active && <Check size={12} className="inline mr-1" />}
                      {c}
                    </button>
                  );
                })}
              </div>
              <textarea
                data-testid={TID.onbConnectText}
                value={connectText} onChange={(e) => setConnectText(e.target.value)}
                placeholder="Anyone specific you'd like to learn alongside?"
                className="input-skill min-h-[100px] resize-y"
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold mb-2">All set, {user.name.split(" ")[0]}.</h2>
              <p className="text-sm text-[#CCCCCC] mb-6">We'll generate your personalized {goal?.toUpperCase()} roadmap now.</p>
              <div className="surface-card p-5 border-[#FFFFFF]/30">
                <div className="text-xs mono uppercase tracking-widest text-[#FFFFFF] mb-2">Track</div>
                <div className="text-lg font-semibold mb-3 capitalize">{goal?.replace("_", " ")}</div>
                <div className="text-sm text-[#CCCCCC] mb-3">
                  Personality: <span className="text-white">{personality.join(", ") || "—"}</span>
                </div>
                <div className="text-sm text-[#CCCCCC]">
                  Connect with: <span className="text-white">{connectWith.join(", ") || "—"}</span>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between mt-8">
            <button
              data-testid={TID.onbBackBtn}
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < 3 ? (
              <button
                data-testid={TID.onbNextBtn}
                disabled={(step === 0 && !goal)}
                onClick={() => setStep((s) => s + 1)}
                className="btn-primary disabled:opacity-50"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                data-testid={TID.onbFinishBtn}
                disabled={submitting || !goal}
                onClick={finish}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? "Generating..." : "Generate Roadmap"} <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
