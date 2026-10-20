import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { GdprBadge } from "@/components/shared/gdpr-badge";
import { Wordmark } from "./home-nav";

// Only routes that exist in /app are listed.
const COLS = [
  {
    heading: "Products",
    links: [
      ["AI agents", "/for-businesses#services"],
      ["AI workflow automation", "/for-businesses#services"],
      ["Custom AI agents", "/for-businesses#services"],
      ["Dedicated engineering teams", "/for-businesses#workforce"],
    ],
  },
  {
    heading: "Solutions",
    links: [
      ["For businesses", "/for-businesses"],
      ["AI consulting", "/for-businesses#consulting"],
      ["Talk to our team", "/for-businesses#contact"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    heading: "Training & jobs",
    links: [
      ["AI programmes", "/training"],
      ["Apply now", "/training/apply"],
      ["Browse jobs", "/jobs"],
      ["Referral partners", "/referrals"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Help", "/help"],
      ["Verify a certificate", "/verify"],
    ],
  },
];

const LEGAL = [
  ["Privacy", "/privacy-policy"],
  ["Terms", "/terms"],
  ["GDPR", "/gdpr"],
  ["Refunds", "/refund-policy"],
];

export function HomeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Wordmark dark />
            <p className="small">AI agents. Engineering. Talent. Real impact.</p>
            <p className="small" style={{ marginTop: 18, display: "grid", gap: 6 }}>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Mail size={12} /> info@countsai.com</span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Phone size={12} /> +44 7384 050895 | +91 99472 35533</span>
              <span>Registered Office: 124 City Rd, London EC1V 2NX, United Kingdom</span>
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.heading}>
              <h4>{c.heading}</h4>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="foot-disc">
          <strong style={{ color: "rgba(255,255,255,.6)" }}>Platform Guarantee Disclaimer:</strong> Counts AI Ltd runs a global
          career acceleration portal matching candidates directly with verified employers. Our Career Premium subscription
          packages include structured technical resume blueprints, visa relocation pathways, and actual guaranteed real-world
          developer interview matchmaking within your first month (provided the candidate meets minimal matching technical
          metrics). Standard features are entirely educational and informational in scope.
        </p>

        <div className="foot-legal">
          <span>© {year} Counts AI Ltd. Co Registration No. 16375927. Registered in England &amp; Wales.</span>
          <span style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <GdprBadge />
            {LEGAL.map(([l, h]) => <Link key={l} href={h}>{l}</Link>)}
          </span>
        </div>
      </div>
    </footer>
  );
}
