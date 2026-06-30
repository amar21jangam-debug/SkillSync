import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { TID } from "../constants/testIds";
import { Lock, Sparkles, UserPlus, Check, Heart } from "lucide-react";
import { toast } from "sonner";

export default function Connect() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [match, setMatch] = useState(null);
  const [matching, setMatching] = useState(false);

  useEffect(() => { api.get("/connect/users").then((r) => setData(r.data)); }, []);

  if (!user) return null;
  if (data?.locked) {
    const lvl = data.current_level || user.level;
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center mb-6">
          <Lock size={28} className="text-white" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-2">Connect & Squad unlocks at Level 5</h1>
        <p className="text-[#CCCCCC] max-w-md mb-6">
          You're at Level {lvl}. Solve more problems to level up — at L5 you can connect with peers, create a project group (max 5 members), and each member owns a niche (frontend / backend / design / etc).
        </p>
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs text-[#CCCCCC] mb-1">
            <span>Progress to Level 5</span><span className="mono">{Math.min(100, Math.round((lvl / 5) * 100))}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full progress-fill rounded-full" style={{ width: `${Math.min(100, Math.round((lvl / 5) * 100))}%` }} />
          </div>
        </div>
      </div>
    );
  }
  if (!data) return <div className="text-[#888] mono">Loading...</div>;

  const aiMatch = async () => {
    setMatching(true);
    try {
      const { data } = await api.post("/connect/match", {});
      setMatch(data);
    } finally { setMatching(false); }
  };

  const sendRequest = async (id) => {
    await api.post("/connect/request", { to_user_id: id });
    toast.success("Connection request sent");
    const fresh = await api.get("/connect/users");
    setData(fresh.data);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="text-xs mono uppercase tracking-[0.25em] text-[#FFFFFF] mb-2">Connect</div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Your people, your pace.</h1>
        </div>
        <button data-testid={TID.aiMatchBtn} onClick={aiMatch} disabled={matching} className="btn-primary self-start md:self-auto">
          <Sparkles size={16} /> {matching ? "Matching..." : "AI Random Match"}
        </button>
      </div>

      {match && (
        <div className="surface-card border-[#FFFFFF]/40 p-6 mb-8 flex flex-col sm:flex-row items-start gap-4">
          <img src={match.match.avatar} alt={match.match.name} className="w-16 h-16 rounded-full border-2 border-[#FFFFFF]" />
          <div className="flex-1">
            <div className="text-xs mono uppercase tracking-widest text-[#FFFFFF] mb-1">AI-matched for you</div>
            <div className="font-semibold text-lg">{match.match.name}</div>
            <div className="text-sm text-[#CCCCCC]">{match.match.bio}</div>
            <div className="text-xs text-[#888] mt-2 italic">{match.reason}</div>
          </div>
          <button onClick={() => sendRequest(match.match.id)} className="btn-secondary text-sm">
            <Heart size={14}/> Connect
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.users.map((u) => (
          <div key={u.id} data-testid={TID.connectCard(u.id)} className="surface-card surface-card-hover overflow-hidden">
            <div className="h-20 bg-gradient-to-br from-[#FFFFFF]/30 to-[#1F1F1F]" />
            <div className="px-5 pb-5 -mt-10">
              <img src={u.avatar} alt={u.name} className="w-16 h-16 rounded-full border-4 border-[#0A0A0A]" />
              <div className="mt-3">
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-[#888] capitalize">{u.goal.replace("_", " ")} · Level {u.level}</div>
              </div>
              <div className="text-sm text-[#CCCCCC] mt-2 line-clamp-2">{u.bio}</div>
              <div className="flex flex-wrap gap-1 mt-3">
                {u.tags.map((t) => (
                  <span key={t} className="text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2A2A2A] text-[#CCCCCC]">{t}</span>
                ))}
              </div>
              <button
                data-testid={TID.connectRequestBtn(u.id)}
                onClick={() => sendRequest(u.id)}
                disabled={u.request_sent}
                className={`mt-4 w-full justify-center ${u.request_sent ? "btn-secondary" : "btn-primary"}`}
              >
                {u.request_sent ? (<><Check size={14}/> Request sent</>) : (<><UserPlus size={14}/> Send request</>)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
