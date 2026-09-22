"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

export function RocketBoostNotice({
  icon: Icon, iconBg, iconColor, title, body, ctaHref, ctaLabel,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-10 rounded-2xl" style={{ background: "white", border: "1.5px solid #dbe9eb" }}>
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: iconBg }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div>
        <h3 className="text-base font-black" style={{ color: "#0a3a44" }}>{title}</h3>
        <p className="text-sm font-medium mt-1 max-w-sm" style={{ color: "#85a0a4" }}>{body}</p>
      </div>
      <Link href={ctaHref}
        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
        style={{ background: "#079DB3" }}>
        {ctaLabel} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
