"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { ConsultationPopup } from "@/components/shared/consultation-popup";
import {
  ArrowRight, Search, MapPin, Clock, Briefcase, Star, Lock, ExternalLink, CheckCircle2,
  Bookmark, Globe, Sparkles, Brain, Cpu, Bot, Code2, BarChart3, Layers, Wifi, LayoutGrid, type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import "./jobs.css";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote_type: string;
  employment_type: string;
  salary_range: string;
  access_type: "free" | "pro";
  featured: boolean;
  skills: string[];
  description: string;
  application_url: string;
  closing_date: string | null;
  created_at: string;
}

const JOB_CATEGORIES = [
  "All", "AI Engineer", "ML Engineer", "Generative AI", "Agentic AI",
  "Software Engineer", "Data Scientist", "AI Product", "Remote",
];

const CAT_ICONS: Record<string, LucideIcon> = {
  "AI Engineer": Brain, "ML Engineer": Cpu, "Generative AI": Sparkles, "Agentic AI": Bot,
  "Software Engineer": Code2, "Data Scientist": BarChart3, "AI Product": Layers, Remote: Wifi,
};

const ago = (iso: string) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d <= 0) return "Today";
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allTitles, setAllTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isPro, setIsPro] = useState(false);
  const [showConsult, setShowConsult] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("cai-saved-jobs") ?? "[]"); } catch { return []; }
  });

  // Talent pool form
  const [tpName, setTpName] = useState("");
  const [tpEmail, setTpEmail] = useState("");
  const [tpPhone, setTpPhone] = useState("");
  const [tpSkills, setTpSkills] = useState("");
  const [tpMessage, setTpMessage] = useState("");
  const [tpSubmitting, setTpSubmitting] = useState(false);
  const [tpDone, setTpDone] = useState(false);
  const [tpErr, setTpErr] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: sub } = await supabase.from("subscriptions")
        .select("status, plan").eq("user_id", session.user.id).single();
      setIsPro(sub?.status === "active" || sub?.status === "trialing");
    });
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      let q = supabase.from("jobs").select("*").eq("published", true).order("featured", { ascending: false }).order("created_at", { ascending: false });
      if (search) q = q.ilike("title", `%${search}%`);
      if (category !== "All") q = q.ilike("title", `%${category}%`);
      const { data } = await q;
      setJobs(data ?? []);
      setLoading(false);
    };
    fetchJobs();
  }, [search, category]);

  // titles of every published role, used only for the real per-category counts
  useEffect(() => {
    supabase.from("jobs").select("title").eq("published", true).then(({ data }) => setAllTitles((data ?? []).map((r: { title: string }) => r.title)));
  }, []);

  const countFor = (c: string) => allTitles.filter((t) => t.toLowerCase().includes(c.toLowerCase())).length;
  const toggleSave = (id: string) => setSaved((s) => {
    const n = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
    try { localStorage.setItem("cai-saved-jobs", JSON.stringify(n)); } catch { /* ignore */ }
    return n;
  });
  const pick = (c: string) => { setCategory(c); document.getElementById("roles")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div className={`ch jb ${serif.variable} ${mono.variable} ${display.variable}`}>
      <PublicNavbar active="AI Jobs" />

      {/* hero */}
      <section className="jb-hero">
        <div className="wrap jb-hero-in">
          <div className="jb-hero-copy">
            <span className="jb-pill"><Briefcase size={12} /> AI Jobs</span>
            <h1>Find Your Place in <em>the AI Economy.</em></h1>
            <p>AI and software engineering roles from companies hiring the next generation of AI talent: remote, international, free and pro listings.</p>
            <form className="jb-search" role="search" onSubmit={(e) => { e.preventDefault(); document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" }); }}>
              <Search size={17} aria-hidden="true" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles, skills, companies..." aria-label="Search roles" />
              <button type="submit" className="jb-go">Search</button>
            </form>
            <div className="jb-chips" role="group" aria-label="Filter by category">
              {JOB_CATEGORIES.map((c) => (
                <button key={c} type="button" className={c === category ? "on" : ""} aria-pressed={c === category} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* highlights */}
      <section className="jb-strip" aria-label="Platform highlights">
        <ul className="wrap">
          <li><Briefcase size={20} /><span><b>{allTitles.length > 0 ? `${allTitles.length} open roles` : "AI & engineering roles"}</b><small>Published on the platform</small></span></li>
          <li><Globe size={20} /><span><b>International opportunities</b><small>Remote and global listings</small></span></li>
          <li><Star size={20} /><span><b>Free and Pro listings</b><small>Upgrade to unlock every role</small></span></li>
          <li><LayoutGrid size={20} /><span><b>Talent pool</b><small>Be considered for future roles</small></span></li>
        </ul>
      </section>

      {/* roles */}
      <section className="sec jb-roles" id="roles">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow"><b>01</b> Open roles</div>
              <h2 className="h2 jb-h2">{category === "All" && !search ? <>Featured <em>AI roles.</em></> : <>Matching <em>roles.</em></>}</h2>
            </div>
            {(search || category !== "All") && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button>
            )}
          </div>

          {loading ? (
            <div className="jb-empty"><div className="jb-spin" /><p>Loading jobs…</p></div>
          ) : jobs.length === 0 ? (
            <div className="jb-empty">
              <Briefcase size={30} />
              <h3>No jobs found</h3>
              <p>{search || category !== "All" ? "Try a different search or category." : "New roles are added regularly. Check back soon."}</p>
              <a href="#talent-pool" className="btn btn-dark btn-sm">Join the talent pool</a>
            </div>
          ) : (
            <div className="jb-grid">
              {jobs.map((job) => {
                const locked = job.access_type === "pro" && !isPro;
                const isSaved = saved.includes(job.id);
                return (
                  <article key={job.id} className={`jb-card ${job.featured ? "feat" : ""}`}>
                    <div className="jb-top">
                      <span className="jb-logo" aria-hidden="true">{(job.company || "?")[0]}</span>
                      <span className="jb-co">{job.company}</span>
                      <button type="button" className={`jb-save ${isSaved ? "on" : ""}`} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${job.title} from saved` : `Save ${job.title}`} onClick={() => toggleSave(job.id)}>
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="jb-badges">
                      {job.featured && <span className="f"><Star size={9} /> Featured</span>}
                      <span className={job.access_type === "pro" ? "p" : "fr"}>{job.access_type === "pro" ? "Pro" : "Free"}</span>
                    </div>
                    <h3>{locked ? <>{job.title} <Lock size={13} /></> : job.title}</h3>
                    <ul className="jb-meta">
                      {job.location && <li><MapPin size={12} /> {job.location}</li>}
                      {job.remote_type && <li><Briefcase size={12} /> {job.remote_type}</li>}
                      {job.employment_type && <li><Clock size={12} /> {job.employment_type}</li>}
                    </ul>
                    {job.salary_range && !locked && <p className="jb-sal">{job.salary_range}</p>}
                    {job.skills?.length > 0 && (
                      <ul className="jb-tags">{job.skills.slice(0, 4).map((s) => <li key={s}>{s}</li>)}</ul>
                    )}
                    <div className="jb-foot">
                      <small>{ago(job.created_at)}</small>
                      {locked ? (
                        <Link href="/pricing" className="btn btn-dark btn-sm"><Lock size={12} /> Unlock Pro</Link>
                      ) : job.application_url ? (
                        <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm">Apply <ExternalLink size={12} /></a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* categories */}
      <section className="sec">
        <div className="wrap">
          <div className="eyebrow"><b>02</b> Explore by category</div>
          <h2 className="h2 jb-h2">Browse by <em>specialism.</em></h2>
          <div className="jb-cats">
            {JOB_CATEGORIES.filter((c) => c !== "All").map((c) => {
              const Icon = CAT_ICONS[c] ?? Briefcase;
              const n = countFor(c);
              return (
                <button key={c} type="button" className="jb-cat" onClick={() => pick(c)}>
                  <span><Icon size={20} /></span>
                  <b>{c}</b>
                  <small>{allTitles.length ? `${n} ${n === 1 ? "role" : "roles"}` : "View roles"}</small>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* pro */}
      {!isPro && (
        <section className="sec jb-pro">
          <div className="wrap jb-pro-in">
            <div>
              <div className="eyebrow"><b>03</b> Pro access</div>
              <h2 className="h2 jb-h2">Unlock Premium <em>Job Listings.</em></h2>
              <p className="lede" style={{ marginTop: 12 }}>Pro jobs include premium roles from AI-first companies not listed anywhere else. Upgrade to access every listing on the platform.</p>
            </div>
            <Link href="/pricing" className="btn btn-dark">Upgrade to Pro <ArrowRight size={14} /></Link>
          </div>
        </section>
      )}

      {/* talent pool */}
      <section id="talent-pool" className="jb-tp">
        <div className="wrap jb-tp-in">
          <div className="jb-tp-copy">
            <div className="eyebrow"><b>04</b> Talent pool</div>
            <h2>Submit for <em>future roles.</em></h2>
            <p>Don&apos;t see the right role right now? Join our talent pool. When a matching opportunity comes in, our team will reach out to you directly.</p>
            <ul>
              {["No job posting required", "Direct outreach from our team", "AI roles across all levels", "Remote & international opportunities"].map((f) => (
                <li key={f}><CheckCircle2 size={14} /> {f}</li>
              ))}
            </ul>
          </div>
          <div className="jb-tp-form">
            {tpDone ? (
              <div className="jb-done" role="status">
                <span>✓</span>
                <h3>You&apos;re in the pool!</h3>
                <p>We&apos;ll reach out when a matching role comes in.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!tpName || !tpEmail) { setTpErr("Name and email are required."); return; }
                  setTpSubmitting(true); setTpErr("");
                  try {
                    const res = await fetch("/api/talent-pool", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: tpName, email: tpEmail, phone: tpPhone, skills: tpSkills, message: tpMessage }),
                    });
                    if (res.ok) setTpDone(true);
                    else { const d = await res.json(); setTpErr(d.error || "Something went wrong."); }
                  } catch { setTpErr("Network error. Please try again."); }
                  finally { setTpSubmitting(false); }
                }}
              >
                <h3>Join the Talent Pool</h3>
                <input value={tpName} onChange={(e) => setTpName(e.target.value)} placeholder="Full name *" required aria-label="Full name" />
                <div className="two">
                  <input value={tpEmail} onChange={(e) => setTpEmail(e.target.value)} placeholder="Email *" type="email" required aria-label="Email" />
                  <input value={tpPhone} onChange={(e) => setTpPhone(e.target.value)} placeholder="Phone (optional)" type="tel" aria-label="Phone" />
                </div>
                <input value={tpSkills} onChange={(e) => setTpSkills(e.target.value)} placeholder="Key skills (e.g. Python, LLMs, MLOps)" aria-label="Key skills" />
                <textarea value={tpMessage} onChange={(e) => setTpMessage(e.target.value)} placeholder="Brief message: what kind of role are you looking for?" rows={3} aria-label="Message" />
                {tpErr && <p className="jb-err" role="alert">{tpErr}</p>}
                <button type="submit" disabled={tpSubmitting} className="btn btn-dark jb-submit">{tpSubmitting ? "Submitting…" : "Join the Talent Pool"}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
      {showConsult && <ConsultationPopup onClose={() => setShowConsult(false)} />}
    </div>
  );
}
