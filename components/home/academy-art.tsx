/** Bright isometric illustrations for the Academy cards. Pure SVG; motion is CSS (see home.css, .aa-*). */

const INK = "#0D1B20";

function Tile({ cx, cy, w, h, a, layers = 1, fill = "#fff" }: { cx: number; cy: number; w: number; h: number; a: string; layers?: number; fill?: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + layers * 7 + h} rx={w * 0.9} ry={h * 0.55} fill={INK} opacity=".07" />
      {Array.from({ length: layers }).map((_, i) => {
        const y = cy + (layers - 1 - i) * 8;
        return (
          <g key={i}>
            <path d={`M${cx - w} ${y}L${cx} ${y + h}L${cx + w} ${y}V${y + 7}L${cx} ${y + h + 7}L${cx - w} ${y + 7}Z`} fill={a} fillOpacity=".28" stroke={a} strokeOpacity=".5" />
            <polygon points={`${cx},${y - h} ${cx + w},${y} ${cx},${y + h} ${cx - w},${y}`} fill={fill} stroke={a} strokeOpacity=".6" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

const lbl = { fontFamily: "var(--mono)", fontSize: 7.5, fill: "rgba(13,27,32,.62)", textAnchor: "middle" as const, letterSpacing: ".04em" };

function Flow({ d, color, delay = 0 }: { d: string; color: string; delay?: number }) {
  return (
    <g>
      <path className="aa-path" d={d} fill="none" stroke={color} strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round" />
      <circle className="aa-sig" r="2.8" fill={color} style={{ offsetPath: `path("${d}")`, animationDelay: `${delay}s` }} />
    </g>
  );
}

function EngArt() {
  const c = "#079EAE";
  return (
    <svg viewBox="0 0 190 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="aeg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4FBF8" /><stop offset="1" stopColor="#DFF3EE" /></linearGradient>
        <radialGradient id="aeh" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={c} stopOpacity=".38" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="190" height="230" fill="url(#aeg)" />
      <ellipse cx="95" cy="108" rx="70" ry="34" fill="url(#aeh)" />
      <Flow d="M95 100C 70 118, 52 124, 46 140" color={c} />
      <Flow d="M95 100C 120 104, 140 110, 148 124" color={c} delay={1.4} />
      <Flow d="M95 100C 90 140, 86 160, 88 186" color="#2FA79A" delay={2.6} />
      {/* LLM */}
      <Tile cx={95} cy={74} w={40} h={18} a={c} layers={2} />
      <text x="95" y="79" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="12" fontWeight="700" fill={INK}>LLM</text>
      <circle className="aa-node" cx="128" cy="84" r="2.4" fill={c} />
      {/* RAG */}
      <Tile cx={46} cy={142} w={24} h={11} a={c} />
      <path d="M40 137h12v10H40zM43 140h6M43 143h6" fill="#fff" stroke={c} strokeWidth="1" />
      <text x="46" y="168" {...lbl}>RAG</text>
      {/* Agents */}
      <Tile cx={148} cy={126} w={24} h={11} a={c} />
      <g fill="#fff" stroke={c} strokeWidth="1"><circle cx="142" cy="127" r="2.6" /><circle cx="154" cy="124" r="2.6" /><circle cx="150" cy="134" r="2.6" /><path d="M144 127L152 125M143 129L148 133M153 127L151 131" fill="none" /></g>
      <text x="148" y="152" {...lbl}>Agents</text>
      <circle className="aa-node" cx="168" cy="118" r="2.2" fill={c} style={{ animationDelay: ".8s" }} />
      {/* Vector DB */}
      <Tile cx={88} cy={190} w={26} h={12} a={c} />
      <g fill="#fff" stroke={c} strokeWidth="1"><path d="M82 188v8c0 2 12 2 12 0v-8" /><ellipse cx="88" cy="188" rx="6" ry="2.4" /></g>
      <text x="88" y="216" {...lbl}>Vector DB</text>
      <circle className="aa-node" cx="30" cy="172" r="2.2" fill={c} style={{ animationDelay: "1.6s" }} />
    </svg>
  );
}

function DeployArt() {
  const c = "#6C63E0", c2 = "#5B8DEF";
  return (
    <svg viewBox="0 0 190 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="adg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F5F7FE" /><stop offset="1" stopColor="#E6EAFB" /></linearGradient>
        <radialGradient id="adh" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={c} stopOpacity=".3" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="190" height="230" fill="url(#adg)" />
      <ellipse cx="95" cy="118" rx="64" ry="32" fill="url(#adh)" />
      <Flow d="M46 56C 70 70, 80 92, 95 108" color={c2} />
      <Flow d="M146 52C 128 70, 112 92, 95 108" color={c} delay={1} />
      <Flow d="M46 188C 66 166, 80 140, 95 120" color={c} delay={2} />
      <Flow d="M146 190C 128 166, 112 140, 95 120" color={c2} delay={3} />
      {/* center module */}
      <Tile cx={95} cy={102} w={38} h={17} a={c} layers={3} />
      <g fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round"><path d="M85 100h20M85 105h20" /></g>
      <circle className="aa-node" cx="106" cy="100" r="1.8" fill={c} />
      {/* APIs */}
      <Tile cx={46} cy={56} w={24} h={11} a={c2} />
      <text x="46" y="59" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fontWeight="600" fill={c2}>{"{ }"}</text>
      <text x="46" y="80" {...lbl}>APIs</text>
      {/* Docker */}
      <Tile cx={146} cy={50} w={24} h={11} a={c2} />
      <g fill="#fff" stroke={c2} strokeWidth=".9"><rect x="136" y="49" width="5" height="4" /><rect x="142" y="49" width="5" height="4" /><rect x="148" y="49" width="5" height="4" /><rect x="139" y="44" width="5" height="4" /><rect x="145" y="44" width="5" height="4" /></g>
      <text x="146" y="74" {...lbl}>Docker</text>
      {/* Cloud */}
      <Tile cx={46} cy={190} w={24} h={11} a={c2} />
      <path d="M38 192a5 5 0 0 1 9-3 4.500 4.500 0 0 1 8 3 3.500 3.500 0 0 1-1 6H40a3.500 3.500 0 0 1-2-6z" fill="#fff" stroke={c2} strokeWidth="1" />
      <text x="46" y="216" {...lbl}>Cloud</text>
      {/* Production */}
      <Tile cx={146} cy={190} w={24} h={11} a={c} />
      <g fill="#fff" stroke={c} strokeWidth="1"><rect x="138" y="184" width="16" height="5" rx="1" /><rect x="138" y="191" width="16" height="5" rx="1" /></g>
      <circle className="aa-node" cx="151" cy="186.500" r="1.200" fill={c} style={{ animationDelay: "1.2s" }} />
      <text x="146" y="216" {...lbl}>Production</text>
    </svg>
  );
}

export function AcademyArt({ kind }: { kind: "eng" | "deploy" }) {
  return kind === "eng" ? <EngArt /> : <DeployArt />;
}
