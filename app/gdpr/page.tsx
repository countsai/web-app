"use client";

import { LegalPageLayout, LegalSection } from "@/components/shared/legal-page-layout";

export default function GdprPage() {
  return (
    <LegalPageLayout title="GDPR Compliance" updated="6 June 2026">
      <LegalSection title="1. Our commitment">
        <p>
          Counts AI Ltd is committed to complying with the UK General Data Protection Regulation (UK GDPR), the EU
          General Data Protection Regulation (EU GDPR) and the Data Protection Act 2018. This page explains the legal
          basis on which we process your personal data and how you can exercise your rights as a data subject. It
          should be read alongside our{" "}
          <a href="/privacy-policy" className="underline font-bold" style={{ color: "#079DB3" }}>Privacy Policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. Data controller">
        <p>
          Counts AI Ltd, registered in London, United Kingdom, is the data controller responsible for your personal
          data on the Platform. You can reach our data-protection team at{" "}
          <a href="mailto:dpo@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>dpo@counts.ai</a>.
        </p>
      </LegalSection>

      <LegalSection title="3. Lawful basis for processing">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong style={{ color: "#33474b" }}>Contract</strong> — to create your account, match you with roles, process plan requests and deliver the services attached to your plan.</li>
          <li><strong style={{ color: "#33474b" }}>Legitimate interests</strong> — to keep the Platform secure, improve our matching technology, and carry out essential analytics, balanced against your rights and freedoms.</li>
          <li><strong style={{ color: "#33474b" }}>Consent</strong> — for optional marketing communications and certain non-essential cookies, which you can withdraw at any time.</li>
          <li><strong style={{ color: "#33474b" }}>Legal obligation</strong> — to meet tax, accounting, employment-verification and regulatory requirements.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Your rights as a data subject">
        <p>Under GDPR, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong style={{ color: "#33474b" }}>Access</strong> — request a copy of the personal data we hold about you;</li>
          <li><strong style={{ color: "#33474b" }}>Rectification</strong> — ask us to correct inaccurate or incomplete data;</li>
          <li><strong style={{ color: "#33474b" }}>Erasure</strong> — ask us to delete your data (&ldquo;right to be forgotten&rdquo;), subject to legal retention requirements;</li>
          <li><strong style={{ color: "#33474b" }}>Restriction</strong> — ask us to limit how we use your data in certain circumstances;</li>
          <li><strong style={{ color: "#33474b" }}>Portability</strong> — receive your data in a structured, machine-readable format and have it transferred to another provider;</li>
          <li><strong style={{ color: "#33474b" }}>Objection</strong> — object to processing based on legitimate interests or to direct marketing at any time;</li>
          <li><strong style={{ color: "#33474b" }}>Withdraw consent</strong> — where processing is based on consent, withdraw it at any time without affecting prior lawful processing;</li>
          <li><strong style={{ color: "#33474b" }}>Complain</strong> — lodge a complaint with a supervisory authority, such as the UK Information Commissioner&rsquo;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline font-bold" style={{ color: "#079DB3" }}>ico.org.uk</a>.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. How to exercise your rights">
        <p>
          You can manage and export much of your profile data directly from your dashboard. To make a formal request —
          including for access, correction, deletion or portability — email{" "}
          <a href="mailto:dpo@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>dpo@counts.ai</a>{" "}
          with your registered email address and the nature of your request. We will verify your identity and respond
          within one calendar month, as required by law.
        </p>
      </LegalSection>

      <LegalSection title="6. Data minimisation & retention">
        <p>
          We only collect personal data that is necessary to operate the Platform and deliver our services, and we
          retain it only for as long as your account is active or as required to meet legal and accounting obligations.
          When data is no longer needed, we securely delete or anonymise it.
        </p>
      </LegalSection>

      <LegalSection title="7. International data transfers">
        <p>
          Where personal data is transferred outside the UK or European Economic Area — for example to global employers
          or infrastructure providers — we put appropriate safeguards in place, such as the UK International Data
          Transfer Agreement, EU Standard Contractual Clauses, or adequacy decisions recognised by the ICO and European
          Commission.
        </p>
      </LegalSection>

      <LegalSection title="8. Data protection by design">
        <p>
          We apply data-protection-by-design principles across the Platform, including row-level security on our
          database, encryption in transit, role-based access controls for our team, and regular reviews of the data we
          collect and how long we keep it.
        </p>
      </LegalSection>

      <LegalSection title="9. Breach notification">
        <p>
          In the unlikely event of a personal-data breach that poses a risk to your rights and freedoms, we will notify
          the relevant supervisory authority within 72 hours of becoming aware of it, and will inform affected users
          without undue delay where the law requires us to do so.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact our data-protection team">
        <p>
          For any GDPR-related question or request, email{" "}
          <a href="mailto:dpo@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>dpo@counts.ai</a>{" "}
          or use our <a href="/contact" className="underline font-bold" style={{ color: "#079DB3" }}>Contact page</a>.
          You can also see our live GDPR badge on every account page, confirming our compliance posture.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
