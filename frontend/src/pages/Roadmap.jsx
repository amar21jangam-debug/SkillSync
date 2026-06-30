import { useEffect, useState, useRef } from "react";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { Check, Circle, Clock } from "lucide-react";
import { gsap } from "gsap";

export default function Roadmap() {
  const [data, setData] = useState(null);
  const timelineRef = useRef(null);

  useEffect(() => { api.get("/roadmap").then((r) => setData(r.data)); }, []);

  useEffect(() => {
    if (data && timelineRef.current) {
      const els = timelineRef.current.querySelectorAll("[data-step]");
      gsap.fromTo(els, { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.55, ease: "power2.out" });
      const line = timelineRef.current.querySelector("[data-line]");
      if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: "power2.inOut", transformOrigin: "top" });
    }
  }, [data]);

  if (!data) return <div className="text-[#888] mono">Loading roadmap...</div>;

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FFFFFF] mb-2">My Roadmap</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight capitalize">{data.goal.replace("_", " ")} Track</h1>
        <p className="text-[#CCCCCC] mt-2 text-sm">A personalized step-by-step path. Solve problems to unlock progress.</p>
      </div>

      <div className="surface-card p-6 mb-8">
        <div className="flex justify-between text-xs text-[#CCCCCC] mb-2">
          <span>Total progress</span><span className="mono text-[#FFFFFF] font-semibold">{data.progress}%</span>
        </div>
        <div className="h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
          <div className="h-full progress-fill rounded-full" style={{ width: `${data.progress}%` }} />
        </div>
      </div>

      <div ref={timelineRef} className="relative pl-10">
        <div data-line className="absolute left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/40 to-transparent" />
        {data.steps.map((s) => (
          <div
            key={s.index}
            data-step
            data-testid={TID.roadmapStep(s.index)}
            className="relative mb-6"
          >
            <div className={`absolute -left-[34px] top-2 w-7 h-7 rounded-full flex items-center justify-center ${s.completed ? "bg-[#FFFFFF] text-black" : s.in_progress ? "bg-black border-2 border-[#FFFFFF] text-[#FFFFFF]" : "bg-[#2A2A2A] text-[#888]"}`}>
              {s.completed ? <Check size={14} /> : s.in_progress ? <Clock size={13}/> : <Circle size={13} />}
            </div>
            <div className={`surface-card p-5 transition-all ${s.in_progress ? "border-[#FFFFFF]/60 shadow-[0_0_20px_rgba(255,255,255,0.15)]" : ""}`}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="font-semibold text-lg">{s.index}. {s.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs mono text-[#CCCCCC]">~{s.hours}h</span>
                  {s.completed && <span className="text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FFFFFF] text-black">Done</span>}
                  {s.in_progress && <span className="text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FFFFFF]/20 text-[#FFFFFF] border border-[#FFFFFF]/40">Active</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.topics.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[#2A2A2A] text-[#CCCCCC] mono">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
