"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight, ArrowLeft, Upload, Plus, Trash2, X,
  CheckCircle2, Loader2, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Exp {
  id: string; jobTitle: string; company: string; country: string; city: string;
  startDate: string; endDate: string; current: boolean; responsibilities: string;
}
interface Edu {
  id: string; degree: string; field: string; institution: string;
  startYear: string; endYear: string; grade: string;
}
interface Cert  { id: string; name: string; issuer: string; year: string; url: string; }
interface Lang  { id: string; language: string; proficiency: string; }
interface Pub   { id: string; title: string; publisher: string; year: string; url: string; }
interface Research { id: string; title: string; institution: string; year: string; description: string; }
interface Award { id: string; title: string; issuer: string; year: string; description: string; }

interface OBData {
  title: string; firstName: string; lastName: string; phone: string;
  tagline: string; bio: string;
  experience: Exp[]; education: Edu[]; skills: string[];
  certifications: Cert[]; languages: Lang[];
  publications: Pub[]; researchWorks: Research[]; awards: Award[];
}

const uid = () => Math.random().toString(36).slice(2);

const blank: OBData = {
  title: "", firstName: "", lastName: "", phone: "",
  tagline: "", bio: "",
  experience: [], education: [], skills: [],
  certifications: [], languages: [],
  publications: [], researchWorks: [], awards: [],
};

const TITLES = ["", "Mr", "Ms", "Dr", "Prof", "Mx"];
const PROFICIENCIES = ["Native", "Fluent", "Professional", "Conversational", "Basic"];
const LANGUAGES = [
  "Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani","Basque","Belarusian",
  "Bengali","Bosnian","Bulgarian","Burmese","Catalan","Cebuano","Chinese (Cantonese)",
  "Chinese (Mandarin)","Croatian","Czech","Danish","Dutch","English","Estonian","Filipino",
  "Finnish","French","Galician","Georgian","German","Greek","Gujarati","Haitian Creole",
  "Hausa","Hebrew","Hindi","Hungarian","Icelandic","Igbo","Indonesian","Irish","Italian",
  "Japanese","Javanese","Kannada","Kazakh","Khmer","Korean","Kurdish","Kyrgyz","Lao","Latin",
  "Latvian","Lithuanian","Luxembourgish","Macedonian","Malagasy","Malay","Malayalam","Maltese",
  "Marathi","Mongolian","Nepali","Norwegian","Pashto","Persian (Farsi)","Polish","Portuguese",
  "Punjabi","Romanian","Russian","Serbian","Sinhala","Slovak","Slovenian","Somali","Spanish",
  "Swahili","Swedish","Tajik","Tamil","Telugu","Thai","Turkish","Turkmen","Ukrainian","Urdu",
  "Uzbek","Vietnamese","Welsh","Xhosa","Yoruba","Zulu",
];

const COUNTRIES = [
  "Remote",
  "Afghanistan","Albania","Algeria","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahrain","Bangladesh","Belarus","Belgium","Bolivia","Bosnia and Herzegovina","Brazil","Bulgaria",
  "Cambodia","Cameroon","Canada","Chile","China","Colombia","Croatia","Cyprus","Czech Republic",
  "Denmark","Ecuador","Egypt","Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana",
  "Greece","Guatemala","Honduras","Hong Kong","Hungary","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon",
  "Libya","Lithuania","Luxembourg","Malaysia","Malta","Mexico","Moldova","Morocco","Myanmar",
  "Nepal","Netherlands","New Zealand","Nigeria","North Macedonia","Norway","Oman","Pakistan",
  "Palestine","Panama","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","South Africa",
  "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tanzania",
  "Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zimbabwe",
];

// "Jan 2022" → "2022-01" for <input type="month">
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function toMonthInput(s: string): string {
  if (!s || s === "Present") return "";
  if (/^\d{4}-\d{2}$/.test(s)) return s;
  const m = s.match(/^([A-Za-z]{3})\s+(\d{4})$/);
  if (m) {
    const idx = MONTH_ABBR.findIndex(a => a.toLowerCase() === m[1].toLowerCase());
    if (idx !== -1) return `${m[2]}-${String(idx + 1).padStart(2, "0")}`;
  }
  return "";
}

const STEP_LABELS = [
  "Personal", "Summary", "Experience", "Education",
  "Skills", "Additional",
];

// ─── Shared input styles ──────────────────────────────────────────────────────

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

function Inp({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#079DB3";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#dbe9eb";
    e.target.style.boxShadow = "none";
  };
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} className={inp} style={inpStyle} onFocus={onFocus} onBlur={onBlur} />
  );
}

function TA({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const onFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#079DB3";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#dbe9eb";
    e.target.style.boxShadow = "none";
  };
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      placeholder={placeholder} className={`${inp} resize-none`} style={inpStyle}
      onFocus={onFocus} onBlur={onBlur} />
  );
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={inp}
      style={{ ...inpStyle, appearance: "none" as const }}>
      {options.map(o => <option key={o} value={o}>{o || "— select —"}</option>)}
    </select>
  );
}

const MONTH_OPTIONS = [
  { v: "01", l: "January" }, { v: "02", l: "February" }, { v: "03", l: "March" },
  { v: "04", l: "April" },   { v: "05", l: "May" },      { v: "06", l: "June" },
  { v: "07", l: "July" },    { v: "08", l: "August" },   { v: "09", l: "September" },
  { v: "10", l: "October" }, { v: "11", l: "November" }, { v: "12", l: "December" },
];

function MonthYearPicker({ value, onChange, disabled }: {
  value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  const init = value?.match(/^(\d{4})-(\d{2})$/);
  const [selMonth, setSelMonth] = useState(init?.[2] ?? "");
  const [selYear, setSelYear]   = useState(init?.[1] ?? "");
  const curYear = new Date().getFullYear();
  const selStyle: React.CSSProperties = { ...inpStyle, appearance: "none", opacity: disabled ? 0.4 : 1 };

  const pickMonth = (m: string) => {
    setSelMonth(m);
    if (selYear && m) onChange(`${selYear}-${m}`);
  };
  const pickYear = (y: string) => {
    setSelYear(y);
    if (y && selMonth) onChange(`${y}-${selMonth}`);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <select value={selMonth} disabled={disabled} onChange={e => pickMonth(e.target.value)}
        className={inp} style={selStyle}>
        <option value="">Month</option>
        {MONTH_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <select value={selYear} disabled={disabled} onChange={e => pickYear(e.target.value)}
        className={inp} style={selStyle}>
        <option value="">Year</option>
        {Array.from({ length: curYear - 1959 }, (_, i) => String(curYear - i)).map(y =>
          <option key={y} value={y}>{y}</option>
        )}
      </select>
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:opacity-80"
      style={{ border: "1.5px dashed #079DB3", color: "#079DB3", background: "rgba(0,151,178,0.04)" }}>
      <Plus size={14} /> {label}
    </button>
  );
}

// ─── Collapsible card for list items ─────────────────────────────────────────

function ItemCard({ title, onRemove, children }: {
  title: string; onRemove: () => void; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #dbe9eb" }}>
      <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer"
        style={{ background: "#f4fafb" }} onClick={() => setOpen(o => !o)}>
        <span className="text-sm font-bold" style={{ color: "#0a3a44" }}>{title || "Untitled"}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: "#dc2626" }}>
            <Trash2 size={13} />
          </button>
          {open ? <ChevronUp size={15} style={{ color: "#85a0a4" }} /> : <ChevronDown size={15} style={{ color: "#85a0a4" }} />}
        </div>
      </div>
      {open && <div className="p-5 space-y-4 bg-white">{children}</div>}
    </div>
  );
}

const PARSE_FIELDS = [
  { label: "Name & Contact",        icon: "👤" },
  { label: "Professional Summary",  icon: "✍️" },
  { label: "Work Experience",       icon: "💼" },
  { label: "Education",             icon: "🎓" },
  { label: "Skills & Technologies", icon: "⚡" },
  { label: "Certifications",        icon: "📜" },
  { label: "Languages",             icon: "🌐" },
  { label: "Awards & Recognition",  icon: "🏆" },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OBData>(blank);
  const [parseState, setParseState] = useState<"idle" | "parsing" | "done" | "error">("idle");
  const [parseErr, setParseErr] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = useCallback(<K extends keyof OBData>(k: K, v: OBData[K]) =>
    setData(d => ({ ...d, [k]: v })), []);

  // ── CV parsing (non-blocking — user can continue immediately) ────────────────

  const runParse = async (file: File) => {
    setParseState("parsing");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: fd });
      const parsed = await res.json();
      if (!res.ok || parsed.error) throw new Error(parsed.error ?? "Parse failed");
      setData(d => ({
        ...d,
        title:       parsed.title       || d.title,
        firstName:   parsed.firstName   || d.firstName,
        lastName:    parsed.lastName    || d.lastName,
        phone:       parsed.phone       || d.phone,
        tagline:     parsed.tagline     || d.tagline,
        bio:         parsed.bio         || d.bio,
        skills:      parsed.skills?.length ? parsed.skills : d.skills,
        experience:  (parsed.experience ?? []).map((e: { jobTitle?: string; company?: string; location?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[] }) => {
          const loc = e.location ?? "";
          const isRemote = /remote/i.test(loc);
          const parts = loc.split(",").map((p: string) => p.trim());
          return {
            id: uid(), jobTitle: e.jobTitle ?? "", company: e.company ?? "",
            country: isRemote ? "Remote" : "",
            city: isRemote ? "" : (parts[0] ?? ""),
            startDate: toMonthInput(e.startDate ?? ""),
            endDate: e.current ? "" : toMonthInput(e.endDate ?? ""),
            current: !!e.current,
            responsibilities: Array.isArray(e.responsibilities) ? e.responsibilities.join("\n") : "",
          };
        }),
        education:      (parsed.education      ?? []).map((e: Omit<Edu,"id">)      => ({ id: uid(), ...e })),
        certifications: (parsed.certifications ?? []).map((c: Omit<Cert,"id">)     => ({ id: uid(), ...c })),
        languages:      (parsed.languages      ?? []).map((l: Omit<Lang,"id">)     => ({ id: uid(), ...l })),
        publications:   (parsed.publications   ?? []).map((p: Omit<Pub,"id">)      => ({ id: uid(), ...p })),
        researchWorks:  (parsed.researchWorks  ?? []).map((r: Omit<Research,"id">) => ({ id: uid(), ...r })),
        awards:         (parsed.awards         ?? []).map((a: Omit<Award,"id">)    => ({ id: uid(), ...a })),
      }));
      setParseState("done");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setParseErr(msg);
      setParseState("error");
    }
  };

  const triggerParse = (file: File) => {
    setParseErr("");
    runParse(file); // fire-and-forget — never blocks the user
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) triggerParse(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) triggerParse(f);
  };

  // ── Skills tag input ────────────────────────────────────────────────────────

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !data.skills.includes(s)) set("skills", [...data.skills, s]);
    setSkillInput("");
  };

  // ── Save ────────────────────────────────────────────────────────────────────

  const save = async () => {
    setSaving(true);
    setSaveErr("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const profileRes = await supabase.from("profiles").update({
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
      }).eq("id", user.id);
      if (profileRes.error) {
        console.error("[save] profiles update:", profileRes.error.message, profileRes.error.details);
        throw new Error(`Profile update failed: ${profileRes.error.message}`);
      }

      const expJson = data.experience.map(({ id: _id, responsibilities, ...rest }) => ({
        ...rest,
        responsibilities: responsibilities.split("\n").map(s => s.trim()).filter(Boolean),
      }));
      const eduJson  = data.education.map(({ id: _id, ...r }) => r);
      const certJson = data.certifications.map(({ id: _id, ...r }) => r);
      const langJson = data.languages.map(({ id: _id, ...r }) => r);
      const pubJson  = data.publications.map(({ id: _id, ...r }) => r);
      const resJson  = data.researchWorks.map(({ id: _id, ...r }) => r);
      const awdJson  = data.awards.map(({ id: _id, ...r }) => r);

      const { error } = await supabase.from("candidate_profiles").upsert({
        id: user.id,
        title: data.title,
        first_name: data.firstName,
        last_name: data.lastName,
        headline: data.tagline,
        summary: data.bio,
        skills: data.skills,
        experience: expJson,
        education: eduJson,
        certifications: certJson,
        languages: langJson,
        publications: pubJson,
        research_works: resJson,
        awards: awdJson,
        onboarding_completed: true,
      });

      if (error) {
        console.error("[save] candidate_profiles upsert:", error.message, error.details, error.hint, error.code);
        throw new Error(error.message);
      }
      window.location.href = "/dashboard";
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("[save]", msg);
      setSaveErr(`Failed to save: ${msg}`);
      setSaving(false);
    }
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const addExp  = () => set("experience", [...data.experience, { id: uid(), jobTitle: "", company: "", country: "", city: "", startDate: "", endDate: "", current: false, responsibilities: "" }]);
  const addEdu  = () => set("education", [...data.education, { id: uid(), degree: "", field: "", institution: "", startYear: "", endYear: "", grade: "" }]);
  const addCert = () => set("certifications", [...data.certifications, { id: uid(), name: "", issuer: "", year: "", url: "" }]);
  const addLang = () => set("languages", [...data.languages, { id: uid(), language: "", proficiency: "" }]);
  const addPub  = () => set("publications", [...data.publications, { id: uid(), title: "", publisher: "", year: "", url: "" }]);
  const addRes  = () => set("researchWorks", [...data.researchWorks, { id: uid(), title: "", institution: "", year: "", description: "" }]);
  const addAwd  = () => set("awards", [...data.awards, { id: uid(), title: "", issuer: "", year: "", description: "" }]);

  const updExp = (id: string, k: keyof Exp, v: string | boolean) =>
    set("experience", data.experience.map(e => e.id === id ? { ...e, [k]: v } : e));
  const updEdu = (id: string, k: keyof Edu, v: string) =>
    set("education", data.education.map(e => e.id === id ? { ...e, [k]: v } : e));
  const updCert = (id: string, k: keyof Cert, v: string) =>
    set("certifications", data.certifications.map(c => c.id === id ? { ...c, [k]: v } : c));
  const updLang = (id: string, k: keyof Lang, v: string) =>
    set("languages", data.languages.map(l => l.id === id ? { ...l, [k]: v } : l));
  const updPub  = (id: string, k: keyof Pub, v: string) =>
    set("publications", data.publications.map(p => p.id === id ? { ...p, [k]: v } : p));
  const updRes  = (id: string, k: keyof Research, v: string) =>
    set("researchWorks", data.researchWorks.map(r => r.id === id ? { ...r, [k]: v } : r));
  const updAwd  = (id: string, k: keyof Award, v: string) =>
    set("awards", data.awards.map(a => a.id === id ? { ...a, [k]: v } : a));

  // ── Step contents ───────────────────────────────────────────────────────────

  const steps: Record<number, React.ReactNode> = {

    1: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Title" optional>
            <Sel value={data.title} onChange={v => set("title", v)} options={TITLES} />
          </Field>
          <Field label="First Name">
            <Inp value={data.firstName} onChange={v => set("firstName", v)} placeholder="Jane" />
          </Field>
          <Field label="Last Name">
            <Inp value={data.lastName} onChange={v => set("lastName", v)} placeholder="Doe" />
          </Field>
          <Field label="Phone">
            <Inp value={data.phone} onChange={v => set("phone", v)} placeholder="+44 7000 000000" type="tel" />
          </Field>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: "#85a0a4" }}>
            Upload CV <span className="normal-case font-normal opacity-60">(optional — AI extracts everything automatically)</span>
          </p>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className="relative flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer transition-all px-6 text-center"
            style={{
              paddingTop: parseState === "parsing" ? "1.5rem" : "2.5rem",
              paddingBottom: parseState === "parsing" ? "1.5rem" : "2.5rem",
              border: `2px dashed ${dragOver ? "#079DB3" : parseState === "done" ? "#1f9d63" : parseState === "error" ? "#f87171" : "#dbe9eb"}`,
              background: dragOver ? "rgba(0,151,178,0.04)" : "#f4fafb",
            }}>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onFileChange} />

            {parseState === "idle" && (
              <>
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: "#e3f1f2" }}>
                  <Upload size={24} style={{ color: "#079DB3" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#0a3a44" }}>Drop your CV here or click to browse</p>
                  <p className="text-xs font-medium mt-1" style={{ color: "#85a0a4" }}>PDF, DOC, DOCX · Fields auto-fill from your CV</p>
                </div>
              </>
            )}

            {parseState === "parsing" && (
              <>
                <style>{`
                  @keyframes ob-field-scan {
                    0%,100% { transform:scaleX(0.08); opacity:0.25; }
                    40%     { transform:scaleX(1);    opacity:1;    }
                    70%     { transform:scaleX(1);    opacity:0.55; }
                  }
                  @keyframes ob-dot {
                    0%,80%,100% { opacity:0.2; transform:scale(0.8); }
                    40%         { opacity:1;   transform:scale(1.2); }
                  }
                `}</style>

                {/* Header */}
                <div className="flex items-center gap-2.5 mb-1">
                  <Loader2 size={16} className="animate-spin" style={{ color: "#079DB3" }} />
                  <span className="text-sm font-bold" style={{ color: "#079DB3" }}>Counts AI Agent is scanning your CV</span>
                  <span className="flex gap-0.5">
                    {[0,1,2].map(i => (
                      <span key={i} className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background:"#079DB3", animation:`ob-dot 1.2s ease-in-out infinite`, animationDelay:`${i*0.2}s` }} />
                    ))}
                  </span>
                </div>

                {/* Field scan rows */}
                <div className="w-full space-y-2 px-2">
                  {PARSE_FIELDS.map((f, i) => (
                    <div key={f.label} className="flex items-center gap-2.5">
                      <span className="text-base w-5 text-center leading-none">{f.icon}</span>
                      <span className="text-xs font-semibold w-36 text-left shrink-0"
                        style={{ color:"rgba(10,58,68,0.55)" }}>{f.label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background:"rgba(0,151,178,0.1)" }}>
                        <div className="h-full w-full rounded-full origin-left"
                          style={{
                            background:"linear-gradient(90deg,#079DB3,#00d4f5)",
                            animation:`ob-field-scan ${PARSE_FIELDS.length * 0.38}s ease-in-out infinite`,
                            animationDelay:`${i * 0.38}s`,
                          }} />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] font-medium mt-1" style={{ color:"#85a0a4" }}>
                  You can continue — fields fill in automatically when done
                </p>
              </>
            )}

            {parseState === "done" && (
              <>
                <CheckCircle2 size={26} style={{ color: "#1f9d63" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1f9d63" }}>CV parsed — fields auto-filled!</p>
                  <p className="text-xs font-medium mt-1" style={{ color: "#85a0a4" }}>Click to upload a different file</p>
                </div>
              </>
            )}

            {parseState === "error" && (
              <>
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: "#fef2f2" }}>
                  <Upload size={24} style={{ color: "#f87171" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#dc2626" }}>
                    {parseErr || "Couldn't read this file — fill in manually"}
                  </p>
                  <p className="text-xs font-medium mt-1" style={{ color: "#85a0a4" }}>Click to try again with a PDF file</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    ),

    2: (
      <div className="space-y-6">
        <Field label="Professional Tagline">
          <div className="relative">
            <Inp value={data.tagline} onChange={v => set("tagline", v.slice(0, 120))}
              placeholder="e.g. Senior ML Engineer | Building production AI systems" />
            <span className="absolute right-3 bottom-3 text-[10px]" style={{ color: "#85a0a4" }}>
              {data.tagline.length}/120
            </span>
          </div>
        </Field>
        <Field label="Professional Bio / Summary">
          <TA value={data.bio} onChange={v => set("bio", v)} rows={7}
            placeholder="Write a compelling summary of your career, expertise, and what you bring to the table…" />
        </Field>
      </div>
    ),

    3: (
      <div className="space-y-4">
        {data.experience.length === 0 && (
          <div className="rounded-2xl py-10 text-center" style={{ border: "2px dashed #dbe9eb" }}>
            <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>No experience added yet</p>
          </div>
        )}
        {data.experience.map(e => (
          <ItemCard key={e.id} title={e.jobTitle ? `${e.jobTitle}${e.company ? ` · ${e.company}` : ""}` : ""}
            onRemove={() => set("experience", data.experience.filter(x => x.id !== e.id))}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Job Title">
                <Inp value={e.jobTitle} onChange={v => updExp(e.id, "jobTitle", v)} placeholder="Software Engineer" />
              </Field>
              <Field label="Company">
                <Inp value={e.company} onChange={v => updExp(e.id, "company", v)} placeholder="Acme Corp" />
              </Field>
              <Field label="Country">
                <Sel value={e.country ?? ""} onChange={v => updExp(e.id, "country", v)}
                  options={["", ...COUNTRIES]} />
              </Field>
              <Field label="City" optional>
                <Inp value={e.city ?? ""} onChange={v => updExp(e.id, "city", v)} placeholder="e.g. London" />
              </Field>
              <Field label="Start Date">
                <MonthYearPicker value={e.startDate ?? ""}
                  onChange={v => updExp(e.id, "startDate", v)} />
              </Field>
              <Field label="End Date">
                <MonthYearPicker value={e.endDate ?? ""} disabled={e.current}
                  onChange={v => updExp(e.id, "endDate", v)} />
              </Field>
              <Field label="Currently here?">
                <label className="flex items-center gap-2.5 h-12 cursor-pointer">
                  <input type="checkbox" checked={e.current}
                    onChange={ev => updExp(e.id, "current", ev.target.checked)}
                    className="h-4 w-4 rounded accent-teal-600" />
                  <span className="text-sm font-medium" style={{ color: "#0a3a44" }}>Yes, I work here now</span>
                </label>
              </Field>
            </div>
            <Field label="Key Responsibilities">
              <TA value={e.responsibilities} onChange={v => updExp(e.id, "responsibilities", v)} rows={5}
                placeholder={"• Led a team of 5 engineers to deliver the new auth system\n• Reduced API response time by 40%\n• Mentored 2 junior engineers"} />
              <p className="text-[11px] font-medium mt-1" style={{ color: "#85a0a4" }}>One responsibility per line</p>
            </Field>
          </ItemCard>
        ))}
        <AddBtn onClick={addExp} label="Add Work Experience" />
      </div>
    ),

    4: (
      <div className="space-y-4">
        {data.education.length === 0 && (
          <div className="rounded-2xl py-10 text-center" style={{ border: "2px dashed #dbe9eb" }}>
            <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>No education added yet</p>
          </div>
        )}
        {data.education.map(e => (
          <ItemCard key={e.id} title={e.degree ? `${e.degree}${e.institution ? ` · ${e.institution}` : ""}` : ""}
            onRemove={() => set("education", data.education.filter(x => x.id !== e.id))}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Degree / Qualification">
                <Inp value={e.degree} onChange={v => updEdu(e.id, "degree", v)} placeholder="BSc Computer Science" />
              </Field>
              <Field label="Field of Study" optional>
                <Inp value={e.field} onChange={v => updEdu(e.id, "field", v)} placeholder="Artificial Intelligence" />
              </Field>
              <Field label="Institution">
                <Inp value={e.institution} onChange={v => updEdu(e.id, "institution", v)} placeholder="University of London" />
              </Field>
              <Field label="Grade / Classification" optional>
                <Inp value={e.grade} onChange={v => updEdu(e.id, "grade", v)} placeholder="First Class / 3.9 GPA" />
              </Field>
              <Field label="Start Date" optional>
                <MonthYearPicker value={e.startYear ?? ""}
                  onChange={v => updEdu(e.id, "startYear", v)} />
              </Field>
              <Field label="End Date" optional>
                <MonthYearPicker value={e.endYear ?? ""}
                  onChange={v => updEdu(e.id, "endYear", v)} />
              </Field>
            </div>
          </ItemCard>
        ))}
        <AddBtn onClick={addEdu} label="Add Education" />
      </div>
    ),

    5: (
      <div className="space-y-8">
        {/* Skills */}
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Skills</p>
          <div className="flex flex-wrap gap-2 p-4 rounded-2xl min-h-[60px]" style={{ border: "1.5px solid #dbe9eb", background: "white" }}>
            {data.skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(0,151,178,0.1)", color: "#007a94" }}>
                {s}
                <button type="button" onClick={() => set("skills", data.skills.filter(x => x !== s))}>
                  <X size={11} />
                </button>
              </span>
            ))}
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
              placeholder={data.skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"}
              className="flex-1 min-w-[160px] outline-none text-sm font-medium bg-transparent"
              style={{ color: "#0a3a44" }} />
          </div>
          {skillInput && (
            <button type="button" onClick={addSkill}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ background: "rgba(0,151,178,0.1)", color: "#007a94" }}>
              + Add &ldquo;{skillInput}&rdquo;
            </button>
          )}
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Certifications</p>
          {data.certifications.map(c => (
            <ItemCard key={c.id} title={c.name || ""}
              onRemove={() => set("certifications", data.certifications.filter(x => x.id !== c.id))}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Certification Name">
                  <Inp value={c.name} onChange={v => updCert(c.id, "name", v)} placeholder="AWS Solutions Architect" />
                </Field>
                <Field label="Issuing Organisation">
                  <Inp value={c.issuer} onChange={v => updCert(c.id, "issuer", v)} placeholder="Amazon Web Services" />
                </Field>
                <Field label="Year" optional>
                  <Inp value={c.year} onChange={v => updCert(c.id, "year", v)} placeholder="2023" />
                </Field>
                <Field label="URL" optional>
                  <Inp value={c.url} onChange={v => updCert(c.id, "url", v)} placeholder="https://credly.com/…" />
                </Field>
              </div>
            </ItemCard>
          ))}
          <AddBtn onClick={addCert} label="Add Certification" />
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Languages</p>
          {data.languages.map(l => (
            <div key={l.id} className="grid grid-cols-2 gap-4 p-4 rounded-2xl items-end"
              style={{ border: "1.5px solid #dbe9eb", background: "#f4fafb" }}>
              <Field label="Language">
                <Sel value={l.language} onChange={v => updLang(l.id, "language", v)} options={["", ...LANGUAGES]} />
              </Field>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label="Proficiency">
                    <Sel value={l.proficiency} onChange={v => updLang(l.id, "proficiency", v)} options={["", ...PROFICIENCIES]} />
                  </Field>
                </div>
                <button type="button" onClick={() => set("languages", data.languages.filter(x => x.id !== l.id))}
                  className="mb-0.5 p-2.5 rounded-xl hover:bg-red-50 transition-colors" style={{ color: "#dc2626" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          <AddBtn onClick={addLang} label="Add Language" />
        </div>
      </div>
    ),

    6: (
      <div className="space-y-8">
        {/* Publications */}
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Publications</p>
          {data.publications.map(p => (
            <ItemCard key={p.id} title={p.title || ""}
              onRemove={() => set("publications", data.publications.filter(x => x.id !== p.id))}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title">
                  <Inp value={p.title} onChange={v => updPub(p.id, "title", v)} placeholder="Deep Learning in Healthcare…" />
                </Field>
                <Field label="Publisher / Journal">
                  <Inp value={p.publisher} onChange={v => updPub(p.id, "publisher", v)} placeholder="Nature Medicine" />
                </Field>
                <Field label="Year" optional>
                  <Inp value={p.year} onChange={v => updPub(p.id, "year", v)} placeholder="2023" />
                </Field>
                <Field label="URL / DOI" optional>
                  <Inp value={p.url} onChange={v => updPub(p.id, "url", v)} placeholder="https://doi.org/…" />
                </Field>
              </div>
            </ItemCard>
          ))}
          <AddBtn onClick={addPub} label="Add Publication" />
        </div>

        {/* Research */}
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Research Works</p>
          {data.researchWorks.map(r => (
            <ItemCard key={r.id} title={r.title || ""}
              onRemove={() => set("researchWorks", data.researchWorks.filter(x => x.id !== r.id))}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title">
                  <Inp value={r.title} onChange={v => updRes(r.id, "title", v)} placeholder="NLP for Clinical Decision Support" />
                </Field>
                <Field label="Institution">
                  <Inp value={r.institution} onChange={v => updRes(r.id, "institution", v)} placeholder="Oxford University" />
                </Field>
                <Field label="Year" optional>
                  <Inp value={r.year} onChange={v => updRes(r.id, "year", v)} placeholder="2022" />
                </Field>
              </div>
              <Field label="Description" optional>
                <TA value={r.description} onChange={v => updRes(r.id, "description", v)} rows={3}
                  placeholder="Brief description of the research…" />
              </Field>
            </ItemCard>
          ))}
          <AddBtn onClick={addRes} label="Add Research Work" />
        </div>

        {/* Awards */}
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Awards & Recognition</p>
          {data.awards.map(a => (
            <ItemCard key={a.id} title={a.title || ""}
              onRemove={() => set("awards", data.awards.filter(x => x.id !== a.id))}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Award Title">
                  <Inp value={a.title} onChange={v => updAwd(a.id, "title", v)} placeholder="Best Paper Award" />
                </Field>
                <Field label="Issuing Organisation">
                  <Inp value={a.issuer} onChange={v => updAwd(a.id, "issuer", v)} placeholder="NeurIPS 2023" />
                </Field>
                <Field label="Year" optional>
                  <Inp value={a.year} onChange={v => updAwd(a.id, "year", v)} placeholder="2023" />
                </Field>
              </div>
              <Field label="Description" optional>
                <TA value={a.description} onChange={v => updAwd(a.id, "description", v)} rows={2}
                  placeholder="What the award was for…" />
              </Field>
            </ItemCard>
          ))}
          <AddBtn onClick={addAwd} label="Add Award" />
        </div>
      </div>
    ),
  };

  // ── Layout ──────────────────────────────────────────────────────────────────

  const isFirst = step === 1;
  const isLast  = step === 6;

  return (
    <div className="min-h-screen" style={{ background: "#f4fafb" }}>

      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b" style={{ background: "white", borderColor: "#dbe9eb" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/">
            <Image src="/logo-light.png" alt="CountsAI" width={110} height={32} className="object-contain" />
          </Link>

          {/* Step pills */}
          <div className="flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <div key={n} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all"
                      style={{
                        background: done ? "#1f9d63" : active ? "#079DB3" : "#e3f1f2",
                        color: done || active ? "white" : "#85a0a4",
                      }}>
                      {done ? <CheckCircle2 size={12} /> : n}
                    </div>
                    <span className="hidden sm:block text-[11px] font-bold"
                      style={{ color: active ? "#079DB3" : done ? "#1f9d63" : "#85a0a4" }}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className="h-px w-4 sm:w-6" style={{ background: done ? "#1f9d63" : "#dbe9eb" }} />
                  )}
                </div>
              );
            })}
          </div>

          <Link href="/dashboard" className="text-xs font-bold hover:underline" style={{ color: "#85a0a4" }}>
            Skip for now
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Step header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} style={{ color: "#079DB3" }} />
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#079DB3" }}>
              Step {step} of 6
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Your professional summary"}
            {step === 3 && "Work experience"}
            {step === 4 && "Education"}
            {step === 5 && "Skills, certifications & languages"}
            {step === 6 && "Publications, research & awards"}
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: "#85a0a4" }}>
            {step === 1 && "Upload your CV and we'll fill in the rest automatically."}
            {step === 2 && "A great tagline and bio help recruiters find you."}
            {step === 3 && "Add your work history — most recent first."}
            {step === 4 && "Your academic background and qualifications."}
            {step === 5 && "What you know, what you've earned, what you speak."}
            {step === 6 && "Optional — add any notable work to stand out."}
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white" style={{ border: "1px solid #dbe9eb" }}>
          {steps[step]}
        </div>

        {saveErr && (
          <div className="mt-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
            {saveErr}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button type="button" onClick={() => setStep(s => s - 1)} disabled={isFirst}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-30"
            style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44", background: "white" }}>
            <ArrowLeft size={15} /> Back
          </button>

          {isLast ? (
            <button type="button" onClick={save} disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#079DB3" }}>
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><CheckCircle2 size={15} /> Complete Profile</>}
            </button>
          ) : (
            <button type="button" onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
              style={{ background: "#079DB3" }}>
              Continue <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
