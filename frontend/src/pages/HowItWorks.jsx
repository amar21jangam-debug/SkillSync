import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Map, Code2, Users, Brain, Award, Mic, Trophy, Sparkles, Lock, Check, Video, Heart } from "lucide-react";

const STEPS = [
  { n: 1, icon: Map, title: "Pick your aim", desc: "Choose Backend, Frontend, AI/ML, Data, or Fullstack. Personality + connection prefs personalize your path." },
  { n: 2, icon: Sparkles, title: "Get a roadmap", desc: "We generate a vertical, timed roadmap. Tap any step to drill into topics and resources." },
  { n: 3, icon: Code2, title: "Solve problems daily", desc: "Tackle DSA + track problems. Stuck? Hit the AI button for hints + a curated YouTube video." },
  { n: 4, icon: Trophy, title: "Earn XP & level up", desc: "Every solve earns XP. Hit Level 5 to unlock Connect + Squads, Level 10 for multi-group and group video chat. Levels cap at 10 — after that, projects just get harder." },
  { n: 5, icon: Users, title: "Join or create a squad", desc: "At L5, form a project squad of up to 5. Each member owns a niche (frontend / backend / design). At L10, run multiple squads." },
  { n: 6, icon: Brain, title: "Multi-agent AI tutor", desc: "Educational, Planning, and Group Support agents. Switch modes or trigger Agent Team for hard problems." },
  { n: 7, icon: Mic, title: "Unlock video meetings", desc: "At Level 10, start group video sessions in one click — but only if your whole squad is at L10. Lockstep keeps teams moving forward together." },
  { n: 8, icon: Award, title: "Earn certificates", desc: "Finish a group project → get a SkillSync certificate with your verified participation percentage." },
];

const LEVEL_UNLOCKS = [
  { level: 1, label: "Starter", icon: Code2, perks: [
    "Personalized roadmap", "Practice problems with AI hints", "YouTube video suggestions", "Daily streak tracking",
  ]},
  { level: 5, label: "Connect & Squad", icon: Heart, perks: [
    "Send connection requests + AI random match", "Create a project group (max 5 members)", "Each member owns a niche (frontend / backend / design)", "Shared chat, tasks, certificate at 100%",
  ]},
  { level: 10, label: "Multi-Group + Video", icon: Video, perks: [
    "Join or lead multiple groups at once", "Group video chat / meeting room (Google Meet)", "Advanced Agent Team mode for hard problems", "Architect Certificate eligibility",
  ]},
  { level: 11, label: "Beyond — Harder Projects", icon: Award, perks: [
    "Level cap is 10 — past it you stay at L10", "But projects get progressively harder", "Tougher contests + senior mentor pairings", "Lockstep: your group only unlocks features you ALL share",
  ]},
];

export default function HowItWorks() {
  const ref = useRef(null);
  const lvlRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll("[data-step]");
    gsap.fromTo(els, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: "power2.out" });
  }, []);
  useEffect(() => {
    if (!lvlRef.current) return;
    const els = lvlRef.current.querySelectorAll("[data-lvl]");
    gsap.fromTo(els, { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" });
  }, []);

  return (
    <div ref={ref}>
      <div className="mb-10">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#CBFF3D] mb-2">How It Works</div>
        <h1 className="text-4xl lg:text-5xl tracking-tight">From "I should learn this" to <em className="text-[#CBFF3D] italic">shipped projects</em>.</h1>
        <p className="text-[#CCCCCC] mt-3 max-w-2xl">SkillSync combines personalized roadmaps, gamified levels, small project squads, and a multi-agent AI tutor — so you actually finish what you start.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.n} data-step className="surface-card p-6 flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#CBFF3D]/15 text-[#CBFF3D] border border-[#CBFF3D]/30 flex items-center justify-center">
                <Icon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-[10px] mono uppercase tracking-widest text-[#CBFF3D]">Step {s.n}</div>
                </div>
                <div className="font-semibold text-lg mb-1">{s.title}</div>
                <div className="text-sm text-[#CCCCCC]">{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-12">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#CBFF3D] mb-2">Levels & Unlocks</div>
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-2">What you unlock as you level up</h2>
        <p className="text-[#CCCCCC] mb-6 max-w-2xl text-sm">Every level rewards consistency. Bigger levels open bigger toys — social, voice AI, group projects, and certificates.</p>

        <div ref={lvlRef} className="relative">
          <div className="absolute left-6 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/40 to-transparent" />
          <div className="space-y-5">
            {LEVEL_UNLOCKS.map((l) => {
              const Icon = l.icon;
              return (
                <div key={l.level} data-lvl className="relative pl-16">
                  <div className="absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mono glass-strong border-white/30">
                    {l.level === 11 ? "10+" : `L${l.level}`}
                  </div>
                  <div className="surface-card p-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <div className="w-8 h-8 rounded-lg glass border-white/20 flex items-center justify-center">
                        <Icon size={16}/>
                      </div>
                      <div className="font-semibold text-lg">{l.level === 11 ? "L10+" : `Level ${l.level}`} · {l.label}</div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {l.perks.map((p) => (
                        <div key={p} className="flex items-start gap-2 text-sm text-[#CCCCCC]">
                          <Check size={14} className="text-[#CBFF3D] shrink-0 mt-0.5" /> {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="surface-card p-8 text-center">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#CBFF3D] mb-2">Multi-Agent AI</div>
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3">Three agents. One team.</h2>
        <p className="text-[#CCCCCC] max-w-2xl mx-auto mb-6">
          The Planning Agent designs strategy, the Educational Agent teaches concepts and gives hints, and the Group Support Agent coordinates squad work. Activate Agent Team mode to get a combined response.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#2A2A2A]">
            <div className="font-semibold text-[#CBFF3D]">Planning</div>
            <div className="text-xs text-[#CCCCCC] mt-1">Milestones & weekly goals</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#2A2A2A]">
            <div className="font-semibold text-[#CBFF3D]">Educational</div>
            <div className="text-xs text-[#CCCCCC] mt-1">Concepts, hints, examples</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#2A2A2A]">
            <div className="font-semibold text-[#CBFF3D]">Group Support</div>
            <div className="text-xs text-[#CCCCCC] mt-1">Owners, blockers, follow-ups</div>
          </div>
        </div>
      </div>
    </div>
  );
}
