"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Briefcase, FileText, GraduationCap, ArrowRight,
  Search, Zap, Award, Brain, ExternalLink,
  Medal, Download, Share2, CheckCircle2, Shield,
} from "lucide-react";
import { linkedInAddUrl, linkedInShareUrl, formatDate, CERT_META } from "@/lib/certificates";
import type { Certificate, CertificateType } from "@/lib/certificates";

const SUGGESTED_JOBS = [
  { id: "s1", title: "AI Engineer",               company: "NeuralFlow UK",     location: "Remote",          type: "Full-time",  badge: "FREE", pro: false },
  { id: "s2", title: "ML Engineer",               company: "DataSphere Labs",   location: "London / Remote", type: "Full-time",  badge: "PRO",  pro: true  },
  { id: "s3", title: "Generative AI Developer",   company: "TechVision AI",     location: "Remote",          type: "Contract",   badge: "FREE", pro: false },
  { id: "s4", title: "Forward Deployed Engineer", company: "Counts AI",         location: "Remote",          type: "Full-time",  badge: "FREE", pro: false },
];

const CERTIFICATIONS = [
  { title: "Generative AI Fundamentals",    provider: "Counts AI", duration: "4 weeks", level: "Beginner",     color: "#079DB3" },
  { title: "AI Agent Development",          provider: "Counts AI", duration: "6 weeks", level: "Intermediate", color: "#079DB3" },
  { title: "Forward Deployed Engineering",  provider: "Counts AI", duration: "8 weeks", level: "Advanced",     color: "#1f9d63" },
  { title: "LLM & Prompt Engineering",      provider: "Counts AI", duration: "3 weeks", level: "Beginner",     color: "#7c3aed" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);
  const [isPro, setIsPro]         = useState(false);
  const [search, setSearch]       = useState("");
  const [myCerts, setMyCerts]     = useState<Certificate[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/auth/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, account_type")
        .eq("id", session.user.id)
        .single();

      if (profile?.account_type === "business") { router.replace("/employer/dashboard"); return; }

      setUserName(profile?.full_name ?? session.user.email ?? "there");

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", session.user.id)
        .single();
      setIsPro(sub?.status === "active" || sub?.status === "trialing");
      setLoading(false);

      try {
        const res = await fetch("/api/user/certificates", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const json = await res.json();
        if (json.data) setMyCerts(json.data);
      } catch {
        // non-fatal
      } finally {
        setCertsLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div
            className="h-7 w-7 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }}
          />
        </div>
      </DashboardLayout>
    );
  }

  const firstName = userName?.split(" ")[0] ?? "there";
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-8 space-y-7 max-w-5xl">

        {/* ── WELCOME BANNER ── */}
        <div
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--navy) 0%, #0d3a4a 100%)",
            border: "1px solid rgba(0,151,178,0.2)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,151,178,0.12) 0%, transparent 65%)" }}
          />
          <p className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
            {greeting},
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2" style={{ letterSpacing: "-0.025em" }}>
            {firstName}.
          </h1>
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
            Your AI career hub — browse jobs, build your resume, earn certifications.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/jobs"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white transition-all hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Briefcase size={12} /> Browse Jobs
            </Link>
            <Link
              href="/career-scan"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "var(--teal)", color: "white" }}
            >
              <Zap size={12} /> Analyse My Resume
            </Link>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Briefcase, title: "Browse AI Jobs",    desc: "Find your next AI role",          href: "/jobs",         color: "#079DB3", bg: "#e3f7fb" },
            { icon: FileText,  title: "Resume Builder",    desc: "Build a CV that gets noticed",    href: "/profile/edit", color: "#079DB3", bg: "#E7F5F4" },
            { icon: Brain,     title: "Resume Analyser",   desc: "AI-powered CV scoring & tips",    href: "/career-scan",  color: "#7c3aed", bg: "#f0eeff" },
          ].map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="rounded-2xl p-5 flex items-start gap-4 transition-all hover:shadow-md"
              style={{ background: "white", border: "1.5px solid #dbe9eb" }}
            >
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: a.bg }}>
                <a.icon size={17} style={{ color: a.color }} />
              </div>
              <div>
                <p className="text-sm font-bold mb-0.5" style={{ color: "#07111f" }}>{a.title}</p>
                <p className="text-xs" style={{ color: "#7fa8b0" }}>{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── MY CERTIFICATES ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold" style={{ color: "#07111f" }}>My Certificates</h2>
              <p className="text-xs mt-0.5" style={{ color: "#7fa8b0" }}>Credentials issued to you by Counts AI</p>
            </div>
          </div>

          {certsLoading ? (
            <div className="flex items-center gap-3 py-6" style={{ color: "#7fa8b0" }}>
              <div className="h-5 w-5 rounded-full border-2 animate-spin" style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />
              <span className="text-sm">Loading certificates…</span>
            </div>
          ) : myCerts.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ border: "1.5px dashed #c8dde0", background: "var(--surface-1)" }}
            >
              <Medal size={32} style={{ color: "#c8dde0", margin: "0 auto 12px" }} />
              <p className="text-sm font-bold mb-1" style={{ color: "#07111f" }}>No certificates yet</p>
              <p className="text-xs mb-4" style={{ color: "#7fa8b0" }}>
                Complete the Counts AI program to earn your credentials.
              </p>
              <Link
                href="/training"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white"
                style={{ background: "var(--teal)" }}
              >
                View Program <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myCerts.map(cert => {
                const meta     = CERT_META[cert.certificate_type as CertificateType];
                const isActive = cert.status === "active";
                return (
                  <div
                    key={cert.id}
                    className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    style={{ background: "white", border: "1.5px solid #dbe9eb" }}
                  >
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "#e3f7fb" }}
                    >
                      <Shield size={17} style={{ color: "var(--teal)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-sm font-bold" style={{ color: "#07111f" }}>{meta?.label ?? cert.certificate_type}</p>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: isActive ? "#e8f8f1" : "#fef0ef",
                            color: isActive ? "#1f9d63" : "#c0392b",
                          }}
                        >
                          {isActive ? "Active" : "Revoked"}
                        </span>
                      </div>
                      <p className="text-xs font-mono" style={{ color: "#7fa8b0" }}>
                        {cert.certificate_id} · Issued {formatDate(cert.issue_date)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <a
                        href={`/certificate-view/${cert.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ background: "#e3f7fb", color: "var(--teal)" }}
                      >
                        <ExternalLink size={11} /> View
                      </a>
                      <a
                        href={`/certificate-view/${cert.id}?print=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ background: "var(--surface-1)", color: "#486870", border: "1px solid #dbe9eb" }}
                      >
                        <Download size={11} /> Download
                      </a>
                      {isActive && (
                        <a
                          href={linkedInAddUrl(cert)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ background: "#e8f0fb", color: "#0a66c2" }}
                        >
                          <ExternalLink size={11} /> LinkedIn
                        </a>
                      )}
                      {isActive && (
                        <a
                          href={linkedInShareUrl(cert)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ background: "var(--surface-1)", color: "#486870", border: "1px solid #dbe9eb" }}
                        >
                          <Share2 size={11} /> Share
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SUGGESTED JOBS ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold" style={{ color: "#07111f" }}>Suggested Jobs</h2>
              <p className="text-xs mt-0.5" style={{ color: "#7fa8b0" }}>AI & engineering roles matching your profile</p>
            </div>
            <Link
              href="/jobs"
              className="flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70"
              style={{ color: "var(--teal)" }}
            >
              View All <ArrowRight size={11} />
            </Link>
          </div>

          <div className="relative mb-4">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#86a0a8" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search suggested roles…"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ border: "1.5px solid #dbe9eb", color: "#07111f", background: "white" }}
              onFocus={e => { e.target.style.borderColor = "var(--teal)"; }}
              onBlur={e => { e.target.style.borderColor = "#dbe9eb"; }}
            />
          </div>

          <div className="space-y-3">
            {SUGGESTED_JOBS.filter(j =>
              !search ||
              j.title.toLowerCase().includes(search.toLowerCase()) ||
              j.company.toLowerCase().includes(search.toLowerCase())
            ).map(job => {
              const locked = job.pro && !isPro;
              return (
                <div
                  key={job.id}
                  className="rounded-2xl p-5 flex items-center justify-between gap-4"
                  style={{ background: "white", border: "1.5px solid #dbe9eb" }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold" style={{ color: locked ? "#86a0a8" : "#07111f" }}>{job.title}</p>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: job.pro ? "#E7F5F4" : "#e3f7fb", color: job.pro ? "#079DB3" : "var(--teal)" }}
                      >
                        {job.badge}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "#7fa8b0" }}>
                      {job.company} · {job.location} · {job.type}
                    </p>
                  </div>
                  {locked ? (
                    <Link
                      href="/pricing"
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white"
                      style={{ background: "#079DB3" }}
                    >
                      Unlock Pro
                    </Link>
                  ) : (
                    <Link
                      href="/jobs"
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
                      style={{ background: "var(--teal)" }}
                    >
                      Apply <ExternalLink size={11} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── AI CERTIFICATIONS (available programs) ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold" style={{ color: "#07111f" }}>AI Certifications</h2>
              <p className="text-xs mt-0.5" style={{ color: "#7fa8b0" }}>Earn credentials that matter in the AI economy</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CERTIFICATIONS.map(cert => (
              <div
                key={cert.title}
                className="rounded-2xl p-5 transition-all hover:shadow-sm"
                style={{ background: "white", border: "1.5px solid #dbe9eb" }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cert.color + "18" }}>
                    <Award size={15} style={{ color: cert.color }} />
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: cert.color + "15", color: cert.color }}
                  >
                    {cert.level}
                  </span>
                </div>
                <p className="text-sm font-bold mb-0.5" style={{ color: "#07111f" }}>{cert.title}</p>
                <p className="text-[11px] mb-3" style={{ color: "#7fa8b0" }}>{cert.provider} · {cert.duration}</p>
                <Link
                  href="/training"
                  className="inline-flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70"
                  style={{ color: cert.color }}
                >
                  Learn More <ArrowRight size={11} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROGRAM CTA ── */}
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: "var(--surface-2)", border: "1.5px solid #dbe9eb" }}
        >
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#e3f7fb" }}
          >
            <GraduationCap size={20} style={{ color: "var(--teal)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold mb-0.5" style={{ color: "#07111f" }}>Counts AI 3-Month AI Program</p>
            <p className="text-xs" style={{ color: "#7fa8b0" }}>
              GenAI · Forward Deployed Engineering · Remote Internship with a UK consultancy
            </p>
          </div>
          <Link
            href="/training"
            className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--teal)" }}
          >
            View Program <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
