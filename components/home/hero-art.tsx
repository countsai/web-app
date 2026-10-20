/**
 * Illustration parts for the hero diagram. Presentational SVG only (no animation logic).
 * Class names prefixed `hd-` are hooks for the GSAP timelines in hero-diagram.tsx.
 * All numbers shown in the agent cards are illustrative demo values, not real metrics.
 */

export const INK = "#0D1B20";
export const CYAN = "#079EAE";
export const SAGE = "#A9CFC4";
export const PAPER = "#F4F0E7";
export const CARD = "#FBF9F4";

const ink = (o: number) => `rgba(13,27,32,${o})`;
const SANS = "var(--font-sans), sans-serif";
const MONO = "var(--mono)";

/* ───────────────────────────── small primitives ───────────────────────────── */

function Cyl({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const ry = Math.min(7, h * 0.16);
  const rx = w / 2;
  return (
    <g fill="#EAF3F0" stroke={ink(0.7)} strokeWidth=".9">
      <path d={`M${x} ${y + ry} V${y + h - ry} A${rx} ${ry} 0 0 0 ${x + w} ${y + h - ry} V${y + ry}`} />
      <path d={`M${x} ${y + h * 0.42} A${rx} ${ry} 0 0 0 ${x + w} ${y + h * 0.42}`} fill="none" />
      <path d={`M${x} ${y + h * 0.68} A${rx} ${ry} 0 0 0 ${x + w} ${y + h * 0.68}`} fill="none" />
      <ellipse cx={x + rx} cy={y + ry} rx={rx} ry={ry} fill="#fff" />
    </g>
  );
}

function Node({ cx, cy, r = 3, fill = "#fff", stroke = ink(0.7) }: { cx: number; cy: number; r?: number; fill?: string; stroke?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth=".9" />;
}

function Win({ x, y, w, h, bar = true }: { x: number; y: number; w: number; h: number; bar?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={CARD} stroke={ink(0.62)} strokeWidth=".9" />
      {bar && (
        <>
          <path d={`M${x} ${y + 8}H${x + w}`} stroke={ink(0.25)} strokeWidth=".8" />
          <circle cx={x + 5} cy={y + 4} r="1.1" fill={ink(0.45)} />
          <circle cx={x + 9.5} cy={y + 4} r="1.1" fill={ink(0.3)} />
        </>
      )}
    </g>
  );
}

/* ───────────────────────────── input panels (126 × 80) ───────────────────────────── */

export const INPUT_W = 126;
export const INPUT_H = 80;

export function InputPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <g>
      <rect x="2" y="3.5" width={INPUT_W} height={INPUT_H} rx="8" fill={ink(0.1)} />
      <rect className="hd-src" width={INPUT_W} height={INPUT_H} rx="8" fill={CARD} fillOpacity=".94" stroke={ink(0.6)} strokeWidth="1.1" data-rs={ink(0.6)} />
      <path d="M9 1.6H117" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".9" />
      <circle className="hd-led" cx="13" cy="13" r="3" fill={CYAN} opacity=".35" />
      <text x="21" y="17" fontFamily={SANS} fontSize="11.5" fontWeight="600" fill={INK}>{label}</text>
      <path d="M7 22H119" stroke={ink(0.12)} />
      {/* illustration, scaled from its 108 × 66 design box */}
      <g transform="translate(8 25) scale(.76) translate(-10 -30)">{children}</g>
      {/* tiny readout column */}
      {[0, 1, 2].map((i) => (
        <rect key={i} className="hd-in-ind" x="99" y={34 + i * 11} width={16 - i * 3} height="4" rx="2" fill={CYAN} opacity=".45" />
      ))}
      <rect x="122" y="36" width="8" height="8" rx="1.6" fill={PAPER} stroke={ink(0.75)} strokeWidth=".9" />
    </g>
  );
}

export function WebsiteArt() {
  return (
    <g>
      <Win x={10} y={30} w={108} h={66} />
      <rect x="15" y="44" width="52" height="24" rx="2" fill={SAGE} opacity=".55" stroke={ink(0.4)} strokeWidth=".7" />
      <path d="M15 66 L30 54 L42 62 L50 56 L67 66" fill="none" stroke={ink(0.45)} strokeWidth=".8" />
      <path d="M74 47H110M74 54H104M74 61H108" stroke={ink(0.4)} strokeWidth="1.4" strokeLinecap="round" />
      {[15, 48, 81].map((x) => <rect key={x} x={x} y="74" width="30" height="16" rx="2" fill="#fff" stroke={ink(0.5)} strokeWidth=".8" />)}
    </g>
  );
}

export function EmailArt() {
  return (
    <g>
      <Win x={10} y={30} w={108} h={66} bar={false} />
      <path d="M10 41H118M64 41V96" stroke={ink(0.25)} strokeWidth=".8" />
      <rect x="15" y="34" width="14" height="4" rx="2" fill={CYAN} opacity=".7" />
      <path d="M20 50V84" stroke={ink(0.35)} strokeWidth=".8" />
      {[50, 64, 78].map((y, i) => (
        <g key={y}>
          <Node cx={20} cy={y} r={3} fill={i === 0 ? SAGE : "#fff"} />
          <path d={`M27 ${y - 1.5}H56M27 ${y + 3}H46`} stroke={ink(0.4)} strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ))}
      <rect x="72" y="50" width="38" height="26" rx="3" fill="#fff" stroke={ink(0.7)} strokeWidth=".9" />
      <path d="M72 52L91 66L110 52" fill="none" stroke={ink(0.7)} strokeWidth=".9" />
      <circle cx="91" cy="85" r="6" fill={SAGE} opacity=".6" stroke={ink(0.6)} strokeWidth=".8" />
    </g>
  );
}

export function SocialArt() {
  const c: [number, number] = [64, 62];
  const pts: [number, number][] = [[24, 42], [58, 36], [100, 42], [112, 68], [88, 90], [40, 86], [16, 66]];
  return (
    <g>
      <g stroke={ink(0.45)} strokeWidth=".9" fill="none">
        {pts.map(([x, y], i) => <path key={i} d={`M${c[0]} ${c[1]}L${x} ${y}`} />)}
        <path d="M24 42L58 36L100 42L112 68L88 90L40 86L16 66Z" strokeOpacity=".5" strokeDasharray="2 3" />
      </g>
      {pts.map(([x, y], i) => <Node key={i} cx={x} cy={y} r={i % 3 === 0 ? 4.5 : 3.4} fill={i % 2 ? "#fff" : SAGE} />)}
      <Node cx={c[0]} cy={c[1]} r={7} fill={SAGE} />
      <Node cx={c[0]} cy={c[1]} r={2.4} fill={CYAN} stroke={CYAN} />
    </g>
  );
}

export function CrmArt() {
  return (
    <g>
      {[34, 56, 78].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="34" height="15" rx="3" fill="#fff" stroke={ink(0.65)} strokeWidth=".9" />
          <circle cx="20" cy={y + 7.5} r="3" fill={i === 1 ? SAGE : "#fff"} stroke={ink(0.55)} strokeWidth=".8" />
          <path d={`M27 ${y + 6}H41M27 ${y + 10.5}H37`} stroke={ink(0.4)} strokeWidth="1.2" strokeLinecap="round" />
          <path d={`M46 ${y + 7.5}H58`} stroke={ink(0.55)} strokeWidth=".9" />
        </g>
      ))}
      <path d="M58 41.5V85.5M58 63.5H76" stroke={ink(0.55)} strokeWidth=".9" fill="none" />
      <Node cx={58} cy={63.5} r={3} fill={SAGE} />
      <rect x="76" y="58" width="9" height="11" rx="2" fill="#fff" stroke={ink(0.6)} strokeWidth=".8" />
      <Cyl x={89} y={38} w={26} h={48} />
    </g>
  );
}

export function DatabaseArt() {
  return (
    <g>
      <Cyl x={12} y={36} w={34} h={56} />
      <Cyl x={82} y={36} w={34} h={56} />
      <path d="M52 44q-6 0-6 6v26q0 6 6 6M76 44q6 0 6 6v26q0 6-6 6" fill="none" stroke={ink(0.55)} strokeWidth=".9" />
      {[50, 64, 78].map((y, i) => (
        <g key={y}>
          <path d={`M46 ${y}H82`} stroke={ink(0.4)} strokeWidth=".9" />
          <rect x="59" y={y - 3.5} width="10" height="7" rx="1.5" fill={i === 1 ? SAGE : "#fff"} stroke={ink(0.65)} strokeWidth=".8" />
        </g>
      ))}
    </g>
  );
}

/* ───────────────────────────── agent cards (142 × 100) ───────────────────────────── */

export const AGENT_W = 142;
export const AGENT_H = 100;

export type Metric = { label: string; base: number; amp: number; dec?: number; suffix?: string };

export function AgentCard({ name, role, accent, tint, metrics, children }: {
  name: string; role: string; accent: string; tint: string; metrics: Metric[]; children: React.ReactNode;
}) {
  return (
    <g className="hd-agent-in">
      <rect x="2" y="3.5" width={AGENT_W} height={AGENT_H} rx="9" fill={ink(0.1)} />
      <rect className="hd-agent-box" width={AGENT_W} height={AGENT_H} rx="9" fill={CARD} fillOpacity=".96" stroke={accent} strokeOpacity=".75" strokeWidth="1.1" data-rs={accent} />
      <rect className="hd-agent-wash" width={AGENT_W} height={AGENT_H} rx="9" fill={accent} fillOpacity="0" />
      <path d={`M0 9a9 9 0 0 1 9-9h${AGENT_W - 18}a9 9 0 0 1 9 9V27H0Z`} fill={tint} />
      <path d="M10 1.6H132" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".85" />
      <circle cx="13" cy="13.5" r="5" fill="#fff" stroke={accent} strokeWidth="1.2" />
      <circle className="hd-led2" cx="13" cy="13.5" r="2.2" fill={accent} opacity=".5" />
      <text x="23" y="13" fontFamily={SANS} fontSize="12.5" fontWeight="600" fill={INK}>{name}</text>
      <text x="23" y="23.5" fontFamily={SANS} fontSize="8.8" fill={ink(0.7)}>{role}</text>
      <path d={`M0 27H${AGENT_W}`} stroke={accent} strokeOpacity=".4" />

      {/* illustration (66 × 44 box at 6,31) */}
      <rect x="6" y="31" width="68" height="46" rx="4" fill="#fff" stroke={accent} strokeOpacity=".45" strokeWidth=".8" />
      <g transform="translate(6 31)">{children}</g>

      {/* demo metrics */}
      {metrics.map((m, i) => (
        <g key={m.label} transform={`translate(82 ${37 + i * 20})`}>
          <text fontFamily={MONO} fontSize="6.4" letterSpacing=".4" fill={ink(0.6)}>{m.label}</text>
          <text
            className="hd-num"
            y="14"
            fontFamily={SANS}
            fontSize="14"
            fontWeight="600"
            fill={INK}
            data-base={m.base}
            data-amp={m.amp}
            data-dec={m.dec ?? 0}
            data-suffix={m.suffix ?? ""}
          >
            {m.base.toFixed(m.dec ?? 0)}{m.suffix ?? ""}
          </text>
        </g>
      ))}

      {/* status strip */}
      <rect x="8" y="85" width="98" height="4" rx="2" fill={ink(0.1)} />
      <rect className="hd-prog" x="8" y="85" width="98" height="4" rx="2" fill={accent} opacity=".8" />
      <circle className="hd-led2" cx="116" cy="87" r="2.2" fill={accent} opacity=".5" />
      <text x="121" y="89.5" fontFamily={MONO} fontSize="6" fill={ink(0.55)}>LIVE</text>
      <rect x="-4" y="46" width="8" height="8" rx="1.6" fill={PAPER} stroke={ink(0.75)} strokeWidth=".9" />
    </g>
  );
}

export function NexaArt({ a }: { a: string }) {
  return (
    <g>
      <g fill="none" stroke={ink(0.45)} strokeWidth=".8">
        <path d="M8 10H20M8 23H20M8 36H20M20 10V36M20 23H28" />
      </g>
      {[10, 23, 36].map((y) => <circle key={y} className="hd-ind" cx="8" cy={y} r="2.8" fill="#fff" stroke={a} strokeWidth="1" opacity=".5" />)}
      <path className="hd-fun" d="M28 8H60L50 22V32L42 36V22Z" fill={a} fillOpacity=".2" stroke={a} strokeWidth="1" />
      <path d="M34 14H54M38 20H50" stroke={a} strokeOpacity=".6" strokeWidth=".8" />
      <circle className="hd-ind" cx="46" cy="40" r="2.2" fill={a} opacity=".5" />
    </g>
  );
}

export function OrionArt({ a }: { a: string }) {
  return (
    <g>
      <path className="hd-flowline" d="M10 14H24V30H38" fill="none" stroke={ink(0.5)} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="8" cy="14" r="4" fill="#fff" stroke={a} strokeWidth="1" />
      <rect x="36" y="6" width="26" height="14" rx="5" fill={a} fillOpacity=".18" stroke={a} strokeWidth=".9" />
      {[44, 49, 54].map((x, i) => <circle key={x} className="hd-ind" cx={x} cy="13" r="1.6" fill={a} opacity={0.4 + i * 0.1} />)}
      <rect x="30" y="26" width="30" height="14" rx="5" fill="#fff" stroke={ink(0.6)} strokeWidth=".9" />
      <path d="M36 31H54M36 35H48" stroke={ink(0.4)} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="36" r="3" fill={SAGE} stroke={ink(0.55)} strokeWidth=".8" />
    </g>
  );
}

export function LyraArt({ a }: { a: string }) {
  const nodes: [number, number][] = [[34, 8], [14, 24], [34, 24], [54, 24], [8, 38], [24, 38], [44, 38], [58, 38]];
  return (
    <g>
      <g fill="none" stroke={ink(0.45)} strokeWidth=".8">
        <path d="M34 8V16M14 16H54M14 16V24M34 16V24M54 16V24M14 30V32M8 32H24M8 32V38M24 32V38M34 30V32M44 32H58M44 32V38M58 32V38" />
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 6} y={y - 4} width="12" height="8" rx="2.4" fill="#fff" stroke={ink(0.6)} strokeWidth=".8" />
          <circle className="hd-ind" cx={x} cy={y} r="1.8" fill={a} opacity=".5" />
        </g>
      ))}
    </g>
  );
}

export function VestaArt({ a }: { a: string }) {
  return (
    <g>
      <path d="M4 40H64M4 28H64M4 16H64" stroke={ink(0.12)} strokeWidth=".7" />
      <g className="hd-chart">
        <path d="M4 38L16 30L26 34L38 18L48 24L60 10V40H4Z" fill={a} fillOpacity=".18" />
        <path className="hd-trace" d="M4 38L16 30L26 34L38 18L48 24L60 10" fill="none" stroke={a} strokeWidth="1.5" strokeLinejoin="round" pathLength={1} strokeDasharray="1" />
      </g>
      {[[16, 30], [38, 18], [60, 10]].map(([x, y]) => <circle key={x} className="hd-ind" cx={x} cy={y} r="2.4" fill="#fff" stroke={a} strokeWidth="1.1" opacity=".5" />)}
    </g>
  );
}

/* ───────────────────────────── 3D glass processor ───────────────────────────── */

export type Mat = { a: number; b: number; c: number; d: number; tx: number; ty: number };

/** Flat design box of the processor (before projection). */
export const FLAT = { w: 320, h: 220 };
/** Terminal positions in flat coordinates. */
export const TERM = {
  left: [40, 70, 110, 150, 180],
  right: [40, 85, 130, 175],
  top: [120, 140, 160, 180, 200],
  bottom: [130, 150, 170, 190],
};

export const proj = (m: Mat, x: number, y: number): [number, number] => [m.a * x + m.c * y + m.tx, m.b * x + m.d * y + m.ty];
export const matStr = (m: Mat) => `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.tx} ${m.ty})`;

export function GlassDefs({ k }: { k: string }) {
  return (
    <defs>
      <linearGradient id={`hd-glass-${k}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".98" />
        <stop offset=".55" stopColor="#E6F1EE" stopOpacity=".95" />
        <stop offset="1" stopColor="#C4DAD3" stopOpacity=".95" />
      </linearGradient>
      <linearGradient id={`hd-metal-${k}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F2F5F1" />
        <stop offset=".5" stopColor="#DCE5E0" />
        <stop offset="1" stopColor="#C3CFC9" />
      </linearGradient>
      <pattern id={`hd-brush-${k}`} width="4" height="3" patternUnits="userSpaceOnUse">
        <path d="M0 .5H4" stroke="rgba(13,27,32,.05)" strokeWidth=".6" />
      </pattern>
      <linearGradient id={`hd-sweepg-${k}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={CYAN} stopOpacity="0" />
        <stop offset=".45" stopColor="#7FE3EE" stopOpacity=".5" />
        <stop offset=".6" stopColor="#FFFFFF" stopOpacity=".55" />
        <stop offset="1" stopColor={CYAN} stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`hd-glow-${k}`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={CYAN} stopOpacity=".55" />
        <stop offset="1" stopColor={CYAN} stopOpacity="0" />
      </radialGradient>
      <clipPath id={`hd-clip-${k}`}>
        <rect x="0" y="0" width={FLAT.w} height={FLAT.h} rx="30" />
      </clipPath>
    </defs>
  );
}

function Terminal({ x, y }: { x: number; y: number }) {
  return <rect x={x - 4.5} y={y - 4.5} width="9" height="9" rx="2" fill="#EEF2EE" stroke={ink(0.75)} strokeWidth=".9" />;
}

export function GlassProcessor({ m, k, sides }: { m: Mat; k: string; sides: ("left" | "right" | "top" | "bottom")[] }) {
  const mt = matStr(m);
  const metal = ["#7F918D", "#8DA09B", "#9BADA8", "#A9BAB5", "#B7C6C1", "#C5D1CD", "#D3DCD8", "#E0E7E3"];
  return (
    <g className="hd-chip">
      {/* soft contact shadow, built from offset translucent copies (no blur filter) */}
      {[{ dy: 34, g: 8, o: 0.035 }, { dy: 28, g: 5, o: 0.05 }, { dy: 22, g: 2, o: 0.07 }].map(({ dy, g, o }) => (
        <g key={dy} transform={`translate(0 ${dy})`}>
          <g transform={mt}>
            <rect x={-g} y={-g} width={FLAT.w + 2 * g} height={FLAT.h + 2 * g} rx={30 + g} fill={INK} opacity={o} />
          </g>
        </g>
      ))}

      {/* brushed-metal extrusion */}
      {metal.map((c, i) => (
        <g key={c} transform={`translate(0 ${(metal.length - i) * 1.9})`}>
          <g transform={mt}>
            <rect x="0" y="0" width={FLAT.w} height={FLAT.h} rx="30" fill={c} stroke={ink(0.28)} strokeWidth=".9" />
          </g>
        </g>
      ))}

      {/* glass top, drawn in flat space then projected */}
      <g transform={mt}>
        <rect x="0" y="0" width={FLAT.w} height={FLAT.h} rx="30" fill={`url(#hd-glass-${k})`} stroke="#fff" strokeWidth="2" />
        <rect className="hd-edge" x="0" y="0" width={FLAT.w} height={FLAT.h} rx="30" fill="none" stroke={INK} strokeOpacity=".45" strokeWidth="1.1" data-rs={INK} data-rso=".45" />
        <rect className="hd-edge" x="7" y="7" width={FLAT.w - 14} height={FLAT.h - 14} rx="24" fill="none" stroke="#FFFFFF" strokeOpacity=".95" strokeWidth="1.6" data-rs="#FFFFFF" data-rso=".95" />
        <rect className="hd-edge" x="13" y="13" width={FLAT.w - 26} height={FLAT.h - 26} rx="19" fill="none" stroke={INK} strokeOpacity=".3" strokeWidth="1" data-rs={INK} data-rso=".3" />

        {/* cyan light beneath the glass */}
        <ellipse className="hd-glow" cx="160" cy="110" rx="130" ry="80" fill={`url(#hd-glow-${k})`} opacity=".45" />

        {/* inner metal plate */}
        <rect x="20" y="20" width="280" height="180" rx="14" fill={`url(#hd-metal-${k})`} fillOpacity=".92" stroke={ink(0.4)} strokeWidth="1" />
        <rect x="20" y="20" width="280" height="180" rx="14" fill={`url(#hd-brush-${k})`} />

        {/* windows */}
        <Win x={30} y={30} w={100} h={46} />
        <Win x={190} y={30} w={100} h={46} />
        <Win x={30} y={146} w={100} h={46} />
        <Win x={190} y={146} w={100} h={46} />

        {/* flow window */}
        <g>
          <path d="M42 58H118" stroke={ink(0.45)} strokeWidth=".9" />
          <Node cx={44} cy={58} r={4.5} stroke={CYAN} />
          <rect x="73" y="52" width="14" height="12" rx="2.5" fill="#fff" stroke={ink(0.65)} strokeWidth=".9" />
          <path d="M100 58l7 -6 7 6 -7 6Z" fill={SAGE} stroke={ink(0.65)} strokeWidth=".9" />
          <path d="M36 70H96" stroke={ink(0.25)} strokeWidth="1.6" strokeLinecap="round" />
        </g>
        {/* trend window */}
        <path d="M198 68L214 56L230 62L248 44L266 52L282 40" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M198 70H282" stroke={ink(0.25)} strokeWidth=".8" />
        {/* bars window */}
        {[0.35, 0.6, 0.45, 0.8, 0.55, 0.9].map((v, i) => (
          <rect key={i} x={38 + i * 14} y={186 - 28 * v} width="9" height={28 * v} rx="1.2" fill={i % 2 ? SAGE : "#fff"} stroke={ink(0.55)} strokeWidth=".8" />
        ))}
        {/* gauge window */}
        <path d="M208 182A22 22 0 0 1 252 182" fill="none" stroke={ink(0.3)} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M208 182A22 22 0 0 1 241 163" fill="none" stroke={CYAN} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M268 160V186M276 168V186" stroke={ink(0.4)} strokeWidth="2.4" strokeLinecap="round" />

        {/* identity panel */}
        <path d="M80 76V92H100M240 76V92H220M80 146V128H100M240 146V128H220" fill="none" stroke={ink(0.6)} strokeWidth="1" />
        <rect x="103" y="83" width="120" height="56" rx="11" fill={ink(0.12)} />
        <rect x="100" y="80" width="120" height="56" rx="11" fill={`url(#hd-glass-${k})`} stroke={INK} strokeOpacity=".7" strokeWidth="1.2" />
        <rect className="hd-edge" x="105" y="85" width="110" height="46" rx="8" fill="none" stroke={CYAN} strokeOpacity=".8" strokeWidth="1" data-rs={CYAN} data-rso=".8" />
        <text x="160" y="114" textAnchor="middle" fontFamily="var(--ch-serif), Georgia, serif" fontStyle="italic" fontSize="22" fill={INK}>Counts AI</text>

        {/* readouts */}
        <g fontFamily={MONO} fontSize="5.6" letterSpacing=".5" fill={ink(0.6)}>
          <text x="104" y="150">NODES 24</text>
          <text x="168" y="150">LINKS 09</text>
          <text x="136" y="196" textAnchor="middle">SYNC</text>
        </g>
        <rect x="118" y="160" width="84" height="14" rx="7" fill="#fff" stroke={ink(0.6)} strokeWidth=".9" />
        <text x="160" y="170" textAnchor="middle" fontFamily={MONO} fontSize="6.4" letterSpacing="1.2" fill={INK}>ORCHESTRATION</text>

        {/* internal traces from terminals */}
        <g fill="none" stroke={ink(0.5)} strokeWidth=".9">
          <path d={`M0 ${TERM.left[0]}H24V${TERM.left[4]}M0 ${TERM.left[1]}H24M0 ${TERM.left[2]}H24M0 ${TERM.left[3]}H24M24 108H100`} />
          <path d={`M320 ${TERM.right[0]}H296V${TERM.right[3]}M320 ${TERM.right[1]}H296M320 ${TERM.right[2]}H296M320 ${TERM.right[3]}H296M296 108H220`} />
        </g>

        {/* glowing nodes */}
        {[
          [24, 40], [24, 180], [24, 108], [296, 40], [296, 175], [296, 108],
          [80, 92], [240, 92], [80, 128], [240, 128], [44, 58], [160, 140],
        ].map(([nx, ny], i) => <circle key={i} className="hd-node" cx={nx} cy={ny} r="2.3" fill={CYAN} opacity=".35" />)}

        {/* reflections and animated highlight */}
        <g clipPath={`url(#hd-clip-${k})`}>
          <path d="M0 0H130L58 220H0Z" fill="#fff" opacity=".2" />
          <path d="M150 0H168L96 220H78Z" fill="#fff" opacity=".1" />
          <rect className="hd-sweep" x="-80" y="0" width="80" height={FLAT.h} fill={`url(#hd-sweepg-${k})`} opacity="0" />
        </g>

        {sides.includes("left") && TERM.left.map((ty) => <Terminal key={`l${ty}`} x={0} y={ty} />)}
        {sides.includes("right") && TERM.right.map((ty) => <Terminal key={`r${ty}`} x={FLAT.w} y={ty} />)}
        {sides.includes("top") && TERM.top.map((tx) => <Terminal key={`t${tx}`} x={tx} y={0} />)}
        {sides.includes("bottom") && TERM.bottom.map((tx) => <Terminal key={`b${tx}`} x={tx} y={FLAT.h} />)}
      </g>
    </g>
  );
}
