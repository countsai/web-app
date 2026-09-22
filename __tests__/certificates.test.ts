import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildVerificationUrl,
  linkedInAddUrl,
  linkedInShareUrl,
  formatDate,
  formatDateShort,
  CERT_META,
  SIGNATORY,
} from '@/lib/certificates';
import type { Certificate } from '@/lib/certificates';

// ─── buildVerificationUrl ──────────────────────────────────────────────────────

describe('buildVerificationUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns the correct URL using NEXT_PUBLIC_APP_URL env var', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://countsai.com';
    const url = buildVerificationUrl('CAI-GENAI-2026-000001');
    expect(url).toBe('https://countsai.com/verify/CAI-GENAI-2026-000001');
  });

  it('falls back to https://countsai.com when env not set', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    const url = buildVerificationUrl('CAI-GENAI-2026-000001');
    expect(url).toBe('https://countsai.com/verify/CAI-GENAI-2026-000001');
  });
});

// ─── CERT_META ─────────────────────────────────────────────────────────────────

describe('CERT_META', () => {
  it('genai.title equals CERTIFICATE OF COMPLETION', () => {
    expect(CERT_META.genai.title).toBe('CERTIFICATE OF COMPLETION');
  });

  it('fde.title equals CERTIFICATE OF COMPLETION', () => {
    expect(CERT_META.fde.title).toBe('CERTIFICATE OF COMPLETION');
  });

  it('internship.title equals CERTIFICATE OF INTERNSHIP', () => {
    expect(CERT_META.internship.title).toBe('CERTIFICATE OF INTERNSHIP');
  });

  it('genai.idPrefix equals CAI-GENAI', () => {
    expect(CERT_META.genai.idPrefix).toBe('CAI-GENAI');
  });

  it('fde.idPrefix equals CAI-FDE', () => {
    expect(CERT_META.fde.idPrefix).toBe('CAI-FDE');
  });

  it('internship.idPrefix equals CAI-FDE-INT', () => {
    expect(CERT_META.internship.idPrefix).toBe('CAI-FDE-INT');
  });

  it('genai.label equals GenAI & Agentic AI', () => {
    expect(CERT_META.genai.label).toBe('GenAI & Agentic AI');
  });

  it('fde.label equals Forward Deployed Engineering', () => {
    expect(CERT_META.fde.label).toBe('Forward Deployed Engineering');
  });

  it('internship.label equals Forward Deployed Engineer Internship', () => {
    expect(CERT_META.internship.label).toBe('Forward Deployed Engineer Internship');
  });

  it('three separate cert types exist: genai, fde, internship', () => {
    const keys = Object.keys(CERT_META);
    expect(keys).toContain('genai');
    expect(keys).toContain('fde');
    expect(keys).toContain('internship');
    expect(keys).toHaveLength(3);
  });

  it('all three have distinct idPrefix values', () => {
    const prefixes = [CERT_META.genai.idPrefix, CERT_META.fde.idPrefix, CERT_META.internship.idPrefix];
    const unique = new Set(prefixes);
    expect(unique.size).toBe(3);
  });

  it('internship shareText mentions "internship"', () => {
    expect(CERT_META.internship.shareText.toLowerCase()).toContain('internship');
  });

  it('internship programName contains Forward Deployed Engineer', () => {
    expect(CERT_META.internship.programName).toContain('Forward Deployed Engineer');
  });
});

// ─── SIGNATORY ─────────────────────────────────────────────────────────────────

describe('SIGNATORY', () => {
  it('name equals Midhun Mahesan', () => {
    expect(SIGNATORY.name).toBe('Midhun Mahesan');
  });

  it('title equals Director', () => {
    expect(SIGNATORY.title).toBe('Director');
  });

  it('company equals Counts AI Ltd', () => {
    expect(SIGNATORY.company).toBe('Counts AI Ltd');
  });

  it('email equals info@countsai.com', () => {
    expect(SIGNATORY.email).toBe('info@countsai.com');
  });

  it('phone contains +44 7384 050895', () => {
    expect(SIGNATORY.phone).toContain('+44 7384 050895');
  });

  it('phone contains +91 99472 35533', () => {
    expect(SIGNATORY.phone).toContain('+91 99472 35533');
  });

  it('registered equals Registered in England and Wales', () => {
    expect(SIGNATORY.registered).toBe('Registered in England and Wales');
  });

  it('address contains 124 City Rd', () => {
    expect(SIGNATORY.address).toContain('124 City Rd');
  });

  it('address contains London', () => {
    expect(SIGNATORY.address).toContain('London');
  });
});

// ─── linkedInAddUrl ────────────────────────────────────────────────────────────

const mockGenaiCert: Pick<Certificate, 'certificate_type' | 'certificate_id' | 'verification_url' | 'issue_date'> = {
  certificate_type: 'genai',
  certificate_id: 'CAI-GENAI-2026-000001',
  verification_url: 'https://countsai.com/verify/CAI-GENAI-2026-000001',
  issue_date: '2026-01-15',
};

describe('linkedInAddUrl', () => {
  it('returns a URL containing linkedin.com/profile/add', () => {
    const url = linkedInAddUrl(mockGenaiCert);
    expect(url).toContain('linkedin.com/profile/add');
  });

  it('returns URL containing organization=Counts+AI+Ltd (URL-encoded)', () => {
    const url = linkedInAddUrl(mockGenaiCert);
    expect(url).toContain('organization=Counts+AI+Ltd');
  });

  it('returns URL containing the cert certificate_id', () => {
    const url = linkedInAddUrl(mockGenaiCert);
    expect(url).toContain(mockGenaiCert.certificate_id);
  });

  it('returns URL containing the cert verification_url', () => {
    const url = linkedInAddUrl(mockGenaiCert);
    expect(url).toContain(encodeURIComponent(mockGenaiCert.verification_url));
  });
});

// ─── linkedInShareUrl ─────────────────────────────────────────────────────────

describe('linkedInShareUrl', () => {
  it('returns URL containing linkedin.com/sharing/share-offsite', () => {
    const url = linkedInShareUrl(mockGenaiCert);
    expect(url).toContain('linkedin.com/sharing/share-offsite');
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it("formatDate('2026-01-15') returns '15 January 2026'", () => {
    expect(formatDate('2026-01-15')).toBe('15 January 2026');
  });

  it('formatDate(null) returns em dash', () => {
    expect(formatDate(null)).toBe('—');
  });
});

// ─── formatDateShort ──────────────────────────────────────────────────────────

describe('formatDateShort', () => {
  it("formatDateShort('2026-01-15') returns a string containing 'Jan 2026'", () => {
    const result = formatDateShort('2026-01-15');
    expect(result).toContain('Jan 2026');
  });
});
