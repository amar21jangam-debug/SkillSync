import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Star, MessageCircle, GraduationCap } from "lucide-react";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  useEffect(() => { api.get("/mentors").then((r) => setMentors(r.data)); }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-2">Mentors</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Learn from people who've done it.</h1>
        <p className="text-[#CCCCCC] mt-2 text-sm">1:1 sessions, code reviews, and career advice.</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-5">
        {mentors.map((m) => (
          <div key={m.id} className="surface-card surface-card-hover p-6 flex gap-4">
            <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-xl object-cover border border-[#2A2A2A]" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-semibold text-lg">{m.name}</div>
                <div className="text-xs mono text-[#FF6200] flex items-center gap-1">
                  <Star size={12} fill="#FF6200" /> {m.rating}
                </div>
              </div>
              <div className="text-sm text-[#CCCCCC]">{m.role}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {m.expertise.map((e) => (
                  <span key={e} className="text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2A2A2A] text-[#CCCCCC]">{e}</span>
                ))}
              </div>
              <div className="text-sm text-[#CCCCCC] mt-3 line-clamp-2">{m.bio}</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-[#888] flex items-center gap-1">
                  <GraduationCap size={13} className="text-[#FF6200]"/> {m.sessions} sessions
                </div>
                <button className="btn-primary text-sm py-1.5 px-3">
                  <MessageCircle size={13}/> Book / Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
