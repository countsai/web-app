import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import { GdprBadge } from "@/components/shared/gdpr-badge";

const FOOTER_COLS = [
  {
    heading: "FOR BUSINESSES",
    links: ["Submit a Project", "Hire Temporary Specialists", "Managed AI Teams", "Business FAQ"],
    hrefs: ["/for-businesses", "/for-businesses", "/for-businesses", "/help"],
  },
  {
    heading: "FOR TALENT",
    links: ["Join Talent Network", "Browse Active Jobs", "Skills Upgrades", "Referral Partner Programme", "Candidate FAQs"],
    hrefs: ["/auth/register", "/jobs/board", "/skills-roadmap", "/referrals", "/help"],
  },
  {
    heading: "CAREER PLANS",
    links: ["Premium Plan (£29/mo)", "Annual Plan (£22/mo)", "Academy Certifications", "Book Mentoring Call"],
    hrefs: ["/pricing", "/pricing", "/skills-roadmap", "/contact"],
  },
  {
    heading: "LEGAL & POLICY",
    links: ["Privacy Policy", "Terms & Conditions", "GDPR Compliance", "Refund Policy"],
    hrefs: ["/privacy-policy", "/terms", "/gdpr", "/refund-policy"],
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#062A32", position: "relative" }}>
      {/* Dotted architectural grid — very subtle */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(7,157,179,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          <div className="md:col-span-1 space-y-4">
            <Image src="/logo.png" alt="CountsAI" width={155} height={44} className="object-contain" />
            <p className="text-xs font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Global AI talent pools, delivered on demand. Flexible remote automation specialists, data auditors, and LLM technicians. Based in London, servicing enterprises worldwide.
            </p>
            <div className="space-y-2">
              {[
                { Icon: Phone, text: "+44 7384 050895 (UK)" },
                { Icon: Mail, text: "info@counts.ai" },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                  <Icon size={11} /> {text}
                </div>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col, ci) => (
            <div key={ci} className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "#079DB3" }}>{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((link, li) => (
                  <li key={li}>
                    <Link href={col.hrefs[li]}
                      className="text-xs font-medium transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.5)" }}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[11px] font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              <strong className="text-white/60">Platform Guarantee Disclaimer:</strong> Counts AI Ltd runs a global career acceleration portal matching candidates directly with verified employers. Our Career Premium subscription packages include structured technical resume blueprints, visa relocation pathways, and actual guaranteed real-world developer interview matchmaking within your first month (provided the candidate meets minimal matching technical metrics). Standard features are entirely educational and informational in scope.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
              © {currentYear} Counts AI Ltd. Co Registration No. 16375927. Registered in England &amp; Wales.
            </p>
            <div className="flex items-center gap-5 flex-wrap">
              <GdprBadge />
              {["About Counts AI", "Contact Sales", "Back to Portal Home"].map((l, i) => (
                <Link key={i} href={i === 2 ? "/" : "/about"}
                  className="text-[11px] font-medium transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Giant wordmark — 85–95% viewport width, opaque, lighter weight */}
      <div className="relative w-full select-none pt-6 overflow-hidden" aria-hidden="true">
        <div
          className="font-light leading-none text-center whitespace-nowrap"
          style={{
            fontSize: "clamp(80px, 22vw, 420px)",
            letterSpacing: "-0.055em",
            color: "#B8CED0",
            opacity: 1,
          }}
        >
          Counts AI
        </div>
      </div>
    </footer>
  );
}
