"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import {
  ArrowRight, CheckCircle2, Brain, Wrench, Rocket,
  Globe, Code2, Users, Zap, Shield, ChevronDown,
} from "lucide-react";

import type { Metadata } from "next";

const MONTH1_TOPICS = [
  "Generative AI fundamentals", "Large Language Models (LLMs)",
  "Prompt engineering", "OpenAI, Claude & Gemini APIs",
  "RAG (Retrieval-Augmented Generation)", "Embeddings & vector databases",
  "AI agents & agentic workflows", "Tool calling & function calling",
  "Multi-agent systems", "AI application development",
  "AI automation pipelines", "Evaluation & responsible AI",
];

const MONTH2_TOPICS = [
  "Customer problem discovery", "Technical solution design",
  "AI integrations & APIs", "Backend development",
  "Frontend integration", "Databases & storage",
  "Cloud deployment & Docker", "Production AI systems",
  "AI agents in business workflows", "Business automation",
  "Working with clients", "Technical communication",
];

const MONTH3_TOPICS = [
  "AI application projects", "AI agent development",
  "Internal tooling", "Client projects (where appropriate)",
  "AI research & experimentation", "Software engineering",
  "Product development", "Remote collaboration",
];

const OUTCOMES = [
  { icon: Brain,  text: "Deep understanding of modern AI engineering" },
  { icon: Code2,  text: "Hands-on experience building AI applications and agents" },
  { icon: Wrench, text: "Practical skills deploying AI into real business environments" },
  { icon: Rocket, text: "Remote work experience with a UK-based AI consultancy" },
  { icon: Globe,  text: "A portfolio of real projects to show employers" },
  { icon: Users,  text: "A network of AI professionals and engineers" },
];

const CERTS = [
  { id: "CAI-GENAI", label: "GenAI & Agentic AI", month: "Month 1", color: "#079DB3", bg: "#e3f7fb" },
  { id: "CAI-FDE",   label: "Forward Deployed Engineering", month: "Month 2", color: "#079DB3", bg: "#E7F5F4" },
  { id: "CAI-FDE-INT", label: "FDE Internship", month: "Month 3", color: "#1f9d63", bg: "#e8f8f1" },
];

const FAQS = [
  { q: "Who is this program for?", a: "Students, recent graduates, and career changers who want to build practical AI engineering skills and gain real work experience. No prior AI experience is required — but basic programming knowledge is helpful." },
  { q: "Is this program remote?", a: "Yes. The program is fully remote. Month 3 (the internship) is conducted remotely with the Counts AI UK team." },
  { q: "What happens after the program?", a: "Graduates receive a program completion certificate and a reference from Counts AI. Many use their portfolio and experience to apply for AI engineering roles through the Counts AI Jobs platform." },
  { q: "Is there a cost?", a: "Program fees and cohort details are shared after your application is reviewed. Apply to receive full program information." },
  { q: "When does the next cohort start?", a: "Cohorts run on a rolling basis. Apply now and we'll confirm your start date after reviewing your application." },
];

export default function TrainingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <PublicNavbar active="AI Programs" />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #07111f 0%, #0a2030 55%, #0d2a38 100%)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: "60vw", height: "40vh", background: "radial-gradient(ellipse at center, rgba(0,151,178,0.12) 0%, transparent 65%)" }}
        />

        <div className="cai-container relative z-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-[11px] font-bold uppercase tracking-widest"
            style={{ background: "rgba(0,151,178,0.15)", border: "1px solid rgba(0,151,178,0.3)", color: "#00b4d4" }}
          >
            <Zap size={11} /> 3-Month AI Engineering Program
          </div>

          <h1 className="display-xl text-white mb-5 max-w-3xl mx-auto">
            3 Months.{" "}
            <span style={{ color: "#00b4d4" }}>Real AI Skills.</span>
            <br />
            Real Experience.
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Go from learning AI to working on real-world AI projects — a structured training and internship experience with Counts AI&apos;s UK team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/training/apply"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "var(--teal)" }}
            >
              Apply Now <ArrowRight size={14} />
            </Link>
            <a
              href="#program"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              View Program
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </section>

      {/* ── OUTCOMES ── */}
      <section className="py-16" style={{ background: "var(--background)" }}>
        <div className="cai-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OUTCOMES.map((o) => (
              <div
                key={o.text}
                className="flex items-start gap-3 rounded-2xl p-5 transition-all hover:shadow-sm"
                style={{ background: "white", border: "1.5px solid #dbe9eb" }}
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#e3f7fb" }}>
                  <o.icon size={16} style={{ color: "var(--teal)" }} />
                </div>
                <p className="text-sm font-semibold leading-snug mt-1" style={{ color: "#0d2030" }}>{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section id="certs" className="py-16 border-y" style={{ borderColor: "#dbe9eb", background: "var(--surface-2)" }}>
        <div className="cai-container">
          <div className="text-center mb-10">
            <div className="label-overline mb-2" style={{ color: "var(--teal)" }}>Credentials</div>
            <h2 className="display-md text-[#07111f]">Three verifiable certificates.</h2>
            <p className="text-sm mt-2" style={{ color: "#486870" }}>Each issued on completion of its respective month. Verified on countsai.com.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {CERTS.map(c => (
              <div
                key={c.id}
                className="rounded-2xl p-5 text-center"
                style={{ background: c.bg, border: `1.5px solid ${c.color}25` }}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: c.color + "20" }}
                >
                  <Shield size={20} style={{ color: c.color }} />
                </div>
                <div className="label-overline mb-1" style={{ color: c.color }}>{c.month}</div>
                <div className="text-sm font-bold mb-1" style={{ color: "#07111f" }}>{c.label}</div>
                <div className="text-[10px] font-mono font-bold" style={{ color: c.color + "aa" }}>{c.id}-XXXX</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE-MONTH PROGRAM ── */}
      <section id="program" className="py-20" style={{ background: "white" }}>
        <div className="cai-container">
          <div className="text-center mb-14">
            <div className="label-overline mb-2" style={{ color: "var(--teal)" }}>The Program</div>
            <h2 className="display-md text-[#07111f]">What you&apos;ll learn and build.</h2>
          </div>

          <div className="space-y-6">
            {/* Month 1 */}
            <div id="month1" className="scroll-mt-24 rounded-2xl overflow-hidden" style={{ border: "1.5px solid #dbe9eb" }}>
              <div className="px-6 py-5 flex items-center gap-4" style={{ background: "#e3f7fb", borderBottom: "1.5px solid #b5e9f2" }}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0" style={{ background: "#079DB3" }}>
                  01
                </div>
                <div>
                  <div className="label-overline" style={{ color: "#079DB3" }}>Month One</div>
                  <h3 className="text-lg font-bold" style={{ color: "#07111f", letterSpacing: "-0.02em" }}>Generative AI & Agentic AI</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#486870" }}>
                  Focus on modern AI engineering. Learn to build with the most capable AI models and develop real applications using agents, RAG, and agentic workflows.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {MONTH1_TOPICS.map(t => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#e3f7fb", color: "#0a3a44" }}>
                      <CheckCircle2 size={10} style={{ color: "#079DB3" }} /> {t}
                    </span>
                  ))}
                </div>
                <div className="pt-4 border-t flex items-center gap-2" style={{ borderColor: "#dbe9eb" }}>
                  <Shield size={13} style={{ color: "#079DB3" }} />
                  <p className="text-sm font-bold" style={{ color: "#079DB3" }}>Outcome: Build working AI applications from scratch. GenAI certificate issued.</p>
                </div>
              </div>
            </div>

            {/* Month 2 */}
            <div id="month2" className="scroll-mt-24 rounded-2xl overflow-hidden" style={{ border: "1.5px solid #dbe9eb" }}>
              <div className="px-6 py-5 flex items-center gap-4" style={{ background: "#E7F5F4", borderBottom: "1.5px solid #fde2d2" }}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0" style={{ background: "#079DB3" }}>
                  02
                </div>
                <div>
                  <div className="label-overline" style={{ color: "#079DB3" }}>Month Two</div>
                  <h3 className="text-lg font-bold" style={{ color: "#07111f", letterSpacing: "-0.02em" }}>Forward Deployed Engineer Training</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#486870" }}>
                  Learn to take AI technology and deploy it into real business environments. A unique blend of software engineering, AI engineering, solutions engineering, and consulting.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {MONTH2_TOPICS.map(t => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#fff1ec", color: "#0a3a44" }}>
                      <CheckCircle2 size={10} style={{ color: "#079DB3" }} /> {t}
                    </span>
                  ))}
                </div>
                <div className="pt-4 border-t flex items-center gap-2" style={{ borderColor: "#fde2d2" }}>
                  <Shield size={13} style={{ color: "#079DB3" }} />
                  <p className="text-sm font-bold" style={{ color: "#079DB3" }}>Outcome: Deploy AI into real businesses. FDE certificate issued.</p>
                </div>
              </div>
            </div>

            {/* Month 3 */}
            <div id="month3" className="scroll-mt-24 rounded-2xl overflow-hidden" style={{ border: "1.5px solid #dbe9eb" }}>
              <div className="px-6 py-5 flex items-center gap-4" style={{ background: "#e8f8f1", borderBottom: "1.5px solid #bbdfd0" }}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0" style={{ background: "#1f9d63" }}>
                  03
                </div>
                <div>
                  <div className="label-overline" style={{ color: "#1f9d63" }}>Month Three</div>
                  <h3 className="text-lg font-bold" style={{ color: "#07111f", letterSpacing: "-0.02em" }}>Counts AI Remote Internship</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#486870" }}>
                  Put your skills to work. Students contribute to real projects remotely with the Counts AI UK team — AI applications, agents, automation, and software engineering.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {MONTH3_TOPICS.map(t => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#e0f5eb", color: "#0a3a44" }}>
                      <CheckCircle2 size={10} style={{ color: "#1f9d63" }} /> {t}
                    </span>
                  ))}
                </div>
                <div className="pt-4 border-t flex items-center gap-2" style={{ borderColor: "#bbdfd0" }}>
                  <Shield size={13} style={{ color: "#1f9d63" }} />
                  <p className="text-sm font-bold" style={{ color: "#1f9d63" }}>Outcome: Real remote work experience with a UK AI consultancy. Internship certificate issued.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20" style={{ background: "var(--surface-1)" }}>
        <div className="cai-container max-w-3xl">
          <div className="text-center mb-10">
            <div className="label-overline mb-2" style={{ color: "var(--teal)" }}>FAQ</div>
            <h2 className="display-md text-[#07111f]">Common questions.</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div
                key={f.q}
                className="rounded-2xl overflow-hidden"
                style={{ border: "1.5px solid #dbe9eb", background: "white" }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="text-sm font-bold" style={{ color: "#07111f" }}>{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 shrink-0 ml-4 ${openFaq === i ? "rotate-180" : ""}`}
                    style={{ color: "#85a0a4" }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t" style={{ borderColor: "#f0f4f5" }}>
                    <p className="text-sm leading-relaxed pt-4" style={{ color: "#486870" }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #07111f 0%, #0a2030 60%, #0d3a4a 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="cai-container relative z-10 text-center">
          <div className="label-overline mb-4" style={{ color: "#00b4d4" }}>Apply today</div>
          <h2 className="display-md text-white mb-4">Ready to start your AI career?</h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            We review every application and respond within 3 business days.
          </p>
          <Link
            href="/training/apply"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "var(--teal)" }}
          >
            Apply Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
