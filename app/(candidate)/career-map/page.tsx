"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, BookOpen, Cpu, Sparkles, CheckCircle, Code2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CareerMapPage() {
  const [skills, setSkills] = useState<string[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setSkills([]);
        return;
      }
      const { data } = await supabase
        .from("candidate_profiles")
        .select("skills")
        .eq("id", session.user.id)
        .single();
      setSkills(data?.skills ?? []);
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Skill Gaps</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1 max-w-xl">
            Skills missing from your profile that hold back your match scores — sorted by impact.
          </p>
        </div>
        <Link href="/career-scan">
          <Button className="h-9 px-5 rounded-xl font-black text-sm gap-2 shadow-sm shadow-primary/15">
            <BookOpen size={14} /> Career Scan
          </Button>
        </Link>
      </div>

      {/* Coming soon: AI skill gap analysis */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-base">Skills holding back your applications</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">AI-powered skill gap analysis is coming soon</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-muted flex flex-col items-center justify-center py-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
            <Sparkles size={22} className="text-muted-foreground/40" />
          </div>
          <p className="font-black text-base text-muted-foreground/60">Coming soon</p>
          <p className="text-sm text-muted-foreground/40 max-w-sm">
            We&apos;re building automatic skill gap detection that compares your profile against matched jobs and ranks missing skills by impact.
          </p>
          <Link href="/profile">
            <Button variant="outline" className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 border-2 mt-2">
              <AlertTriangle size={13} /> Complete your profile in the meantime
            </Button>
          </Link>
        </div>
      </div>

      {/* Your current skills (real data) */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle size={15} className="text-emerald-500" />
          <h2 className="font-black text-base">Your current skills</h2>
        </div>

        {skills === null ? (
          <p className="text-sm text-muted-foreground font-medium">Loading…</p>
        ) : skills.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-muted flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
              <Code2 size={22} className="text-muted-foreground/40" />
            </div>
            <p className="font-black text-base text-muted-foreground/60">No skills added yet</p>
            <p className="text-sm text-muted-foreground/40 max-w-sm">
              Add your skills to your Master Profile so we can show them here and use them for matching.
            </p>
            <Link href="/profile">
              <Button className="h-9 px-4 rounded-xl font-black text-xs gap-1.5 mt-2">
                <Cpu size={13} /> Complete your profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="inline-flex items-center px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
