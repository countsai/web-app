"use client";

import { useEffect, useState } from "react";
import { Globe, Plane, Shield, Info } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { supabase } from "@/lib/supabase";

interface VisaGuide {
  id: string;
  country: string;
  visa_type: string;
  processing_time: string;
  difficulty: string;
}

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  Easy: { bg: "#f0fdf4", color: "#16a34a" },
  Medium: { bg: "#E7F5F4", color: "#079DB3" },
  Hard: { bg: "#fef2f2", color: "#dc2626" },
};

export default function VisaGuidesPage() {
  const [guides, setGuides] = useState<VisaGuide[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("visa_guides")
        .select("id, country, visa_type, processing_time, difficulty")
        .order("country", { ascending: true });
      setGuides(data ?? []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="space-y-4 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#e1f4f7", color: "#079DB3" }}>
              Global Mobility
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              Borders shouldn&apos;t limit your career.
            </h1>
            <p className="text-lg font-medium" style={{ color: "#5f7679" }}>
              Comprehensive, up-to-date guides for candidates seeking visa sponsorship, relocation and remote-work
              residency around the world.
            </p>
          </div>

          {guides === null ? (
            <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>Loading guides…</p>
          ) : guides.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid #dbe9eb" }}>
              <Globe size={28} className="mx-auto mb-3" style={{ color: "#85a0a4" }} />
              <p className="font-black" style={{ color: "#0a3a44" }}>No guides published yet</p>
              <p className="text-sm font-medium mt-1" style={{ color: "#85a0a4" }}>Check back soon — our team is adding country guides.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guides.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl p-7 cursor-pointer transition-all hover:shadow-md" style={{ border: "1px solid #dbe9eb" }}>
                  <div className="flex justify-between items-start mb-7">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: "#e1f4f7" }}>
                      <Globe size={24} style={{ color: "#079DB3" }} />
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest"
                      style={{ background: DIFFICULTY_STYLE[c.difficulty]?.bg ?? "#f4fafb", color: DIFFICULTY_STYLE[c.difficulty]?.color ?? "#85a0a4" }}>
                      {c.difficulty}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black" style={{ color: "#0a3a44" }}>{c.country}</h3>
                    <p className="text-sm font-bold" style={{ color: "#079DB3" }}>{c.visa_type || "—"}</p>
                    <div className="flex gap-5 pt-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>
                      <span className="flex items-center gap-1.5"><Plane size={13} /> {c.processing_time || "—"}</span>
                      <span className="flex items-center gap-1.5"><Shield size={13} /> Tax-optimised</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8" style={{ border: "1px solid #dbe9eb" }}>
            <div className="h-20 w-20 shrink-0 rounded-2xl flex items-center justify-center" style={{ background: "#e1f4f7", color: "#079DB3" }}>
              <Info size={36} />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-xl font-black" style={{ color: "#0a3a44" }}>Need a personalised relocation plan?</h3>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#5f7679" }}>
                Our placement team can help match your skills, citizenship and family circumstances to the right
                visa-sponsoring employers and jurisdictions for your move.
              </p>
              <button className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: "#079DB3" }}>
                Talk to Our Advisors
              </button>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
