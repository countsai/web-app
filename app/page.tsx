"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ConsultationPopup } from "@/components/shared/consultation-popup";
import { JoinModal } from "@/components/home/join-modal";
import { HomeNav } from "@/components/home/home-nav";
import { HeroDiagram, type HeroDiagramHandle } from "@/components/home/hero-diagram";
import { AgentsSection } from "@/components/home/agents";
import { PlatformSection } from "@/components/home/platform";
import {
  JobsSection,
} from "@/components/home/sections";
import { SolutionsSection } from "@/components/home/solutions";
import { MissionSection } from "@/components/home/mission";
import { CaseSection } from "@/components/home/case-studies";
import { AcademySection } from "@/components/home/academy";
import { HomeFooter } from "@/components/home/home-footer";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";

// Existing figures carried over from the previous homepage.
const STATS = [
  { n: "840+", l: "Students enrolled" },
  { n: "500+", l: "AI jobs listed" },
  { n: "60+",  l: "Business clients" },
  { n: "38",   l: "Countries" },
];

export default function HomePage() {
  const [showConsult, setShowConsult] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const diagramRef = useRef<HeroDiagramHandle>(null);

  return (
    <div className={`ch ${serif.variable} ${mono.variable} ${display.variable}`}>
      <HomeNav />

      <main>
        {/* 01 — Hero */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow"><b>01</b> AI agents for modern businesses</div>
              <h1>
                Turn your business into an <em>intelligent system.</em>
              </h1>
              <p className="lede">
                Counts AI delivers AI agents, custom engineering and specialist talent to help businesses
                automate work, serve customers and grow with confidence.
              </p>
              <div className="hero-ctas">
                <Link href="#agents" className="btn btn-dark">
                  Explore our agents <ArrowRight size={14} />
                </Link>
                <button type="button" className="btn btn-ghost" onClick={() => diagramRef.current?.replay()}>
                  Watch how it works
                </button>
              </div>
              <dl className="stats" style={{ margin: 0 }}>
                {STATS.map((s) => (
                  <div className="stat" key={s.l}>
                    <dt className="stat-n" style={{ fontWeight: 600 }}>{s.n}</dt>
                    <dd className="stat-l" style={{ margin: 0 }}>{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="hero-art">
              <HeroDiagram ref={diagramRef} />
            </div>
          </div>
        </section>

        <AgentsSection />
        <PlatformSection />
        <AcademySection onInterest={() => setShowJoin(true)} />
        <SolutionsSection />
        <JobsSection />
        <CaseSection />
        <MissionSection />
      </main>

      <HomeFooter />

      {showConsult && <ConsultationPopup onClose={() => setShowConsult(false)} />}
      {showJoin && <JoinModal onClose={() => setShowJoin(false)} />}

      <button
        onClick={() => setShowConsult(true)}
        className="btn btn-dark consult-fab"
      >
        Free Consultation
      </button>
    </div>
  );
}
