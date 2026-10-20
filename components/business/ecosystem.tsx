"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users, Mail, CalendarDays, MessageSquare, FileText, Database, ListChecks, Blocks,
  PlugZap, Workflow, BrainCircuit, ShieldCheck, Check, type LucideIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./eco.css";

/* ───────────────────────── data ───────────────────────── */

type Agent = {
  key: string; n: string; name: string; cat: string; c: string; img: string; outcome: string; outcomeDesc: string;
  tasks: string[]; caps: string; blurb: string;
};

const AGENTS: Agent[] = [
  { key: "nexa", n: "01", name: "Nexa", cat: "Lead Generation", c: "#1E9BE0", img: "/images/agents/nexa.png",
    tasks: ["Find prospects", "Qualify leads", "Personalise outreach", "Update CRM"],
    caps: "Finds prospects, qualifies leads, drafts personalised outreach and keeps the CRM up to date.",
    blurb: "Nexa finds opportunities and helps sales teams move prospects through the pipeline.",
    outcome: "More qualified opportunities", outcomeDesc: "Help sales teams identify and progress relevant prospects." },
  { key: "orion", n: "02", name: "Orion", cat: "Customer Service", c: "#E8833A", img: "/images/agents/orion.png",
    tasks: ["Answer enquiries", "Resolve issues", "Route tickets", "Handover to team"],
    caps: "Answers enquiries, classifies and routes tickets, resolves routine issues and hands over to staff when needed.",
    blurb: "Orion keeps support fast and consistent, with a human in the loop for anything complex.",
    outcome: "Better customer experiences", outcomeDesc: "Improve response speed and support consistency." },
  { key: "lyra", n: "03", name: "Lyra", cat: "HR Management", c: "#2FA36B", img: "/images/agents/lyra.png",
    tasks: ["Screen candidates", "Onboard employees", "HR support", "Manage documents"],
    caps: "Screens candidates, coordinates recruitment, onboards employees and organises HR documents.",
    blurb: "Lyra reduces administrative work so people teams can focus on people.",
    outcome: "Stronger teams", outcomeDesc: "Streamline recruitment and employee administration." },
  { key: "vesta", n: "04", name: "Vesta", cat: "Marketing Intelligence", c: "#7C5CE0", img: "/images/agents/vesta.png",
    tasks: ["Plan campaigns", "Create content", "Analyse performance", "Publish across channels"],
    caps: "Plans campaigns, generates content, analyses performance and coordinates publishing.",
    blurb: "Vesta helps marketing teams plan, execute and improve campaigns using data.",
    outcome: "Smarter marketing", outcomeDesc: "Turn campaign data into more informed decisions." },
];

const SYSTEMS: { t: string; Icon: LucideIcon; d: string }[] = [
  { t: "CRM", Icon: Users, d: "Agents read and update customer and pipeline records." },
  { t: "Email", Icon: Mail, d: "Agents draft, send and triage messages in your inboxes." },
  { t: "Calendar", Icon: CalendarDays, d: "Agents schedule meetings and keep availability in sync." },
  { t: "Communication", Icon: MessageSquare, d: "Agents work inside the chat and support channels your team already uses." },
  { t: "Documents", Icon: FileText, d: "Agents retrieve and organise documents and knowledge." },
  { t: "Databases", Icon: Database, d: "Agents query structured business data through controlled connections." },
  { t: "Project tools", Icon: ListChecks, d: "Agents create and update tasks in your project tooling." },
  { t: "Other apps and APIs", Icon: Blocks, d: "Custom integrations connect the remaining tools in your stack." },
];

const MODULES: { t: string; d: string; Icon: LucideIcon; c: string }[] = [
  { t: "Data Connectors", d: "Secure connections to business applications and information sources.", Icon: PlugZap, c: "#1E9BE0" },
  { t: "Agent Orchestration", d: "Coordinates workflows, tool usage and hand-offs between tasks.", Icon: Workflow, c: "#7C5CE0" },
  { t: "Business Context", d: "Uses relevant business information, instructions and workflow context.", Icon: BrainCircuit, c: "#2FA36B" },
  { t: "Security & Governance", d: "Supports controlled access, permissions and appropriate oversight.", Icon: ShieldCheck, c: "#D98A3D" },
];

/* ───────────────────────── mini workspaces (illustrative) ───────────────────────── */

function Mini({ k, c }: { k: string; c: string }) {
  if (k === "nexa")
    return (
      <div className="eco-mini">
        <svg viewBox="0 0 120 56" className="eco-chart" aria-hidden="true"><path className="eco-draw" d="M4 48L26 38L48 42L70 24L92 28L116 8" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} /><path d="M4 48L26 38L48 42L70 24L92 28L116 8V56H4Z" fill={c} opacity=".12" /></svg>
        {[0, 1, 2].map((i) => <div key={i} className="eco-row"><i style={{ background: c }} /><span /><b style={{ background: c, opacity: 0.25 + i * 0.2 }} /></div>)}
      </div>
    );
  if (k === "orion")
    return (
      <div className="eco-mini">
        <div className="eco-bub in"><span /><span /></div>
        <div className="eco-bub out" style={{ background: c }}><span /><span /></div>
        <div className="eco-bub in"><span /></div>
        <div className="eco-tags"><i style={{ background: c }}>Resolved</i><i>Routed</i></div>
      </div>
    );
  if (k === "lyra")
    return (
      <div className="eco-mini">
        {["Profile screened", "Documents received", "Onboarding set up"].map((t, i) => (
          <div className="eco-row" key={t}><em style={{ background: i < 2 ? c : "transparent", borderColor: c }}>{i < 2 && <Check size={9} color="#fff" />}</em><span className="eco-t">{t}</span></div>
        ))}
        <div className="eco-prog"><b className="eco-bar" style={{ background: c }} /></div>
      </div>
    );
  return (
    <div className="eco-mini">
      <div className="eco-bars" aria-hidden="true">{[40, 64, 48, 82, 60, 92].map((h, i) => <b key={i} className="eco-barv" style={{ height: `${h}%`, background: c, opacity: 0.4 + i * 0.1 }} />)}</div>
      <div className="eco-tags"><i style={{ background: c }}>Email</i><i>Social</i><i>Web</i></div>
    </div>
  );
}

function Outcome({ k, c }: { k: string; c: string }) {
  if (k === "nexa") return <svg viewBox="0 0 90 34" className="eco-ov" aria-hidden="true"><path className="eco-draw" d="M2 30L20 24L38 26L56 14L74 16L88 4" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" pathLength={1} /></svg>;
  if (k === "orion") return <div className="eco-ov dots" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ background: c, opacity: i < 4 ? 1 : 0.25 }} />)}</div>;
  if (k === "lyra") return <div className="eco-ov prog" aria-hidden="true"><b className="eco-bar" style={{ background: c }} /></div>;
  return <div className="eco-ov bars" aria-hidden="true">{[35, 55, 45, 80, 65, 95].map((h, i) => <b key={i} className="eco-barv" style={{ height: `${h}%`, background: c }} />)}</div>;
}

/* ───────────────────────── component ───────────────────────── */

export function BizEcosystem() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [sys, setSys] = useState<number | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add({ ok: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 1101px)" }, (ctx) => {
      const { wide } = ctx.conditions as { ok: boolean; wide: boolean };
      const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));

      // 1. entrance (once)
      const intro = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true }, defaults: { ease: "power2.out" } });
      intro.from(".eco-env", { opacity: 0, y: 24, duration: 0.7, stagger: 0.12 })
        .from(".eco-task", { opacity: 0, x: -10, duration: 0.4, stagger: 0.04 }, "-=0.5")
        .from(".eco-mini", { opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.1 }, "-=0.6")
        .fromTo(".eco-p", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.12, ease: "power1.out" }, "-=0.2")
        .from(".eco-sys", { opacity: 0, y: 10, duration: 0.4, stagger: 0.05 }, "-=0.8")
        .from(".eco-infra", { opacity: 0, y: 14, duration: 0.6 }, "-=0.3")
        .from(".eco-out", { opacity: 0, y: 14, duration: 0.5, stagger: 0.1 }, "-=0.2")
        .fromTo(".eco-draw", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.15 }, "-=0.4")
        .from(".eco-bar", { scaleX: 0, transformOrigin: "0 50%", duration: 0.9 }, "<")
        .from(".eco-barv", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.6, stagger: 0.05 }, "<");

      // 2. ambient (paused off-screen)
      const loop = gsap.timeline({ paused: true });
      loop.add(gsap.to(q(".eco-robot"), { y: -5, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.5 }), 0);
      loop.add(gsap.to(q(".eco-glow"), { opacity: 1, duration: 0.7, repeat: -1, yoyo: true, repeatDelay: 1.6, ease: "sine.inOut", stagger: { each: 0.9 } }), 0.5);
      if (wide) {
        q<SVGPathElement>(".eco-p").forEach((p, i) => {
          const dot = q<SVGCircleElement>(".eco-d")[i];
          if (!dot) return;
          const len = p.getTotalLength(), o = { t: 0 };
          const t = gsap.timeline({ repeat: -1, repeatDelay: 0.8 + (i % 4) * 0.35 });
          t.fromTo(o, { t: 0 }, { t: 1, duration: 1.7 + (i % 3) * 0.3, ease: "sine.inOut",
            onUpdate: () => { const pt = p.getPointAtLength(o.t * len); dot.setAttribute("cx", String(pt.x)); dot.setAttribute("cy", String(pt.y)); } }, 0);
          t.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0).to(dot, { opacity: 0, duration: 0.25 }, ">-0.25");
          loop.add(t, 0.4 + i * 0.35);
        });
      }
      loop.add(gsap.to(q(".eco-mod"), { "--lit": 1, duration: 0.6, repeat: -1, yoyo: true, repeatDelay: 1.4, ease: "sine.inOut", stagger: 0.7 } as gsap.TweenVars), 0.6);
      const st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? loop.play() : loop.pause()) });
      if (st.isActive) loop.play();
      return () => { st.kill(); intro.kill(); loop.kill(); };
    });
    return () => mm.revert();
  }, []);

  const A = AGENTS[active];
  const px = [12.5, 37.5, 62.5, 87.5];
  const targets = [16, 40, 62, 86];

  return (
    <section className="sec eco" id="platform" ref={root} aria-labelledby="eco-title">
      <div className="wrap">
        <div className="eco-head">
          <div className="eyebrow">How it works together</div>
          <h2 id="eco-title" className="h2 bz-h2">Your systems. Four agents. <em>Real outcomes.</em></h2>
          <p className="lede">Each agent does a distinct job, works inside the tools you already use, and shares one intelligence layer. Select an agent to see what it does.</p>
        </div>

        {/* agents */}
        <div className="eco-envs" role="tablist" aria-label="Counts AI agents">
          {AGENTS.map((a, i) => (
            <div
              key={a.key}
              role="tab"
              tabIndex={0}
              aria-selected={i === active}
              aria-controls="eco-detail"
              className={`eco-env ${i === active ? "on" : ""}`}
              style={{ ["--ac" as string]: a.c }}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}
            >
              <span className="eco-tag">AI AGENT {a.n}</span>
              <h3>{a.name}</h3>
              <p className="eco-cat">{a.cat}</p>
              <div className="eco-stage">
                <ul className="eco-tasks">{a.tasks.map((t) => <li key={t} className="eco-task">{t}</li>)}</ul>
                <div className="eco-work"><Mini k={a.key} c={a.c} /></div>
                <span className="eco-glow" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="eco-robot" src={a.img} alt={`${a.name}, the ${a.cat} agent`} loading="lazy" />
                <span className="eco-plat" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        <div id="eco-detail" className="eco-detail" role="tabpanel" aria-live="polite" style={{ ["--ac" as string]: A.c }}>
          <b>{A.name}</b> <span>{A.blurb}</span> <em>{A.caps}</em>
        </div>

        {/* connectors: agents -> systems */}
        <svg className="eco-links" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {AGENTS.map((a, i) => (
            <g key={a.key} opacity={i === active ? 1 : 0.45}>
              <path className="eco-p" d={`M${px[i] * 10} 0 C ${px[i] * 10} 40, ${targets[i] * 10} 36, ${targets[i] * 10} 80`} fill="none" stroke={a.c} strokeWidth={i === active ? 3 : 2} pathLength={1} strokeDasharray="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <circle className="eco-d" r="4" fill={a.c} opacity="0" cx={px[i] * 10} cy="0" />
            </g>
          ))}
        </svg>

        {/* business systems */}
        <div className="eco-row-label">Your business systems</div>
        <ul className="eco-systems">
          {SYSTEMS.map(({ t, Icon }, i) => (
            <li key={t}>
              <button type="button" className={`eco-sys ${sys === i ? "on" : ""}`} aria-pressed={sys === i} onClick={() => setSys(sys === i ? null : i)}>
                <Icon size={20} /><span>{t}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="eco-sys-note" aria-live="polite">{sys !== null ? SYSTEMS[sys].d : "Agents work with your existing tools rather than as isolated chatbots."}</p>

        {/* infrastructure */}
        <div className="eco-row-label">Shared intelligence layer</div>
        <div className="eco-infra">
          <span className="eco-stream" aria-hidden="true" />
          {MODULES.map(({ t, d, Icon, c }) => (
            <div className="eco-mod" key={t} style={{ ["--mc" as string]: c }}>
              <span><Icon size={18} /></span>
              <b>{t}</b>
              <small>{d}</small>
            </div>
          ))}
        </div>

        {/* outcomes */}
        <svg className="eco-links down" viewBox="0 0 1000 50" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {AGENTS.map((a, i) => <path key={a.key} className="eco-p" d={`M${px[i] * 10} 0 V50`} stroke={a.c} strokeWidth="2.5" fill="none" pathLength={1} strokeDasharray="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={i === active ? 1 : 0.4} />)}
        </svg>
        <div className="eco-row-label">Business outcomes</div>
        <div className="eco-outs">
          {AGENTS.map((a, i) => (
            <div key={a.key} className={`eco-out ${i === active ? "on" : ""}`} style={{ ["--ac" as string]: a.c }}>
              <div><b>{a.outcome}</b><small>{a.outcomeDesc}</small></div>
              <Outcome k={a.key} c={a.c} />
            </div>
          ))}
        </div>
        <p className="eco-fine">Workspaces and charts are illustrative visualisations, not measured results.</p>
      </div>
    </section>
  );
}
