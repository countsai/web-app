"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Search, Crown, Users } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  account_type: string;
  company_name: string | null;
  phone: string | null;
  created_at: string;
  plan: "Premium" | "Free";
}

interface AdminCandidateProfile {
  id: string;
  headline: string;
  target_roles: string[];
  preferred_locations: string[];
  verification_status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [candidates, setCandidates] = useState<AdminCandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [usersRes, candidatesRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/candidates"),
        ]);
        const usersData = await usersRes.json();
        const candidatesData = await candidatesRes.json();
        if (usersRes.ok) setUsers((usersData.users ?? []).filter((u: AdminUser) => u.account_type === "talent"));
        if (candidatesRes.ok) setCandidates(candidatesData.candidates ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleUserPlan = async (userId: string, currentPlan: "Premium" | "Free") => {
    const newPlan: "Premium" | "Free" = currentPlan === "Premium" ? "Free" : "Premium";
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan: newPlan }),
    });
  };

  const candidateById = new Map(candidates.map((c) => [c.id, c]));

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const candidate = candidateById.get(u.id);
    return (
      (u.full_name ?? "").toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (candidate?.headline ?? "").toLowerCase().includes(q)
    );
  });

  const premiumCount = users.filter((u) => u.plan === "Premium").length;
  const freeCount = users.filter((u) => u.plan === "Free").length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Candidate Management</h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Set each candidate account as Free or Premium.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl p-6 bg-white border border-border shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Candidates</p>
            <p className="text-3xl font-black">{users.length}</p>
          </div>
          <div className="rounded-3xl p-6 bg-white border border-border shadow-sm" style={{ borderColor: "#e3f1f2" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#079DB3" }}>Premium Accounts</p>
            <p className="text-3xl font-black" style={{ color: "#079DB3" }}>{premiumCount}</p>
          </div>
          <div className="rounded-3xl p-6 bg-white border border-border shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Free Accounts</p>
            <p className="text-3xl font-black">{freeCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or headline…"
            className="w-full h-12 rounded-2xl bg-muted pl-11 pr-4 border-none focus:ring-2 ring-primary transition-all font-medium text-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Candidate</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Headline</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => {
                  const candidate = candidateById.get(u.id);
                  const name = u.full_name ?? u.email;
                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                            {name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">{candidate?.headline || "—"}</p>
                        {candidate?.target_roles && candidate.target_roles.length > 0 && (
                          <p className="text-xs text-muted-foreground">{candidate.target_roles.join(", ")}</p>
                        )}
                      </td>
                      <td className="p-4 text-sm font-medium text-muted-foreground">
                        {candidate?.preferred_locations?.[0] ?? "—"}
                      </td>
                      <td className="p-4">
                        {candidate ? (
                          <span className={`text-xs font-black px-2 py-1 rounded-lg ${
                            candidate.verification_status === "Top Talent" ? "bg-emerald-500/10 text-emerald-600" :
                            candidate.verification_status === "Client Ready" ? "bg-primary/10 text-primary" :
                            candidate.verification_status === "Under Review" ? "bg-amber-500/10 text-amber-600" :
                            candidate.verification_status === "Rejected" ? "bg-red-500/10 text-red-600" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {candidate.verification_status}
                          </span>
                        ) : (
                          <span className="text-xs font-black px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                            No profile yet
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {u.plan === "Premium" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full" style={{ background: "#e3f1f2", color: "#079DB3" }}>
                            <Crown size={11} /> Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                            <Users size={11} /> Free
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant={u.plan === "Premium" ? "outline" : "default"}
                          className="h-8 rounded-xl text-xs font-black px-3"
                          style={u.plan !== "Premium" ? { background: "#079DB3", color: "white", border: "none" } : {}}
                          onClick={() => toggleUserPlan(u.id, u.plan)}
                        >
                          {u.plan === "Premium" ? "Set Free" : "Set Premium"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-sm text-muted-foreground font-medium">
                      No candidates match your search.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-sm text-muted-foreground font-medium">
                      Loading…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
