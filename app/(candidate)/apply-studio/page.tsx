"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, MessageSquare, Users, Brain, Link2, Sparkles, RefreshCw,
  Download, Copy, CheckCircle, ArrowRight, Zap, Star, Clock,
  ChevronRight, Eye, RotateCcw, Target, Award,
} from "lucide-react";

type Tab = "resume" | "cover" | "outreach" | "interview";

const TABS: { id: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "resume", label: "Tailored CV", icon: FileText, desc: "ATS-optimised resume matched to the job" },
  { id: "cover", label: "Cover Letter", icon: MessageSquare, desc: "High-conversion cover letter in your voice" },
  { id: "outreach", label: "Recruiter Outreach", icon: Users, desc: "LinkedIn and email messages to key contacts" },
  { id: "interview", label: "Interview Prep", icon: Brain, desc: "Questions, model answers, and talking points" },
];

const RESUME_SECTIONS = [
  { title: "Professional Summary", content: "AI-focused full-stack developer with 3+ years building production LLM applications using Python, FastAPI, and Next.js. Proven track record of shipping AI-native products at scale. Seeking to leverage deep ML integration experience as an AI Automation Engineer at OpenAI.", improved: true },
  { title: "Key Skills", content: "Python · FastAPI · React · Next.js · PostgreSQL · LLM Integration · REST APIs · Git · Agile", improved: false },
  { title: "Experience", content: "Full Stack Developer @ Acme Corp (2022 – Present)\n• Built AI-powered document processing pipeline reducing manual review by 65%\n• Integrated OpenAI GPT-4 API with custom retrieval system for 10k+ daily queries\n• Delivered scalable Next.js dashboard serving 5,000+ monthly active users", improved: true },
  { title: "Education", content: "BSc Computer Science, University of Manchester (2019 – 2022)\nFirst Class Honours | Dissertation: Semantic Search with Dense Vectors", improved: false },
];

const COVER_LETTER = `Dear Hiring Manager,

I'm writing to express my strong interest in the AI Automation Engineer role at OpenAI. With three years of hands-on experience building LLM-integrated applications in production, I'm excited by the opportunity to contribute to your mission of developing safe and beneficial AI systems.

At Acme Corp, I architected and deployed an AI-powered document processing pipeline using Python, FastAPI, and the OpenAI API — reducing manual review time by 65% and handling 10,000+ daily queries. This project required the exact intersection of skills your role demands: robust API integration, scalable backend architecture, and a deep understanding of LLM capabilities and limitations.

What excites me most about this role is the focus on automation infrastructure. I've seen firsthand how poorly designed AI pipelines create technical debt and reliability issues — and I'm passionate about engineering systems that are observable, maintainable, and genuinely improve workflows rather than just adding complexity.

I'd welcome the opportunity to discuss how my experience aligns with what you're building. Thank you for your consideration.

Best regards,
[Your Name]`;

const OUTREACH_MESSAGES = [
  {
    type: "LinkedIn Connection",
    recipient: "Sarah Chen, Senior AI Engineer @ OpenAI",
    message: "Hi Sarah, I recently applied for the AI Automation Engineer role at OpenAI and noticed your work on the API platform team. I've been building LLM-integrated pipelines in production for 3 years and would love to connect and learn more about the team's current focus areas. Happy to share what I've been working on.",
  },
  {
    type: "Recruiter Email",
    recipient: "James Park, Technical Recruiter @ OpenAI",
    message: "Hi James, I submitted my application for the AI Automation Engineer position (Ref: OAI-2024-AE) and wanted to follow up directly. I have 3 years of production experience with Python/FastAPI and LLM integrations, which aligns closely with the core requirements. I'm particularly excited about OpenAI's infrastructure challenges and would love a chance to discuss further.",
  },
  {
    type: "Alumni Referral",
    recipient: "Emma Davis, Software Engineer @ OpenAI (Manchester Alumnus)",
    message: "Hi Emma, I came across your profile while researching the AI Automation Engineer role at OpenAI — we're both Manchester CS alumni! I applied recently and I'm really excited about the opportunity. Would you be open to a quick chat about your experience at OpenAI? I'd really appreciate any insights you could share.",
  },
];

const INTERVIEW_PREP = [
  {
    category: "Technical",
    questions: [
      { q: "Walk me through how you'd design a fault-tolerant LLM pipeline.", hint: "Cover retry logic, fallback models, rate limiting, and monitoring. Mention your document processing project." },
      { q: "How would you evaluate the quality of outputs from an LLM in production?", hint: "Discuss automated evals, human feedback loops, golden datasets, and semantic similarity metrics." },
      { q: "Explain the trade-offs between fine-tuning and RAG for a customer support use case.", hint: "Cost, latency, freshness of data, complexity to maintain. Lean towards RAG for dynamic data." },
    ],
  },
  {
    category: "Behavioural",
    questions: [
      { q: "Tell me about a time you had to make a critical technical decision with incomplete information.", hint: "Use STAR. Pick the AI pipeline project — emphasise the constraints and how you validated the approach." },
      { q: "Describe a project where you had to balance technical quality with shipping speed.", hint: "Frame your current role: how you shipped an MVP LLM integration, then improved reliability post-launch." },
    ],
  },
];

export default function ApplyStudioPage() {
  const [jobLink, setJobLink] = useState("https://openai.com/careers/ai-automation-engineer");
  const [activeTab, setActiveTab] = useState<Tab>("resume");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!jobLink.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Apply Studio</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1 max-w-xl">
            Paste a job link and generate a complete, tailored application pack — CV, cover letter, outreach messages, and interview prep.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-muted-foreground">6 / 20 packs used</span>
          <Badge className="bg-primary/8 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">Pro</Badge>
        </div>
      </div>

      {/* Job input bar */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="url"
              value={jobLink}
              onChange={(e) => { setJobLink(e.target.value); setGenerated(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Paste a job link or description…"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/40 border border-border text-sm font-medium outline-none focus:border-primary/60 focus:bg-card transition-all"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generating || !jobLink.trim()}
            className="h-11 px-6 rounded-xl font-black text-sm gap-2 shadow-sm shadow-primary/15 shrink-0"
          >
            {generating
              ? <><RefreshCw size={14} className="animate-spin" /> Generating…</>
              : <><Sparkles size={14} /> Generate Pack</>}
          </Button>
        </div>
        {generated && (
          <div className="flex items-center gap-2 mt-3">
            <CheckCircle size={13} className="text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">Pack generated for: <span className="font-black">AI Automation Engineer @ OpenAI</span></span>
            <Badge className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase">86% Match</Badge>
          </div>
        )}
      </div>

      {/* Tabs */}
      {generated && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl border p-4 text-left transition-all space-y-2 ${active ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" : "bg-card border-border hover:border-primary/30 hover:shadow-sm"}`}
                >
                  <Icon size={16} />
                  <div>
                    <p className="font-black text-xs">{tab.label}</p>
                    <p className={`text-[10px] font-medium mt-0.5 leading-tight ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Resume tab */}
          {activeTab === "resume" && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-black text-base">Tailored CV</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Optimised for ATS · Matched to OpenAI's requirements · Score: 91/100</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg font-bold text-xs gap-1.5 border">
                      <Eye size={12} /> Preview
                    </Button>
                    <Button size="sm" className="h-8 px-3 rounded-lg font-black text-xs gap-1.5">
                      <Download size={12} /> Download PDF
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {RESUME_SECTIONS.map((section) => (
                    <div key={section.title} className={`rounded-xl border p-4 space-y-2 ${section.improved ? "border-emerald-200 bg-emerald-50/30" : "border-border bg-background"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{section.title}</span>
                        {section.improved && (
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">AI Enhanced</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "ATS Score", value: "91/100", color: "text-emerald-600", bg: "bg-emerald-50", icon: Target },
                  { label: "Keyword Match", value: "14/17 keywords", color: "text-primary", bg: "bg-primary/8", icon: Star },
                  { label: "Format Quality", value: "Excellent", color: "text-violet-600", bg: "bg-violet-50", icon: Award },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className={`rounded-2xl border border-border ${item.bg} p-4 flex items-center gap-3`}>
                      <Icon size={20} className={item.color} />
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{item.label}</p>
                        <p className={`font-black text-base ${item.color}`}>{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 rounded-xl font-bold text-sm h-10 border-2">
                  <RotateCcw size={14} /> Regenerate
                </Button>
                <Button className="gap-2 rounded-xl font-black text-sm h-10 shadow-sm shadow-primary/15">
                  <Download size={14} /> Download PDF
                </Button>
              </div>
            </div>
          )}

          {/* Cover letter tab */}
          {activeTab === "cover" && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-black text-base">Cover Letter</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Written in your voice · Highlights your strongest match points</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg font-bold text-xs gap-1.5 border">
                      <RotateCcw size={12} /> Regenerate
                    </Button>
                    <Button size="sm" className="h-8 px-3 rounded-lg font-black text-xs gap-1.5" onClick={() => handleCopy(99, COVER_LETTER)}>
                      {copiedIdx === 99 ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </Button>
                  </div>
                </div>
                <div className="bg-background rounded-xl border border-border p-6">
                  <p className="text-sm font-medium text-foreground/80 leading-relaxed whitespace-pre-line">{COVER_LETTER}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Tone Match", value: "Professional & Confident", color: "text-primary" },
                  { label: "Word Count", value: "298 words", color: "text-foreground" },
                  { label: "Personalisation", value: "High", color: "text-emerald-600" },
                ].map((m) => (
                  <div key={m.label} className="bg-card rounded-xl border border-border p-4">
                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest mb-1">{m.label}</p>
                    <p className={`font-black text-sm ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outreach tab */}
          {activeTab === "outreach" && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-black text-base mb-1">Recruiter & Network Outreach</h2>
                <p className="text-xs text-muted-foreground font-medium">We found {OUTREACH_MESSAGES.length} relevant contacts at OpenAI — personalised messages ready to send</p>
              </div>
              {OUTREACH_MESSAGES.map((msg, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="bg-muted text-muted-foreground border-border text-[9px] font-black uppercase tracking-widest mb-2">{msg.type}</Badge>
                      <p className="font-black text-sm">{msg.recipient}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 rounded-lg font-bold text-xs gap-1.5 border shrink-0"
                      onClick={() => handleCopy(i, msg.message)}
                    >
                      {copiedIdx === i ? <><CheckCircle size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                    </Button>
                  </div>
                  <div className="bg-muted/40 rounded-xl border border-border p-4">
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interview prep tab */}
          {activeTab === "interview" && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-black text-base mb-1">Interview Prep</h2>
                <p className="text-xs text-muted-foreground font-medium">Questions based on OpenAI's known interview format and your profile gaps</p>
              </div>
              {INTERVIEW_PREP.map((section) => (
                <div key={section.category} className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
                  <Badge className="bg-primary/8 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest">{section.category}</Badge>
                  <div className="space-y-4">
                    {section.questions.map((q, i) => (
                      <div key={i} className="rounded-xl border border-border bg-background p-4 space-y-2">
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-black text-primary/50 mt-1 shrink-0">Q{i + 1}</span>
                          <p className="font-black text-sm leading-snug">{q.q}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-black text-muted-foreground/40 mt-1 shrink-0">Hint</span>
                          <p className="text-xs font-medium text-muted-foreground leading-relaxed">{q.hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Empty state */}
      {!generated && !generating && (
        <div className="bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <Zap size={28} className="text-muted-foreground/30" />
          </div>
          <div>
            <p className="font-black text-base text-muted-foreground/50">Paste a job link to generate your application pack</p>
            <p className="text-sm text-muted-foreground/35 font-medium mt-1 max-w-sm mx-auto">
              We'll create a tailored CV, cover letter, outreach messages, and interview prep — all matched to that specific role.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {["Tailored CV", "Cover Letter", "Recruiter Outreach", "Interview Prep"].map((item) => (
              <span key={item} className="bg-muted/60 border border-border rounded-full px-3 py-1 text-[11px] font-bold text-muted-foreground">{item}</span>
            ))}
          </div>
        </div>
      )}

      {generating && (
        <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/8 flex items-center justify-center">
            <RefreshCw size={28} className="text-primary animate-spin" />
          </div>
          <div>
            <p className="font-black text-base">Generating your application pack…</p>
            <p className="text-sm text-muted-foreground font-medium mt-1">Tailoring CV, writing cover letter, finding contacts</p>
          </div>
        </div>
      )}

    </div>
  );
}
