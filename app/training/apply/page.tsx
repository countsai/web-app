"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

const COUNTRIES = [
  "United Kingdom","United States","India","Nigeria","Ghana","Kenya","South Africa",
  "Canada","Australia","Germany","France","Netherlands","Spain","Italy","Sweden",
  "UAE","Saudi Arabia","Pakistan","Bangladesh","Sri Lanka","Philippines","Malaysia",
  "Singapore","Hong Kong","Brazil","Mexico","Argentina","Colombia","Egypt","Morocco",
  "Ethiopia","Tanzania","Rwanda","Uganda","Zimbabwe","Senegal","Cameroon",
  "Other",
];

const EDUCATION_LEVELS = [
  "High School / A-Levels", "Undergraduate (In Progress)", "Bachelor's Degree",
  "Postgraduate (In Progress)", "Master's Degree", "PhD / Doctorate", "Bootcamp / Self-taught",
  "Professional certification", "Other",
];

const GRAD_YEARS = Array.from({ length: 10 }, (_, i) => String(2024 + i - 2));

const inp = "w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all";
const inpStyle: React.CSSProperties = { background: "white", border: "1.5px solid #dbe9eb", color: "#0a3a44" };

function Field({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>
        {label}{optional && <span className="normal-case font-normal ml-1 opacity-60">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#079DB3"; e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.12)"; };
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#dbe9eb"; e.target.style.boxShadow = "none"; };
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inp} style={inpStyle} onFocus={onFocus} onBlur={onBlur} />;
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={inp} style={{ ...inpStyle, appearance: "none" }}>
      <option value="">— select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function TA({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const onFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => { e.target.style.borderColor = "#079DB3"; e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.12)"; };
  const onBlur  = (e: React.FocusEvent<HTMLTextAreaElement>) => { e.target.style.borderColor = "#dbe9eb"; e.target.style.boxShadow = "none"; };
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className={`${inp} resize-none`} style={inpStyle} onFocus={onFocus} onBlur={onBlur} />;
}

interface FormData {
  fullName: string; email: string; phone: string; country: string; city: string;
  education: string; university: string; graduationYear: string;
  currentRole: string; yearsExperience: string; technicalSkills: string;
  aiExperience: string; githubUrl: string; linkedinUrl: string; portfolioUrl: string;
  motivation: string; preferredStart: string;
}

const blank: FormData = {
  fullName: "", email: "", phone: "", country: "", city: "",
  education: "", university: "", graduationYear: "",
  currentRole: "", yearsExperience: "", technicalSkills: "",
  aiExperience: "", githubUrl: "", linkedinUrl: "", portfolioUrl: "",
  motivation: "", preferredStart: "",
};

export default function TrainingApplyPage() {
  const [form, setForm] = useState<FormData>(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof FormData) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.country || !form.education || !form.motivation) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/training/apply", {
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
    <div className="min-h-screen" style={{ background: "#f4fafb" }}>
      <PublicNavbar active="Training & Internship" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {done ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#e3f7fb" }}>
              <CheckCircle2 size={32} style={{ color: "#079DB3" }} />
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ color: "#0a3a44" }}>Application received.</h2>
            <p className="text-base mb-2" style={{ color: "#5f7679" }}>
              We review every application and respond within <strong>3 business days</strong>.
            </p>
            <p className="text-sm mb-8" style={{ color: "#85a0a4" }}>
              If you don&apos;t hear from us, check your spam folder or email us directly.
            </p>
            <Link href="/training"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white"
              style={{ background: "#079DB3" }}>
              <ArrowLeft size={14} /> Back to Training
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <Link href="/training" className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 hover:underline" style={{ color: "#079DB3" }}>
                <ArrowLeft size={12} /> Back to Training
              </Link>
              <h1 className="text-3xl font-black mb-2" style={{ color: "#0a3a44" }}>Apply for the Program</h1>
              <p className="text-sm" style={{ color: "#5f7679" }}>
                Complete your application below. We review every submission and respond within 3 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              {/* Personal */}
              <div className="rounded-2xl p-6 bg-white space-y-4" style={{ border: "1.5px solid #dbe9eb" }}>
                <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>Personal Details</h3>
                <Field label="Full Name"><Inp value={form.fullName} onChange={set("fullName")} placeholder="Your full name" /></Field>
                <Field label="Email Address"><Inp value={form.email} onChange={set("email")} placeholder="you@example.com" type="email" /></Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone / WhatsApp"><Inp value={form.phone} onChange={set("phone")} placeholder="+44 7000 000000" /></Field>
                  <Field label="Country"><Sel value={form.country} onChange={set("country")} options={COUNTRIES} /></Field>
                </div>
                <Field label="City" optional><Inp value={form.city} onChange={set("city")} placeholder="Your city" /></Field>
              </div>

              {/* Education */}
              <div className="rounded-2xl p-6 bg-white space-y-4" style={{ border: "1.5px solid #dbe9eb" }}>
                <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>Education</h3>
                <Field label="Current Education Level"><Sel value={form.education} onChange={set("education")} options={EDUCATION_LEVELS} /></Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="University / Institution" optional><Inp value={form.university} onChange={set("university")} placeholder="e.g. University of London" /></Field>
                  <Field label="Graduation Year" optional><Sel value={form.graduationYear} onChange={set("graduationYear")} options={GRAD_YEARS} /></Field>
                </div>
              </div>

              {/* Experience */}
              <div className="rounded-2xl p-6 bg-white space-y-4" style={{ border: "1.5px solid #dbe9eb" }}>
                <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>Background</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Current Role / Status" optional><Inp value={form.currentRole} onChange={set("currentRole")} placeholder="e.g. Student, Junior Developer" /></Field>
                  <Field label="Years of Experience" optional>
                    <Sel value={form.yearsExperience} onChange={set("yearsExperience")} options={["0 (Student)", "< 1 year", "1–2 years", "3–5 years", "5+ years"]} />
                  </Field>
                </div>
                <Field label="Technical Skills" optional>
                  <TA value={form.technicalSkills} onChange={set("technicalSkills")} rows={3}
                    placeholder="e.g. Python, JavaScript, SQL, React, Node.js…" />
                </Field>
                <Field label="AI Experience" optional>
                  <TA value={form.aiExperience} onChange={set("aiExperience")} rows={3}
                    placeholder="Any AI/ML projects, courses, or tools you've used…" />
                </Field>
              </div>

              {/* Links */}
              <div className="rounded-2xl p-6 bg-white space-y-4" style={{ border: "1.5px solid #dbe9eb" }}>
                <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>Online Profiles</h3>
                <Field label="GitHub URL" optional><Inp value={form.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com/yourname" /></Field>
                <Field label="LinkedIn URL" optional><Inp value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/yourname" /></Field>
                <Field label="Portfolio / Website" optional><Inp value={form.portfolioUrl} onChange={set("portfolioUrl")} placeholder="https://yoursite.com" /></Field>
              </div>

              {/* Motivation */}
              <div className="rounded-2xl p-6 bg-white space-y-4" style={{ border: "1.5px solid #dbe9eb" }}>
                <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: "#0a3a44" }}>Your Application</h3>
                <Field label="Why do you want to join Counts AI?">
                  <TA value={form.motivation} onChange={set("motivation")} rows={5}
                    placeholder="Tell us about your goals, what you want to build, and why this program is right for you…" />
                </Field>
                <Field label="Preferred Program Start" optional>
                  <Sel value={form.preferredStart} onChange={set("preferredStart")}
                    options={["As soon as possible", "1–3 months", "3–6 months", "6+ months"]} />
                </Field>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "#079DB3" }}>
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit Application <ArrowRight size={14} /></>}
              </button>
            </form>
          </>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
