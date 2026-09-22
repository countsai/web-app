"use client";

import Link from "next/link";
import { Gift, Link2, TrendingUp, Wallet, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { REFERRAL_COMMISSION } from "@/lib/store";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create a referral account",
    desc: "Sign up for a free referral account — separate from your Counts AI candidate account.",
  },
  {
    icon: Link2,
    title: "Share your custom link",
    desc: "Get a unique referral link to share with friends, your network, or your audience.",
  },
  {
    icon: TrendingUp,
    title: "They sign up & go Pro",
    desc: `When someone signs up with your link and upgrades to Pro, you earn $${REFERRAL_COMMISSION} commission.`,
  },
  {
    icon: Wallet,
    title: "Get paid monthly",
    desc: "Track everything in your dashboard wallet and request a payout — processed monthly.",
  },
];

export default function ReferralsLandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 sm:px-6 py-16 sm:py-24" style={{ background: "linear-gradient(160deg, #0a3a44 0%, #114954 60%, #079DB3 130%)" }}>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "rgba(255,255,255,0.1)", color: "#079DB3" }}>
              <Gift size={12} /> Referral Partner Programme
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Earn ${REFERRAL_COMMISSION} for every friend<br className="hidden sm:block" /> who goes Pro
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
              Share your custom referral link. When someone signs up to Counts AI and upgrades to a Pro plan,
              you earn ${REFERRAL_COMMISSION} commission — paid out monthly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/referrals/signup"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: "#079DB3" }}>
                <UserPlus size={15} /> Create Referral Account
              </Link>
              <Link href="/referrals/login"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
                <LogIn size={15} /> Log In
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
                How it works
              </h2>
              <p className="text-sm md:text-base font-medium max-w-xl mx-auto" style={{ color: "#5f7679" }}>
                A simple way to earn while helping people find their next AI career.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="bg-white rounded-2xl p-6 space-y-3 relative" style={{ border: "1px solid #dbe9eb" }}>
                  <div className="absolute top-4 right-4 text-[11px] font-black" style={{ color: "#cfe1e4" }}>0{i + 1}</div>
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-black" style={{ color: "#0a3a44" }}>{title}</h3>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: "#5f7679" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden p-8 sm:p-12 text-center space-y-5"
            style={{ background: "white", border: "1px solid #dbe9eb" }}>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              Ready to start earning?
            </h2>
            <p className="text-sm md:text-base font-medium max-w-xl mx-auto" style={{ color: "#5f7679" }}>
              Creating a referral account takes less than a minute and is completely separate from your
              Counts AI candidate or business account.
            </p>
            <Link href="/referrals/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: "#079DB3" }}>
              <ArrowRight size={15} /> Get my referral link
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
