"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const OUTPUTS = [
  "AI is reshaping how engineers design and deploy intelligent systems.",
  "The future of work belongs to those who understand and build with AI.",
  "Every industry will be redefined by people who can engineer AI solutions.",
];

const INPUT_TOKENS = ["The", "future", "of", "work", "is"];

// Fixed activation bar heights — stable across renders
const EMBEDDING_BARS = [0.72, 0.45, 0.88, 0.31, 0.67, 0.52, 0.79, 0.44, 0.61, 0.83, 0.58, 0.70];
const FFN_BARS       = [0.55, 0.88, 0.34, 0.77, 0.92, 0.48, 0.65, 0.71, 0.39, 0.84, 0.58, 0.93, 0.62, 0.75, 0.41];

// phase index 0–6 maps to diagram activation levels
type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function TransformerHero({ className = "" }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>(0);
  const [outputText, setOutputText] = useState("");
  const [cycleIdx, setCycleIdx] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const after = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  const runCycle = useCallback((idx: number) => {
    clear();
    setPhase(1); setOutputText("");
    after(() => setPhase(2), 800);
    after(() => setPhase(3), 1700);
    after(() => setPhase(4), 2800);
    after(() => setPhase(5), 3700);
    after(() => {
      setPhase(6);
      const target = OUTPUTS[idx % OUTPUTS.length];
      let i = 0;
      const tick = () => {
        i += 2;
        setOutputText(target.slice(0, Math.min(i, target.length)));
        if (i < target.length) after(tick, 26);
        else after(() => setCycleIdx(prev => prev + 1), 2800);
      };
      tick();
    }, 4500);
  }, [clear, after]);

  useEffect(() => {
    if (reduced) { setPhase(6); setOutputText(OUTPUTS[0]); return; }
    const t = setTimeout(() => runCycle(cycleIdx), cycleIdx === 0 ? 600 : 0);
    return () => { clearTimeout(t); clear(); };
  }, [cycleIdx, reduced, runCycle, clear]);

  const p = phase;
  const on  = (lvl: number) => p >= lvl;

  // Colours
  const INK  = "#071A24";
  const TEAL = "#079DB3";
  const DIM  = "#D7E2E4";
  const MUTE = "#536B73";

  // SVG dimensions
  const VW = 540;
  const LW = 460; const LX = (VW - LW) / 2;
  const CX = VW / 2;

  // Y positions
  const TOK_Y = 44; const TOK_H = 26;
  const TOK_W = 52; const TOK_GAP = 7;
  const TOK_ALL = INPUT_TOKENS.length * TOK_W + (INPUT_TOKENS.length - 1) * TOK_GAP;
  const TOK_X = (VW - TOK_ALL) / 2;

  const EMB_Y = 106; const EMB_H = 42;
  const ATT_Y = 184; const ATT_H = 72;
  const FFN_Y = 296; const FFN_H = 40;
  const OUT_Y = 372; const OUT_H = 28;

  const cs = (lvl: number) => on(lvl) ? TEAL : DIM;   // connector/stroke colour
  const bf = (lvl: number) => on(lvl) ? "rgba(7,157,179,0.07)" : "transparent"; // box fill
  const lf = (lvl: number) => on(lvl) ? TEAL : MUTE;  // label fill

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Small model label */}
      <div className="absolute top-0 right-0 z-10 pointer-events-none">
        <span
          className="text-[8px] font-bold uppercase tracking-[0.2em]"
          style={{ color: DIM, fontFamily: "monospace" }}
        >
          Conceptual Model · Not to scale
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VW} 430`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full overflow-visible"
        aria-label="Simplified transformer LLM architecture: tokens flow through embedding, attention, feed-forward, and output layers"
      >
        <defs>
          <pattern id="th-dot" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="0"  cy="0"  r="0.6" fill="#DCEBED" opacity="0.9" />
            <circle cx="30" cy="0"  r="0.6" fill="#DCEBED" opacity="0.9" />
            <circle cx="0"  cy="30" r="0.6" fill="#DCEBED" opacity="0.9" />
            <circle cx="30" cy="30" r="0.6" fill="#DCEBED" opacity="0.9" />
          </pattern>
        </defs>

        {/* Grid background */}
        <rect width={VW} height="430" fill="url(#th-dot)" />

        {/* ── INPUT TOKENS ── */}
        <text x={TOK_X} y={TOK_Y - 10}
          fontSize="8" fontWeight="700" letterSpacing="4" fill={MUTE} fontFamily="monospace">
          INPUT
        </text>

        {INPUT_TOKENS.map((tok, i) => {
          const tx = TOK_X + i * (TOK_W + TOK_GAP);
          return (
            <g key={tok}>
              <rect x={tx} y={TOK_Y} width={TOK_W} height={TOK_H}
                fill={on(1) ? "rgba(7,157,179,0.07)" : "transparent"}
                stroke={on(1) ? TEAL : DIM}
                strokeWidth="0.8"
                style={{ transition: "fill 0.5s, stroke 0.5s" }}
              />
              <text x={tx + TOK_W / 2} y={TOK_Y + TOK_H / 2 + 4}
                fontSize="10" fontWeight="500"
                fill={on(1) ? INK : "#9ABABB"}
                textAnchor="middle" fontFamily="monospace"
                style={{ transition: "fill 0.5s" }}>
                {tok}
              </text>
            </g>
          );
        })}

        {/* Connector 1: tokens → embedding */}
        <line x1={CX} y1={TOK_Y + TOK_H + 2} x2={CX} y2={EMB_Y - 2}
          stroke={cs(2)} strokeWidth="0.8" strokeDasharray="4 3"
          style={{ transition: "stroke 0.5s" }} />
        <text x={CX + 6} y={(TOK_Y + TOK_H + EMB_Y) / 2 + 4}
          fontSize="7" fill={on(2) ? TEAL : DIM} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          embed
        </text>

        {/* ── EMBEDDING ── */}
        <rect x={LX} y={EMB_Y} width={LW} height={EMB_H}
          fill={bf(2)} stroke={cs(2)} strokeWidth="0.8"
          style={{ transition: "fill 0.5s, stroke 0.5s" }} />
        <text x={LX + 10} y={EMB_Y + 14}
          fontSize="8" fontWeight="700" letterSpacing="4" fill={lf(2)} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          EMBEDDING
        </text>
        <text x={LX + LW - 10} y={EMB_Y + 14}
          fontSize="8" fill={MUTE} textAnchor="end" fontFamily="monospace">
          768d
        </text>
        {EMBEDDING_BARS.map((h, i) => (
          <rect key={i}
            x={LX + 10 + i * ((LW - 56) / EMBEDDING_BARS.length)}
            y={EMB_Y + 24 + (1 - h) * 12}
            width={(LW - 56) / EMBEDDING_BARS.length - 2}
            height={h * 12}
            fill={TEAL}
            opacity={on(2) ? 0.12 + h * 0.22 : 0.04}
            style={{ transition: "opacity 0.7s" }}
          />
        ))}

        {/* Connector 2: embedding → attention */}
        <line x1={CX} y1={EMB_Y + EMB_H + 2} x2={CX} y2={ATT_Y - 2}
          stroke={cs(3)} strokeWidth="0.8" strokeDasharray="4 3"
          style={{ transition: "stroke 0.5s" }} />
        <text x={CX + 6} y={(EMB_Y + EMB_H + ATT_Y) / 2 + 4}
          fontSize="7" fill={on(3) ? TEAL : DIM} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          encode
        </text>

        {/* ── MULTI-HEAD ATTENTION ── */}
        <rect x={LX} y={ATT_Y} width={LW} height={ATT_H}
          fill={bf(3)} stroke={cs(3)} strokeWidth="0.8"
          style={{ transition: "fill 0.5s, stroke 0.5s" }} />
        <text x={LX + 10} y={ATT_Y + 14}
          fontSize="8" fontWeight="700" letterSpacing="4" fill={lf(3)} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          MULTI-HEAD ATTENTION
        </text>
        <text x={LX + LW - 10} y={ATT_Y + 14}
          fontSize="8" fill={MUTE} textAnchor="end" fontFamily="monospace">
          12 heads · 1024d
        </text>

        {/* Attention nodes — fade in with phase */}
        <g opacity={on(3) ? 1 : 0} style={{ transition: "opacity 0.6s" }}>
          {(() => {
            const n = 9;
            const sp = (LW - 60) / (n - 1);
            const r1y = ATT_Y + 32;
            const r2y = ATT_Y + ATT_H - 14;
            return Array.from({ length: n }).map((_, i) => {
              const nx = LX + 30 + i * sp;
              return (
                <g key={i}>
                  {i < n - 1 && <line x1={nx} y1={r1y} x2={LX + 30 + (i+1) * sp} y2={r1y} stroke={TEAL} strokeWidth="0.5" opacity="0.35" />}
                  {i < n - 1 && <line x1={nx} y1={r2y} x2={LX + 30 + (i+1) * sp} y2={r2y} stroke={TEAL} strokeWidth="0.5" opacity="0.35" />}
                  <line x1={nx} y1={r1y} x2={nx} y2={r2y} stroke={TEAL} strokeWidth="0.4" opacity="0.2" />
                  {i < n - 2 && <line x1={nx} y1={r1y} x2={LX + 30 + (i+2) * sp} y2={r2y} stroke={TEAL} strokeWidth="0.3" opacity="0.12" />}
                  <circle cx={nx} cy={r1y} r="2.5" fill={TEAL} opacity="0.75" />
                  <circle cx={nx} cy={r2y} r="2"   fill="#0A5963" opacity="0.65" />
                </g>
              );
            });
          })()}
        </g>

        {/* Weight annotations */}
        <g opacity={on(3) ? 1 : 0} style={{ transition: "opacity 0.5s 0.4s" }}>
          {["W₁ 0.742", "W₂ 0.619", "W₃ 0.831"].map((w, i) => (
            <text key={i} x={LX + LW + 10} y={ATT_Y + 28 + i * 16}
              fontSize="7" fill="#8AABAE" fontFamily="monospace">
              {w}
            </text>
          ))}
        </g>

        {/* Connector 3: attention → ffn */}
        <line x1={CX} y1={ATT_Y + ATT_H + 2} x2={CX} y2={FFN_Y - 2}
          stroke={cs(4)} strokeWidth="0.8" strokeDasharray="4 3"
          style={{ transition: "stroke 0.5s" }} />
        <text x={CX + 6} y={(ATT_Y + ATT_H + FFN_Y) / 2 + 4}
          fontSize="7" fill={on(4) ? TEAL : DIM} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          attn
        </text>

        {/* ── FEED FORWARD ── */}
        <rect x={LX} y={FFN_Y} width={LW} height={FFN_H}
          fill={bf(4)} stroke={cs(4)} strokeWidth="0.8"
          style={{ transition: "fill 0.5s, stroke 0.5s" }} />
        <text x={LX + 10} y={FFN_Y + 14}
          fontSize="8" fontWeight="700" letterSpacing="4" fill={lf(4)} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          FEED FORWARD
        </text>
        <text x={LX + LW - 10} y={FFN_Y + 14}
          fontSize="8" fill={MUTE} textAnchor="end" fontFamily="monospace">
          4096d
        </text>
        {FFN_BARS.map((h, i) => (
          <rect key={i}
            x={LX + 10 + i * ((LW - 44) / FFN_BARS.length)}
            y={FFN_Y + 22 + (1 - h) * 12}
            width={(LW - 44) / FFN_BARS.length - 2}
            height={h * 12}
            fill={TEAL}
            opacity={on(4) ? 0.08 + h * 0.18 : 0.04}
            style={{ transition: "opacity 0.7s" }}
          />
        ))}

        {/* Connector 4: ffn → output */}
        <line x1={CX} y1={FFN_Y + FFN_H + 2} x2={CX} y2={OUT_Y - 2}
          stroke={cs(5)} strokeWidth="0.8" strokeDasharray="4 3"
          style={{ transition: "stroke 0.5s" }} />
        <text x={CX + 6} y={(FFN_Y + FFN_H + OUT_Y) / 2 + 4}
          fontSize="7" fill={on(5) ? TEAL : DIM} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          project
        </text>

        {/* ── OUTPUT ── */}
        <rect x={LX} y={OUT_Y} width={LW} height={OUT_H}
          fill={bf(5)} stroke={cs(5)} strokeWidth="0.8"
          style={{ transition: "fill 0.5s, stroke 0.5s" }} />
        <text x={LX + 10} y={OUT_Y + 14}
          fontSize="8" fontWeight="700" letterSpacing="4" fill={lf(5)} fontFamily="monospace"
          style={{ transition: "fill 0.5s" }}>
          OUTPUT
        </text>
        <text x={LX + LW - 10} y={OUT_Y + 14}
          fontSize="8" fill={MUTE} textAnchor="end" fontFamily="monospace">
          768d
        </text>

        {/* Output section divider */}
        {on(6) && (
          <line x1={LX} y1={OUT_Y + OUT_H + 18} x2={LX + LW} y2={OUT_Y + OUT_H + 18}
            stroke={DIM} strokeWidth="0.5" />
        )}
        {on(6) && (
          <text x={LX} y={OUT_Y + OUT_H + 32}
            fontSize="8" fontWeight="700" letterSpacing="4" fill={MUTE} fontFamily="monospace">
            GENERATED OUTPUT
          </text>
        )}
      </svg>

      {/* Generated output text — DOM for better text rendering */}
      {on(6) && (
        <div
          className="text-sm font-medium leading-relaxed"
          style={{
            color: INK,
            paddingLeft: `${(LX / VW) * 100}%`,
            paddingRight: `${(LX / VW) * 100}%`,
            marginTop: "-2px",
            opacity: on(6) ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        >
          {outputText}
          {phase === 6 && outputText.length < OUTPUTS[cycleIdx % OUTPUTS.length].length && (
            <span style={{ color: TEAL }}>▌</span>
          )}
        </div>
      )}
    </div>
  );
}
