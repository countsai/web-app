"use client";

import { Globe, Search } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function RemoteJobsPage() {
  const jobs = [
    { title: "Senior AI Researcher", company: "Aether Intelligence", salary: "£90k – £130k", tags: ["LLMs", "Remote", "PyTorch"] },
    { title: "Agentic Systems Engineer", company: "Nuance Robotics", salary: "£70/hr · Contract", tags: ["AutoGPT", "Remote", "Python"] },
    { title: "NLP Solutions Architect", company: "Cognitive Labs", salary: "£85k – £115k", tags: ["NLP", "Remote", "RAG"] },
    { title: "MLOps Platform Manager", company: "Symphony AI", salary: "£75k – £100k", tags: ["Kubernetes", "Remote", "MLOps"] },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-10">

          <div className="space-y-4 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#e1f4f7", color: "#079DB3" }}>
              Global Roles
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              Remote AI &amp; tech roles, worldwide.
            </h1>
            <p className="text-lg font-medium" style={{ color: "#5f7679" }}>
              Borders shouldn&apos;t limit your career. Browse fully-remote opportunities with verified employers
              hiring globally.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-3" style={{ border: "1px solid #dbe9eb" }}>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "#85a0a4" }} />
              <input className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium outline-none"
                style={{ background: "#f4fafb", border: "1px solid #dbe9eb", color: "#0a3a44" }}
                placeholder="Search by tech stack, role, or company…" />
            </div>
            <button className="h-12 px-6 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}>
              Search Jobs
            </button>
          </div>

          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all hover:shadow-md" style={{ border: "1px solid #dbe9eb" }}>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                    {job.company[0]}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-lg font-black" style={{ color: "#0a3a44" }}>{job.title}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>{job.company}</p>
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
                </div>
                <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                  <div className="md:text-right">
                    <p className="text-base font-black" style={{ color: "#0a3a44" }}>{job.salary}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: "#85a0a4" }}>
                      <Globe size={11} /> Fully Remote
                    </p>
                  </div>
                  <button className="w-full md:w-auto px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                    style={{ background: "#079DB3" }}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="text-sm font-black uppercase tracking-widest transition-colors hover:underline" style={{ color: "#079DB3" }}>
              Load More Roles
            </button>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
