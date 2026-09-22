"use client";

import Link from "next/link";
import { Lock, Crown } from "lucide-react";

export function PremiumGate({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ border: "2px solid #079DB3" }}>
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-sm opacity-30 p-8 space-y-4">
        <div className="h-10 rounded-xl w-2/3" style={{ background: "#dbe9eb" }} />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-9 rounded-xl" style={{ background: "#dbe9eb" }} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="h-56 rounded-2xl" style={{ background: "#dbe9eb" }} />
          <div className="h-56 rounded-2xl" style={{ background: "#dbe9eb" }} />
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
        style={{ background: "rgba(238,246,247,0.92)" }}>
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#079DB3" }}>
          <Lock size={28} className="text-white" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Crown size={16} style={{ color: "#079DB3" }} />
          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "#079DB3", color: "white" }}>
            Premium Feature
          </span>
        </div>
        <h2 className="text-2xl font-black mb-3" style={{ color: "#0a3a44" }}>{title}</h2>
        <p className="text-sm font-medium max-w-sm mb-6" style={{ color: "#5f7679" }}>{description}</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/pricing">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}>
              <Crown size={14} /> Upgrade to Premium — £29/mo
            </button>
          </Link>
          <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>
            7-day free trial · No card required now
          </p>
        </div>
      </div>
    </div>
  );
}
