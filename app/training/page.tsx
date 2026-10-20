"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { Reveal } from "@/components/home/reveal";
import { CareerOutcomes, CertNote, EmployerStrip } from "@/components/home/academy";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import "./training.css";
import {
  ArrowRight, Brain, Wrench, Rocket, Globe, Code2, Users, ChevronDown, ShieldCheck,
} from "lucide-react";

const MONTHS = [
  {
    id: "month1", n: "01", label: "Month One", cert: "GenAI & Agentic AI", c: "#0F9AA6", tint: "#DDF1EE",
    title: "Generative AI & Agentic AI",
    desc: "Focus on modern AI engineering. Learn to build with the most capable AI models and develop real applications using agents, RAG, and agentic workflows.",
    groups: [
      ["Foundations", ["Generative AI fundamentals", "Large Language Models (LLMs)", "Prompt engineering", "OpenAI, Claude & Gemini APIs"]],
      ["Retrieval", ["RAG (Retrieval-Augmented Generation)", "Embeddings & vector databases"]],
      ["Agents", ["AI agents & agentic workflows", "Tool calling & function calling", "Multi-agent systems"]],
      ["Applications", ["AI application development", "AI automation pipelines", "Evaluation & responsible AI"]],
    ] as [string, string[]][],
    outcome: "Build working AI applications from scratch. GenAI certificate issued.",
  },
  {
    id: "month2", n: "02", label: "Month Two", cert: "Forward Deployed Engineering", c: "#0A5963", tint: "#D6EAEA", popular: true,
    title: "Forward Deployed Engineering",
    desc: "Learn to take AI technology and deploy it into real business environments. A unique blend of software engineering, AI engineering, solutions engineering, and consulting.",
    groups: [
      ["Discovery & design", ["Customer problem discovery", "Technical solution design"]],
      ["Build", ["AI integrations & APIs", "Backend development", "Frontend integration", "Databases & storage"]],
      ["Deploy", ["Cloud deployment & Docker", "Production AI systems"]],
      ["Business", ["AI agents in business workflows", "Business automation", "Working with clients", "Technical communication"]],
    ] as [string, string[]][],
    outcome: "Deploy AI into real businesses. FDE certificate issued.",
  },
  {
    id: "month3", n: "03", label: "Month Three", cert: "FDE Internship", c: "#3E9B73", tint: "#DAEEE2",
    title: "Counts AI Remote Internship",
    desc: "Put your skills to work. Students contribute to real projects remotely with the Counts AI UK team: AI applications, agents, automation, and software engineering.",
    groups: [
      ["Projects", ["AI application projects", "AI agent development", "Internal tooling", "Client projects (where appropriate)"]],
      ["Engineering", ["AI research & experimentation", "Software engineering", "Product development", "Remote collaboration"]],
    ] as [string, string[]][],
    outcome: "Real remote work experience with a UK AI consultancy. Internship certificate issued.",
  },
];

const OUTCOMES = [
  { icon: Brain, t: "AI engineering fundamentals", d: "Deep understanding of modern AI engineering." },
  { icon: Code2, t: "Hands-on projects", d: "Experience building AI applications and agents." },
  { icon: Wrench, t: "Practical deployment", d: "Skills deploying AI into real business environments." },
  { icon: Rocket, t: "Remote team experience", d: "Remote work with a UK-based AI consultancy." },
  { icon: Globe, t: "Portfolio development", d: "A portfolio of real projects to show employers." },
  { icon: Users, t: "Professional network", d: "A network of AI professionals and engineers." },
];

const FAQS = [
  { q: "Who is this program for?", a: "Students, recent graduates, and career changers who want to build practical AI engineering skills and gain real work experience. No prior AI experience is required — but basic programming knowledge is helpful." },
  { q: "Is this program remote?", a: "Yes. The program is fully remote. Month 3 (the internship) is conducted remotely with the Counts AI UK team." },
  { q: "What happens after the program?", a: "Graduates receive a program completion certificate and a reference from Counts AI. Many use their portfolio and experience to apply for AI engineering roles through the Counts AI Jobs platform." },
  { q: "Is there a cost?", a: "Program fees and cohort details are shared after your application is reviewed. Apply to receive full program information." },
  { q: "When does the next cohort start?", a: "Cohorts run on a rolling basis. Apply now and we'll confirm your start date after reviewing your application." },
];

export default function TrainingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openMonth, setOpenMonth] = useState<Record<string, boolean>>({ month1: true, month2: true, month3: true });

  return (
    <div className={`ch tr ${serif.variable} ${mono.variable} ${display.variable}`}>
      <PublicNavbar active="AI Programs" />

      {/* hero */}
      <section className="tr-hero">
        <div className="wrap tr-hero-grid">
          <Reveal>
            <div className="eyebrow">Counts AI Academy</div>
            <h1 className="tr-h1">3 Months. <em>Real AI Skills.</em> <em>Real Experience.</em></h1>
            <p className="lede" style={{ margin: "18px 0 24px", maxWidth: "50ch" }}>
              A fully remote, three-month programme: generative AI and agents, forward deployed engineering, and a remote internship with the Counts AI UK team.
            </p>
            <div className="tr-ctas">
              <Link href="/training/apply" className="btn btn-dark">Apply Now <ArrowRight size={14} /></Link>
              <a href="#program" className="btn btn-ghost">View Programme</a>
            </div>
            <ul className="tr-facts">
              <li><b>100%</b><span>Guaranteed internship</span></li>
              <li><b>840+</b><span>Students enrolled</span></li>
              <li><b>90%</b><span>Students double their salary</span></li>
              <li><b>3</b><span>Verifiable certificates from a leading London AI consultancy</span></li>
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="tr-photo" role="img" aria-label="Two engineers collaborating on an AI project in a bright London office" />
          </Reveal>
        </div>
      </section>

      {/* outcomes */}
      <section className="sec" id="outcomes">
        <div className="wrap tr-outcomes">
          <CareerOutcomes />
          <CertNote />
          <EmployerStrip />
        </div>
      </section>

      {/* benefits */}
      <section className="sec">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Why join the programme</div>
            <h2 className="h2 tr-h2">What you take <em>away.</em></h2>
          </Reveal>
          <div className="tr-ben">
            {OUTCOMES.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 50}>
                <div className="tr-ben-card"><span><Icon size={20} /></span><h3>{t}</h3><p>{d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* stages */}
      <section className="sec" id="certs">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">The programme</div>
            <h2 className="h2 tr-h2">Three stages, <em>three certificates.</em></h2>
            <p className="lede" style={{ marginTop: 12 }}>Each certificate is issued on completion of its month and can be checked on our <Link href="/verify" className="tr-link">verification page</Link>.</p>
          </Reveal>
          <ol className="tr-stages">
            {MONTHS.map((m, i) => (
              <li key={m.id} style={{ ["--ac" as string]: m.c, ["--tint" as string]: m.tint }}>
                <a href={`#${m.id}`} className={`tr-stage ${m.popular ? "pop" : ""}`}>
                  {m.popular && <span className="tr-pop">Core stage</span>}
                  <span className="tr-num">{m.n}</span>
                  <small>{m.label}</small>
                  <h3>{m.cert}</h3>
                  <p>{m.outcome.split(".")[0]}.</p>
                </a>
                {i < MONTHS.length - 1 && <ArrowRight className="tr-arrow" size={18} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* curriculum */}
      <section className="sec" id="program">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Curriculum</div>
            <h2 className="h2 tr-h2">What you&apos;ll learn <em>and build.</em></h2>
          </Reveal>
          <div className="tr-months">
            {MONTHS.map((m) => {
              const open = openMonth[m.id];
              return (
                <Reveal key={m.id}>
                  <article id={m.id} className="tr-month" style={{ ["--ac" as string]: m.c, ["--tint" as string]: m.tint }}>
                    <button
                      type="button"
                      className="tr-month-h"
                      aria-expanded={open}
                      aria-controls={`${m.id}-body`}
                      onClick={() => setOpenMonth((s) => ({ ...s, [m.id]: !s[m.id] }))}
                    >
                      <span className="tr-num">{m.n}</span>
                      <span className="tr-month-t"><small>{m.label}</small><b>{m.title}</b></span>
                      <ChevronDown size={18} className={open ? "rot" : ""} aria-hidden="true" />
                    </button>
                    {open && (
                      <div id={`${m.id}-body`} className="tr-month-b">
                        <p>{m.desc}</p>
                        <div className="tr-groups">
                          {m.groups.map(([g, items]) => (
                            <div key={g}>
                              <h4>{g}</h4>
                              <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
                            </div>
                          ))}
                        </div>
                        <p className="tr-outcome"><ShieldCheck size={15} /> Outcome: {m.outcome}</p>
                      </div>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="sec" id="faq">
        <div className="wrap tr-faq-wrap">
          <Reveal>
            <div className="eyebrow">FAQ</div>
            <h2 className="h2 tr-h2">Common <em>questions.</em></h2>
          </Reveal>
          <div className="tr-faq">
            {FAQS.map((f, i) => (
              <div key={f.q} className={`tr-q ${openFaq === i ? "on" : ""}`}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} aria-controls={`faq-${i}`}>
                  <span>{f.q}</span>
                  <ChevronDown size={16} className={openFaq === i ? "rot" : ""} aria-hidden="true" />
                </button>
                {openFaq === i && <p id={`faq-${i}`}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* apply */}
      <section className="tr-cta" aria-labelledby="tr-cta-title">
        <div className="wrap tr-cta-in">
          <div className="tr-cta-copy">
            <h2 id="tr-cta-title">Ready to start <em>your AI career?</em></h2>
            <p>Join our next cohort and gain hands-on experience building real AI applications with the Counts AI UK team.</p>
            <div className="tr-cta-btns">
              <Link href="/training/apply" className="btn btn-light tr-apply">Apply Now <ArrowRight size={14} /></Link>
              <a href="#program" className="btn btn-light">View Programme</a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
