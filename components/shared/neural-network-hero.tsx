"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

interface Signal {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  opacity: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

export function NeuralNetworkHero({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const isMobile = window.innerWidth < 768;
    const NODE_COUNT = isMobile ? 28 : 55;
    const CONNECTION_DISTANCE = isMobile ? 90 : 130;
    const SIGNAL_CHANCE = 0.0012;

    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const signals: Signal[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      nodes.length = 0;
      connections.length = 0;
      signals.length = 0;

      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: Math.random() * 1.8 + 1.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.012,
          layer: Math.floor(Math.random() * 4),
        });
      }

      buildConnections(w, h);
    };

    const buildConnections = (w: number, h: number) => {
      connections.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.min(CONNECTION_DISTANCE, Math.max(w, h) * 0.22);
          if (dist < maxDist) {
            connections.push({
              from: i,
              to: j,
              opacity: 1 - dist / maxDist,
            });
          }
        }
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        // Soft bounce
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.x = Math.max(0, Math.min(w, node.x));
        node.y = Math.max(0, Math.min(h, node.y));

        // Mouse influence
        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120) {
          const force = (120 - mdist) / 120 * 0.3;
          node.vx -= (mdx / mdist) * force;
          node.vy -= (mdy / mdist) * force;
          // Dampen to prevent runaway
          node.vx *= 0.96;
          node.vy *= 0.96;
        }
      });

      // Rebuild connections periodically would be expensive; draw from existing
      // Draw connections
      const layerColors = [
        "rgba(0,151,178,",
        "rgba(0,180,212,",
        "rgba(0,97,120,",
        "rgba(0,151,178,",
      ];

      connections.forEach((conn) => {
        const a = nodes[conn.from];
        const b = nodes[conn.to];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = CONNECTION_DISTANCE;
        if (dist > maxDist) return;

        const fade = 1 - dist / maxDist;
        const color = layerColors[nodes[conn.from].layer] ?? "rgba(0,151,178,";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `${color}${(fade * 0.18).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Spawn signals
      if (connections.length > 0 && Math.random() < SIGNAL_CHANCE * connections.length) {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        signals.push({
          fromNode: conn.from,
          toNode: conn.to,
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
          opacity: 0.9,
        });
      }

      // Draw & update signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        sig.progress += sig.speed;
        if (sig.progress >= 1) {
          signals.splice(i, 1);
          continue;
        }

        const from = nodes[sig.fromNode];
        const to = nodes[sig.toNode];
        const x = from.x + (to.x - from.x) * sig.progress;
        const y = from.y + (to.y - from.y) * sig.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,212,${sig.opacity * (1 - sig.progress * 0.5)})`;
        ctx.fill();

        // Trailing glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, `rgba(0,151,178,${sig.opacity * 0.4 * (1 - sig.progress)})`);
        gradient.addColorStop(1, "rgba(0,151,178,0)");
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw nodes
      nodes.forEach((node) => {
        const pulseFactor = Math.sin(node.pulse) * 0.4 + 0.6;
        const r = node.radius * pulseFactor;
        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const mouseBoost = mdist < 100 ? (100 - mdist) / 100 : 0;

        // Node core
        const alpha = 0.35 + pulseFactor * 0.35 + mouseBoost * 0.3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,151,178,${alpha})`;
        ctx.fill();

        // Node glow ring
        if (mouseBoost > 0.3 || pulseFactor > 0.85) {
          const glowR = r + 3 + mouseBoost * 4;
          const g = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, glowR);
          g.addColorStop(0, `rgba(0,180,212,${(0.15 + mouseBoost * 0.2) * pulseFactor})`);
          g.addColorStop(1, "rgba(0,180,212,0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resize();
    init();

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(draw);
    } else {
      // Static render for reduced motion
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      connections.forEach((conn) => {
        const a = nodes[conn.from];
        const b = nodes[conn.to];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(0,151,178,0.12)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,151,178,0.4)";
        ctx.fill();
      });
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
