"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const TRUST_POINTS = [
  "Premium job listings across 40+ countries",
  "AI Auto-Apply to 500+ matched roles",
  "92% placement success rate",
  "1:1 mentoring from industry experts",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">

      {/* Left — Form panel */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: "#f4fafb" }}>
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex-1 flex flex-col">

          {/* Logo strip */}
          <Link href="/" className="flex items-center mb-8">
            <Image src="/logo-light.png" alt="CountsAI" width={130} height={36} className="object-contain" />
          </Link>

          {/* Page content */}
          <div className="flex-1 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>

      {/* Right — Brand panel */}
      <div className="hidden lg:flex w-[480px] xl:w-[520px] flex-col sticky top-0 h-screen"
        style={{ background: "linear-gradient(160deg, #0a3a44 0%, #079DB3 60%, #16a3ba 100%)" }}>

        <div className="flex-1 flex flex-col justify-between px-12 py-12">

          {/* Logo */}
          <div>
            <Image src="/logo.png" alt="CountsAI" width={140} height={40} className="object-contain" />
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.45)" }}>
              Global AI Career Portal
            </p>
          </div>

          {/* Quote */}
          <div className="space-y-6">
            <h2 className="text-3xl xl:text-4xl font-black leading-tight text-white">
              Land your next AI role faster — with the platform built for AI professionals.
            </h2>
            <ul className="space-y-3">
              {TRUST_POINTS.map(pt => (
                <li key={pt} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "#079DB3" }} />
                  <span className="text-sm font-semibold leading-snug" style={{ color: "rgba(255,255,255,0.82)" }}>
                    {pt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "50k+", label: "Active Users" },
              { val: "92%",  label: "Success Rate" },
              { val: "500+", label: "Jobs Auto-Applied" },
            ].map(s => (
              <div key={s.val} className="rounded-2xl px-4 py-5 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
