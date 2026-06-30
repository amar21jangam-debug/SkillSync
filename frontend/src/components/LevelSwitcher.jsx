import { useState, useRef, useEffect } from "react";
import { Sparkles, Zap, ChevronDown, Check } from "lucide-react";
import { gsap } from "gsap";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { TID } from "../constants/testIds";

const LEVELS = [1, 3, 5, 7, 10];

export default function LevelSwitcher() {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (open && menuRef.current) {
      gsap.fromTo(menuRef.current,
        { y: -6, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" });
    }
  }, [open]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = async (lvl) => {
    if (!user || busy) return;
    setBusy(true);
    try {
      const { data } = await api.post("/dev/set-level", { level: lvl });
      setUser(data);
      setOpen(false);
    } finally { setBusy(false); }
  };

  if (!user) return null;

  return (
    <div ref={wrapRef} className="relative px-4 pb-3">
      <button
        data-testid={TID.levelSwitcherBtn}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#141414] border border-[#FFFFFF]/30 hover:border-[#FFFFFF] hover:bg-[#1A1A1A] transition-all text-xs"
        title="Demo: switch your level"
      >
        <div className="flex items-center gap-2 text-[#FFFFFF]">
          <Sparkles size={13} />
          <span className="mono uppercase tracking-widest">Demo Mode</span>
        </div>
        <ChevronDown size={13} className={`text-[#888] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-4 right-4 mt-2 z-50 bg-[#0A0A0A] border border-[#FFFFFF]/40 rounded-lg shadow-[0_0_28px_rgba(255,255,255,0.25)] overflow-hidden"
        >
          <div className="px-3 py-2 text-[10px] mono uppercase tracking-widest text-[#888] border-b border-[#1F1F1F]">
            Jump to level
          </div>
          {LEVELS.map((lvl) => {
            const active = user.level === lvl;
            const unlocks = lvl >= 10 ? "Multi-Group + Video" : lvl >= 5 ? "Connect + Squad" : "Basics";
            return (
              <button
                key={lvl}
                data-testid={TID.levelOption(lvl)}
                onClick={() => pick(lvl)}
                disabled={busy}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#1F1F1F] transition-colors ${active ? "bg-[#FFFFFF]/15" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`mono font-bold ${active ? "text-[#FFFFFF]" : "text-white"}`}>L{lvl}</span>
                  <span className="text-[#888]">{unlocks}</span>
                </div>
                {active && <Check size={12} className="text-[#FFFFFF]" />}
              </button>
            );
          })}
          <div className="px-3 py-2 text-[10px] text-[#666] border-t border-[#1F1F1F] flex items-center gap-1">
            <Zap size={10} className="text-[#FFFFFF]" /> For demos & presentations
          </div>
        </div>
      )}
    </div>
  );
}
