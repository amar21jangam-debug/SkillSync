import { useEffect, useRef, useState } from "react";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { Flame, Star, Zap, ArrowRight, Activity, Trophy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { animateNumber, popIn } from "../lib/gsap-utils";

export default function Dashboard() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [perf, setPerf] = useState(null);
  const xpRef = useRef(null);
  const streakRef = useRef(null);
  const levelRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    api.get("/roadmap").then((r) => setRoadmap(r.data));
    api.get("/performance").then((r) => setPerf(r.data));
  }, []);

  useEffect(() => {
    if (user) {
      if (xpRef.current) animateNumber(xpRef.current, 0, user.xp);
      if (streakRef.current) animateNumber(streakRef.current, 0, user.streak);
      if (levelRef.current) popIn(levelRef.current);
    }
  }, [user]);

  useEffect(() => {
    if (cardsRef.current) {
      const els = cardsRef.current.querySelectorAll("[data-reveal]");
      gsap.fromTo(els, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: "power2.out" });
    }
  }, [roadmap, perf]);

  if (!user) return null;

  return (
    <div ref={cardsRef}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="text-xs mono uppercase tracking-[0.25em] text-[#FFFFFF] mb-2">Dashboard</div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Welcome back, <span className="text-[#FFFFFF]">{user.name.split(" ")[0]}</span>.
          </h1>
          <p className="text-[#CCCCCC] mt-1 text-sm">Here's what's cooking on your <span className="capitalize">{user.goal?.replace("_"," ")}</span> track.</p>
        </div>
        <Link to="/app/practice" className="btn-primary self-start md:self-auto">Solve a problem <ArrowRight size={16} /></Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          data-reveal icon={Flame} label="Streak" valueEl={
            <div className="flex items-baseline gap-1">
              <span ref={streakRef} data-testid={TID.streakValue} className="mono text-3xl font-bold text-[#FFFFFF]">0</span>
              <span className="text-[#CCCCCC] text-sm">days</span>
            </div>
          }
        />
        <div data-reveal className="surface-card p-5">
          <div className="text-xs mono uppercase tracking-widest text-[#888] mb-2">Level</div>
          <div className="flex items-center gap-3">
            <div ref={levelRef} data-testid={TID.levelBadge} className="w-12 h-12 rounded-full bg-[#FFFFFF] text-black mono font-bold flex items-center justify-center pulse-glow">
              {user.level}
            </div>
            <div>
              <div className="text-sm font-medium">{user.level >= 10 ? "Multi-Group + Video" : user.level >= 5 ? "Squad & Connect unlocked" : "Keep climbing"}</div>
              <div className="text-xs text-[#CCCCCC]">{user.level >= 10 ? "L10 reached · harder projects next" : `${200 - (user.xp % 200)} XP to next`}</div>
            </div>
          </div>
        </div>
        <StatCard data-reveal icon={Zap} label="Total XP" valueEl={
          <span ref={xpRef} data-testid={TID.xpValue} className="mono text-3xl font-bold text-white">0</span>
        }/>
        <StatCard data-reveal icon={Trophy} label="Solved" valueEl={
          <span className="mono text-3xl font-bold text-white">{user.completed_problems.length}</span>
        }/>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div data-reveal className="lg:col-span-2 surface-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs mono uppercase tracking-widest text-[#888]">Your Roadmap</div>
              <div className="font-semibold text-lg capitalize">{user.goal?.replace("_"," ")} Track</div>
            </div>
            <Link to="/app/roadmap" className="text-sm text-[#FFFFFF] hover:underline">View full →</Link>
          </div>
          {roadmap ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-[#CCCCCC] mb-1">
                  <span>Overall progress</span><span className="mono">{roadmap.progress}%</span>
                </div>
                <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full progress-fill rounded-full" style={{ width: `${roadmap.progress}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                {roadmap.steps.slice(0, 4).map((s) => (
                  <div key={s.index} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#141414]">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${s.completed ? "bg-[#FFFFFF] text-black" : s.in_progress ? "bg-[#FFFFFF]/20 text-[#FFFFFF] border border-[#FFFFFF]" : "bg-[#2A2A2A] text-[#888]"}`}>
                      {s.completed ? <Check size={14}/> : s.index}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.title}</div>
                      <div className="text-xs text-[#888] truncate">{s.topics.join(" · ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="text-sm text-[#888]">Loading roadmap...</div>}
        </div>

        <div data-reveal className="surface-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-[#FFFFFF]" />
            <div className="font-semibold">Recent Activity</div>
          </div>
          {perf && perf.recent.length ? (
            <div className="space-y-3">
              {perf.recent.slice(0, 6).map((a, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#FFFFFF]" />
                  <div className="flex-1">
                    <div className="text-white">{a.title}</div>
                    <div className="text-xs text-[#888] mono">+{a.xp_earned} XP · {a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="text-sm text-[#888]">No activity yet. Solve your first problem!</div>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, valueEl, ...rest }) {
  return (
    <div {...rest} className="surface-card p-5">
      <div className="flex items-center gap-2 text-xs mono uppercase tracking-widest text-[#888] mb-2">
        <Icon size={14} className="text-[#FFFFFF]" /> {label}
      </div>
      {valueEl}
    </div>
  );
}
