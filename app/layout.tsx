import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { StoreProvider } from "@/lib/store";
import { CookieConsent } from "@/components/shared/cookie-consent";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://countsai.com"),
  title: {
    default: "Counts AI — Build Your Career in the AI Economy",
    template: "%s | Counts AI",
  },
  description:
    "Counts AI is the AI career platform — learn AI engineering, get certified, gain experience, and access AI careers. For businesses: access AI talent and build AI-powered products.",
  keywords: [
    "AI training",
    "AI career",
    "AI jobs",
    "generative AI",
    "AI engineering",
    "forward deployed engineer",
    "AI internship",
    "AI certification",
    "AI workforce",
    "UK AI company",
  ],
  openGraph: {
    type: "website",
    siteName: "Counts AI",
    title: "Counts AI — Build Your Career in the AI Economy",
    description:
      "Learn AI engineering, get certified, gain experience, and access AI careers. For businesses: access AI talent and build AI-powered products.",
    url: "https://countsai.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Counts AI — Build Your Career in the AI Economy",
    description: "The AI career platform. Learn, build, get certified, get hired.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://countsai.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
        style={{ fontFamily: "var(--font-sans)", "--font-heading": "var(--font-sans)" } as React.CSSProperties}
      >
        <RoleProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </RoleProvider>
        <CookieConsent />
        <div id="portal-root" />
      </body>
    </html>
  );
}
