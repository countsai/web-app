import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Training Program — Counts AI",
  description:
    "A 3-month programme covering Generative AI, Agent Development, and Forward Deployed Engineering. Earn industry-recognised certificates and gain real consultancy experience.",
  openGraph: {
    title: "AI Training Program — Counts AI",
    description:
      "3-month AI programme: GenAI, FDE, and AI Agent Development. Earn certificates. Land AI jobs.",
    url: "https://countsai.com/training",
    siteName: "Counts AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Training Program — Counts AI",
    description:
      "3-month AI programme: GenAI, FDE, and AI Agent Development. Earn certificates. Land AI jobs.",
  },
  alternates: { canonical: "https://countsai.com/training" },
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
