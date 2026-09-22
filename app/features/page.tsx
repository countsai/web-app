"use client";

import Link from "next/link";
import { Sparkles, BrainCircuit, Shield, Zap, Globe, MessageSquare, Briefcase, Rocket, ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function FeaturesPage() {
  const modules = [
    {
      role: "Candidate",
      features: [
        { title: "AI Replacement Risk", desc: "Predict automation risk for your role and plan your next move.", Icon: Shield },
        { title: "Career Transition Map", desc: "A visual roadmap for upskilling into roles with real demand.", Icon: Rocket },
        { title: "Proof-of-Work Builder", desc: "Generate project blueprints that prove your skills to employers.", Icon: Briefcase },
        { title: "Apply Studio", desc: "AI-assisted CVs and cover letters tailored to each role.", Icon: Sparkles },
      ],
    },
    {
      role: "Employer",
      features: [
        { title: "Skill Passports", desc: "Verified candidate profiles with deep skills verification.", Icon: BrainCircuit },
        { title: "AI Shortlisting", desc: "Let our matching engine surface the right candidates first.", Icon: Zap },
        { title: "Direct Messaging", desc: "Connect with shortlisted talent instantly, no middlemen.", Icon: MessageSquare },
        { title: "Hiring Analytics", desc: "Track pipeline health and time-to-hire in real time.", Icon: Rocket },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#e1f4f7", color: "#079DB3" }}>
              Product Modules
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              Everything you need to get hired faster.
            </h1>
            <p className="text-lg font-medium" style={{ color: "#5f7679" }}>
              One cohesive platform for candidates and employers — built around real placements, not empty matches.
            </p>
          </div>

          {modules.map((group, gi) => (
            <div key={gi} className="space-y-6">
              <h2 className="text-xl font-black pl-4" style={{ color: "#0a3a44", borderLeft: "4px solid #079DB3" }}>
                {group.role} Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {group.features.map(({ title, desc, Icon }, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 space-y-3 transition-all hover:shadow-md" style={{ border: "1px solid #dbe9eb" }}>
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-black" style={{ color: "#0a3a44" }}>{title}</h3>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: "#5f7679" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-3xl p-10 md:p-16 text-center space-y-6 relative overflow-hidden" style={{ background: "#079DB3" }}>
            <Globe size={260} className="absolute -right-12 -bottom-12 opacity-10" style={{ color: "white" }} />
            <h2 className="text-3xl md:text-4xl font-black tracking-tight relative" style={{ color: "white" }}>
              Ready to upgrade your career?
            </h2>
            <p className="text-base font-medium max-w-xl mx-auto relative" style={{ color: "rgba(255,255,255,0.75)" }}>
              Join thousands of candidates who&apos;ve already secured real interviews through Counts AI.
            </p>
            <div className="flex justify-center relative">
              <Link href="/auth/register">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90"
                  style={{ background: "#079DB3", color: "white" }}>
                  Join the Network <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
