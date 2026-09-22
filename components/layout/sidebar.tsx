"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/lib/role-context";
import { useStore, PlanTier } from "@/lib/store";

const CANDIDATE_GROUPS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
    ],
  },
  {
    label: "Career",
    items: [
      { name: "AI Jobs",      href: ROUTES.PUBLIC_JOBS,  icon: "Briefcase" },
      { name: "Applications", href: ROUTES.APPLICATIONS, icon: "ClipboardList" },
      { name: "Career Scan",  href: ROUTES.CAREER_SCAN,  icon: "ScanSearch" },
    ],
  },
  {
    label: "Program",
    items: [
      { name: "Training",     href: "/training",          icon: "GraduationCap" },
      { name: "Certificates", href: ROUTES.DASHBOARD,     icon: "Shield" },
      { name: "Proof of Work",href: ROUTES.PROOF_OF_WORK, icon: "Cpu" },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Profile",   href: ROUTES.PROFILE,  icon: "User" },
      { name: "Settings",  href: ROUTES.SETTINGS, icon: "Settings" },
    ],
  },
];

const EMPLOYER_GROUPS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: ROUTES.EMPLOYER_DASHBOARD, icon: "LayoutDashboard" },
      { name: "Applicants", href: ROUTES.EMPLOYER_APPLICANTS, icon: "FileUser" },
    ],
  },
  {
    label: "Hiring",
    items: [
      { name: "Manage Jobs", href: ROUTES.EMPLOYER_JOBS, icon: "Briefcase" },
      { name: "Candidates", href: ROUTES.EMPLOYER_CANDIDATES, icon: "Users" },
      { name: "Micro Projects", href: ROUTES.EMPLOYER_MICRO_PROJECTS, icon: "Cpu" },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: ROUTES.EMPLOYER_SETTINGS, icon: "Settings" },
    ],
  },
];

const ADMIN_GROUPS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard",    href: ROUTES.ADMIN_DASHBOARD, icon: "LayoutDashboard" },
    ],
  },
  {
    label: "Program",
    items: [
      { name: "Students",     href: ROUTES.ADMIN_STUDENTS,   icon: "GraduationCap" },
      { name: "Certificates", href: "/admin/certificates",   icon: "Shield" },
      { name: "Candidates",   href: ROUTES.ADMIN_CANDIDATES, icon: "ClipboardList" },
    ],
  },
  {
    label: "People",
    items: [
      { name: "Users",        href: ROUTES.ADMIN_USERS,      icon: "Users" },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Jobs",         href: ROUTES.ADMIN_JOBS,        icon: "Briefcase" },
      { name: "Visa Guides",  href: ROUTES.ADMIN_VISA_GUIDES,  icon: "Globe" },
    ],
  },
];

const PLAN_BADGE: Record<PlanTier, { bg: string; text: string; label: string }> = {
  Free:    { bg: "bg-amber-50",  text: "text-amber-700",  label: "Free" },
  Premium: { bg: "bg-[#e3f1f2]", text: "text-[#079DB3]",  label: "Premium" },
};

export function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useRole();
  const { currentPlan } = useStore();

  const getGroups = () => {
    if (pathname.startsWith("/admin")) return ADMIN_GROUPS;
    if (user.role === "employer") return EMPLOYER_GROUPS;
    if (user.role === "admin") return ADMIN_GROUPS;
    if (user.role === "jobseeker") return CANDIDATE_GROUPS;
    return CANDIDATE_GROUPS;
  };

  const groups = getGroups();
  const planBadge = PLAN_BADGE[currentPlan];

  return (
    <aside className={cn("fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card flex flex-col overflow-hidden transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")} style={{ borderColor: "#cfe1e4" }}>

      {/* Logo */}
      <div className="px-5 py-4 border-b shrink-0 flex items-center justify-between" style={{ borderColor: "#cfe1e4" }}>
        <Link href={ROUTES.HOME} className="flex items-center">
          <Image src="/logo-light.png" alt={APP_NAME} width={120} height={33} className="object-contain" />
        </Link>
        <button
          className="lg:hidden flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted/40 transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <Icons.X size={16} style={{ color: "#546d71" }} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: "#546d71", opacity: 0.45 }}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = (Icons as any)[item.icon] || Icons.Circle;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                      isActive
                        ? "text-white shadow-md"
                        : "hover:bg-[#eef6f7]"
                    )}
                    style={isActive ? { background: "#079DB3", color: "#fff" } : { color: "#546d71" }}
                  >
                    <Icon size={16} />
                    <span className="flex-1">{item.name}</span>
                    {"badge" in item && typeof (item as { badge?: string }).badge === "string" && !isActive && (
                      <span
                        className="text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none"
                        style={{ background: "#e3f1f2", color: "#079DB3" }}
                      >
                        {(item as { badge: string }).badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t px-3 py-4 space-y-3" style={{ borderColor: "#cfe1e4" }}>

        {/* Upgrade nudge for free candidates */}
        {user.role === "jobseeker" && currentPlan === "Free" && (
          <div className="rounded-2xl p-4 space-y-2.5" style={{ background: "linear-gradient(135deg, #079DB3, #16a3ba)" }}>
            <div className="flex items-center gap-1.5">
              <Icons.Award size={13} className="text-white" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Upgrade to Premium</span>
            </div>
            <p className="text-[11px] text-white/70 font-medium leading-snug">
              Unlock all jobs, AI Auto-Apply Engine & your Week 1 Interview Guarantee.
            </p>
            <Link href="/pricing">
              <Button
                size="sm"
                className="w-full h-8 rounded-xl font-black text-[11px] gap-1.5 shadow-md"
                style={{ background: "#079DB3", color: "#fff", border: "none" }}
              >
                Upgrade Now <Icons.ArrowRight size={12} />
              </Button>
            </Link>
          </div>
        )}

        {/* User Account */}
        <div className="flex items-center gap-3 px-1">
          <Avatar className="h-8 w-8 border-2 shrink-0" style={{ borderColor: "#cfe1e4" }}>
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-xs font-black" style={{ background: "#e3f1f2", color: "#079DB3" }}>
              {user.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-bold leading-tight" style={{ color: "#16282b" }}>{user.full_name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[8px] px-1.5 h-3.5 uppercase font-black tracking-wide rounded-full inline-flex items-center ${planBadge.bg} ${planBadge.text}`}>
                {planBadge.label}
              </span>
              <span className="text-[10px] truncate" style={{ color: "#546d71" }}>{user.email}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg shrink-0"
            style={{ color: "#546d71" }}
            onClick={() => router.push(ROUTES.HOME)}
          >
            <Icons.LogOut size={15} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
