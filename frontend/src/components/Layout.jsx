import { useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import AIChatWidget from "./AIChatWidget";
import { useAuth } from "../lib/auth";

export default function Layout() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#7DD3FC]">
        <div className="animate-pulse mono">Loading SkillSync...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboarding_complete) return <Navigate to="/onboarding" replace />;

  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-[#1F1F1F] bg-black/80 backdrop-blur">
          <button onClick={() => setOpen(true)} className="text-white"><Menu size={22} /></button>
          <div className="font-bold tracking-tight">SkillSync</div>
          <div className="w-6" />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <AIChatWidget />
    </div>
  );
}
