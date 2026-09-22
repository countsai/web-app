"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore, PlanTier } from "@/lib/store";
import { Briefcase, Users, Search, LogIn, UserPlus, Menu } from "lucide-react";

const PLAN_BADGE: Record<PlanTier, { label: string; class: string }> = {
  Free:    { label: "Free",    class: "bg-white/15 text-white border-white/20" },
  Premium: { label: "Premium", class: "bg-[#079DB3]/20 text-[#079DB3] border-[#079DB3]/30" },
};

export function Navbar({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  const { currentPlan, setCurrentPlan } = useStore();
  const pathname = usePathname();

  const planCfg = PLAN_BADGE[currentPlan];

  return (
    <header className="sticky top-0 z-50 shadow-lg" style={{ background: "#079DB3" }}>

      {/* ── Top Segmenter Bar ── */}
      <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9">

          {/* Audience switcher */}
          <div className="flex items-center gap-1">
            <Link
              href="/training"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                pathname.startsWith("/training")
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Briefcase size={10} /> AI Training
            </Link>
            <div className="w-px h-3.5 bg-white/20" />
            <Link
              href="/jobs/board"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                pathname.startsWith("/jobs")
                  ? "text-[#079DB3] border-b border-[#079DB3]"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Users size={10} /> AI Jobs
            </Link>
            <div className="w-px h-3.5 bg-white/20" />
            <Link
              href="/for-businesses"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                pathname === "/for-businesses"
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Briefcase size={10} /> For Business
            </Link>
          </div>

          {/* Plan badge */}
          <div className="hidden sm:flex items-center gap-3">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${planCfg.class}`}>
              {planCfg.label}
            </span>
            <Link
              href="/pricing"
              className="text-[11px] font-black uppercase tracking-wider transition-colors"
              style={{ color: currentPlan === "Free" ? "#079DB3" : "rgba(255,255,255,0.5)" }}
            >
              {currentPlan === "Free" ? "Upgrade →" : "Manage Plan"}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Lower Brand Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-14">

        {/* Mobile sidebar toggle */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.12)" }}
            aria-label="Open menu"
          >
            <Menu size={18} className="text-white" />
          </button>
        )}

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 bg-white rounded-xl px-3 py-1.5 shadow-sm">
          <Image src="/logo-light.png" alt="CountsAI" width={108} height={30} className="object-contain" />
        </Link>

        {/* Search helper */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
          <Link href="/jobs/board">
            <div
              className="h-9 w-full pl-10 pr-4 rounded-xl text-sm font-medium flex items-center cursor-pointer"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.4)" }}
            >
              Search jobs, companies, or skills…
            </div>
          </Link>
        </div>

        <div className="flex-1" />

        {/* Plan demo chip */}
        <div className="hidden sm:flex items-center gap-1">
          {(["Free", "Premium"] as PlanTier[]).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPlan(p)}
              className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all"
              style={
                currentPlan === p
                  ? { background: "white", color: "#079DB3" }
                  : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }
              }
            >
              {p}
            </button>
          ))}
        </div>

        {/* Login / Sign Up */}
        <div className="flex items-center gap-2">
          <Link href="/auth/login"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors text-white/75 hover:text-white hover:bg-white/10">
            <LogIn size={13} /> Log In
          </Link>
          <Link href="/auth/register">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}>
              <UserPlus size={13} /> Sign Up
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
