"use client";

import { LegalPageLayout, LegalSection } from "@/components/shared/legal-page-layout";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" updated="6 June 2026">
      <LegalSection title="1. Acceptance of these terms">
        <p>
          By creating an account, browsing or otherwise using the Counts AI Global Career Portal (the
          &ldquo;Platform&rdquo;), you agree to be bound by these Terms &amp; Conditions and our{" "}
          <a href="/privacy-policy" className="underline font-bold" style={{ color: "#079DB3" }}>Privacy Policy</a>.
          If you do not agree, please do not use the Platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Who can use the Platform">
        <p>
          You must be at least 18 years old and legally permitted to work (or to recruit, for employer accounts) to use
          the Platform. By registering, you confirm that the information you provide is accurate, current and complete,
          and that you will keep it up to date.
        </p>
      </LegalSection>

      <LegalSection title="3. Account & security">
        <p>
          You are responsible for maintaining the confidentiality of your login credentials and for all activity that
          occurs under your account. Notify us immediately at{" "}
          <a href="mailto:support@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>support@counts.ai</a>{" "}
          if you suspect unauthorised access.
        </p>
      </LegalSection>

      <LegalSection title="4. Plans, billing & the request-to-pay process">
        <ul className="list-disc pl-5 space-y-1">
          <li>Counts AI offers a free tier alongside a paid <strong style={{ color: "#33474b" }}>Premium plan (£29/month)</strong>, with an optional annual billing cycle at 25% off the monthly price.</li>
          <li>Selecting a paid plan submits a <strong style={{ color: "#33474b" }}>plan request</strong> — no payment is taken automatically. Our team will contact you directly using the details you provide to arrange billing and activate your plan.</li>
          <li>Prices are shown in GBP and may be subject to change; we will always confirm the price with you before taking payment.</li>
          <li>Where a free trial is offered, it converts to a paid subscription only once billing has been arranged with our team — you will not be charged automatically at the end of a trial.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. The interview guarantee">
        <p>
          The Premium plan includes a placement-oriented <strong style={{ color: "#33474b" }}>interview guarantee</strong>:
          we guarantee a confirmed interview introduction with a verified employer on our Platform{" "}
          <strong style={{ color: "#33474b" }}>within your first month</strong> of an active paid subscription, provided
          your profile meets the minimum matching criteria set by our placement team (a complete profile, relevant
          skills, and availability for the roles you have selected). If we do not deliver a qualifying interview within
          that period through no fault of your own, you are entitled to the remedy described in our{" "}
          <a href="/refund-policy" className="underline font-bold" style={{ color: "#079DB3" }}>Refund Policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide false, misleading or fraudulent information in your profile, applications or plan requests;</li>
          <li>Use the Platform to harass, discriminate against, or misrepresent yourself to other users or employers;</li>
          <li>Scrape, copy or redistribute Platform content, or attempt to reverse-engineer our matching or Auto-Apply systems;</li>
          <li>Interfere with the security or operation of the Platform, including by introducing malware or attempting unauthorised access.</li>
        </ul>
        <p>We may suspend or terminate accounts that breach these rules.</p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          All Platform content, branding, software and matching technology is owned by Counts AI Ltd or its licensors
          and is protected by intellectual-property laws. You retain ownership of the content you upload (such as your
          CV), and you grant us a licence to use it solely to operate the Platform and deliver our services to you.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>
          The Platform helps connect candidates with employers and provides matching, Auto-Apply and career-acceleration
          tools, but we do not guarantee that any application will result in an offer of employment beyond the specific
          interview-guarantee commitment described in Section 5. Educational content, blueprints and roadmaps are
          provided for informational purposes and do not constitute professional, legal or financial advice.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Counts AI Ltd shall not be liable for any indirect, incidental or
          consequential loss arising from your use of the Platform, including loss of earnings or opportunities. Nothing
          in these terms limits liability that cannot lawfully be excluded, such as liability for fraud or for death or
          personal injury caused by negligence.
        </p>
      </LegalSection>

      <LegalSection title="10. Suspension & termination">
        <p>
          You may close your account at any time by contacting{" "}
          <a href="mailto:support@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>support@counts.ai</a>.
          We may suspend or terminate accounts that breach these terms, pose a security risk, or where required by law,
          and we will give notice where reasonably possible.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to these terms">
        <p>
          We may update these Terms &amp; Conditions from time to time. We will post the revised version here with an
          updated &ldquo;Last updated&rdquo; date, and where changes materially affect your rights we will notify you
          directly before they take effect.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law">
        <p>
          These terms are governed by the laws of England and Wales, and any disputes will be subject to the exclusive
          jurisdiction of the courts of England and Wales.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact us">
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:support@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>support@counts.ai</a>{" "}
          or via our <a href="/contact" className="underline font-bold" style={{ color: "#079DB3" }}>Contact page</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
