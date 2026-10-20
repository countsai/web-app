import type { Metadata } from "next";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { Portfolio } from "./portfolio";

export const metadata: Metadata = {
  title: "Midhun Mahesan | AI Engineer & Founder, Counts AI",
  description:
    "Midhun Mahesan, Founder & Director of Counts AI. AI engineer and forward deployed engineer building production AI systems: RAG, agentic workflows and multimodal products.",
  alternates: { canonical: "https://countsai.com/midhun" },
  openGraph: {
    title: "Midhun Mahesan | AI Engineer & Founder, Counts AI",
    description: "I build AI systems that work in the real world.",
    url: "https://countsai.com/midhun",
    type: "profile",
  },
};

export default function MidhunPage() {
  return (
    <>
      <PublicNavbar />
      <Portfolio />
      <SiteFooter />
    </>
  );
}
