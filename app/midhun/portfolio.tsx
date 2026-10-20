"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Mail, Phone, GraduationCap, Briefcase, Award, BookOpen } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mono, navFont } from "@/components/home/fonts";
import "./midhun.css";

const ROLES = ["AI Engineer", "Forward Deployed Engineer", "AI Product Builder", "Researcher"];

const METRICS = [
  { v: 4.5, dec: 1, suf: "+", l: "Years in AI engineering and research" },
  { v: 15, dec: 0, suf: "+", l: "Clients supported" },
  { v: 100, dec: 0, suf: "+", l: "Students trained" },
  { v: 10, dec: 0, suf: "M+", l: "Records processed daily in data pipelines" },
];

const PROJECTS = [
  { name: "Adsoni", status: "Live", url: "https://adsoni.com", desc: "AI-powered marketing strategy and execution platform. Helps businesses plan, create and run marketing campaigns with AI.", tags: ["React", "Node.js", "AI Agents", "Analytics"] },
  { name: "Calmnus", status: "Pre-launch", url: "https://calmnus.com", desc: "Therapy marketplace with emotionally aware AI support.", tags: ["React Native", "Expo", "Supabase", "AI"] },
  { name: "Market Analyzer Agent", status: "Training Project", url: "", desc: "AI agent for market news, stocks and gold analytics.", tags: ["Python", "LangGraph", "Yahoo Finance"] },
];

const TIMELINE = [
  { kind: "work", date: "Apr 2025 – Present", org: "Counts AI Ltd", role: "Founder-Director", place: "London, UK", pts: [
    "Founded and lead an AI consultancy delivering AI engineering, product development and technical training.",
    "Work directly with clients on discovery, solution design, implementation, deployment and handover.",
    "Supported 15+ clients.", "Built AI products and agentic workflows.", "Led a team of two.", "Trained 100+ students."] },
  { kind: "edu", date: "Jan 2023 – May 2024", org: "Ravensbourne University London", role: "MSc Computer Science", place: "London, UK", pts: [
    "Research and development involving image generation and multimodal AI.", "Work involving SVM and image analysis models."] },
  { kind: "work", date: "Mar 2021 – Jul 2022", org: "UST Global", role: "Developer I, Software Engineering", place: "India", pts: [
    "Built Java Spring Boot microservices for real-time credit data analytics.", "Developed ETL pipelines processing 10M+ records per day.",
    "Worked with Docker and CI/CD.", "Received Best Rookie recognition in Q1."] },
  { kind: "work", date: "Sep 2020 – Feb 2021", org: "Tutorhere", role: "Technical Team Manager", place: "India", pts: [
    "Led a small technical team.", "Supported Java-based development and system delivery."] },
  { kind: "edu", date: "Jun 2016 – May 2020", org: "APJ Abdul Kalam Technological University", role: "BTech Computer Science and Engineering", place: "India", pts: [] },
];

const STACK = [
  { g: "Languages", i: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "PHP"] },
  { g: "AI and LLM systems", i: ["Retrieval-Augmented Generation (RAG)", "AWS Bedrock", "LangChain", "LangGraph", "Multi-agent systems", "Embeddings and vector databases", "LLM evaluation", "Fine-tuning", "OpenAI, Anthropic and Gemini APIs", "Multimodal AI"] },
  { g: "Backend and cloud", i: ["FastAPI", "Spring Boot", "REST APIs", "Microservices", "Docker", "Kubernetes", "AWS", "Google Cloud Platform", "Dataflow", "CI/CD", "Observability"] },
  { g: "Frontend and mobile", i: ["React", "Next.js", "React Native", "Expo", "Supabase", "Tailwind CSS"] },
];

const PUBS = [
  { t: "Imograph: Sentiment Analysis to Detect Stress and Behavior of Students and Employees Using EEG and SVM", j: "International Journal of Advances in Computer Science and Technology, July 2020" },
  { t: "Advanced Content Generation for E-learning Using Web Mining", j: "International Journal of Networks and Systems, April–May 2019" },
];

const CERTS = [
  { t: "AWS Certified Cloud Practitioner", d: "August 2025", by: "Amazon Web Services" },
  { t: "AI Agents Fundamentals and LLM Course", d: "July 2025", by: "Hugging Face" },
  { t: "Generative AI Fundamentals", d: "July 2025", by: "Databricks" },
];

export function Portfolio() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);

        // hero: prompt types, headline lines rise, role types, rest staggers
        const prompt = el.querySelector<HTMLElement>("[data-prompt]");
        const role = el.querySelector<HTMLElement>("[data-role]");
        const text = { n: 0 };
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (prompt) {
          prompt.textContent = "";
          tl.to(text, { n: 8, duration: 0.5, ease: "none", onUpdate: () => { prompt.textContent = "$ whoami".slice(0, Math.round(text.n)); } });
        }
        tl.from(q("[data-line] > span"), { yPercent: 110, duration: 0.8, stagger: 0.12 }, "-=0.1")
          .from(q("[data-fade]"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, "-=0.4")
          .from(q("[data-portrait]"), { opacity: 0, y: 24, duration: 0.9 }, "-=1.1");

        // role text: type each role in turn, then rotate (loop is slow and cheap)
        let roleTween: gsap.core.Timeline | null = null;
        if (role) {
          const state = { n: 0 };
          roleTween = gsap.timeline({ repeat: -1, delay: 1.8 });
          ROLES.forEach((r) => {
            roleTween!.set(state, { n: 0 })
              .to(state, { n: r.length, duration: Math.max(0.6, r.length * 0.045), ease: "none", onUpdate: () => { role.textContent = r.slice(0, Math.round(state.n)); } })
              .to({}, { duration: 1.6 })
              .to(state, { n: 0, duration: 0.35, ease: "none", onUpdate: () => { role.textContent = r.slice(0, Math.round(state.n)); } });
          });
        }

        // metrics: count up once
        q<HTMLElement>("[data-count]").forEach((n) => {
          const target = Number(n.dataset.count), dec = Number(n.dataset.dec);
          const o = { v: 0 };
          ScrollTrigger.create({
            trigger: n, start: "top 90%", once: true,
            onEnter: () => {
              n.textContent = (0).toFixed(dec);
              gsap.to(o, { v: target, duration: 1.4, ease: "power2.out", onUpdate: () => { n.textContent = o.v.toFixed(dec); } });
            },
          });
        });

        // generic section reveals
        ScrollTrigger.batch(q("[data-reveal]"), {
          start: "top 88%", once: true,
          onEnter: (b) => gsap.from(b, { opacity: 0, y: 24, duration: 0.7, stagger: 0.1, ease: "power2.out", overwrite: true }),
        });

        // timeline
        gsap.fromTo(q(".md-line-fill"), { scaleY: 0 }, {
          scaleY: 1, ease: "none", transformOrigin: "top",
          scrollTrigger: { trigger: q(".md-tl")[0], start: "top 70%", end: "bottom 70%", scrub: 0.4 },
        });

        return () => { roleTween?.kill(); };
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <main className={`md ${mono.variable} ${navFont.variable}`} ref={root}>
      {/* hero */}
      <section className="md-hero" id="top">
        <div className="md-wrap md-hero-grid">
          <div>
            <p className="md-prompt" aria-hidden="true"><span data-prompt>$ whoami</span><i /></p>
            <h1 aria-label="I build AI systems that work in the real world.">
              <span className="md-line" data-line aria-hidden="true"><span>I build <em>AI systems</em></span></span>
              <span className="md-line" data-line aria-hidden="true"><span>that work in the</span></span>
              <span className="md-line" data-line aria-hidden="true"><span><em>real world.</em></span></span>
            </h1>
            <p className="md-roles" data-fade>
              <span className="sr-only">{ROLES.join(", ")}</span>
              <span aria-hidden="true" className="md-role-box">&gt; <b data-role>{ROLES[0]}</b><i /></span>
            </p>
            <p className="md-intro" data-fade>
              I&apos;m Midhun Mahesan, Founder &amp; Director at Counts AI. I design, build and deploy production AI systems, from RAG and agentic workflows to multimodal products.
            </p>
            <div className="md-ctas" data-fade>
              <a href="#work" className="md-btn primary">Explore my work <ArrowRight size={15} /></a>
              <a href="#contact" className="md-btn">Let&apos;s build something</a>
            </div>
            <div className="md-links" data-fade>
              <a href="mailto:midhun@countsai.com" aria-label="Email Midhun"><Mail size={17} /></a>
              <a href="tel:+447384050895" aria-label="Call Midhun"><Phone size={17} /></a>
              <a href="https://adsoni.com" target="_blank" rel="noopener noreferrer" aria-label="Adsoni">Adsoni <ArrowUpRight size={13} /></a>
            </div>
          </div>
          <figure className="md-portrait" data-portrait>
            <div className="md-photo">
              <Image src="/images/midhun.jpg" alt="Midhun Mahesan, Founder and Director of Counts AI" width={640} height={641} priority sizes="(max-width: 900px) 80vw, 460px" />
            </div>
            <figcaption><b>Midhun Mahesan</b><span>Founder &amp; Director, Counts AI</span></figcaption>
            <code className="md-tag a" aria-hidden="true">role: &quot;founder&quot;</code>
          </figure>
        </div>
      </section>

      {/* metrics */}
      <section className="md-metrics" aria-label="Impact metrics">
        <ul className="md-wrap">
          {METRICS.map((m) => (
            <li key={m.l} data-reveal>
              <b><span data-count={m.v} data-dec={m.dec}>{m.v.toFixed(m.dec)}</span>{m.suf}</b>
              <small>{m.l}</small>
            </li>
          ))}
        </ul>
      </section>

      {/* projects */}
      <section className="md-sec" id="work">
        <div className="md-wrap">
          <p className="md-eyebrow" data-reveal>SELECTED WORK</p>
          <h2 data-reveal>AI products and platforms for real problems.</h2>
          <p className="md-lede" data-reveal>From idea to production: building AI products, automations and platforms for businesses and learners.</p>
          <div className="md-projects">
            {PROJECTS.map((p) => (
              <article key={p.name} className="md-proj" data-reveal>
                <div className="md-proj-top">
                  <span className={`md-status ${p.status === "Live" ? "live" : ""}`}>{p.status}</span>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${p.name}`}><ArrowUpRight size={18} /></a>}
                </div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="md-link">{p.url.replace("https://", "")} <ArrowUpRight size={13} /></a>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* experience */}
      <section className="md-sec" id="experience">
        <div className="md-wrap">
          <p className="md-eyebrow" data-reveal>EXPERIENCE &amp; EDUCATION</p>
          <h2 data-reveal>A journey across industry, research and learning.</h2>
          <p className="md-lede" data-reveal>Building AI systems. Leading teams. Supporting clients and contributing to research.</p>
          <ol className="md-tl">
            <span className="md-line-bg" aria-hidden="true"><span className="md-line-fill" /></span>
            {TIMELINE.map((t) => (
              <li key={t.org} className={t.kind} data-reveal>
                <span className="md-node" aria-hidden="true">{t.kind === "work" ? <Briefcase size={14} /> : <GraduationCap size={14} />}</span>
                <div className="md-card">
                  <p className="md-date">{t.date} · {t.place}</p>
                  <h3>{t.role}</h3>
                  <p className="md-org">{t.org}</p>
                  {t.pts.length > 0 && <ul>{t.pts.map((x) => <li key={x}>{x}</li>)}</ul>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* toolkit */}
      <section className="md-sec" id="toolkit">
        <div className="md-wrap">
          <p className="md-eyebrow" data-reveal>TOOLKIT</p>
          <h2 data-reveal>Engineering toolkit</h2>
          <p className="md-lede" data-reveal>Languages, frameworks and tools I work with.</p>
          <div className="md-stack">
            {STACK.map((s) => (
              <div key={s.g} className="md-panel" data-reveal>
                <h3><span>{"//"}</span> {s.g}</h3>
                <ul>{s.i.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* research + certs */}
      <section className="md-sec" id="research">
        <div className="md-wrap md-two">
          <div>
            <p className="md-eyebrow" data-reveal>RESEARCH</p>
            <h2 data-reveal>Research &amp; publications</h2>
            <div className="md-res" data-reveal>
              <p className="md-date">Jan 2023 – May 2024</p>
              <h3>Ravensbourne University London</h3>
              <p>Researcher working with image generation, multimodal AI, SVM and image analysis.</p>
            </div>
            <div className="md-res" data-reveal>
              <p className="md-date">Aug 2018 – May 2019</p>
              <h3>KTU, India</h3>
              <p>Undergraduate research involving EEG-based sentiment and stress analysis using machine learning.</p>
            </div>
            <ol className="md-pubs">
              {PUBS.map((p) => (
                <li key={p.t} data-reveal><BookOpen size={16} /><div><b>&ldquo;{p.t}&rdquo;</b><small>{p.j}</small></div></li>
              ))}
            </ol>
          </div>
          <div>
            <p className="md-eyebrow" data-reveal>CREDENTIALS</p>
            <h2 data-reveal>Certifications &amp; learning</h2>
            <ul className="md-certs">
              {CERTS.map((c) => (
                <li key={c.t} data-reveal><Award size={18} /><div><b>{c.t}</b><small>{c.by} · {c.d}</small></div></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* contact */}
      <section className="md-contact" id="contact">
        <div className="md-wrap">
          <p className="md-eyebrow" data-reveal>LET&apos;S WORK TOGETHER</p>
          <h2 data-reveal>Have a difficult AI problem? Let&apos;s build it.</h2>
          <p className="md-lede" data-reveal>I work with businesses, teams and individuals to design, build and deploy AI systems that create real impact.</p>
          <ul className="md-contacts">
            <li data-reveal><Mail size={17} /><a href="mailto:midhun@countsai.com">midhun@countsai.com</a></li>
            <li data-reveal><Mail size={17} /><a href="mailto:midhunmahes@gmail.com">midhunmahes@gmail.com</a></li>
            <li data-reveal><Phone size={17} /><a href="tel:+447384050895">+44 7384050895</a></li>
          </ul>
          <div className="md-ctas" data-reveal>
            <a href="mailto:midhun@countsai.com" className="md-btn primary">Email me <ArrowRight size={15} /></a>
            <a href="/for-businesses#contact" className="md-btn">Counts AI enquiry</a>
          </div>
        </div>
      </section>
    </main>
  );
}
