import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Trophy, Clock, Users, Award, Lock, User, Users2 } from "lucide-react";

const STATUS = {
  upcoming: { label: "Upcoming", cls: "bg-[#2A2A2A] text-[#CCCCCC]" },
  live: { label: "Live now", cls: "bg-[#CBFF3D] text-black animate-pulse" },
  ended: { label: "Ended", cls: "bg-[#1F1F1F] text-[#666] border border-[#2A2A2A]" },
};

export default function Contests() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/contests").then((r) => setData(r.data)); }, []);
  if (!data) return <div className="text-[#888] mono">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#CBFF3D] mb-2">Contests</div>
        <h1 className="text-3xl lg:text-4xl tracking-tight">Show up. Race the clock.</h1>
      </div>

      {/* Individual Contests */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-[#CBFF3D]" />
          <h2 className="text-xl">Individual Contests</h2>
          <span className="text-xs mono text-[#888]">· solo events</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {data.individual.map((c) => (
            <ContestCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* Group Contests */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <Users2 size={18} className="text-[#CBFF3D]" />
          <h2 className="text-xl">Group / Squad Contests</h2>
          <span className="text-xs mono text-[#888]">· squads of 2–5</span>
          {data.group_locked && (
            <span className="ml-auto flex items-center gap-1 text-xs text-[#CCCCCC] glass-pill">
              <Lock size={11}/> Unlocks at Level {data.group_unlocks_at}
            </span>
          )}
        </div>

        {data.group_locked ? (
          <div className="surface-card p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full glass-strong flex items-center justify-center mb-4">
              <Lock size={22} className="text-[#CBFF3D]" />
            </div>
            <div className="text-lg mb-2">Group contests unlock at Level 5</div>
            <div className="text-sm text-[#CCCCCC] max-w-md mx-auto">
              You're at Level {data.user_level}. At L5 you can form a squad and join team-based hackathons & sprints.
            </div>
            <div className="w-full max-w-sm mx-auto mt-5">
              <div className="flex justify-between text-xs text-[#CCCCCC] mb-1">
                <span>Progress to L5</span><span className="mono">{Math.min(100, Math.round((data.user_level / 5) * 100))}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full progress-fill rounded-full" style={{ width: `${Math.min(100, Math.round((data.user_level / 5) * 100))}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {data.group.map((c) => <ContestCard key={c.id} c={c} group />)}
          </div>
        )}
      </section>

      {/* Leaderboard */}
      <div className="surface-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Trophy size={18} className="text-[#CBFF3D]" />
          <h2 className="text-xl">Global Leaderboard</h2>
        </div>
        <div className="space-y-2">
          {data.leaderboard.map((u) => (
            <div key={u.rank} className={`flex items-center justify-between px-4 py-3 rounded-lg ${u.rank <= 3 ? "bg-[#CBFF3D]/10 border border-[#CBFF3D]/40" : "bg-white/[0.03]"}`}>
              <div className="flex items-center gap-4">
                <div className={`mono font-bold w-8 text-center ${u.rank === 1 ? "text-[#CBFF3D] text-glow text-lg" : u.rank <= 3 ? "text-[#CBFF3D]" : "text-[#888]"}`}>#{u.rank}</div>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-[#888] mono">Level {u.level}</div>
                </div>
              </div>
              <div className="mono font-semibold text-[#CBFF3D]">{u.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContestCard({ c, group }) {
  const s = STATUS[c.status];
  return (
    <div className="surface-card surface-card-hover p-6">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
        <span className="text-xs mono text-[#888]">{c.starts_in}</span>
      </div>
      <div className="font-semibold text-lg mb-1">{c.title}</div>
      {c.subtitle && <div className="text-xs text-[#CCCCCC] mb-3">{c.subtitle}</div>}
      <div className="grid grid-cols-3 gap-3 text-sm mt-3">
        <div>
          <div className="text-xs text-[#888] mono uppercase tracking-widest">{group ? "Team" : "Duration"}</div>
          <div className="flex items-center gap-1 mt-1">
            {group ? <><Users size={13} className="text-[#CBFF3D]"/> {c.team_size}</>
                   : <><Clock size={13} className="text-[#CBFF3D]"/> {c.duration_min}m</>}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#888] mono uppercase tracking-widest">Players</div>
          <div className="flex items-center gap-1 mt-1"><Users size={13} className="text-[#CBFF3D]"/> {c.participants.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-[#888] mono uppercase tracking-widest">Prize</div>
          <div className="flex items-center gap-1 mt-1 text-[#CBFF3D] text-xs"><Award size={13}/> {c.prize}</div>
        </div>
      </div>
      <button className="btn-primary mt-5 w-full justify-center" disabled={c.status === "ended"}>
        {c.status === "live" ? (group ? "Join with squad" : "Join now") : c.status === "ended" ? "Closed" : (group ? "Register squad" : "Register")}
      </button>
    </div>
  );
}
