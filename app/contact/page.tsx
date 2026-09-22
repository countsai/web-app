"use client";

import { useState } from "react";
import { MessageSquare, Mail, MapPin, Send, ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef6f7" }}>
      <PublicNavbar active="Contact" />

      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          <div className="space-y-10">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ background: "#e1f4f7", color: "#079DB3" }}>
                Get in touch
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: "#0a3a44" }}>
                We&apos;d love to hear from you.
              </h1>
              <p className="text-lg font-medium max-w-md" style={{ color: "#5f7679" }}>
                Whether you&apos;re a candidate with a question or a business looking to hire — our team replies within
                one business day.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { Icon: Mail, label: "Email", value: "info@counts.ai" },
                { Icon: MessageSquare, label: "Support", value: "support@counts.ai" },
                { Icon: MapPin, label: "Office", value: "Counts AI Ltd, London, United Kingdom" },
              ].map(({ Icon, label, value }, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#e1f4f7", color: "#079DB3" }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>{label}</p>
                    <p className="text-base font-bold" style={{ color: "#0a3a44" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden h-fit" style={{ border: "1px solid #dbe9eb" }}>
            <div className="px-4 sm:px-8 py-5" style={{ background: "#079DB3" }}>
              <p className="text-white font-black text-base">Send us a message</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>We typically respond within 24 hours</p>
            </div>

            {sent ? (
              <div className="p-6 sm:p-10 text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                  <Send size={22} />
                </div>
                <h3 className="text-xl font-black" style={{ color: "#0a3a44" }}>Message sent</h3>
                <p className="text-sm font-medium" style={{ color: "#5f7679" }}>
                  Thanks for reaching out — a member of our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Full Name</label>
                  <input required className="w-full h-11 px-4 rounded-xl text-sm font-medium outline-none transition-all"
                    style={{ background: "#f4fafb", border: "1px solid #dbe9eb", color: "#0a3a44" }}
                    placeholder="John Doe"
                    onFocus={e => { e.target.style.borderColor = "#079DB3"; e.target.style.background = "white"; }}
                    onBlur={e => { e.target.style.borderColor = "#dbe9eb"; e.target.style.background = "#f4fafb"; }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Subject</label>
                  <select className="w-full h-11 px-4 rounded-xl text-sm font-medium outline-none transition-all appearance-none"
                    style={{ background: "#f4fafb", border: "1px solid #dbe9eb", color: "#0a3a44" }}>
                    <option>Technical Support</option>
                    <option>Partnership Inquiry</option>
                    <option>Hiring / Jobs</option>
                    <option>Billing &amp; Plans</option>
                    <option>Press</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#85a0a4" }}>Message</label>
                  <textarea required rows={4} className="w-full p-4 rounded-xl text-sm font-medium outline-none transition-all resize-none"
                    style={{ background: "#f4fafb", border: "1px solid #dbe9eb", color: "#0a3a44" }}
                    placeholder="How can we help?"
                    onFocus={e => { e.target.style.borderColor = "#079DB3"; e.target.style.background = "white"; }}
                    onBlur={e => { e.target.style.borderColor = "#dbe9eb"; e.target.style.background = "#f4fafb"; }} />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: "#079DB3" }}>
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <><ArrowRight size={15} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
