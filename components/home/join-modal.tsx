"use client";

import { useState } from "react";
import { GraduationCap, CheckCircle2, X } from "lucide-react";

export function JoinModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErr("Please enter your email."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/program-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (res.ok) setDone(true);
      else { const d = await res.json(); setErr(d.error || "Something went wrong."); }
    } catch { setErr("Network error."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: "rgba(7,26,36,0.65)", backdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl bg-white" style={{ border: "1px solid #D9E5E7" }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={15} style={{ color: "#8AABAE" }} />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-5" style={{ background: "#079DB3" }}>
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#071A24" }}>You&apos;re on the list!</h3>
            <p className="text-sm mb-6" style={{ color: "#4E6670" }}>
              Our team will contact you within 24 hours with program details.
            </p>
            <button onClick={onClose} className="px-8 py-3 rounded-full text-sm font-bold text-white" style={{ background: "#071A24" }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[11px] font-bold uppercase tracking-widest" style={{ background: "#e3f7fb", color: "#079DB3" }}>
              <GraduationCap size={11} /> 3-Month AI Program
            </div>
            <h3 className="text-2xl font-extrabold mb-2" style={{ color: "#071A24", letterSpacing: "-0.025em" }}>Express Your Interest</h3>
            <p className="text-sm mb-6" style={{ color: "#4E6670" }}>
              Tell us a bit about yourself. Our team will reach out with program details and pricing within 24 hours.
            </p>
            <form onSubmit={submit} className="space-y-3">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #D9E5E7", color: "#071A24" }}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; }}
                onBlur={e => { e.target.style.borderColor = "#D9E5E7"; }}
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email *"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #D9E5E7", color: "#071A24" }}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; }}
                onBlur={e => { e.target.style.borderColor = "#D9E5E7"; }}
              />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Your phone number (optional)"
                type="tel"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #D9E5E7", color: "#071A24" }}
                onFocus={e => { e.target.style.borderColor = "#079DB3"; }}
                onBlur={e => { e.target.style.borderColor = "#D9E5E7"; }}
              />
              {err && <p className="text-xs text-red-500">{err}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full text-sm font-bold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                style={{ background: "#071A24" }}
              >
                {submitting ? "Sending…" : "Join Now — It's Free"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

