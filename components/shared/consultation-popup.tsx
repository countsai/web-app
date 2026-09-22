"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1",  flag: "🇺🇸", name: "US" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+61",  flag: "🇦🇺", name: "AU" },
  { code: "+49",  flag: "🇩🇪", name: "DE" },
  { code: "+33",  flag: "🇫🇷", name: "FR" },
  { code: "+1",   flag: "🇨🇦", name: "CA" },
  { code: "+65",  flag: "🇸🇬", name: "SG" },
  { code: "+60",  flag: "🇲🇾", name: "MY" },
  { code: "+234", flag: "🇳🇬", name: "NG" },
  { code: "+254", flag: "🇰🇪", name: "KE" },
  { code: "+27",  flag: "🇿🇦", name: "ZA" },
];

const INTERESTS = [
  "3-Month AI Training Program",
  "AI Jobs & Career Support",
  "Resume Builder / CV Review",
  "AI Consulting for Business",
  "Remote AI Workforce",
  "AI Application Development",
  "General Enquiry",
];

interface Props {
  onClose: () => void;
}

export function ConsultationPopup({ onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [interestedIn, setInterestedIn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !interestedIn) { setError("Please fill in all fields."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, countryCode, interestedIn }),
      });
      if (res.ok) { setDone(true); }
      else { const d = await res.json(); setError(d.error || "Something went wrong."); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: "rgba(10,58,68,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-[820px] rounded-3xl overflow-hidden shadow-2xl flex" style={{ minHeight: 420, background: "white" }}>

        {/* Left — form */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.png" alt="Counts AI" style={{ height: 28, objectFit: "contain" }} />
          </div>

          {done ? (
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-black" style={{ background: "#079DB3" }}>✓</div>
              <h2 className="text-2xl font-black" style={{ color: "#0a3a44" }}>We&apos;ll be in touch!</h2>
              <p className="text-sm" style={{ color: "#5f7679" }}>
                A member of our team will contact you within 24 hours to discuss how Counts AI can help you.
              </p>
              <button onClick={onClose}
                className="mt-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                style={{ background: "#079DB3" }}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black mb-1" style={{ color: "#0a3a44", letterSpacing: "-0.03em" }}>
                Get Free
              </h2>
              <h2 className="text-3xl font-black mb-6" style={{ color: "#079DB3", letterSpacing: "-0.03em" }}>
                Consultation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-full text-sm font-medium outline-none transition-all"
                  style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44", background: "white" }}
                />

                {/* Email */}
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address" type="email"
                  className="w-full px-4 py-3 rounded-full text-sm font-medium outline-none transition-all"
                  style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44", background: "white" }}
                />

                {/* Phone */}
                <div className="flex gap-2">
                  <div className="relative">
                    <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                      className="appearance-none pl-3 pr-7 py-3 rounded-full text-sm font-semibold outline-none cursor-pointer"
                      style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44", background: "white", minWidth: 80 }}>
                      {COUNTRY_CODES.map(c => (
                        <option key={`${c.code}-${c.name}`} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }} />
                  </div>
                  <input
                    value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="Phone Number" type="tel"
                    className="flex-1 px-4 py-3 rounded-full text-sm font-medium outline-none"
                    style={{ border: "1.5px solid #dbe9eb", color: "#0a3a44" }}
                  />
                </div>

                {/* Interest */}
                <div className="relative">
                  <select value={interestedIn} onChange={e => setInterestedIn(e.target.value)}
                    className="appearance-none w-full px-4 py-3 rounded-full text-sm font-medium outline-none cursor-pointer"
                    style={{ border: "1.5px solid #dbe9eb", color: interestedIn ? "#0a3a44" : "#85a0a4", background: "white" }}>
                    <option value="">Interested In</option>
                    {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#85a0a4" }} />
                </div>

                {error && <p className="text-xs text-red-500 px-1">{error}</p>}

                <div className="pt-1">
                  <button type="submit" disabled={submitting}
                    className="w-full py-3 rounded-full text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: "#079DB3" }}>
                    {submitting ? "Sending…" : "Submit"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Right — visual */}
        <div className="hidden sm:flex w-[45%] flex-col items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a3a44 0%, #079DB3 60%, #4ecdc4 100%)" }}>
          {/* Decorative lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute" style={{ top: "10%", right: "-20%", width: "80%", height: "2px", background: "rgba(255,255,255,0.12)", transform: "rotate(-35deg)", transformOrigin: "left" }} />
            <div className="absolute" style={{ top: "25%", right: "-20%", width: "70%", height: "1px", background: "rgba(255,255,255,0.08)", transform: "rotate(-35deg)", transformOrigin: "left" }} />
            <div className="absolute" style={{ top: "55%", right: "-20%", width: "80%", height: "2px", background: "rgba(255,255,255,0.10)", transform: "rotate(-35deg)", transformOrigin: "left" }} />
          </div>
          <div className="relative z-10 text-center px-8">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-white font-black text-xl leading-tight mb-2">Build Your Career<br/>in AI</p>
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Training · Jobs · Business</p>
          </div>
        </div>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          style={{ color: "#85a0a4" }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
