import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, Brain, Code2, Trophy, Users, Sparkles, Flame } from "lucide-react";
import { useAuth } from "../lib/auth";
import { TID } from "../constants/testIds";

const FEATURES = [
  { icon: Code2, title: "Personalized Roadmaps", desc: "AI-crafted path from your goal: Backend, Frontend, AI/ML, Data, Fullstack." },
  { icon: Brain, title: "Multi-Agent Tutor", desc: "Educational, Planning & Group Support agents work in a coordinated Team mode." },
  { icon: Trophy, title: "Levels & Streaks", desc: "Solve problems → earn XP → level up. Unlock social at Level 5, Voice AI at Level 15." },
  { icon: Users, title: "Small Project Teams", desc: "Squads of 5 ship real projects. Get certificates with your participation %." },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, delay: 0.5, duration: 0.6 });
      gsap.from(".feature-card", {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.3, ease: "power2.out",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6200] flex items-center justify-center glow-orange">
              <Sparkles size={16} className="text-black" />
            </div>
            <div className="font-bold tracking-tight">SkillSync</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              data-testid={TID.landingLoginBtn}
              onClick={() => navigate("/login")}
              className="text-sm text-[#CCCCCC] hover:text-white px-3 py-2"
            >
              Sign in
            </button>
            <button
              data-testid={TID.landingGetStartedBtn}
              onClick={() => navigate(user ? "/app" : "/register")}
              className="btn-primary text-sm"
            >
              Get started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="grain" />
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="hero-line inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#FF6200]/30 text-xs mono uppercase tracking-[0.2em] text-[#FF6200] mb-6">
              <Flame size={12} /> Cyber Lab for Devs
            </div>
            <h1 className="hero-line text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              Level up your <span className="text-[#FF6200] text-glow-orange">tech skills</span>,
              <br /> one streak at a time.
            </h1>
            <p className="hero-line text-base sm:text-lg text-[#CCCCCC] leading-relaxed max-w-xl mb-8">
              Personalized roadmaps, a multi-agent AI tutor, small project squads, and a gamified
              levels system that unlocks social, voice AI, and certificates as you grow.
            </p>
            <div className="hero-cta flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(user ? "/app" : "/register")}
                className="btn-primary text-base px-7 py-3.5"
              >
                Start your roadmap <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-secondary text-base px-7 py-3.5"
              >
                I already have an account
              </button>
            </div>
            <div className="hero-line mt-10 flex items-center gap-6 text-xs mono text-[#888] uppercase tracking-widest">
              <div>4,000+ learners</div>
              <div className="w-1 h-1 rounded-full bg-[#FF6200]" />
              <div>120+ problems</div>
              <div className="w-1 h-1 rounded-full bg-[#FF6200]" />
              <div>Multi-agent AI</div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="surface-card p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FF6200]/20 blur-3xl" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#FF6200] flex items-center justify-center pulse-glow">
                  <span className="mono font-bold text-black">12</span>
                </div>
                <div>
                  <div className="text-xs mono uppercase tracking-widest text-[#888]">Your Level</div>
                  <div className="font-semibold">Backend Engineer Track</div>
                </div>
              </div>
              <div className="space-y-3">
                {[{n:"DSA Fundamentals", p:100},{n:"Databases (DBMS)", p:74},{n:"Node & Express", p:42},{n:"System Design", p:10}].map((s) => (
                  <div key={s.n}>
                    <div className="flex justify-between text-xs text-[#CCCCCC] mb-1">
                      <span>{s.n}</span><span className="mono">{s.p}%</span>
                    </div>
                    <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                      <div className="h-full progress-fill rounded-full" style={{ width: `${s.p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-[#2A2A2A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#FF6200]"><Flame size={14} /> 18 day streak</div>
                <div className="mono text-[#CCCCCC]">2,480 XP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="mb-12">
          <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-3">Features</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            Everything you need to actually <span className="text-[#FF6200]">finish</span> what you start.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="feature-card surface-card surface-card-hover p-6">
                <div className="w-10 h-10 rounded-lg bg-[#FF6200]/15 text-[#FF6200] flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <div className="font-semibold mb-2">{f.title}</div>
                <div className="text-sm text-[#CCCCCC]">{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-[#1F1F1F] py-8 text-center text-xs mono text-[#666]">
        © 2026 SkillSync — Built for builders
      </footer>
    </div>
  );
}
