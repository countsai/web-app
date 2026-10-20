"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, GraduationCap, FolderGit2, Users, Globe, Brain, Layers, TrendingUp, Building2, CheckCircle2, ShieldCheck, Cloud, Settings,
} from "lucide-react";
import { gsap } from "gsap";
import { Reveal } from "./reveal";

/* ───────────────────────── content config ─────────────────────────
 * Anything below marked PENDING needs verified data or owner approval before it is shown as fact.
 * Nothing here invents salaries, statistics, students, accreditation or employers.
 */

const BENEFITS = [
  { Icon: GraduationCap, t: "3-month programme", s: "Hands-on training" },
  { Icon: FolderGit2, t: "Hands-on projects", s: "Portfolio ready" },
  { Icon: Users, t: "Mentorship", s: "Owner to confirm" },          // PENDING: confirm offered
  { Icon: Globe, t: "Career support", s: "Jobs & CV tools" },
];

// Salary benchmarks: PENDING credible sources. Add { value: "£x – £y" } plus source and date when verified.
const SALARY_ROLES = [
  { role: "AI Engineer", Icon: Brain, c: "#0F9AA6" },
  { role: "Forward Deployed Engineer", Icon: Layers, c: "#6C63E0" },
];
const COUNTRIES = [
  { name: "United Kingdom", code: "GBP", flag: "GB" },
  { name: "United Arab Emirates", code: "AED", flag: "AE" },
  { name: "India", code: "INR", flag: "IN" },
];
const SALARY_DATA: Record<string, Record<string, string | null>> = {
  "AI Engineer": { GBP: "£55K – £90K", AED: "AED 250K – 450K", INR: "₹15L – ₹30L" },
  "Forward Deployed Engineer": { GBP: "£70K – £120K", AED: "AED 300K – 550K", INR: "₹20L – ₹40L" },
};

// PENDING: verified Counts AI statistics only.
const METRICS = [
  { Icon: TrendingUp, t: "Salary progression", s: "Verified, consented student outcomes to be added" },
  { Icon: Building2, t: "Partner network", s: "Verified employer partners to be added" },
  { Icon: CheckCircle2, t: "Project completion", s: "Verified completion rate to be added" },
];

// Student stories. Only the two quotes already published on the previous homepage are real (anonymised).
// Add approved stories here (up to 15). `pending: true` renders a clearly labelled placeholder.
// SAMPLE CONTENT: names, companies, quotes and hike figures below are placeholders to be replaced by the owner.
type Story = { quote: string; name: string; role: string; company: string; logo: string; hike: number; img: string };
const SHOW_SAMPLE_NOTE = true;
const STORIES: Story[] = [
  { quote: "The 3-month programme gave me hands-on experience with real AI engineering tools. By month 3, I was working on actual projects with the Counts AI team.", name: "Ananya Rao", role: "AI Engineer", company: "Infosys", logo: "infosys", hike: 60, img: "student-1" },
  { quote: "Working directly on client problems taught me how to take an AI system from idea to production. That experience made the difference in my interviews.", name: "Rahul Menon", role: "Forward Deployed Engineer", company: "Tech Mahindra", logo: "tech-mahindra", hike: 45, img: "student-2" },
  { quote: "Coming from a non-technical background, the structured approach made complex AI concepts genuinely accessible.", name: "Arjun Nair", role: "Junior AI Engineer", company: "Deloitte", logo: "deloitte", hike: 55, img: "student-3" },
  { quote: "The hands-on projects and mentorship gave me a portfolio I could actually show employers, and the confidence to move into an AI role.", name: "Vikram Shah", role: "Data & AI Engineer", company: "TCS", logo: "tcs", hike: 40, img: "student-4" },
];

// Logos supplied by the owner. Confirm placements and brand permission before launch. Empty list hides the strip.
const EMPLOYERS: { name: string; src: string }[] = [
  ["Tech Mahindra", "tech-mahindra"], ["TCS", "tcs"], ["Infosys", "infosys"], ["Deloitte", "deloitte"], ["Zomato", "zomato"],
  ["Amazon", "amazon"], ["Uber", "uber"], ["Nykaa", "nykaa"], ["Porter", "porter"], ["Disney+ Hotstar", "disney-hotstar"],
].map(([name, f]) => ({ name, src: `/images/employers/${f}.png` }));

// PENDING owner verification: exact legal name and relationship of the certifying body.
const CERT_BODY_VERIFIED = false;
const CERT_BODY_TEXT = "Certification from COUNCIL AIU, London Office";

const PROJECTS = [
  { title: "RAG Knowledge Assistant", tags: ["Next.js", "LangChain", "Vector DB"], img: "rag", alt: "RAG Assistant interface answering questions from uploaded documents" },
  { title: "Multi-Agent Workflow", tags: ["Agents", "MCP", "APIs"], img: "multi-agent", alt: "Agent workflow editor with planner, research, data and action agents" },
  { title: "Business Analytics Agent", tags: ["Python", "OpenAI API", "Streamlit"], img: "analytics", alt: "Analytics dashboard with market cards, AI insights and sentiment" },
] as const;

/* ───────────────────────── small visuals ───────────────────────── */

const GL = { fill: "none", stroke: "#BFF3EC", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
function Node({ x, y, w, t, icon, hl = false }: { x: number; y: number; w: number; t: string; icon: React.ReactNode; hl?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="34" rx="7" fill={hl ? "rgba(79,209,197,.28)" : "rgba(255,255,255,.1)"} stroke="#9FEDE4" strokeOpacity={hl ? 1 : 0.6} />
      <g transform={`translate(${x + 8} ${y + 9})`} {...GL}>{icon}</g>
      <text x={x + 32} y={y + 21} fontSize="10.5" fill="#F1FFFD" fontFamily="var(--font-sans), sans-serif">{t}</text>
    </g>
  );
}

function Architecture() {
  return (
    <svg className="ac-arch" viewBox="0 0 330 190" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="326" height="186" rx="12" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.35)" />
      <g stroke="#9FEDE4" strokeOpacity=".8" fill="none" strokeWidth="1.2">
        <path d="M96 41H116M212 41H232M164 58V92M164 126V138M96 109H116M212 109H232" />
      </g>
      <Node x={12} y={24} w={84} t="Client" icon={<g><rect x="1" y="1" width="12" height="14" rx="1" /><path d="M4 5h2M8 5h2M4 9h2M8 9h2" /></g>} />
      <Node x={116} y={24} w={96} t="AI Agent" hl icon={<g><circle cx="7" cy="5" r="3" /><path d="M1 15c1-5 11-5 12 0" /></g>} />
      <Node x={232} y={24} w={86} t="Database" icon={<g><ellipse cx="7" cy="3" rx="6" ry="2.5" /><path d="M1 3v9c0 1.500 12 1.500 12 0V3" /></g>} />
      <Node x={12} y={92} w={84} t="Tools & APIs" icon={<g><path d="M2 14L9 7M10 1a4 4 0 0 0-3 5l1 1a4 4 0 0 0 5-3l-2 1-1-1z" /></g>} />
      <Node x={232} y={92} w={86} t="Deployment" icon={<g><path d="M3 13a3 3 0 0 1 0-6 4 4 0 0 1 8-1 3.500 3.500 0 0 1 0 7z" /></g>} />
      <Node x={86} y={138} w={156} t="Production monitoring" icon={<g><path d="M1 14V8M5 14V3M9 14V6M13 14V1" /></g>} />
      {[[164, 41], [164, 109], [214, 109]].map(([x, y], i) => <circle key={i} className="aa-node" cx={x} cy={y} r="2.6" fill="#7FE3EE" style={{ animationDelay: `${i * 0.8}s` }} />)}
    </svg>
  );
}

function GlassCubes() {
  const f = "rgba(255,255,255,.55)", st = "#4FB3AB";
  const cube = (x: number, y: number, s: number, k: number) => (
    <g key={k}>
      <polygon points={`${x},${y} ${x + s},${y - s / 2} ${x + 2 * s},${y} ${x + s},${y + s / 2}`} fill={f} stroke={st} />
      <polygon points={`${x},${y} ${x + s},${y + s / 2} ${x + s},${y + s * 1.5} ${x},${y + s}`} fill="rgba(79,179,171,.22)" stroke={st} />
      <polygon points={`${x + s},${y + s / 2} ${x + 2 * s},${y} ${x + 2 * s},${y + s} ${x + s},${y + s * 1.5}`} fill="rgba(79,179,171,.12)" stroke={st} />
      <path d={`M${x + s * 0.5} ${y + s * 0.9}h${s * 0.4}M${x + s * 1.2} ${y + s * 0.9}h${s * 0.4}`} stroke={st} strokeOpacity=".7" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 150" aria-hidden="true" focusable="false">
      {cube(70, 90, 36, 0)}{cube(24, 100, 26, 1)}{cube(100, 60, 30, 2)}{cube(60, 40, 26, 3)}
      <circle className="aa-node" cx="104" cy="52" r="2.5" fill="#079EAE" />
      <circle className="aa-node" cx="58" cy="110" r="2.5" fill="#079EAE" style={{ animationDelay: "1s" }} />
    </svg>
  );
}

function PathwayList() {
  const items: [React.ReactNode, string][] = [
    [<Cloud key="c" size={15} />, "Cloud deployment"], [<Settings key="s" size={15} />, "Integrations"],
    [<Layers key="l" size={15} />, "Real-world projects"], [<Users key="u" size={15} />, "Industry mentorship"],
  ];
  return (
    <ul className="ac-path">
      {items.map(([i, t]) => <li key={t}>{i}<span>{t}</span></li>)}
    </ul>
  );
}

function Bars({ c }: { c: string }) {
  return (
    <svg width="64" height="54" viewBox="0 0 64 54" aria-hidden="true">
      {[18, 28, 38, 52].map((h, i) => <rect key={i} x={i * 16} y={54 - h} width="11" height={h} rx="2" fill={c} opacity={0.3 + i * 0.2} />)}
    </svg>
  );
}

function Flag({ code }: { code: string }) {
  return (
    <svg className="ac-flagsvg" width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <clipPath id={`fc-${code}`}><rect width="20" height="14" rx="2" /></clipPath>
      <g clipPath={`url(#fc-${code})`}>
        {code === "GB" && (
          <g>
            <rect width="20" height="14" fill="#1F3A8A" />
            <path d="M0 0L20 14M20 0L0 14" stroke="#fff" strokeWidth="3" />
            <path d="M0 0L20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.2" />
            <path d="M10 0V14M0 7H20" stroke="#fff" strokeWidth="4.5" />
            <path d="M10 0V14M0 7H20" stroke="#C8102E" strokeWidth="2.6" />
          </g>
        )}
        {code === "AE" && (
          <g>
            <rect width="20" height="14" fill="#fff" />
            <rect width="20" height="4.700" y="0" fill="#00732F" />
            <rect width="20" height="4.700" y="9.300" fill="#000" />
            <rect width="5.500" height="14" fill="#CE1126" />
          </g>
        )}
        {code === "IN" && (
          <g>
            <rect width="20" height="14" fill="#fff" />
            <rect width="20" height="4.700" fill="#FF9933" />
            <rect width="20" height="4.700" y="9.300" fill="#138808" />
            <circle cx="10" cy="7" r="1.700" fill="none" stroke="#000080" strokeWidth=".6" />
          </g>
        )}
      </g>
      <rect width="20" height="14" rx="2" fill="none" stroke="rgba(13,27,32,.2)" />
    </svg>
  );
}

/* ───────────────────────── section ───────────────────────── */


export function CareerOutcomes() {
  return (
    <>
        {/* outcomes */}
        <Reveal>
          <div className="ac-out">
            <div className="ac-out-intro">
              <h3>Real career outcomes</h3>
              <p>Typical market salary ranges by role and country. Indicative ranges supplied by Counts AI; source and date to be confirmed.</p>
              <Link href="/jobs" className="btn btn-ghost btn-sm">View career paths <ArrowRight size={13} /></Link>
            </div>
            {SALARY_ROLES.map(({ role, Icon, c }) => (
              <div className="ac-sal" key={role}>
                <div className="ac-sal-h"><span style={{ color: c }}><Icon size={18} /></span><b>{role}</b></div>
                <ul>
                  {COUNTRIES.map((co) => {
                    const v = SALARY_DATA[role][co.code];
                    return <li key={co.code}><span><Flag code={co.flag} />{co.name}</span><b className={v ? "" : "pend"}>{v ?? `${co.code} · pending`}</b></li>;
                  })}
                </ul>
                <Bars c={c} />
              </div>
            ))}
            {METRICS.map(({ Icon, t, s: sub }) => (
              <div className="ac-met" key={t}>
                <Icon size={20} strokeWidth={1.6} />
                <b>{t}</b>
                <small>{sub}</small>
              </div>
            ))}
          </div>
        </Reveal>

    </>
  );
}

export function CertNote() {
  return (
    <>
        {/* certification */}
        <Reveal>
          <div className="ac-cert">
            <ShieldCheck size={22} />
            <p>
              <b>Verifiable certificates.</b> Programme certificates are issued by Counts AI Ltd and can be checked on our{" "}
              <Link href="/verify">certificate verification page</Link>.
              {CERT_BODY_VERIFIED && <> {CERT_BODY_TEXT}.</>}
            </p>
          </div>
        </Reveal>

    </>
  );
}

export function EmployerStrip() {
  return (
    <>
        {/* employer marquee: hidden until verified logos are supplied */}
        {EMPLOYERS.length > 0 && (
          <div className="ac-emp">
            <span>Our students work at</span>
            <div className="p3-marquee" tabIndex={0} aria-label="Employers">
              <ul className="p3-track" style={{ animationDuration: "40s" }}>
                {[...EMPLOYERS, ...EMPLOYERS].map((e, k) => (
                  <li key={`${e.name}-${k}`} className="p3-tech" aria-hidden={k >= EMPLOYERS.length || undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="ac-logo" src={e.src} alt={e.name} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
    </>
  );
}

export function AcademySection({ onInterest }: { onInterest: () => void }) {
  const [i, setI] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const n = STORIES.length;
  const go = (k: number) => setI(((k % n) + n) % n);

  useEffect(() => {
    if (!card.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = gsap.fromTo(card.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    return () => { t.kill(); };
  }, [i]);

  const s = STORIES[i];
  return (
    <section className="sec" id="academy">
      <div className="wrap ac">
        {/* hero */}
        <div className="ac-top">
          <Reveal>
            <div className="eyebrow"><b>04</b> / Counts AI Academy</div>
            <h2 className="ac-h">Forward Deployed<br /><em>Engineering (FDE) Program.</em></h2>
            <p className="lede" style={{ margin: "16px 0 22px" }}>
              A three-month, hands-on programme to develop practical AI engineering and forward deployed engineering skills through real projects, expert guidance and a structured career pathway.
            </p>
            <div className="acad-ctas" style={{ marginTop: 0 }}>
              <Link href="/training" className="btn btn-dark">Explore programmes <ArrowRight size={14} /></Link>
              <button type="button" onClick={onInterest} className="btn btn-ghost">Express interest</button>
            </div>
            <ul className="ac-ben">
              {BENEFITS.map(({ Icon, t, s: sub }) => (
                <li key={t}><Icon size={20} strokeWidth={1.6} /><span><b>{t}</b><small>{sub}</small></span></li>
              ))}
            </ul>
          </Reveal>

          <div className="ac-progs">
            <Reveal>
              <Link href="/training#month2" className="ac-feat">
                <div className="ac-feat-in">
                  <span className="ac-pill">Featured programme</span>
                  <span className="ac-month">Month 2–3</span>
                  <h3>Forward Deployed Engineering <span>(FDE)</span></h3>
                  <p>Work directly with real businesses to design, integrate and deploy AI systems.</p>
                  <ul className="ac-tags dark">{["APIs", "Cloud", "Docker", "Production AI", "Integrations"].map((t) => <li key={t}>{t}</li>)}</ul>
                  <span className="ac-more">Learn more <ArrowRight size={14} /></span>
                </div>
                <Architecture />
              </Link>
            </Reveal>
            <div className="ac-two">
              <Reveal delay={80}>
                <Link href="/training#month1" className="ac-prog mint">
                  <span className="ac-month soft">Month 1</span>
                  <div className="ac-prog-art eng"><GlassCubes /></div>
                  <h3>AI Engineering Programme</h3>
                  <p>Master LLMs, RAG, evaluation and agent development.</p>
                  <ul className="ac-tags">{["Python", "LLMs", "RAG", "Agents", "Evaluation"].map((t) => <li key={t}>{t}</li>)}</ul>
                  <span className="ac-more">Learn more <ArrowRight size={14} /></span>
                </Link>
              </Reveal>
              <Reveal delay={140}>
                <Link href="/training#month3" className="ac-prog lav">
                  <span className="ac-month soft">Month 3</span>
                  <div className="ac-prog-art dep"><PathwayList /></div>
                  <h3>Internship &amp; Career Pathway</h3>
                  <p>Work on real projects with our team and partner organisations.</p>
                  <ul className="ac-tags">{["Practice", "Client projects", "Production", "Mentorship"].map((t) => <li key={t}>{t}</li>)}</ul>
                  <span className="ac-more">Learn more <ArrowRight size={14} /></span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>

        <CareerOutcomes />

        {/* projects + stories */}
        <div className="ac-pr">
          <Reveal>
            <div className="ac-proj">
              <div className="ac-proj-h">
                <h3>Projects you&apos;ll build</h3>
                <p>Hands-on, real-world projects that demonstrate your engineering skills.</p>
                <Link href="/training" className="btn btn-ghost btn-sm">View programme <ArrowRight size={13} /></Link>
              </div>
              {PROJECTS.map((p) => (
                <Link href="/training" className="ac-pcard" key={p.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ac-shot" src={`/images/projects/${p.img}.png`} alt={p.alt} loading="lazy" />
                  <b>{p.title}</b>
                  <ul className="ac-tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </Link>
              ))}
              <p className="ac-fine">Example project interfaces.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="ac-story"
              role="region"
              aria-roledescription="carousel"
              aria-label="Student stories"
              onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}
            >
              <div className="ac-story-h">
                <h3>Student stories</h3>
                <div>
                  <button type="button" className="cs-btn sm" aria-label="Previous story" onClick={() => go(i - 1)}><ArrowLeft size={14} /></button>
                  <button type="button" className="cs-btn sm" aria-label="Next story" onClick={() => go(i + 1)}><ArrowRight size={14} /></button>
                </div>
              </div>
              <div ref={card} className="ac-story-card" aria-live="polite">
                <div className="ac-sc-top">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ac-photo" src={`/images/students/${s.img}.png`} alt={`${s.name}, ${s.role}`} />
                  <div className="ac-sc-id">
                    <b>{s.name}</b>
                    <small>{s.role}</small>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="ac-sc-logo" src={`/images/employers/${s.logo}.png`} alt={s.company} />
                  </div>
                  <span className="ac-hike"><b>{s.hike}%</b><small>Salary hike</small></span>
                </div>
                <blockquote>&ldquo;{s.quote}&rdquo;</blockquote>
              </div>
              {SHOW_SAMPLE_NOTE && <p className="ac-fine">Sample stories, to be replaced.</p>}
              <div className="cs-dots ac-dots">
                {STORIES.map((_, k) => (
                  <button key={k} type="button" className={k === i ? "on" : ""} aria-label={`Show story ${k + 1} of ${n}`} aria-current={k === i ? "true" : undefined} onClick={() => go(k)} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <CertNote />
        <EmployerStrip />
      </div>
    </section>
  );
}
