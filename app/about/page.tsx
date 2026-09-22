"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      <PublicNavbar active="About" />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #07111f 0%, #0a2030 60%, #0d2a38 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(0,151,178,0.08) 0%, transparent 60%)" }}
        />
        <div className="cai-container relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
              style={{ background: "rgba(0,151,178,0.15)", border: "1px solid rgba(0,151,178,0.25)", color: "#00b4d4" }}
            >
              About Counts AI
            </div>
            <h1
              className="font-extrabold text-white mb-6"
              style={{ fontSize: "clamp(2.5rem,5.5vw,4.5rem)", letterSpacing: "-0.04em", lineHeight: 1.0 }}
            >
              An AI company
              <br />
              <span style={{ color: "#00b4d4" }}>that trains, builds</span>
              <br />
              and connects.
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
              Counts AI is a UK-based AI company with three connected sides: a training and certification platform, an AI engineering practice, and an AI career and talent marketplace.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-b from-transparent" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
      </section>

      {/* ── WHAT WE ARE ── */}
      <section className="py-20 border-b" style={{ borderColor: "#dbe9eb" }}>
        <div className="cai-container">
          <div className="max-w-3xl">
            <div className="label-overline mb-4" style={{ color: "var(--teal)" }}>What Counts AI is</div>
            <h2
              className="font-extrabold mb-8"
              style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.03em", color: "#07111f", lineHeight: 1.1 }}
            >
              Not just a training platform.<br />Not just a consultancy.<br />Both — and a jobs marketplace.
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "#486870" }}>
              The world is moving to AI faster than most careers can keep up with. Counts AI was built to close that gap — giving people the skills, credentials and experience to enter the AI economy, while helping businesses build AI capability and deploy real engineering talent.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#486870" }}>
              We apply the same AI engineering we teach: our own products are built with the tools and techniques students learn on the program. That connection is deliberate.
            </p>
          </div>
        </div>
      </section>

      {/* ── THREE SIDES ── */}
      <section className="py-20" style={{ background: "var(--surface-1)" }}>
        <div className="cai-container">
          <div className="label-overline mb-10" style={{ color: "var(--teal)" }}>The Counts AI ecosystem</div>

          <div className="grid lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#dbe9eb]">
            {[
              {
                num: "01",
                word: "LEARN",
                color: "#079DB3",
                title: "AI Training & Certification",
                desc: "A structured 3-month engineering program covering Generative AI, Agentic AI, Forward Deployed Engineering, and a remote internship with a UK AI consultancy. Graduates earn Counts AI verified certificates.",
                link: "/training",
                cta: "Explore program",
              },
              {
                num: "02",
                word: "BUILD",
                color: "#00b4d4",
                title: "AI Products & Engineering",
                desc: "Counts AI builds AI-powered products and systems for businesses — from custom AI agents and RAG platforms to full SaaS products and remote AI engineering teams.",
                link: "/for-businesses",
                cta: "Work with us",
              },
              {
                num: "03",
                word: "WORK",
                color: "#079DB3",
                title: "AI Careers & Talent",
                desc: "An AI jobs platform connecting certified engineers to companies hiring AI talent worldwide. Includes resume building, AI job matching, and a talent pool for businesses to discover vetted candidates.",
                link: "/jobs",
                cta: "Browse AI jobs",
              },
            ].map(s => (
              <div key={s.num} className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{ background: s.color + "15", color: s.color }}
                  >{s.num}</span>
                  <span
                    className="text-[11px] font-black uppercase tracking-widest"
                    style={{ color: s.color }}
                  >{s.word}</span>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#07111f", letterSpacing: "-0.02em" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#7fa8b0" }}>{s.desc}</p>
                <Link
                  href={s.link}
                  className="inline-flex items-center gap-1.5 text-sm font-bold"
                  style={{ color: s.color }}
                >
                  {s.cta} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REAL PRODUCTS ── */}
      <section className="py-20 border-t border-b" style={{ borderColor: "#dbe9eb" }}>
        <div className="cai-container">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <div className="label-overline mb-4" style={{ color: "var(--teal)" }}>Real products</div>
              <h2
                className="font-extrabold mb-5"
                style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.03em", color: "#07111f", lineHeight: 1.1 }}
              >
                We don&apos;t just teach AI.
                <br />
                We build with it.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#486870" }}>
                These are real products developed by Counts AI — not case studies, not student projects. Building our own products keeps us close to the engineering challenges that matter.
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  name: "UK/EU Visa Sponsors",
                  url: "https://ukeuvisasponsors.com",
                  desc: "An AI-powered platform for discovering UK and EU visa sponsorship opportunities. Searchable sponsor data, company profiles, and visa route information.",
                  tag: "Immigration Technology",
                  color: "#079DB3",
                },
                {
                  name: "Adsoni",
                  url: "https://adsoni.com",
                  desc: "An AI advertising technology product. Adsoni applies AI to advertising intelligence — campaign analysis, insight generation, and optimisation recommendations.",
                  tag: "Advertising Technology",
                  color: "#079DB3",
                },
              ].map(p => (
                <div
                  key={p.name}
                  className="p-6"
                  style={{ background: "var(--surface-1)", border: "1.5px solid #dbe9eb" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.tag}</div>
                      <h3 className="text-base font-bold" style={{ color: "#07111f" }}>{p.name}</h3>
                    </div>
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shrink-0"
                      style={{ background: "#e3f7fb", color: "var(--teal)", borderRadius: 4 }}
                    >
                      Built by Counts AI
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#7fa8b0" }}>{p.desc}</p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold"
                    style={{ color: p.color }}
                  >
                    Explore product <ArrowUpRight size={13} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20" style={{ background: "var(--navy)" }}>
        <div className="cai-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="label-overline mb-5" style={{ color: "#00b4d4" }}>Why we exist</div>
            <blockquote
              className="font-extrabold text-white mb-6"
              style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", letterSpacing: "-0.03em", lineHeight: 1.15 }}
            >
              &ldquo;The AI economy is being built now. We want to make sure more people are building it — not watching it pass them by.&rdquo;
            </blockquote>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Counts AI · London, United Kingdom
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 border-t" style={{ borderColor: "#dbe9eb" }}>
        <div className="cai-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-extrabold mb-1" style={{ color: "#07111f", letterSpacing: "-0.025em" }}>
                Ready to get started?
              </h2>
              <p className="text-sm" style={{ color: "#7fa8b0" }}>
                Explore programs, browse AI jobs, or talk to us about your business.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/training"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--teal)" }}
              >
                Explore Training <ArrowRight size={13} />
              </Link>
              <Link
                href="/for-businesses"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors hover:bg-gray-50"
                style={{ color: "#07111f", border: "1.5px solid #dbe9eb" }}
              >
                For Business <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
