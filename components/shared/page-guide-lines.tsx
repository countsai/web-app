"use client";

import { useEffect, useRef } from "react";

// Draws two vertical dotted construction lines that reveal downward as the user scrolls.
// Positioned to align visually with the main content container boundaries.
export function PageGuideLines() {
  const leftRef  = useRef<SVGLineElement>(null);
  const rightRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const DASH = 6;
    const GAP  = 9;
    const PERIOD = DASH + GAP;

    let rafId: number;

    const update = () => {
      const docH   = document.documentElement.scrollHeight;
      const winH   = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(docH - winH, 1);

      // Number of dash periods needed to cover the full document height
      const periods = Math.ceil(docH / PERIOD);
      const totalLen = periods * PERIOD;

      // progress 0→1 as user scrolls top→bottom
      const progress = Math.min(scrollY / maxScroll, 1);

      // stroke-dashoffset: start at totalLen (nothing visible), decrease to reveal top-down
      const offset = totalLen * (1 - progress);

      if (leftRef.current)  leftRef.current.style.strokeDashoffset  = String(offset);
      if (rightRef.current) rightRef.current.style.strokeDashoffset = String(offset);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {/* Left guide — aligned with approx. container left gutter */}
      <line
        ref={leftRef}
        x1="7.5%" y1="0" x2="7.5%" y2="100%"
        stroke="#D7E2E4"
        strokeWidth="1"
        strokeDasharray="6 9"
        strokeDashoffset="999999"
        opacity="0.32"
      />
      {/* Right guide — aligned with approx. container right gutter */}
      <line
        ref={rightRef}
        x1="92.5%" y1="0" x2="92.5%" y2="100%"
        stroke="#D7E2E4"
        strokeWidth="1"
        strokeDasharray="6 9"
        strokeDashoffset="999999"
        opacity="0.32"
      />
    </svg>
  );
}
