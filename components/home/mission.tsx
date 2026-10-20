"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Destinations reuse the site's existing contact and talent-network links.
export function MissionSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          defaults: { ease: "power2.out" },
        });
        tl.from(".ms-eyebrow", { opacity: 0, y: 12, duration: 0.6 })
          .from(".ms-title", { opacity: 0, y: 22, duration: 0.8 }, "-=0.35")
          .from(".ms-text", { opacity: 0, y: 16, duration: 0.7 }, "-=0.5")
          .from(".ms-btn", { opacity: 0, y: 12, duration: 0.5, stagger: 0.12 }, "-=0.4")
          .from(".ms-side", { opacity: 0, duration: 1 }, "-=0.6");
      }, el);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="mission" id="mission" ref={root} aria-labelledby="mission-title">
      <div className="wrap mission-in">
        <div className="mission-copy">
          <div className="eyebrow ms-eyebrow"><b>08</b> Our mission</div>
          <h2 id="mission-title" className="ms-title">
            A more productive world, <em>together.</em>
          </h2>
          <p className="ms-text">
            We work with businesses, teams and individuals to turn AI from a possibility into real, measurable progress.
          </p>
          <div className="mission-ctas">
            <Link href="/for-businesses#contact" className="btn btn-light ms-btn ms-primary">
              Start a project <ArrowRight size={14} />
            </Link>
            <Link href="/jobs#talent-pool" className="btn btn-light ms-btn">Join our talent network</Link>
          </div>
        </div>
        <p className="ms-side" aria-hidden="true">
          <span>People</span><span>Technology</span><span>Opportunity</span>
          <em>A brighter tomorrow</em>
        </p>
      </div>
    </section>
  );
}
