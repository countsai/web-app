import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Jobs — Counts AI",
  description:
    "Browse AI engineering, ML, and Forward Deployed Engineering roles. Find your next AI job with visa sponsorship, remote options, and salary transparency.",
  openGraph: {
    title: "AI Jobs — Counts AI",
    description:
      "AI engineering, ML, and FDE roles. Remote-friendly, visa sponsorship available.",
    url: "https://countsai.com/jobs",
    siteName: "Counts AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Jobs — Counts AI",
    description:
      "AI engineering, ML, and FDE roles. Remote-friendly, visa sponsorship available.",
  },
  alternates: { canonical: "https://countsai.com/jobs" },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
