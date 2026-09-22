"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ScanSearch, Link2, RefreshCw, Sparkles,
} from "lucide-react";

export default function CareerScanPage() {
  const [jobLink, setJobLink] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [analysed, setAnalysed] = useState(false);

  const handleAnalyse = () => {
    if (!jobLink.trim()) return;
    setAnalysing(true);
    setAnalysed(false);
    setTimeout(() => { setAnalysing(false); setAnalysed(true); }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Job Analyser</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1 max-w-xl">
            Paste any job link to get your match score, skill gaps, and a tailored application pack — before you apply.
          </p>
        </div>
        <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-widest px-3 py-1 self-start md:self-auto">
          Coming Soon
        </Badge>
      </div>

      {/* Input card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ScanSearch size={16} className="text-primary" />
          <h2 className="font-black text-sm">Analyse a job posting</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="url"
              value={jobLink}
              onChange={(e) => { setJobLink(e.target.value); setAnalysed(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyse()}
              placeholder="Paste a LinkedIn, Indeed, Wellfound, or company job link…"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/40 border border-border text-sm font-medium outline-none focus:border-primary/60 focus:bg-card transition-all"
            />
          </div>
          <Button
            onClick={handleAnalyse}
            disabled={analysing || !jobLink.trim()}
            className="h-11 px-6 rounded-xl font-black text-sm gap-2 shadow-sm shadow-primary/15 shrink-0"
          >
            {analysing
              ? <><RefreshCw size={14} className="animate-spin" /> Analysing…</>
              : <><Sparkles size={14} /> Analyse Job</>}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground font-medium">
          <span>Supported:</span>
          {["LinkedIn", "Indeed", "Wellfound", "Greenhouse", "Lever", "Company career pages"].map((s) => (
            <span key={s} className="bg-muted px-2 py-0.5 rounded-full font-semibold">{s}</span>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {!analysed && !analysing && (
        <div className="bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <ScanSearch size={28} className="text-muted-foreground/30" />
          </div>
          <div>
            <p className="font-black text-base text-muted-foreground/50">Waiting for your first job link</p>
            <p className="text-sm text-muted-foreground/35 font-medium mt-1 max-w-sm mx-auto">
              Paste a link above and we&apos;ll calculate your match score, missing skills, and build your application pack.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {[
              { label: "Match Score", desc: "See how well you fit" },
              { label: "Skill Gaps", desc: "Know what's missing" },
              { label: "App Quality", desc: "ATS pass rate" },
              { label: "Full Pack", desc: "CV + cover + outreach" },
            ].map((item) => (
              <div key={item.label} className="bg-muted/50 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-[10px] text-muted-foreground/60 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysing state */}
      {analysing && (
        <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/8 flex items-center justify-center">
            <RefreshCw size={28} className="text-primary animate-spin" />
          </div>
          <div>
            <p className="font-black text-base">Analysing job posting…</p>
            <p className="text-sm text-muted-foreground font-medium mt-1">Scanning requirements, matching your profile, calculating gaps</p>
          </div>
        </div>
      )}

      {/* Coming soon result */}
      {analysed && (
        <div className="bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <Sparkles size={28} className="text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-black text-base text-muted-foreground/60">AI job analysis is coming soon</p>
            <p className="text-sm text-muted-foreground/40 font-medium mt-1 max-w-sm mx-auto">
              We&apos;re building automatic match scoring, skill gap detection, and tailored application packs for any job link.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
