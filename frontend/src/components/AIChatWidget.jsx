import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, Users as TeamIcon, Brain, Map as PlanIcon, Mic } from "lucide-react";
import { tokenStore, API_BASE } from "../lib/api";
import { TID } from "../constants/testIds";
import { useAuth } from "../lib/auth";
import { gsap } from "gsap";

const MODES = [
  { key: "educational", label: "Educational", icon: Brain },
  { key: "planning", label: "Planning", icon: PlanIcon },
  { key: "group_support", label: "Group", icon: TeamIcon },
  { key: "team", label: "Agent Team", icon: Sparkles },
];

export default function AIChatWidget({ initialOpen = false, contextHint = null }) {
  const [open, setOpen] = useState(initialOpen);
  const [mode, setMode] = useState("educational");
  const [messages, setMessages] = useState([
    { role: "assistant", agent: "Educational Agent",
      text: "Hi! I'm your Educational Agent. Ask me anything — concepts, DSA hints, or pick another mode above." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef(null);
  const panelRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(panelRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streaming]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setStreaming(true);
    const assistantIdx = { current: -1 };
    setMessages((m) => {
      assistantIdx.current = m.length;
      return [...m, { role: "assistant", agent: "...", text: "" }];
    });

    try {
      const token = tokenStore.get();
      const resp = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text, agent_mode: mode, context: contextHint || undefined,
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("Chat failed");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let agentLabel = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const evt of events) {
          const lines = evt.split("\n");
          let evtName = "message";
          const dataParts = [];
          for (const line of lines) {
            if (line.startsWith("event:")) evtName = line.slice(6).trim();
            else if (line.startsWith("data:")) dataParts.push(line.slice(5).replace(/^ /, ""));
          }
          const data = dataParts.join("\n");
          if (evtName === "meta") {
            agentLabel = data;
            setMessages((m) => {
              const copy = [...m]; copy[copy.length - 1] = { ...copy[copy.length - 1], agent: agentLabel };
              return copy;
            });
          } else if (evtName === "done") {
            // finished
          } else if (evtName === "error") {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { ...copy[copy.length - 1], text: (copy[copy.length - 1].text || "") + `\n[Error: ${data}]` };
              return copy;
            });
          } else {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { ...copy[copy.length - 1], text: (copy[copy.length - 1].text || "") + data };
              return copy;
            });
          }
        }
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", agent: "System", text: "Sorry, the AI is unavailable right now." }]);
    } finally {
      setStreaming(false);
    }
  };

  const voiceUnlocked = (user?.level || 1) >= 10;

  return (
    <>
      <button
        data-testid={TID.aiFloatBtn}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#FFFFFF] flex items-center justify-center pulse-glow hover:scale-110 transition-transform z-[60]"
        aria-label="Open AI chat"
      >
        {open ? <X size={22} className="text-black" /> : <Bot size={22} className="text-black" />}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-44 right-6 z-[60] w-[92vw] max-w-md h-[70vh] max-h-[640px] bg-[#0A0A0A] border border-[#7DD3FC]/40 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.25)] flex flex-col overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-[#1F1F1F] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] flex items-center justify-center">
                <Sparkles size={16} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-semibold">SkillSync AI</div>
                <div className="text-[10px] mono uppercase tracking-widest text-[#888]">Multi-Agent System</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#888] hover:text-white" aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="px-3 py-2 border-b border-[#1F1F1F] flex gap-1 overflow-x-auto">
            {MODES.map((m) => {
              const Icon = m.icon;
              const active = mode === m.key;
              return (
                <button
                  key={m.key}
                  data-testid={TID.aiModeBtn(m.key)}
                  onClick={() => setMode(m.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all ${active ? "bg-[#7DD3FC] text-black font-semibold" : "text-[#CCC] hover:text-white bg-[#1F1F1F]"}`}
                >
                  <Icon size={13} /> {m.label}
                </button>
              );
            })}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-[#7DD3FC] text-black" : "bg-[#1F1F1F] text-white border border-[#2A2A2A]"}`}>
                  {msg.role === "assistant" && msg.agent && (
                    <div className="text-[10px] mono uppercase tracking-wider text-[#7DD3FC] mb-1">{msg.agent}</div>
                  )}
                  {msg.text || (streaming && i === messages.length - 1 ? "▌" : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[#1F1F1F] flex items-center gap-2">
            <input
              data-testid={TID.aiInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={mode === "team" ? "Ask the Agent Team..." : "Ask the AI tutor..."}
              className="input-skill flex-1"
              disabled={streaming}
            />
            <button
              title={voiceUnlocked ? "Voice (coming soon)" : "Voice AI unlocks at Level 10"}
              disabled={!voiceUnlocked}
              className={`p-2 rounded-md ${voiceUnlocked ? "text-[#7DD3FC] hover:bg-[#1F1F1F]" : "text-[#444]"}`}
            >
              <Mic size={18} />
            </button>
            <button
              data-testid={TID.aiSendBtn}
              onClick={send}
              disabled={streaming || !input.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
