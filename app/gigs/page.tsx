"use client";

import { useState } from "react";
import { Zap, Clock, DollarSign, Globe, Briefcase } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function JobsMatrixPage() {
  const [filter, setFilter] = useState("All Jobs");

  const jobs = [
    { title: "Fine-tune Llama 3 on Medical Data", client: "BioTech AI", budget: "£2,000", duration: "1 week", tags: ["LLM", "Python"] },
    { title: "Design an Agentic UI System", client: "NeoWork", budget: "£3,200", duration: "2 weeks", tags: ["UI/UX", "Figma"] },
    { title: "Optimize Vector DB Performance", client: "Streamline", budget: "£1,400", duration: "3 days", tags: ["Data", "Rust"] },
    { title: "Build a Custom GPT for Legal Analysis", client: "LexAI", budget: "£2,600", duration: "10 days", tags: ["OpenAI", "Legal"] },
    { title: "Develop RAG Pipeline for Internal Docs", client: "FinanceAI Corp", budget: "£3,800", duration: "2 weeks", tags: ["RAG", "LangChain"] },
    { title: "AI Product Manager — Contract", client: "Vercel Europe", budget: "£4,200", duration: "1 month", tags: ["Product", "AI"] },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#e1f4f7", color: "#079DB3" }}>
              Jobs Matrix
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              The Jobs Matrix.
            </h1>
            <p className="text-lg font-medium" style={{ color: "#5f7679" }}>
              High-impact AI and tech roles — short-term, contract and freelance — paid, verified, remote-friendly.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {["All Jobs", "Development", "Design", "Research", "Operations"].map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors"
                style={filter === cat
                  ? { background: "#079DB3", color: "white" }
                  : { background: "white", color: "#33474b", border: "1px solid #dbe9eb" }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md" style={{ border: "1px solid #dbe9eb" }}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                      <Briefcase size={20} />
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-black" style={{ background: "#E7F5F4", color: "#079DB3" }}>{job.budget}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black leading-snug" style={{ color: "#0a3a44" }}>{job.title}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>{job.client}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                        style={{ background: "#f4fafb", color: "#5f7679", border: "1px solid #dbe9eb" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid #eaf4f5" }}>
                  <div className="flex gap-4 text-[11px] font-bold" style={{ color: "#85a0a4" }}>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {job.duration}</span>
                    <span className="flex items-center gap-1.5"><Globe size={13} /> Remote</span>
                  </div>
                  <button className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-colors hover:bg-gray-50"
                    style={{ color: "#079DB3" }}>
                    View Job
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}>
              Post a Job <DollarSign size={16} />
            </button>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
