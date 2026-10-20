"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "./reveal";

// Names and copy are provisional — edit here only.
// No dedicated agent pages exist yet, so "Explore" points at the existing business services section.
const AGENT_HREF = "/for-businesses#services";

type Agent = {
  name: string; role: string; desc: string; points: string[];
  accent: string; sky: [string, string, string]; planet: [string, string]; rim: string; motif: "target" | "signal" | "nodes" | "orbit";
};

const AGENTS: Agent[] = [
  {
    name: "Nexa", role: "Lead Generation Agent",
    desc: "Find, qualify and follow up with more leads across your channels.",
    points: ["Lead research & enrichment", "Outreach management", "Smart follow-ups", "CRM integration"],
    accent: "#079EAE", sky: ["#04202B", "#0A3B4A", "#05141C"], planet: ["#3BB7C4", "#0B4A5C"], rim: "#8FE6EE", motif: "target",
  },
  {
    name: "Orion", role: "Customer Service Agent",
    desc: "Handle customer enquiries and support workflows using your knowledge sources and tools.",
    points: ["Multi-channel support", "Ticket handling", "Knowledge base integration", "Human handover when needed"],
    accent: "#D98A3D", sky: ["#241208", "#4A2A12", "#150B05"], planet: ["#E8A862", "#7A3F12"], rim: "#FFD39A", motif: "signal",
  },
  {
    name: "Lyra", role: "HR Management Agent",
    desc: "Support recruitment, onboarding and day-to-day HR workflows.",
    points: ["Candidate screening", "Employee onboarding", "Policy & document assistance", "HR systems integration"],
    accent: "#3E9B73", sky: ["#06231A", "#0F4533", "#04130E"], planet: ["#7FD3A6", "#14583F"], rim: "#C4F2D8", motif: "nodes",
  },
  {
    name: "Vesta", role: "Marketing Intelligence Agent",
    desc: "Plan, create and optimise marketing campaigns across channels.",
    points: ["Content generation", "Campaign planning", "Performance analysis", "Multi-platform publishing"],
    accent: "#7C6BD6", sky: ["#170F33", "#33206B", "#0C0820"], planet: ["#A898F2", "#3E2D8E"], rim: "#D9D0FF", motif: "orbit",
  },
];

const STARS: [number, number, number][] = [
  [18, 20, 1.1], [44, 46, 0.8], [70, 16, 1.3], [96, 52, 0.8], [122, 24, 1], [150, 40, 0.8], [176, 14, 1.2],
  [204, 48, 0.9], [232, 22, 1.1], [258, 44, 0.8], [30, 74, 0.8], [112, 70, 0.9], [190, 76, 0.8], [250, 70, 1],
];
const SPARKS: [number, number, number][] = [[212, 30, 10], [84, 40, 6], [246, 62, 5]];

function Scene({ a, i }: { a: Agent; i: number }) {
  const id = `sc${i}`;
  return (
    <svg className="gcard-scene" viewBox="0 0 280 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a.sky[0]} /><stop offset=".55" stopColor={a.sky[1]} /><stop offset="1" stopColor={a.sky[2]} />
        </linearGradient>
        <radialGradient id={`${id}p`} cx="22%" cy="30%" r="85%">
          <stop offset="0" stopColor={a.planet[0]} /><stop offset="1" stopColor={a.planet[1]} />
        </radialGradient>
      </defs>
      <rect width="280" height="170" fill={`url(#${id}s)`} />
      {STARS.map(([x, y, r], k) => <circle key={k} className="ag-star" cx={x} cy={y} r={r} fill="#fff" opacity={0.55} />)}
      {SPARKS.map(([x, y, s], k) => (
        <path key={k} className="ag-spark" d={`M${x} ${y - s}L${x + s * 0.22} ${y - s * 0.22}L${x + s} ${y}L${x + s * 0.22} ${y + s * 0.22}L${x} ${y + s}L${x - s * 0.22} ${y + s * 0.22}L${x - s} ${y}L${x - s * 0.22} ${y - s * 0.22}Z`} fill="#fff" opacity=".9" />
      ))}
      <circle cx="318" cy="150" r="124" fill={`url(#${id}p)`} />
      <circle cx="318" cy="150" r="124" fill="none" stroke={a.rim} strokeOpacity=".75" strokeWidth="1.4" />
    </svg>
  );
}

export function AgentsSection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];
      const cards = Array.from(el.querySelectorAll<HTMLElement>(".gcard"));

      cards.forEach((card, i) => {
        const q = (s: string) => Array.from(card.querySelectorAll<SVGElement | HTMLElement>(s));
        const tl = gsap.timeline({ paused: true });
        const stars = q(".ag-star"), sparks = q(".ag-spark");

        gsap.set(sparks, { transformBox: "fill-box", transformOrigin: "50% 50%" });
        tl.add(gsap.to(stars, {
          opacity: 1, duration: () => gsap.utils.random(1.2, 2.4), repeat: -1, yoyo: true, ease: "sine.inOut",
          stagger: { each: 0.17, from: "random" },
        }), 0);
        tl.add(gsap.to(sparks, { scale: 1.35, opacity: 1, duration: 1.8 + i * 0.3, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.5 }), 0);

        const st = ScrollTrigger.create({
          trigger: card, start: "top bottom", end: "bottom top",
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });
        if (st.isActive) tl.play();
        kills.push(() => { st.kill(); tl.kill(); });
      });

      return () => kills.forEach((k) => k());
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="sec" id="agents">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <div className="eyebrow"><b>02</b> Our AI agents</div>
            <h2>
              Four AI agents.<br />
              <em>Built for real business outcomes.</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede" style={{ maxWidth: "40ch" }}>
              Ready-to-use agents, or custom solutions built by our engineering team. Each agent is designed
              around one specific business function.
            </p>
          </Reveal>
        </div>

        <div className="agents" ref={root}>
          {AGENTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 90}>
              <article className="gcard" style={{ ["--ac" as string]: a.accent, ["--rim" as string]: a.rim }}>
                <div className="gcard-in">
                  <div className="gcard-art">
                    <Scene a={a} i={i} />
                    <div className="gcard-title">
                      <h3>{a.name}</h3>
                      <p>{a.role}</p>
                    </div>
                  </div>
                  <div className="gcard-body">
                    <p className="gcard-desc">{a.desc}</p>
                    <ul>
                      {a.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                    <div className="gcard-foot">
                      <Link href={AGENT_HREF} className="gcard-cta" aria-label={`Explore ${a.name}`}>
                        Explore {a.name} <ArrowRight size={13} />
                      </Link>
                      <span className="gcard-num" aria-hidden="true">0{i + 1}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="note">Agent names and descriptions are provisional.</p>
      </div>
    </section>
  );
}
