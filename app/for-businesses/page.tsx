"use client";

import { useEffect, useState } from "react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { ProductHero, AgentShowcases, HowAgentsWork, Integrations, FinalCta } from "@/components/business/product";
import "@/components/business/biz.css";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import { ArrowRight, Loader2, MessageSquare } from "lucide-react";

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

  useEffect(() => {
    const apply = (name: string, cat: string) =>
      setForm((f) => ({
        ...f,
        service: "AI Agent Development",
        description: f.description || `I'm interested in ${name} (${cat}).`,
      }));
    const onAgent = (e: Event) => {
      const d = (e as CustomEvent<{ name: string; cat: string }>).detail;
      if (d) apply(d.name, d.cat);
    };
    window.addEventListener("biz-agent", onAgent);
    const names: Record<string, [string, string]> = {
      nexa: ["Nexa", "Lead Generation"], orion: ["Orion", "Customer Service"],
      lyra: ["Lyra", "HR Management"], vesta: ["Vesta", "Marketing Intelligence"],
    };
    const q = new URLSearchParams(window.location.search).get("agent")?.toLowerCase();
    if (q && names[q]) apply(...names[q]);
    return () => window.removeEventListener("biz-agent", onAgent);
  }, []);

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
    <div className={`ch ${serif.variable} ${mono.variable} ${display.variable}`}>
      <PublicNavbar active="For Business" />

      <ProductHero />
      <AgentShowcases />
      <HowAgentsWork />
      <span id="consulting" aria-hidden="true" />
      <span id="workforce" aria-hidden="true" />
      <Integrations />
      <FinalCta />

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
