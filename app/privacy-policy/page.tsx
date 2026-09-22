"use client";

import { LegalPageLayout, LegalSection } from "@/components/shared/legal-page-layout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="6 June 2026">
      <LegalSection title="1. Who we are">
        <p>
          Counts AI Ltd (&ldquo;Counts AI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the
          Counts AI Global Career Portal, including the website, candidate dashboards, employer tools and any related
          services (together, the &ldquo;Platform&rdquo;). We are registered in London, United Kingdom, and act as the
          data controller for the personal data described in this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>We collect the following categories of personal data:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong style={{ color: "#33474b" }}>Account data:</strong> name, email address, phone/WhatsApp number, password (stored as a salted hash), and account type (candidate, employer or admin).</li>
          <li><strong style={{ color: "#33474b" }}>Profile &amp; application data:</strong> CV/resume content, work history, skills, certifications, portfolio links, visa or relocation preferences, and job applications you submit or that our AI Auto-Apply Engine submits on your behalf.</li>
          <li><strong style={{ color: "#33474b" }}>Billing &amp; plan data:</strong> the subscription plan you request (Free or Premium), billing name, contact details and status of your plan request. We do not store full card numbers — payment is arranged directly with our team.</li>
          <li><strong style={{ color: "#33474b" }}>Usage data:</strong> log-in timestamps, pages viewed, searches performed, device/browser type and IP address, collected via cookies and similar technologies.</li>
          <li><strong style={{ color: "#33474b" }}>Communications:</strong> messages you send us via the contact form, support chat, or email, and any correspondence relating to your account or placements.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and manage your account and deliver the core Platform features (job matching, AI Auto-Apply, employer introductions, dashboards).</li>
          <li>To process plan requests, communicate about billing, and provide the services attached to your chosen plan.</li>
          <li>To match candidates with relevant roles and to share your profile with verified employers when you apply or opt in.</li>
          <li>To send service updates, security notices, and — where you have agreed — marketing communications about new features, roles or offers. You can opt out at any time.</li>
          <li>To monitor, secure, debug and improve the Platform, and to detect or prevent fraud and abuse.</li>
          <li>To comply with our legal obligations, including tax, accounting and regulatory requirements.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sharing your information">
        <p>We share personal data only where necessary, and always under appropriate safeguards:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong style={{ color: "#33474b" }}>Verified employers and recruiting partners</strong> — when you apply to a role, opt in to introductions, or use Auto-Apply, relevant profile details are shared so they can assess your application.</li>
          <li><strong style={{ color: "#33474b" }}>Service providers</strong> — infrastructure, hosting, authentication, analytics, email and payment-coordination vendors (such as Supabase) who process data on our behalf under contract.</li>
          <li><strong style={{ color: "#33474b" }}>Legal &amp; safety</strong> — where required to comply with the law, enforce our Terms &amp; Conditions, or protect the rights, property or safety of Counts AI, our users or the public.</li>
          <li><strong style={{ color: "#33474b" }}>Business transfers</strong> — if Counts AI is involved in a merger, acquisition or asset sale, your data may be transferred as part of that transaction, subject to confidentiality obligations.</li>
        </ul>
        <p>We do not sell your personal data.</p>
      </LegalSection>

      <LegalSection title="5. Cookies & similar technologies">
        <p>
          We use essential cookies to keep you signed in and to remember your preferences, and analytics cookies to
          understand how the Platform is used so we can improve it. You can control cookies through your browser
          settings; disabling essential cookies may affect how the Platform functions.
        </p>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <p>
          We retain account and application data for as long as your account is active, and for a reasonable period
          afterwards to meet legal, accounting and dispute-resolution requirements. You can request deletion of your
          account at any time — see &ldquo;Your rights&rdquo; below.
        </p>
      </LegalSection>

      <LegalSection title="7. International transfers">
        <p>
          Our Platform is used by candidates and employers around the world. Where personal data is transferred outside
          the UK or European Economic Area, we rely on appropriate safeguards such as Standard Contractual Clauses or
          equivalent mechanisms recognised under applicable data-protection law.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Subject to applicable law, you have the right to access, correct, export or delete your personal data, to
          object to or restrict certain processing, and to withdraw consent for marketing at any time. For full detail
          on how to exercise these rights, see our{" "}
          <a href="/gdpr" className="underline font-bold" style={{ color: "#079DB3" }}>GDPR Compliance</a> page, or
          contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          We use industry-standard technical and organisational measures — including encryption in transit, access
          controls and row-level security on our database — to protect your personal data against unauthorised access,
          loss or misuse. No system can be guaranteed 100% secure, and we encourage you to use a strong, unique password.
        </p>
      </LegalSection>

      <LegalSection title="10. Children">
        <p>
          The Platform is intended for individuals aged 18 or over who are eligible to work. We do not knowingly collect
          personal data from children.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
          operational or regulatory reasons. We will post the revised version here with an updated &ldquo;Last
          updated&rdquo; date, and where changes are material we will notify you directly.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact us">
        <p>
          For any privacy questions or to exercise your rights, contact us at{" "}
          <a href="mailto:privacy@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>privacy@counts.ai</a>{" "}
          or via our <a href="/contact" className="underline font-bold" style={{ color: "#079DB3" }}>Contact page</a>. Our
          registered office is Counts AI Ltd, London, United Kingdom.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
