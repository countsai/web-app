"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { GdprBadge } from "@/components/shared/gdpr-badge";

export function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      {/* Top bar */}
      <div className="w-full py-2 px-6 flex items-center justify-between" style={{ background: "#0a3a44" }}>
        <Link href="/">
          <Image src="/logo.png" alt="CountsAI" width={120} height={34} className="object-contain" />
        </Link>
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
          Global Career Portal
        </span>
      </div>

      <div className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold mb-6 transition-colors hover:underline" style={{ color: "#079DB3" }}>
            <ArrowLeft size={13} /> Back to home
          </Link>

          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "#0a3a44" }}>{title}</h1>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#85a0a4" }}>Last updated: {updated}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: "1px solid #dbe9eb" }}>
            <div className="px-8 py-5" style={{ background: "#079DB3" }}>
              <p className="text-white font-black text-base">Counts AI Ltd</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Registered in London, United Kingdom</p>
            </div>
            <div className="p-8 space-y-7">
              {children}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <GdprBadge />
          </div>

          <p className="text-center text-[11px] font-medium mt-6" style={{ color: "#85a0a4" }}>
            Questions about this policy?{" "}
            <Link href="/contact" className="underline font-bold" style={{ color: "#079DB3" }}>Contact our team</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-black" style={{ color: "#0a3a44" }}>{title}</h2>
      <div className="text-sm font-medium leading-relaxed space-y-2" style={{ color: "#5f7679" }}>
        {children}
      </div>
    </section>
  );
}
