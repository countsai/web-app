"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, Plug, Layers, Wrench, Cpu, Search, PenTool, Rocket, Zap, Boxes, Users2, ShieldCheck,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/home/reveal";
import "./biz.css";

/* ───────────────────────── data ───────────────────────── */

const AGENTS = [
  {
    key: "nexa", name: "Nexa", cat: "Lead Generation", c: "#079EAE", tint: "#DDF1F1", img: "/images/agents/nexa.png",
    desc: "Find, qualify and engage potential customers with less manual work.",
    caps: ["Lead research and enrichment", "Lead qualification and scoring", "Personalised outreach", "Follow-up and CRM workflows"],
  },
  {
    key: "orion", name: "Orion", cat: "Customer Service", c: "#D98A3D", tint: "#F8E7D3", img: "/images/agents/orion.png",
    desc: "Deliver responsive customer support across your existing communication channels.",
    caps: ["Customer enquiry handling", "Knowledge-base retrieval", "Ticket triage and routing", "Human handover when needed"],
  },
  {
    key: "lyra", name: "Lyra", cat: "HR Management", c: "#3E9B73", tint: "#DAEEE2", img: "/images/agents/lyra.png",
    desc: "Streamline recruitment, onboarding and everyday people operations.",
    caps: ["Candidate screening assistance", "Recruitment workflow automation", "Employee onboarding", "HR document and system integration"],
  },
  {
    key: "vesta", name: "Vesta", cat: "Marketing Intelligence", c: "#7C6BD6", tint: "#E6E1F7", img: "/images/agents/vesta.png",
    desc: "Plan, create and optimise marketing campaigns using connected business data.",
    caps: ["Content planning and generation", "Campaign workflow automation", "Performance analysis", "Multi-channel publishing support"],
  },
];

const TOOLS = ["CRM", "Email", "Calendar", "Databases", "APIs"];

const STEPS = [
  { n: "01", Icon: Search, t: "Discover", d: "Understand the business problem, current systems and intended outcomes." },
  { n: "02", Icon: PenTool, t: "Design", d: "Define the architecture, integrations, agent behaviour and success criteria." },
  { n: "03", Icon: Wrench, t: "Build and integrate", d: "Configure existing agents or engineer a custom solution." },
  { n: "04", Icon: Rocket, t: "Deploy and improve", d: "Test the workflow, deploy appropriately and refine it using real operational feedback." },
];

const WHY = [
  { Icon: Users2, t: "Specialist agents", d: "Distinct AI agents for distinct business functions." },
  { Icon: Plug, t: "Fits your tools", d: "Integration with your existing tools and workflows." },
  { Icon: Cpu, t: "Custom engineering", d: "Built to order when standard functionality is not enough." },
  { Icon: Boxes, t: "Modular by design", d: "Solutions that can expand with your business requirements." },
  { Icon: ShieldCheck, t: "Expertise on tap", d: "Access to AI engineering expertise without necessarily building an entire internal team." },
];

/* ───────────────────────── hero ───────────────────────── */

export function BizHero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));
      const master = gsap.timeline({ paused: true });
      // gentle idle float, staggered
      master.add(gsap.to(q(".bz-robot"), { y: -6, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.45 }), 0);
      // signals along the connector paths
      const paths = q<SVGPathElement>(".bz-path");
      const dots = q<SVGCircleElement>(".bz-dot");
      paths.forEach((p, i) => {
        const dot = dots[i];
        if (!dot) return;
        const len = p.getTotalLength(), o = { t: 0 };
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 + (i % 3) * 0.4 });
        tl.fromTo(o, { t: 0 }, {
          t: 1, duration: 1.8 + (i % 4) * 0.25, ease: "sine.inOut",
          onUpdate: () => { const pt = p.getPointAtLength(o.t * len); dot.setAttribute("cx", String(pt.x)); dot.setAttribute("cy", String(pt.y)); },
        }, 0);
        tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, 0);
        tl.to(dot, { opacity: 0, duration: 0.25, ease: "none" }, ">-0.25");
        master.add(tl, i * 0.3);
      });
      const st = ScrollTrigger.create({
        trigger: el, start: "top bottom", end: "bottom top",
        onToggle: (s) => (s.isActive ? master.play() : master.pause()),
      });
      if (st.isActive) master.play();
      return () => { st.kill(); master.kill(); };
    });
    return () => mm.revert();
  }, []);

  const rx = [80, 240, 400, 560];
  const tx = [70, 195, 320, 445, 570];
  const up = rx.map((x) => `M${x} 205 C ${x} 240, 320 230, 320 266`);
  const down = tx.map((x) => `M320 318 C 320 345, ${x} 340, ${x} 372`);

  return (
    <section className="bz-hero" id="top">
      <div className="wrap bz-hero-grid">
        <Reveal>
          <div className="eyebrow">AI for business</div>
          <h1 className="bz-h1">Build your <em>AI workforce.</em></h1>
          <p className="lede" style={{ margin: "18px 0 26px", maxWidth: "46ch" }}>
            From ready-to-use AI agents to custom-built business systems, Counts AI helps you automate operations, connect your tools and put AI to work.
          </p>
          <div className="bz-ctas">
            <Link href="#services" className="btn btn-dark">Explore AI agents <ArrowRight size={14} /></Link>
            <Link href="#contact" className="btn btn-ghost">Talk to our team</Link>
          </div>
          <ul className="bz-bens">
            <li><Zap size={18} /><span><b>Deploy in days</b><small>where the use case allows</small></span></li>
            <li><Plug size={18} /><span><b>Integrate</b><small>with your existing tools</small></span></li>
            <li><Layers size={18} /><span><b>Expand</b><small>with custom engineering when needed</small></span></li>
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="bz-team" ref={root} role="group" aria-label="The four Counts AI agents connected to your business tools through one platform">
            <svg className="bz-svg" viewBox="0 0 640 440" aria-hidden="true" focusable="false">
              <g fill="none" strokeWidth="1.3" strokeLinecap="round">
                {AGENTS.map((a, i) => <path key={a.key} className="bz-path" d={up[i]} stroke={a.c} strokeOpacity=".55" />)}
                {down.map((d, i) => <path key={i} className="bz-path bz-tool-path" d={d} stroke="#079EAE" strokeOpacity=".4" />)}
              </g>
              {AGENTS.map((a, i) => <circle key={a.key} className="bz-dot" r="3.2" fill={a.c} opacity="0" cx={rx[i]} cy="205" />)}
              {down.map((_, i) => <circle key={i} className="bz-dot bz-tool-path" r="3" fill="#079EAE" opacity="0" cx="320" cy="318" />)}
            </svg>
            {AGENTS.map((a, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={a.key} className="bz-robot" src={a.img} alt={`${a.name}, the ${a.cat} agent`} style={{ left: `${(rx[i] / 640) * 100}%` }} />
            ))}
            <div className="bz-hub"><b>Counts AI</b><small>Shared platform</small></div>
            {TOOLS.map((t, i) => <span key={t} className="bz-tool" style={{ left: `${(tx[i] / 640) * 100}%` }}>{t}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── agents ───────────────────────── */

export function BizAgents() {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Our AI agents</div>
          <h2 className="h2 bz-h2">Four specialists. <em>One intelligent platform.</em></h2>
          <p className="lede" style={{ margin: "14px 0 34px" }}>
            Purpose-built AI agents that help your business attract customers, support people and make better decisions.
          </p>
        </Reveal>
        <div className="bz-agents">
          {AGENTS.map((a, i) => (
            <Reveal key={a.key} delay={i * 90}>
              <article className="bz-agent" style={{ ["--ac" as string]: a.c, ["--tint" as string]: a.tint }}>
                <div className="bz-agent-art">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.img} alt={`${a.name} mascot`} loading="lazy" />
                </div>
                <div className="bz-agent-body">
                  <span className="bz-num">0{i + 1}</span>
                  <h3>{a.name}</h3>
                  <p className="bz-cat">{a.cat}</p>
                  <p className="bz-desc">{a.desc}</p>
                  <ul>{a.caps.map((c) => <li key={c}>{c}</li>)}</ul>
                  <Link href="#contact" className="bz-cta">Talk to us about {a.name} <ArrowRight size={13} /></Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── process ───────────────────────── */

export function BizProcess() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(".bz-line", { scaleX: 0 }, { scaleX: 1, transformOrigin: "0 50%", duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        gsap.from(".bz-step", { opacity: 0, y: 16, duration: 0.6, stagger: 0.18, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
      }, el);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="sec" id="process">
      <div className="wrap">
        <div className="eyebrow">How implementation works</div>
        <h2 className="h2 bz-h2">From idea to <em>working system.</em></h2>
        <div className="bz-steps" ref={root}>
          <span className="bz-line" aria-hidden="true" />
          {STEPS.map(({ n, Icon, t, d }) => (
            <div className="bz-step" key={n}>
              <span className="bz-badge"><Icon size={18} /></span>
              <small>{n}</small>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── why ───────────────────────── */

export function BizWhy() {
  return (
    <section className="sec" id="why">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Why Counts AI</div>
          <h2 className="h2 bz-h2">Specialist agents, <em>engineered to fit.</em></h2>
        </Reveal>
        <div className="bz-why">
          {WHY.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 70}>
              <div className="bz-why-card">
                <span><Icon size={20} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── final CTA ───────────────────────── */

export function BizCta() {
  return (
    <section className="bz-cta-band" id="lets-talk">
      <div className="wrap bz-cta-in">
        <Reveal>
          <h2>Let&apos;s put AI to work <em>in your business.</em></h2>
          <p>Tell us what you&apos;re trying to improve. We&apos;ll help identify the right agent, integration or custom engineering approach.</p>
        </Reveal>
        <Reveal delay={100}>
          <div className="bz-ctas">
            <Link href="#contact" className="btn btn-light bz-primary">Discuss your project <ArrowRight size={14} /></Link>
            <Link href="#services" className="btn btn-light">Explore our agents</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
