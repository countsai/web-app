"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, Users, Mail, CalendarDays, Database, FileText, LayoutGrid,
  TrendingUp, Smile, Cog, BarChart3, Clock, Rocket, type LucideIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "./reveal";

type Item = { title: string; desc: string; Icon: LucideIcon; c: string };

const TOOLS: Item[] = [
  { title: "CRM", desc: "Sync customer data", Icon: Users, c: "#22D3E6" },
  { title: "Email", desc: "Messages & enquiries", Icon: Mail, c: "#F59E6B" },
  { title: "Calendar", desc: "Meetings & events", Icon: CalendarDays, c: "#4ADE9A" },
  { title: "Database", desc: "Structured data", Icon: Database, c: "#F5C84B" },
  { title: "File storage", desc: "Documents & files", Icon: FileText, c: "#A78BFA" },
  { title: "Third-party apps", desc: "Your favourite tools", Icon: LayoutGrid, c: "#60A5FA" },
];

const OUTCOMES: Item[] = [
  { title: "More qualified leads", desc: "Higher conversion rates", Icon: TrendingUp, c: "#22D3E6" },
  { title: "Happier customers", desc: "Faster, smarter support", Icon: Smile, c: "#F59E6B" },
  { title: "Efficient HR operations", desc: "Streamlined workflows", Icon: Cog, c: "#4ADE9A" },
  { title: "Better marketing ROI", desc: "Data-driven campaigns", Icon: BarChart3, c: "#F5C84B" },
  { title: "Time saved for your team", desc: "Less manual work", Icon: Clock, c: "#A78BFA" },
  { title: "Scalable growth", desc: "Ready for what's next", Icon: Rocket, c: "#60A5FA" },
];

// Top → bottom
const LAYERS = [
  { label: "Counts AI", c: "#22D3E6", cap: true },
  { label: "Agent orchestration", c: "#4ADE9A" },
  { label: "MCP servers & tool integrations", c: "#86EFAC" },
  { label: "RAG & memory", c: "#F5A94B" },
  { label: "Security & governance", c: "#A78BFA" },
  { label: "Business data & applications", c: "#60A5FA" },
];

const MK = { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": true } as const;
// Simple marks drawn inline (no new dependencies); wordmarks are styled text. No endorsement implied.
const TECH: { name: string; text?: string; mark?: React.ReactNode; style?: React.CSSProperties }[] = [
  { name: "Next.js", mark: <svg {...MK}><circle cx="12" cy="12" r="11" fill="#fff" /><path d="M8.5 7.5v9M8.5 7.5l7 9M15.5 7.5v5" stroke="#071A15" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg> },
  { name: "React", mark: <svg {...MK} fill="none" stroke="#61DAFB" strokeWidth="1.3"><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.7" fill="#61DAFB" stroke="none" /></svg> },
  { name: "TypeScript", text: "TypeScript", mark: <svg {...MK}><rect x="2" y="2" width="20" height="20" rx="3" fill="#3178C6" /><text x="12" y="17" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="sans-serif">TS</text></svg> },
  { name: "Tailwind CSS", mark: <svg {...MK} fill="#38BDF8"><path d="M12 6c-2.7 0-4.400 1.300-5 4 1-1.300 2.200-1.800 3.500-1.500.8.200 1.300.700 1.900 1.300C13.400 10.800 14.500 12 17 12c2.700 0 4.400-1.300 5-4-1 1.300-2.200 1.800-3.500 1.500-.8-.2-1.300-.7-1.900-1.300C15.600 7.200 14.500 6 12 6zM7 12c-2.700 0-4.400 1.300-5 4 1-1.300 2.200-1.800 3.500-1.500.8.200 1.300.7 1.900 1.300C8.400 16.800 9.500 18 12 18c2.700 0 4.400-1.300 5-4-1 1.300-2.200 1.800-3.500 1.500-.8-.2-1.300-.7-1.900-1.300C10.600 13.200 9.500 12 7 12z" /></svg> },
  { name: "Supabase", mark: <svg {...MK}><path d="M13.500 2L4 14h7.500l-1 8L20 10h-7.500z" fill="#3ECF8E" /></svg> },
  { name: "PostgreSQL", style: { fontWeight: 700, color: "#8FB8E8", letterSpacing: "-0.01em" }, mark: <svg {...MK} fill="none" stroke="#8FB8E8" strokeWidth="1.5"><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.700 3.100 3 7 3s7-1.300 7-3V6M5 12c0 1.700 3.100 3 7 3s7-1.300 7-3" /></svg> },
  { name: "Stripe", text: "stripe", style: { fontWeight: 800, fontStyle: "italic", fontSize: 17, color: "#A39BFF", letterSpacing: "-0.03em" } },
  { name: "Razorpay", text: "Razorpay", style: { fontWeight: 700, fontStyle: "italic", color: "#5BA8FF", letterSpacing: "-0.02em" } },
  { name: "Firebase", mark: <svg {...MK}><path d="M5 17.500L7.200 3l3.300 6 1.500-3 3 6z" fill="#FFCA28" /><path d="M5 17.500l7 4 7-4-2.300-8.500L12 17.500z" fill="#FFA000" /></svg> },
  { name: "GSAP", text: "GSAP", style: { fontWeight: 800, color: "#88CE02", letterSpacing: ".04em" } },
  { name: "AWS", text: "aws", style: { fontWeight: 800, fontSize: 18, color: "#FF9900", letterSpacing: "-0.02em" } },
  { name: "Azure", text: "Azure", style: { fontWeight: 600, color: "#4FA8FF" }, mark: <svg {...MK}><path d="M3 20L10 4h5l-4 7 9 9zM11 20l9 0-6-6z" fill="#4FA8FF" /></svg> },
  { name: "Claude", text: "Claude", style: { fontFamily: "var(--ch-serif), Georgia, serif", fontSize: 17, color: "#E8A27C" }, mark: <svg {...MK} stroke="#E8A27C" strokeWidth="2" strokeLinecap="round"><path d="M12 3v18M3 12h18M5.600 5.600l12.800 12.800M18.400 5.600L5.600 18.400" /></svg> },
  { name: "ChatGPT", text: "ChatGPT", style: { fontWeight: 600, color: "#7EE0C3" }, mark: <svg {...MK} fill="none" stroke="#7EE0C3" strokeWidth="1.600"><path d="M12 3l7 4v8l-7 4-7-4V7z" /><path d="M12 3v8l7 4M12 11L5 15" /></svg> },
  { name: "Gemini", text: "Gemini", style: { fontWeight: 600, color: "#9DB8FF" }, mark: <svg {...MK}><path d="M12 2c.6 5.500 4.500 9.400 10 10-5.500.6-9.400 4.500-10 10-.6-5.500-4.500-9.400-10-10 5.500-.6 9.400-4.500 10-10z" fill="#8AB4FF" /></svg> },
  { name: "SarvamAI", text: "SarvamAI", style: { fontWeight: 700, color: "#FFB067", letterSpacing: "-0.01em" } },
  { name: "LayaLLM", text: "LayaLLM", style: { fontWeight: 700, color: "#C4A8FF", letterSpacing: ".01em" } },
  { name: "Hugging Face", text: "Hugging Face", style: { fontWeight: 600, color: "#FFD21E" }, mark: <svg {...MK}><circle cx="12" cy="12" r="10" fill="#FFD21E" /><circle cx="8.500" cy="10" r="1.300" fill="#3A2A00" /><circle cx="15.500" cy="10" r="1.300" fill="#3A2A00" /><path d="M7.500 14c1.200 2.600 7.800 2.600 9 0" stroke="#3A2A00" strokeWidth="1.500" fill="none" strokeLinecap="round" /></svg> },
  { name: "Resend", text: "resend", style: { fontWeight: 600, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" } },
];

const H = 444;
const ROW = 64, GAP = 12;
const rowY = (i: number) => ROW / 2 + i * (ROW + GAP);
const layerY = (i: number) => 62 + i * 58;

/** Curved circuit trace with a mid-run elbow. */
function trace(side: "l" | "r", i: number) {
  const y = rowY(i);
  const ty = 150 + i * 30;          // converge on the middle of the stack
  const x1 = 30 + (i % 3) * 8;
  return side === "l"
    ? `M0 ${y} H${x1} C ${x1 + 26} ${y}, ${x1 + 20} ${ty}, 96 ${ty}`
    : `M0 ${ty} C 20 ${ty}, ${96 - x1 - 20} ${y}, ${96 - x1} ${y} H96`;
}

function Connectors({ side }: { side: "l" | "r" }) {
  return (
    <svg className={`p3-conn ${side}`} width="96" height={H} viewBox={`0 0 96 ${H}`} aria-hidden="true" focusable="false">
      {TOOLS.map((t, i) => {
        const c = (side === "l" ? TOOLS : OUTCOMES)[i].c;
        return (
          <g key={i}>
            <path className={`p3-path ${side}`} d={trace(side, i)} fill="none" stroke={c} strokeOpacity=".55" strokeWidth="1.3" />
            <circle cx={side === "l" ? 0 : 96} cy={rowY(i)} r="3.2" fill={c} />
            <circle className="p3-dot" r="3.4" fill={c} cx="0" cy="0" opacity="0" />
          </g>
        );
      })}
    </svg>
  );
}

function Stack() {
  const cx = 150, w = 124, h = 38, th = 14;
  const order = LAYERS.map((l, i) => ({ ...l, i })).reverse(); // draw bottom first
  return (
    <svg className="p3-stack" viewBox={`0 0 300 ${H}`} role="img" aria-label="Counts AI platform: agent orchestration, MCP servers and tool integrations, RAG and memory, security and governance, business data and applications.">
      <defs>
        {LAYERS.map((l, i) => (
          <linearGradient key={i} id={`pl${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={l.c} stopOpacity=".55" />
            <stop offset="1" stopColor="#06231B" stopOpacity=".95" />
          </linearGradient>
        ))}
      </defs>
      <ellipse cx={cx} cy={H - 40} rx="130" ry="22" fill="#000" opacity=".28" />
      {order.map(({ label, c, i, cap }) => {
        const cy = layerY(i);
        const top = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
        return (
          <g key={label} className={`p3-layer l${i}`}>
            <path d={`M${cx - w} ${cy}L${cx} ${cy + h}L${cx + w} ${cy}V${cy + th}L${cx} ${cy + h + th}L${cx - w} ${cy + th}Z`} fill="#05140F" stroke={c} strokeOpacity=".6" strokeLinejoin="round" />
            <path d={`M${cx - w} ${cy + th * 0.5}L${cx} ${cy + h + th * 0.5}L${cx + w} ${cy + th * 0.5}`} fill="none" stroke={c} strokeOpacity=".9" strokeWidth="1.6" />
            <polygon points={top} fill={`url(#pl${i})`} stroke={c} strokeOpacity=".8" strokeLinejoin="round" />
            <polygon className="p3-edge" points={top} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2" strokeLinejoin="round" />
            <path d={`M${cx - w + 22} ${cy}L${cx} ${cy + h - 12}L${cx + w - 22} ${cy}L${cx} ${cy - h + 12}Z`} fill="none" stroke={c} strokeOpacity=".35" />
            {[-70, -40, 40, 70].map((dx) => (
              <circle key={dx} className="p3-node" cx={cx + dx} cy={cy + (dx < 0 ? 4 : 4)} r="2" fill={c} opacity=".45" />
            ))}
            {cap ? (
              <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="var(--ch-serif), Georgia, serif" fontStyle="italic" fontSize="24" fill="#fff">{label}</text>
            ) : (
              <text x={cx} y={cy + 12} textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="10" fontWeight="500" fill="#fff">
                {label.length > 22 ? label.split(" & ").map((t, k) => <tspan key={k} x={cx} dy={k ? 11 : -3}>{k ? `& ${t}` : t}</tspan>) : label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Card({ it, kind }: { it: Item; kind: "tool" | "out" }) {
  const { Icon } = it;
  return (
    <li className={`p3-card ${kind}`} style={{ ["--c" as string]: it.c }}>
      <span className="p3-ico"><Icon size={18} strokeWidth={2} /></span>
      <span className="p3-txt"><b>{it.title}</b><small>{it.desc}</small></span>
    </li>
  );
}

type PlatformProps = {
  sectionId?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  lede?: React.ReactNode;
  showCta?: boolean;
  showTech?: boolean;
};

export function PlatformSection({
  sectionId = "platform",
  eyebrow = <><b>03</b> How Counts AI works</>,
  title = <>From your tools<br /><em>to real outcomes.</em></>,
  lede = "Our agents connect to your data, tools and teams through integrations built by our engineers — from information to action.",
  showCta = true,
  showTech = true,
}: PlatformProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add({ ok: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 1101px)" }, (ctx) => {
      const { wide } = ctx.conditions as { ok: boolean; wide: boolean };
      const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));
      const tools = q<HTMLElement>(".p3-card.tool"), outs = q<HTMLElement>(".p3-card.out");
      const layers = q<SVGGElement>(".p3-layer");
      const pathsL = q<SVGPathElement>(".p3-path.l"), pathsR = q<SVGPathElement>(".p3-path.r");
      const dotsL = q<SVGCircleElement>(".p3-conn.l .p3-dot"), dotsR = q<SVGCircleElement>(".p3-conn.r .p3-dot");

      const glow = (c: string) => ({ borderColor: c, boxShadow: `0 0 0 1px ${c}55, 0 0 22px -6px ${c}`, duration: 0.45, ease: "power2.out" });
      const calm = { borderColor: "rgba(169,207,196,.2)", boxShadow: "0 0 0 0 rgba(0,0,0,0)", duration: 0.7, ease: "power2.inOut" };

      const travel = (tl: gsap.core.Timeline, path: SVGPathElement | undefined, dot: SVGCircleElement | undefined, at: number, dur: number) => {
        if (!path || !dot) return;
        const len = path.getTotalLength(), o = { p: 0 };
        tl.fromTo(o, { p: 0 }, {
          p: 1, duration: dur, ease: "sine.inOut",
          onUpdate: () => { const pt = path.getPointAtLength(o.p * len); dot.setAttribute("cx", String(pt.x)); dot.setAttribute("cy", String(pt.y)); },
        }, at);
        tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, at);
        tl.to(dot, { opacity: 0, duration: 0.25, ease: "none" }, at + dur - 0.25);
      };

      const master = gsap.timeline({ paused: true });

      // one row = tool lights → signal in → layer pulse → signal out → outcome lights
      tools.forEach((tool, i) => {
        const row = gsap.timeline({ repeat: -1, repeatDelay: 2.6 });
        const c = tool.style.getPropertyValue("--c");
        const oc = outs[i].style.getPropertyValue("--c");
        const edge = layers[Math.min(i + 0, layers.length - 1)]?.querySelector(".p3-edge");
        row.to(tool, glow(c), 0);
        if (wide) travel(row, pathsL[i], dotsL[i], 0.15, 1.2);
        if (edge) {
          row.to(edge, { strokeOpacity: 1, strokeWidth: 2.4, duration: 0.4 }, 1.1);
          row.to(edge, { strokeOpacity: 0.35, strokeWidth: 1.2, duration: 0.8 }, 1.7);
        }
        if (wide) travel(row, pathsR[i], dotsR[i], 1.5, 1.3);
        row.to(outs[i], glow(oc), 2.6);
        row.to(tool, calm, 2.2);
        row.to(outs[i], calm, 4.0);
        master.add(row, i * 0.75);
      });

      // platform nodes breathe in sequence
      master.add(gsap.to(q(".p3-node"), { opacity: 1, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.18, from: "start" } }), 0);

      const st = ScrollTrigger.create({
        trigger: el, start: "top bottom", end: "bottom top",
        onToggle: (self) => (self.isActive ? master.play() : master.pause()),
      });
      if (st.isActive) master.play();
      return () => { st.kill(); master.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="sec dark pf" id={sectionId} ref={root}>
      <div className="wrap">
        <div className="p3-grid">
          <Reveal>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="p3-h">{title}</h2>
            <p className="lede">{lede}</p>
            {showCta && (
            <div style={{ marginTop: 28 }}>
              <Link href="/for-businesses#services" className="btn btn-light">
                See the full platform <ArrowRight size={14} />
              </Link>
            </div>
            )}
          </Reveal>

          <Reveal delay={120}>
            <div className="p3-diag">
              <div>
                <div className="p3-h4">Your tools</div>
                <ul className="p3-list">{TOOLS.map((t) => <Card key={t.title} it={t} kind="tool" />)}</ul>
              </div>
              <div className="p3-mid">
                <div className="p3-h4 c">Counts AI platform</div>
                <div className="p3-midbox">
                  <Connectors side="l" />
                  <Stack />
                  <Connectors side="r" />
                </div>
              </div>
              <div>
                <div className="p3-h4">Business outcomes<br />we build towards</div>
                <ul className="p3-list">{OUTCOMES.map((t) => <Card key={t.title} it={t} kind="out" />)}</ul>
              </div>
            </div>
          </Reveal>
        </div>

        {showTech && (
        <div className="tech p3-strip">
          <span className="k">Built with</span>
          <div className="p3-marquee">
            <ul className="p3-track">
              {[...TECH, ...TECH].map((t, i) => (
                <li key={`${t.name}-${i}`} className="p3-tech" aria-hidden={i >= TECH.length || undefined}>
                  {t.mark}
                  <span style={t.style}>{t.text ?? t.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
