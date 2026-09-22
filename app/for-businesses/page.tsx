"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import {
  ArrowRight, Users, Brain, Zap, Rocket, Code2, Globe,
  CheckCircle2, Loader2, MessageSquare, ArrowUpRight,
} from "lucide-react";

const SERVICES = [
  { icon: Users,  title: "Remote AI Workforce",         desc: "Access skilled remote AI engineers without building a full internal team. Flexible, fast onboarding.", id: "workforce" },
  { icon: Brain,  title: "AI Application Development",  desc: "Design and build AI-powered applications for real business use cases — from ideation to production.", id: "services" },
  { icon: Zap,    title: "AI Agent Development",         desc: "Build intelligent agents that use tools, APIs and business data to automate complex tasks.", id: "services" },
  { icon: Rocket, title: "AI SaaS Development",          desc: "Turn AI product ideas into scalable, production-ready SaaS platforms.", id: "services" },
  { icon: Code2,  title: "AI Automation",                desc: "Automate repetitive business workflows using AI — reducing cost and increasing accuracy.", id: "services" },
  { icon: Globe,  title: "AI Integrations",              desc: "Connect AI to your existing software, APIs and business systems cleanly.", id: "services" },
  { icon: Brain,  title: "AI Consulting",                desc: "Identify practical AI opportunities in your business and build a clear implementation roadmap.", id: "consulting" },
  { icon: Code2,  title: "Software Engineering",         desc: "Full-stack engineering support for AI and SaaS products. Build faster with our remote team.", id: "services" },
];

const PROCESS = [
  { num: "01", title: "Discover",  desc: "We understand your business problem, current systems, and what success looks like." },
  { num: "02", title: "Design",    desc: "We design the right AI solution — practical and implementable, not just impressive." },
  { num: "03", title: "Build",     desc: "Our engineers develop, test and integrate the solution with your workflows." },
  { num: "04", title: "Deploy",    desc: "We deploy into your environment and support the go-live process." },
  { num: "05", title: "Scale",     desc: "We continue improving and expanding the system as your needs grow." },
];

const SERVICES_LIST = [
  "Remote AI Workforce", "AI Application Development", "AI Agent Development",
  "AI SaaS Development", "AI Automation", "AI Integrations", "AI Consulting", "Software Engineering", "Other",
];
const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];
const TIMELINES     = ["As soon as possible", "1–3 months", "3–6 months", "6–12 months", "No fixed timeline"];
const BUDGETS       = ["< £5k", "£5k – £20k", "£20k – £50k", "£50k – £100k", "£100k+", "Prefer not to say"];

const fieldStyle: React.CSSProperties = { background: "white", border: "1.5px solid #dbe9eb", color: "#07111f" };
const inp = "w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all";

function Field({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-widest" style={{ color: "#86a0a8" }}>
        {label}{optional && <span className="normal-case font-normal ml-1 opacity-60">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "var(--teal)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.1)"; };
  const blur  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#dbe9eb"; e.target.style.boxShadow = "none"; };
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inp} style={fieldStyle} onFocus={focus} onBlur={blur} />;
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={inp} style={{ ...fieldStyle, appearance: "none" }}>
      <option value="">— select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function TA({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const focus = (e: React.FocusEvent<HTMLTextAreaElement>) => { e.target.style.borderColor = "var(--teal)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.1)"; };
  const blur  = (e: React.FocusEvent<HTMLTextAreaElement>) => { e.target.style.borderColor = "#dbe9eb"; e.target.style.boxShadow = "none"; };
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className={`${inp} resize-none`} style={fieldStyle} onFocus={focus} onBlur={blur} />;
}

interface ContactForm {
  name: string; company: string; email: string; website: string;
  country: string; companySize: string; service: string;
  description: string; timeline: string; budget: string;
}
const blankForm: ContactForm = {
  name: "", company: "", email: "", website: "",
  country: "", companySize: "", service: "",
  description: "", timeline: "", budget: "",
};

export default function ForBusinessesPage() {
  const [form, setForm]     = useState<ContactForm>(blankForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);

  const set = (k: keyof ContactForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.email || !form.service || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/business/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <PublicNavbar active="For Business" />

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
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,151,178,0.12) 0%, transparent 60%)" }}
        />

        <div className="cai-container relative z-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-[11px] font-bold uppercase tracking-widest"
            style={{ background: "rgba(0,151,178,0.15)", border: "1px solid rgba(0,151,178,0.3)", color: "#00b4d4" }}
          >
            <Brain size={11} /> For Business
          </div>

          <h1 className="display-xl text-white mb-5 max-w-3xl mx-auto">
            Build Your{" "}
            <span style={{ color: "#00b4d4" }}>AI Workforce.</span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            From AI applications and intelligent agents to remote AI engineering teams — Counts AI helps businesses turn AI ideas into working products.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#contact"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "var(--teal)" }}
            >
              Talk to Counts AI <ArrowRight size={14} />
            </a>
            <a
              href="#services"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Explore Services
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </section>

      {/* ── BUSINESS FLOW ── */}
      <section className="py-16" style={{ background: "var(--background)" }}>
        <div className="cai-container">
          <div
            className="rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
            style={{ background: "var(--navy)", border: "1px solid rgba(0,151,178,0.15)" }}
          >
            {[
              { label: "Business Problem", sub: "Identify the AI opportunity" },
              { label: "→", sub: "", arrow: true },
              { label: "Counts AI", sub: "Engineering & consulting" },
              { label: "→", sub: "", arrow: true },
              { label: "AI Talent + Build", sub: "Design, develop & deploy" },
              { label: "→", sub: "", arrow: true },
              { label: "Production AI", sub: "Live, tested, maintained" },
            ].map((step, i) => step.arrow ? (
              <div key={i} className="text-2xl hidden sm:block" style={{ color: "rgba(0,151,178,0.4)" }}>→</div>
            ) : (
              <div key={i} className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{step.label}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{step.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 scroll-mt-20" style={{ background: "var(--surface-1)" }}>
        <div className="cai-container">
          <div className="text-center mb-12">
            <div className="label-overline mb-2" style={{ color: "var(--teal)" }}>What We Build</div>
            <h2 className="display-md text-[#07111f]">AI services for ambitious businesses.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl p-5 transition-all hover:shadow-md group"
                style={{ background: "white", border: "1.5px solid #dbe9eb" }}
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-colors group-hover:bg-[var(--teal-surface)]" style={{ background: "#eef6f7" }}>
                  <s.icon size={17} style={{ color: "var(--teal)" }} />
                </div>
                <h4 className="text-sm font-bold mb-1.5" style={{ color: "#07111f", letterSpacing: "-0.01em" }}>{s.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "#7fa8b0" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20" style={{ background: "var(--background)" }}>
        <div className="cai-container">
          <div className="text-center mb-12">
            <div className="label-overline mb-2" style={{ color: "var(--teal)" }}>How We Work</div>
            <h2 className="display-md text-[#07111f]">From idea to production.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS.map((p) => (
              <div key={p.num} className="rounded-2xl p-5" style={{ background: "white", border: "1.5px solid #dbe9eb" }}>
                <div className="text-2xl font-black mb-3" style={{ color: "#dbe9eb" }}>{p.num}</div>
                <h4 className="text-sm font-bold mb-1.5" style={{ color: "#07111f" }}>{p.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "#7fa8b0" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY COUNTS AI ── */}
      <section id="workforce" className="py-20 scroll-mt-20" style={{ background: "var(--surface-2)" }}>
        <div className="cai-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="label-overline mb-3" style={{ color: "var(--teal)" }}>Why Counts AI</div>
              <h2 className="display-md text-[#07111f] mb-4">
                AI capability without
                <br />the internal overhead.
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#486870" }}>
                Building an internal AI team is expensive and slow. Counts AI gives SMEs access to practical AI engineering capabilities without the recruitment overhead, training costs, or long-term fixed commitments.
              </p>
              <ul className="space-y-3">
                {[
                  "Access AI engineers without long recruitment cycles",
                  "Practical AI solutions focused on real business problems",
                  "Flexible engagement — project-based or ongoing",
                  "UK-based consultancy with a global engineering team",
                  "From prototype to production in weeks, not months",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "#0d2030" }}>
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: "var(--teal)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#86a0a8" }}>Suitable for</div>
              {[
                { title: "SMEs adding AI capabilities",    desc: "You know AI matters but don't have a technical team to build it." },
                { title: "Startups building AI products",  desc: "You have the idea. We have the engineers to build it." },
                { title: "Established businesses automating", desc: "You want to automate workflows and integrate AI into existing systems." },
              ].map(c => (
                <div key={c.title} className="rounded-2xl p-5" style={{ background: "white", border: "1.5px solid #dbe9eb" }}>
                  <h4 className="text-sm font-bold mb-1" style={{ color: "#07111f" }}>{c.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#7fa8b0" }}>{c.desc}</p>
                </div>
              ))}

              <a
                href="#contact"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 mt-2"
                style={{ background: "var(--teal)" }}
              >
                Talk to Counts AI <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contact" className="py-20 scroll-mt-20" style={{ background: "var(--background)" }}>
        <div className="cai-container max-w-2xl">
          <div className="text-center mb-10">
            <div className="label-overline mb-2" style={{ color: "var(--teal)" }}>Get in Touch</div>
            <h2 className="display-md text-[#07111f] mb-2">Have an AI idea? Let&apos;s build it.</h2>
            <p className="text-sm" style={{ color: "#486870" }}>
              Tell us what you&apos;re trying to build, automate or improve. We respond within 2 business days.
            </p>
          </div>

          {done ? (
            <div className="text-center py-14 rounded-2xl" style={{ background: "white", border: "1.5px solid #dbe9eb" }}>
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "#e3f7fb" }}>
                <MessageSquare size={22} style={{ color: "var(--teal)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#07111f" }}>Message received.</h3>
              <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#486870" }}>
                We&apos;ll review your inquiry and reply within 2 business days.
              </p>
              <button
                onClick={() => { setDone(false); setForm(blankForm); }}
                className="px-6 py-3 rounded-full text-sm font-bold text-white"
                style={{ background: "var(--teal)" }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <div className="rounded-2xl p-6 space-y-4" style={{ background: "white", border: "1.5px solid #dbe9eb" }}>
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#486870" }}>About You</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Your Name"><Inp value={form.name} onChange={set("name")} placeholder="Jane Smith" /></Field>
                  <Field label="Company"><Inp value={form.company} onChange={set("company")} placeholder="Acme Ltd" /></Field>
                </div>
                <Field label="Email Address"><Inp value={form.email} onChange={set("email")} placeholder="jane@acme.com" type="email" /></Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Website" optional><Inp value={form.website} onChange={set("website")} placeholder="https://acme.com" /></Field>
                  <Field label="Country" optional><Inp value={form.country} onChange={set("country")} placeholder="United Kingdom" /></Field>
                </div>
                <Field label="Company Size" optional>
                  <Sel value={form.companySize} onChange={set("companySize")} options={COMPANY_SIZES} />
                </Field>
              </div>

              <div className="rounded-2xl p-6 space-y-4" style={{ background: "white", border: "1.5px solid #dbe9eb" }}>
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#486870" }}>Your Project</h3>
                <Field label="Service Required">
                  <Sel value={form.service} onChange={set("service")} options={SERVICES_LIST} />
                </Field>
                <Field label="Project Description">
                  <TA value={form.description} onChange={set("description")} rows={5}
                    placeholder="Tell us what you're trying to build, automate or improve. The more context, the better." />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Estimated Timeline" optional>
                    <Sel value={form.timeline} onChange={set("timeline")} options={TIMELINES} />
                  </Field>
                  <Field label="Budget Range" optional>
                    <Sel value={form.budget} onChange={set("budget")} options={BUDGETS} />
                  </Field>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--navy)" }}
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                  : <>Talk to Counts AI <ArrowRight size={14} /></>
                }
              </button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
