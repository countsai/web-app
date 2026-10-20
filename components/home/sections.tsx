import Link from "next/link";
import { ArrowUpRight, Brain, Waypoints, ChartLine, Blocks, Workflow } from "lucide-react";
import { Reveal } from "./reveal";

/* ─────────────────────────── 06 · Jobs ─────────────────────────── */

// Illustrative role categories, not live vacancies. Real listings, if any, live at /jobs.
const FEATURED = { title: "Forward Deployed Engineer", sub: "AI integrations · Customer engineering", tags: ["Python", "LLMs", "APIs"] };
const ROLES = [
  { icon: Brain, title: "AI Engineer", skills: "LLMs · RAG · Python", c: "#0F9AA6" },
  { icon: Waypoints, title: "Agentic AI Engineer", skills: "MCP · Tools · Workflows", c: "#7C6BD6" },
  { icon: ChartLine, title: "LLM Evaluation Engineer", skills: "Testing · Model quality", c: "#C77A2B" },
  { icon: Blocks, title: "AI Solutions Engineer", skills: "Cloud · Integrations", c: "#0A6379" },
];

export function JobsSection() {
  return (
    <section className="sec" id="jobs">
      <div className="wrap jb-grid">
        <Reveal>
          <div className="eyebrow"><b>06</b> / Jobs &amp; talent network</div>
          <h2 className="h2">Opportunities for builders and doers.</h2>
          <p className="lede" style={{ margin: "16px 0 24px" }}>
            Build, deploy and improve real-world AI systems. Discover engineering opportunities or connect with the Counts AI talent network.
          </p>
          <div className="acad-ctas" style={{ marginTop: 0 }}>
            <Link href="/jobs" className="btn btn-dark">Explore jobs <ArrowUpRight size={14} /></Link>
            <Link href="/jobs#talent-pool" className="btn btn-ghost">Join talent network</Link>
          </div>
          <p className="jb-foot">Engineering · AI systems · Product</p>
        </Reveal>

        <div>
          <Reveal>
            <Link href="/jobs" className="jb-feat">
              <span className="jb-fico"><Workflow size={20} /></span>
              <span className="jb-ftxt">
                <b>{FEATURED.title}</b>
                <small>{FEATURED.sub}</small>
                <span className="tags">{FEATURED.tags.map((t) => <span key={t}>{t}</span>)}</span>
              </span>
              <ArrowUpRight size={16} className="jb-arrow" />
            </Link>
          </Reveal>
          <div className="jb-cards">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <Link href="/jobs" className="jb-card" style={{ ["--jc" as string]: r.c }}>
                  <r.icon size={22} className="jb-ico" />
                  <b>{r.title}</b>
                  <small>{r.skills}</small>
                  <span className="jb-link">Explore role <ArrowUpRight size={13} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="jb-bottom">
            <span>Engineering opportunities</span>
            <Link href="/jobs">View all jobs <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
