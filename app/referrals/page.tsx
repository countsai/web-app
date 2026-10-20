"use client";

import Link from "next/link";
import { Gift, Link2, TrendingUp, Wallet, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { REFERRAL_COMMISSION } from "@/lib/store";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import "@/components/home/info-pages.css";

const STEPS = [
  { icon: UserPlus, title: "Create a referral account", desc: "Sign up for a free referral account, separate from your Counts AI candidate account." },
  { icon: Link2, title: "Share your custom link", desc: "Get a unique referral link to share with friends, your network, or your audience." },
  { icon: TrendingUp, title: "They sign up & go Pro", desc: `When someone signs up with your link and upgrades to Pro, you earn $${REFERRAL_COMMISSION} commission.` },
  { icon: Wallet, title: "Get paid monthly", desc: "Track everything in your dashboard wallet and request a payout, processed monthly." },
];

export default function ReferralsLandingPage() {
  return (
    <div className={`ch ip ${serif.variable} ${mono.variable} ${display.variable}`}>
      <PublicNavbar />

      <main>
        <section className="ip-hero wave">
          <div className="wrap ip-hero-in">
            <div className="eyebrow"><Gift size={12} /> Referral partner programme</div>
            <h1>Earn ${REFERRAL_COMMISSION} for every friend <em>who goes Pro.</em></h1>
            <p className="lede">Share your custom referral link. When someone signs up to Counts AI and upgrades to a Pro plan, you earn ${REFERRAL_COMMISSION} commission, paid out monthly.</p>
            <div className="ip-btns">
              <Link href="/referrals/signup" className="btn btn-light primary"><UserPlus size={15} /> Create Referral Account</Link>
              <Link href="/referrals/login" className="btn btn-light"><LogIn size={15} /> Log In</Link>
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="eyebrow">How it works</div>
            <h2 className="h2 ip-h2">A simple way to earn, <em>four steps.</em></h2>
            <p className="lede" style={{ marginTop: 10 }}>A simple way to earn while helping people find their next AI career.</p>
            <div className="ip-cards c4">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="ip-card hov">
                  <span className="ip-num">0{i + 1}</span>
                  <span className="ip-ico"><Icon size={20} /></span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ip-band">
          <div className="wrap">
            <div>
              <h2>Ready to start <em>earning?</em></h2>
              <p>Creating a referral account takes less than a minute and is completely separate from your Counts AI candidate or business account.</p>
            </div>
            <Link href="/referrals/signup" className="btn btn-light" style={{ background: "#fff", color: "var(--ink)", borderColor: "#fff" }}>Get my referral link <ArrowRight size={14} /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
