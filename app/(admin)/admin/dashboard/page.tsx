"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Zap, Users, Briefcase,
  CheckCircle, MessageSquare, Phone, Search,
  ChevronDown, FileText, Building2, Mail,
  MapPin, Banknote, Globe,
  Layers, UserCheck, X, Crown, Clock,
} from "lucide-react";

// ─── Static admin data ────────────────────────────────────────────────────────

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

interface PostedJob {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  remote: boolean;
  visa: boolean;
  skills: string;
  posted: string;
}

function buildWhatsAppLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const withCountry = cleaned.startsWith("0") ? "44" + cleaned.slice(1) : cleaned;
  return `https://wa.me/${withCountry}`;
}

type TabKey = "placements" | "candidates" | "leads" | "resumes" | "postjob" | "projects" | "allocate" | "userplans" | "payouts" | "subscriptions" | "training" | "bizleads" | "consultations" | "proginterests" | "talentpool";

interface AdminSubscription {
  user_id: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  razorpay_payment_id: string | null;
  updated_at: string;
  profiles: { full_name: string; email: string } | { full_name: string; email: string }[] | null;
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  account_type: string;
  company_name: string | null;
  phone: string | null;
  created_at: string;
  plan: "Premium" | "Free";
  subscription_status: string | null;
  current_period_end: string | null;
}

type AdminProfileLink = { full_name: string | null; email: string; phone: string | null } | { full_name: string | null; email: string; phone: string | null }[] | null;

interface AdminCandidateProfile {
  id: string;
  headline: string;
  summary: string;
  skills: string[];
  target_roles: string[];
  preferred_locations: string[];
  visa_status: string;
  verification_status: string;
  admin_notes: string;
  resume_url: string | null;
  updated_at: string;
  profiles: AdminProfileLink;
}

interface AdminReferralAccount {
  id: string;
  name: string;
  email: string;
  code: string;
  wallet_balance: number;
  total_earned: number;
  created_at: string;
  referrals: { id: string; name: string; email: string; status: string; signed_up_at: string; converted_at: string | null }[];
}

interface AdminPayoutRequest {
  id: string;
  referral_account_id: string;
  amount: number;
  status: "requested" | "paid";
  requested_at: string;
  paid_at: string | null;
}

interface TrainingApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string | null;
  education: string;
  university: string | null;
  graduation_year: string | null;
  applicant_role: string | null;
  years_experience: string | null;
  technical_skills: string | null;
  ai_experience: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  motivation: string;
  preferred_start: string | null;
  status: "new" | "reviewing" | "shortlisted" | "accepted" | "rejected" | "enrolled" | "completed";
  admin_notes: string;
  created_at: string;
}

interface BusinessLead {
  id: string;
  name: string;
  company: string;
  email: string;
  website: string | null;
  country: string | null;
  company_size: string | null;
  service: string;
  description: string;
  timeline: string | null;
  budget: string | null;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  admin_notes: string;
  created_at: string;
}

interface Consultation {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  country_code: string;
  interested_in: string;
  status: "new" | "contacted" | "converted" | "closed";
  admin_notes: string;
  created_at: string;
}

interface ProgramInterest {
  id: string;
  user_id: string | null;
  name: string | null;
  email: string;
  status: "interested" | "contacted" | "enrolled" | "dropped";
  admin_notes: string;
  created_at: string;
}

interface TalentPoolEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  skills: string | null;
  message: string | null;
  status: "new" | "reviewed" | "shortlisted" | "contacted";
  admin_notes: string;
  created_at: string;
}

const CONSULT_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: "#e3f1f2", color: "#079DB3" },
  contacted: { bg: "#fffbeb", color: "#b45309" },
  converted: { bg: "#ecfdf5", color: "#059669" },
  closed:    { bg: "#f4fafb", color: "#85a0a4" },
};

const PROG_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  interested: { bg: "#e3f1f2", color: "#079DB3" },
  contacted:  { bg: "#fffbeb", color: "#b45309" },
  enrolled:   { bg: "#ecfdf5", color: "#059669" },
  dropped:    { bg: "#fef2f2", color: "#ef4444" },
};

const TALENT_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:         { bg: "#e3f1f2", color: "#079DB3" },
  reviewed:    { bg: "#fffbeb", color: "#b45309" },
  shortlisted: { bg: "#f0fdf4", color: "#15803d" },
  contacted:   { bg: "#ecfdf5", color: "#059669" },
};

const TRAINING_STATUSES = ["new", "reviewing", "shortlisted", "accepted", "rejected", "enrolled", "completed"] as const;
const TRAINING_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:         { bg: "#e3f1f2", color: "#079DB3" },
  reviewing:   { bg: "#fffbeb", color: "#b45309" },
  shortlisted: { bg: "#f0fdf4", color: "#15803d" },
  accepted:    { bg: "#ecfdf5", color: "#059669" },
  rejected:    { bg: "#fef2f2", color: "#ef4444" },
  enrolled:    { bg: "#ede9fe", color: "#7c3aed" },
  completed:   { bg: "#f0f9ff", color: "#0284c7" },
};

const BIZ_STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
const BIZ_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: "#e3f1f2", color: "#079DB3" },
  contacted: { bg: "#fffbeb", color: "#b45309" },
  qualified: { bg: "#f0fdf4", color: "#15803d" },
  proposal:  { bg: "#ede9fe", color: "#7c3aed" },
  won:       { bg: "#ecfdf5", color: "#059669" },
  lost:      { bg: "#fef2f2", color: "#ef4444" },
};

const VERIFICATION_STATUSES = ["Profile Submitted", "Under Review", "Client Ready", "Top Talent", "Rejected"];
const VERIFICATION_COLORS: Record<string, string> = {
  "Profile Submitted": "#546d71",
  "Under Review": "#079DB3",
  "Client Ready": "#10b981",
  "Top Talent": "#079DB3",
  "Rejected": "#ef4444",
};

function getProfile(link: AdminProfileLink) {
  return Array.isArray(link) ? link[0] ?? null : link;
}

function ComingSoonPanel({ icon: Icon, title, description }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; title: string; description: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-16 text-center px-8" style={{ borderColor: "#dbe9eb" }}>
      <Icon size={32} style={{ color: "#cbd9db" }} />
      <span className="mt-4 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "#f4fafb", color: "#85a0a4" }}>Coming Soon</span>
      <h3 className="text-lg font-black mt-3" style={{ color: "#546d71" }}>{title}</h3>
      <p className="text-sm font-medium mt-1 max-w-md" style={{ color: "#85a0a4" }}>{description}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("candidates");
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Real user accounts + plans
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users ?? []);
    } catch {
      // ignore — table stays as-is
    } finally {
      setUsersLoading(false);
    }
  };

  const toggleUserPlan = async (userId: string, currentPlan: "Premium" | "Free") => {
    const newPlan: "Premium" | "Free" = currentPlan === "Premium" ? "Free" : "Premium";
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
    } catch {
      // optimistic update already applied; a refresh will resync if this failed
    }
  };

  // Real candidate profiles (Rocket Boost master profiles)
  const [candidateProfiles, setCandidateProfiles] = useState<AdminCandidateProfile[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  const loadCandidateProfiles = async () => {
    setCandidatesLoading(true);
    try {
      const res = await fetch("/api/admin/candidates");
      const data = await res.json();
      if (res.ok) setCandidateProfiles(data.candidates ?? []);
    } catch {
      // ignore — table stays as-is
    } finally {
      setCandidatesLoading(false);
    }
  };

  const updateCandidateVerification = async (id: string, status: string) => {
    setCandidateProfiles((prev) => prev.map((c) => (c.id === id ? { ...c, verification_status: status } : c)));
    setOpenDropdown(null);
    try {
      await fetch("/api/admin/candidates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, verification_status: status }),
      });
    } catch {
      // optimistic update already applied; a refresh will resync if this failed
    }
  };

  // Referral programme overview
  const [referralAccounts, setReferralAccounts] = useState<AdminReferralAccount[]>([]);
  const [referralPayouts, setReferralPayouts] = useState<AdminPayoutRequest[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(false);

  const loadReferralData = async () => {
    setReferralsLoading(true);
    try {
      const res = await fetch("/api/admin/referrals");
      const data = await res.json();
      if (res.ok) {
        setReferralAccounts(data.accounts ?? []);
        setReferralPayouts(data.payouts ?? []);
      }
    } catch {
      // ignore — table stays as-is
    } finally {
      setReferralsLoading(false);
    }
  };

  const markPayoutPaid = async (id: string) => {
    setReferralPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "paid", paid_at: new Date().toISOString() } : p)));
    try {
      await fetch("/api/admin/referrals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "paid" }),
      });
    } catch {
      // optimistic update already applied; a refresh will resync if this failed
    }
  };

  // Training applications
  const [trainingApps, setTrainingApps] = useState<TrainingApplication[]>([]);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [trainingSearch, setTrainingSearch] = useState("");
  const [trainingStatusFilter, setTrainingStatusFilter] = useState("all");
  const [trainingNoteEditing, setTrainingNoteEditing] = useState<string | null>(null);
  const [trainingNoteText, setTrainingNoteText] = useState("");

  const loadTrainingApps = async () => {
    setTrainingLoading(true);
    try {
      const res = await fetch("/api/admin/training-applications");
      const data = await res.json();
      if (res.ok) setTrainingApps(data.applications ?? []);
    } catch {
      // ignore
    } finally {
      setTrainingLoading(false);
    }
  };

  const updateTrainingStatus = async (id: string, status: string) => {
    setTrainingApps(prev => prev.map(a => a.id === id ? { ...a, status: status as TrainingApplication["status"] } : a));
    await fetch("/api/admin/training-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => undefined);
  };

  const saveTrainingNote = async (id: string, notes: string) => {
    setTrainingApps(prev => prev.map(a => a.id === id ? { ...a, admin_notes: notes } : a));
    setTrainingNoteEditing(null);
    await fetch("/api/admin/training-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, admin_notes: notes }),
    }).catch(() => undefined);
  };

  // Business leads
  const [bizLeads, setBizLeads] = useState<BusinessLead[]>([]);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizSearch, setBizSearch] = useState("");
  const [bizStatusFilter, setBizStatusFilter] = useState("all");
  const [bizNoteEditing, setBizNoteEditing] = useState<string | null>(null);
  const [bizNoteText, setBizNoteText] = useState("");

  const loadBizLeads = async () => {
    setBizLoading(true);
    try {
      const res = await fetch("/api/admin/business-leads");
      const data = await res.json();
      if (res.ok) setBizLeads(data.leads ?? []);
    } catch {
      // ignore
    } finally {
      setBizLoading(false);
    }
  };

  const updateBizStatus = async (id: string, status: string) => {
    setBizLeads(prev => prev.map(l => l.id === id ? { ...l, status: status as BusinessLead["status"] } : l));
    await fetch("/api/admin/business-leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => undefined);
  };

  const saveBizNote = async (id: string, notes: string) => {
    setBizLeads(prev => prev.map(l => l.id === id ? { ...l, admin_notes: notes } : l));
    setBizNoteEditing(null);
    await fetch("/api/admin/business-leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, admin_notes: notes }),
    }).catch(() => undefined);
  };

  // Consultations
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultSearch, setConsultSearch] = useState("");
  const loadConsultations = async () => {
    setConsultLoading(true);
    try { const res = await fetch("/api/admin/consultations"); const d = await res.json(); if (res.ok) setConsultations(d.consultations ?? []); } catch { /* ignore */ } finally { setConsultLoading(false); }
  };
  const updateConsultStatus = async (id: string, status: string) => {
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: status as Consultation["status"] } : c));
    await fetch("/api/admin/consultations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }).catch(() => undefined);
  };

  // Program Interests
  const [progInterests, setProgInterests] = useState<ProgramInterest[]>([]);
  const [progLoading, setProgLoading] = useState(false);
  const loadProgInterests = async () => {
    setProgLoading(true);
    try { const res = await fetch("/api/admin/program-interests"); const d = await res.json(); if (res.ok) setProgInterests(d.interests ?? []); } catch { /* ignore */ } finally { setProgLoading(false); }
  };
  const updateProgStatus = async (id: string, status: string) => {
    setProgInterests(prev => prev.map(p => p.id === id ? { ...p, status: status as ProgramInterest["status"] } : p));
    await fetch("/api/admin/program-interests", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }).catch(() => undefined);
  };

  // Talent Pool
  const [talentPool, setTalentPool] = useState<TalentPoolEntry[]>([]);
  const [talentLoading, setTalentLoading] = useState(false);
  const loadTalentPool = async () => {
    setTalentLoading(true);
    try { const res = await fetch("/api/admin/talent-pool"); const d = await res.json(); if (res.ok) setTalentPool(d.entries ?? []); } catch { /* ignore */ } finally { setTalentLoading(false); }
  };
  const updateTalentStatus = async (id: string, status: string) => {
    setTalentPool(prev => prev.map(e => e.id === id ? { ...e, status: status as TalentPoolEntry["status"] } : e));
    await fetch("/api/admin/talent-pool", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }).catch(() => undefined);
  };

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);

  const loadSubscriptions = async () => {
    setSubscriptionsLoading(true);
    try {
      const res = await fetch("/api/admin/subscriptions");
      const data = await res.json();
      if (res.ok) setSubscriptions(data.subscriptions ?? []);
    } catch {
      // ignore — table stays as-is
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  // Refresh subscriptions on load, then periodically while the Subscriptions tab is open
  // so newly-confirmed Razorpay payments show up without a manual page reload.
  useEffect(() => {
    loadSubscriptions();
    loadUsers();
    loadCandidateProfiles();
    loadReferralData();
    loadTrainingApps();
    loadBizLeads();
    loadConsultations();
    loadProgInterests();
    loadTalentPool();
  }, []);

  useEffect(() => {
    if (activeTab !== "subscriptions") return;
    const intervalId = setInterval(loadSubscriptions, 15000);
    return () => clearInterval(intervalId);
  }, [activeTab]);

  // Post Job state
  const [jobForm, setJobForm] = useState({
    title: "", company: "", type: "Full-time", location: "", salary: "",
    remote: false, visa: false, skills: "", description: "",
  });
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([
    { id: "j1", title: "AI Integration Specialist", company: "NeuralFlow UK", type: "Full-time", location: "London", salary: "£70k–£90k", remote: false, visa: true,  skills: "LLM, Python, FastAPI", posted: "2026-06-01" },
    { id: "j2", title: "Senior ML Engineer",        company: "FinanceAI Corp", type: "Contract", location: "Remote",  salary: "£600/day",  remote: true,  visa: false, skills: "PyTorch, MLOps, GCP",    posted: "2026-06-03" },
  ]);
  const [jobPosted, setJobPosted] = useState(false);

  const filteredCandidateProfiles = candidateProfiles.filter((c) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const profile = getProfile(c.profiles);
    return (
      (profile?.full_name ?? "").toLowerCase().includes(q) ||
      (profile?.email ?? "").toLowerCase().includes(q) ||
      c.headline.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company) return;
    const newJob: PostedJob = {
      id: `j${Date.now()}`,
      title: jobForm.title, company: jobForm.company, type: jobForm.type,
      location: jobForm.location || "Remote", salary: jobForm.salary,
      remote: jobForm.remote, visa: jobForm.visa, skills: jobForm.skills,
      posted: new Date().toISOString().split("T")[0],
    };
    setPostedJobs(prev => [newJob, ...prev]);
    setJobForm({ title: "", company: "", type: "Full-time", location: "", salary: "", remote: false, visa: false, skills: "", description: "" });
    setJobPosted(true);
    setTimeout(() => setJobPosted(false), 3000);
  };

  const removeJob = (id: string) => setPostedJobs(prev => prev.filter(j => j.id !== id));

  // Derived stats from already-loaded real data
  const businessUsers = users.filter((u) => u.account_type === "business");
  const vettedCandidates = candidateProfiles.filter((c) => c.verification_status === "Client Ready" || c.verification_status === "Top Talent");
  const pendingCandidates = candidateProfiles.filter((c) => c.verification_status === "Profile Submitted" || c.verification_status === "Under Review");
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");

  const stats = [
    { label: "Active Talent", value: String(candidateProfiles.length), icon: Users, color: "#079DB3" },
    { label: "Business Accounts", value: String(businessUsers.length), icon: Building2, color: "#079DB3" },
    { label: "Vetted Candidates", value: String(vettedCandidates.length), icon: CheckCircle, color: "#16a3ba" },
    { label: "Pending Review", value: String(pendingCandidates.length), icon: Clock, color: "#546d71" },
    { label: "Active Subscriptions", value: String(activeSubscriptions.length), icon: Crown, color: "#079DB3" },
  ];

  const inputCls = "w-full h-10 rounded-xl text-sm font-medium outline-none transition-all px-3";
  const inputSt  = { background: "#f4fafb", border: "1px solid #dbe9eb", color: "#0a3a44" };
  const focusSt  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "#079DB3"; };
  const blurSt   = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "#dbe9eb"; };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">

        {/* ── Command Banner ── */}
        <div className="rounded-2xl px-6 py-5 flex items-start gap-4" style={{ background: "#0a3a44" }}>
          <Zap size={20} style={{ color: "#079DB3" }} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-white font-black text-base">Admin Dashboard Command</p>
            <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Oversee all talent verification levels, inspect corporate placement pipelines, process incoming AI project leads, and audit incoming candidate CVs and resumes.
            </p>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-4 space-y-2 border" style={{ borderColor: "#dbe9eb" }}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: "#85a0a4" }}>{s.label}</p>
                  <Icon size={14} style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-black" style={{ color: "#0a3a44" }}>{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#dbe9eb" }}>

          {/* Tab bar */}
          <div className="flex border-b overflow-x-auto" style={{ borderColor: "#dbe9eb" }}>
            {([
              { key: "placements" as TabKey, label: "Inspect Placements",       sub: "" },
              { key: "candidates" as TabKey, label: "Verify Candidates",        sub: "" },
              { key: "leads"      as TabKey, label: "Corporate Leads",          sub: "" },
              { key: "resumes"    as TabKey, label: "Audit Resumes",            sub: "" },
              { key: "postjob"    as TabKey, label: "Post Job Listing",         sub: "" },
              { key: "projects"   as TabKey, label: "Manage Projects",          sub: "" },
              { key: "allocate"   as TabKey, label: "Allocate Candidates",      sub: "" },
              { key: "userplans"  as TabKey, label: "User Plans",               sub: users.filter(u => u.plan === "Premium").length ? `${users.filter(u => u.plan === "Premium").length} Premium` : "" },
              { key: "subscriptions" as TabKey, label: "Subscriptions",         sub: subscriptions.filter(s => s.status === "active").length ? `${subscriptions.filter(s => s.status === "active").length} Active` : "" },
              { key: "payouts"    as TabKey, label: "Referral Program",         sub: referralPayouts.filter(p => p.status === "requested").length ? `${referralPayouts.filter(p => p.status === "requested").length} New` : "" },
              { key: "training"   as TabKey, label: "Training Applications",     sub: "" },
              { key: "bizleads"      as TabKey, label: "Business Leads",         sub: "" },
              { key: "consultations" as TabKey, label: "Consultations",          sub: "" },
              { key: "proginterests" as TabKey, label: "Program Interests",      sub: "" },
              { key: "talentpool"    as TabKey, label: "Talent Pool",            sub: "" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-shrink-0 px-5 py-4 text-sm font-bold border-b-2 transition-all text-left whitespace-nowrap"
                style={activeTab === tab.key
                  ? { borderColor: "#079DB3", color: "#0a3a44" }
                  : { borderColor: "transparent", color: "#85a0a4" }}>
                {tab.label}
                {tab.sub && (
                  <span className="ml-1.5 text-[10px] font-black uppercase tracking-widest opacity-50">{tab.sub}</span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── Inspect Placements ── */}
            {activeTab === "placements" && (
              <ComingSoonPanel
                icon={Briefcase}
                title="Placement pipeline coming soon"
                description="Track candidates through employer interview cycles — from shortlisted to offer extended — once the placement pipeline is built."
              />
            )}

            {/* ── Verify Candidates ── */}
            {activeTab === "candidates" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: "#85a0a4" }} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search candidates…"
                      className="w-full h-9 pl-9 pr-4 rounded-xl text-sm font-medium outline-none"
                      style={{ background: "#f4fafb", border: "1px solid #dbe9eb", color: "#0a3a44" }}
                    />
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: "#85a0a4" }}>
                    {candidatesLoading ? "Loading…" : `${filteredCandidateProfiles.length} profiles`}
                  </span>
                </div>

                {candidateProfiles.length === 0 && !candidatesLoading ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                      No candidate profiles submitted yet. Profiles appear here once a jobseeker builds their Rocket Boost master profile.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "#eaf4f5" }}>
                          {[
                            "Candidate",
                            "Headline & Skills",
                            "Visa Status",
                            "Verification Status",
                            "Contact",
                          ].map((h) => (
                            <th key={h} className="text-left pb-3 pr-6 text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCandidateProfiles.map((c) => {
                          const profile = getProfile(c.profiles);
                          const name = profile?.full_name ?? "Unnamed";
                          const email = profile?.email ?? "—";
                          const phone = profile?.phone ?? null;
                          const currentColor = VERIFICATION_COLORS[c.verification_status] ?? "#85a0a4";
                          return (
                            <tr key={c.id} className="border-b" style={{ borderColor: "#f9fafb" }}>
                              {/* Name */}
                              <td className="py-4 pr-6">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                                    style={{ background: "#079DB3" }}>
                                    {name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                                  </div>
                                  <div>
                                    <p className="font-black text-sm" style={{ color: "#0a3a44" }}>{name}</p>
                                    <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{email}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Headline & Skills */}
                              <td className="py-4 pr-6 max-w-xs">
                                <p className="text-sm font-medium" style={{ color: "#33474b" }}>{c.headline || "—"}</p>
                                {c.skills.length > 0 && (
                                  <div className="flex gap-1.5 mt-1 flex-wrap">
                                    {c.skills.slice(0, 4).map((s) => (
                                      <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: "#e3f1f2", color: "#079DB3" }}>{s}</span>
                                    ))}
                                  </div>
                                )}
                              </td>

                              {/* Visa */}
                              <td className="py-4 pr-6">
                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                                  style={{ background: "#f4fafb", color: "#546d71", border: "1px solid #dbe9eb" }}>
                                  {c.visa_status || "—"}
                                </span>
                              </td>

                              {/* Verification status dropdown */}
                              <td className="py-4 pr-6">
                                <div className="relative inline-block">
                                  <button
                                    onClick={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full border transition-all"
                                    style={{ background: "white", color: currentColor, borderColor: currentColor }}>
                                    {c.verification_status}
                                    <ChevronDown size={10} />
                                  </button>
                                  {openDropdown === c.id && (
                                    <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-xl shadow-xl border min-w-[160px]"
                                      style={{ borderColor: "#dbe9eb" }}>
                                      {VERIFICATION_STATUSES.map((opt) => (
                                        <button key={opt} onClick={() => updateCandidateVerification(c.id, opt)}
                                          className="w-full text-left px-3 py-2 text-[11px] font-bold hover:bg-gray-50 transition-colors"
                                          style={{ color: "#33474b" }}>
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Contact */}
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  {phone && (
                                    <>
                                      <a
                                        href={buildWhatsAppLink(phone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg text-white transition-opacity hover:opacity-80"
                                        style={{ background: "#25D366" }}>
                                        <MessageSquare size={11} /> WA
                                      </a>
                                      <a
                                        href={`tel:${phone}`}
                                        className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-gray-100"
                                        style={{ color: "#33474b", border: "1px solid #dbe9eb" }}>
                                        <Phone size={11} /> Call
                                      </a>
                                    </>
                                  )}
                                  {email !== "—" && (
                                    <a
                                      href={`mailto:${email}`}
                                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-gray-100"
                                      style={{ color: "#33474b", border: "1px solid #dbe9eb" }}>
                                      <Mail size={11} /> Email
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Corporate Leads ── */}
            {activeTab === "leads" && (
              <div className="space-y-4">
                <p className="text-sm font-bold" style={{ color: "#85a0a4" }}>
                  Business accounts that have signed up — reach out to onboard them as hiring partners.
                </p>
                {businessUsers.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                      {usersLoading ? "Loading…" : "No business accounts have signed up yet."}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {businessUsers.map((lead) => (
                      <div key={lead.id} className="rounded-2xl border p-5 flex flex-wrap items-start justify-between gap-4"
                        style={{ borderColor: "#dbe9eb", background: "#fafafa" }}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} style={{ color: "#079DB3" }} />
                            <span className="font-black text-sm" style={{ color: "#0a3a44" }}>{lead.company_name || lead.full_name || "—"}</span>
                          </div>
                          <p className="text-sm font-medium" style={{ color: "#33474b" }}>
                            {lead.full_name ?? "—"} · {lead.email}
                          </p>
                          <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>
                            Signed up {new Date(lead.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {lead.phone && (
                            <a href={buildWhatsAppLink(lead.phone)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl text-white transition-opacity hover:opacity-80"
                              style={{ background: "#25D366" }}>
                              <MessageSquare size={12} /> WhatsApp
                            </a>
                          )}
                          <a href={`mailto:${lead.email}`}
                            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl border transition-colors hover:bg-gray-100"
                            style={{ color: "#33474b", borderColor: "#dbe9eb" }}>
                            <Mail size={12} /> Contact
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Audit Resumes ── */}
            {activeTab === "resumes" && (
              <div className="space-y-4">
                <p className="text-sm font-bold" style={{ color: "#85a0a4" }}>
                  Candidate profiles awaiting admin screening and vetting assessment.
                </p>
                {pendingCandidates.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                      {candidatesLoading ? "Loading…" : "No profiles pending review."}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {pendingCandidates.map((r) => {
                      const profile = getProfile(r.profiles);
                      const name = profile?.full_name ?? "Unnamed";
                      return (
                        <div key={r.id} className="rounded-2xl border p-5 flex flex-wrap items-center justify-between gap-4"
                          style={{ borderColor: "#dbe9eb", background: "#fafafa" }}>
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                              style={{ background: "#079DB3" }}>
                              {name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-black text-sm" style={{ color: "#0a3a44" }}>{name}</p>
                              <p className="text-sm font-medium" style={{ color: "#33474b" }}>{r.headline || "—"}</p>
                              {r.skills.length > 0 && (
                                <div className="flex gap-1.5 mt-1 flex-wrap">
                                  {r.skills.slice(0, 4).map((s) => (
                                    <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                      style={{ background: "#e3f1f2", color: "#079DB3" }}>{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                              style={{ background: "white", color: VERIFICATION_COLORS[r.verification_status] ?? "#85a0a4", border: `1px solid ${VERIFICATION_COLORS[r.verification_status] ?? "#85a0a4"}` }}>
                              {r.verification_status}
                            </span>
                            {r.resume_url && (
                              <a href={r.resume_url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl text-white"
                                style={{ background: "#079DB3" }}>
                                <FileText size={12} /> View Resume
                              </a>
                            )}
                            <button onClick={() => updateCandidateVerification(r.id, "Client Ready")}
                              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl text-white transition-opacity hover:opacity-80"
                              style={{ background: "#10b981" }}>
                              <CheckCircle size={12} /> Mark Ready
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {/* ── Post Job Listing ── */}
            {activeTab === "postjob" && (
              <div className="space-y-6">
                {jobPosted && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a" }}>
                    <CheckCircle size={14} /> Job listing published successfully.
                  </div>
                )}

                <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Job Title *</label>
                    <input value={jobForm.title} onChange={e => setJobForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Senior AI Engineer" className={inputCls} style={inputSt}
                      onFocus={focusSt} onBlur={blurSt} />
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Company *</label>
                    <input value={jobForm.company} onChange={e => setJobForm(f => ({ ...f, company: e.target.value }))}
                      placeholder="e.g. NeuralFlow UK" className={inputCls} style={inputSt}
                      onFocus={focusSt} onBlur={blurSt} />
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Job Type</label>
                    <select value={jobForm.type} onChange={e => setJobForm(f => ({ ...f, type: e.target.value }))}
                      className={inputCls} style={inputSt} onFocus={focusSt} onBlur={blurSt}>
                      {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Location</label>
                    <input value={jobForm.location} onChange={e => setJobForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. London / Remote" className={inputCls} style={inputSt}
                      onFocus={focusSt} onBlur={blurSt} />
                  </div>

                  {/* Salary */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Salary / Rate</label>
                    <input value={jobForm.salary} onChange={e => setJobForm(f => ({ ...f, salary: e.target.value }))}
                      placeholder="e.g. £70k–£90k or £600/day" className={inputCls} style={inputSt}
                      onFocus={focusSt} onBlur={blurSt} />
                  </div>

                  {/* Skills */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Key Skills (comma-separated)</label>
                    <input value={jobForm.skills} onChange={e => setJobForm(f => ({ ...f, skills: e.target.value }))}
                      placeholder="e.g. Python, LLMs, FastAPI" className={inputCls} style={inputSt}
                      onFocus={focusSt} onBlur={blurSt} />
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6 md:col-span-2">
                    <button type="button" onClick={() => setJobForm(f => ({ ...f, remote: !f.remote }))}
                      className="flex items-center gap-2 text-sm font-bold"
                      style={{ color: jobForm.remote ? "#079DB3" : "#85a0a4" }}>
                      <Globe size={15} />
                      Remote-friendly: <span className="ml-1 font-black">{jobForm.remote ? "Yes" : "No"}</span>
                    </button>
                    <button type="button" onClick={() => setJobForm(f => ({ ...f, visa: !f.visa }))}
                      className="flex items-center gap-2 text-sm font-bold"
                      style={{ color: jobForm.visa ? "#079DB3" : "#85a0a4" }}>
                      <MapPin size={15} />
                      Visa Sponsorship: <span className="ml-1 font-black">{jobForm.visa ? "Yes" : "No"}</span>
                    </button>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Role Description (optional)</label>
                    <textarea value={jobForm.description} onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe responsibilities, requirements, benefits…"
                      rows={4}
                      className="w-full rounded-xl text-sm font-medium outline-none transition-all px-3 py-2.5 resize-none"
                      style={inputSt}
                      onFocus={focusSt} onBlur={blurSt} />
                  </div>

                  <div className="md:col-span-2">
                    <button type="submit"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                      style={{ background: "#079DB3" }}>
                      <Banknote size={14} /> Publish Job Listing
                    </button>
                  </div>
                </form>

                {/* Posted jobs list */}
                {postedJobs.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "#85a0a4" }}>
                      Live Listings ({postedJobs.length})
                    </p>
                    <div className="space-y-2.5">
                      {postedJobs.map(j => (
                        <div key={j.id} className="flex items-start justify-between gap-4 rounded-2xl p-4 border"
                          style={{ borderColor: "#dbe9eb", background: "#fafafa" }}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm" style={{ color: "#0a3a44" }}>{j.title}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                style={{ background: "#e3f1f2", color: "#079DB3" }}>{j.type}</span>
                              {j.remote && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a" }}>Remote</span>}
                              {j.visa && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: "#fff7ed", color: "#ea580c" }}>Visa</span>}
                            </div>
                            <p className="text-sm font-medium" style={{ color: "#33474b" }}>
                              {j.company} · {j.location} {j.salary && `· ${j.salary}`}
                            </p>
                            {j.skills && <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{j.skills}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-medium" style={{ color: "#85a0a4" }}>
                              {new Date(j.posted).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </span>
                            <button onClick={() => removeJob(j.id)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                              style={{ color: "#85a0a4" }}>
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Manage Projects ── */}
            {activeTab === "projects" && (
              <ComingSoonPanel
                icon={Layers}
                title="Project management coming soon"
                description="Track client projects, roles, and deadlines in one place — coming soon."
              />
            )}

            {/* ── Allocate Candidates ── */}
            {activeTab === "allocate" && (
              <ComingSoonPanel
                icon={UserCheck}
                title="Candidate allocation coming soon"
                description="Assign vetted candidates to client projects directly from here — coming soon."
              />
            )}

            {/* ── User Plans ── */}
            {activeTab === "userplans" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold" style={{ color: "#85a0a4" }}>
                    Switch users between Free and Premium plans. Changes take effect immediately.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                      {users.filter(u => u.plan === "Premium").length} Premium
                    </span>
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "#f4fafb", color: "#546d71" }}>
                      {users.filter(u => u.plan === "Free").length} Free
                    </span>
                    <button
                      onClick={loadUsers}
                      disabled={usersLoading}
                      className="px-3 py-1.5 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
                      style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                      {usersLoading ? "Refreshing…" : "Refresh"}
                    </button>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                      {usersLoading ? "Loading users…" : "No user accounts yet."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "#eaf4f5" }}>
                          {["User", "Account Type", "Contact", "Current Plan", "Action"].map((h) => (
                            <th key={h} className="text-left pb-3 pr-6 text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => {
                          const name = u.full_name ?? u.email;
                          return (
                            <tr key={u.id} className="border-b" style={{ borderColor: "#f9fafb" }}>
                              {/* User */}
                              <td className="py-4 pr-6">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                                    style={{ background: u.plan === "Premium" ? "#079DB3" : "#85a0a4" }}>
                                    {name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-black text-sm" style={{ color: "#0a3a44" }}>{name}</p>
                                    <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{u.email}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Account type */}
                              <td className="py-4 pr-6">
                                <p className="text-sm font-medium capitalize" style={{ color: "#33474b" }}>{u.account_type}</p>
                                {u.company_name && (
                                  <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{u.company_name}</p>
                                )}
                              </td>

                              {/* Contact */}
                              <td className="py-4 pr-6">
                                <p className="text-sm font-medium" style={{ color: "#33474b" }}>{u.phone ?? "—"}</p>
                              </td>

                              {/* Plan badge */}
                              <td className="py-4 pr-6">
                                {u.plan === "Premium" ? (
                                  <span className="flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                                    style={{ background: "#e3f1f2", color: "#079DB3" }}>
                                    <Crown size={10} /> Premium
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                                    style={{ background: "#f4fafb", color: "#85a0a4", border: "1px solid #dbe9eb" }}>
                                    Free
                                  </span>
                                )}
                              </td>

                              {/* Toggle button */}
                              <td className="py-4">
                                <button
                                  onClick={() => toggleUserPlan(u.id, u.plan)}
                                  className="text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all hover:opacity-80"
                                  style={u.plan === "Premium"
                                    ? { background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" }
                                    : { background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                                  {u.plan === "Premium" ? "↓ Move to Free" : "↑ Upgrade to Premium"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Subscriptions ── */}
            {activeTab === "subscriptions" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold" style={{ color: "#85a0a4" }}>
                    Pro subscriptions activated via Razorpay. Status updates automatically from payment webhooks.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "#ecfdf5", color: "#059669" }}>
                      {subscriptions.filter(s => s.status === "active").length} Active
                    </span>
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "#f4fafb", color: "#546d71" }}>
                      {subscriptions.length} Total
                    </span>
                    <button
                      onClick={loadSubscriptions}
                      disabled={subscriptionsLoading}
                      className="px-3 py-1.5 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
                      style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                      {subscriptionsLoading ? "Refreshing…" : "Refresh"}
                    </button>
                  </div>
                </div>

                {subscriptions.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                      No Pro subscriptions yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "#eaf4f5" }}>
                          {["User", "Plan", "Status", "Pro Until", "Payment ID"].map((h) => (
                            <th key={h} className="text-left pb-3 pr-6 text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((s) => {
                          const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
                          const isActive = s.status === "active" || s.status === "trialing";
                          return (
                            <tr key={s.user_id} className="border-b" style={{ borderColor: "#f9fafb" }}>
                              <td className="py-4 pr-6">
                                <p className="font-black text-sm" style={{ color: "#0a3a44" }}>{profile?.full_name ?? "—"}</p>
                                <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{profile?.email ?? s.user_id}</p>
                              </td>
                              <td className="py-4 pr-6">
                                <span className="flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                                  style={{ background: "#e3f1f2", color: "#079DB3" }}>
                                  <Crown size={10} /> {s.plan}
                                </span>
                              </td>
                              <td className="py-4 pr-6">
                                {isActive ? (
                                  <span className="flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                                    style={{ background: "#ecfdf5", color: "#059669" }}>
                                    <CheckCircle size={10} /> {s.status}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                                    style={{ background: "#f4fafb", color: "#85a0a4", border: "1px solid #dbe9eb" }}>
                                    {s.status}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 pr-6">
                                <p className="text-sm font-medium" style={{ color: "#33474b" }}>
                                  {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}
                                </p>
                              </td>
                              <td className="py-4 pr-6">
                                <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{s.razorpay_payment_id ?? "—"}</p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Referral Payouts ── */}
            {activeTab === "payouts" && (
              <div className="space-y-8">
                {/* Referral Accounts overview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold" style={{ color: "#85a0a4" }}>
                      Referral partner accounts, codes, and wallet balances.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                      <span className="px-2.5 py-1 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                        {referralAccounts.length} Accounts
                      </span>
                      <button
                        onClick={loadReferralData}
                        disabled={referralsLoading}
                        className="px-3 py-1.5 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
                        style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                        {referralsLoading ? "Refreshing…" : "Refresh"}
                      </button>
                    </div>
                  </div>

                  {referralAccounts.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                        {referralsLoading ? "Loading referral accounts…" : "No referral partner accounts yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b" style={{ borderColor: "#eaf4f5" }}>
                            {["Partner", "Referral Code", "Referrals", "Wallet Balance", "Total Earned"].map((h) => (
                              <th key={h} className="text-left pb-3 pr-6 text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {referralAccounts.map((acc) => {
                            const successCount = acc.referrals.filter((r) => r.status === "success").length;
                            return (
                              <tr key={acc.id} className="border-b" style={{ borderColor: "#f9fafb" }}>
                                <td className="py-4 pr-6">
                                  <p className="font-black text-sm" style={{ color: "#0a3a44" }}>{acc.name}</p>
                                  <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{acc.email}</p>
                                </td>
                                <td className="py-4 pr-6">
                                  <span className="text-[11px] font-black tracking-widest px-2.5 py-1 rounded-full"
                                    style={{ background: "#f4fafb", color: "#079DB3", border: "1px solid #dbe9eb" }}>
                                    {acc.code}
                                  </span>
                                </td>
                                <td className="py-4 pr-6">
                                  <p className="text-sm font-medium" style={{ color: "#33474b" }}>
                                    {successCount} converted · {acc.referrals.length} total
                                  </p>
                                </td>
                                <td className="py-4 pr-6">
                                  <p className="font-black text-sm" style={{ color: "#0a3a44" }}>£{acc.wallet_balance.toFixed(2)}</p>
                                </td>
                                <td className="py-4 pr-6">
                                  <p className="text-sm font-medium" style={{ color: "#33474b" }}>£{acc.total_earned.toFixed(2)}</p>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Payout requests */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold" style={{ color: "#85a0a4" }}>
                      Payout requests from referral partners. Payouts are processed monthly.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                      <span className="px-2.5 py-1 rounded-full" style={{ background: "#fffbeb", color: "#b45309" }}>
                        {referralPayouts.filter(p => p.status === "requested").length} Pending
                      </span>
                      <span className="px-2.5 py-1 rounded-full" style={{ background: "#ecfdf5", color: "#059669" }}>
                        {referralPayouts.filter(p => p.status === "paid").length} Paid
                      </span>
                    </div>
                  </div>

                  {referralPayouts.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                        No payout requests yet.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b" style={{ borderColor: "#eaf4f5" }}>
                            {["Referrer", "Amount", "Requested", "Status", "Action"].map((h) => (
                              <th key={h} className="text-left pb-3 pr-6 text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {referralPayouts.map((p) => {
                            const account = referralAccounts.find((a) => a.id === p.referral_account_id);
                            return (
                              <tr key={p.id} className="border-b" style={{ borderColor: "#f9fafb" }}>
                                <td className="py-4 pr-6">
                                  <p className="font-black text-sm" style={{ color: "#0a3a44" }}>{account?.name ?? "—"}</p>
                                  <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{account?.email ?? p.referral_account_id}</p>
                                </td>
                                <td className="py-4 pr-6">
                                  <p className="font-black text-sm" style={{ color: "#0a3a44" }}>£{p.amount.toFixed(2)}</p>
                                </td>
                                <td className="py-4 pr-6">
                                  <p className="text-sm font-medium" style={{ color: "#33474b" }}>{new Date(p.requested_at).toLocaleDateString()}</p>
                                </td>
                                <td className="py-4 pr-6">
                                  {p.status === "paid" ? (
                                    <span className="flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                                      style={{ background: "#ecfdf5", color: "#059669" }}>
                                      <CheckCircle size={10} /> Paid
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full"
                                      style={{ background: "#fffbeb", color: "#b45309" }}>
                                      <Clock size={10} /> Requested
                                    </span>
                                  )}
                                </td>
                                <td className="py-4">
                                  {p.status === "requested" ? (
                                    <button
                                      onClick={() => markPayoutPaid(p.id)}
                                      className="text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all hover:opacity-80"
                                      style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                                      Mark as Paid
                                    </button>
                                  ) : (
                                    <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>
                                      {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : ""}
                                    </p>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Training Applications ── */}
            {activeTab === "training" && (() => {
              const filtered = trainingApps
                .filter(a => trainingStatusFilter === "all" || a.status === trainingStatusFilter)
                .filter(a => {
                  const q = trainingSearch.toLowerCase();
                  return !q || a.full_name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || (a.country ?? "").toLowerCase().includes(q);
                });
              return (
                <div className="space-y-5">
                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[180px]">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }} />
                      <input
                        value={trainingSearch}
                        onChange={e => setTrainingSearch(e.target.value)}
                        placeholder="Search applicants…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }}
                      />
                    </div>
                    <select
                      value={trainingStatusFilter}
                      onChange={e => setTrainingStatusFilter(e.target.value)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
                      style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }}>
                      <option value="all">All Statuses</option>
                      {TRAINING_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <button
                      onClick={loadTrainingApps}
                      disabled={trainingLoading}
                      className="px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-opacity hover:opacity-80"
                      style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                      {trainingLoading ? "Loading…" : "Refresh"}
                    </button>
                    <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                      {filtered.length} Applications
                    </span>
                  </div>

                  {trainingLoading && filtered.length === 0 ? (
                    <div className="py-16 text-center"><p className="text-sm" style={{ color: "#85a0a4" }}>Loading…</p></div>
                  ) : filtered.length === 0 ? (
                    <div className="py-16 text-center"><p className="text-sm" style={{ color: "#85a0a4" }}>No applications found.</p></div>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map(app => {
                        const sc = TRAINING_STATUS_COLORS[app.status] ?? { bg: "#f4fafb", color: "#85a0a4" };
                        const isEditingNote = trainingNoteEditing === app.id;
                        return (
                          <div key={app.id} className="rounded-2xl p-5 bg-white" style={{ border: "1.5px solid #dbe9eb" }}>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              {/* Identity */}
                              <div className="flex-1 min-w-[200px]">
                                <p className="text-sm font-black" style={{ color: "#0a3a44" }}>{app.full_name}</p>
                                <p className="text-[11px] font-medium mb-1" style={{ color: "#85a0a4" }}>{app.email} · {app.phone}</p>
                                <div className="flex flex-wrap gap-2 text-[10px] font-semibold" style={{ color: "#546d71" }}>
                                  <span>{app.country}{app.city ? `, ${app.city}` : ""}</span>
                                  {app.education && <span>· {app.education}</span>}
                                  {app.applicant_role && <span>· {app.applicant_role}</span>}
                                  {app.years_experience && <span>· {app.years_experience} yrs exp</span>}
                                  {app.preferred_start && <span>· Starts: {app.preferred_start}</span>}
                                </div>
                                {app.technical_skills && (
                                  <p className="text-[11px] mt-1.5" style={{ color: "#5f7679" }}>
                                    <span className="font-black">Skills:</span> {app.technical_skills}
                                  </p>
                                )}
                                {app.motivation && (
                                  <p className="text-[11px] mt-1 line-clamp-2" style={{ color: "#85a0a4" }}>
                                    "{app.motivation}"
                                  </p>
                                )}
                                <p className="text-[10px] mt-1.5" style={{ color: "#cbd9db" }}>
                                  Applied {new Date(app.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {/* Status + actions */}
                              <div className="flex flex-col items-end gap-2">
                                <select
                                  value={app.status}
                                  onChange={e => updateTrainingStatus(app.id, e.target.value)}
                                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                                  style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                                  {TRAINING_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                                <div className="flex gap-2">
                                  {app.linkedin_url && (
                                    <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer"
                                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                      style={{ background: "#f4fafb", color: "#079DB3" }}>
                                      LinkedIn
                                    </a>
                                  )}
                                  {app.github_url && (
                                    <a href={app.github_url} target="_blank" rel="noopener noreferrer"
                                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                      style={{ background: "#f4fafb", color: "#079DB3" }}>
                                      GitHub
                                    </a>
                                  )}
                                  <button
                                    onClick={() => { setTrainingNoteEditing(app.id); setTrainingNoteText(app.admin_notes); }}
                                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                    style={{ background: "#f4fafb", color: "#546d71" }}>
                                    Notes
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* Admin notes */}
                            {isEditingNote && (
                              <div className="mt-3 space-y-2">
                                <textarea
                                  value={trainingNoteText}
                                  onChange={e => setTrainingNoteText(e.target.value)}
                                  rows={3}
                                  placeholder="Admin notes…"
                                  className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                                  style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveTrainingNote(app.id, trainingNoteText)}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-white"
                                    style={{ background: "#079DB3" }}>
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setTrainingNoteEditing(null)}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider"
                                    style={{ background: "#f4fafb", color: "#85a0a4" }}>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                            {!isEditingNote && app.admin_notes && (
                              <p className="mt-2 text-[11px] px-3 py-2 rounded-lg" style={{ background: "#f4fafb", color: "#546d71" }}>
                                <span className="font-black">Note:</span> {app.admin_notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Business Leads ── */}
            {activeTab === "bizleads" && (() => {
              const filtered = bizLeads
                .filter(l => bizStatusFilter === "all" || l.status === bizStatusFilter)
                .filter(l => {
                  const q = bizSearch.toLowerCase();
                  return !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
                });
              return (
                <div className="space-y-5">
                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[180px]">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }} />
                      <input
                        value={bizSearch}
                        onChange={e => setBizSearch(e.target.value)}
                        placeholder="Search leads…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }}
                      />
                    </div>
                    <select
                      value={bizStatusFilter}
                      onChange={e => setBizStatusFilter(e.target.value)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
                      style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }}>
                      <option value="all">All Statuses</option>
                      {BIZ_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <button
                      onClick={loadBizLeads}
                      disabled={bizLoading}
                      className="px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-opacity hover:opacity-80"
                      style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                      {bizLoading ? "Loading…" : "Refresh"}
                    </button>
                    <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                      {filtered.length} Leads
                    </span>
                  </div>

                  {bizLoading && filtered.length === 0 ? (
                    <div className="py-16 text-center"><p className="text-sm" style={{ color: "#85a0a4" }}>Loading…</p></div>
                  ) : filtered.length === 0 ? (
                    <div className="py-16 text-center"><p className="text-sm" style={{ color: "#85a0a4" }}>No leads found.</p></div>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map(lead => {
                        const sc = BIZ_STATUS_COLORS[lead.status] ?? { bg: "#f4fafb", color: "#85a0a4" };
                        const isEditingNote = bizNoteEditing === lead.id;
                        return (
                          <div key={lead.id} className="rounded-2xl p-5 bg-white" style={{ border: "1.5px solid #dbe9eb" }}>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              {/* Identity */}
                              <div className="flex-1 min-w-[200px]">
                                <p className="text-sm font-black" style={{ color: "#0a3a44" }}>{lead.name}</p>
                                <p className="text-[12px] font-semibold mb-1" style={{ color: "#5f7679" }}>{lead.company}{lead.company_size ? ` · ${lead.company_size}` : ""}</p>
                                <p className="text-[11px] font-medium mb-2" style={{ color: "#85a0a4" }}>
                                  {lead.email}{lead.country ? ` · ${lead.country}` : ""}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: "#f0f9ff", color: "#0284c7" }}>
                                    {lead.service}
                                  </span>
                                  {lead.timeline && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#f4fafb", color: "#546d71" }}>Timeline: {lead.timeline}</span>}
                                  {lead.budget && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#f4fafb", color: "#546d71" }}>Budget: {lead.budget}</span>}
                                </div>
                                {lead.description && (
                                  <p className="text-[11px] line-clamp-2" style={{ color: "#85a0a4" }}>"{lead.description}"</p>
                                )}
                                <p className="text-[10px] mt-1.5" style={{ color: "#cbd9db" }}>
                                  Submitted {new Date(lead.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {/* Status + actions */}
                              <div className="flex flex-col items-end gap-2">
                                <select
                                  value={lead.status}
                                  onChange={e => updateBizStatus(lead.id, e.target.value)}
                                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                                  style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                                  {BIZ_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                                <div className="flex gap-2">
                                  <a href={`mailto:${lead.email}`}
                                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                    style={{ background: "#f4fafb", color: "#079DB3" }}>
                                    Email
                                  </a>
                                  {lead.website && (
                                    <a href={lead.website} target="_blank" rel="noopener noreferrer"
                                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                      style={{ background: "#f4fafb", color: "#079DB3" }}>
                                      Website
                                    </a>
                                  )}
                                  <button
                                    onClick={() => { setBizNoteEditing(lead.id); setBizNoteText(lead.admin_notes); }}
                                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                    style={{ background: "#f4fafb", color: "#546d71" }}>
                                    Notes
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* Admin notes */}
                            {isEditingNote && (
                              <div className="mt-3 space-y-2">
                                <textarea
                                  value={bizNoteText}
                                  onChange={e => setBizNoteText(e.target.value)}
                                  rows={3}
                                  placeholder="Admin notes…"
                                  className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                                  style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveBizNote(lead.id, bizNoteText)}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-white"
                                    style={{ background: "#079DB3" }}>
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setBizNoteEditing(null)}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider"
                                    style={{ background: "#f4fafb", color: "#85a0a4" }}>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                            {!isEditingNote && lead.admin_notes && (
                              <p className="mt-2 text-[11px] px-3 py-2 rounded-lg" style={{ background: "#f4fafb", color: "#546d71" }}>
                                <span className="font-black">Note:</span> {lead.admin_notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Consultations ── */}
            {activeTab === "consultations" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }} />
                    <input value={consultSearch} onChange={e => setConsultSearch(e.target.value)} placeholder="Search…"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }} />
                  </div>
                  <button onClick={loadConsultations} disabled={consultLoading}
                    className="px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-opacity hover:opacity-80"
                    style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                    {consultLoading ? "Loading…" : "Refresh"}
                  </button>
                  <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                    {consultations.length} Total
                  </span>
                </div>
                {consultations.length === 0
                  ? <div className="py-16 text-center"><p className="text-sm" style={{ color: "#85a0a4" }}>{consultLoading ? "Loading…" : "No consultation requests yet."}</p></div>
                  : <div className="space-y-3">
                    {consultations.filter(c => !consultSearch || c.name.toLowerCase().includes(consultSearch.toLowerCase()) || c.phone.includes(consultSearch) || c.interested_in.toLowerCase().includes(consultSearch.toLowerCase())).map(c => {
                      const sc = CONSULT_STATUS_COLORS[c.status] ?? { bg: "#f4fafb", color: "#85a0a4" };
                      return (
                        <div key={c.id} className="rounded-2xl p-5 bg-white flex flex-wrap items-start justify-between gap-4" style={{ border: "1.5px solid #dbe9eb" }}>
                          <div>
                            <p className="text-sm font-black" style={{ color: "#0a3a44" }}>{c.name}</p>
                            <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>{c.country_code} {c.phone}</p>
                            {c.email && <p className="text-[11px] font-medium mb-1" style={{ color: "#85a0a4" }}>{c.email}</p>}
                            <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1" style={{ background: "#f0f9ff", color: "#0284c7" }}>{c.interested_in}</span>
                            <p className="text-[10px]" style={{ color: "#cbd9db" }}>{new Date(c.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <select value={c.status} onChange={e => updateConsultStatus(c.id, e.target.value)}
                              className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                              style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                              {["new","contacted","converted","closed"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </select>
                            <a href={`tel:${c.country_code}${c.phone}`}
                              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                              style={{ background: "#f4fafb", color: "#079DB3" }}>
                              Call
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            )}

            {/* ── Program Interests ── */}
            {activeTab === "proginterests" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={loadProgInterests} disabled={progLoading}
                    className="px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-opacity hover:opacity-80"
                    style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                    {progLoading ? "Loading…" : "Refresh"}
                  </button>
                  <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                    {progInterests.length} Total
                  </span>
                </div>
                {progInterests.length === 0
                  ? <div className="py-16 text-center"><p className="text-sm" style={{ color: "#85a0a4" }}>{progLoading ? "Loading…" : "No program interests yet."}</p></div>
                  : <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "#eaf4f5" }}>
                          {["Name","Email","Status","Signed Up","Action"].map(h => (
                            <th key={h} className="text-left pb-3 pr-6 text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {progInterests.map(p => {
                          const sc = PROG_STATUS_COLORS[p.status] ?? { bg: "#f4fafb", color: "#85a0a4" };
                          return (
                            <tr key={p.id} className="border-b" style={{ borderColor: "#f9fafb" }}>
                              <td className="py-4 pr-6"><p className="font-black text-sm" style={{ color: "#0a3a44" }}>{p.name ?? "—"}</p></td>
                              <td className="py-4 pr-6"><p className="text-sm" style={{ color: "#33474b" }}>{p.email}</p></td>
                              <td className="py-4 pr-6">
                                <select value={p.status} onChange={e => updateProgStatus(p.id, e.target.value)}
                                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                                  style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                                  {["interested","contacted","enrolled","dropped"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                                </select>
                              </td>
                              <td className="py-4 pr-6"><p className="text-sm" style={{ color: "#85a0a4" }}>{new Date(p.created_at).toLocaleDateString()}</p></td>
                              <td className="py-4">
                                <a href={`mailto:${p.email}`}
                                  className="text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded-xl"
                                  style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                                  Email
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            )}

            {/* ── Talent Pool ── */}
            {activeTab === "talentpool" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={loadTalentPool} disabled={talentLoading}
                    className="px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-opacity hover:opacity-80"
                    style={{ background: "#e3f1f2", color: "#079DB3", border: "1px solid #cfe1e4" }}>
                    {talentLoading ? "Loading…" : "Refresh"}
                  </button>
                  <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                    {talentPool.length} Entries
                  </span>
                </div>
                {talentPool.length === 0
                  ? <div className="py-16 text-center"><p className="text-sm" style={{ color: "#85a0a4" }}>{talentLoading ? "Loading…" : "No talent pool submissions yet."}</p></div>
                  : <div className="space-y-3">
                    {talentPool.map(entry => {
                      const sc = TALENT_STATUS_COLORS[entry.status] ?? { bg: "#f4fafb", color: "#85a0a4" };
                      return (
                        <div key={entry.id} className="rounded-2xl p-5 bg-white flex flex-wrap items-start justify-between gap-4" style={{ border: "1.5px solid #dbe9eb" }}>
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm font-black" style={{ color: "#0a3a44" }}>{entry.name}</p>
                            <p className="text-[11px] font-medium mb-1" style={{ color: "#85a0a4" }}>{entry.email}{entry.phone ? ` · ${entry.phone}` : ""}</p>
                            {entry.skills && <p className="text-[11px] mb-1" style={{ color: "#5f7679" }}><span className="font-black">Skills:</span> {entry.skills}</p>}
                            {entry.message && <p className="text-[11px] italic line-clamp-2" style={{ color: "#85a0a4" }}>"{entry.message}"</p>}
                            <p className="text-[10px] mt-1.5" style={{ color: "#cbd9db" }}>{new Date(entry.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <select value={entry.status} onChange={e => updateTalentStatus(entry.id, e.target.value)}
                              className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                              style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                              {["new","reviewed","shortlisted","contacted"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </select>
                            <a href={`mailto:${entry.email}`}
                              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                              style={{ background: "#f4fafb", color: "#079DB3" }}>
                              Email
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
