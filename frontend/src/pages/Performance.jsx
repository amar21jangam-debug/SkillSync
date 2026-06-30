import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Flame, Zap, Trophy, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function Performance() {
  const [perf, setPerf] = useState(null);

  useEffect(() => { api.get("/performance").then((r) => setPerf(r.data)); }, []);

  if (!perf) return <div className="text-[#888] mono">Loading performance...</div>;

  // Streak calendar: last 35 days from chart + extended
  const today = new Date();
  const calendar = [];
  const solvedByDate = Object.fromEntries(perf.chart.map((d) => [d.date, d.solved]));
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    calendar.push({ date: iso, solved: solvedByDate[iso] || 0 });
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#7DD3FC] mb-2">My Performance</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Where the grind shows up.</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Streak" value={perf.streak} unit="days" icon={Flame} />
        <Stat label="Total XP" value={perf.total_xp} icon={Zap} />
        <Stat label="Solved" value={perf.total_solved} icon={Trophy} />
        <Stat label="Level" value={perf.level} icon={Target} />
      </div>

      <div className="surface-card p-6 mb-6">
        <div className="text-xs mono uppercase tracking-widest text-[#888] mb-4">Last 14 days</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perf.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 10, fontFamily: "JetBrains Mono" }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "JetBrains Mono" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#1F1F1F", border: "1px solid #2A2A2A", borderRadius: 8, color: "#fff", fontFamily: "JetBrains Mono", fontSize: 12 }}
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
              />
              <Bar dataKey="solved" fill="#FFFFFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-card p-6">
          <div className="text-xs mono uppercase tracking-widest text-[#888] mb-4">Streak Calendar · last 35 days</div>
          <div className="grid grid-cols-7 sm:grid-cols-12 gap-1.5">
            {calendar.map((d) => {
              const intensity = Math.min(4, d.solved);
              const bg = ["#1F1F1F", "rgba(255,255,255,0.35)", "rgba(255,255,255,0.55)", "rgba(255,255,255,0.75)", "#FFFFFF"][intensity];
              return (
                <div key={d.date} title={`${d.date}: ${d.solved} solved`}
                  className="aspect-square rounded-[4px] border border-[#2A2A2A] hover:border-[#FFFFFF] transition-colors"
                  style={{ background: bg }}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-[#888]">
            Less
            {["#1F1F1F","rgba(255,255,255,0.35)","rgba(255,255,255,0.55)","rgba(255,255,255,0.75)","#FFFFFF"].map((c, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-[3px]" style={{ background: c, border: "1px solid #2A2A2A" }} />
            ))}
            More
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="text-xs mono uppercase tracking-widest text-[#888] mb-4">Recent solves</div>
          {perf.recent.length === 0 && <div className="text-sm text-[#888]">Nothing yet — go solve one!</div>}
          <div className="space-y-3">
            {perf.recent.map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#FFFFFF]" />
                <div className="flex-1">
                  <div className="text-white">{a.title}</div>
                  <div className="text-xs text-[#888] mono">+{a.xp_earned} XP · {a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, unit }) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-2 text-xs mono uppercase tracking-widest text-[#888] mb-2">
        <Icon size={14} className="text-[#7DD3FC]" /> {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="mono text-3xl font-bold text-white">{value}</span>
        {unit && <span className="text-[#CCCCCC] text-sm">{unit}</span>}
      </div>
    </div>
  );
}
