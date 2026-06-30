import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { Star, MessageCircle, GraduationCap, Calendar, X, Check, Clock } from "lucide-react";
import { toast } from "sonner";

function nextSlots() {
  const out = [];
  const now = new Date();
  for (let d = 1; d <= 4; d++) {
    const dt = new Date(now);
    dt.setDate(now.getDate() + d);
    [10, 16].forEach((hour) => {
      const slot = new Date(dt);
      slot.setHours(hour, 0, 0, 0);
      out.push(slot.toISOString());
    });
  }
  return out;
}

function formatSlot(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${day} · ${time}`;
}

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [active, setActive] = useState(null);

  const loadBookings = () => api.get("/mentors/bookings").then((r) => setBookings(r.data));

  useEffect(() => {
    api.get("/mentors").then((r) => setMentors(r.data));
    loadBookings();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#7DD3FC] mb-2">Mentors</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Learn from people who've done it.</h1>
        <p className="text-[#CCCCCC] mt-2 text-sm">1:1 sessions, code reviews, and career advice.</p>
      </div>

      {bookings.length > 0 && (
        <div className="surface-card p-5 mb-8 border-[#7DD3FC]/30">
          <div className="text-xs mono uppercase tracking-widest text-[#7DD3FC] mb-3 flex items-center gap-2">
            <Calendar size={13}/> Your upcoming sessions
          </div>
          <div className="space-y-2">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-white">{b.mentor_name}</div>
                  <div className="text-xs text-[#888]">{b.mentor_role}</div>
                </div>
                <div className="flex items-center gap-2 text-[#7DD3FC] mono text-xs">
                  <Clock size={12}/> {formatSlot(b.slot)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {mentors.map((m) => (
          <div key={m.id} className="surface-card surface-card-hover p-6 flex gap-4">
            <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-xl object-cover border border-[#2A2A2A]" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-semibold text-lg">{m.name}</div>
                <div className="text-xs mono text-[#7DD3FC] flex items-center gap-1">
                  <Star size={12} fill="#FFFFFF" /> {m.rating}
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
                  <GraduationCap size={13} className="text-[#7DD3FC]"/> {m.sessions} sessions
                </div>
                <button
                  data-testid={TID.mentorBookBtn(m.id)}
                  onClick={() => setActive(m)}
                  className="btn-primary text-sm py-1.5 px-3"
                >
                  <MessageCircle size={13}/> Book / Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <BookingDialog
          mentor={active}
          onClose={() => setActive(null)}
          onBooked={async () => { await loadBookings(); setActive(null); }}
        />
      )}
    </div>
  );
}

function BookingDialog({ mentor, onClose, onBooked }) {
  const [slot, setSlot] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const slots = nextSlots();

  const confirm = async () => {
    if (!slot) return;
    setBusy(true);
    try {
      await api.post(`/mentors/${mentor.id}/book`, { mentor_id: mentor.id, slot, note });
      toast.success(`Booked with ${mentor.name} — ${formatSlot(slot)}`);
      onBooked();
    } catch (e) {
      toast.error("Could not book. Try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        className="surface-card w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888] hover:text-white">
          <X size={18}/>
        </button>
        <div className="flex items-center gap-3 mb-5">
          <img src={mentor.avatar} alt={mentor.name} className="w-14 h-14 rounded-xl object-cover border border-[#2A2A2A]" />
          <div>
            <div className="text-xs mono uppercase tracking-widest text-[#7DD3FC]">Book a session</div>
            <div className="font-semibold text-lg">{mentor.name}</div>
            <div className="text-xs text-[#CCCCCC]">{mentor.role}</div>
          </div>
        </div>

        <div className="text-xs mono uppercase tracking-widest text-[#888] mb-2">Pick a slot</div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {slots.map((s) => {
            const active = slot === s;
            return (
              <button
                key={s}
                data-testid={TID.mentorSlotBtn(s)}
                onClick={() => setSlot(s)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${active ? "border-[#FFFFFF] bg-[#FFFFFF]/10 text-white" : "border-[#2A2A2A] bg-[#141414] text-[#CCCCCC] hover:border-[#7DD3FC]/50"}`}
              >
                <div className="flex items-center gap-2">
                  {active && <Check size={13} className="text-[#7DD3FC]"/>}
                  {formatSlot(s)}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs mono uppercase tracking-widest text-[#888] mb-2">Note (optional)</div>
        <textarea
          value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="What do you want to focus on?"
          className="input-skill min-h-[80px] resize-y mb-5"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
          <button
            data-testid={TID.mentorConfirmBookBtn}
            onClick={confirm}
            disabled={!slot || busy}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {busy ? "Booking..." : "Confirm booking"} <Check size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}
