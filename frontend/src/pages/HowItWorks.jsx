import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Map, Code2, Users, Brain, Award, Mic, Trophy, Sparkles, Lock, Check, Video, Heart } from "lucide-react";

const STEPS = [
  { n: 1, icon: Map, title: "Pick your aim", desc: "Choose Backend, Frontend, AI/ML, Data, or Fullstack. Personality + connection prefs personalize your path." },
  { n: 2, icon: Sparkles, title: "Get a roadmap", desc: "We generate a vertical, timed roadmap. Tap any step to drill into topics and resources." },
  { n: 3, icon: Code2, title: "Solve problems daily", desc: "Tackle DSA + track problems. Stuck? Hit the orange button for AI hints + a curated YouTube video." },
  { n: 4, icon: Trophy, title: "Earn XP & level up", desc: "Every solve earns XP. Hit Level 5 to unlock Connect, Level 15+ to unlock voice AI and meets." },
  { n: 5, icon: Users, title: "Join a squad", desc: "Small project teams of 5. Real projects, real coordination — the Agent Team helps you ship." },
  { n: 6, icon: Brain, title: "Multi-agent AI tutor", desc: "Educational, Planning, and Group Support agents. Switch modes or trigger Agent Team for hard problems." },
  { n: 7, icon: Mic, title: "Unlock voice + Meet", desc: "At higher levels, switch to voice AI and start group video sessions in one click." },
  { n: 8, icon: Award, title: "Earn certificates", desc: "Finish a group project → get a SkillSync certificate with your verified participation percentage." },
];

const LEVEL_UNLOCKS = [
  { level: 1, label: "Starter", color: "bg-[#2A2A2A]", icon: Code2, perks: [
    "Personalized roadmap", "Practice problems with AI hints", "YouTube video suggestions", "Daily streak tracking",
  ]},
  { level: 5, label: "Connect Unlocked", color: "bg-[#FF6200]/30", icon: Heart, perks: [
    "Social profiles & feed", "Send connection requests", "AI-based random matching", "Discover study partners",
  ]},
  { level: 10, label: "Squad Leader", color: "bg-[#FF6200]/55", icon: Users, perks: [
    "Create your own group project", "Lead a squad of up to 5", "Assign tasks to teammates", "Group certificates with participation %",
  ]},
  { level: 15, label: "Voice AI Adept", color: "bg-[#FF6200]/80", icon: Mic, perks: [
    "Voice AI conversations with tutor", "Start Google Meet from any group", "Advanced Agent Team mode", "Real-time coordination with AI",
  ]},
  { level: 20, label: "Architect", color: "bg-[#FF6200]", icon: Award, perks: [
    "Mentor track eligibility", "Featured on leaderboard", "Architect Certificate", "Priority contest entries",
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
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-2">How It Works</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">From "I should learn this" to <span className="text-[#FF6200]">shipped projects</span>.</h1>
        <p className="text-[#CCCCCC] mt-3 max-w-2xl">SkillSync combines personalized roadmaps, gamified levels, small project squads, and a multi-agent AI tutor — so you actually finish what you start.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.n} data-step className="surface-card p-6 flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#FF6200]/15 text-[#FF6200] border border-[#FF6200]/30 flex items-center justify-center">
                <Icon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-[10px] mono uppercase tracking-widest text-[#FF6200]">Step {s.n}</div>
                </div>
                <div className="font-semibold text-lg mb-1">{s.title}</div>
                <div className="text-sm text-[#CCCCCC]">{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-12">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-2">Levels & Unlocks</div>
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-2">What you unlock as you level up</h2>
        <p className="text-[#CCCCCC] mb-6 max-w-2xl text-sm">Every level rewards consistency. Bigger levels open bigger toys — social, voice AI, group projects, and certificates.</p>

        <div ref={lvlRef} className="relative">
          <div className="absolute left-6 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#FF6200] via-[#FF6200]/40 to-transparent" />
          <div className="space-y-5">
            {LEVEL_UNLOCKS.map((l) => {
              const Icon = l.icon;
              return (
                <div key={l.level} data-lvl className="relative pl-16">
                  <div className={`absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold mono border-2 border-[#0A0A0A] ${l.color}`}>
                    L{l.level}
                  </div>
                  <div className="surface-card p-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6200]/15 text-[#FF6200] flex items-center justify-center">
                        <Icon size={16}/>
                      </div>
                      <div className="font-semibold text-lg">Level {l.level} · {l.label}</div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {l.perks.map((p) => (
                        <div key={p} className="flex items-start gap-2 text-sm text-[#CCCCCC]">
                          <Check size={14} className="text-[#FF6200] shrink-0 mt-0.5" /> {p}
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
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-2">Multi-Agent AI</div>
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3">Three agents. One team.</h2>
        <p className="text-[#CCCCCC] max-w-2xl mx-auto mb-6">
          The Planning Agent designs strategy, the Educational Agent teaches concepts and gives hints, and the Group Support Agent coordinates squad work. Activate Agent Team mode to get a combined response.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#2A2A2A]">
            <div className="font-semibold text-[#FF6200]">Planning</div>
            <div className="text-xs text-[#CCCCCC] mt-1">Milestones & weekly goals</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#2A2A2A]">
            <div className="font-semibold text-[#FF6200]">Educational</div>
            <div className="text-xs text-[#CCCCCC] mt-1">Concepts, hints, examples</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#2A2A2A]">
            <div className="font-semibold text-[#FF6200]">Group Support</div>
            <div className="text-xs text-[#CCCCCC] mt-1">Owners, blockers, follow-ups</div>
          </div>
        </div>
      </div>
    </div>
  );
}
