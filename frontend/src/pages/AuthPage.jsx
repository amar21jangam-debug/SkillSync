import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { TID } from "../constants/testIds";
import { Sparkles, ArrowRight } from "lucide-react";
import { gsap } from "gsap";

export default function AuthPage({ mode = "login" }) {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(mode === "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => { setIsRegister(mode === "register"); }, [mode]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
    }
  }, []);

  useEffect(() => {
    if (user) navigate(user.onboarding_complete ? "/app" : "/onboarding");
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      if (isRegister) await register(email, password, name);
      else await login(email, password);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#FFFFFF]/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#FFFFFF]/5 blur-3xl" />
      </div>

      <div ref={cardRef} className="relative w-full max-w-md surface-card p-8">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-[#CBFF3D] flex items-center justify-center glow-white">
            <Sparkles size={16} className="text-black" />
          </div>
          <div className="font-bold tracking-tight">SkillSync</div>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-[#CCCCCC] mb-6">
          {isRegister ? "Start your personalized roadmap in 60 seconds." : "Continue your learning streak."}
        </p>

        <form onSubmit={submit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="text-xs mono uppercase tracking-widest text-[#888]">Name</label>
              <input
                data-testid={TID.authNameInput}
                value={name} onChange={(e) => setName(e.target.value)}
                required minLength={2}
                className="input-skill mt-1" placeholder="Ada Lovelace"
              />
            </div>
          )}
          <div>
            <label className="text-xs mono uppercase tracking-widest text-[#888]">Email</label>
            <input
              data-testid={TID.authEmailInput}
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-skill mt-1" placeholder="you@dev.com"
            />
          </div>
          <div>
            <label className="text-xs mono uppercase tracking-widest text-[#888]">Password</label>
            <input
              data-testid={TID.authPasswordInput}
              type="password" required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-skill mt-1" placeholder="••••••••"
            />
          </div>

          {err && <div className="text-sm text-red-400">{err}</div>}

          <button
            data-testid={TID.authSubmitBtn}
            disabled={loading}
            type="submit"
            className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50"
          >
            {loading ? "Working..." : isRegister ? "Create account" : "Sign in"}
            <ArrowRight size={16} />
          </button>
        </form>

        <button
          data-testid={TID.authSwitchBtn}
          onClick={() => setIsRegister((v) => !v)}
          className="mt-6 text-sm text-[#CCCCCC] hover:text-[#CBFF3D] w-full text-center"
        >
          {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}
