// Certificate system — shared types, constants, and URL builders.

export type CertificateType = 'genai' | 'fde' | 'internship';
export type CertificateStatus = 'active' | 'revoked';

export interface Certificate {
  id: string;
  certificate_id: string;
  certificate_type: CertificateType;
  student_id: string | null;
  student_name: string;
  student_email: string;
  program_name: string;
  role: string | null;
  completion_date: string | null;
  internship_start_date: string | null;
  internship_end_date: string | null;
  issue_date: string;
  skills: string[];
  template_id: string;
  verification_url: string;
  pdf_storage_path: string | null;
  status: CertificateStatus;
  revoked_at: string | null;
  revoked_by: string | null;
  revocation_reason: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CertificateAuditLog {
  id: string;
  certificate_id: string;
  action: string;
  actor: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Certificate metadata ──────────────────────────────────────────────────────

export const CERT_META: Record<CertificateType, {
  label: string;
  title: string;
  programName: string;
  idPrefix: string;
  linkedInName: string;
  shareText: string;
}> = {
  genai: {
    label: 'GenAI & Agentic AI',
    title: 'CERTIFICATE OF COMPLETION',
    programName: 'GenAI & Agentic AI Program',
    idPrefix: 'CAI-GENAI',
    linkedInName: 'GenAI & Agentic AI Program',
    shareText: "I'm excited to share that I have successfully completed the GenAI & Agentic AI Program at Counts AI Ltd.",
  },
  fde: {
    label: 'Forward Deployed Engineering',
    title: 'CERTIFICATE OF COMPLETION',
    programName: 'Forward Deployed Engineering Program',
    idPrefix: 'CAI-FDE',
    linkedInName: 'Forward Deployed Engineering Program',
    shareText: "I'm excited to share that I have successfully completed the Forward Deployed Engineering Program at Counts AI Ltd.",
  },
  internship: {
    label: 'Forward Deployed Engineer Internship',
    title: 'CERTIFICATE OF INTERNSHIP',
    programName: 'Forward Deployed Engineer with Counts AI Ltd.',
    idPrefix: 'CAI-FDE-INT',
    linkedInName: 'Forward Deployed Engineer Internship',
    shareText: "I'm excited to share that I have successfully completed my one-month internship as a Forward Deployed Engineer at Counts AI Ltd.",
  },
};

// ─── Verification URL ──────────────────────────────────────────────────────────

export function buildVerificationUrl(certificateId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://countsai.com';
  return `${base}/verify/${certificateId}`;
}

// ─── LinkedIn "Add to Profile" URL ────────────────────────────────────────────
// Opens LinkedIn's Add Certification dialog pre-filled with credential data.

export function linkedInAddUrl(cert: Pick<Certificate,
  'certificate_type' | 'certificate_id' | 'verification_url' | 'issue_date'>
): string {
  const meta = CERT_META[cert.certificate_type];
  const issueDate = new Date(cert.issue_date);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: meta.linkedInName,
    organization: 'Counts AI Ltd',
    issueYear: String(issueDate.getFullYear()),
    issueMonth: String(issueDate.getMonth() + 1),
    certUrl: cert.verification_url,
    certId: cert.certificate_id,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

// ─── LinkedIn Share URL ────────────────────────────────────────────────────────

export function linkedInShareUrl(cert: Pick<Certificate,
  'certificate_type' | 'verification_url'>
): string {
  const meta = CERT_META[cert.certificate_type];
  const summary = `${meta.shareText}\n\n🔗 Verify: ${cert.verification_url}`;
  const params = new URLSearchParams({
    mini: 'true',
    url: cert.verification_url,
    summary,
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

// ─── Format helpers ────────────────────────────────────────────────────────────

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── Signatory info ────────────────────────────────────────────────────────────

export const SIGNATORY = {
  name: 'Midhun Mahesan',
  title: 'Director',
  company: 'Counts AI Ltd',
  email: 'info@countsai.com',
  phone: '+44 7384 050895',
  registered: 'Registered in England and Wales',
  address: '124 City Rd, London EC1V 2NX, United Kingdom',
} as const;
