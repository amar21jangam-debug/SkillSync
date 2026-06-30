import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { TID } from "../constants/testIds";
import {
  ArrowLeft, Video, Check, Circle, Send, Sparkles, Users, Award, Bot,
} from "lucide-react";
import AIChatWidget from "../components/AIChatWidget";

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [g, setG] = useState(null);
  const [msg, setMsg] = useState("");
  const [showAI, setShowAI] = useState(false);
  const chatRef = useRef(null);

  const load = () => api.get(`/groups/${id}`).then((r) => setG(r.data));
  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [g?.chat?.length]);

  if (!g) return <div className="text-[#888] mono">Loading group...</div>;

  const send = async () => {
    const t = msg.trim();
    if (!t) return;
    setMsg("");
    await api.post("/groups/chat", { group_id: g.id, message: t });
    load();
  };

  const completion = g.tasks.filter((t) => t.done).length / g.tasks.length;
  const certificateReady = completion === 1;

  return (
    <div>
      <button onClick={() => navigate("/app/groups")} className="text-sm text-[#CCCCCC] hover:text-[#FF6200] mb-6 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Back to groups
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <div className="text-xs mono uppercase tracking-widest text-[#FF6200]">Group</div>
                <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">{g.name}</h1>
                <div className="text-sm text-[#CCCCCC] mt-1">Project: <span className="text-white">{g.project}</span></div>
              </div>
              <a
                href="https://meet.new"
                target="_blank" rel="noreferrer"
                data-testid={TID.startMeetBtn}
                className="btn-primary"
              >
                <Video size={16} /> Start Google Meet
              </a>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#CCCCCC] mb-1">
                <span>Project progress</span><span className="mono">{g.progress}%</span>
              </div>
              <div className="h-2.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div className="h-full progress-fill rounded-full" style={{ width: `${g.progress}%` }} />
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Tasks</div>
              <div className="text-xs mono text-[#888]">{g.tasks.filter(t=>t.done).length}/{g.tasks.length} done</div>
            </div>
            <div className="space-y-2">
              {g.tasks.map((t) => (
                <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg ${t.done ? "bg-[#FF6200]/10 border border-[#FF6200]/30" : "bg-[#141414]"}`}>
                  {t.done ? <Check size={16} className="text-[#FF6200]" /> : <Circle size={16} className="text-[#888]" />}
                  <div className="flex-1">
                    <div className={`text-sm ${t.done ? "line-through text-[#888]" : "text-white"}`}>{t.title}</div>
                    <div className="text-xs text-[#888]">Owner: {t.assigned}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Group Chat</div>
              <button
                onClick={() => setShowAI((v) => !v)}
                className="text-xs flex items-center gap-1 text-[#FF6200] hover:underline"
              >
                <Bot size={14}/> {showAI ? "Hide AI" : "Open AI assistant"}
              </button>
            </div>
            <div ref={chatRef} className="space-y-3 max-h-72 overflow-y-auto pr-2 mb-4">
              {g.chat.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FF6200]/20 text-[#FF6200] flex items-center justify-center text-xs mono">
                    {m.from.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs mono text-[#888]">{m.from} · {m.time}</div>
                    <div className="text-sm text-white">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                data-testid={TID.groupChatInput}
                value={msg} onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Send a message to the group..."
                className="input-skill flex-1"
              />
              <button data-testid={TID.groupChatSendBtn} onClick={send} className="btn-primary">
                <Send size={14}/>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-[#FF6200]" /> <div className="font-semibold">Members</div>
            </div>
            <div className="space-y-3">
              {g.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full" />
                  <div className="text-sm">{m.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`surface-card p-6 ${certificateReady ? "border-[#FF6200]/60 shadow-[0_0_20px_rgba(255,98,0,0.2)]" : ""}`}>
            <div className="flex items-center gap-2 mb-3">
              <Award size={16} className="text-[#FF6200]" /> <div className="font-semibold">Certificate</div>
            </div>
            {certificateReady ? (
              <>
                <div className="text-sm text-[#CCCCCC] mb-3">All tasks done — your certificate is ready.</div>
                <div className="bg-[#0A0A0A] border border-[#FF6200]/40 rounded-xl p-5 text-center">
                  <div className="text-xs mono uppercase tracking-widest text-[#FF6200] mb-1">SkillSync · Certificate</div>
                  <div className="font-semibold text-lg">{user?.name}</div>
                  <div className="text-xs text-[#CCCCCC] mt-1">Participation: 100%</div>
                  <div className="text-xs text-[#CCCCCC]">Project: {g.project}</div>
                </div>
              </>
            ) : (
              <div className="text-sm text-[#888]">Certificate unlocks when all tasks are complete ({Math.round(completion * 100)}% done).</div>
            )}
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-[#FF6200]" /> <div className="font-semibold">AI Coordination</div>
            </div>
            <div className="text-sm text-[#CCCCCC] mb-4">
              Use the Agent Team mode in the chat for help breaking down tasks, unblocking members, and planning.
            </div>
            <button onClick={() => setShowAI(true)} className="btn-secondary w-full justify-center">
              <Bot size={14}/> Open Agent Team
            </button>
          </div>
        </div>
      </div>

      {showAI && <AIChatWidget initialOpen contextHint={`Group: ${g.name}\nProject: ${g.project}\nTasks: ${g.tasks.map(t => `${t.title} (${t.done ? "done" : "todo"}, owner ${t.assigned})`).join("; ")}`} />}
    </div>
  );
}
