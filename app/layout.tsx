import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/lib/session";
import { TourProvider } from "@/lib/tourState";
import { A11yProvider } from "@/lib/a11y";
import { DemoBanner } from "@/components/pf/DemoBanner";
import { JudgeTourOverlay } from "@/components/pf/JudgeTourOverlay";
import { AccessibilityMenu } from "@/components/pf/AccessibilityMenu";
import { AssistantWidget } from "@/components/pf/AssistantWidget";

// Vercel injects VERCEL_URL automatically at build/runtime; this resolves the
// OG/Twitter image URLs correctly once deployed without any manual config.
const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PF Saathi | Understand your PF, find what's wrong, know what to do next",
  description:
    "A citizen-first layer over India's EPFO. Prototype with simulated data — not connected to EPFO.",
  openGraph: {
    title: "PF Saathi",
    description: "Understand your PF. Find what's wrong. Know what to do next.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B2A63",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <A11yProvider>
          <DemoBanner />
          <SessionProvider>
            <TourProvider>
              {children}
              <JudgeTourOverlay />
              <AccessibilityMenu />
              <AssistantWidget />
            </TourProvider>
          </SessionProvider>
        </A11yProvider>
      </body>
    </html>
  );
}
