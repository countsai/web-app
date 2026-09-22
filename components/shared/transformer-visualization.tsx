"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RotateCw, ChevronDown, Plus } from "lucide-react";

const OUTPUTS = [
  "The future of work is being redefined by AI, creating new opportunities for those who build with it.",
  "Artificial intelligence is transforming every industry — those who understand it will shape the next era.",
  "The most in-demand skill of the coming decade is the ability to design, deploy, and scale AI systems.",
  "Building with AI requires systems thinking, engineering discipline, and the ability to deploy under real constraints.",
];

const LAYERS = [
  { label: "Embedding", dim: "768",   x: 88,  color: "#079DB3", alpha: 0.9 },
  { label: "Attention",  dim: "1024",  x: 206, color: "#079DB3", alpha: 0.7 },
  { label: "Feed Forward",dim: "4096", x: 324, color: "#079DB3", alpha: 0.55 },
  { label: "Output",     dim: "768",   x: 442, color: "#079DB3", alpha: 0.85 },
];

const TOKENS = ["The", "future", "of", "work", "is"];

interface Signal {
  layerIdx: number;
  progress: number;
  y: number;
}

export function TransformerVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(256);
  const [outputText, setOutputText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [signals, setSignals] = useState<Signal[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const pickOutput = useCallback((temp: number) => {
    return OUTPUTS[Math.floor(temp * OUTPUTS.length) % OUTPUTS.length];
  }, []);

  const regenerate = useCallback(() => {
    if (generating) return;
    setGenerating(true);
    setOutputText("");

    if (intervalRef.current) clearInterval(intervalRef.current);

    const target = pickOutput(temperature);
    const speed = Math.max(1, Math.ceil(maxTokens / 200));

    // Trigger signals animation
    setSignals([]);
    let progress = 0;
    const animSignal = () => {
      progress += 0.025;
      if (progress <= 1) {
        setSignals([
          { layerIdx: 0, progress: Math.min(progress * 4, 1), y: 0.35 },
          { layerIdx: 1, progress: Math.max(0, Math.min((progress - 0.2) * 4, 1)), y: 0.5 },
          { layerIdx: 2, progress: Math.max(0, Math.min((progress - 0.4) * 4, 1)), y: 0.65 },
          { layerIdx: 3, progress: Math.max(0, Math.min((progress - 0.6) * 4, 1)), y: 0.45 },
        ]);
        animRef.current = requestAnimationFrame(animSignal);
      } else {
        setSignals([]);
        // Start text typewriter
        let i = 0;
        intervalRef.current = setInterval(() => {
          i += speed;
          setOutputText(target.slice(0, Math.min(i, target.length)));
          if (i >= target.length) {
            setOutputText(target);
            if (intervalRef.current) clearInterval(intervalRef.current);
            setGenerating(false);
          }
        }, 28);
      }
    };
    animRef.current = requestAnimationFrame(animSignal);
  }, [generating, temperature, maxTokens, pickOutput]);

  // Auto-run on mount
  useEffect(() => {
    const t = setTimeout(regenerate, 700);
    return () => {
      clearTimeout(t);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw the architecture canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const layerW = 56;
    const layerH = 180;
    const layerY = (H - layerH) / 2;

    // Draw connection lines between layers
    for (let i = 0; i < LAYERS.length - 1; i++) {
      const from = LAYERS[i];
      const to = LAYERS[i + 1];
      const x1 = from.x * (W / 560) + layerW;
      const x2 = to.x * (W / 560);
      const numLines = 5;
      for (let j = 0; j < numLines; j++) {
        const t = (j + 1) / (numLines + 1);
        const y1 = layerY + layerH * (0.2 + (j % 3) * 0.2);
        const y2 = layerY + layerH * (0.25 + (j % 4) * 0.18);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + (x2 - x1) * 0.4, y1, x1 + (x2 - x1) * 0.6, y2, x2, y2);
        ctx.strokeStyle = `rgba(0,151,178,${0.08 + t * 0.06})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // Draw layers
    LAYERS.forEach((layer) => {
      const x = layer.x * (W / 560);
      const numRows = 10;

      // Layer background
      const grad = ctx.createLinearGradient(x, layerY, x + layerW, layerY + layerH);
      grad.addColorStop(0, `rgba(0,151,178,${layer.alpha * 0.12})`);
      grad.addColorStop(0.5, `rgba(0,151,178,${layer.alpha * 0.2})`);
      grad.addColorStop(1, `rgba(0,151,178,${layer.alpha * 0.08})`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, layerY, layerW, layerH);

      // Border
      ctx.strokeStyle = `rgba(0,151,178,${layer.alpha * 0.35})`;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x, layerY, layerW, layerH);

      // Internal node rows
      for (let r = 0; r < numRows; r++) {
        const ny = layerY + (layerH / (numRows + 1)) * (r + 1);
        const numDots = r % 3 === 0 ? 4 : r % 3 === 1 ? 3 : 5;
        for (let d = 0; d < numDots; d++) {
          const nx = x + (layerW / (numDots + 1)) * (d + 1);
          ctx.beginPath();
          ctx.arc(nx, ny, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,151,178,${layer.alpha * 0.5})`;
          ctx.fill();
        }
        // Horizontal connection line
        ctx.beginPath();
        ctx.moveTo(x + 4, ny);
        ctx.lineTo(x + layerW - 4, ny);
        ctx.strokeStyle = `rgba(0,151,178,${layer.alpha * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    // Draw active signal overlays
    signals.forEach((sig) => {
      if (sig.progress <= 0 || sig.progress >= 1) return;
      const layer = LAYERS[sig.layerIdx];
      const x = layer.x * (W / 560);
      const y = layerY + layerH * sig.y;
      const px = x + layerW * sig.progress;

      ctx.beginPath();
      ctx.arc(px, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,180,212,0.9)";
      ctx.fill();

      // Trailing glow
      const g = ctx.createRadialGradient(px, y, 0, px, y, 10);
      g.addColorStop(0, "rgba(0,180,212,0.3)");
      g.addColorStop(1, "rgba(0,180,212,0)");
      ctx.beginPath();
      ctx.arc(px, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

  }, [signals]);

  const SliderControl = ({
    label, value, min, max, step, onChange,
  }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8AABAE" }}>{label}</span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color: "#071A24" }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "#079DB3", background: `linear-gradient(to right, #079DB3 ${((value - min) / (max - min)) * 100}%, #D9E5E7 ${((value - min) / (max - min)) * 100}%)` }}
      />
    </div>
  );

  return (
    <div
      className="relative rounded-xl overflow-hidden select-none"
      style={{
        background: "#F5F8F8",
        border: "1px solid #D9E5E7",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "#D9E5E7", background: "#ffffff" }}>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#079DB3" }}>
          Transformer Architecture
        </span>
        <button className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded border" style={{ color: "#4E6670", borderColor: "#D9E5E7", background: "#F5F8F8" }}>
          GPT-4o (demo) <ChevronDown size={9} />
        </button>
      </div>

      <div className="grid grid-cols-[1fr_auto]">
        {/* Left: architecture + tokens + output */}
        <div className="p-4 space-y-3 min-w-0">

          {/* Layer labels */}
          <div className="flex gap-0" style={{ paddingLeft: "14px" }}>
            {LAYERS.map((l) => (
              <div key={l.label} className="flex-1 text-center">
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#079DB3" }}>{l.label}</div>
                <div className="text-[9px] font-medium tabular-nums" style={{ color: "#8AABAE" }}>{l.dim}</div>
              </div>
            ))}
          </div>

          {/* Canvas for architecture */}
          <div className="relative" style={{ height: "130px" }}>
            <canvas
              ref={canvasRef}
              width={560}
              height={200}
              className="w-full h-full"
              aria-hidden="true"
            />
          </div>

          {/* Input tokens */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#8AABAE" }}>Input Tokens</div>
              <div className="space-y-0.5">
                {TOKENS.map((tok) => (
                  <div key={tok} className="text-[11px] px-2 py-0.5 rounded" style={{ background: "#ffffff", border: "1px solid #D9E5E7", color: "#071A24" }}>
                    {tok}
                  </div>
                ))}
                <button className="flex items-center gap-1 text-[9px] font-medium" style={{ color: "#8AABAE" }}>
                  <Plus size={9} /> Add token
                </button>
              </div>
            </div>

            {/* Generated output */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#8AABAE" }}>Generated Output</div>
              <div
                className="rounded p-2 text-[11px] leading-snug min-h-[80px]"
                style={{ background: "#ffffff", border: "1px solid #D9E5E7", color: "#071A24" }}
              >
                {outputText}
                {generating && <span className="inline-block w-0.5 h-3 ml-0.5 animate-pulse" style={{ background: "#079DB3" }} />}
              </div>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div className="w-[130px] border-l p-3 space-y-4 flex flex-col" style={{ borderColor: "#D9E5E7", background: "#ffffff" }}>
          <div className="space-y-3">
            <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#8AABAE" }}>Adjust Parameters</div>
            <SliderControl label="Temperature" value={temperature} min={0.1} max={1.0} step={0.1} onChange={setTemperature} />
            <SliderControl label="Top P" value={topP} min={0.1} max={1.0} step={0.1} onChange={setTopP} />
            <SliderControl label="Max Tokens" value={maxTokens} min={64} max={512} step={64} onChange={setMaxTokens} />
          </div>

          <button
            onClick={regenerate}
            disabled={generating}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded text-[10px] font-bold transition-all disabled:opacity-40"
            style={{ background: "#071A24", color: "#ffffff" }}
          >
            <RotateCw size={10} className={generating ? "animate-spin" : ""} />
            Regenerate
          </button>

          <div className="pt-2 border-t space-y-1.5" style={{ borderColor: "#D9E5E7" }}>
            <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#8AABAE" }}>Adjust weights</div>
            <div className="text-[9px] leading-snug" style={{ color: "#8AABAE" }}>
              See the difference in real time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
