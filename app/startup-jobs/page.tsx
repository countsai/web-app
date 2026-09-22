"use client";

import Link from "next/link";
import { Rocket, Users, ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function StartupJobsPage() {
  const startups = [
    { name: "Veridian AI", funding: "Series A · £9.5M", focus: "Agentic operating systems for the enterprise", openRoles: 4, logo: "V" },
    { name: "NeuralMesh", funding: "Seed · £1.9M", focus: "Biometric AI for secure workplace access", openRoles: 2, logo: "N" },
    { name: "Axiom Robotics", funding: "Series B · £36M", focus: "Warehouse and logistics automation", openRoles: 7, logo: "A" },
    { name: "Sentient Flow", funding: "Pre-seed · £400k", focus: "Prompt engineering & evaluation tooling", openRoles: 1, logo: "S" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="space-y-4 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#e1f4f7", color: "#079DB3" }}>
              Early-Stage Roles
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              Build the future from the ground up.
            </h1>
            <p className="text-lg font-medium" style={{ color: "#5f7679" }}>
              Match with high-growth AI and tech startups before they go mainstream — equity, ownership, and real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {startups.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 transition-all hover:shadow-md" style={{ border: "1px solid #dbe9eb" }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ background: "#079DB3" }}>
                    {s.logo}
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest"
                    style={{ background: "#E7F5F4", color: "#079DB3" }}>
                    {s.funding}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black" style={{ color: "#0a3a44" }}>{s.name}</h3>
                  <p className="text-sm font-medium" style={{ color: "#5f7679" }}>{s.focus}</p>
                </div>
                <div className="mt-8 flex items-center justify-between pt-5" style={{ borderTop: "1px solid #eaf4f5" }}>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>
                    <Users size={13} /> {s.openRoles} Open Roles
                  </span>
                  <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest transition-colors hover:underline" style={{ color: "#079DB3" }}>
                    View Roles <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl p-10 md:p-14 text-center space-y-5 relative overflow-hidden" style={{ background: "#079DB3" }}>
            <Rocket size={220} className="absolute -right-10 -top-10 opacity-10" style={{ color: "white" }} />
            <h2 className="text-3xl md:text-4xl font-black tracking-tight relative" style={{ color: "white" }}>
              Want to hire AI talent for your startup?
            </h2>
            <p className="text-base font-medium max-w-xl mx-auto relative" style={{ color: "rgba(255,255,255,0.75)" }}>
              Access a global pool of verified AI specialists and engineers, ready to join early-stage teams.
            </p>
            <div className="flex justify-center relative">
              <Link href="/for-businesses">
                <button className="px-7 py-3.5 rounded-full text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90"
                  style={{ background: "#079DB3", color: "white" }}>
                  Post a Position
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
