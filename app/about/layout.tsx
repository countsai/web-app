import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Counts AI",
  description:
    "Counts AI is a UK-based AI consultancy and training platform helping professionals build careers in AI — through certifications, real project experience, and job placement support.",
  openGraph: {
    title: "About Counts AI",
    description:
      "UK AI consultancy and training platform — certifications, project experience, job placement.",
    url: "https://countsai.com/about",
    siteName: "Counts AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Counts AI",
    description:
      "UK AI consultancy and training platform — certifications, project experience, job placement.",
  },
  alternates: { canonical: "https://countsai.com/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
