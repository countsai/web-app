"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CandidateProfile } from "@/lib/types";
import { NOTICE_PERIOD_OPTIONS, VISA_STATUS_OPTIONS } from "@/lib/constants";
import {
  Search, MessageSquare, Eye, ChevronDown, Globe,
  ExternalLink, FileText, MapPin, Clock, Shield, CheckCircle,
  XCircle, AlertTriangle, Star, Users, X, Save, Phone, Mail,
  Briefcase, Calendar, GraduationCap, Award,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";

// ─── Joined admin candidate shape ────────────────────────────────────────────
type AdminProfileLink = { full_name: string | null; email: string; phone: string | null } | { full_name: string | null; email: string; phone: string | null }[] | null;

interface AdminCandidateProfile extends CandidateProfile {
  verification_status: string;
  admin_notes: string;
  created_at: string;
  profiles: AdminProfileLink;
}

function getProfile(link: AdminProfileLink) {
  return Array.isArray(link) ? link[0] ?? null : link;
}

function visaLabel(value: string): string {
  return VISA_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? (value || "Not set");
}

function noticeLabel(value: string): string {
  return NOTICE_PERIOD_OPTIONS.find((o) => o.value === value)?.label ?? (value || "Not set");
}

// ─── Verification status config ──────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  "Profile Submitted": { label: "Profile Submitted", color: "text-slate-600", bg: "bg-slate-100 border-slate-300", icon: FileText },
  "Under Review": { label: "Under Review", color: "text-amber-600", bg: "bg-amber-50 border-amber-300", icon: AlertTriangle },
  "Client Ready": { label: "Client Ready", color: "text-blue-600", bg: "bg-blue-50 border-blue-300", icon: CheckCircle },
  "Top Talent": { label: "Top Talent", color: "text-violet-600", bg: "bg-violet-50 border-violet-300", icon: Star },
  "Rejected": { label: "Rejected", color: "text-red-600", bg: "bg-red-50 border-red-300", icon: XCircle },
};

const ALL_STATUSES = ["Profile Submitted", "Under Review", "Client Ready", "Top Talent", "Rejected"];

// ─── WhatsApp link builder ────────────────────────────────────────────────────
function buildWhatsAppLink(phone: string): string {
  const clean = phone.replace(/[\s\-().+]/g, "");
  return `https://wa.me/${clean}`;
}

// ─── Dossier Modal ────────────────────────────────────────────────────────────
function DossierModal({
  profile,
  onClose,
  onSaveNotes,
}: {
  profile: AdminCandidateProfile;
  onClose: () => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState(profile.admin_notes);
  const [saved, setSaved] = useState(false);
  const person = getProfile(profile.profiles);
  const name = person?.full_name ?? "Unnamed";

  const cfg = STATUS_CONFIG[profile.verification_status] ?? STATUS_CONFIG["Profile Submitted"];
  const StatusIcon = cfg.icon;

  const handleSave = async () => {
    await onSaveNotes(profile.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#cfe1e4] animate-in fade-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between p-7 border-b border-[#cfe1e4]">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#079DB3]/10 flex items-center justify-center text-2xl font-black text-[#079DB3]">
              {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#16282b]">{name}</h2>
              <p className="text-[#546d71] font-medium text-sm">{profile.headline || "No headline set"}</p>
              <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                <StatusIcon size={10} /> {cfg.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#eef6f7] text-[#546d71] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#cfe1e4]">

          {/* LEFT column */}
          <div className="p-7 space-y-7">

            {/* Summary */}
            {profile.summary && (
              <section>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Summary</p>
                <p className="text-sm font-medium text-[#16282b] leading-relaxed">{profile.summary}</p>
              </section>
            )}

            {/* Contact */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Contact Info</p>
              <div className="space-y-2.5">
                {[
                  { icon: Mail, label: person?.email ?? "—" },
                  { icon: Phone, label: person?.phone ?? "Not provided" },
                  { icon: MapPin, label: profile.preferred_locations.join(", ") || "No location preference set" },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-[#16282b]">
                    <div className="p-1.5 rounded-lg bg-[#eef6f7]"><Icon size={13} className="text-[#546d71]" /></div>
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Salary & Availability */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Rate & Availability</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#eef6f7] border border-[#cfe1e4]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#546d71]/50 mb-0.5">Expected Rate</p>
                  <p className="text-base font-black text-[#16282b]">
                    {profile.salary_min || profile.salary_max
                      ? `${profile.salary_currency} ${(profile.salary_min ?? 0).toLocaleString()} – ${(profile.salary_max ?? 0).toLocaleString()}`
                      : "Not set"}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#eef6f7] border border-[#cfe1e4]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#546d71]/50 mb-0.5">Notice Period</p>
                  <p className="text-base font-black text-[#16282b]">{noticeLabel(profile.notice_period)}</p>
                </div>
              </div>
            </section>

            {/* Visa */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Visa Status</p>
              <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${profile.visa_status === "visa_required" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                <Shield size={14} className={profile.visa_status === "visa_required" ? "text-amber-600" : "text-emerald-600"} />
                <span className={`text-xs font-bold ${profile.visa_status === "visa_required" ? "text-amber-700" : "text-emerald-700"}`}>
                  {visaLabel(profile.visa_status)}
                </span>
              </div>
            </section>

            {/* Skills */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.length === 0 ? (
                  <p className="text-xs font-medium text-[#546d71]">No skills added yet</p>
                ) : profile.skills.map((skill) => (
                  <span key={skill} className="text-[10px] font-bold bg-[#e3f1f2] border border-[#cfe1e4] text-[#079DB3] px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Work Experience</p>
              {profile.experience.length === 0 ? (
                <p className="text-xs font-medium text-[#546d71]">No experience added yet</p>
              ) : (
                <div className="space-y-3">
                  {profile.experience.map((e) => (
                    <div key={e.id} className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#eef6f7] mt-0.5"><Briefcase size={12} className="text-[#546d71]" /></div>
                      <div>
                        <p className="text-sm font-bold text-[#16282b]">{e.title} · {e.company}</p>
                        <p className="text-[11px] text-[#546d71]">
                          {e.location} · {e.start_date} – {e.current ? "Present" : e.end_date}
                        </p>
                        {e.description && <p className="text-xs text-[#546d71] mt-1">{e.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT column */}
          <div className="p-7 space-y-7">

            {/* Verified Assets */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Verified Assets</p>
              <div className="space-y-2">
                {[
                  { icon: LinkedinIcon, label: "LinkedIn Profile", url: profile.linkedin_url, color: "text-blue-600" },
                  { icon: GithubIcon, label: "GitHub", url: profile.github_url, color: "text-[#16282b]" },
                  { icon: Globe, label: "Portfolio", url: profile.portfolio_url, color: "text-teal-600" },
                  { icon: FileText, label: "Resume / CV", url: profile.resume_url, color: "text-[#079DB3]" },
                ].map(({ icon: Icon, label, url, color }, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${url ? "bg-white border-[#cfe1e4] hover:border-[#079DB3]/30" : "bg-[#eef6f7] border-[#cfe1e4] opacity-50"} transition-colors`}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className={url ? color : "text-[#546d71]"} />
                      <span className="text-xs font-bold text-[#16282b]">{label}</span>
                    </div>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#079DB3] hover:text-[#16a3ba]">
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="text-[10px] text-[#546d71]">Not provided</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Preferred Roles */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Target Roles</p>
              {profile.target_roles.length === 0 ? (
                <p className="text-xs font-medium text-[#546d71]">No target roles added yet</p>
              ) : (
                <div className="space-y-1.5">
                  {profile.target_roles.map((role) => (
                    <div key={role} className="flex items-center gap-2 text-xs font-medium text-[#16282b]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#079DB3]" />
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Education */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Education</p>
              {profile.education.length === 0 ? (
                <p className="text-xs font-medium text-[#546d71]">No education added yet</p>
              ) : (
                <div className="space-y-3">
                  {profile.education.map((e) => (
                    <div key={e.id} className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#eef6f7] mt-0.5"><GraduationCap size={12} className="text-[#546d71]" /></div>
                      <div>
                        <p className="text-sm font-bold text-[#16282b]">{e.degree}{e.field ? `, ${e.field}` : ""}</p>
                        <p className="text-[11px] text-[#546d71]">{e.school} · {e.start_date} – {e.end_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <section>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Certifications</p>
                <div className="space-y-3">
                  {profile.certifications.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#eef6f7] mt-0.5"><Award size={12} className="text-[#546d71]" /></div>
                      <div>
                        <p className="text-sm font-bold text-[#16282b]">{c.name}</p>
                        <p className="text-[11px] text-[#546d71]">{c.issuer} · {c.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Quick Admin Actions</p>
              <div className="flex gap-2">
                <a
                  href={person?.phone ? buildWhatsAppLink(person.phone) : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!person?.phone}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-colors shadow-md shadow-green-500/20 ${person?.phone ? "bg-[#25D366] hover:bg-[#128C7E]" : "bg-[#cfe1e4] cursor-not-allowed pointer-events-none"}`}
                >
                  <MessageSquare size={14} /> WhatsApp
                </a>
                <a
                  href={person?.email ? `mailto:${person.email}` : "#"}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#079DB3] hover:bg-[#16a3ba] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-md shadow-blue-500/20"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
            </section>

            {/* Admin Notes */}
            <section>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]/50 mb-3">Private Admin Review Memo</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Add private notes about this candidate (only visible to admins)…"
                className="w-full text-sm font-medium text-[#16282b] bg-[#eef6f7] border border-[#cfe1e4] rounded-xl px-4 py-3 outline-none focus:border-[#079DB3]/50 focus:bg-white resize-none transition-colors placeholder:text-[#546d71]/40"
              />
              <button
                onClick={handleSave}
                className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#079DB3] hover:bg-[#16a3ba] text-white"}`}
              >
                <Save size={13} />
                {saved ? "Saved ✓" : "Save Notes"}
              </button>
            </section>
          </div>
        </div>

        {/* Footer timestamp */}
        <div className="px-7 py-4 border-t border-[#cfe1e4] flex items-center justify-between">
          <span className="text-[10px] text-[#546d71] font-medium flex items-center gap-1.5">
            <Calendar size={11} />
            Last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "—"}
          </span>
          <button onClick={onClose} className="text-xs font-black text-[#546d71] hover:text-[#16282b] uppercase tracking-widest transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vetting Dropdown ─────────────────────────────────────────────────────────
function VettingSelect({ profile, onChange }: { profile: AdminCandidateProfile; onChange: (id: string, status: string) => void }) {
  const cfg = STATUS_CONFIG[profile.verification_status] ?? STATUS_CONFIG["Profile Submitted"];

  return (
    <div className="relative">
      <select
        value={profile.verification_status}
        onChange={(e) => onChange(profile.id, e.target.value)}
        className={`appearance-none text-[10px] font-black uppercase tracking-widest pl-2.5 pr-6 py-1.5 rounded-full border cursor-pointer outline-none transition-all ${cfg.bg} ${cfg.color}`}
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <ChevronDown size={10} className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.color}`} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<AdminCandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [visaFilter, setVisaFilter] = useState<"All" | "Needs Visa" | "No Visa">("All");
  const [selectedProfile, setSelectedProfile] = useState<AdminCandidateProfile | null>(null);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/candidates");
      const data = await res.json();
      if (res.ok) setCandidates(data.candidates ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const updateVerification = async (id: string, status: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, verification_status: status } : c)));
    setSelectedProfile((prev) => (prev && prev.id === id ? { ...prev, verification_status: status } : prev));
    await fetch("/api/admin/candidates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, verification_status: status }),
    });
  };

  const saveNotes = async (id: string, notes: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, admin_notes: notes } : c)));
    await fetch("/api/admin/candidates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, admin_notes: notes }),
    });
  };

  const filtered = candidates.filter((p) => {
    const person = getProfile(p.profiles);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (person?.full_name ?? "").toLowerCase().includes(q) ||
      (person?.email ?? "").toLowerCase().includes(q) ||
      p.headline.toLowerCase().includes(q) ||
      p.skills.some((s) => s.toLowerCase().includes(q));
    const matchStatus = statusFilter === "All" || p.verification_status === statusFilter;
    const matchVisa =
      visaFilter === "All" ||
      (visaFilter === "Needs Visa" && p.visa_status === "visa_required") ||
      (visaFilter === "No Visa" && p.visa_status !== "visa_required");
    return matchSearch && matchStatus && matchVisa;
  });

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = candidates.filter((p) => p.verification_status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#16282b]">Candidate Dossier</h1>
            <p className="text-[#546d71] mt-1 font-medium">
              {candidates.length} talent profiles · Admin vetting workspace
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#eef6f7] border border-[#cfe1e4]">
              <Users size={14} className="text-[#079DB3]" />
              <span className="text-xs font-black text-[#079DB3]">{candidates.length} Profiles</span>
            </div>
          </div>
        </div>

        {/* Status Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ALL_STATUSES.map((s) => {
            const c = STATUS_CONFIG[s];
            const Icon = c.icon;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
                className={`p-3 rounded-2xl border text-left transition-all ${statusFilter === s ? `${c.bg} shadow-md` : "bg-white border-[#cfe1e4] hover:border-[#079DB3]/30"}`}
              >
                <div className={`flex items-center gap-1.5 mb-1 ${c.color}`}>
                  <Icon size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{s.split(" ")[0]}</span>
                </div>
                <span className={`text-2xl font-black ${c.color}`}>{statusCounts[s]}</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#546d71]" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, headline, skill…"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#eef6f7] border border-[#cfe1e4] text-sm font-medium text-[#16282b] outline-none focus:border-[#079DB3]/50 focus:bg-white transition-all placeholder:text-[#546d71]/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-4 rounded-xl bg-[#eef6f7] border border-[#cfe1e4] text-sm font-bold text-[#16282b] outline-none focus:border-[#079DB3]/50 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={visaFilter}
            onChange={(e) => setVisaFilter(e.target.value as typeof visaFilter)}
            className="h-11 px-4 rounded-xl bg-[#eef6f7] border border-[#cfe1e4] text-sm font-bold text-[#16282b] outline-none focus:border-[#079DB3]/50 cursor-pointer"
          >
            <option value="All">All Visa Status</option>
            <option value="Needs Visa">Requires Sponsorship</option>
            <option value="No Visa">No Sponsorship</option>
          </select>

          {(search || statusFilter !== "All" || visaFilter !== "All") && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("All"); setVisaFilter("All"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-[#546d71] hover:text-[#16282b] uppercase tracking-widest transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Candidate Table */}
        <div className="rounded-3xl border border-[#cfe1e4] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#eef6f7] border-b border-[#cfe1e4]">
                  {["Candidate", "Headline & Locations", "Skills", "Visa Status", "Vetting Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 text-[9px] font-black uppercase tracking-[0.22em] text-[#546d71]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cfe1e4]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-sm font-bold text-[#546d71]">Loading…</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-14 w-14 rounded-full bg-[#eef6f7] flex items-center justify-center">
                          <Search size={22} className="text-[#546d71]/40" />
                        </div>
                        <p className="font-black text-[#546d71]/50 uppercase tracking-wide text-sm">No candidates found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((profile) => {
                    const person = getProfile(profile.profiles);
                    const name = person?.full_name ?? "Unnamed";
                    return (
                      <tr key={profile.id} className="hover:bg-[#eef6f7]/50 transition-colors group">

                        {/* Candidate */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#079DB3]/10 flex items-center justify-center text-sm font-black text-[#079DB3] shrink-0">
                              {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#16282b]">{name}</p>
                              <p className="text-xs text-[#546d71]">{person?.email ?? "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Headline & Locations */}
                        <td className="px-5 py-4">
                          <p className="font-bold text-sm text-[#16282b]">{profile.headline || "—"}</p>
                          {profile.preferred_locations.length > 0 && (
                            <p className="text-xs text-[#546d71] flex items-center gap-1 mt-0.5">
                              <MapPin size={10} /> {profile.preferred_locations.join(", ")}
                            </p>
                          )}
                        </td>

                        {/* Skills */}
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {profile.skills.slice(0, 3).map((s) => (
                              <span key={s} className="text-[10px] font-bold bg-[#eef6f7] border border-[#cfe1e4] text-[#079DB3] px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                            {profile.skills.length === 0 && <span className="text-xs text-[#546d71]">—</span>}
                          </div>
                        </td>

                        {/* Visa Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border ${profile.visa_status === "visa_required" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                            <Shield size={9} />
                            {visaLabel(profile.visa_status)}
                          </span>
                        </td>

                        {/* Vetting Status */}
                        <td className="px-5 py-4">
                          <VettingSelect profile={profile} onChange={updateVerification} />
                          <p className="text-[9px] text-[#546d71] mt-1.5 flex items-center gap-1">
                            <Clock size={9} /> Updated {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "—"}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedProfile(profile)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#079DB3] hover:bg-[#16a3ba] text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                              <Eye size={12} /> View
                            </button>
                            {person?.phone && (
                              <a
                                href={buildWhatsAppLink(person.phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm shadow-green-500/20"
                                title={`WhatsApp ${name} on ${person.phone}`}
                              >
                                <MessageSquare size={12} /> WhatsApp
                              </a>
                            )}
                          </div>
                          {profile.admin_notes && (
                            <p className="text-[9px] text-[#079DB3] mt-1.5 font-bold flex items-center gap-1">
                              <FileText size={9} /> Has admin memo
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 bg-[#eef6f7] border-t border-[#cfe1e4] flex items-center justify-between">
            <span className="text-xs font-bold text-[#546d71]">
              Showing {filtered.length} of {candidates.length} candidates
            </span>
            <span className="text-[10px] text-[#546d71] font-medium">
              Click &quot;View&quot; to open full dossier · Click &quot;WhatsApp&quot; for instant outreach
            </span>
          </div>
        </div>
      </div>

      {/* Dossier Modal */}
      {selectedProfile && (
        <DossierModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSaveNotes={saveNotes}
        />
      )}
    </DashboardLayout>
  );
}
