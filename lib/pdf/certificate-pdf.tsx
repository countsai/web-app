// Server-side PDF certificate template using @react-pdf/renderer.
// Mirrors the design of components/certificates/certificate-template.tsx.

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { CERT_META, SIGNATORY, formatDate } from "@/lib/certificates";
import type { Certificate, CertificateType } from "@/lib/certificates";

const NAVY  = "#0a3a44";
const TEAL  = "#0097b2";
const GREY  = "#5f7679";
const LGREY = "#85a0a4";

const styles = StyleSheet.create({
  page: {
    width: 841.89,  // A4 landscape pt
    height: 595.28,
    backgroundColor: "#ffffff",
    position: "relative",
    fontFamily: "Helvetica",
  },
  outerBorder: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderWidth: 2,
    borderColor: NAVY,
    borderStyle: "solid",
  },
  innerBorder: {
    position: "absolute",
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    borderWidth: 0.5,
    borderColor: TEAL,
    borderStyle: "solid",
    opacity: 0.5,
  },
  leftBar: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 8,
    bottom: 14,
    backgroundColor: NAVY,
  },
  // Header
  header: {
    position: "absolute",
    top: 26,
    left: 36,
    right: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    height: 26,
    objectFit: "contain",
  },
  certTypeLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    letterSpacing: 2,
    textAlign: "right",
    textTransform: "uppercase",
  },
  certTypeSub: {
    fontSize: 6.5,
    color: LGREY,
    marginTop: 2,
    textAlign: "right",
  },
  headerDivider: {
    position: "absolute",
    top: 64,
    left: 36,
    right: 36,
    height: 0.8,
    backgroundColor: NAVY,
    opacity: 0.3,
  },
  // Body
  body: {
    position: "absolute",
    top: 82,
    left: 36,
    right: 36,
    bottom: 148,
    alignItems: "center",
    justifyContent: "center",
  },
  certifyText: {
    fontSize: 10,
    fontFamily: "Helvetica-Oblique",
    color: GREY,
    marginBottom: 10,
  },
  studentName: {
    fontSize: 38,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 4,
  },
  nameUnderline: {
    height: 1.5,
    backgroundColor: TEAL,
    opacity: 0.5,
    width: "60%",
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 10,
    fontFamily: "Helvetica-Oblique",
    color: GREY,
    marginBottom: 5,
    textAlign: "center",
  },
  programName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    textAlign: "center",
    marginBottom: 4,
  },
  datesPill: {
    flexDirection: "row",
    gap: 20,
    marginTop: 14,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: TEAL,
    borderStyle: "solid",
    borderRadius: 16,
  },
  datesText: {
    fontSize: 8,
    color: GREY,
  },
  datesTextBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  footerDivider: {
    position: "absolute",
    bottom: 140,
    left: 36,
    right: 36,
    height: 0.6,
    backgroundColor: NAVY,
    opacity: 0.1,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    height: 116,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  signatoryCol: {
    flex: "0 0 auto" as unknown as number,
    width: 170,
  },
  sigLine: {
    width: 150,
    height: 0.8,
    backgroundColor: NAVY,
    opacity: 0.3,
    marginBottom: 6,
  },
  sigName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 1,
  },
  sigTitle: {
    fontSize: 7.5,
    color: GREY,
    marginBottom: 1,
  },
  sigCompany: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 5,
  },
  sigFootNote: {
    fontSize: 6.5,
    color: LGREY,
    lineHeight: 1.6,
  },
  centerCol: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 2,
    alignItems: "center",
  },
  certIdLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    opacity: 0.7,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  certIdValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  verifyLabel: {
    fontSize: 6.5,
    color: LGREY,
    marginBottom: 2,
  },
  verifyUrl: {
    fontSize: 6.5,
    color: TEAL,
    textAlign: "center",
  },
  disclaimer: {
    fontSize: 5.5,
    color: LGREY,
    fontFamily: "Helvetica-Oblique",
    textAlign: "center",
    lineHeight: 1.5,
    marginTop: 8,
    opacity: 0.8,
    maxWidth: 300,
  },
  qrCol: {
    width: 90,
    alignItems: "center",
  },
  qrImage: {
    width: 80,
    height: 80,
  },
  qrLabel: {
    fontSize: 5.5,
    color: LGREY,
    marginTop: 3,
    textAlign: "center",
  },
});

interface Props {
  cert: Certificate;
  logoDataUrl: string;   // base64 PNG/JPEG data URL
  qrDataUrl:  string;   // base64 PNG data URL of QR code
}

export function CertificatePDF({ cert, logoDataUrl, qrDataUrl }: Props) {
  const meta = CERT_META[cert.certificate_type as CertificateType];
  const isInternship = cert.certificate_type === "internship";

  return (
    <Document
      title={`${meta.title} — ${cert.student_name}`}
      author="Counts AI Ltd"
      subject={meta.programName}
      creator="Counts AI"
    >
      <Page size={[841.89, 595.28]} style={styles.page} orientation="landscape">
        {/* Borders */}
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />
        <View style={styles.leftBar} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            {logoDataUrl ? (
              <Image src={logoDataUrl} style={styles.logo} />
            ) : (
              <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 2 }}>
                COUNTS AI
              </Text>
            )}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.certTypeLabel}>{meta.title}</Text>
            <Text style={styles.certTypeSub}>Counts AI Ltd · Registered in England &amp; Wales</Text>
          </View>
        </View>
        <View style={styles.headerDivider} />

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.certifyText}>This is to certify that</Text>
          <Text style={styles.studentName}>{cert.student_name}</Text>
          <View style={styles.nameUnderline} />

          {isInternship ? (
            <>
              <Text style={styles.bodyText}>has successfully completed a one-month internship as a</Text>
              <Text style={styles.programName}>Forward Deployed Engineer with Counts AI Ltd.</Text>
              {cert.internship_start_date && cert.internship_end_date && (
                <Text style={{ fontSize: 9, color: GREY, marginTop: 3 }}>
                  Internship Period: {formatDate(cert.internship_start_date)} – {formatDate(cert.internship_end_date)}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.bodyText}>has successfully completed the</Text>
              <Text style={styles.programName}>{cert.program_name}</Text>
            </>
          )}

          <View style={styles.datesPill}>
            {cert.completion_date && !isInternship && (
              <Text style={styles.datesText}>
                <Text style={styles.datesTextBold}>Completed: </Text>
                {formatDate(cert.completion_date)}
              </Text>
            )}
            <Text style={styles.datesText}>
              <Text style={styles.datesTextBold}>Issued: </Text>
              {formatDate(cert.issue_date)}
            </Text>
          </View>
        </View>

        <View style={styles.footerDivider} />

        {/* Footer */}
        <View style={styles.footer}>
          {/* Signatory */}
          <View style={styles.signatoryCol}>
            <View style={styles.sigLine} />
            <Text style={styles.sigName}>{SIGNATORY.name}</Text>
            <Text style={styles.sigTitle}>{SIGNATORY.title}</Text>
            <Text style={styles.sigCompany}>{SIGNATORY.company}</Text>
            <Text style={styles.sigFootNote}>
              {SIGNATORY.registered}{"\n"}
              Registered Office: {SIGNATORY.address}{"\n"}
              {SIGNATORY.phone}{"\n"}
              {SIGNATORY.email}
            </Text>
          </View>

          {/* Center */}
          <View style={styles.centerCol}>
            <Text style={styles.certIdLabel}>Certificate ID</Text>
            <Text style={styles.certIdValue}>{cert.certificate_id}</Text>
            <Text style={styles.verifyLabel}>Verify this certificate at:</Text>
            <Text style={styles.verifyUrl}>{cert.verification_url}</Text>
            {isInternship && (
              <Text style={styles.disclaimer}>
                The internship was undertaken on a consultant basis during the above-mentioned period,
                in accordance with the terms and conditions agreed between the intern and Counts AI Ltd.
              </Text>
            )}
          </View>

          {/* QR */}
          <View style={styles.qrCol}>
            {qrDataUrl ? (
              <Image src={qrDataUrl} style={styles.qrImage} />
            ) : null}
            <Text style={styles.qrLabel}>Scan to verify</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
