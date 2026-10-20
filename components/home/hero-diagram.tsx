"use client";

/**
 * Hero illustration: business inputs → 3D glass Counts AI processor → four agents.
 *
 * hero-art.tsx holds the artwork. This file owns the two layouts (wide / stacked), the
 * circuit-trace routing and the GSAP animation:
 *   ambient  – continuous, staggered loops (particles, processor light, per-agent activity,
 *              bounded demo numbers). One master timeline, paused while off-screen.
 *   burst    – a one-off "inputs → processor → agents" sequence played on first view and
 *              replayed by the "Watch how it works" button.
 * Numbers in the agent cards are illustrative demo values.
 */

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  InputPanel, WebsiteArt, EmailArt, SocialArt, CrmArt, DatabaseArt, INPUT_H,
  AgentCard, NexaArt, OrionArt, LyraArt, VestaArt, AGENT_H, type Metric,
  GlassProcessor, GlassDefs, proj, TERM, type Mat,
} from "./hero-art";

export type HeroDiagramHandle = { replay: () => void };

type Pt = [number, number];
type Place = { x: number; y: number; s: number };

const INPUTS = [
  { label: "Website", Art: WebsiteArt },
  { label: "Email", Art: EmailArt },
  { label: "Social Media", Art: SocialArt },
  { label: "CRM", Art: CrmArt },
  { label: "Database", Art: DatabaseArt },
];

const AGENTS: { name: string; role: string; c: string; tint: string; Art: typeof NexaArt; metrics: Metric[] }[] = [
  { name: "Nexa",  role: "Lead Generation",        c: "#079EAE", tint: "#D3ECEC", Art: NexaArt,
    metrics: [{ label: "LEADS", base: 128, amp: 9 }, { label: "QUALIFIED", base: 34, amp: 3, suffix: "%" }] },
  { name: "Orion", role: "Customer Service",       c: "#D98A3D", tint: "#F6E3CF", Art: OrionArt,
    metrics: [{ label: "RESPONSE", base: 1.2, amp: 0.2, dec: 1, suffix: "s" }, { label: "RESOLVED", base: 92, amp: 3, suffix: "%" }] },
  { name: "Lyra",  role: "HR Management",          c: "#3E9B73", tint: "#D9EBDD", Art: LyraArt,
    metrics: [{ label: "SCREENED", base: 24, amp: 3 }, { label: "ONBOARDING", base: 6, amp: 1 }] },
  { name: "Vesta", role: "Marketing Intelligence", c: "#7C6BD6", tint: "#E3DFF5", Art: VestaArt,
    metrics: [{ label: "ENGAGEMENT", base: 12, amp: 2, suffix: "%" }, { label: "CAMPAIGNS", base: 5, amp: 1 }] },
];

/** Orthogonal polyline with rounded corners. */
function route(input: Pt[], r = 8): string {
  const p = input.filter((q, i) => i === 0 || q[0] !== input[i - 1][0] || q[1] !== input[i - 1][1]);
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const [px, py] = p[i - 1], [cx, cy] = p[i], [nx, ny] = p[i + 1];
    const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx + ((px - cx) / l1) * rr, ay = cy + ((py - cy) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr, by = cy + ((ny - cy) / l2) * rr;
    d += ` L${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
  }
  const last = p[p.length - 1];
  return `${d} L${last[0]} ${last[1]}`;
}

type Layout = {
  key: "wide" | "stack";
  vb: [number, number];
  m: Mat;
  sides: ("left" | "right" | "top" | "bottom")[];
  inputs: Place[];
  agents: Place[];
  inPaths: string[];
  outPaths: string[];
};

function wideLayout(): Layout {
  const m: Mat = { a: 1, b: -0.24, c: 0.35, d: 0.88, tx: 191.5, ty: 191.6 };
  const inputs = INPUTS.map((_, i) => ({ x: 8, y: 30 + i * 88, s: 1 }));
  const agents = AGENTS.map((_, i) => ({ x: 630, y: 30 + i * 110, s: 1 }));
  const inBend = [170, 160, 150, 150, 160];
  const outBend = [600, 606, 610, 596];
  return {
    key: "wide",
    vb: [780, 500],
    m,
    sides: ["left", "right"],
    inputs,
    agents,
    inPaths: inputs.map((p, i) => {
      const y0 = p.y + INPUT_H / 2;
      const [tx, ty] = proj(m, 0, TERM.left[i]);
      return route([[134, y0], [inBend[i], y0], [inBend[i], ty], [tx, ty]]);
    }),
    outPaths: agents.map((p, i) => {
      const [tx, ty] = proj(m, 320, TERM.right[i]);
      const ay = p.y + AGENT_H / 2;
      return route([[tx, ty], [outBend[i], ty], [outBend[i], ay], [p.x, ay]]);
    }),
  };
}

function stackLayout(): Layout {
  const m: Mat = { a: 0.738, b: -0.18, c: 0.262, d: 0.656, tx: 33.1, ty: 301.6 };
  const s = 0.88;
  const inputs: Place[] = [
    { x: 4, y: 34, s }, { x: 124, y: 34, s }, { x: 244, y: 34, s },   // Website, Email, Social
    { x: 4, y: 130, s }, { x: 245, y: 130, s },                       // CRM, Database
  ];
  const lanesLocal = [0, 3, 1, 4, 2];      // input i → top terminal index
  const cs = 1.15;
  const agents: Place[] = [
    { x: 10, y: 500, s: cs }, { x: 187, y: 500, s: cs },
    { x: 10, y: 640, s: cs }, { x: 187, y: 640, s: cs },
  ];
  const cxA = (p: Place) => p.x + 71 * p.s;
  const B = TERM.bottom.map((x) => proj(m, x, 220));
  return {
    key: "stack",
    vb: [360, 775],
    m,
    sides: ["top", "bottom"],
    inputs,
    agents,
    inPaths: inputs.map((p, i) => {
      const cx = p.x + 63 * p.s;
      const sy = i < 3 ? p.y + INPUT_H * p.s : p.y;
      const [lx, ly] = proj(m, TERM.top[lanesLocal[i]], 0);
      return route([[cx, sy], [cx, 116], [lx, 116], [lx, ly]]);
    }),
    outPaths: [
      route([B[0], [B[0][0], 480], [cxA(agents[0]), 480], [cxA(agents[0]), agents[0].y]]),
      route([B[3], [B[3][0], 480], [cxA(agents[1]), 480], [cxA(agents[1]), agents[1].y]]),
      route([B[1], [B[1][0], 488], [177, 488], [177, 626], [cxA(agents[2]), 626], [cxA(agents[2]), agents[2].y]]),
      route([B[2], [B[2][0], 496], [183, 496], [183, 626], [cxA(agents[3]), 626], [cxA(agents[3]), agents[3].y]]),
    ],
  };
}

const tx = (p: Place) => `translate(${p.x} ${p.y})${p.s !== 1 ? ` scale(${p.s})` : ""}`;

function DiagramSvg({ layout, svgRef }: { layout: Layout; svgRef: Ref<SVGSVGElement> }) {
  const [vw, vh] = layout.vb;
  const k = layout.key;
  const wide = k === "wide";
  return (
    <svg
      ref={svgRef}
      className={`hd hd-${k}`}
      viewBox={`0 0 ${vw} ${vh}`}
      role="img"
      aria-label="Business data from your website, email, social media, CRM and database flows into the Counts AI orchestration processor, which activates four AI agents: Nexa for lead generation, Orion for customer service, Lyra for HR management and Vesta for marketing intelligence. Numbers shown on the agent cards are illustrative demo values."
    >
      <GlassDefs k={k} />

      {/* engineering grid */}
      <g stroke="rgba(13,27,32,.06)" strokeWidth="1">
        {Array.from({ length: Math.ceil(vw / 56) + 1 }).map((_, i) => <line key={`v${i}`} x1={i * 56} y1="0" x2={i * 56} y2={vh} />)}
        {Array.from({ length: Math.ceil(vh / 56) + 1 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 56} x2={vw} y2={i * 56} />)}
      </g>

      {/* labels */}
      <g fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="rgba(13,27,32,.62)">
        <text x={wide ? 8 : 8} y={wide ? 18 : 22}>BUSINESS DATA</text>
        <text x={wide ? 630 : 10} y={wide ? 18 : 470}>AI AGENTS</text>
        {wide ? (
          <>
            <text x="390" y="488" textAnchor="middle" fontSize="9.5">ORCHESTRATION · TOOLS &amp; MCP · EXECUTION</text>
            <text x="772" y="472" textAnchor="end" fontSize="9">CONNECT</text>
            <text x="772" y="483" textAnchor="end" fontSize="9">AUTOMATE</text>
            <text x="772" y="494" textAnchor="end" fontSize="9">SCALE</text>
            <text x="8" y="494" fontSize="7.5" letterSpacing="1.2">ILLUSTRATIVE DEMO VALUES</text>
          </>
        ) : (
          <text x="10" y="768" fontSize="7.5" letterSpacing="1.2">ILLUSTRATIVE DEMO VALUES</text>
        )}
      </g>

      {/* traces: calm base layer + lit overlay drawn by the burst sequence */}
      <g fill="none" strokeWidth="1.3" strokeLinecap="round">
        {layout.inPaths.map((d, i) => <path key={`b${i}`} className="hd-in" d={d} stroke="rgba(7,158,174,.5)" />)}
        {layout.outPaths.map((d, i) => <path key={`o${i}`} className="hd-out" d={d} stroke={AGENTS[i].c} strokeOpacity=".55" />)}
      </g>
      <g fill="none" strokeWidth="2.2" strokeLinecap="round">
        {layout.inPaths.map((d, i) => (
          <path key={`bl${i}`} className="hd-in-lit" d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke="#079EAE" />
        ))}
        {layout.outPaths.map((d, i) => (
          <path key={`ol${i}`} className="hd-out-lit" d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke={AGENTS[i].c} />
        ))}
      </g>

      {/* processor sits above the traces so they appear to enter its terminals */}
      <GlassProcessor m={layout.m} k={k} sides={layout.sides} />

      {INPUTS.map(({ label, Art }, i) => (
        <g key={label} transform={tx(layout.inputs[i])}>
          <InputPanel label={label}><Art /></InputPanel>
        </g>
      ))}

      {AGENTS.map(({ name, role, c, tint, Art, metrics }, i) => (
        <g key={name} transform={tx(layout.agents[i])}>
          <AgentCard name={name} role={role} accent={c} tint={tint} metrics={metrics}><Art a={c} /></AgentCard>
        </g>
      ))}

      {/* signal particles (moved by GSAP) */}
      <g>
        {layout.inPaths.map((_, i) => <circle key={`pi${i}`} className="hd-p-in" r="3.1" fill="#079EAE" opacity="0" cx="0" cy="0" />)}
        {layout.outPaths.map((_, i) => <circle key={`po${i}`} className="hd-p-out" r="3.1" fill={AGENTS[i].c} opacity="0" cx="0" cy="0" />)}
      </g>
    </svg>
  );
}

/* ───────────────────────────── GSAP ───────────────────────────── */

const q = <T extends SVGElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));
const rest = (_i: number, el: Element) => el.getAttribute("data-rs") ?? "";

/** Continuous, staggered loops. Everything here repeats forever; the owner pauses/plays it. */
function buildAmbient(svg: SVGSVGElement, mobile: boolean) {
  const rnd = gsap.utils.random;
  const master = gsap.timeline({ paused: true });
  const add = (t: gsap.core.Tween | gsap.core.Timeline, at = 0) => { master.add(t, at); };

  gsap.set(q(svg, ".hd-prog, .hd-in-ind"), { transformBox: "fill-box", transformOrigin: "0% 50%" });
  gsap.set(q(svg, ".hd-chart"), { transformBox: "fill-box", transformOrigin: "50% 100%" });
  gsap.set(q(svg, ".hd-fun"), { transformBox: "fill-box", transformOrigin: "50% 0%" });

  // — signal particles: one per trace, staggered, never in lock-step
  if (!mobile) {
    const run = (path: SVGPathElement, dot: SVGElement, at: number, dur: number) => {
      const len = path.getTotalLength();
      const o = { p: 0 };
      const t = gsap.timeline({ repeat: -1, repeatDelay: rnd(0.25, 0.9) });
      t.fromTo(o, { p: 0 }, {
        p: 1, duration: dur, ease: "sine.inOut",
        onUpdate: () => {
          const pt = path.getPointAtLength(o.p * len);
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
        },
      }, 0);
      t.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "none" }, 0);
      t.to(dot, { opacity: 0, duration: 0.3, ease: "none" }, dur - 0.3);
      add(t, at);
    };
    const inBase = q<SVGPathElement>(svg, ".hd-in"), outBase = q<SVGPathElement>(svg, ".hd-out");
    q(svg, ".hd-p-in").forEach((dot, i) => run(inBase[i], dot, i * 0.38, 2.4 + (i % 3) * 0.35));
    q(svg, ".hd-p-out").forEach((dot, i) => run(outBase[i], dot, 0.6 + i * 0.47, 2.6 + (i % 2) * 0.4));
  }

  // — input panels: status LEDs and tiny readouts blink out of phase
  add(gsap.to(q(svg, ".hd-led"), { opacity: 1, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.45 }));
  if (!mobile) {
    add(gsap.to(q(svg, ".hd-in-ind"), { scaleX: () => rnd(0.45, 1), duration: () => rnd(1.2, 2.2), repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.18 }));
  }

  // — processor: edges breathe in sequence, internal nodes blink, a highlight crosses the glass
  add(gsap.to(q(svg, ".hd-edge"), { strokeOpacity: 1, stroke: "#2FC3D3", duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.5 }));
  add(gsap.to(q(svg, ".hd-node"), { opacity: 1, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.3, from: "random" } }));
  add(gsap.to(q(svg, ".hd-glow"), { opacity: 0.8, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" }));
  const sweep = q(svg, ".hd-sweep")[0];
  if (sweep) {
    const t = gsap.timeline({ repeat: -1, repeatDelay: 1.6 });
    t.set(sweep, { x: 0, opacity: 0 });
    t.to(sweep, { opacity: 1, duration: 0.5, ease: "none" }, 0);
    t.to(sweep, { x: 400, duration: 3.4, ease: "sine.inOut" }, 0);
    t.to(sweep, { opacity: 0, duration: 0.6, ease: "none" }, 2.8);
    add(t, 1.2);
  }

  // — agents: each has its own persistent activity in its own accent colour
  add(gsap.to(q(svg, ".hd-led2"), { opacity: 1, duration: 0.7, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.35 }));
  add(gsap.to(q(svg, ".hd-prog"), { scaleX: () => rnd(0.5, 0.95), duration: () => rnd(2.2, 3.6), repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.4 }));

  const agentEls = q(svg, ".hd-agent-in");
  agentEls.forEach((g, i) => {
    const ind = q(g, ".hd-ind");
    add(gsap.to(ind, { opacity: 1, duration: 0.45, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.32 } }), i * 0.25);
    if (mobile) return;
    const flow = q(g, ".hd-flowline"), trace = q(g, ".hd-trace"), chart = q(g, ".hd-chart"), fun = q(g, ".hd-fun");
    if (flow.length) add(gsap.to(flow, { strokeDashoffset: -12, duration: 1.4, repeat: -1, ease: "none" }));
    if (trace.length) add(gsap.fromTo(trace, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, repeat: -1, repeatDelay: 1.2, ease: "power1.inOut" }));
    if (chart.length) add(gsap.to(chart, { scaleY: 0.88, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" }));
    if (fun.length) add(gsap.to(fun, { scaleY: 0.9, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut" }));
  });

  // — bounded demo numbers
  if (!mobile) {
    q(svg, ".hd-num").forEach((el, i) => {
      const base = Number(el.dataset.base), amp = Number(el.dataset.amp);
      const dec = Number(el.dataset.dec ?? 0), suf = el.dataset.suffix ?? "";
      const o = { v: 0.5 };
      add(gsap.to(o, {
        v: 1, duration: rnd(3.4, 5.4), repeat: -1, yoyo: true, ease: "sine.inOut",
        onUpdate: () => { el.textContent = (base + amp * (o.v * 2 - 1)).toFixed(dec) + suf; },
      }), i * 0.2);
    });
  }

  return master;
}

/** One-off input → processor → agents emphasis; replayed by the button. */
function buildBurst(svg: SVGSVGElement) {
  const inLit = q(svg, ".hd-in-lit"), outLit = q(svg, ".hd-out-lit");
  const src = q(svg, ".hd-src");
  const agents = q(svg, ".hd-agent-in");
  const box = q(svg, ".hd-agent-box"), wash = q(svg, ".hd-agent-wash");
  gsap.set(agents, { transformBox: "fill-box", transformOrigin: "50% 50%" });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  tl.set([...inLit, ...outLit], { strokeDashoffset: 1, opacity: 1 }, 0);

  const step = 0.16;
  tl.to(src, { stroke: "#079EAE", duration: 0.3, stagger: step }, 0);
  tl.fromTo(inLit, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power1.out", stagger: step, immediateRender: false }, 0.1);
  const C0 = 0.1 + 4 * step + 1.3;
  tl.fromTo(outLit, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power1.out", stagger: 0.2, immediateRender: false }, C0);
  agents.forEach((g, i) => {
    const at = C0 + i * 0.2 + 0.7;
    tl.to(box[i], { strokeOpacity: 1, strokeWidth: 2, duration: 0.3 }, at);
    tl.to(wash[i], { fillOpacity: 0.1, duration: 0.3 }, at);
    tl.to(g, { scale: 1.03, duration: 0.3 }, at);
  });
  const D0 = C0 + 3 * 0.2 + 1.9;
  tl.to([...inLit, ...outLit], { opacity: 0, duration: 0.8 }, D0);
  tl.to(src, { stroke: rest, duration: 0.8 }, D0);
  tl.to(box, { strokeOpacity: 0.75, strokeWidth: 1.1, duration: 0.8 }, D0);
  tl.to(wash, { fillOpacity: 0, duration: 0.8 }, D0);
  tl.to(agents, { scale: 1, duration: 0.8 }, D0);
  return tl;
}

const wideLayoutConst = wideLayout();
const stackLayoutConst = stackLayout();

export function HeroDiagram({ ref }: { ref?: Ref<HeroDiagramHandle> }) {
  const wideRef = useRef<SVGSVGElement>(null);
  const stackRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const live = useRef<{ master: gsap.core.Timeline; burst: gsap.core.Timeline } | null>(null);

  useImperativeHandle(ref, () => ({
    replay: () => {
      const el = wrapRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        if (!(r.top >= 0 && r.bottom <= window.innerHeight)) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const t = live.current;
      if (!t) return;
      t.burst.restart();
      if (t.master.paused()) t.master.play();
    },
  }), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    const start = (svg: SVGSVGElement | null, mobile: boolean) => {
      if (!svg) return;
      const master = buildAmbient(svg, mobile);
      const burst = buildBurst(svg);
      live.current = { master, burst };
      let first = true;
      const st = ScrollTrigger.create({
        trigger: svg,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            master.play();
            if (first) { first = false; burst.play(0); }
          } else {
            master.pause();
          }
        },
      });
      if (st.isActive) { first = false; master.play(); burst.play(0); }
      return () => { st.kill(); master.kill(); burst.kill(); live.current = null; };
    };

    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        mobile: "(max-width: 760px) and (prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { reduce, mobile } = ctx.conditions as { reduce: boolean; mobile: boolean; desktop: boolean };
        if (reduce) {
          // static, legible illustration: traces gently lit, readouts at their base values
          [wideRef.current, stackRef.current].forEach((svg) => {
            if (svg) gsap.set(svg.querySelectorAll(".hd-in-lit, .hd-out-lit"), { strokeDashoffset: 0, opacity: 0.45 });
          });
          return;
        }
        return start(mobile ? stackRef.current : wideRef.current, mobile);
      },
    );

    return () => { mm.revert(); live.current = null; };
  }, []);

  return (
    <div ref={wrapRef}>
      <DiagramSvg layout={wideLayoutConst} svgRef={wideRef} />
      <DiagramSvg layout={stackLayoutConst} svgRef={stackRef} />
    </div>
  );
}
