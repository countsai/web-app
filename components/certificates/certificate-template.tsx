// Router — delegates to the correct type-specific certificate template.
// Do not add visual logic here; keep it in the per-type template files.

import type { Certificate } from "@/lib/certificates";
import { GenAICertificate } from "./genai-certificate";
import { FDECertificate } from "./fde-certificate";
import { InternshipCertificate } from "./internship-certificate";

interface Props {
  cert: Certificate;
  qrSvg: string;
  logoDataUrl: string;
  signatureDataUrl?: string;
}

export function CertificateTemplate({ cert, qrSvg, logoDataUrl, signatureDataUrl }: Props) {
  const props = { cert, qrSvg, logoDataUrl, signatureDataUrl };
  if (cert.certificate_type === "genai") return <GenAICertificate {...props} />;
  if (cert.certificate_type === "fde") return <FDECertificate {...props} />;
  return <InternshipCertificate {...props} />;
}
