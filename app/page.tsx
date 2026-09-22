"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { ConsultationPopup } from "@/components/shared/consultation-popup";
import { TransformerHero } from "@/components/shared/transformer-hero";
import { SectionBoundary } from "@/components/shared/section-boundary";
import { PageGuideLines } from "@/components/shared/page-guide-lines";
import {
  ArrowRight, GraduationCap, Briefcase, Building2,
  Brain, Code2, Rocket, Globe, Users, CheckCircle2,
  Zap, X, Shield, Star, ArrowUpRight, Target, Trophy,
} from "lucide-react";

// ─── Static data ───────────────────────────────────────────────────────────────

const STATS = [
  { label: "students enrolled",  count: 840, suffix: "+" },
  { label: "AI jobs listed",     count: 500, suffix: "+" },
  { label: "business clients",   count: 60,  suffix: "+" },
  { label: "countries",          count: 38,  suffix: "" },
];

const TOOLS = [
  "OpenAI", "Anthropic", "Google Cloud", "AWS", "Azure",
  "LangChain", "Llama", "Pinecone", "Chroma", "Docker",
  "GitHub", "Vercel", "FastAPI", "Hugging Face", "Mistral",
];

const TRAINING_MONTHS = [
  {
    num: "01",
    title: "Generative AI & Agentic AI",
    color: "#079DB3",
    bg: "#E7F5F4",
    skills: ["LLMs & prompt engineering", "OpenAI, Claude, Gemini APIs", "RAG & vector databases", "AI agents & tool calling", "Multi-agent systems", "AI application development"],
    outcome: "Build working AI applications from scratch.",
  },
  {
    num: "02",
    title: "Forward Deployed Engineering",
    color: "#0A5963",
    bg: "#E7F5F4",
    skills: ["Customer problem discovery", "AI integrations & APIs", "Backend + frontend development", "Cloud deployment & Docker", "Production AI systems", "Technical communication"],
    outcome: "Deploy AI solutions into real businesses.",
  },
  {
    num: "03",
    title: "Counts AI Remote Internship",
    color: "#1f9d63",
    bg: "#e8f8f1",
    skills: ["AI apps & agents", "Client & internal projects", "Software engineering", "Product development", "AI research & automation", "Remote work, UK consultancy"],
    outcome: "Real experience at a UK AI consultancy.",
  },
];

const STUDENT_PROJECTS = [
  {
    num: "01", title: "Enterprise RAG Knowledge Assistant",
    desc: "Build an AI assistant that searches and answers questions from an organisation's internal document library using retrieval-augmented generation.",
    tech: ["LLMs", "Embeddings", "Vector Database", "RAG", "Python", "FastAPI"],
    color: "#079DB3",
  },
  {
    num: "02", title: "AI Customer Support Agent",
    desc: "Build an AI support agent capable of understanding customer questions, retrieving relevant information, and using tools to perform actions.",
    tech: ["LLM", "RAG", "Tool Calling", "Agentic AI", "APIs", "FastAPI"],
    color: "#0A5963",
  },
  {
    num: "03", title: "Multi-Agent Research System",
    desc: "Build multiple specialised AI agents that collaborate to research, analyse, and produce structured outputs from unstructured information.",
    tech: ["Agentic AI", "LLMs", "Tool Calling", "Web Search", "Orchestration"],
    color: "#079DB3",
  },
  {
    num: "04", title: "AI Recruitment Intelligence Platform",
    desc: "Build an AI system that analyses job descriptions and candidate profiles to assist with intelligent recruitment workflows.",
    tech: ["LLMs", "Embeddings", "Vector Search", "RAG", "Structured Outputs"],
    color: "#1f9d63",
  },
  {
    num: "05", title: "AI Marketing Intelligence Platform",
    desc: "Build an AI-powered marketing intelligence system capable of analysing campaigns and assisting with advertising strategy and automation.",
    tech: ["Generative AI", "Agents", "Data Analysis", "LLMs", "Automation"],
    color: "#071A24",
  },
  {
    num: "06", title: "Forward Deployed AI Solution",
    desc: "Take a real-world business problem and build a production-oriented AI solution from discovery through to deployment.",
    tech: ["Python", "FastAPI", "React/Next.js", "APIs", "LLMs", "Cloud", "Docker"],
    color: "#071A24",
  },
];

const BUSINESS_SERVICES = [
  { icon: Users,  title: "Remote AI Workforce",         desc: "Skilled remote AI engineers, no overhead." },
  { icon: Brain,  title: "AI Application Development",  desc: "Design and build AI-powered applications." },
  { icon: Zap,    title: "AI Agent Development",         desc: "Intelligent agents that automate complex tasks." },
  { icon: Rocket, title: "AI SaaS Development",          desc: "Turn AI ideas into scalable products." },
  { icon: Code2,  title: "AI Automation",                desc: "Automate business workflows intelligently." },
  { icon: Globe,  title: "AI Consulting",                desc: "Strategy, roadmap & implementation." },
];

const JOURNEY_STEPS = [
  { icon: Star,          label: "Discover",     desc: "Find your path in the AI economy" },
  { icon: GraduationCap, label: "Learn",         desc: "3-month AI engineering program" },
  { icon: Code2,         label: "Build",         desc: "Real projects with real technology" },
  { icon: Shield,        label: "Certify",       desc: "Verified certificates from Counts AI" },
  { icon: Trophy,        label: "Experience",    desc: "Remote internship with UK team" },
  { icon: Target,        label: "Get Hired",     desc: "AI roles matched to your profile" },
];

const TESTIMONIALS = [
  { quote: "The 3-month program gave me hands-on experience with real AI engineering tools. By month 3, I was working on actual projects with the Counts AI team.", name: "Training Program Graduate", role: "AI Engineer — Remote", audience: "student" },
  { quote: "Found a remote AI engineering role through Counts AI within three weeks of building my profile. The job matching surfaced opportunities I hadn't seen elsewhere.", name: "AI Jobs Platform User", role: "ML Engineer — Hired Remotely", audience: "jobseeker" },
  { quote: "We needed an AI agent built quickly for our operations team. Counts AI delivered a working prototype in two weeks. Now it's in production saving us hours every day.", name: "Operations Director", role: "SME — United Kingdom", audience: "business" },
  { quote: "Coming from a non-technical background, the structured approach made complex AI concepts genuinely accessible.", name: "Career Changer", role: "Now: Junior AI Engineer", audience: "student" },
  { quote: "The resume builder helped me present my skills in a way that actually got responses. My interview rate improved significantly.", name: "Software Engineer", role: "Transitioning to AI Roles", audience: "jobseeker" },
  { quote: "The team understood our business problem quickly and proposed a practical AI solution that's now live in production.", name: "Head of Technology", role: "Professional Services Firm", audience: "business" },
];

// ─── Dotted grid background ────────────────────────────────────────────────────

const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, #DCEBED 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

// ─── Interest modal ────────────────────────────────────────────────────────────

function JoinModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErr("Please enter your email."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/program-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (res.ok) setDone(true);
      else { const d = await res.json(); setErr(d.error || "Something went wrong."); }
    } catch { setErr("Network error."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: "rgba(7,26,36,0.65)", backdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl bg-white" style={{ border: "1px solid #D9E5E7" }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={15} style={{ color: "#8AABAE" }} />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-5" style={{ background: "#079DB3" }}>
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#071A24" }}>You&apos;re on the list!</h3>
            <p className="text-sm mb-6" style={{ color: "#4E6670" }}>
              Our team will contact you within 24 hours with program details.
            </p>
            <button onClick={onClose} className="px-8 py-3 rounded-full text-sm font-bold text-white" style={{ background: "#071A24" }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[11px] font-bold uppercase tracking-widest" style={{ background: "#e3f7fb", color: "#079DB3" }}>
              <GraduationCap size={11} /> 3-Month AI Program
            </div>
            <h3 className="text-2xl font-extrabold mb-2" style={{ color: "#071A24", letterSpacing: "-0.025em" }}>Express Your Interest</h3>
            <p className="text-sm mb-6" style={{ color: "#4E6670" }}>
              Tell us a bit about yourself. Our team will reach out with program details and pricing within 24 hours.
            </p>
            <form onSubmit={submit} className="space-y-3">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #D9E5E7", color: "#071A24" }}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; }}
                onBlur={e => { e.target.style.borderColor = "#D9E5E7"; }}
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email *"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #D9E5E7", color: "#071A24" }}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; }}
                onBlur={e => { e.target.style.borderColor = "#D9E5E7"; }}
              />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Your phone number (optional)"
                type="tel"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #D9E5E7", color: "#071A24" }}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; }}
                onBlur={e => { e.target.style.borderColor = "#D9E5E7"; }}
              />
              {err && <p className="text-xs text-red-500">{err}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full text-sm font-bold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                style={{ background: "#071A24" }}
              >
                {submitting ? "Sending…" : "Join Now — It's Free"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Adsoni metrics card ───────────────────────────────────────────────────────

const ADSONI_METRICS = [
  { label: "ROAS",          value: 3.8,  suffix: "×",  change: "+41%",  bar: 0.78 },
  { label: "Cost per Click","value": 0.31, suffix: "×", change: "−38%", bar: 0.52 },
  { label: "Ad Reach",      value: 2.1,  suffix: "×",  change: "+110%", bar: 0.86 },
];

function AdsoniMetricsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [vals, setVals]       = useState(ADSONI_METRICS.map(() => 0));
  const [bars, setBars]       = useState(ADSONI_METRICS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const dur = 1400;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVals(ADSONI_METRICS.map(m => parseFloat((ease * m.value).toFixed(2))));
      setBars(ADSONI_METRICS.map(m => ease * m.bar));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible]);

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden"
      style={{ background: "#062F36", border: "1px solid rgba(7,157,179,0.2)", padding: "1.75rem" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: "#079DB3", fontFamily: "monospace" }}>Adsoni · Ad Intelligence</div>
          <div className="text-sm font-semibold" style={{ color: "rgba(220,235,237,0.6)" }}>Campaign performance · Live analysis</div>
        </div>
        <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#1f9d63" }} />
      </div>

      {/* Metric rows */}
      <div className="space-y-4 mb-5">
        {ADSONI_METRICS.map((m, i) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: "rgba(220,235,237,0.4)" }}>{m.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black" style={{ color: "rgba(220,235,237,0.92)", fontVariantNumeric: "tabular-nums" }}>
                  {vals[i].toFixed(1)}{m.suffix}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(31,157,99,0.15)", color: "#4de89c" }}>
                  {m.change}
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(7,157,179,0.12)" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${bars[i] * 100}%`, background: i === 0 ? "#079DB3" : i === 1 ? "#0A5963" : "#1f9d63", transition: "width 1.4s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom label */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(7,157,179,0.1)" }}>
        <span className="text-[11px]" style={{ color: "rgba(220,235,237,0.3)" }}>AI-analysed across 6 ad platforms</span>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#079DB3" }}>adsoni.com</span>
      </div>
    </div>
  );
}

// ─── Visa Sponsors preview ─────────────────────────────────────────────────────

function VisaSponsorsPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{ background: "#f8fafc", border: "1.5px solid #D9E5E7", boxShadow: "0 24px 64px rgba(7,26,36,0.08)" }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#D9E5E7", background: "white" }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ef4444" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#f59e0b" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#22c55e" }} />
        <div className="flex-1 mx-4 h-6 rounded-md text-[11px] flex items-center px-3 font-mono" style={{ background: "#f4f6f8", color: "#8AABAE", border: "1px solid #D9E5E7" }}>
          ukeuvisasponsors.com
        </div>
        <div className="h-5 w-5 rounded" style={{ background: "#f0f2f4" }} />
      </div>
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#D9E5E7", background: "white" }}>
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest mb-0.5" style={{ color: "#079DB3" }}>UK/EU VISA SPONSORS</div>
          <div className="text-[13px] font-bold" style={{ color: "#071A24" }}>Find your visa sponsor</div>
        </div>
        <div className="flex gap-2">
          <div className="h-7 px-3 rounded-full text-[10px] font-semibold flex items-center" style={{ background: "#e3f7fb", color: "#079DB3" }}>🇬🇧 UK</div>
          <div className="h-7 px-3 rounded-full text-[10px] font-semibold flex items-center" style={{ background: "#f4fafb", color: "#4E6670", border: "1px solid #D9E5E7" }}>🇪🇺 EU</div>
        </div>
      </div>
      <div className="divide-y divide-[#f0f4f5]">
        {[
          { name: "Deloitte UK",     industry: "Consulting",          roles: 42 },
          { name: "HSBC Holdings",   industry: "Financial Services",  roles: 87 },
          { name: "Amazon UK",       industry: "Technology",          roles: 124 },
          { name: "PwC United Kingdom", industry: "Professional Svcs", roles: 61 },
        ].map((c) => (
          <div key={c.name} className="px-5 py-3.5 flex items-center justify-between hover:bg-[#f8fafb] transition-colors cursor-pointer" style={{ background: "white" }}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0" style={{ background: "#e3f7fb", color: "#079DB3" }}>
                {c.name[0]}
              </div>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: "#071A24" }}>{c.name}</div>
                <div className="text-[11px]" style={{ color: "#8AABAE" }}>{c.industry}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#e8f8f1", color: "#1f9d63" }}>A-rated</span>
              <span className="text-[11px] font-medium" style={{ color: "#4E6670" }}>{c.roles} roles</span>
              <ArrowUpRight size={12} style={{ color: "#D9E5E7" }} />
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 text-center border-t" style={{ borderColor: "#D9E5E7", background: "#f8fafc" }}>
        <span className="text-[11px] font-semibold" style={{ color: "#079DB3" }}>View all 2,000+ UK visa sponsors →</span>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const statsRef     = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counts, setCounts]             = useState(STATS.map(() => 0));
  const [activeAudience, setActiveAudience] = useState<"student" | "jobseeker" | "business">("student");
  const [showConsult, setShowConsult]   = useState(false);
  const [showJoin, setShowJoin]         = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsVisible(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const dur = 1200;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts(STATS.map(s => Math.round(ease * s.count)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [statsVisible]);

  const visibleTestimonials = TESTIMONIALS.filter(t => t.audience === activeAudience);

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#FAFCFC", position: "relative" }}>
      <PageGuideLines />
      <PublicNavbar />

      {/* ── ANNOUNCEMENT BAR ── */}
      <div
        className="sticky top-[68px] z-40 text-center py-2 px-4 text-[12px] font-semibold"
        style={{ background: "#079DB3", color: "rgba(255,255,255,0.92)" }}
      >
        Applications now open — 3-Month AI Engineering Program&nbsp;·&nbsp;
        <Link href="/training/apply" className="underline underline-offset-2 font-bold text-white">
          Apply now →
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 01 — THE AI CAREER PLATFORM (HERO)
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#ffffff", minHeight: "calc(100vh - 96px)", borderBottom: "1px solid #D9E5E7" }}
      >
        {/* Dotted architectural grid */}
        <div className="absolute inset-0 pointer-events-none" style={DOT_GRID_STYLE} />

        <div className="cai-container relative z-10 py-20 lg:py-28">

          {/* Section number label */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#079DB3" }}>01</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8AABAE" }}>The AI Career Platform</span>
            <div className="flex-1 h-px" style={{ background: "#D9E5E7" }} />
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">

            {/* Left: copy */}
            <div>
              <h1
                className="font-black mb-8 leading-[0.95]"
                style={{ fontSize: "clamp(3.2rem,5.8vw,5.4rem)", letterSpacing: "-0.045em", color: "#071A24" }}
              >
                Build Your Career
                <br />
                <span style={{ color: "#079DB3" }}>in the AI Economy.</span>
              </h1>

              <p className="text-xl mb-10 max-w-lg leading-relaxed" style={{ color: "#4E6670", lineHeight: 1.6 }}>
                Learn AI engineering. Build real systems. Get certified.
                Gain real experience. Access AI careers and work with businesses.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => setShowJoin(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#071A24" }}
                >
                  Explore AI Programs
                  <ArrowRight size={15} />
                </button>
                <Link
                  href="/for-businesses"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-all"
                  style={{ color: "#071A24", border: "1.5px solid #071A24", background: "transparent" }}
                >
                  Hire AI Talent
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Trust markers */}
              <div className="flex flex-wrap gap-4">
                {[
                  "UK-registered company",
                  "Verified certificates",
                  "Real project experience",
                ].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-[12px]" style={{ color: "#8AABAE" }}>
                    <CheckCircle2 size={12} style={{ color: "#079DB3" }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: transformer architecture diagram */}
            <div className="hidden lg:block">
              <TransformerHero />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 02 — TOOLS YOU'LL WORK WITH
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: "#062F36", borderTop: "1px solid rgba(7,157,179,0.12)", borderBottom: "1px solid rgba(7,157,179,0.12)" }}>
        <div className="cai-container py-12">

          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "rgba(7,157,179,0.7)", fontFamily: "monospace" }}>02</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.3)" }}>Technologies You&apos;ll Work With</span>
            <div className="flex-1 h-px" style={{ background: "rgba(7,157,179,0.1)" }} />
          </div>

          {/* Typography-based logo strip — no pills, no cards */}
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
          >
            <div className="flex items-center gap-14 animate-marquee" style={{ width: "max-content" }}>
              {[...TOOLS, ...TOOLS].map((tool, i) => (
                <span
                  key={i}
                  className="shrink-0 font-bold whitespace-nowrap tracking-wide"
                  style={{ fontSize: "17px", color: "rgba(220,235,237,0.65)" }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════════ */}
      <div
        ref={statsRef}
        className="py-14 border-y"
        style={{ background: "#ffffff", borderColor: "#D9E5E7" }}
      >
        <div className="cai-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black mb-1" style={{ color: "#071A24", fontVariantNumeric: "tabular-nums" }}>
                  {counts[i]}{s.suffix}
                </div>
                <div className="text-sm font-medium capitalize" style={{ color: "#8AABAE" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 03 — LEARN
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: "#FAFCFC" }}>

        <div className="cai-container pt-24 pb-16">
          {/* Section number label */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#079DB3" }}>03</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8AABAE" }}>Learn</span>
            <div className="flex-1 h-px" style={{ background: "#D9E5E7" }} />
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">
            <div className="lg:sticky lg:top-24">
              <h2
                className="font-extrabold mb-4"
                style={{ fontSize: "clamp(2rem,4vw,3.25rem)", letterSpacing: "-0.04em", color: "#071A24", lineHeight: 1.05 }}
              >
                AI Training &amp;
                <br />Certification
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#4E6670" }}>
                A structured 3-month engineering program taking you from AI fundamentals to real-world experience. Learn to build with LLMs, deploy AI into businesses, and earn verified credentials.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Hands-on with real AI tools & APIs",
                  "Build production-quality systems",
                  "Verified certificates for each stage",
                  "Real internship with UK team",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#071A24" }}>
                    <CheckCircle2 size={15} style={{ color: "#079DB3" }} />
                    {f}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setShowJoin(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white"
                  style={{ background: "#071A24" }}
                >
                  Apply Now <ArrowRight size={14} />
                </button>
                <Link
                  href="/training"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold"
                  style={{ color: "#079DB3" }}
                >
                  See curriculum <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {TRAINING_MONTHS.map((m) => (
                <div
                  key={m.num}
                  className="rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
                  style={{ background: "white", border: "1.5px solid #D9E5E7" }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                      style={{ background: m.color }}
                    >
                      {m.num}
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: m.color }}>Month {m.num}</div>
                      <h3 className="text-base font-bold" style={{ color: "#071A24", letterSpacing: "-0.02em" }}>{m.title}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {m.skills.map(s => (
                      <div key={s} className="flex items-center gap-1.5 text-xs" style={{ color: "#4E6670" }}>
                        <div className="h-1 w-1 rounded-full shrink-0" style={{ background: m.color }} />
                        {s}
                      </div>
                    ))}
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: m.bg, color: m.color }}
                  >
                    <Trophy size={11} /> {m.outcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 04 — BUILD
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", borderTop: "1px solid #D9E5E7" }}>
        <div className="cai-container py-24">

          {/* Section number label */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#079DB3" }}>04</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8AABAE" }}>Build</span>
            <div className="flex-1 h-px" style={{ background: "#D9E5E7" }} />
          </div>

          {/* What you'll build — projects */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start mb-12">
              <div>
                <h2
                  className="font-extrabold mb-4"
                  style={{ fontSize: "clamp(2rem,4vw,3.25rem)", letterSpacing: "-0.04em", color: "#071A24", lineHeight: 1.05 }}
                >
                  Build real
                  <br />AI systems.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "#4E6670" }}>
                  Learn by building the systems companies are actually looking for. Every project in the program is modelled on real-world AI engineering work.
                </p>
              </div>
              <div />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STUDENT_PROJECTS.map((p) => (
                <div
                  key={p.num}
                  className="rounded-2xl p-6 flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: "#FAFCFC", border: "1.5px solid #D9E5E7" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ background: p.color }}
                    >
                      {p.num}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: p.color + "14", color: p.color }}>
                      Capstone Project
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: "#071A24", letterSpacing: "-0.015em" }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "#8AABAE" }}>{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map(t => (
                      <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: "#EEF4F4", color: "#4E6670" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/training"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold"
                style={{ background: "#071A24", color: "white" }}
              >
                See Full Program Curriculum <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* For Businesses */}
          <div className="border-t pt-16" style={{ borderColor: "#D9E5E7" }}>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#079DB3" }}>For Business</div>
                <h2
                  className="font-extrabold mb-6"
                  style={{ fontSize: "clamp(2rem,4vw,3.25rem)", letterSpacing: "-0.04em", color: "#071A24", lineHeight: 1.05 }}
                >
                  Build your AI
                  <br />workforce.
                </h2>
                <p className="text-base leading-relaxed mb-10" style={{ color: "#4E6670" }}>
                  From intelligent agents and custom AI applications to remote AI engineering teams — Counts AI turns AI ideas into production systems.
                </p>

                <div className="space-y-0 divide-y divide-[#EEF4F4]">
                  {BUSINESS_SERVICES.map((svc) => (
                    <div key={svc.title} className="flex items-center gap-4 py-4 group">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-105" style={{ background: "#e3f7fb" }}>
                        <svc.icon size={14} style={{ color: "#079DB3" }} />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold" style={{ color: "#071A24" }}>{svc.title}</span>
                        <span className="text-sm ml-3" style={{ color: "#8AABAE" }}>{svc.desc}</span>
                      </div>
                      <ArrowRight size={12} style={{ color: "#D9E5E7" }} />
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="/for-businesses"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white"
                    style={{ background: "#071A24" }}
                  >
                    Talk to Counts AI <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Business flow */}
              <div className="relative">
                <div
                  className="rounded-2xl p-8 relative overflow-hidden"
                  style={{ background: "#062A32", border: "1px solid rgba(0,151,178,0.15)" }}
                >
                  <div style={DOT_GRID_STYLE} className="absolute inset-0 opacity-30 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: "rgba(0,180,212,0.7)" }}>How it works</div>
                    {[
                      { label: "Business Problem", sub: "You have a challenge AI can solve", icon: "●", color: "#4E6670" },
                      { label: "Counts AI", sub: "Strategy, scoping and team assembly", icon: "◆", color: "#079DB3" },
                      { label: "AI Talent + Engineering", sub: "Vetted engineers build your solution", icon: "▲", color: "#00b4d4" },
                      { label: "Production AI System", sub: "Deployed, tested and maintained", icon: "★", color: "#1f9d63" },
                    ].map((step, i) => (
                      <div key={step.label}>
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: step.color + "20", color: step.color }}>
                            {step.icon}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{step.label}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{step.sub}</div>
                          </div>
                        </div>
                        {i < 3 && (
                          <div className="ml-5 my-1">
                            <div className="w-px h-6 ml-[19px]" style={{ background: "rgba(0,151,178,0.2)" }} />
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="mt-6 pt-5 border-t" style={{ borderColor: "rgba(0,151,178,0.12)" }}>
                      <a
                        href="/for-businesses#contact"
                        className="flex items-center justify-between text-sm font-bold group"
                        style={{ color: "#00b4d4" }}
                      >
                        <span>Start a conversation</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 05 — WORK
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: "#062A32", borderTop: "1px solid rgba(0,151,178,0.1)" }}>
        <div className="cai-container py-24">

          {/* Section number label */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(0,151,178,0.7)" }}>05</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Work</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,151,178,0.12)" }} />
          </div>

          <div className="grid lg:grid-cols-[1fr_500px] gap-12 items-center">
            {/* AI Jobs mockup */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(0,151,178,0.15)", background: "rgba(255,255,255,0.03)" }}
            >
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>AI Jobs</div>
                <div className="h-7 px-3 rounded-md text-[11px] flex items-center gap-1.5 font-semibold" style={{ background: "rgba(0,151,178,0.15)", color: "#00b4d4", border: "1px solid rgba(0,151,178,0.2)" }}>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00b4d4]" />
                  Live roles
                </div>
              </div>
              <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}>
                  🔍 Search AI jobs...
                </div>
              </div>
              {[
                { title: "AI Engineer",                company: "Remote — UK",     tags: ["Python", "LLMs", "RAG"],         badge: "New" },
                { title: "GenAI Developer",            company: "Remote — US",     tags: ["OpenAI API", "Node.js"],         badge: "" },
                { title: "ML Ops Engineer",            company: "London, UK",      tags: ["MLflow", "Docker", "AWS"],       badge: "" },
                { title: "Forward Deployed Engineer",  company: "Remote — Global", tags: ["AI Agents", "APIs", "Python"],   badge: "Featured" },
              ].map((job) => (
                <div
                  key={job.title}
                  className="px-5 py-4 border-b flex items-center justify-between hover:bg-white/[0.03] transition-colors cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{job.title}</span>
                      {job.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(0,151,178,0.2)", color: "#00b4d4" }}>{job.badge}</span>
                      )}
                    </div>
                    <div className="text-[11px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{job.company}</div>
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
              ))}
              <div className="px-5 py-4 text-center">
                <Link href="/jobs" className="text-sm font-semibold" style={{ color: "#00b4d4" }}>
                  Browse all AI jobs →
                </Link>
              </div>
            </div>

            {/* Copy */}
            <div>
              <h2
                className="font-extrabold mb-4 text-white"
                style={{ fontSize: "clamp(2rem,4vw,3.25rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
              >
                Your next AI role
                <br />starts here.
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                Discover AI and engineering opportunities from companies hiring now. Build your profile, get AI-matched to roles, and stand out with Counts AI credentials.
              </p>
              <div className="space-y-3 mb-8">
                {["AI & ML roles worldwide", "AI-powered job matching", "Resume builder & CV scoring", "Join the talent pool"].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <CheckCircle2 size={14} style={{ color: "#00b4d4" }} />
                    {f}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/jobs"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white"
                  style={{ background: "#071A24" }}
                >
                  Browse AI Jobs <ArrowRight size={14} />
                </Link>
                <Link
                  href="/jobs"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold"
                  style={{ color: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.15)" }}
                >
                  Join talent pool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          AI CAREER JOURNEY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "#FAFCFC", borderTop: "1px solid #D9E5E7" }}>
        <div className="cai-container">
          <div className="text-center mb-14">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#079DB3" }}>Your path in the AI economy</div>
            <h2
              className="font-extrabold"
              style={{ fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.03em", color: "#071A24", lineHeight: 1.1 }}
            >
              The AI Career Journey
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute top-10 left-0 right-0 h-px hidden md:block"
              style={{ background: "linear-gradient(90deg, transparent, #D9E5E7, #D9E5E7, transparent)" }}
            />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center text-center group">
                  <div
                    className="relative h-20 w-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-105"
                    style={{
                      background: i === 0 ? "#071A24" : i === 5 ? "#079DB3" : "white",
                      border: `1.5px solid ${i === 0 ? "#071A24" : i === 5 ? "#079DB3" : "#D9E5E7"}`,
                      boxShadow: i === 0 ? "0 8px 24px rgba(7,26,36,0.25)" : i === 5 ? "0 8px 24px rgba(0,151,178,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <step.icon
                      size={24}
                      style={{ color: i === 0 ? "white" : i === 5 ? "white" : "#079DB3" }}
                    />
                    <div
                      className="absolute -top-3 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                      style={{ background: i === 0 ? "#071A24" : i === 5 ? "#079DB3" : "#8AABAE" }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div className="text-sm font-bold mb-1" style={{ color: "#071A24" }}>{step.label}</div>
                  <div className="text-xs leading-snug" style={{ color: "#8AABAE" }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowJoin(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white"
              style={{ background: "#071A24" }}
            >
              Start Your Journey <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BUILT BY COUNTS AI
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "#ffffff", borderTop: "1px solid #D9E5E7" }}>
        <div className="cai-container">
          <div className="text-center mb-16">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#079DB3" }}>Built by Counts AI</div>
            <h2
              className="font-extrabold max-w-2xl mx-auto"
              style={{ fontSize: "clamp(2rem,4vw,3.25rem)", letterSpacing: "-0.03em", color: "#071A24", lineHeight: 1.1 }}
            >
              We don&apos;t just teach AI.
              <br />We build with it.
            </h2>
            <p className="text-base mt-5 max-w-xl mx-auto" style={{ color: "#4E6670" }}>
              Counts AI builds AI-powered products, platforms and intelligent systems for real-world problems.
            </p>
          </div>

          {/* PRODUCT 01 — UK/EU VISA SPONSORS */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative">
              <VisaSponsorsPreview />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-5" style={{ background: "#e3f7fb", color: "#079DB3" }}>
                Built by Counts AI
              </div>
              <h3 className="text-3xl font-extrabold mb-4" style={{ color: "#071A24", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                UK/EU Visa Sponsors
              </h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#4E6670" }}>
                An AI-powered platform for discovering and exploring UK and EU visa sponsorship opportunities. Built to help professionals navigate the sponsorship landscape — finding the right companies, understanding visa routes, and accessing structured data.
              </p>
              <div className="space-y-2.5 mb-8">
                {["UK & EU sponsorship database", "AI-powered company and role discovery", "Searchable, filterable sponsor data"].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#4E6670" }}>
                    <CheckCircle2 size={14} style={{ color: "#079DB3" }} />
                    {f}
                  </div>
                ))}
              </div>
              <a
                href="https://ukeuvisasponsors.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white"
                style={{ background: "#071A24" }}
              >
                Explore Product <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px my-16" style={{ background: "#D7E2E4" }} />

          {/* PRODUCT 02 — ADSONI */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-5" style={{ background: "#E7F5F4", color: "#079DB3" }}>
                Built by Counts AI
              </div>
              <h3 className="text-3xl font-extrabold mb-4" style={{ color: "#071A24", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                Adsoni
              </h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#536B73" }}>
                An AI-powered advertising intelligence platform built by Counts AI. Adsoni helps businesses and marketers understand advertising landscapes, analyse competitor campaigns, and make smarter, data-driven ad decisions.
              </p>
              <div className="space-y-2.5 mb-8">
                {["AI-driven ad campaign analysis", "Competitor intelligence and market insight", "Multi-platform advertising data"].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#536B73" }}>
                    <CheckCircle2 size={14} style={{ color: "#079DB3" }} />
                    {f}
                  </div>
                ))}
              </div>
              <a
                href="https://adsoni.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white"
                style={{ background: "#071A24" }}
              >
                Explore Product <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="order-1 lg:order-2">
              <AdsoniMetricsCard />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 border-t" style={{ background: "#FAFCFC", borderColor: "#D9E5E7" }}>
        <div className="cai-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#079DB3" }}>What people say</div>
              <h2
                className="font-extrabold"
                style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.03em", color: "#071A24", lineHeight: 1.1 }}
              >
                Built for people<br />and businesses.
              </h2>
            </div>
            <div className="flex gap-2 shrink-0">
              {(["student", "jobseeker", "business"] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setActiveAudience(a)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all"
                  style={{
                    background: activeAudience === a ? "#071A24" : "transparent",
                    color: activeAudience === a ? "white" : "#4E6670",
                    border: activeAudience === a ? "none" : "1px solid #D9E5E7",
                    borderRadius: 100,
                  }}
                >
                  {a === "student" ? "Students" : a === "jobseeker" ? "Job Seekers" : "Business"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0 divide-y divide-[#EEF4F4]">
            {visibleTestimonials.map((t, ti) => (
              <div key={ti} className="py-8 grid sm:grid-cols-[1fr_180px] gap-6 items-start">
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="#079DB3" color="#079DB3" />)}
                  </div>
                  <p
                    className="font-medium leading-relaxed"
                    style={{ fontSize: "clamp(1rem,1.5vw,1.2rem)", color: "#071A24" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="sm:text-right">
                  <div className="text-sm font-bold" style={{ color: "#071A24" }}>{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#8AABAE" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "#062A32" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(7,157,179,0.09) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="cai-container relative z-10 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(0,151,178,0.7)" }}>Get started today</div>
          <h2
            className="font-extrabold text-white mb-4 max-w-2xl mx-auto"
            style={{ fontSize: "clamp(2rem,4vw,3.25rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            Ready to build your future in AI?
          </h2>
          <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Join the Counts AI platform. Learn AI engineering, get certified, gain real experience, and access AI careers worldwide.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setShowJoin(true)}
              className="flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#079DB3" }}
            >
              Join AI Program <ArrowRight size={14} />
            </button>
            <Link
              href="/for-businesses"
              className="flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold transition-all"
              style={{ color: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(255,255,255,0.15)" }}
            >
              Hire AI Talent <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      {showConsult && <ConsultationPopup onClose={() => setShowConsult(false)} />}
      {showJoin    && <JoinModal onClose={() => setShowJoin(false)} />}

      <button
        onClick={() => setShowConsult(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-95"
        style={{ background: "#062F36", boxShadow: "0 8px 24px rgba(6,47,54,0.35)" }}
      >
        Free Consultation
      </button>
    </div>
  );
}
