"use client";

import Link from "next/link";
import { Book, MessageSquare, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function HelpCenterPage() {
  const categories = [
    { title: "Skill Passport", Icon: ShieldCheck, count: 12 },
    { title: "Verification Flow", Icon: Book, count: 8 },
    { title: "Job Matching", Icon: Search, count: 15 },
    { title: "Employer Suite", Icon: MessageSquare, count: 10 },
  ];

  const articles = [
    "How do I verify my Skill Passport?",
    "What is AI-powered job matching?",
    "How do I post a micro-project as an employer?",
    "Understanding your AI Replacement Risk score",
    "How does the 1-month interview guarantee work?",
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar active="FAQ" />

      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#e1f4f7", color: "#079DB3" }}>
              Support Center
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              How can we help?
            </h1>
            <p className="text-lg font-medium" style={{ color: "#5f7679" }}>
              Guides, FAQs and direct support for everything on the Counts AI Global Career Portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map(({ title, Icon, count }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 space-y-3 cursor-pointer transition-all hover:shadow-md" style={{ border: "1px solid #dbe9eb" }}>
                <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-black" style={{ color: "#0a3a44" }}>{title}</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>{count} Articles</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-4 sm:p-8 space-y-6" style={{ border: "1px solid #dbe9eb" }}>
              <h2 className="text-xl font-black" style={{ color: "#0a3a44" }}>Popular Articles</h2>
              <ul className="space-y-1">
                {articles.map((q, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 group cursor-pointer py-3"
                    style={{ borderTop: i === 0 ? "none" : "1px solid #eaf4f5" }}>
                    <span className="text-sm font-semibold transition-colors" style={{ color: "#33474b" }}>{q}</span>
                    <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "#079DB3" }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl p-4 sm:p-8 space-y-5" style={{ background: "#079DB3" }}>
              <h2 className="text-xl font-black" style={{ color: "white" }}>Still need help?</h2>
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                Our support team is on hand to help with any technical, billing or platform questions — no chatbots, real people.
              </p>
              <div className="space-y-3 pt-2">
                <Link href="/contact">
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90"
                    style={{ background: "#079DB3", color: "white" }}>
                    <MessageSquare size={16} /> Contact Support
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-colors"
                    style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                    Go to My Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
