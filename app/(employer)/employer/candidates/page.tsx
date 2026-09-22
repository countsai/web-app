"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployerCandidateProfile {
  id: string;
  headline: string;
  skills: string[];
  target_roles: string[];
  preferred_locations: string[];
  visa_status: string;
  verification_status: string;
  updated_at: string;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
}

const VERIFICATION_BADGE: Record<string, string> = {
  "Top Talent": "bg-violet-50 text-violet-600 border-violet-200",
  "Client Ready": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

function getCandidateProfile(link: EmployerCandidateProfile["profiles"]) {
  return Array.isArray(link) ? link[0] ?? null : link;
}

export default function TalentExplorer() {
  const [candidates, setCandidates] = useState<EmployerCandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/employer/candidates");
        const data = await res.json();
        if (res.ok) setCandidates(data.candidates ?? []);
      } catch {
        // ignore — empty state is shown
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => {
      const profile = getCandidateProfile(c.profiles);
      return (
        (profile?.full_name ?? "").toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        c.target_roles.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [candidates, search]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Talent Explorer</h1>
            <p className="text-muted-foreground mt-1 font-medium">Browse admin-verified candidate profiles.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills, roles..."
                className="pl-10 rounded-xl h-11"
              />
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-4 gap-2 font-bold">
              <Filter size={18} /> Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 rounded-2xl border-2 border-muted text-center">
            <p className="text-sm font-medium text-muted-foreground">Loading candidates…</p>
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-2 border-dashed border-muted shadow-none rounded-3xl flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Users size={26} className="text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-black text-muted-foreground/60 mb-1">
              {candidates.length === 0 ? "No vetted candidates yet" : "No candidates match your search"}
            </h3>
            <p className="text-sm text-muted-foreground/40 font-medium max-w-sm">
              {candidates.length === 0
                ? "Candidates appear here once our team marks their profile as \"Client Ready\" or \"Top Talent\"."
                : "Try a different search term."}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((candidate) => {
              const profile = getCandidateProfile(candidate.profiles);
              const name = profile?.full_name ?? "Candidate";
              const location = candidate.preferred_locations?.[0] ?? "Flexible";
              return (
                <Card key={candidate.id} className="group border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all cursor-pointer bg-card">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-lg rounded-3xl">
                          <AvatarFallback className="text-lg font-black">{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg border-2 border-background">
                          <ShieldCheck size={12} />
                        </div>
                      </div>
                      <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border gap-1 ${VERIFICATION_BADGE[candidate.verification_status] ?? "bg-muted text-muted-foreground border-muted"}`}>
                        {candidate.verification_status}
                      </Badge>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-1">{name}</h3>
                      <p className="text-sm font-medium text-muted-foreground line-clamp-1">{candidate.headline || "—"}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground mt-2">
                        <MapPin size={12} /> {location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {candidate.skills.slice(0, 6).map((skill) => (
                        <Badge key={skill} variant="secondary" className="rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-muted/50">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-6 border-t">
                      <Button variant="outline" className="rounded-xl font-bold h-11 text-xs">View Passport</Button>
                      <Button className="rounded-xl font-bold h-11 text-xs gap-2">
                        Shortlist <Zap size={14} fill="currentColor" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* AI Scout — coming soon */}
            <Card className="border-2 border-dashed border-primary/20 shadow-none rounded-3xl overflow-hidden bg-primary/5 flex flex-col items-center justify-center p-8 text-center">
              <Sparkles className="text-muted-foreground/40 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2 text-muted-foreground/60">AI Scout</h3>
              <p className="text-sm text-muted-foreground/40 font-medium mb-6">
                Automatic candidate matching against your open roles is coming soon.
              </p>
              <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-widest px-3 py-1">
                Coming Soon
              </Badge>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
