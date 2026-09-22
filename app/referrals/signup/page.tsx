"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Gift } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function ReferralSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputBase = "w-full h-12 rounded-xl text-sm font-medium outline-none transition-all px-4";
  const inputStyle = { background: "white", border: "1.5px solid #dbe9eb", color: "#0a3a44" };
  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#079DB3";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.12)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#dbe9eb";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/referrals/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push("/referrals/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#e1f4f7", color: "#079DB3" }}>
              <Gift size={12} /> Referral Partner Programme
            </span>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
              Create your referral account
            </h1>
            <p className="text-sm font-medium" style={{ color: "#5f7679" }}>
              Separate from your Counts AI candidate or business account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl p-6 sm:p-8" style={{ border: "1px solid #dbe9eb" }}>
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith"
                className={inputBase} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className={inputBase} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters" className={`${inputBase} pr-10`} style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "#079DB3" }}>
              {loading ? (
                <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creating…</>
              ) : (
                <><ArrowRight size={14} /> Create Account</>
              )}
            </button>

            <p className="text-center text-[11px] font-medium" style={{ color: "#85a0a4" }}>
              Already have a referral account?{" "}
              <Link href="/referrals/login" className="font-black hover:underline" style={{ color: "#079DB3" }}>Log in</Link>
            </p>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
