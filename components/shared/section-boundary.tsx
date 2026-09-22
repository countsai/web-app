"use client";

import { useEffect, useRef, useState } from "react";

interface SectionBoundaryProps {
  number: string;
  label: string;
  className?: string;
}

export function SectionBoundary({ number, label, className = "" }: SectionBoundaryProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {/* Animated dotted horizontal rule */}
      <svg width="100%" height="2" overflow="visible" aria-hidden="true">
        <line
          x1="0" y1="1" x2="100%" y2="1"
          stroke="#D7E2E4"
          strokeWidth="1"
          strokeDasharray="5 5"
          style={{
            strokeDashoffset: visible ? 0 : 800,
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </svg>

      {/* Section label */}
      <div
        className="flex items-center gap-3 mt-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.5s 0.5s, transform 0.5s 0.5s",
        }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.25em]"
          style={{ color: "#079DB3", fontFamily: "monospace" }}
        >
          {number}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: "#8AABAE" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
