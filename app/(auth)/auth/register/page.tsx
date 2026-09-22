"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Building2, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AccountType = "jobseeker" | "business" | null;

interface FormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  contactName: string;
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const [step, setStep]               = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [showPw, setShowPw]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", password: "", phone: "",
    companyName: "", contactName: "",
  });

  const setField = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleStep1 = (type: AccountType) => { setAccountType(type); setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = accountType === "business"
      ? [form.companyName, form.contactName, form.email, form.password]
      : [form.fullName, form.email, form.password];
    if (required.some(v => !v.trim())) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);

    try {
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email, password: form.password, fullName: form.fullName,
          accountType, companyName: form.companyName, contactName: form.contactName,
        }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) {
        const errMsg = typeof regData.error === "string" ? regData.error
          : regData.error ? JSON.stringify(regData.error)
          : "Registration failed.";
        setError(errMsg);
        setLoading(false);
        return;
      }

      await supabase.auth.signInWithPassword({ email: form.email, password: form.password });

      if (refCode) {
        await fetch("/api/referrals/record-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: refCode, name: form.fullName, email: form.email }),
        }).catch(() => {});
      }

      window.location.href = accountType === "business" ? "/for-businesses" : "/onboarding";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

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

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
          {step === 2 ? "Create your account" : "Join Counts AI"}
        </h1>
        <p className="text-sm font-medium" style={{ color: "#5f7679" }}>
          {step === 2
            ? `Creating a ${accountType === "business" ? "business" : "job seeker"} account`
            : "Global AI Career Portal"}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2].map(s => (
          <div key={s} className="h-2 w-8 rounded-full transition-all"
            style={{ background: step >= s ? "#079DB3" : "#dbe9eb" }} />
        ))}
      </div>

      {/* STEP 1: Account type */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleStep1("jobseeker")}
            className="flex flex-col items-start gap-4 p-6 rounded-2xl text-left transition-all hover:shadow-md"
            style={{ border: "2px solid #dbe9eb", background: "white" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#079DB3"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#dbe9eb"; }}>
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "#e3f1f2" }}>
              <UserRound size={22} style={{ color: "#079DB3" }} />
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: "#0a3a44" }}>Job Seeker</p>
              <p className="text-[11px] mt-1 font-medium leading-snug" style={{ color: "#85a0a4" }}>
                Find roles, auto-apply, track applications
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black" style={{ color: "#079DB3" }}>
              Free to start <ArrowRight size={11} />
            </div>
          </button>

          <button onClick={() => handleStep1("business")}
            className="flex flex-col items-start gap-4 p-6 rounded-2xl text-left transition-all hover:shadow-md"
            style={{ border: "2px solid #dbe9eb", background: "white" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0a3a44"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#dbe9eb"; }}>
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "#f0f0f5" }}>
              <Building2 size={22} style={{ color: "#0a3a44" }} />
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: "#0a3a44" }}>Business</p>
              <p className="text-[11px] mt-1 font-medium leading-snug" style={{ color: "#85a0a4" }}>
                Post roles, source talent, manage hiring
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black" style={{ color: "#079DB3" }}>
              First role free <ArrowRight size={11} />
            </div>
          </button>
        </div>
      )}

      {/* STEP 2: Details form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
              {error}
            </div>
          )}

          {accountType === "business" ? (
            <>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Company Name</label>
                <input value={form.companyName} onChange={setField("companyName")} placeholder="Acme Ltd"
                  className={inputBase} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Contact Name</label>
                <input value={form.contactName} onChange={setField("contactName")} placeholder="Jane Smith"
                  className={inputBase} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Full Name</label>
                <input value={form.fullName} onChange={setField("fullName")} placeholder="Alex Johnson"
                  className={inputBase} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>
                  Phone / WhatsApp <span className="normal-case font-normal opacity-60">(optional)</span>
                </label>
                <input value={form.phone} onChange={setField("phone")} placeholder="+44 7000 000000"
                  className={inputBase} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Email Address</label>
            <input type="email" value={form.email} onChange={setField("email")} placeholder="you@example.com"
              className={inputBase} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={form.password} onChange={setField("password")}
                placeholder="At least 8 characters" className={`${inputBase} pr-10`} style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => { setStep(1); setError(""); }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
              style={{ background: "#e3f1f2", color: "#079DB3" }}>
              <ArrowLeft size={14} />
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "#079DB3" }}>
              {loading
                ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creating…</>
                : <><ArrowRight size={14} /> Create Account</>}
            </button>
          </div>
        </form>
      )}

      <p className="text-[11px] font-medium" style={{ color: "#85a0a4" }}>
        Already have an account?{" "}
        <Link href="/auth/login" className="font-black hover:underline" style={{ color: "#079DB3" }}>Log in</Link>
        {" "}· By signing up you agree to our{" "}
        <Link href="/terms" className="underline" style={{ color: "#5f7679" }}>Terms</Link>
        {" "}and{" "}
        <Link href="/privacy-policy" className="underline" style={{ color: "#5f7679" }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full" />}>
      <RegisterContent />
    </Suspense>
  );
}
