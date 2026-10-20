"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import "@/components/home/info-pages.css";

const SIDES = [
  { num: "01", word: "LEARN", color: "#0F9AA6", title: "AI Training & Certification", desc: "A structured 3-month engineering program covering Generative AI, Agentic AI, Forward Deployed Engineering, and a remote internship with a UK AI consultancy. Graduates earn Counts AI verified certificates.", link: "/training", cta: "Explore program" },
  { num: "02", word: "BUILD", color: "#7C6BD6", title: "AI Products & Engineering", desc: "Counts AI builds AI-powered products and systems for businesses — from custom AI agents and RAG platforms to full SaaS products and remote AI engineering teams.", link: "/for-businesses", cta: "Work with us" },
  { num: "03", word: "WORK", color: "#3E9B73", title: "AI Careers & Talent", desc: "An AI jobs platform connecting certified engineers to companies hiring AI talent worldwide. Includes resume building, AI job matching, and a talent pool for businesses to discover vetted candidates.", link: "/jobs", cta: "Browse AI jobs" },
];

const PRODUCTS = [
  { name: "UK/EU Visa Sponsors", url: "https://ukeuvisasponsors.com", desc: "An AI-powered platform for discovering UK and EU visa sponsorship opportunities. Searchable sponsor data, company profiles, and visa route information.", tag: "Immigration Technology" },
  { name: "Adsoni", url: "https://adsoni.com", desc: "An AI advertising technology product. Adsoni applies AI to advertising intelligence — campaign analysis, insight generation, and optimisation recommendations.", tag: "Advertising Technology" },
];

export default function AboutPage() {
  return (
    <div className={`ch ip ${serif.variable} ${mono.variable} ${display.variable}`}>
      <PublicNavbar active="About" />

      <main>
        <section className="ip-hero night">
          <div className="wrap ip-hero-in">
            <div className="eyebrow">About Counts AI</div>
            <h1>An AI company <em>that trains, builds and connects.</em></h1>
            <p className="lede">Counts AI is a UK-based AI company with three connected sides: a training and certification platform, an AI engineering practice, and an AI career and talent marketplace.</p>
          </div>
        </section>

        <section className="sec">
          <div className="wrap ip-prose">
            <div className="eyebrow">What Counts AI is</div>
            <h2 className="h2 ip-h2">Not just a training platform. Not just a consultancy. <em>Both, and a jobs marketplace.</em></h2>
            <p>{"The world is moving to AI faster than most careers can keep up with. Counts AI was built to close that gap — giving people the skills, credentials and experience to enter the AI economy, while helping businesses build AI capability and deploy real engineering talent."}</p>
            <p>{"We apply the same AI engineering we teach: our own products are built with the tools and techniques students learn on the program. That connection is deliberate."}</p>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="eyebrow">The Counts AI ecosystem</div>
            <h2 className="h2 ip-h2">Learn. Build. <em>Work.</em></h2>
            <div className="ip-eco">
              {SIDES.map((s) => (
                <div key={s.num} className="ip-card hov" style={{ ["--ac" as string]: s.color }}>
                  <b className="w">{s.num} · {s.word}</b>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <Link href={s.link} className="ip-link" style={{ color: s.color }}>{s.cta} <ArrowRight size={13} /></Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="eyebrow">Real products</div>
            <h2 className="h2 ip-h2">We don&apos;t just teach AI. <em>We build with it.</em></h2>
            <p className="lede" style={{ marginTop: 12 }}>These are real products developed by Counts AI, not case studies, not student projects. Building our own products keeps us close to the engineering challenges that matter.</p>
            <div className="ip-cards ip-two">
              {PRODUCTS.map((p) => (
                <div key={p.name} className="ip-card hov">
                  <span className="ip-tag">{p.tag}</span>
                  <h3 style={{ marginTop: 10 }}>{p.name}</h3>
                  <p>{p.desc}</p>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="ip-link">Explore product <ArrowUpRight size={13} /></a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ip-hero night center">
          <div className="wrap ip-hero-in">
            <div className="eyebrow">Why we exist</div>
            <blockquote className="ip-quote">&ldquo;The AI economy is being built now. We want to make sure more people are building it, not watching it pass them by.&rdquo;</blockquote>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>Counts AI · London, United Kingdom</p>
          </div>
        </section>

        <section className="ip-band">
          <div className="wrap">
            <div>
              <h2>Ready to <em>get started?</em></h2>
              <p>Explore programs, browse AI jobs, or talk to us about your business.</p>
            </div>
            <div className="ip-btns" style={{ margin: 0 }}>
              <Link href="/training" className="btn btn-light primary">Explore Training <ArrowRight size={14} /></Link>
              <Link href="/for-businesses" className="btn btn-light">For Business <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
