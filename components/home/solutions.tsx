"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Workflow, Plug, Bot, Users, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "./reveal";

export type Kind = "workflow" | "integrations" | "agent" | "team";
export type SolutionCard = {
  title: string; desc: string; points: string[]; href: string; Icon: LucideIcon; kind: Kind;
  accent: string; tint: string; metric: { value: string; label: string };
};

// Metrics are qualitative capability statements, not performance claims (no verified figures exist yet).
const CARDS: SolutionCard[] = [
  {
    title: "AI Workflow Automation", desc: "Streamline operations and reduce manual work.",
    points: ["Process automation", "Task orchestration", "Integrated with your tools"],
    href: "/for-businesses#services", Icon: Workflow, kind: "workflow", accent: "#0F9AA6", tint: "#DDF1EE",
    metric: { value: "Automated", label: "Repetitive workflows" },
  },
  {
    title: "System Integrations", desc: "Connect your existing tools and data.",
    points: ["Seamless integrations", "Secure data connections", "Custom data pipelines"],
    href: "/for-businesses#services", Icon: Plug, kind: "integrations", accent: "#D98A3D", tint: "#F8E7D3",
    metric: { value: "Your stack", label: "Connected, not replaced" },
  },
  {
    title: "Custom AI Agents", desc: "Built for your specific business needs.",
    points: ["Industry-specific agents", "Tailored workflows", "Continuous optimisation"],
    href: "/for-businesses#services", Icon: Bot, kind: "agent", accent: "#7C6BD6", tint: "#E6E1F7",
    metric: { value: "Bespoke", label: "Built around your business" },
  },
  {
    title: "Dedicated Engineering Teams", desc: "Scale with experienced AI engineers.",
    points: ["Specialist AI talent", "End-to-end delivery", "Ongoing support & iteration"],
    href: "/for-businesses#workforce", Icon: Users, kind: "team", accent: "#3E9B73", tint: "#DAEEE2",
    metric: { value: "Embedded", label: "Engineers on your roadmap" },
  },
];

function Tile({ cx, cy, w = 46, h = 18, a, layers = 1 }: { cx: number; cy: number; w?: number; h?: number; a: string; layers?: number }) {
  return (
    <g>
      {Array.from({ length: layers }).map((_, i) => {
        const y = cy + (layers - 1 - i) * 7;
        return (
          <g key={i}>
            <path d={`M${cx - w} ${y}L${cx} ${y + h}L${cx + w} ${y}V${y + 6}L${cx} ${y + h + 6}L${cx - w} ${y + 6}Z`} fill={a} fillOpacity=".25" stroke={a} strokeOpacity=".55" />
            <polygon points={`${cx},${y - h} ${cx + w},${y} ${cx},${y + h} ${cx - w},${y}`} fill="#fff" fillOpacity=".85" stroke={a} strokeOpacity=".7" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

function Illo({ kind, a }: { kind: Kind; a: string }) {
  const line = { fill: "none", stroke: a, strokeOpacity: 0.55, strokeWidth: 1 } as const;
  return (
    <svg className="sol-illo" viewBox="0 0 220 130" aria-hidden="true" focusable="false">
      <ellipse cx="110" cy="112" rx="84" ry="10" fill="#0D1B20" opacity=".07" />
      {kind === "workflow" && (
        <g>
          <Tile cx={96} cy={86} w={70} h={26} a={a} layers={2} />
          <path d="M52 80L86 66L110 78L148 56" {...line} />
          {[[52, 80], [86, 66], [110, 78], [148, 56]].map(([x, y], i) => <circle key={i} className="sol-node" cx={x} cy={y} r="3.2" fill="#fff" stroke={a} />)}
          <Tile cx={168} cy={40} w={26} h={10} a={a} />
        </g>
      )}
      {kind === "integrations" && (
        <g>
          <path d="M110 70L58 44M110 70L168 40M110 70L150 96" {...line} />
          <Tile cx={110} cy={74} w={40} h={16} a={a} layers={3} />
          <Tile cx={52} cy={44} w={20} h={8} a={a} />
          <Tile cx={170} cy={38} w={20} h={8} a={a} />
          <Tile cx={152} cy={98} w={20} h={8} a={a} />
          {[[58, 44], [168, 40], [150, 96]].map(([x, y], i) => <circle key={i} className="sol-node" cx={x} cy={y} r="2.6" fill={a} />)}
        </g>
      )}
      {kind === "agent" && (
        <g>
          <Tile cx={110} cy={78} w={64} h={24} a={a} layers={2} />
          <rect x="94" y="46" width="32" height="26" rx="8" fill="#fff" stroke={a} />
          <circle className="sol-node" cx="104" cy="58" r="2.6" fill={a} />
          <circle className="sol-node" cx="116" cy="58" r="2.6" fill={a} />
          <path d="M110 46V40" stroke={a} /><circle cx="110" cy="38" r="2.4" fill={a} />
          <Tile cx={48} cy={92} w={26} h={9} a={a} />
          <Tile cx={176} cy={92} w={26} h={9} a={a} />
        </g>
      )}
      {kind === "team" && (
        <g>
          <path d="M60 86L110 62L160 40" {...line} />
          <Tile cx={58} cy={92} w={34} h={13} a={a} />
          <Tile cx={110} cy={76} w={42} h={16} a={a} layers={2} />
          <Tile cx={162} cy={50} w={30} h={11} a={a} />
          {[[58, 78], [110, 52], [162, 36]].map(([x, y], i) => (
            <g key={i} className="sol-node">
              <circle cx={x} cy={y - 4} r="4.5" fill="#fff" stroke={a} />
              <path d={`M${x - 7} ${y + 8}q7 -9 14 0`} fill="none" stroke={a} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

type SolutionsProps = {
  cards?: SolutionCard[];
  sectionId?: string;
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  lede?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
};

export function SolutionsSection({
  cards = CARDS,
  sectionId = "solutions",
  eyebrow = <><b>05</b> How Counts AI works for every business</>,
  heading = <>Solve industry<br />challenges with <em>AI.</em></>,
  lede = "Custom AI solutions and specialist engineering teams to design, build and deploy agents tailored to your business.",
  ctaLabel = "Discuss your requirements",
  ctaHref = "/for-businesses#contact",
}: SolutionsProps = {}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: (() => void)[] = [];
      el.querySelectorAll<HTMLElement>(".scard").forEach((card, i) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card.querySelector(".sol-illo"), { y: -4, duration: 3 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" }, 0);
        const nodes = card.querySelectorAll(".sol-node");
        if (nodes.length) tl.to(nodes, { opacity: 0.35, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.3 }, 0);
        const st = ScrollTrigger.create({ trigger: card, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
        if (st.isActive) tl.play();
        cleanups.push(() => { st.kill(); tl.kill(); });
      });
      return () => cleanups.forEach((c) => c());
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="sec" id={sectionId} ref={root}>
      <div className="wrap sol-wrap">
        <Reveal>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="h2 sol-h">{heading}</h2>
          <p className="lede" style={{ margin: "18px 0 26px" }}>{lede}</p>
          <Link href={ctaHref} className="btn btn-dark">
            {ctaLabel} <ArrowRight size={14} />
          </Link>
        </Reveal>

        <div className="sol-grid">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <article className="scard" style={{ ["--a" as string]: c.accent, ["--t" as string]: c.tint }}>
                <span className="scard-ico"><c.Icon size={20} /></span>
                <Illo kind={c.kind} a={c.accent} />
                <h3>{c.title}</h3>
                <p className="scard-desc">{c.desc}</p>
                <ul>{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <div className="scard-metric">
                  <div><b>{c.metric.value}</b><small>{c.metric.label}</small></div>
                  <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true">
                    {[8, 14, 20, 26].map((h, k) => <rect key={k} x={k * 9} y={26 - h} width="6" height={h} rx="1.5" fill={c.accent} opacity={0.35 + k * 0.17} />)}
                  </svg>
                </div>
                <Link href={c.href} className="scard-go" aria-label={`${c.title} — learn more`}><ArrowRight size={15} /></Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
