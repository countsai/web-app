// Consultancy Invoice PDF — @react-pdf/renderer, A4 portrait.
// Corporate Counts AI design: navy/teal, clean white, no gradients, no certificate aesthetics.

import {
  Document, Page, View, Text, StyleSheet,
} from "@react-pdf/renderer";
import type { ConsultancyInvoice } from "@/lib/invoices";
import { SIGNATORY } from "@/lib/certificates";
import {
  CONSULTANCY_BASIS_TEXT,
  INVOICE_LEGAL_NOTE,
  formatCurrency,
} from "@/lib/invoices";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY  = "#062F36";
const TEAL  = "#079DB3";
const MUTED = "#536B73";
const RULE  = "#D7E2E4";
const PAGE_BG = "#FFFFFF";

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAGE_BG,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: NAVY,
  },

  // ── Header ──
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
headerRight: { alignItems: "flex-end" },
  headerTagline: { fontSize: 7, color: TEAL, letterSpacing: 2, marginBottom: 4 },
  headerCompany: { fontSize: 7.5, color: MUTED },

  rule: { height: 1, backgroundColor: RULE, marginVertical: 14 },
  ruleHeavy: { height: 2, backgroundColor: NAVY, marginTop: 14, marginBottom: 2 },
  ruleTeal: { height: 1, backgroundColor: TEAL, opacity: 0.4, marginBottom: 14 },

  // ── Invoice title block ──
  titleBlock: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  invoiceTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 0.5 },
  invoiceSubTitle: { fontSize: 8, color: MUTED, marginTop: 3 },
  metaBlock: { alignItems: "flex-end" },
  metaLabel: { fontSize: 6.5, color: MUTED, letterSpacing: 2, marginBottom: 2 },
  metaValue: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 8 },

  // ── Parties ──
  parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  partyCol: { width: "47%" },
  partyLabel: { fontSize: 7, color: TEAL, letterSpacing: 2.5, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  partyName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 4 },
  partyLine: { fontSize: 8.5, color: MUTED, lineHeight: 1.55 },

  // ── Consultancy basis ──
  basisBox: { backgroundColor: "#F5F9FA", borderLeft: 3, borderLeftColor: TEAL, padding: 12, marginBottom: 20 },
  basisLabel: { fontSize: 7, color: TEAL, letterSpacing: 2.5, fontFamily: "Helvetica-Bold", marginBottom: 5 },
  basisText: { fontSize: 8.5, color: MUTED, lineHeight: 1.6 },

  // ── Services table ──
  tableHeader: { flexDirection: "row", backgroundColor: NAVY, paddingVertical: 7, paddingHorizontal: 10, marginBottom: 0 },
  tableHeaderText: { fontSize: 7, color: "#fff", fontFamily: "Helvetica-Bold", letterSpacing: 1.5 },
  tableRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10, borderBottom: 1, borderBottomColor: RULE },
  colDesc: { width: "55%", paddingRight: 10 },
  colPeriod: { width: "25%", paddingRight: 6 },
  colAmount: { width: "20%", alignItems: "flex-end" },
  cellText: { fontSize: 8.5, color: NAVY, lineHeight: 1.55 },
  cellMuted: { fontSize: 8, color: MUTED },

  // ── Totals ──
  totalsBlock: { alignItems: "flex-end", marginTop: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", width: 200, paddingVertical: 4 },
  totalLabel: { fontSize: 8.5, color: MUTED },
  totalValue: { fontSize: 8.5, color: NAVY },
  totalDueRow: { flexDirection: "row", justifyContent: "space-between", width: 200, backgroundColor: NAVY, paddingVertical: 8, paddingHorizontal: 10, marginTop: 4 },
  totalDueLabel: { fontSize: 9, color: "#fff", fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  totalDueValue: { fontSize: 11, color: "#fff", fontFamily: "Helvetica-Bold" },

  // ── Status badge ──
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2, alignSelf: "flex-end", marginBottom: 16 },

  // ── Footer ──
  footer: { position: "absolute", bottom: 36, left: 52, right: 52 },
  footerRule: { height: 1, backgroundColor: RULE, marginBottom: 10 },
  footerText: { fontSize: 7, color: MUTED, lineHeight: 1.6 },
  footerLegal: { fontSize: 6.5, color: "#9ab0b5", marginTop: 6, lineHeight: 1.6 },
});

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

interface Props {
  invoice: ConsultancyInvoice;
  logoDataUrl?: string;
}

export function InvoicePDF({ invoice }: Props) {
  const servicePeriod = `${formatDate(invoice.service_start_date)} to ${formatDate(invoice.service_end_date)}`;
  const total = formatCurrency(invoice.amount, invoice.currency);
  const statusLabel = invoice.status.toUpperCase();

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            {/* Text-based logo — immune to white-on-white issues */}
            <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 2 }}>
              <Text style={{ fontSize: 15, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 1.5 }}>COUNTS</Text>
              <Text style={{ fontSize: 15, fontFamily: "Helvetica-Bold", color: TEAL, letterSpacing: 1.5 }}>AI</Text>
            </View>
            <Text style={[styles.headerTagline, { marginTop: 5 }]}>
              AI ENGINEERING · CONSULTANCY · TALENT
            </Text>
            <Text style={styles.headerCompany}>Counts AI Ltd · {SIGNATORY.registered}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
              <Text style={{ fontSize: 7, color: MUTED, letterSpacing: 2 }}>STATUS</Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: invoice.status === 'paid' ? TEAL : invoice.status === 'cancelled' ? '#c0392b' : NAVY }}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ruleHeavy} />
        <View style={styles.ruleTeal} />

        {/* ── Invoice title + metadata ────────────────────────────────── */}
        <View style={styles.titleBlock}>
          <View>
            <Text style={styles.invoiceTitle}>CONSULTANCY INVOICE</Text>
            <Text style={styles.invoiceSubTitle}>Independent Consultancy Services</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>INVOICE NO.</Text>
            <Text style={styles.metaValue}>{invoice.invoice_number}</Text>

            <Text style={styles.metaLabel}>INVOICE DATE</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.invoice_date)}</Text>

            <Text style={styles.metaLabel}>SERVICE PERIOD</Text>
            <Text style={[styles.metaValue, { marginBottom: 0 }]}>{servicePeriod}</Text>
          </View>
        </View>

        <View style={styles.rule} />

        {/* ── Parties ────────────────────────────────────────────────── */}
        <View style={styles.parties}>
          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>CONSULTANT</Text>
            <Text style={styles.partyName}>{invoice.consultant_name}</Text>
            <Text style={styles.partyLine}>{invoice.consultant_email}</Text>
          </View>
          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>BILLED TO</Text>
            <Text style={styles.partyName}>Counts AI Ltd</Text>
            <Text style={styles.partyLine}>{SIGNATORY.registered}</Text>
            <Text style={styles.partyLine}>Registered Office:</Text>
            <Text style={styles.partyLine}>124 City Rd</Text>
            <Text style={styles.partyLine}>London EC1V 2NX, United Kingdom</Text>
            <Text style={styles.partyLine}>{SIGNATORY.email}</Text>
          </View>
        </View>

        <View style={styles.rule} />

        {/* ── Consultancy basis ────────────────────────────────────────── */}
        <View style={styles.basisBox}>
          <Text style={styles.basisLabel}>CONSULTANCY BASIS</Text>
          <Text style={styles.basisText}>{CONSULTANCY_BASIS_TEXT}</Text>
        </View>

        {/* ── Services table ───────────────────────────────────────────── */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>DESCRIPTION</Text>
          <Text style={[styles.tableHeaderText, styles.colPeriod]}>PERIOD</Text>
          <Text style={[styles.tableHeaderText, { width: "20%", textAlign: "right" }]}>AMOUNT</Text>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.colDesc}>
            <Text style={styles.cellText}>{invoice.description}</Text>
          </View>
          <View style={styles.colPeriod}>
            <Text style={styles.cellMuted}>
              {formatDate(invoice.service_start_date)}{"\n"}to {formatDate(invoice.service_end_date)}
            </Text>
          </View>
          <View style={styles.colAmount}>
            <Text style={[styles.cellText, { fontFamily: "Helvetica-Bold" }]}>{total}</Text>
          </View>
        </View>

        {/* ── Totals ──────────────────────────────────────────────────── */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{total}</Text>
          </View>
          <View style={styles.totalDueRow}>
            <Text style={styles.totalDueLabel}>TOTAL DUE</Text>
            <Text style={styles.totalDueValue}>{total}</Text>
          </View>
        </View>

        {/* ── Notes ──────────────────────────────────────────────────── */}
        {invoice.notes ? (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.partyLabel, { marginBottom: 5 }]}>NOTES</Text>
            <Text style={styles.cellMuted}>{invoice.notes}</Text>
          </View>
        ) : null}

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <View style={styles.footer} fixed>
          <View style={styles.footerRule} />
          <Text style={styles.footerText}>
            {SIGNATORY.company} · {SIGNATORY.registered} · {SIGNATORY.address} · {SIGNATORY.phone} · {SIGNATORY.email}
          </Text>
          <Text style={styles.footerLegal}>{INVOICE_LEGAL_NOTE}</Text>
        </View>

      </Page>
    </Document>
  );
}
