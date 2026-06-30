import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Trophy, Clock, Users, Award } from "lucide-react";

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
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Show up. Race the clock.</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {data.contests.map((c) => {
          const s = STATUS[c.status];
          return (
            <div key={c.id} className="surface-card surface-card-hover p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                <span className="text-xs mono text-[#888]">{c.starts_in}</span>
              </div>
              <div className="font-semibold text-lg mb-4">{c.title}</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-[#888] mono uppercase tracking-widest">Duration</div>
                  <div className="flex items-center gap-1 mt-1"><Clock size={13} className="text-[#CBFF3D]"/> {c.duration_min}m</div>
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
                {c.status === "live" ? "Join now" : c.status === "ended" ? "Closed" : "Register"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="surface-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Trophy size={18} className="text-[#CBFF3D]" />
          <div className="font-semibold">Global Leaderboard</div>
        </div>
        <div className="space-y-2">
          {data.leaderboard.map((u) => (
            <div key={u.rank} className={`flex items-center justify-between px-4 py-3 rounded-lg ${u.rank <= 3 ? "bg-[#FFFFFF]/10 border border-[#CBFF3D]/40" : "bg-[#141414]"}`}>
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
