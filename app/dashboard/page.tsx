"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Briefcase, FileText, ArrowRight, Search, Brain, ExternalLink, Medal, Lock, MapPin, Clock,
  Download, ShieldCheck,
} from "lucide-react";
import { formatDate, CERT_META } from "@/lib/certificates";
import type { Certificate, CertificateType } from "@/lib/certificates";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import "./dashboard.css";

interface Job {
  id: string; title: string; company: string; location: string; remote_type: string;
  employment_type: string; access_type: "free" | "pro"; skills: string[]; application_url: string; created_at: string;
}

const ago = (iso: string) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d <= 0) return "Today";
  if (d === 1) return "1 day ago";
  return d < 30 ? `${d} days ago` : new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [search, setSearch] = useState("");
  const [myCerts, setMyCerts] = useState<Certificate[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/auth/login"); return; }

      const { data: profile } = await supabase
        .from("profiles").select("full_name, account_type").eq("id", session.user.id).single();
      if (profile?.account_type === "business") { router.replace("/employer/dashboard"); return; }
      setUserName(profile?.full_name ?? session.user.email ?? "there");

      const { data: sub } = await supabase.from("subscriptions").select("status").eq("user_id", session.user.id).single();
      setIsPro(sub?.status === "active" || sub?.status === "trialing");
      setLoading(false);

      supabase.from("jobs").select("id,title,company,location,remote_type,employment_type,access_type,skills,application_url,created_at")
        .eq("published", true).order("featured", { ascending: false }).order("created_at", { ascending: false }).limit(12)
        .then(({ data }) => { setJobs((data as Job[]) ?? []); setJobsLoading(false); });

      try {
        const res = await fetch("/api/user/certificates", { headers: { Authorization: `Bearer ${session.access_token}` } });
        const json = await res.json();
        if (json.data) setMyCerts(json.data);
      } catch { /* non-fatal */ } finally { setCertsLoading(false); }
    });
  }, [router]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? jobs.filter((j) => `${j.title} ${j.company} ${(j.skills ?? []).join(" ")}`.toLowerCase().includes(q)) : jobs;
    return list.slice(0, 4);
  }, [jobs, search]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-7 w-7 rounded-full border-2 animate-spin" style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />
        </div>
      </DashboardLayout>
    );
  }

  const firstName = userName?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout>
      <div className={`ch db ${serif.variable} ${mono.variable} ${display.variable}`}>
        {/* welcome */}
        <section className="db-hero">
          <div>
            <p className="db-eyebrow">Your Counts AI career hub</p>
            <h1>{greeting}, <em>{firstName}.</em></h1>
            <p className="db-sub">Your next opportunity starts here. Pick up where you left off.</p>
            <div className="db-btns">
              <Link href="/jobs" className="btn db-primary"><Search size={14} /> Browse Jobs <ArrowRight size={13} /></Link>
            </div>
          </div>
        </section>

        {/* career tools */}
        <section className="db-tools" aria-label="Career tools">
          <Link href="/profile/edit" className="db-tool">
            <span><FileText size={18} /></span>
            <b>Resume Builder</b><small>Build a CV that gets noticed</small><ArrowRight size={15} />
          </Link>
          <Link href="/career-scan" className="db-tool">
            <span><Brain size={18} /></span>
            <b>Resume Analyser</b><small>AI feedback and suggestions</small><ArrowRight size={15} />
          </Link>
        </section>

        <div className="db-cols">
          {/* suggested jobs */}
          <section className="db-card" aria-labelledby="db-jobs">
            <div className="db-head">
              <div><h2 id="db-jobs">Suggested Jobs</h2><p>AI and engineering roles from the platform</p></div>
              <Link href="/jobs" className="db-all">View all <ArrowRight size={12} /></Link>
            </div>
            <div className="db-search">
              <Search size={14} aria-hidden="true" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suggested roles…" aria-label="Search suggested roles" />
            </div>
            {jobsLoading ? (
              <p className="db-muted">Loading roles…</p>
            ) : shown.length === 0 ? (
              <div className="db-empty">
                <Briefcase size={26} />
                <b>{search ? "No matching roles" : "No open roles right now"}</b>
                <p>{search ? "Try a different search." : "New roles are added regularly. Join the talent pool to hear about future roles."}</p>
                <Link href={search ? "/jobs" : "/jobs#talent-pool"} className="btn btn-dark btn-sm">{search ? "Browse all jobs" : "Join the talent pool"}</Link>
              </div>
            ) : (
              <ul className="db-jobs">
                {shown.map((job) => {
                  const locked = job.access_type === "pro" && !isPro;
                  return (
                    <li key={job.id}>
                      <span className="db-logo" aria-hidden="true">{(job.company || "?")[0]}</span>
                      <div className="db-job-main">
                        <b>{job.title}{locked && <Lock size={12} />}</b>
                        <small>{job.company}</small>
                        <span className="db-meta">
                          {job.location && <i><MapPin size={11} /> {job.location}</i>}
                          {job.employment_type && <i><Clock size={11} /> {job.employment_type}</i>}
                          <i>{ago(job.created_at)}</i>
                        </span>
                      </div>
                      {locked ? (
                        <Link href="/pricing" className="btn btn-dark btn-sm"><Lock size={11} /> Unlock</Link>
                      ) : job.application_url ? (
                        <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm">Apply <ExternalLink size={11} /></a>
                      ) : (
                        <Link href="/jobs" className="btn btn-ghost btn-sm">View</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="db-side">
            {/* certificates */}
            <section className="db-card" id="certificates" aria-labelledby="db-certs">
              <div className="db-head">
                <div><h2 id="db-certs">My Certificates</h2><p>Credentials you have earned through Counts AI</p></div>
                <Link href="/verify" className="db-all">Verify <ArrowRight size={12} /></Link>
              </div>
              {certsLoading ? (
                <p className="db-muted">Loading certificates…</p>
              ) : myCerts.length === 0 ? (
                <div className="db-empty compact">
                  <Medal size={24} />
                  <b>No certificates yet</b>
                  <p>Complete the Counts AI programme to earn your credentials.</p>
                  <Link href="/training" className="btn btn-dark btn-sm">View programme</Link>
                </div>
              ) : (
                <ul className="db-certs">
                  {myCerts.map((cert) => {
                    const meta = CERT_META[cert.certificate_type as CertificateType];
                    const active = cert.status === "active";
                    return (
                      <li key={cert.id}>
                        <span className="db-cico"><ShieldCheck size={16} /></span>
                        <div>
                          <b>{meta?.label ?? cert.certificate_type} <em className={active ? "ok" : "bad"}>{active ? "Active" : "Revoked"}</em></b>
                          <small>{cert.certificate_id} · Issued {formatDate(cert.issue_date)}</small>
                        </div>
                        <span className="db-cbtn">
                          <a href={`/certificate-view/${cert.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><ExternalLink size={11} /> View</a>
                          <a href={`/certificate-view/${cert.id}?print=1`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" aria-label="Download certificate"><Download size={11} /></a>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
