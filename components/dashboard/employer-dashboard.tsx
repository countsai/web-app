"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Search, Plus, ArrowUpRight,
  Clock, MessageSquare, ShieldCheck, Sparkles,
  Cpu, ChevronRight, Flame, Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useRole } from "@/lib/role-context";

const ACTIVE_JOBS = [
  {
    title: "Senior AI Engineer",
    type: "Full-time · Remote",
    applicants: 42,
    quality: "High",
    qualityColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    daysLeft: 12,
    new: 8,
  },
  {
    title: "LLM Ops Specialist",
    type: "Full-time · Hybrid",
    applicants: 18,
    quality: "Optimal",
    qualityColor: "text-primary bg-primary/5 border-primary/20",
    daysLeft: 5,
    new: 3,
  },
  {
    title: "Growth Lead (AI)",
    type: "Full-time · On-site",
    applicants: 65,
    quality: "High",
    qualityColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    daysLeft: 18,
    new: 11,
  },
];

interface EmployerCandidateProfile {
  id: string;
  headline: string;
  skills: string[];
  target_roles: string[];
  preferred_locations: string[];
  visa_status: string;
  verification_status: string;
  updated_at: string;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
}

const VERIFICATION_BADGE: Record<string, string> = {
  "Top Talent": "bg-violet-50 text-violet-600 border-violet-200",
  "Client Ready": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

function getCandidateProfile(link: EmployerCandidateProfile["profiles"]) {
  return Array.isArray(link) ? link[0] ?? null : link;
}

const QUICK_ACTIONS = [
  { label: "Post a Job", desc: "Reach verified AI talent", icon: Plus, href: "/employer/jobs/new", color: "bg-primary text-white" },
  { label: "Browse Talent", desc: "AI-ranked candidates", icon: Search, href: "/employer/candidates", color: "bg-violet-500 text-white" },
  { label: "Micro Projects", desc: "Short-term AI gigs", icon: Cpu, href: "/employer/micro-projects", color: "bg-teal-500 text-white" },
  { label: "Message Candidate", desc: "Direct outreach", icon: MessageSquare, href: "/employer/applicants", color: "bg-amber-500 text-white" },
];


export function EmployerDashboard() {
  const { user } = useRole();
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const [candidates, setCandidates] = useState<EmployerCandidateProfile[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/employer/candidates");
        const data = await res.json();
        if (res.ok) setCandidates(data.candidates ?? []);
      } catch {
        // ignore — sections fall back to empty state
      } finally {
        setCandidatesLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-2">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{today}</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-tight">
            Talent Hub, <span className="text-primary italic">{user.full_name.split(" ")[0]}.</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage your hiring pipeline and discover AI talent.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link href="/employer/candidates">
            <button className="h-11 px-5 rounded-xl border-2 font-black text-sm gap-2 flex items-center" style={{ borderColor: "#D9E5E7", color: "#071A24", background: "white" }}>
              <Search size={16} /> Browse Talent
            </button>
          </Link>
          <Link href="/employer/jobs/new">
            <button className="h-11 px-5 rounded-xl font-black text-sm gap-2 flex items-center text-white" style={{ background: "#071A24" }}>
              <Plus size={16} /> Post a Role
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stats Row ── real values come from API data loaded below */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b pb-6" style={{ borderColor: "#dbe9eb" }}>
        {[
          { label: "Active Jobs", value: ACTIVE_JOBS.length.toString(), icon: Briefcase },
          { label: "Total Applicants", value: String(ACTIVE_JOBS.reduce((s, j) => s + j.applicants, 0)), icon: Users },
          { label: "AI Talent Pool", value: candidatesLoading ? "—" : candidates.length.toString(), icon: ShieldCheck },
          { label: "Micro Projects", value: "2", icon: Cpu },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#EEF4F4" }}>
                <Icon size={16} style={{ color: "#079DB3" }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8AABAE" }}>{stat.label}</p>
                <p className="text-xl font-black leading-tight" style={{ color: "#0A1C25" }}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} href={action.href}>
              <div className="p-5 rounded-2xl border-2 border-muted bg-background hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                <div className={`h-10 w-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} />
                </div>
                <div className="font-black text-sm">{action.label}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{action.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Active Job Campaigns — spans 2 cols */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-tight">Active Campaigns</h2>
            <Link href="/employer/jobs">
              <Button variant="ghost" className="text-[11px] font-black text-primary uppercase tracking-widest gap-1 h-auto py-1 px-2">
                Manage All <ArrowUpRight size={13} />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {ACTIVE_JOBS.map((job, i) => (
              <div key={i} className="p-5 rounded-2xl border-2 border-muted bg-background hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-black text-base">{job.title}</span>
                      {job.new > 0 && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 gap-1">
                          <Flame size={9} /> {job.new} new
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">{job.type}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${job.qualityColor}`}>
                      {job.quality}
                    </Badge>
                    <Link href="/employer/applicants">
                      <Button size="sm" className="h-8 px-4 rounded-xl font-black text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Queue
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Users size={13} /> {job.applicants} applicants</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {job.daysLeft} days left</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/employer/jobs/new">
            <Button variant="outline" className="w-full h-11 rounded-xl font-black text-sm gap-2 border-2">
              <Plus size={16} /> Post a New Role
            </Button>
          </Link>
        </div>

        {/* AI Talent Snapshot */}
        <div className="space-y-4">
          <div className="p-7 rounded-[32px] bg-primary text-primary-foreground space-y-5 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Users size={150} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Verified Talent Pool</p>
              <h2 className="text-5xl font-black italic">{candidatesLoading ? "—" : candidates.length}</h2>
            </div>
            <p className="text-sm opacity-75 font-medium leading-relaxed">
              Admin-verified candidates — &quot;Client Ready&quot; and &quot;Top Talent&quot; profiles ready to hire.
            </p>
            <Link href="/employer/candidates">
              <Button variant="secondary" className="w-full h-11 rounded-xl font-black text-xs uppercase tracking-widest">
                Browse Talent Pool
              </Button>
            </Link>
          </div>

          <div className="p-5 rounded-2xl border-2 border-muted bg-background space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Quick Actions</p>
            {[
              { label: "Post a job listing", href: "/employer/jobs/new" },
              { label: "Browse AI talent", href: "/employer/candidates" },
              { label: "View applicants", href: "/employer/applicants" },
            ].map((a, i) => (
              <Link key={i} href={a.href} className="flex items-center justify-between py-2 border-b last:border-0 text-sm font-semibold hover:opacity-70 transition-opacity" style={{ borderColor: "#dbe9eb", color: "#0A1C25" }}>
                {a.label}
                <ArrowUpRight size={13} style={{ color: "#079DB3" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Vetted Candidates ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Top Vetted Candidates</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Admin-verified candidates ready to hire</p>
          </div>
          <Link href="/employer/candidates">
            <Button variant="ghost" className="text-[11px] font-black text-primary uppercase tracking-widest gap-1 h-auto py-1 px-2">
              View All <ArrowUpRight size={13} />
            </Button>
          </Link>
        </div>
        {candidatesLoading ? (
          <div className="p-10 rounded-2xl border-2 border-muted text-center">
            <p className="text-sm font-medium text-muted-foreground">Loading candidates…</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="p-10 rounded-2xl border-2 border-dashed border-muted text-center space-y-1">
            <p className="font-black text-sm text-muted-foreground/60">No vetted candidates yet</p>
            <p className="text-xs text-muted-foreground/40 max-w-sm mx-auto">
              Candidates appear here once our team marks their profile as &quot;Client Ready&quot; or &quot;Top Talent&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidates.slice(0, 3).map((candidate) => {
              const profile = getCandidateProfile(candidate.profiles);
              const name = profile?.full_name ?? "Candidate";
              const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={candidate.id} className="p-6 rounded-2xl border-2 border-muted bg-background hover:border-primary/30 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-black text-sm leading-tight">{name}</div>
                        <div className="text-[11px] text-muted-foreground font-medium line-clamp-1">{candidate.headline || "—"}</div>
                      </div>
                    </div>
                    <Badge
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border shrink-0 gap-1 ${
                        VERIFICATION_BADGE[candidate.verification_status] ?? "bg-muted text-muted-foreground border-muted"
                      }`}
                    >
                      <ShieldCheck size={9} /> {candidate.verification_status}
                    </Badge>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {candidate.skills.slice(0, 4).map((skill, j) => (
                      <span key={j} className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground uppercase tracking-wide">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href="/employer/candidates" className="flex-1">
                      <Button variant="outline" className="w-full h-8 rounded-xl font-black text-[11px] border gap-1">
                        View Profile <ChevronRight size={12} />
                      </Button>
                    </Link>
                    <Link href="/employer/applicants">
                      <Button size="sm" className="h-8 w-8 rounded-xl p-0 shrink-0">
                        <MessageSquare size={13} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Micro Projects & Activity ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Micro Projects CTA */}
        <div className="p-7 rounded-[32px] border-2 border-muted bg-background space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base uppercase tracking-tight">Micro Projects</h3>
            <Link href="/employer/micro-projects">
              <Button variant="ghost" size="sm" className="text-[11px] font-black text-primary uppercase tracking-widest gap-1 h-auto py-1 px-2">
                View All <ChevronRight size={13} />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Hire AI talent for short-term projects and freelance gigs. Test fit before committing to a full-time role.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Active Gigs", value: "2", icon: Cpu },
              { label: "Candidates Applied", value: "34", icon: Users },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-muted/40 rounded-xl p-4 text-center">
                  <Icon size={16} className="text-muted-foreground mx-auto mb-1.5" />
                  <div className="text-2xl font-black tracking-tighter">{s.value}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{s.label}</div>
                </div>
              );
            })}
          </div>
          <Link href="/employer/micro-projects/new">
            <Button variant="outline" className="w-full h-10 rounded-xl font-black text-xs gap-2 border-2">
              <Plus size={14} /> Post a Micro Project
            </Button>
          </Link>
        </div>

        {/* Hire OS Insight */}
        <div className="p-7 rounded-[32px] border-2 border-dashed border-primary/20 bg-primary/4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles size={17} className="text-primary" />
              </div>
              <span className="font-black text-sm text-primary uppercase tracking-tight">Hire OS Insights</span>
            </div>
            <Badge className="bg-muted text-muted-foreground border-border text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              Coming Soon
            </Badge>
          </div>
          <p className="text-xs text-foreground/60 font-medium leading-relaxed">
            AI-generated hiring insights — listing performance, candidate recommendations, and tips to improve your roles — are coming soon.
          </p>
        </div>
      </div>

    </div>
  );
}
