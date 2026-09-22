"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Crown, ArrowRight } from "lucide-react";

const PREMIUM_FEATURES = [
  "Access to premium job listings",
  "1:1 mentoring sessions",
  "Counts AI training & certification",
  "Unlimited referrals",
  "Resume ATS optimisation",
  "AI job matching",
  "Auto-apply to 500+ jobs",
];

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("counts_pending_plan");
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#eef6f7" }}>
        <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#eef6f7" }}>

      <Link href="/" className="mb-10">
        <Image src="/logo-light.png" alt="CountsAI" width={140} height={40} className="object-contain" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm overflow-hidden text-center"
        style={{ border: "1px solid #dbe9eb" }}>

        <div className="px-8 py-5" style={{ background: "#079DB3" }}>
          <p className="text-white font-black text-base">Account Activated</p>
        </div>

        <div className="p-10 space-y-6">
          <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "#e3f1f2" }}>
            <Crown size={32} style={{ color: "#079DB3" }} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
              style={{ background: "#079DB3", color: "white" }}>
              Premium Activated
            </div>
            <h1 className="text-2xl font-black mt-3" style={{ color: "#0a3a44" }}>
              Welcome to Premium!
            </h1>
            <p className="text-sm font-medium" style={{ color: "#5f7679" }}>
              Your 7-day free trial is now live. No charge until your trial ends.
            </p>
          </div>

          <div className="rounded-2xl p-4 text-left space-y-2" style={{ background: "#f4fafb", border: "1px solid #dbe9eb" }}>
            {PREMIUM_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#33474b" }}>
                <CheckCircle2 size={13} style={{ color: "#079DB3" }} /> {f}
              </div>
            ))}
          </div>

          <Link href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 w-full justify-center"
            style={{ background: "#079DB3" }}>
            <ArrowRight size={15} /> Go to Dashboard
          </Link>
        </div>
      </div>

      <p className="text-center text-[11px] font-medium mt-6" style={{ color: "#85a0a4" }}>
        Manage billing anytime from your account settings
      </p>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#eef6f7" }}>
        <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
