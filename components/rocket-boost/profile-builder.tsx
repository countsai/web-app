"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { NOTICE_PERIOD_OPTIONS, VISA_STATUS_OPTIONS, SALARY_CURRENCY_OPTIONS } from "@/lib/constants";
import { CandidateProfile, ExperienceEntry, EducationEntry, CertificationEntry } from "@/lib/types";
import {
  Upload, FileText, X, Plus, Trash2, Save, Check, Loader2,
  ExternalLink, Briefcase, GraduationCap, Award, Globe,
  Target, Banknote, Sparkles, AlertCircle, LogIn,
} from "lucide-react";

const EMPTY_PROFILE: CandidateProfile = {
  id: "",
  resume_url: null,
  resume_filename: null,
  headline: "",
  summary: "",
  skills: [],
  target_roles: [],
  preferred_locations: [],
  salary_min: null,
  salary_max: null,
  salary_currency: "GBP",
  notice_period: "",
  visa_status: "",
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  experience: [],
  education: [],
  certifications: [],
};

function newExperience(): ExperienceEntry {
  return { id: crypto.randomUUID(), title: "", company: "", location: "", start_date: "", end_date: "", current: false, description: "" };
}
function newEducation(): EducationEntry {
  return { id: crypto.randomUUID(), school: "", degree: "", field: "", start_date: "", end_date: "" };
}
function newCertification(): CertificationEntry {
  return { id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "" };
}

const inputClass = "w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none transition-colors focus:border-[#079DB3] focus:ring-2 focus:ring-[#079DB3]/15 bg-white disabled:opacity-50";
const inputStyle = { border: "1.5px solid #dbe9eb", color: "#0a3a44" } as React.CSSProperties;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#546d71" }}>{label}</label>
      {children}
    </div>
  );
}

function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} style={inputStyle} {...props} />;
}

function TextAreaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} min-h-[100px] resize-y`} style={inputStyle} {...props} />;
}

function SelectField({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={inputClass} style={inputStyle} {...props}>{children}</select>;
}

function SectionCard({ icon: Icon, title, subtitle, children }: { icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-4 sm:p-8 bg-white space-y-5" style={{ border: "1.5px solid #dbe9eb" }}>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#e3f1f2" }}>
          <Icon size={16} style={{ color: "#079DB3" }} />
        </div>
        <div>
          <h3 className="text-lg font-black" style={{ color: "#0a3a44" }}>{title}</h3>
          {subtitle && <p className="text-[12px] font-medium" style={{ color: "#85a0a4" }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };

  const removeTag = (tag: string) => onChange(values.filter((t) => t !== tag));

  return (
    <div className="rounded-xl px-2.5 py-2 flex flex-wrap gap-1.5 items-center bg-white" style={{ border: "1.5px solid #dbe9eb" }}>
      {values.map((tag) => (
        <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: "#e3f1f2", color: "#079DB3" }}>
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70" aria-label={`Remove ${tag}`}>
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
          else if (e.key === "Backspace" && !draft && values.length) removeTag(values[values.length - 1]);
        }}
        onBlur={addTag}
        placeholder={values.length ? "" : placeholder}
        className="flex-1 min-w-[140px] outline-none text-sm font-medium bg-transparent py-1"
        style={{ color: "#0a3a44" }}
      />
    </div>
  );
}

function EntryListEditor<T extends { id: string }>({
  items, onChange, newItem, addLabel, emptyLabel, children,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel: string;
  emptyLabel: string;
  children: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm font-medium text-center py-4" style={{ color: "#85a0a4" }}>{emptyLabel}</p>
      )}
      {items.map((item, i) => (
        <div key={item.id} className="rounded-2xl p-4 sm:p-5 space-y-3 relative" style={{ border: "1.5px solid #dbe9eb", background: "#fafdfd" }}>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="absolute top-3 right-3 h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
            style={{ color: "#85a0a4" }}
            aria-label="Remove entry"
          >
            <Trash2 size={14} />
          </button>
          {children(item, (patch) => {
            const next = [...items];
            next[i] = { ...item, ...patch };
            onChange(next);
          })}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
        style={{ background: "#e3f1f2", color: "#079DB3" }}
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

export function ProfileBuilder() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<CandidateProfile>(EMPTY_PROFILE);
  const update = (patch: Partial<CandidateProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
    setSavedAt(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUserId(session.user.id);
      supabase
        .from("candidate_profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setProfile({
              id: data.id,
              resume_url: data.resume_url,
              resume_filename: data.resume_filename,
              headline: data.headline ?? "",
              summary: data.summary ?? "",
              skills: data.skills ?? [],
              target_roles: data.target_roles ?? [],
              preferred_locations: data.preferred_locations ?? [],
              salary_min: data.salary_min,
              salary_max: data.salary_max,
              salary_currency: data.salary_currency ?? "GBP",
              notice_period: data.notice_period ?? "",
              visa_status: data.visa_status ?? "",
              linkedin_url: data.linkedin_url ?? "",
              github_url: data.github_url ?? "",
              portfolio_url: data.portfolio_url ?? "",
              experience: data.experience ?? [],
              education: data.education ?? [],
              certifications: data.certifications ?? [],
            });
          }
          setLoading(false);
        });
    });
  }, []);

  const completeness = useMemo(() => {
    const checks = [
      !!profile.resume_url,
      profile.headline.trim().length > 0,
      profile.summary.trim().length > 0,
      profile.skills.length > 0,
      profile.target_roles.length > 0,
      profile.preferred_locations.length > 0,
      profile.salary_min !== null || profile.salary_max !== null,
      !!profile.notice_period,
      !!profile.visa_status,
      !!(profile.linkedin_url || profile.github_url || profile.portfolio_url),
      profile.experience.length > 0,
      profile.education.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const handleResumeFile = async (file: File) => {
    if (!userId) return;
    setUploadingResume(true);
    setError(null);
    const path = `${userId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
    } else {
      update({ resume_url: path, resume_filename: file.name });
    }
    setUploadingResume(false);
  };

  const handleViewResume = async () => {
    if (!profile.resume_url) return;
    const { data } = await supabase.storage.from("resumes").createSignedUrl(profile.resume_url, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    const { error: saveError } = await supabase.from("candidate_profiles").upsert({
      id: userId,
      resume_url: profile.resume_url,
      resume_filename: profile.resume_filename,
      headline: profile.headline,
      summary: profile.summary,
      skills: profile.skills,
      target_roles: profile.target_roles,
      preferred_locations: profile.preferred_locations,
      salary_min: profile.salary_min,
      salary_max: profile.salary_max,
      salary_currency: profile.salary_currency,
      notice_period: profile.notice_period,
      visa_status: profile.visa_status,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      portfolio_url: profile.portfolio_url,
      experience: profile.experience,
      education: profile.education,
      certifications: profile.certifications,
    });
    if (saveError) setError(saveError.message);
    else setSavedAt(new Date());
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin" style={{ color: "#079DB3" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sign-in notice */}
      {!userId && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#E7F5F4", border: "1.5px solid #fde8de" }}>
          <AlertCircle size={18} style={{ color: "#079DB3" }} className="shrink-0" />
          <p className="text-sm font-semibold flex-1" style={{ color: "#0a3a44" }}>
            Sign in to save your master profile — your changes won&apos;t be stored until you do.
          </p>
          <Link href="/auth/login" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white whitespace-nowrap"
            style={{ background: "#079DB3" }}>
            <LogIn size={12} /> Log In
          </Link>
        </div>
      )}

      {/* Completeness header */}
      <div className="rounded-3xl p-5 sm:p-6 bg-white" style={{ border: "1.5px solid #dbe9eb" }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-black" style={{ color: "#0a3a44" }}>Profile Completeness</h2>
            <p className="text-[12px] font-medium" style={{ color: "#85a0a4" }}>
              A complete profile powers stronger AI matches, cover letters, and application kits.
            </p>
          </div>
          <span className="text-2xl font-black shrink-0 ml-4" style={{ color: completeness >= 75 ? "#22c55e" : "#079DB3" }}>{completeness}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e3f1f2" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${completeness}%`, background: completeness >= 75 ? "#22c55e" : "#079DB3" }} />
        </div>
      </div>

      {/* Resume upload */}
      <SectionCard icon={FileText} title="Resume / CV" subtitle="Upload your latest CV — this becomes the base for tailored applications.">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleResumeFile(file); }}
        />
        {profile.resume_filename ? (
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-2xl" style={{ background: "#eef6f7" }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "white" }}>
                <FileText size={16} style={{ color: "#079DB3" }} />
              </div>
              <p className="text-sm font-black truncate" style={{ color: "#0a3a44" }}>{profile.resume_filename}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleViewResume} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest"
                style={{ background: "white", color: "#079DB3" }}>
                <ExternalLink size={11} /> View
              </button>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploadingResume || !userId}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-60"
                style={{ background: "#079DB3" }}>
                {uploadingResume ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />} Replace
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingResume || !userId}
            className="w-full rounded-2xl border-2 border-dashed p-8 text-center transition-all hover:shadow-md disabled:opacity-60"
            style={{ borderColor: "#079DB3", background: "#f4fafb" }}
          >
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#e3f1f2" }}>
              {uploadingResume ? <Loader2 size={20} className="animate-spin" style={{ color: "#079DB3" }} /> : <Upload size={20} style={{ color: "#079DB3" }} />}
            </div>
            <p className="text-sm font-black mb-1" style={{ color: "#0a3a44" }}>{uploadingResume ? "Uploading…" : "Upload Resume"}</p>
            <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>PDF or Word · max 5 MB</p>
          </button>
        )}
      </SectionCard>

      {/* About */}
      <SectionCard icon={Sparkles} title="About You">
        <Field label="Headline">
          <TextField value={profile.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="e.g. Senior AI Engineer · LLM Systems" />
        </Field>
        <Field label="Summary">
          <TextAreaField value={profile.summary} onChange={(e) => update({ summary: e.target.value })} placeholder="A short summary of your experience, strengths, and what you're looking for next." />
        </Field>
      </SectionCard>

      {/* Target roles, skills, locations */}
      <SectionCard icon={Target} title="Target Roles & Skills" subtitle="Press Enter or comma to add a tag.">
        <Field label="Target Roles">
          <TagInput values={profile.target_roles} onChange={(v) => update({ target_roles: v })} placeholder="e.g. Senior AI Engineer" />
        </Field>
        <Field label="Skills">
          <TagInput values={profile.skills} onChange={(v) => update({ skills: v })} placeholder="e.g. Python, LangChain, RAG" />
        </Field>
        <Field label="Preferred Locations">
          <TagInput values={profile.preferred_locations} onChange={(v) => update({ preferred_locations: v })} placeholder="e.g. London, Remote (UK)" />
        </Field>
      </SectionCard>

      {/* Salary & availability */}
      <SectionCard icon={Banknote} title="Salary & Availability">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Min Salary">
            <TextField type="number" inputMode="numeric" value={profile.salary_min ?? ""} onChange={(e) => update({ salary_min: e.target.value ? Number(e.target.value) : null })} placeholder="e.g. 80000" />
          </Field>
          <Field label="Max Salary">
            <TextField type="number" inputMode="numeric" value={profile.salary_max ?? ""} onChange={(e) => update({ salary_max: e.target.value ? Number(e.target.value) : null })} placeholder="e.g. 110000" />
          </Field>
          <Field label="Currency">
            <SelectField value={profile.salary_currency} onChange={(e) => update({ salary_currency: e.target.value })}>
              {SALARY_CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectField>
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Notice Period">
            <SelectField value={profile.notice_period} onChange={(e) => update({ notice_period: e.target.value })}>
              <option value="">Select…</option>
              {NOTICE_PERIOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </SelectField>
          </Field>
          <Field label="Visa / Right to Work">
            <SelectField value={profile.visa_status} onChange={(e) => update({ visa_status: e.target.value })}>
              <option value="">Select…</option>
              {VISA_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </SelectField>
          </Field>
        </div>
      </SectionCard>

      {/* Links */}
      <SectionCard icon={Globe} title="Links">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="LinkedIn">
            <TextField value={profile.linkedin_url} onChange={(e) => update({ linkedin_url: e.target.value })} placeholder="linkedin.com/in/username" />
          </Field>
          <Field label="GitHub">
            <TextField value={profile.github_url} onChange={(e) => update({ github_url: e.target.value })} placeholder="github.com/username" />
          </Field>
          <Field label="Portfolio">
            <TextField value={profile.portfolio_url} onChange={(e) => update({ portfolio_url: e.target.value })} placeholder="yourname.dev" />
          </Field>
        </div>
      </SectionCard>

      {/* Experience */}
      <SectionCard icon={Briefcase} title="Experience">
        <EntryListEditor items={profile.experience} onChange={(v) => update({ experience: v })} newItem={newExperience} addLabel="Add Experience" emptyLabel="No experience added yet">
          {(item, set) => (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Job Title"><TextField value={item.title} onChange={(e) => set({ title: e.target.value })} /></Field>
                <Field label="Company"><TextField value={item.company} onChange={(e) => set({ company: e.target.value })} /></Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Location"><TextField value={item.location} onChange={(e) => set({ location: e.target.value })} placeholder="e.g. London, UK" /></Field>
                <Field label="Start Date"><TextField type="month" value={item.start_date} onChange={(e) => set({ start_date: e.target.value })} /></Field>
                <Field label="End Date">
                  <TextField type="month" value={item.end_date} disabled={item.current} onChange={(e) => set({ end_date: e.target.value })} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer" style={{ color: "#546d71" }}>
                <input type="checkbox" checked={item.current} onChange={(e) => set({ current: e.target.checked, end_date: e.target.checked ? "" : item.end_date })} />
                I currently work here
              </label>
              <Field label="Description">
                <TextAreaField value={item.description} onChange={(e) => set({ description: e.target.value })} placeholder="Key responsibilities and achievements" />
              </Field>
            </>
          )}
        </EntryListEditor>
      </SectionCard>

      {/* Education */}
      <SectionCard icon={GraduationCap} title="Education">
        <EntryListEditor items={profile.education} onChange={(v) => update({ education: v })} newItem={newEducation} addLabel="Add Education" emptyLabel="No education added yet">
          {(item, set) => (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="School / University"><TextField value={item.school} onChange={(e) => set({ school: e.target.value })} /></Field>
                <Field label="Degree"><TextField value={item.degree} onChange={(e) => set({ degree: e.target.value })} placeholder="e.g. MSc Computer Science" /></Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Field of Study"><TextField value={item.field} onChange={(e) => set({ field: e.target.value })} /></Field>
                <Field label="Start Date"><TextField type="month" value={item.start_date} onChange={(e) => set({ start_date: e.target.value })} /></Field>
                <Field label="End Date"><TextField type="month" value={item.end_date} onChange={(e) => set({ end_date: e.target.value })} /></Field>
              </div>
            </>
          )}
        </EntryListEditor>
      </SectionCard>

      {/* Certifications */}
      <SectionCard icon={Award} title="Certifications">
        <EntryListEditor items={profile.certifications} onChange={(v) => update({ certifications: v })} newItem={newCertification} addLabel="Add Certification" emptyLabel="No certifications added yet">
          {(item, set) => (
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Name"><TextField value={item.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. AWS Certified Solutions Architect" /></Field>
              <Field label="Issuer"><TextField value={item.issuer} onChange={(e) => set({ issuer: e.target.value })} /></Field>
              <Field label="Date"><TextField type="month" value={item.date} onChange={(e) => set({ date: e.target.value })} /></Field>
              <Field label="Credential URL"><TextField value={item.url} onChange={(e) => set({ url: e.target.value })} placeholder="Link to credential" /></Field>
            </div>
          )}
        </EntryListEditor>
      </SectionCard>

      {error && (
        <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold" style={{ background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fde2e2" }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 p-4 rounded-2xl shadow-lg" style={{ background: "white", border: "1.5px solid #dbe9eb" }}>
        <p className="text-[12px] font-medium hidden sm:block" style={{ color: "#85a0a4" }}>
          {savedAt ? `Saved at ${savedAt.toLocaleTimeString()}` : "Your master profile feeds Rocket Boost's matching and application kits."}
        </p>
        <button
          onClick={handleSave}
          disabled={saving || !userId}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-all disabled:opacity-60 ml-auto"
          style={{ background: savedAt ? "#22c55e" : "#079DB3" }}
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving…</>
          ) : savedAt ? (
            <><Check size={14} /> Saved</>
          ) : (
            <><Save size={14} /> Save Profile</>
          )}
        </button>
      </div>
    </div>
  );
}
