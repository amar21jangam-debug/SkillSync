import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { Users, ArrowRight } from "lucide-react";
import { gsap } from "gsap";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const gridRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { api.get("/groups").then((r) => setGroups(r.data)); }, []);

  useEffect(() => {
    if (gridRef.current && groups.length) {
      gsap.fromTo(gridRef.current.querySelectorAll("[data-group]"),
        { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.55, ease: "power2.out" });
    }
  }, [groups]);

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-2">Group Discussion</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">My Groups</h1>
        <p className="text-[#CCCCCC] mt-2 text-sm">Squads of 5. Real projects. Earn a certificate with your participation %.</p>
      </div>

      <div ref={gridRef} className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((g) => (
          <div
            key={g.id}
            data-group
            data-testid={TID.groupCard(g.id)}
            className="surface-card surface-card-hover p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-lg">{g.name}</div>
                <div className="text-xs text-[#888] flex items-center gap-1 mt-1">
                  <Users size={12} /> {g.members.length} / 5 members
                </div>
              </div>
              <div className="mono text-[#FF6200] font-bold text-xl">{g.progress}%</div>
            </div>

            <div className="mb-4">
              <div className="text-xs mono uppercase tracking-widest text-[#888] mb-1">Current Project</div>
              <div className="text-sm text-white">{g.project}</div>
            </div>

            <div className="mb-5">
              <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div className="h-full progress-fill rounded-full" style={{ width: `${g.progress}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex -space-x-2">
                {g.members.slice(0, 4).map((m) => (
                  <img key={m.id} src={m.avatar} alt={m.name} title={m.name}
                    className="w-8 h-8 rounded-full border-2 border-[#0A0A0A]" />
                ))}
                {g.members.length > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-[#2A2A2A] flex items-center justify-center text-xs mono">+{g.members.length - 4}</div>
                )}
              </div>
              <button
                data-testid={TID.enterGroupBtn(g.id)}
                onClick={() => navigate(`/app/groups/${g.id}`)}
                className="btn-primary text-sm py-2 px-4"
              >
                Enter Group <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
