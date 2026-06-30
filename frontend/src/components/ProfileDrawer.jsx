import { useEffect, useRef, useState } from "react";
import { X, Users, Heart, GraduationCap, Award, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";

export default function ProfileDrawer({ personId, onClose }) {
  const [data, setData] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!personId) return;
    setData(null);
    api.get(`/profile/${personId}`).then((r) => setData(r.data)).catch(() => setData({ error: true }));
  }, [personId]);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(panelRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.32, ease: "power2.out" });
    }
  }, [data]);

  if (!personId) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div
        ref={panelRef}
        data-testid={TID.profileDrawer}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full max-w-md bg-[#0A0A0B] border-l border-white/10 overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888] hover:text-white z-10">
          <X size={18}/>
        </button>

        {!data && <div className="p-8 text-[#888] mono text-sm">Loading profile…</div>}
        {data?.error && <div className="p-8 text-[#888] mono text-sm">Profile not found.</div>}

        {data && !data.error && (
          <>
            <div className="relative h-32 bg-gradient-to-br from-[#CBFF3D]/30 to-[#1F1F1F]" />
            <div className="px-6 -mt-12 pb-6">
              <img src={data.avatar} alt={data.name} className="w-24 h-24 rounded-full border-4 border-[#0A0A0B]" />
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl">{data.name}</h2>
                <span className="glass-pill">L{data.level}</span>
              </div>
              {data.goal && <div className="text-xs text-[#888] capitalize mt-1">{data.goal.replace("_", " ")} track</div>}

              {data.bio && <p className="text-sm text-[#CCCCCC] mt-4 leading-relaxed">{data.bio}</p>}

              <div className="grid grid-cols-3 gap-2 mt-5">
                <Stat icon={Heart} label="Connections" value={data.connections_count} />
                <Stat icon={Users} label="Groups" value={data.groups_count} />
                <Stat icon={Award} label="Level" value={data.level} />
              </div>

              {(data.education || data.college) && (
                <div className="surface-card p-4 mt-5 flex items-start gap-3">
                  <GraduationCap size={18} className="text-[#CBFF3D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] mono uppercase tracking-widest text-[#888]">Education</div>
                    <div className="text-sm text-white">{data.education || "—"}</div>
                    <div className="text-xs text-[#CCCCCC]">{data.college || "—"}</div>
                  </div>
                </div>
              )}

              {data.tags?.length > 0 && (
                <div className="mt-5">
                  <div className="text-[10px] mono uppercase tracking-widest text-[#888] mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.tags.map((t) => (
                      <span key={t} className="text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/8 text-[#CCCCCC]">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.groups?.length > 0 && (
                <div className="mt-6">
                  <div className="text-[10px] mono uppercase tracking-widest text-[#888] mb-2">Active groups</div>
                  <div className="space-y-2">
                    {data.groups.map((g) => (
                      <div key={g.id} className="surface-card p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">{g.name}</div>
                          <span className="text-[10px] mono text-[#CBFF3D]">{g.progress}%</span>
                        </div>
                        <div className="text-xs text-[#CCCCCC]">{g.project}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 text-xs text-[#888] flex items-center gap-1">
                <Sparkles size={11} className="text-[#CBFF3D]" />
                Public profile · auto-generated from activity
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="surface-card p-3 text-center">
      <Icon size={14} className="text-[#CBFF3D] mx-auto mb-1" />
      <div className="mono text-xl text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-[#888] mt-0.5">{label}</div>
    </div>
  );
}
