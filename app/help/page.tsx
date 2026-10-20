"use client";

import Link from "next/link";
import { Book, MessageSquare, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import "@/components/home/info-pages.css";

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
    <div className={`ch ip ${serif.variable} ${mono.variable} ${display.variable}`}>
      <PublicNavbar active="FAQ" />

      <main>
        <section className="ip-hero wave center">
          <div className="wrap ip-hero-in">
            <div className="eyebrow">Support centre</div>
            <h1>How can <em>we help?</em></h1>
            <p className="lede">Guides, FAQs and direct support for everything on the Counts AI Global Career Portal.</p>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="eyebrow">Browse topics</div>
            <h2 className="h2 ip-h2">Find your <em>answer.</em></h2>
            <div className="ip-cards c4">
              {categories.map(({ title, Icon, count }) => (
                <div key={title} className="ip-card hov">
                  <span className="ip-ico"><Icon size={20} /></span>
                  <h3>{title}</h3>
                  <small>{count} articles</small>
                </div>
              ))}
            </div>

            <div className="ip-split">
              <div className="ip-panel">
                <h2>Popular articles</h2>
                <ul className="ip-list">
                  {articles.map((q) => (
                    <li key={q}><span>{q}</span><ArrowRight size={15} /></li>
                  ))}
                </ul>
              </div>
              <div className="ip-panel dark">
                <h2>Still need help?</h2>
                <p>Our support team is on hand to help with any technical, billing or platform questions. No chatbots, real people.</p>
                <div className="ip-btns" style={{ flexDirection: "column" }}>
                  <Link href="/contact" className="btn btn-light primary" style={{ justifyContent: "center" }}><MessageSquare size={15} /> Contact Support</Link>
                  <Link href="/auth/login" className="btn btn-light" style={{ justifyContent: "center" }}>Go to My Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
