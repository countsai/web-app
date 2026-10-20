"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { Reveal } from "./reveal";

type Study = {
  company: string; country: string; industry: string; name: string; role: string; quote: string;
  accent: string; mark: string; photoPos: string;
};

// ILLUSTRATIVE EXAMPLES. These are fictional prototype stories, not verified customer testimonials.
// Replace with approved, genuine testimonials before publishing them as real.
const STUDIES: Study[] = [
  {
    company: "Rivermore Retail", country: "United Kingdom", industry: "Retail", name: "Sophie Turner", role: "Marketing Director",
    quote: "Before this, our team spent far too much time pulling campaign information together and working out what to do next. The marketing agent brings those insights into one place and helps us move from planning to execution much faster. We can spend more time on the creative work that actually makes a difference.",
    accent: "#7C6BD6", mark: "Rivermore", photoPos: "18% 70%",
  },
  {
    company: "Al Noor Logistics", country: "United Arab Emirates", industry: "Logistics", name: "Omar Al Suwaidi", role: "Operations Executive",
    quote: "We wanted a better way to handle routine operational queries without adding more manual work for the team. The agent connects information from our existing systems and gives us a much clearer picture of what's happening. It's made our day-to-day workflow considerably easier.",
    accent: "#D98A3D", mark: "Al Noor", photoPos: "55% 75%",
  },
  {
    company: "Sahyadri Health", country: "India", industry: "Healthcare", name: "Priya Menon", role: "HR Administrator",
    quote: "Our HR team handles a steady stream of employee questions and administrative tasks. Having an assistant that can help with common queries and organise information has taken some of that pressure away. It gives us more time to focus on people rather than repetitive paperwork.",
    accent: "#3E9B73", mark: "Sahyadri", photoPos: "88% 60%",
  },
];

const initials = (n: string) => { const p = n.split(" "); return p[0][0] + p[p.length - 1][0]; };

export function CaseSection() {
  const [active, setActive] = useState(0);
  const [vis, setVis] = useState(3);
  const track = useRef<HTMLUListElement>(null);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const calc = () => setVis(window.innerWidth >= 1100 ? 3 : window.innerWidth >= 700 ? 2 : 1);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const slide = useCallback((animate: boolean) => {
    const t = track.current;
    const first = t?.firstElementChild as HTMLElement | null;
    if (!t || !first) return;
    const offset = Math.min(active, STUDIES.length - vis);
    const x = -offset * (first.offsetWidth + 16);
    if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(t, { x, duration: 0.6, ease: "power2.inOut", overwrite: true });
    } else {
      gsap.set(t, { x });
    }
  }, [active, vis]);

  useEffect(() => { slide(true); }, [slide]);
  useEffect(() => {
    const onResize = () => slide(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [slide]);
  useEffect(() => () => { if (track.current) gsap.killTweensOf(track.current); }, []);

  const go = (i: number) => setActive(((i % STUDIES.length) + STUDIES.length) % STUDIES.length);

  return (
    <section className="cs" id="results" aria-labelledby="cs-title">
      <div className="wrap cs-grid">
        <Reveal>
          <div className="eyebrow"><b>07</b> Case studies</div>
          <h2 id="cs-title" className="cs-h">Real businesses.<br /><em>Real results.</em></h2>
          <p className="lede">See how organisations use Counts AI to put working AI into their operations.</p>
          <div style={{ marginTop: 24 }}>
            <Link href="/for-businesses" className="btn btn-dark">Business services <ArrowRight size={14} /></Link>
          </div>
          <p className="cs-note">Illustrative examples for demonstration, not verified customer testimonials.</p>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="cs-car"
            role="region"
            aria-roledescription="carousel"
            aria-label="Case study examples"
            onPointerDown={(e) => { touch.current = e.clientX; }}
            onPointerUp={(e) => {
              if (touch.current == null) return;
              const d = e.clientX - touch.current;
              touch.current = null;
              if (Math.abs(d) > 45) go(active + (d < 0 ? 1 : -1));
            }}
          >
            <div className="cs-view">
              <ul className="cs-track" ref={track} style={{ ["--vis" as string]: vis }}>
                {STUDIES.map((s, i) => (
                  <li
                    key={s.company}
                    className={`cs-card ${i === active ? "on" : ""}`}
                    style={{ ["--ac" as string]: s.accent }}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${STUDIES.length}: ${s.company}`}
                  >
                    <div className="cs-top">
                      <span className="cs-mark">{s.mark}</span>
                      <span className="cs-badge">{s.industry}</span>
                    </div>
                    <div className="cs-co"><b>{s.company}</b><small>{s.country}</small></div>
                    <blockquote>&ldquo;{s.quote}&rdquo;</blockquote>
                    <div className="cs-who">
                      <span className="cs-av" aria-hidden="true">{initials(s.name)}</span>
                      <span><b>{s.name}</b><small>{s.role}</small></span>
                    </div>
                    <div className="cs-photo" style={{ backgroundPosition: s.photoPos }} aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="cs-ctl">
              <button type="button" className="cs-btn" onClick={() => go(active - 1)} aria-label="Previous case study"><ArrowLeft size={16} /></button>
              <div className="cs-dots">
                {STUDIES.map((s, i) => (
                  <button
                    key={s.company}
                    type="button"
                    className={i === active ? "on" : ""}
                    onClick={() => go(i)}
                    aria-label={`Show case study ${i + 1}: ${s.company}`}
                    aria-current={i === active ? "true" : undefined}
                  />
                ))}
              </div>
              <button type="button" className="cs-btn" onClick={() => go(active + 1)} aria-label="Next case study"><ArrowRight size={16} /></button>
            </div>
            <p className="sr-only" aria-live="polite">Showing case study {active + 1} of {STUDIES.length}: {STUDIES[active].company}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
