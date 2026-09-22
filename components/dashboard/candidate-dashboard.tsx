"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useRole } from "@/lib/role-context";
import { supabase } from "@/lib/supabase";
import { useCandidateProfile } from "@/lib/use-candidate-profile";
import { MOCK_JOBS } from "@/lib/mock-data";
import { ResumeScoreResult, JobMatchResult, CoverLetterResult, OutreachResult } from "@/lib/rocket-boost-ai";
import {
  LayoutDashboard, Zap, Briefcase, FileText, TrendingUp, Settings,
  Crown, LogOut, Sparkles, BarChart2, AlertCircle, User, Menu, X,
  Link2, Copy, Check, RefreshCw, ChevronDown, Loader2,
  CheckCircle2, MapPin, Send, ArrowRight, Wand2,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  return s >= 80 ? "#1f9d63" : s >= 50 ? "#f2a93b" : "#e8624f";
}

type Panel = "cover-letter" | "outreach" | null;

const NAV_ITEMS = [
  { label: "Dashboard",    icon: LayoutDashboard, href: "/dashboard" },
  { label: "Job Analyzer", icon: Zap,             href: "/dashboard/jobs" },
  { label: "Applications", icon: Briefcase,       href: "/dashboard/applications" },
  { label: "Resume",       icon: FileText,        href: "/dashboard/resume" },
  { label: "Career",       icon: TrendingUp,      href: "/dashboard/career" },
  { label: "Settings",     icon: Settings,        href: "/dashboard/settings" },
];

// ── sub-components ────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const color = scoreColor(score);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e3f1f2" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="absolute text-sm font-black" style={{ color }}>{score}</span>
    </div>
  );
}

interface SidebarProps {
  currentPlan: string;
  pathname: string;
  onClose?: () => void;
}

function Sidebar({ currentPlan, pathname, onClose }: SidebarProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#ffffff", borderRight: "1px solid #D9E5E7" }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 shrink-0" style={{ borderBottom: "1px solid #EEF4F4" }}>
        <Image src="/logo-light.png" alt="Counts AI" width={125} height={34} className="object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2 pt-3">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: active ? "#079DB3" : "transparent",
                color: active ? "white" : "#4E6670",
              }}>
              <Icon size={16} />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 shrink-0 space-y-2" style={{ borderTop: "1px solid #EEF4F4" }}>
        {currentPlan === "Premium" ? (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black"
            style={{ background: "#E7F5F4", color: "#079DB3" }}>
            <Crown size={13} /> Premium Active
          </div>
        ) : (
          <Link href="/pricing" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black text-white transition-opacity hover:opacity-90"
            style={{ background: "#071A24" }}>
            <Crown size={13} /> Upgrade to Premium
          </Link>
        )}
        <button onClick={() => supabase.auth.signOut()}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ color: "#8AABAE" }}>
          <LogOut size={13} /> Log out
        </button>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export function CandidateDashboard() {
  const { currentPlan } = useStore();
  const { user }        = useRole();
  const { profile, loading: profileLoading, isReady } = useCandidateProfile();
  const pathname = usePathname();

  const firstName = user.full_name?.split(" ")[0] ?? "there";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [jobUrl,     setJobUrl]     = useState("");

  // AI state
  const [running,    setRunning]    = useState(false);
  const [analysed,   setAnalysed]   = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [resumeScore, setResumeScore] = useState<ResumeScoreResult | null>(null);
  const [jobMatches,  setJobMatches]  = useState<JobMatchResult["matches"] | null>(null);

  // Per-job panel state
  const [expanded,       setExpanded]       = useState<Record<string, Panel>>({});
  const [coverLetters,   setCoverLetters]   = useState<Record<string, CoverLetterResult>>({});
  const [coverLoading,   setCoverLoading]   = useState<Record<string, boolean>>({});
  const [outreachMap,    setOutreachMap]    = useState<Record<string, OutreachResult>>({});
  const [outreachLoading,setOutreachLoading]= useState<Record<string, boolean>>({});
  const [copied,         setCopied]         = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
  };

  const runAnalysis = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      const [scoreRes, matchRes] = await Promise.all([
        fetch("/api/rocket-boost/resume-score", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile }),
        }),
        fetch("/api/rocket-boost/job-match", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile }),
        }),
      ]);
      if (!scoreRes.ok || !matchRes.ok) throw new Error("AI analysis failed — please try again.");
      const [scoreData, matchData] = await Promise.all([scoreRes.json(), matchRes.json()]);
      setResumeScore(scoreData);
      setJobMatches([...matchData.matches].sort((a: { score: number }, b: { score: number }) => b.score - a.score));
      setAnalysed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setRunning(false);
    }
  }, [profile, running]);

  const generateCoverLetter = async (jobId: string) => {
    setCoverLoading((p) => ({ ...p, [jobId]: true }));
    try {
      const res = await fetch("/api/rocket-boost/cover-letter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, jobId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoverLetters((p) => ({ ...p, [jobId]: data }));
    } catch { /* silent — user can retry */ } finally {
      setCoverLoading((p) => ({ ...p, [jobId]: false }));
    }
  };

  const generateOutreach = async (jobId: string) => {
    setOutreachLoading((p) => ({ ...p, [jobId]: true }));
    try {
      const res = await fetch("/api/rocket-boost/outreach", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, jobId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutreachMap((p) => ({ ...p, [jobId]: data }));
    } catch { /* silent — user can retry */ } finally {
      setOutreachLoading((p) => ({ ...p, [jobId]: false }));
    }
  };

  const togglePanel = (jobId: string, panel: Panel) => {
    const isOpen = expanded[jobId] === panel;
    setExpanded((p) => ({ ...p, [jobId]: isOpen ? null : panel }));
    if (!isOpen) {
      if (panel === "cover-letter" && !coverLetters[jobId]) generateCoverLetter(jobId);
      if (panel === "outreach"     && !outreachMap[jobId])  generateOutreach(jobId);
    }
  };

  const allMissing = Array.from(new Set((jobMatches ?? []).flatMap((m) => m.missing_skills)));

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex overflow-hidden" style={{ height: "100vh", background: "#FAFCFC" }}>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col shrink-0 overflow-hidden" style={{ width: 232 }}>
        <Sidebar currentPlan={currentPlan} pathname={pathname} />
      </aside>

      {/* ── Mobile sidebar ── */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden" style={{ width: 240 }}>
            <Sidebar currentPlan={currentPlan} pathname={pathname} onClose={() => setMobileOpen(false)} />
            <button className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: "rgba(255,255,255,0.5)" }}
              onClick={() => setMobileOpen(false)}>
              <X size={18} />
            </button>
          </aside>
        </>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-14 bg-white"
          style={{ borderBottom: "1px solid #D9E5E7" }}>
          <button className="lg:hidden p-1.5 rounded-lg transition-colors hover:bg-[#F5F8F8]"
            style={{ color: "#071A24" }} onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: "#8AABAE" }}>
            AI Career Dashboard
          </span>
          <div className="ml-auto flex items-center gap-3">
            {currentPlan === "Premium" && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black"
                style={{ background: "#E7F5F4", color: "#079DB3" }}>
                <Crown size={11} /> Premium
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                style={{ background: "#079DB3" }}>
                {firstName[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:block text-sm font-semibold" style={{ color: "#071A24" }}>{firstName}</span>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

            {/* ── Hero: URL analyser + welcome ── */}
            <div className="rounded-2xl overflow-hidden relative"
              style={{ background: "#ffffff", border: "1.5px solid #D9E5E7" }}>
              {/* Dotted grid */}
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(0,151,178,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative z-10 px-6 py-7 sm:px-8 sm:py-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#079DB3" }}>
                  AI Career Dashboard
                </p>
                <h2 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: "#071A24" }}>
                  Welcome back, {firstName}.
                </h2>
                <p className="text-sm font-medium mb-6" style={{ color: "#4E6670" }}>
                  {analysed ? "Your AI analysis is ready — review below." : "Paste any job URL and let AI do the work instantly."}
                </p>

                {/* URL input row */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl"
                    style={{ background: "#F5F8F8", border: "1.5px solid #D9E5E7" }}>
                    <Link2 size={15} style={{ color: "#8AABAE", flexShrink: 0 }} />
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://linkedin.com/jobs/view/... or any job posting URL"
                      className="flex-1 bg-transparent text-sm font-medium outline-none"
                      style={{ color: "#071A24" }}
                    />
                  </div>
                  <button
                    onClick={runAnalysis}
                    disabled={running || profileLoading}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
                    style={{ background: "#071A24" }}>
                    {running
                      ? <><Loader2 size={15} className="animate-spin" /> Analysing…</>
                      : <><Zap size={15} /> Analyse</>}
                  </button>
                </div>
                <p className="text-[11px] mt-2.5" style={{ color: "#8AABAE" }}>
                  Works with LinkedIn · Indeed · Workday · Greenhouse · Lever · and more
                </p>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white"
                style={{ border: "1.5px solid #D7E2E4" }}>
                <AlertCircle size={17} style={{ color: "#079DB3" }} className="shrink-0" />
                <p className="text-sm font-semibold flex-1" style={{ color: "#0a3a44" }}>{error}</p>
                <button onClick={() => setError(null)} style={{ color: "#85a0a4" }}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* ── Profile onboarding ── */}
            {!profileLoading && !isReady && (
              <div className="bg-white rounded-3xl p-6" style={{ border: "1.5px solid #dbe9eb" }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "#e3f1f2" }}>
                    <User size={20} style={{ color: "#079DB3" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black mb-1" style={{ color: "#0a3a44" }}>
                      Complete your profile to unlock AI
                    </h3>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: "#5f7679" }}>
                      Your profile powers job matching, resume scoring, cover letters, and your career roadmap.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 mb-5">
                  {[
                    { label: "Headline & professional summary", done: !!profile.headline },
                    { label: "Skills (at least 3)",             done: profile.skills.length > 0 },
                    { label: "Target roles",                    done: profile.target_roles.length > 0 },
                    { label: "Work experience",                 done: profile.experience.length > 0 },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: step.done ? "#e6f6ee" : "#f4fafb", border: `1px solid ${step.done ? "#a7f0c8" : "#dbe9eb"}` }}>
                      {step.done
                        ? <CheckCircle2 size={16} style={{ color: "#1f9d63" }} className="shrink-0" />
                        : <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: "#dbe9eb" }} />}
                      <span className="text-sm font-medium" style={{ color: step.done ? "#1f9d63" : "#5f7679" }}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/skills-roadmap/profile"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                  style={{ background: "#079DB3" }}>
                  <User size={14} /> Build my profile <ArrowRight size={13} />
                </Link>
              </div>
            )}

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {([
                { label: "Resume Score", value: resumeScore ? `${resumeScore.score}` : "—", suffix: "/100", color: resumeScore ? scoreColor(resumeScore.score) : "#85a0a4", Icon: BarChart2 },
                { label: "Jobs Matched", value: jobMatches  ? `${jobMatches.length}`  : "—", suffix: "",     color: "#079DB3", Icon: Briefcase },
                { label: "Applications", value: "0",                                           suffix: " sent",color: "#7c3aed", Icon: Send },
                { label: "Profile",      value: isReady ? "Ready" : "Pending",                suffix: "",     color: isReady ? "#1f9d63" : "#079DB3", Icon: User },
              ] as const).map(({ label, value, suffix, color, Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-4 space-y-3" style={{ border: "1.5px solid #dbe9eb" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#e3f1f2" }}>
                    <Icon size={15} style={{ color: "#079DB3" }} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black" style={{ color }}>{value}</span>
                    {suffix && <span className="text-xs font-medium" style={{ color: "#85a0a4" }}>{suffix}</span>}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: "#85a0a4" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* ── Post-analysis or pre-analysis grid ── */}
            {analysed ? (
              <div className="grid lg:grid-cols-5 gap-5">

                {/* Left: job matches */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>
                      AI-Matched Jobs
                    </h2>
                    <button onClick={runAnalysis} disabled={running}
                      className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-opacity hover:opacity-70 disabled:opacity-40"
                      style={{ color: "#85a0a4" }}>
                      <RefreshCw size={11} /> Refresh
                    </button>
                  </div>

                  {jobMatches?.map((match) => {
                    const job  = MOCK_JOBS.find((j) => j.id === match.job_id);
                    if (!job) return null;
                    const panel = expanded[job.id];

                    return (
                      <div key={job.id} className="bg-white rounded-2xl p-5 space-y-4"
                        style={{ border: "1.5px solid #dbe9eb" }}>

                        {/* Job header */}
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-black" style={{ color: "#0a3a44" }}>{job.title}</h3>
                                <p className="text-[11px] font-bold mt-0.5" style={{ color: "#85a0a4" }}>{job.company_name}</p>
                                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium" style={{ color: "#85a0a4" }}>
                                  <MapPin size={10} className="shrink-0" />
                                  {job.location} · {job.remote_type} · {job.currency}{job.salary_min.toLocaleString()}–{job.salary_max.toLocaleString()}
                                </div>
                              </div>
                              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                style={{ border: `3px solid ${scoreColor(match.score)}` }}>
                                <span className="text-xs font-black" style={{ color: scoreColor(match.score) }}>
                                  {match.score}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs font-medium leading-relaxed" style={{ color: "#5f7679" }}>{match.summary}</p>

                        {/* Skill chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {match.matching_skills.map((s, i) => (
                            <span key={`m-${i}`} className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                              style={{ background: "#e6f6ee", color: "#1f9d63" }}>{s}</span>
                          ))}
                          {match.missing_skills.map((s, i) => (
                            <span key={`x-${i}`} className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                              style={{ background: "#E7F5F4", color: "#079DB3" }}>+ {s}</span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a href="#" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white"
                            style={{ background: "#079DB3" }}>
                            Apply Manually
                          </a>
                          <button onClick={() => togglePanel(job.id, "cover-letter")}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors"
                            style={{ background: panel === "cover-letter" ? "#079DB3" : "#e3f1f2", color: panel === "cover-letter" ? "white" : "#079DB3" }}>
                            <FileText size={11} /> Cover letter
                            <ChevronDown size={11} className={panel === "cover-letter" ? "rotate-180 transition-transform" : "transition-transform"} />
                          </button>
                          <button onClick={() => togglePanel(job.id, "outreach")}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors"
                            style={{ background: panel === "outreach" ? "#079DB3" : "#e3f1f2", color: panel === "outreach" ? "white" : "#079DB3" }}>
                            <Send size={11} /> Outreach
                            <ChevronDown size={11} className={panel === "outreach" ? "rotate-180 transition-transform" : "transition-transform"} />
                          </button>
                        </div>

                        {/* Cover letter panel */}
                        {panel === "cover-letter" && (
                          <div className="p-4 rounded-xl" style={{ background: "#f4fafb" }}>
                            {coverLoading[job.id] && !coverLetters[job.id] ? (
                              <div className="flex items-center justify-center gap-2 py-5">
                                <Loader2 size={16} className="animate-spin" style={{ color: "#079DB3" }} />
                                <span className="text-sm font-medium" style={{ color: "#85a0a4" }}>Generating cover letter…</span>
                              </div>
                            ) : coverLetters[job.id] ? (
                              <div className="space-y-3">
                                <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap" style={{ color: "#0a3a44" }}>
                                  {coverLetters[job.id].letter}
                                </p>
                                <div className="flex gap-2">
                                  <button onClick={() => copyText(`cl-${job.id}`, coverLetters[job.id].letter)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black"
                                    style={{ background: "#e3f1f2", color: "#079DB3" }}>
                                    {copied === `cl-${job.id}` ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                                  </button>
                                  <button onClick={() => generateCoverLetter(job.id)} disabled={coverLoading[job.id]}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black disabled:opacity-50"
                                    style={{ background: "#e3f1f2", color: "#079DB3" }}>
                                    <RefreshCw size={11} /> Regenerate
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}

                        {/* Outreach panel */}
                        {panel === "outreach" && (
                          <div className="p-4 rounded-xl space-y-3" style={{ background: "#f4fafb" }}>
                            {outreachLoading[job.id] && !outreachMap[job.id] ? (
                              <div className="flex items-center justify-center gap-2 py-5">
                                <Loader2 size={16} className="animate-spin" style={{ color: "#079DB3" }} />
                                <span className="text-sm font-medium" style={{ color: "#85a0a4" }}>Generating outreach message…</span>
                              </div>
                            ) : outreachMap[job.id] ? (
                              <div className="space-y-2.5">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#079DB3" }}>Subject</p>
                                  <p className="text-xs font-bold" style={{ color: "#0a3a44" }}>{outreachMap[job.id].subject}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#079DB3" }}>Message</p>
                                  <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap" style={{ color: "#0a3a44" }}>
                                    {outreachMap[job.id].message}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => copyText(`or-${job.id}`, `${outreachMap[job.id].subject}\n\n${outreachMap[job.id].message}`)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black"
                                    style={{ background: "#e3f1f2", color: "#079DB3" }}>
                                    {copied === `or-${job.id}` ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                                  </button>
                                  <button onClick={() => generateOutreach(job.id)} disabled={outreachLoading[job.id]}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black disabled:opacity-50"
                                    style={{ background: "#e3f1f2", color: "#079DB3" }}>
                                    <RefreshCw size={11} /> Regenerate
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right col: resume score + skill gaps + quick actions */}
                <div className="lg:col-span-2 space-y-4">

                  {/* Resume score */}
                  {resumeScore && (
                    <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: "1.5px solid #dbe9eb" }}>
                      <h3 className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>Resume Score</h3>
                      <div className="flex items-center gap-4">
                        <ScoreRing score={resumeScore.score} size={68} />
                        <div className="flex-1 space-y-2">
                          {([
                            ["Keywords", resumeScore.breakdown.keyword_match],
                            ["ATS",      resumeScore.breakdown.ats_formatting],
                            ["Impact",   resumeScore.breakdown.impact],
                            ["Skills",   resumeScore.breakdown.skills_alignment],
                          ] as [string, number][]).map(([l, v]) => (
                            <div key={l}>
                              <div className="flex justify-between text-[10px] font-medium mb-0.5" style={{ color: "#85a0a4" }}>
                                <span>{l}</span><span>{v}</span>
                              </div>
                              <div className="h-1.5 rounded-full" style={{ background: "#e3f1f2" }}>
                                <div className="h-1.5 rounded-full" style={{ width: `${v}%`, background: scoreColor(v) }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {resumeScore.improvements.slice(0, 2).map((imp, i) => (
                        <div key={i} className="p-3 rounded-xl" style={{ background: "#f4fafb" }}>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: "#079DB3" }}>{imp.area}</p>
                          <p className="text-xs font-semibold" style={{ color: "#0a3a44" }}>{imp.issue}</p>
                          <p className="text-xs font-medium" style={{ color: "#5f7679" }}>{imp.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skill gaps */}
                  {allMissing.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: "1.5px solid #dbe9eb" }}>
                      <h3 className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>Skills to Gain</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {allMissing.map((skill) => (
                          <span key={skill} className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl"
                            style={{ background: "#E7F5F4", color: "#079DB3", border: "1px solid #D7E2E4" }}>
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick actions */}
                  <div className="bg-white rounded-2xl p-5 space-y-1" style={{ border: "1.5px solid #dbe9eb" }}>
                    <h3 className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: "#0a3a44" }}>Quick Actions</h3>
                    {[
                      { label: "Improve CV with AI",       Icon: Wand2,      href: "/skills-roadmap/resume-score" },
                      { label: "Generate Career Roadmap",  Icon: TrendingUp, href: "/skills-roadmap/roadmap" },
                      { label: "Build Master Profile",     Icon: User,       href: "/skills-roadmap/profile" },
                      { label: "AI Skill Patches",         Icon: Sparkles,   href: "/skills-roadmap" },
                    ].map(({ label, Icon, href }) => (
                      <Link key={label} href={href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50 group"
                        style={{ color: "#0a3a44" }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#e3f1f2" }}>
                          <Icon size={13} style={{ color: "#079DB3" }} />
                        </div>
                        {label}
                        <ArrowRight size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#079DB3" }} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Pre-analysis: feature cards ── */
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { Icon: Zap,        title: "Job URL Analyser",  body: "Paste any job posting URL to get your match score, tailored CV, and cover letter instantly.", color: "#079DB3" },
                  { Icon: BarChart2,  title: "Resume Score",      body: "See your ATS score, keyword match, and get one-click AI rewrites for weak sections.",          color: "#7c3aed" },
                  { Icon: TrendingUp, title: "Career Roadmap",    body: "Get a personalised phase-by-phase plan to close skill gaps and land your target role faster.", color: "#1f9d63" },
                ].map(({ Icon, title, body, color }) => (
                  <div key={title} className="bg-white rounded-2xl p-6 space-y-3" style={{ border: "1.5px solid #dbe9eb" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}18` }}>
                      <Icon size={19} style={{ color }} />
                    </div>
                    <h3 className="text-sm font-black" style={{ color: "#0a3a44" }}>{title}</h3>
                    <p className="text-xs font-medium leading-relaxed" style={{ color: "#85a0a4" }}>{body}</p>
                    <button onClick={runAnalysis} disabled={running || !isReady || profileLoading}
                      className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-35"
                      style={{ color }}>
                      {running ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
                      {running ? "Running…" : "Run Analysis"}
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
