"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Mail, Lock, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin]           = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !pin) { setError("All fields are required."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, pin }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Invalid email, password or access code.");
        setLoading(false);
        return;
      }
      window.location.href = "/admin/dashboard";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const fieldBase = "w-full h-11 rounded-xl text-sm font-medium outline-none transition-all px-4";
  const fieldStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#dbe9eb",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #07111f 0%, #0a3a44 60%, #072830 100%)" }}
    >
      {/* Logo */}
      <Link href="/" className="mb-10 opacity-60 hover:opacity-100 transition-opacity">
        <Image src="/logo.png" alt="CountsAI" width={120} height={34} className="object-contain" />
      </Link>

      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3"
            style={{ background: "rgba(242,126,82,0.15)", color: "#079DB3", border: "1px solid rgba(242,126,82,0.25)" }}>
            <Shield size={10} /> Staff Access Only
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
            Restricted — authorised personnel only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@countsai.com"
                className={`${fieldBase} pl-10`} style={fieldStyle}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; e.target.style.background = "rgba(255,255,255,0.09)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${fieldBase} pl-10 pr-10`} style={fieldStyle}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; e.target.style.background = "rgba(255,255,255,0.09)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Admin Access Code */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              Admin Access Code
            </label>
            <div className="relative">
              <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="password" value={pin} onChange={e => setPin(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className={`${fieldBase} pl-10 tracking-[0.3em]`} style={fieldStyle}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; e.target.style.background = "rgba(255,255,255,0.09)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
            style={{ background: "#079DB3" }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Authenticating…
              </span>
            ) : (
              <><ArrowRight size={15} /> Enter Admin Portal</>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] font-medium mt-8" style={{ color: "rgba(255,255,255,0.15)" }}>
          Counts AI · Co Reg No. 16375927 · Restricted System
        </p>
      </div>
    </div>
  );
}
