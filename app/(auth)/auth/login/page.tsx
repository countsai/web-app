"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { GdprBadge } from "@/components/shared/gdpr-badge";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]       = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) { setError(authError.message); setGoogleLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Incorrect email or password."
        : authError.message);
      setLoading(false);
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.href = next || "/dashboard";
  };

  const inputBase = "w-full h-12 rounded-xl text-sm font-medium outline-none transition-all";
  const inputStyle = { background: "white", border: "1.5px solid #dbe9eb", color: "#0a3a44" };
  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#079DB3";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,151,178,0.12)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#dbe9eb";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="w-full space-y-8">

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
          Welcome back
        </h1>
        <p className="text-sm font-medium" style={{ color: "#5f7679" }}>
          Log in to your Counts AI account to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: "#85a0a4" }} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`${inputBase} pl-10 pr-4`}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-[11px] font-semibold hover:underline" style={{ color: "#079DB3" }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: "#85a0a4" }} />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              className={`${inputBase} pl-10 pr-10`}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
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
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in…
            </span>
          ) : (
            <><ArrowRight size={15} /> Log In</>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "#dbe9eb" }} />
        <span className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "#dbe9eb" }} />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-xl text-sm font-semibold transition-all hover:shadow-md disabled:opacity-60"
        style={{ background: "white", border: "1.5px solid #dbe9eb", color: "#0a3a44" }}
      >
        {googleLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
        )}
        Continue with Google
      </button>

      {/* Footer */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-center" style={{ color: "#5f7679" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-black hover:underline" style={{ color: "#079DB3" }}>
            Sign up — start free
          </Link>
        </p>
        <p className="text-center text-[11px] font-medium" style={{ color: "#85a0a4" }}>
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline" style={{ color: "#5f7679" }}>Terms</Link>
          {" "}and{" "}
          <Link href="/privacy-policy" className="underline" style={{ color: "#5f7679" }}>Privacy Policy</Link>.
        </p>
        <div className="flex justify-center">
          <GdprBadge />
        </div>
      </div>
    </div>
  );
}
