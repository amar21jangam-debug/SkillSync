import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { TID } from "../constants/testIds";
import { toast } from "sonner";
import {
  Save, Plus, Trash2, Sparkles, GraduationCap, Heart, Users, Award, Check,
} from "lucide-react";
import { gsap } from "gsap";

const THEMES = {
  lime:   { bg: "from-[#CBFF3D]/30 via-[#1F1F1F] to-[#0A0A0B]", chip: "bg-[#CBFF3D] text-black" },
  violet: { bg: "from-[#9D7BFF]/35 via-[#1F1F1F] to-[#0A0A0B]", chip: "bg-[#9D7BFF] text-black" },
  peach:  { bg: "from-[#FFB59C]/30 via-[#1F1F1F] to-[#0A0A0B]", chip: "bg-[#FFB59C] text-black" },
  ocean:  { bg: "from-[#7DD3FC]/30 via-[#1F1F1F] to-[#0A0A0B]", chip: "bg-[#7DD3FC] text-black" },
  sand:   { bg: "from-[#F2EDE4]/20 via-[#1F1F1F] to-[#0A0A0B]", chip: "bg-[#F2EDE4] text-black" },
};

const EMOJIS = ["✨", "⚡", "🚀", "🧠", "🔥", "🎯", "📈", "🛠️", "🐘", "🎨", "📊", "💡"];

export default function MyProfile() {
  const { user, setUser } = useAuth();
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", about: "", currently: "", education: "", college: "" });
  const [storyDraft, setStoryDraft] = useState({ text: "", emoji: "✨", theme: "lime" });
  const [postingStory, setPostingStory] = useState(false);
  const [saving, setSaving] = useState(false);
  const storiesRef = useRef(null);

  const load = async () => {
    const { data } = await api.get("/profile/me");
    setData(data);
    setForm({
      name: data.name || "",
      about: data.about || "",
      currently: data.currently || "",
      education: data.education || "",
      college: data.college || "",
    });
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (storiesRef.current && data?.stories?.length) {
      gsap.fromTo(storiesRef.current.querySelectorAll("[data-story]"),
        { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: "power2.out" });
    }
  }, [data?.stories?.length]);

  if (!data) return <div className="text-[#888] mono">Loading profile…</div>;

  const save = async () => {
    setSaving(true);
    try {
      const { data: updated } = await api.patch("/profile/me", form);
      setUser(updated);
      toast.success("Profile updated");
      await load();
      setEditing(false);
    } catch { toast.error("Could not save"); }
    finally { setSaving(false); }
  };

  const postStory = async () => {
    const t = storyDraft.text.trim();
    if (!t || postingStory) return;
    setPostingStory(true);
    try {
      const { data: res } = await api.post("/profile/me/story", storyDraft);
      setUser(res.user);
      toast.success("Story posted");
      setStoryDraft({ text: "", emoji: "✨", theme: "lime" });
      await load();
    } catch { toast.error("Could not post story"); }
    finally { setPostingStory(false); }
  };

  const deleteStory = async (id) => {
    await api.delete(`/profile/me/story/${id}`);
    await load();
  };

  return (
    <div>
      {/* Hero */}
      <div className="surface-card overflow-hidden mb-6">
        <div className="relative h-32 bg-gradient-to-br from-[#CBFF3D]/30 via-[#1F1F1F] to-[#0A0A0B]" />
        <div className="px-6 sm:px-8 pb-6 -mt-14 flex flex-col sm:flex-row gap-6 sm:items-end">
          <img src={data.avatar} alt={data.name} className="w-28 h-28 rounded-full border-4 border-[#0A0A0B]" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl tracking-tight">{data.name}</h1>
              <span className="glass-pill">L{data.level}</span>
              {data.goal && <span className="glass-pill capitalize">{data.goal.replace("_", " ")}</span>}
            </div>
            {data.college && (
              <div className="text-sm text-[#CCCCCC] mt-1 flex items-center gap-1">
                <GraduationCap size={13} className="text-[#CBFF3D]" /> {data.education} · {data.college}
              </div>
            )}
          </div>
          <button
            data-testid="profile-edit-toggle"
            onClick={() => setEditing((v) => !v)}
            className={editing ? "btn-secondary" : "btn-primary"}
          >
            {editing ? "Cancel" : "Edit profile"}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-px bg-white/5 border-t border-white/8">
          <Stat icon={Heart} label="Connections" value={data.connections_count} />
          <Stat icon={Users} label="Groups" value={data.groups_count} />
          <Stat icon={Award} label="Streak" value={`${data.streak}d`} />
          <Stat icon={Sparkles} label="XP" value={data.xp} />
        </div>
      </div>

      {/* Edit form (collapsible) */}
      {editing && (
        <div className="surface-card p-6 mb-8">
          <h3 className="text-lg mb-4">Edit details</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Field label="Display name">
              <input data-testid="profile-name-input" className="input-skill"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Education">
              <select className="input-skill"
                value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })}>
                <option value="">—</option>
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="College / Institution" full>
              <input className="input-skill"
                value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })}
                placeholder="e.g. IIT Bombay" />
            </Field>
          </div>
          <Field label="About — who you are, where you study, what you care about">
            <textarea data-testid="profile-about-input" className="input-skill min-h-[110px]"
              value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })}
              maxLength={500}
              placeholder="A short bio. Max 500 chars." />
            <div className="text-[10px] mono text-[#888] text-right mt-1">{form.about.length}/500</div>
          </Field>
          <Field label="Currently — what you're working on right now">
            <input data-testid="profile-currently-input" className="input-skill"
              value={form.currently} onChange={(e) => setForm({ ...form, currently: e.target.value })}
              maxLength={140}
              placeholder="e.g. Shipping a side-project · Studying transformers" />
          </Field>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            <button data-testid="profile-save-btn" onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
              <Save size={14}/> {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {/* About */}
      <section className="mb-8">
        <h3 className="text-xl mb-3">About</h3>
        <div className="surface-card p-6 text-[#CCCCCC] leading-relaxed">
          {data.about
            ? data.about
            : <span className="text-[#888]">No about yet. Hit <em className="text-[#CBFF3D] not-italic">Edit profile</em> and tell people who you are.</span>}
        </div>
      </section>

      {/* Currently */}
      <section className="mb-8">
        <h3 className="text-xl mb-3">Currently into</h3>
        <div className="surface-card p-6 flex items-center gap-3">
          <Sparkles size={18} className="text-[#CBFF3D] shrink-0" />
          <div className="text-[#CCCCCC]">
            {data.currently || <span className="text-[#888]">What are you working on these days?</span>}
          </div>
        </div>
      </section>

      {/* Stories composer */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl">Stories</h3>
          <span className="text-xs mono text-[#888]">{data.stories?.length || 0} posted</span>
        </div>
        <div className="surface-card p-5 mb-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {EMOJIS.map((e) => (
              <button key={e}
                onClick={() => setStoryDraft({ ...storyDraft, emoji: e })}
                className={`w-9 h-9 rounded-full text-lg flex items-center justify-center transition-all ${storyDraft.emoji === e ? "bg-[#CBFF3D]/15 ring-2 ring-[#CBFF3D]" : "bg-white/5 hover:bg-white/10"}`}
              >{e}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {Object.keys(THEMES).map((t) => (
              <button key={t}
                onClick={() => setStoryDraft({ ...storyDraft, theme: t })}
                className={`px-3 py-1 rounded-full text-xs capitalize transition-all ${storyDraft.theme === t ? `${THEMES[t].chip} font-semibold` : "bg-white/5 text-[#CCCCCC] hover:bg-white/10"}`}
              >
                {storyDraft.theme === t && <Check size={11} className="inline mr-1" />}{t}
              </button>
            ))}
          </div>
          <textarea data-testid="story-draft-input" className="input-skill min-h-[80px]"
            value={storyDraft.text}
            onChange={(e) => setStoryDraft({ ...storyDraft, text: e.target.value })}
            placeholder="Post a quick update — what are you building, learning, struggling with?"
            maxLength={280} />
          <div className="flex justify-between items-center mt-3">
            <span className="text-[10px] mono text-[#888]">{storyDraft.text.length}/280</span>
            <button
              data-testid="story-post-btn"
              onClick={postStory}
              disabled={!storyDraft.text.trim() || postingStory}
              className="btn-primary disabled:opacity-50">
              <Plus size={14}/> {postingStory ? "Posting…" : "Post story"}
            </button>
          </div>
        </div>

        {/* Stories grid */}
        <div ref={storiesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.stories || []).map((s) => (
            <StoryCard key={s.id} story={s} onDelete={() => deleteStory(s.id)} />
          ))}
          {data.stories?.length === 0 && (
            <div className="surface-card p-6 text-sm text-[#888]">No stories yet — post your first above.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "sm:col-span-2 mb-4" : "mb-4"}>
      <label className="text-[10px] mono uppercase tracking-widest text-[#888] mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#0A0A0B] p-4 text-center">
      <Icon size={14} className="text-[#CBFF3D] mx-auto mb-1" />
      <div className="mono text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-[#888] mt-0.5">{label}</div>
    </div>
  );
}

export function StoryCard({ story, onDelete }) {
  const theme = THEMES[story.theme] || THEMES.lime;
  return (
    <div data-story className="surface-card surface-card-hover overflow-hidden group">
      <div className={`relative h-28 bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
        <div className="text-5xl">{story.emoji}</div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-black/50 hover:bg-black/70 transition"
            title="Delete story"
          >
            <Trash2 size={12} className="text-white"/>
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm text-[#F2EDE4] leading-snug">{story.text}</div>
        <div className="text-[10px] mono text-[#888] mt-2">{story.created_at}</div>
      </div>
    </div>
  );
}
