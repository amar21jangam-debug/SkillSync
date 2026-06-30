import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { useAuth } from "../lib/auth";
import { Send, Lock, User2, Search } from "lucide-react";
import ProfileDrawer from "../components/ProfileDrawer";
import { gsap } from "gsap";

export default function Messages() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState(params.get("c") || null);
  const [thread, setThread] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [filter, setFilter] = useState("");
  const scrollRef = useRef(null);
  const threadRef = useRef(null);

  const loadConnections = async () => {
    const { data } = await api.get("/connections");
    setData(data);
    if (!data.locked && !activeId && data.connections.length) {
      setActiveId(data.connections[0].id);
    }
  };
  useEffect(() => { loadConnections(); /* eslint-disable-next-line */ }, []);

  const loadThread = async (id) => {
    const { data } = await api.get(`/messages/${id}`);
    setThread(data);
  };
  useEffect(() => {
    if (activeId) { loadThread(activeId); setParams({ c: activeId }, { replace: true }); }
    // eslint-disable-next-line
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    if (threadRef.current) {
      gsap.fromTo(threadRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    }
  }, [thread]);

  if (!data) return <div className="text-[#888] mono">Loading…</div>;

  if (data.locked) {
    const lvl = data.current_level || user?.level || 1;
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center mb-6">
          <Lock size={28} className="text-[#CBFF3D]" />
        </div>
        <h1 className="text-3xl lg:text-4xl tracking-tight mb-2">Messages unlock at Level 5</h1>
        <p className="text-[#CCCCCC] max-w-md mb-6">
          You're at Level {lvl}. Once you reach L5 you can chat 1:1 with your connections.
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

  const list = data.connections.filter(
    (c) => !filter || c.name.toLowerCase().includes(filter.toLowerCase())
  );

  const send = async () => {
    const t = draft.trim();
    if (!t || !activeId || sending) return;
    setSending(true);
    setDraft("");
    try {
      await api.post(`/messages/${activeId}`, { text: t });
      await loadThread(activeId);
      await loadConnections();
    } finally { setSending(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#CBFF3D] mb-2">Messages</div>
        <h1 className="text-3xl lg:text-4xl tracking-tight">Your conversations.</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 h-[calc(100vh-260px)] min-h-[520px]">
        {/* Connection list */}
        <aside className="lg:col-span-4 surface-card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/8 flex items-center gap-2">
            <Search size={14} className="text-[#888]" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search connections"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-[#666]"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {list.map((c) => {
              const active = activeId === c.id;
              return (
                <button
                  key={c.id}
                  data-testid={TID.messageContact(c.id)}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-white/5 transition-colors ${active ? "bg-[#CBFF3D]/8" : "hover:bg-white/[0.04]"}`}
                >
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-[10px] mono text-[#888] shrink-0">L{c.level}</div>
                    </div>
                    <div className="text-xs text-[#888] truncate">{c.from_me ? "You: " : ""}{c.last_message}</div>
                  </div>
                </button>
              );
            })}
            {list.length === 0 && (
              <div className="p-6 text-sm text-[#888] text-center">No connections match.</div>
            )}
          </div>
        </aside>

        {/* Chat panel */}
        <section className="lg:col-span-8 surface-card overflow-hidden flex flex-col">
          {!thread ? (
            <div className="flex-1 flex items-center justify-center text-[#888] text-sm">Pick a conversation</div>
          ) : (
            <>
              {/* header */}
              <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between gap-3">
                <button
                  data-testid={TID.profileOpenBtn(thread.contact.id)}
                  onClick={() => setProfileId(thread.contact.id)}
                  className="flex items-center gap-3 group"
                >
                  <img src={thread.contact.avatar} alt={thread.contact.name} className="w-10 h-10 rounded-full" />
                  <div className="text-left">
                    <div className="text-sm font-medium group-hover:text-[#CBFF3D] transition-colors">{thread.contact.name}</div>
                    <div className="text-xs text-[#888]">View profile · L{thread.contact.level}</div>
                  </div>
                </button>
                <span className="glass-pill"><User2 size={11}/> Online</span>
              </div>

              {/* messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3" key={activeId}>
                <div ref={threadRef}>
                  {thread.messages.length === 0 && (
                    <div className="text-center text-sm text-[#888] py-12">No messages yet — say hi 👋</div>
                  )}
                  {thread.messages.map((m, i) => {
                    const mine = m.from_id === thread.me;
                    return (
                      <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"} mb-3`}>
                        <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${mine ? "bg-[#CBFF3D] text-black" : "bg-white/8 text-white border border-white/10"}`}>
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* input */}
              <div className="p-3 border-t border-white/8 flex items-center gap-2">
                <input
                  data-testid={TID.messageInput}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={`Message ${thread.contact.name.split(" ")[0]}…`}
                  className="input-skill flex-1"
                  disabled={sending}
                />
                <button
                  data-testid={TID.messageSendBtn}
                  onClick={send}
                  disabled={sending || !draft.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  <Send size={15}/>
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {profileId && <ProfileDrawer personId={profileId} onClose={() => setProfileId(null)} />}
    </div>
  );
}
