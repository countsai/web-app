"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "countsai_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] px-4 sm:px-6 py-4 shadow-2xl" style={{ background: "#072830", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
          <Cookie size={18} style={{ color: "#079DB3" }} />
        </div>
        <p className="text-xs font-medium leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          We use cookies to improve your experience, analyse traffic, and personalise content. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies. Read our{" "}
          <Link href="/privacy-policy" className="underline hover:text-white" style={{ color: "rgba(255,255,255,0.8)" }}>Privacy Policy</Link>{" "}
          and{" "}
          <Link href="/gdpr" className="underline hover:text-white" style={{ color: "rgba(255,255,255,0.8)" }}>GDPR Compliance</Link>{" "}
          for more details.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleChoice("declined")}
            className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}>
            Decline
          </button>
          <button
            onClick={() => handleChoice("accepted")}
            className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            style={{ background: "#079DB3" }}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
