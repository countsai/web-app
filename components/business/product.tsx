"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight, Check, Target, BrainCircuit, Zap, UserCheck, Users, Mail, CalendarDays, MessageSquare,
  FileText, Database, Blocks, PlugZap, Workflow, ShieldCheck, Search, Send, AlertCircle,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/home/reveal";
import "./product.css";

/* ───────────────────────── data ───────────────────────── */

export type AgentKey = "nexa" | "orion" | "lyra" | "vesta";

const AGENTS: {
  key: AgentKey; name: string; cat: string; c: string; img: string; purpose: string; caps: string[]; flow: [string, string][];
}[] = [
  { key: "nexa", name: "Nexa", cat: "Lead Generation", c: "#1E9BE0", img: "/images/agents/nexa.png",
    purpose: "Finds and qualifies prospects, drafts outreach and keeps your CRM organised, so sales teams spend their time on conversations.",
    caps: ["Prospect discovery", "Lead qualification", "Personalised outreach drafts", "CRM updates", "Pipeline organisation"],
    flow: [["New prospect", "Found and enriched"], ["Qualification", "Fit and intent scored"], ["Outreach draft", "Ready for review"], ["CRM record", "Created and updated"]] },
  { key: "orion", name: "Orion", cat: "Customer Service", c: "#E8833A", img: "/images/agents/orion.png",
    purpose: "Handles routine customer enquiries, drafts responses and routes the rest, with clear escalation to your people when it matters.",
    caps: ["Enquiry classification", "Response drafting", "Common-question handling", "Ticket routing", "Escalation to human staff"],
    flow: [["Customer enquiry", "Arrives by email or chat"], ["Intent detection", "Topic and urgency"], ["Suggested response", "Drafted from your knowledge"], ["Resolve or escalate", "Handed to a person if needed"]] },
  { key: "lyra", name: "Lyra", cat: "HR Management", c: "#2FA36B", img: "/images/agents/lyra.png",
    purpose: "Supports recruitment and everyday people operations by organising applications, onboarding tasks and HR documents.",
    caps: ["Candidate screening support", "Recruitment coordination", "Onboarding checklists", "HR document workflows", "Employee queries"],
    flow: [["Application", "Candidate applies"], ["Screening", "Matched to the role"], ["Onboarding tasks", "Checklist created"], ["HR record", "Documents filed"]] },
  { key: "vesta", name: "Vesta", cat: "Marketing Intelligence", c: "#7C5CE0", img: "/images/agents/vesta.png",
    purpose: "Plans campaigns, drafts content and turns performance data into practical recommendations for your marketing team.",
    caps: ["Campaign planning", "Content drafting", "Performance analysis", "Publishing coordination", "Optimisation recommendations"],
    flow: [["Campaign brief", "Goals and audience"], ["Content draft", "Copy for each channel"], ["Performance insights", "What is working"], ["Suggested improvements", "For your approval"]] },
];

const STAGES = [
  { Icon: Target, t: "Understand", d: "Understands the task and the business context behind it." },
  { Icon: BrainCircuit, t: "Reason", d: "Reasons using relevant instructions and information." },
  { Icon: Zap, t: "Act", d: "Takes action through connected tools and workflows." },
  { Icon: UserCheck, t: "Report", d: "Returns results, reports status or asks for human approval when required." },
];

const SYSTEMS = [
  { t: "CRM", Icon: Users }, { t: "Email", Icon: Mail }, { t: "Calendars", Icon: CalendarDays },
  { t: "Communication tools", Icon: MessageSquare }, { t: "Documents", Icon: FileText }, { t: "Databases", Icon: Database }, { t: "APIs", Icon: Blocks },
];

const ARCH = [
  { t: "Data connectors", d: "Connect to your business applications and information sources.", Icon: PlugZap },
  { t: "Agent orchestration", d: "Coordinates workflows, tool use and hand-offs.", Icon: Workflow },
  { t: "Business context", d: "Applies your instructions and workflow context.", Icon: BrainCircuit },
  { t: "Security, permissions and oversight", d: "Controlled access, with humans approving where needed.", Icon: ShieldCheck },
];

/* ───────────────────────── interface mock-ups (illustrative data) ───────────────────────── */

function Win({ title, c, children }: { title: string; c: string; children: React.ReactNode }) {
  return (
    <div className="pd-win" style={{ ["--ac" as string]: c }}>
      <div className="pd-bar"><i /><i /><i /><b>{title}</b></div>
      <div className="pd-body">{children}</div>
    </div>
  );
}

function NexaUI({ c }: { c: string }) {
  const col = (t: string, items: [string, string][]) => (
    <div className="pd-col"><h5>{t}</h5>{items.map(([n, s]) => <div className="pd-card" key={n}><b>{n}</b><small>{s}</small></div>)}</div>
  );
  return (
    <Win title="Lead pipeline" c={c}>
      <div className="pd-cols">
        {col("New", [["Northwind Ltd", "Retail · UK"], ["Brightwave Co", "SaaS · UAE"]])}
        {col("Qualified", [["Harbor & Co", "Score 82"], ["Kestrel Labs", "Score 76"]])}
        {col("Outreach", [["Meridian Group", "Draft ready"]])}
      </div>
      <div className="pd-panel"><h5>Outreach draft</h5><p>Hi Priya, I noticed Meridian is expanding its support team. Counts AI could help you…</p><div className="pd-actions"><span className="on"><Check size={11} /> Approve</span><span>Edit</span></div></div>
    </Win>
  );
}
function OrionUI({ c }: { c: string }) {
  return (
    <Win title="Support inbox" c={c}>
      <div className="pd-split">
        <div className="pd-list">
          {[["Order status", "Order"], ["Reset password", "Account"], ["Refund request", "Billing"]].map(([t, tag], i) => (
            <div className={`pd-li ${i === 2 ? "sel" : ""}`} key={t}><b>{t}</b><span>{tag}</span></div>
          ))}
        </div>
        <div className="pd-chat">
          <div className="pd-msg in">Hi, I was charged twice for my order.</div>
          <div className="pd-tagrow"><span>Intent: Billing</span><span>Priority: High</span></div>
          <div className="pd-msg out">Sorry about that. I can see the duplicate charge and have raised it with our billing team…</div>
          <div className="pd-actions"><span className="on"><Send size={11} /> Send</span><span><AlertCircle size={11} /> Escalate</span></div>
        </div>
      </div>
    </Win>
  );
}
function LyraUI({ c }: { c: string }) {
  return (
    <Win title="Recruitment and onboarding" c={c}>
      <div className="pd-split">
        <div className="pd-list">
          {[["A. Rahman", "Screened"], ["J. Okafor", "In review"], ["M. Silva", "Offer sent"]].map(([n, s], i) => (
            <div className={`pd-li ${i === 2 ? "sel" : ""}`} key={n}><b>{n}</b><span>{s}</span></div>
          ))}
        </div>
        <div className="pd-chat">
          <h5>Onboarding: M. Silva</h5>
          {["Contract signed", "IT access requested", "Policies shared", "First-week plan"].map((t, i) => (
            <div className="pd-check" key={t}><em className={i < 2 ? "on" : ""}>{i < 2 && <Check size={9} />}</em>{t}</div>
          ))}
          <div className="pd-prog"><b /></div>
        </div>
      </div>
    </Win>
  );
}
function VestaUI({ c }: { c: string }) {
  return (
    <Win title="Campaign workspace" c={c}>
      <div className="pd-split">
        <div className="pd-chat">
          <h5>Draft: Spring launch</h5>
          <p>Meet the new way to plan your week. Five minutes, one clear plan…</p>
          <div className="pd-tagrow"><span>Email</span><span>LinkedIn</span><span>Blog</span></div>
        </div>
        <div className="pd-chat">
          <h5>Channel performance</h5>
          <div className="pd-bars">{[40, 62, 48, 80, 66, 90].map((h, i) => <b key={i} style={{ height: `${h}%` }} />)}</div>
          <p className="pd-rec"><Search size={11} /> Suggestion: shift budget to the strongest channel</p>
        </div>
      </div>
    </Win>
  );
}
const UI = { nexa: NexaUI, orion: OrionUI, lyra: LyraUI, vesta: VestaUI };

/* ───────────────────────── hero ───────────────────────── */

export function ProductHero() {
  return (
    <section className="pd-hero">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">AI agents for business</div>
          <h1 className="pd-h1">Four AI agents.<br /><em>Built for real business work.</em></h1>
          <p className="lede" style={{ margin: "16px 0 24px", maxWidth: "58ch" }}>
            Four specialist agents that help your business automate tasks, connect workflows and make better use of the systems you already have.
          </p>
          <div className="pd-ctas">
            <a href="#contact" className="btn btn-dark">Add agents to your business <ArrowRight size={14} /></a>
            <a href="#agents" className="btn btn-ghost">Explore the agents</a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ul className="pd-team">
            {AGENTS.map((a) => (
              <li key={a.key} style={{ ["--ac" as string]: a.c }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.img} alt="" />
                <b>{a.name}</b>
                <small>{a.cat}</small>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── showcases ───────────────────────── */

export function AgentShowcases() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: (() => void)[] = [];
      el.querySelectorAll<HTMLElement>(".pd-flow").forEach((flow) => {
        const steps = Array.from(flow.querySelectorAll<HTMLElement>(".pd-step"));
        const fills = Array.from(flow.querySelectorAll<HTMLElement>(".pd-fill"));
        const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });
        gsap.set(fills, { scaleX: 0, transformOrigin: "0 50%" });
        tl.set(steps, { "--on": 0 } as gsap.TweenVars, 0);
        steps.forEach((s, i) => {
          tl.to(s, { "--on": 1, duration: 0.4, ease: "power2.out" } as gsap.TweenVars, i * 0.9);
          if (fills[i]) tl.to(fills[i], { scaleX: 1, duration: 0.7, ease: "none" }, i * 0.9 + 0.3);
        });
        tl.to({}, { duration: 0.9 });
        tl.to(fills, { scaleX: 0, duration: 0.01 }, ">");
        const st = ScrollTrigger.create({ trigger: flow, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
        if (st.isActive) tl.play();
        cleanups.push(() => { st.kill(); tl.kill(); });
      });
      return () => cleanups.forEach((c) => c());
    });
    return () => mm.revert();
  }, []);

  const quote = (name: string, cat: string) => () =>
    window.dispatchEvent(new CustomEvent("biz-agent", { detail: { name, cat } }));

  return (
    <div ref={root} id="services">
      <span id="agents" aria-hidden="true" />
      {AGENTS.map((a, i) => {
        const UIc = UI[a.key];
        return (
          <section key={a.key} className={`pd-show ${i % 2 ? "rev" : ""}`} style={{ ["--ac" as string]: a.c }} aria-labelledby={`pd-${a.key}`}>
            <div className="wrap pd-show-grid">
              <Reveal>
                <div className="pd-copy">
                  <span className="pd-tag">AI agent 0{i + 1} · {a.cat}</span>
                  <h2 id={`pd-${a.key}`} className="pd-h2">{a.name}<span>{a.cat}</span></h2>
                  <p>{a.purpose}</p>
                  <ul className="pd-caps">{a.caps.map((c) => <li key={c}>{c}</li>)}</ul>
                  <a href="#contact" className="btn btn-dark pd-quote" onClick={quote(a.name, a.cat)}>Get a quote <ArrowRight size={14} /></a>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="pd-demo">
                  <UIc c={a.c} />
                  <ol className="pd-flow" aria-label={`${a.name} workflow`}>
                    {a.flow.map(([t, s], k) => (
                      <li className="pd-step" key={t}>
                        <span className="pd-dot">{k + 1}</span>
                        <b>{t}</b><small>{s}</small>
                        {k < a.flow.length - 1 && <i className="pd-line"><i className="pd-fill" /></i>}
                      </li>
                    ))}
                  </ol>
                  <p className="pd-ill">Illustrative interface and sample data.</p>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ───────────────────────── how agents work ───────────────────────── */

export function HowAgentsWork() {
  const root = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const steps = Array.from(el.querySelectorAll<HTMLElement>(".pd-stage"));
      const fills = Array.from(el.querySelectorAll<HTMLElement>(".pd-sfill"));
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.5 });
      gsap.set(fills, { scaleX: 0, transformOrigin: "0 50%" });
      tl.set(steps, { "--on": 0 } as gsap.TweenVars, 0);
      steps.forEach((s, i) => {
        tl.to(s, { "--on": 1, duration: 0.5, ease: "power2.out" } as gsap.TweenVars, i * 1.1);
        if (fills[i]) tl.to(fills[i], { scaleX: 1, duration: 0.9, ease: "none" }, i * 1.1 + 0.3);
      });
      tl.to({}, { duration: 1.2 });
      tl.to(fills, { scaleX: 0, duration: 0.01 }, ">");
      const st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
      if (st.isActive) tl.play();
      return () => { st.kill(); tl.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="sec" id="how">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">How the agents work</div>
          <h2 className="h2 bz-h2">From instruction <em>to action.</em></h2>
        </Reveal>
        <ol className="pd-stages" ref={root}>
          {STAGES.map(({ Icon, t, d }, i) => (
            <li className="pd-stage" key={t}>
              <span className="pd-sico"><Icon size={20} /></span>
              <small>0{i + 1}</small>
              <h3>{t}</h3>
              <p>{d}</p>
              {i < STAGES.length - 1 && <i className="pd-sline"><i className="pd-sfill" /></i>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── integrations ───────────────────────── */

export function Integrations() {
  return (
    <section className="sec" id="integrations">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Business integrations</div>
          <h2 className="h2 bz-h2">Works with the systems <em>you already use.</em></h2>
          <p className="lede" style={{ margin: "12px 0 26px", maxWidth: "62ch" }}>
            Agents connect to your existing business systems, subject to integration availability and configuration.
          </p>
        </Reveal>
        <ul className="pd-sys">
          {SYSTEMS.map(({ t, Icon }) => <li key={t}><Icon size={20} /><span>{t}</span></li>)}
        </ul>
        <div className="pd-arch" role="list" aria-label="Platform architecture">
          {ARCH.map(({ t, d, Icon }, i) => (
            <div className="pd-arch-item" role="listitem" key={t}>
              <span><Icon size={18} /></span>
              <b>{t}</b>
              <small>{d}</small>
              {i < ARCH.length - 1 && <ArrowRight size={14} className="pd-arch-arrow" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── final CTA ───────────────────────── */

export function FinalCta() {
  return (
    <section className="bz-cta-band" id="lets-talk">
      <div className="wrap bz-cta-in">
        <Reveal>
          <h2>Ready to add AI agents <em>to your business?</em></h2>
          <p>Enquire about an individual agent, a combination of agents or tailored integrations. Tell us what you want to improve and we will suggest the right approach.</p>
        </Reveal>
        <Reveal delay={100}>
          <a href="#contact" className="btn btn-light bz-primary">Add agents to your business <ArrowRight size={14} /></a>
        </Reveal>
      </div>
    </section>
  );
}
