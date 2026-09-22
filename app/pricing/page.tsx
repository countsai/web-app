"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore, RAZORPAY_PRO_BUTTON_ID } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { PublicNavbar } from "@/components/shared/public-nav";
import { RazorpayButton } from "@/components/shared/razorpay-button";
import { SiteFooter } from "@/components/shared/site-footer";
import {
  CheckCircle, ArrowRight, Sparkles, Award, Crown,
  Bot, GraduationCap, Users, FileText, Zap, Star,
  BarChart2, Gift,
} from "lucide-react";

const PREMIUM_FEATURES = [
  { icon: Star,         text: "Access to premium job listings",              desc: "Exclusive roles only visible to Premium members — higher salaries, top employers, faster interviews." },
  { icon: Users,        text: "1:1 mentoring sessions",                      desc: "Monthly one-on-one calls with a senior career advisor who knows your industry and target companies." },
  { icon: GraduationCap, text: "Counts AI training & certification",         desc: "Complete structured AI career courses and earn a Counts AI certification recognised by our employer network." },
  { icon: Gift,         text: "Unlimited referrals",                         desc: "Refer unlimited contacts to our network and earn rewards for every successful placement." },
  { icon: FileText,     text: "Resume ATS optimisation",                     desc: "Our team rewrites your CV with semantic keyword injection to pass any applicant tracking system." },
  { icon: BarChart2,    text: "AI job matching",                             desc: "Smart matching engine scores every live role against your profile and surfaces only the best-fit opportunities." },
  { icon: Bot,          text: "Auto-apply to 500+ jobs",                     desc: "Our engine auto-submits tailored applications to over 500 matched roles on your behalf — while you sleep." },
  { icon: Award,        text: "92% placement success rate",                  desc: "9 out of 10 Premium members secure a job offer within 30 days of activating their profile." },
];

const FREE_FEATURES = [
  "Browse free job listings",
  "Basic profile creation",
  "Apply to free-tier roles manually",
  "Access public career resources",
];

export default function PricingPage() {
  const { currentPlan, proExpiresAt } = useStore();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  const price = billing === "annual" ? "£22" : "£29";
  const annualTotal = "£264";

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session);
      setUserEmail(session?.user.email);
    })();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#eef6f7" }}>

      {/* ── Navbar ── */}
      <PublicNavbar active="Career Pro" />

      {/* ── Hero ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center" style={{ background: "linear-gradient(180deg, #079DB3 0%, #16a3ba 60%, #eef6f7 100%)" }}>
        <div className="max-w-3xl mx-auto space-y-5">
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-white/15 text-white border border-white/20">
            <Crown size={11} /> Premium Membership
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-white">
            One plan.<br />
            <span style={{ color: "#079DB3" }}>Everything you need.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto font-medium">
            Unlock premium jobs, 1:1 mentoring, AI tools, and a 92% placement success rate — all in one membership.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="inline-flex p-1 bg-white/10 rounded-xl border border-white/15">
              {(["monthly", "annual"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className={`px-5 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${billing === cycle ? "bg-white text-[#079DB3] shadow-md" : "text-white/60 hover:text-white"}`}
                >
                  {cycle === "annual" ? "Annual (Save 25%)" : "Monthly"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="px-4 sm:px-6 -mt-6 pb-12 sm:pb-16">
        <div className="max-w-xl mx-auto flex flex-col gap-5">

          {/* Free card */}
          <div className={`relative rounded-3xl border-2 bg-white overflow-hidden shadow-sm transition-all ${currentPlan === "Free" ? "border-[#079DB3]" : "border-[#cfe1e4]"}`}>
            <div className="px-6 py-6" style={{ background: "#eef6f7" }}>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-1 text-[#546d71]">Basic Access</p>
              <h3 className="text-2xl font-black text-[#0a3a44]">Free</h3>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-4xl font-black text-[#0a3a44]">£0</span>
                <span className="text-sm font-medium text-[#546d71]">/ month</span>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-xs text-[#546d71] font-medium leading-relaxed mb-4">Browse and apply to free-tier job listings with a basic profile.</p>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle size={14} className="text-[#85a0a4] shrink-0" />
                  <span className="text-xs font-medium text-[#33474b]">{f}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              {currentPlan === "Free" ? (
                <div className="w-full py-3 rounded-2xl bg-emerald-100 text-emerald-700 text-sm font-black text-center flex items-center justify-center gap-2">
                  <CheckCircle size={15} /> Current Plan
                </div>
              ) : (
                <p className="text-center text-xs font-medium text-[#85a0a4] py-3">
                  You&apos;ll return to Free automatically when your Pro plan expires.
                </p>
              )}
            </div>
          </div>

          {/* Premium card */}
          <div className={`relative rounded-3xl border-2 bg-white overflow-hidden shadow-lg transition-all ${currentPlan === "Premium" ? "border-[#079DB3] shadow-[#079DB3]/20" : "border-[#079DB3]/40 hover:shadow-xl hover:border-[#079DB3]"}`}>
            <div className="absolute top-4 right-4">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full bg-[#079DB3] text-white">
                Most Popular
              </span>
            </div>
            <div className="px-6 py-6" style={{ background: "#079DB3" }}>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-1 text-white/60">Full Access</p>
              <h3 className="text-2xl font-black text-white">Premium</h3>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-4xl font-black text-white">{price}</span>
                <span className="text-sm font-medium text-white/60">/ month</span>
                {billing === "annual" && (
                  <span className="text-xs font-black ml-2" style={{ color: "#079DB3" }}>{annualTotal}/yr · Save 25%</span>
                )}
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-xs text-[#546d71] font-medium leading-relaxed mb-4">Everything you need to land your next AI role — fast.</p>
              {PREMIUM_FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#e3f1f2]">
                      <Icon size={12} className="text-[#079DB3]" />
                    </div>
                    <span className="text-xs font-medium text-[#16282b]">{f.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="px-6 pb-6">
              {currentPlan === "Premium" ? (
                <div className="w-full py-3 rounded-2xl bg-emerald-100 text-emerald-700 text-sm font-black text-center flex items-center justify-center gap-2">
                  <CheckCircle size={15} />
                  {proExpiresAt
                    ? `Active until ${new Date(proExpiresAt).toLocaleDateString()}`
                    : "Active Plan"}
                </div>
              ) : loggedIn ? (
                <div className="flex justify-center">
                  <RazorpayButton paymentButtonId={RAZORPAY_PRO_BUTTON_ID} prefillEmail={userEmail} />
                </div>
              ) : (
                <Link
                  href="/auth/register"
                  className="w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
                  style={{ background: "#079DB3" }}
                >
                  Sign Up to Upgrade <ArrowRight size={14} />
                </Link>
              )}
              <p className="text-center text-[10px] text-[#546d71] mt-2 font-medium">
                {currentPlan === "Premium" ? "Pro unlocks automatically for 30 days after payment" : "Pay securely via Razorpay · 30-day Pro access"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature deep-dives ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-y border-[#cfe1e4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-[#e3f1f2] text-[#079DB3]">
              <Sparkles size={11} /> Premium Features
            </span>
            <h2 className="text-4xl font-black tracking-tight text-[#16282b]">
              Everything included. <span style={{ color: "#079DB3" }}>Zero compromises.</span>
            </h2>
            <p className="text-[#546d71] font-medium max-w-xl mx-auto">
              One Premium membership unlocks every tool and advantage we offer — nothing held back.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PREMIUM_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-7 rounded-3xl border-2 border-[#cfe1e4] bg-white hover:border-[#079DB3]/30 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: "#079DB3" }}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#16282b] leading-tight">{f.text}</h3>
                      <p className="text-sm text-[#546d71] font-medium leading-relaxed mt-2">{f.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 92% success callout ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, #079DB3 0%, #16a3ba 100%)" }}>
        <div className="max-w-4xl mx-auto text-center text-white space-y-6">
          <div className="text-7xl font-black" style={{ color: "#079DB3" }}>92%</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            of Premium members land a job offer<br />
            <span style={{ color: "#079DB3" }}>within 30 days.</span>
          </h2>
          <p className="text-lg text-white/65 max-w-2xl mx-auto font-medium">
            With AI job matching, auto-apply to 500+ roles, resume ATS optimisation, and 1:1 mentoring — our members don&apos;t wait months. They land fast.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            {[
              { stat: "500+", label: "Jobs auto-applied per member" },
              { stat: "1:1", label: "Dedicated mentoring sessions" },
              { stat: "∞", label: "Referrals & certifications" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center">
                <p className="text-3xl font-black" style={{ color: "#079DB3" }}>{item.stat}</p>
                <p className="text-sm font-semibold mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          {currentPlan === "Premium" ? (
            <div className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <Crown size={16} /> You&apos;re on Career Pro
            </div>
          ) : loggedIn ? (
            <div className="flex justify-center">
              <RazorpayButton paymentButtonId={RAZORPAY_PRO_BUTTON_ID} />
            </div>
          ) : (
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-colors shadow-xl text-white"
              style={{ background: "#079DB3" }}
            >
              <Zap size={16} /> Get Premium Access
            </Link>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <SiteFooter />
    </div>
  );
}
