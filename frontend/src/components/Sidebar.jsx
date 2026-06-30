import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Map, Code2, BarChart3, Trophy, Users,
  GraduationCap, Heart, BookOpen, LogOut, Flame, Sparkles, Award,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { TID } from "../constants/testIds";
import { gsap } from "gsap";
import LevelSwitcher from "./LevelSwitcher";

const ITEMS = [
  { key: "dashboard", to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { key: "roadmap", to: "/app/roadmap", label: "My Roadmap", icon: Map },
  { key: "practice", to: "/app/practice", label: "Practice Problems", icon: Code2 },
  { key: "performance", to: "/app/performance", label: "My Performance", icon: BarChart3 },
  { key: "contests", to: "/app/contests", label: "Contests", icon: Trophy },
  { key: "groups", to: "/app/groups", label: "Group Discussion", icon: Users },
  { key: "mentors", to: "/app/mentors", label: "Mentors", icon: GraduationCap },
  { key: "connect", to: "/app/connect", label: "Connect", icon: Heart },
  { key: "certificates", to: "/app/certificates", label: "Certificates", icon: Award },
  { key: "how", to: "/app/how-it-works", label: "How It Works", icon: BookOpen },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const indicatorRef = useRef(null);

  useEffect(() => {
    const active = document.querySelector(".sidebar-item-active");
    if (active && indicatorRef.current) {
      const rect = active.getBoundingClientRect();
      const parentRect = active.parentElement.parentElement.getBoundingClientRect();
      gsap.to(indicatorRef.current, {
        y: rect.top - parentRect.top, duration: 0.35, ease: "power3.out",
      });
    }
  }, [location.pathname]);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-64 shrink-0 border-r border-[#1F1F1F] bg-[#0A0A0A] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-6 py-6 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] flex items-center justify-center glow-white">
              <Sparkles size={20} className="text-black" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight text-lg">SkillSync</div>
              <div className="text-[10px] mono uppercase tracking-[0.25em] text-[#888]">Cyber Lab</div>
            </div>
          </div>
        </div>

        {user && (
          <div className="px-4 py-4 border-b border-[#1F1F1F]">
            <div className="flex items-center gap-3 mb-3">
              <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border border-[#FFFFFF]" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs text-[#888] truncate">Level {user.level}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[#FFFFFF]">
                <Flame size={14} /> <span className="mono">{user.streak}</span>
              </div>
              <div className="mono text-[#CCCCCC]">{user.xp} XP</div>
            </div>
          </div>
        )}

        <LevelSwitcher />

        <nav className="flex-1 py-4 overflow-y-auto relative">
          <div ref={indicatorRef} className="absolute left-0 top-0 w-[2px] h-10 bg-[#FFFFFF] rounded-r" />
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.key}
                to={it.to}
                end={it.end}
                data-testid={TID.sidebarLink(it.key)}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 ${
                    isActive ? "sidebar-item-active" : "text-[#CCCCCC] hover:text-white hover:bg-[#141414]"
                  }`
                }
              >
                <Icon size={18} />
                <span>{it.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={logout}
          data-testid={TID.sidebarLogout}
          className="m-4 flex items-center gap-2 px-4 py-2 text-sm text-[#CCCCCC] hover:text-[#FFFFFF] border border-[#1F1F1F] rounded-lg hover:border-[#FFFFFF]/40 transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>
    </>
  );
}
