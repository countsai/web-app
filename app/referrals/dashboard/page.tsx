"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy, Check, Wallet, Users, Gift, LogOut,
  CheckCircle2, Clock, Banknote,
} from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { REFERRAL_COMMISSION } from "@/lib/store";

interface ReferralAccount {
  id: string;
  name: string;
  email: string;
  code: string;
  wallet_balance: number;
  total_earned: number;
  created_at: string;
}

interface ReferredSignup {
  id: string;
  name: string;
  email: string;
  status: "pending" | "success";
  signed_up_at: string;
  converted_at: string | null;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: "requested" | "paid";
  requested_at: string;
  paid_at: string | null;
}

export default function ReferralDashboardPage() {
  const router = useRouter();

  const [account, setAccount] = useState<ReferralAccount | null>(null);
  const [referrals, setReferrals] = useState<ReferredSignup[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [copied, setCopied] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState("");
  const [payoutError, setPayoutError] = useState("");
  const [origin, setOrigin] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    const load = async () => {
      try {
        const res = await fetch("/api/referrals/me");
        if (!res.ok) {
          router.replace("/referrals/login");
          return;
        }
        const data = await res.json();
        setAccount(data.account);
        setReferrals(data.referrals ?? []);
        setPayouts(data.payouts ?? []);
      } finally {
        setReady(true);
      }
    };
    load();
  }, [router]);

  if (!ready || !account) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
        <PublicNavbar />
        <main className="flex-1" />
        <SiteFooter />
      </div>
    );
  }

  const referralLink = `${origin}/auth/register?ref=${account.code}`;
  const pendingPayout = payouts.find((p) => p.status === "requested");

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestPayout = async () => {
    setPayoutMsg("");
    setPayoutError("");
    const res = await fetch("/api/referrals/payout", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setPayoutError(data.error ?? "Something went wrong.");
      return;
    }
    setPayoutMsg("Payout requested! Our team has been notified and will process it monthly.");
    setPayouts((prev) => [
      { id: `temp-${Date.now()}`, amount: account.wallet_balance, status: "requested", requested_at: new Date().toISOString(), paid_at: null },
      ...prev,
    ]);
    setAccount((prev) => (prev ? { ...prev, wallet_balance: 0 } : prev));
  };

  const handleLogout = async () => {
    await fetch("/api/referrals/logout", { method: "POST" });
    router.push("/referrals/login");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ background: "#e1f4f7", color: "#079DB3" }}>
                <Gift size={12} /> Referral Partner Programme
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
                Welcome back, {account.name.split(" ")[0]}
              </h1>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors hover:bg-gray-50"
              style={{ background: "white", color: "#5f7679", border: "1px solid #dbe9eb" }}>
              <LogOut size={13} /> Log Out
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 space-y-2" style={{ border: "1px solid #dbe9eb" }}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                <Wallet size={18} />
              </div>
              <p className="text-2xl font-black" style={{ color: "#0a3a44" }}>${account.wallet_balance.toFixed(2)}</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>Wallet Balance</p>
            </div>
            <div className="bg-white rounded-2xl p-6 space-y-2" style={{ border: "1px solid #dbe9eb" }}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                <Banknote size={18} />
              </div>
              <p className="text-2xl font-black" style={{ color: "#0a3a44" }}>${account.total_earned.toFixed(2)}</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>Total Earned</p>
            </div>
            <div className="bg-white rounded-2xl p-6 space-y-2" style={{ border: "1px solid #dbe9eb" }}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                <Users size={18} />
              </div>
              <p className="text-2xl font-black" style={{ color: "#0a3a44" }}>{referrals.length}</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#85a0a4" }}>Total Referrals</p>
            </div>
          </div>

          {/* Referral link */}
          <div className="bg-white rounded-2xl p-6 space-y-3" style={{ border: "1px solid #dbe9eb" }}>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Your Referral Link</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input readOnly value={referralLink}
                className="flex-1 h-12 rounded-xl text-sm font-medium px-4 outline-none"
                style={{ background: "#f4fafb", border: "1.5px solid #dbe9eb", color: "#0a3a44" }} />
              <button onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: "#079DB3" }}>
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Link</>}
              </button>
            </div>
            <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>
              Your referral code: <strong style={{ color: "#0a3a44" }}>{account.code}</strong> · Earn ${REFERRAL_COMMISSION} when someone signs up with your link and upgrades to Pro.
            </p>
          </div>

          {/* Payout */}
          <div className="bg-white rounded-2xl p-6 space-y-3" style={{ border: "1px solid #dbe9eb" }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black" style={{ color: "#0a3a44" }}>Request Payout</p>
                <p className="text-xs font-medium mt-1" style={{ color: "#5f7679" }}>
                  Payouts are processed monthly. Requesting will notify our team.
                </p>
              </div>
              <button onClick={handleRequestPayout} disabled={!!pendingPayout || account.wallet_balance <= 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#079DB3" }}>
                <Banknote size={14} /> Request Payout
              </button>
            </div>
            {payoutMsg && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669" }}>
                {payoutMsg}
              </div>
            )}
            {payoutError && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                {payoutError}
              </div>
            )}
            {pendingPayout && !payoutMsg && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#b45309" }}>
                Payout of ${pendingPayout.amount.toFixed(2)} requested on {new Date(pendingPayout.requested_at).toLocaleDateString()} — pending monthly processing.
              </div>
            )}
          </div>

          {/* Referrals list */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #dbe9eb" }}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #dbe9eb" }}>
              <p className="text-sm font-black" style={{ color: "#0a3a44" }}>Your Referrals</p>
            </div>
            {referrals.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium" style={{ color: "#85a0a4" }}>
                  No referrals yet. Share your link to start earning.
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "#dbe9eb" }}>
                {referrals.map((r) => (
                  <div key={r.id} className="px-6 py-4 flex flex-wrap items-center justify-between gap-3" style={{ borderColor: "#dbe9eb" }}>
                    <div>
                      <p className="text-sm font-black" style={{ color: "#0a3a44" }}>{r.name}</p>
                      <p className="text-xs font-medium" style={{ color: "#85a0a4" }}>
                        Signed up {new Date(r.signed_up_at).toLocaleDateString()}
                      </p>
                    </div>
                    {r.status === "success" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
                        style={{ background: "#ecfdf5", color: "#059669" }}>
                        <CheckCircle2 size={12} /> Referral Success · +${REFERRAL_COMMISSION}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
                        style={{ background: "#f4fafb", color: "#85a0a4" }}>
                        <Clock size={12} /> Pending Pro Upgrade
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
