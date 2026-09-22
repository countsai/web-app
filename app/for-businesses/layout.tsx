import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Businesses — Counts AI",
  description:
    "Scale your AI capability with Counts AI. We provide AI strategy, custom LLM development, AI agent deployment, and pre-vetted AI talent for UK and global enterprises.",
  openGraph: {
    title: "For Businesses — Counts AI",
    description:
      "AI strategy, LLM development, AI agents, and pre-vetted AI talent for enterprises.",
    url: "https://countsai.com/for-businesses",
    siteName: "Counts AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Businesses — Counts AI",
    description:
      "AI strategy, LLM development, AI agents, and pre-vetted AI talent for enterprises.",
  },
  alternates: { canonical: "https://countsai.com/for-businesses" },
};

export default function ForBusinessesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
