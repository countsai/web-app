import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the template file as a raw string — no component rendering needed.
const templateSource = readFileSync(
  resolve(__dirname, '../components/certificates/certificate-template.tsx'),
  'utf8'
);

describe('certificate-template.tsx static wording', () => {
  it('contains "has successfully completed a one-month internship as a"', () => {
    expect(templateSource).toContain('has successfully completed a one-month internship as a');
  });

  it('contains "Forward Deployed Engineer with Counts AI Ltd."', () => {
    expect(templateSource).toContain('Forward Deployed Engineer with Counts AI Ltd.');
  });

  it('contains "The internship was undertaken on a consultant basis"', () => {
    expect(templateSource).toContain('The internship was undertaken on a consultant basis');
  });

  it('contains "in accordance with the terms and conditions agreed between the intern and Counts AI Ltd."', () => {
    expect(templateSource).toContain(
      'in accordance with the terms and conditions agreed between the intern and Counts AI Ltd.'
    );
  });

  it('does NOT contain the word "employment"', () => {
    expect(templateSource).not.toContain('employment');
  });

  it('references CERT_META (which carries CERTIFICATE OF INTERNSHIP title)', () => {
    expect(templateSource).toContain('CERT_META');
  });

  it('contains "This is to certify that"', () => {
    expect(templateSource).toContain('This is to certify that');
  });
});
