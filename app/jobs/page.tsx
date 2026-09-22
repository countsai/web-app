"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { ConsultationPopup } from "@/components/shared/consultation-popup";
import { ArrowRight, Search, MapPin, Clock, Briefcase, Star, Lock, ExternalLink, Upload, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isPro, setIsPro] = useState(false);
  const [showConsult, setShowConsult] = useState(false);

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

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar active="AI Jobs" />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-14" style={{ background: "#0a3a44" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "80vh", background: "radial-gradient(ellipse at center, rgba(0,151,178,0.18) 0%, transparent 65%)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(0,151,178,0.2)", color: "#079DB3", border: "1px solid rgba(0,151,178,0.3)" }}>
            <Briefcase size={11} /> AI Jobs
          </div>
          <h1 className="font-black tracking-tight mb-5 text-white" style={{ fontSize: "clamp(28px, 5vw, 60px)", letterSpacing: "-0.04em" }}>
            Find Your Place in<br />the AI Economy.
          </h1>
          <p className="text-base max-w-xl mx-auto mb-8" style={{ color: "#85a0a4" }}>
            AI and software engineering roles from companies hiring the next generation of AI talent — remote, international, free and pro listings.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, skills, companies…"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none bg-white"
                style={{ border: "1.5px solid rgba(255,255,255,0.15)", color: "#0a3a44" }} />
            </div>
            <button className="px-6 py-3.5 rounded-xl text-sm font-black text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="sticky top-[68px] z-40 bg-white border-b" style={{ borderColor: "#dbe9eb" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
          {JOB_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all"
              style={{
                background: category === c ? "#079DB3" : "#f4fafb",
                color: category === c ? "white" : "#5f7679",
                border: "1.5px solid",
                borderColor: category === c ? "#079DB3" : "#dbe9eb",
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Job listings */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: "#079DB3", borderTopColor: "transparent" }} />
              <p className="text-sm" style={{ color: "#85a0a4" }}>Loading jobs…</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase size={32} className="mx-auto mb-4" style={{ color: "#dbe9eb" }} />
              <h3 className="text-lg font-black mb-2" style={{ color: "#0a3a44" }}>No jobs found</h3>
              <p className="text-sm mb-6" style={{ color: "#85a0a4" }}>
                {search || category !== "All" ? "Try a different search or category." : "New roles are added regularly. Check back soon."}
              </p>
              {(search || category !== "All") && (
                <button onClick={() => { setSearch(""); setCategory("All"); }}
                  className="px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider text-white"
                  style={{ background: "#079DB3" }}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => {
                const locked = job.access_type === "pro" && !isPro;
                return (
                  <div key={job.id} className="rounded-2xl p-6 bg-white transition-shadow hover:shadow-md"
                    style={{ border: "1.5px solid #dbe9eb" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {job.featured && (
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                              style={{ background: "#fff8ec", color: "#f59e0b" }}>
                              <Star size={9} /> Featured
                            </span>
                          )}
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                            style={{ background: job.access_type === "pro" ? "#fff1ec" : "#e3f7fb", color: job.access_type === "pro" ? "#079DB3" : "#079DB3" }}>
                            {job.access_type === "pro" ? "PRO" : "FREE"}
                          </span>
                        </div>
                        <h3 className="text-base font-black mb-1" style={{ color: locked ? "#85a0a4" : "#0a3a44" }}>
                          {locked ? (
                            <span className="flex items-center gap-2">{job.title} <Lock size={14} style={{ color: "#079DB3" }} /></span>
                          ) : job.title}
                        </h3>
                        <p className="text-sm font-semibold mb-3" style={{ color: "#5f7679" }}>{job.company}</p>
                        <div className="flex flex-wrap gap-3 text-xs mb-3" style={{ color: "#85a0a4" }}>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {job.employment_type}</span>
                          {job.remote_type && <span className="flex items-center gap-1"><Briefcase size={11} /> {job.remote_type}</span>}
                          {job.salary_range && <span>{job.salary_range}</span>}
                        </div>
                        {job.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {job.skills.slice(0, 6).map(s => (
                              <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{ background: "#f4fafb", color: "#5f7679" }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        {locked ? (
                          <Link href="/pricing"
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white"
                            style={{ background: "#079DB3" }}>
                            <Lock size={12} /> Unlock Pro
                          </Link>
                        ) : job.application_url ? (
                          <a href={job.application_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                            style={{ background: "#079DB3" }}>
                            Apply <ExternalLink size={12} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pro upsell */}
      {!isPro && (
        <section className="py-12" style={{ background: "#fff8f5" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-black uppercase tracking-widest"
              style={{ background: "#fff1ec", color: "#079DB3" }}>
              <Star size={11} /> Pro Access
            </div>
            <h3 className="text-2xl font-black mb-3" style={{ color: "#0a3a44" }}>Unlock Pro job listings.</h3>
            <p className="text-sm mb-6" style={{ color: "#5f7679" }}>
              Pro jobs include premium roles from AI-first companies not listed anywhere else. Upgrade to access every listing on the platform.
            </p>
            <Link href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}>
              Upgrade to Pro <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Talent Pool */}
      <section id="talent-pool" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl overflow-hidden" style={{ border: "1.5px solid #dbe9eb" }}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left — info */}
              <div className="p-8 flex flex-col justify-center" style={{ background: "#0a3a44" }}>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(0,151,178,0.2)" }}>
                  <Upload size={22} style={{ color: "#079DB3" }} />
                </div>
                <h3 className="text-2xl font-black mb-3 text-white" style={{ letterSpacing: "-0.03em" }}>
                  Submit for Future Roles
                </h3>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "#85a0a4" }}>
                  Don&apos;t see the right role right now? Join our talent pool. When a matching opportunity comes in, our team will reach out to you directly.
                </p>
                <ul className="space-y-2">
                  {["No job posting required", "Direct outreach from our team", "AI roles across all levels", "Remote & international opportunities"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs font-medium" style={{ color: "#85a0a4" }}>
                      <CheckCircle2 size={12} style={{ color: "#079DB3" }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — form */}
              <div className="p-8 bg-white">
                {tpDone ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl" style={{ background: "#079DB3" }}>✓</div>
                    <h4 className="text-lg font-black" style={{ color: "#0a3a44" }}>You&apos;re in the pool!</h4>
                    <p className="text-sm" style={{ color: "#5f7679" }}>We&apos;ll reach out when a matching role comes in.</p>
                  </div>
                ) : (
                  <form onSubmit={async (e) => {
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
                  }} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={tpName} onChange={e => setTpName(e.target.value)} placeholder="Full Name *" required
                        className="col-span-2 px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }} />
                      <input value={tpEmail} onChange={e => setTpEmail(e.target.value)} placeholder="Email *" type="email" required
                        className="px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }} />
                      <input value={tpPhone} onChange={e => setTpPhone(e.target.value)} placeholder="Phone (optional)" type="tel"
                        className="px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }} />
                    </div>
                    <input value={tpSkills} onChange={e => setTpSkills(e.target.value)} placeholder="Key skills (e.g. Python, LLMs, MLOps)"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }} />
                    <textarea value={tpMessage} onChange={e => setTpMessage(e.target.value)} placeholder="Brief message — what kind of role are you looking for?" rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }} />
                    {tpErr && <p className="text-xs text-red-500">{tpErr}</p>}
                    <button type="submit" disabled={tpSubmitting}
                      className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-wider text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                      style={{ background: "#079DB3" }}>
                      {tpSubmitting ? "Submitting…" : "Join the Talent Pool"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      {showConsult && <ConsultationPopup onClose={() => setShowConsult(false)} />}
    </div>
  );
}
