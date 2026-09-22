"use client";

import { LegalPageLayout, LegalSection } from "@/components/shared/legal-page-layout";

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund Policy" updated="6 June 2026">
      <LegalSection title="1. Overview">
        <p>
          This policy explains when you are entitled to a refund on a Premium subscription. It
          applies alongside our{" "}
          <a href="/terms" className="underline font-bold" style={{ color: "#079DB3" }}>Terms &amp; Conditions</a>, and
          nothing here affects your statutory rights as a consumer.
        </p>
      </LegalSection>

      <LegalSection title="2. Free trial & before billing begins">
        <p>
          Choosing a paid plan creates a <strong style={{ color: "#33474b" }}>plan request</strong> only — we do not
          take payment automatically. No charge is made, and therefore nothing is refundable, until our team has
          contacted you directly and you have agreed to set up billing. You can cancel a plan request at any time
          before billing is arranged, free of charge, by emailing{" "}
          <a href="mailto:billing@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>billing@counts.ai</a>.
        </p>
      </LegalSection>

      <LegalSection title="3. The 1-month interview-guarantee refund">
        <p>
          The Premium plan includes a guarantee of a confirmed interview introduction with a verified
          employer <strong style={{ color: "#33474b" }}>within your first month</strong> of an active paid subscription,
          provided your profile meets our placement team&rsquo;s minimum matching criteria (a complete profile, relevant
          skills, and availability for your selected roles).
        </p>
        <p>
          If we do not deliver a qualifying interview within that first month through no fault of your own, you are
          entitled to a <strong style={{ color: "#33474b" }}>full refund of that month&rsquo;s subscription fee</strong>,
          or — if you prefer — a free additional month while we keep working on your placement. To claim this, contact{" "}
          <a href="mailto:billing@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>billing@counts.ai</a>{" "}
          within 14 days of the end of your first month, and our team will review your account and respond within 5
          working days.
        </p>
      </LegalSection>

      <LegalSection title="4. Cooling-off period">
        <p>
          If you change your mind shortly after your first payment is taken, you can request a full refund within{" "}
          <strong style={{ color: "#33474b" }}>14 days</strong> of being charged, provided you have not yet received a
          qualifying interview introduction or made substantial use of paid features such as the AI Auto-Apply Engine.
          This mirrors the statutory cooling-off period for digital services and does not affect any other rights you
          may have.
        </p>
      </LegalSection>

      <LegalSection title="5. Cancelling your subscription">
        <p>
          You can cancel future billing at any time by emailing{" "}
          <a href="mailto:billing@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>billing@counts.ai</a>{" "}
          or via your dashboard. Cancelling stops future charges but does not automatically refund the current billing
          period — you will continue to have access to your plan&rsquo;s features until the end of the period you have
          already paid for, unless a refund applies under Section 3 or 4 above.
        </p>
      </LegalSection>

      <LegalSection title="6. Annual billing">
        <p>
          Annual plans are billed at a 25% discount versus paying monthly. If you cancel an annual plan after the
          cooling-off period in Section 4, we will refund the unused portion of the year on a pro-rata basis, less the
          value of any months during which the interview guarantee was met.
        </p>
      </LegalSection>

      <LegalSection title="7. What is not covered">
        <ul className="list-disc pl-5 space-y-1">
          <li>Refunds are not available simply because an interview did not lead to a job offer — the guarantee covers the interview introduction itself, not the outcome of that interview.</li>
          <li>Accounts suspended or terminated for breaching our Terms &amp; Conditions (for example, providing false information) are not eligible for a refund.</li>
          <li>The guarantee does not apply if your profile is incomplete or you have marked yourself unavailable for matching during the qualifying period — our team will let you know if this is the case so you can update your profile.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. How refunds are processed">
        <p>
          Approved refunds are returned to the original payment method within 5–10 working days. We will confirm the
          amount and timing by email once your refund request has been approved.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact us">
        <p>
          To request a refund or ask about your eligibility, email{" "}
          <a href="mailto:billing@counts.ai" className="underline font-bold" style={{ color: "#079DB3" }}>billing@counts.ai</a>{" "}
          or use our <a href="/contact" className="underline font-bold" style={{ color: "#079DB3" }}>Contact page</a>.
          We aim to respond to all billing queries within 2 working days.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
