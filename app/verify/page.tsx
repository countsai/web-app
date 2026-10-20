"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShieldCheck, UserCheck, GraduationCap, CalendarCheck, BadgeCheck } from "lucide-react";
import { PublicNavbar } from "@/components/shared/public-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";
import "./verify.css";

const CHECKS = [
  { Icon: UserCheck, t: "Recipient name", d: "Confirms the credential belongs to the named individual." },
  { Icon: GraduationCap, t: "Program & type", d: "Confirms which Counts AI programme was completed." },
  { Icon: CalendarCheck, t: "Issue date", d: "Confirms when the credential was issued." },
  { Icon: BadgeCheck, t: "Active status", d: "Confirms the certificate has not been revoked." },
];

export default function VerifyIndexPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) { setError("Please enter a certificate ID."); return; }
    router.push(`/verify/${trimmed}`);
  };

  return (
    <div className={`ch vf ${serif.variable} ${mono.variable} ${display.variable}`}>
      <PublicNavbar />

      <main>
        <section className="vf-hero">
          <div className="wrap vf-in">
            <span className="vf-ico"><ShieldCheck size={26} /></span>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Certificate verification</div>
            <h1>Verify a <em>certificate.</em></h1>
            <p className="lede">Enter the certificate ID printed on the credential to confirm its authenticity with the Counts AI registry.</p>

            <form onSubmit={handleSubmit} className="vf-form" noValidate>
              <label htmlFor="cert-id">Certificate ID</label>
              <div className="vf-row">
                <input
                  id="cert-id"
                  value={id}
                  onChange={(e) => { setId(e.target.value); setError(""); }}
                  placeholder="e.g. CAI-GENAI-2026-AIHYZB"
                  aria-invalid={!!error}
                  aria-describedby={error ? "cert-err" : "cert-hint"}
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-dark"><Search size={15} /> Verify</button>
              </div>
              {error && <p id="cert-err" className="vf-err" role="alert">{error}</p>}
              <p id="cert-hint" className="vf-hint">The ID is printed in the footer of the credential, for example <code>CAI-GENAI-2026-XXXXX</code>.</p>
            </form>
          </div>
        </section>

        <section className="sec vf-what">
          <div className="wrap">
            <div className="eyebrow">What we verify</div>
            <h2 className="h2 vf-h2">Four things, <em>checked every time.</em></h2>
            <div className="vf-grid">
              {CHECKS.map(({ Icon, t, d }) => (
                <div key={t} className="vf-card"><span><Icon size={20} /></span><h3>{t}</h3><p>{d}</p></div>
              ))}
            </div>
            <p className="vf-note">
              Certificates are issued by <strong>Counts AI Ltd</strong>, registered in England and Wales. For queries contact{" "}
              <a href="mailto:info@countsai.com">info@countsai.com</a> or return to <Link href="/">countsai.com</Link>.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
