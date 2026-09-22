"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number; // 0 to 100
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreGauge({ score, label, size = "md", className }: ScoreGaugeProps) {
  const radius = size === "sm" ? 30 : size === "md" ? 60 : 90;
  const stroke = size === "sm" ? 6 : size === "md" ? 10 : 14;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 30) return "text-accent";
    if (s < 60) return "text-warning";
    return "text-destructive";
  };

  const getBgColor = (s: number) => {
    if (s < 30) return "stroke-accent/10";
    if (s < 60) return "stroke-warning/10";
    return "stroke-destructive/10";
  };

  const sizes = {
    sm: "h-24 w-24 text-xl",
    md: "h-48 w-48 text-4xl",
    lg: "h-64 w-64 text-6xl",
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          className={cn("transition-colors duration-500", getBgColor(score))}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={cn("transition-colors duration-500", getColor(score))}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("font-black tracking-tighter", getColor(score), sizes[size])}>
          {score}%
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
