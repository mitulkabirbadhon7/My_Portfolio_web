import type { Metadata } from "next";
import { Newsreader, Inter, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { PublicShell } from "@/components/layout/public-shell";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Production Canonical Domain from docs/CONFIG.md
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mitulkabirbadhon.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mitul Kabir Badhon — Software Engineer & Systems Architect",
    template: "%s | Mitul Kabir Badhon",
  },
  description:
    "Personal portfolio and engineering log of Mitul Kabir Badhon. High-performance backends, clean TypeScript architecture, and deliberate digital craftsmanship.",
  keywords: [
    "Mitul Kabir Badhon",
    "Software Engineer",
    "Full Stack Developer",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Distributed Systems",
    "Portfolio",
  ],
  authors: [{ name: "Mitul Kabir Badhon", url: "https://github.com/mitulkabirbadhon7" }],
  creator: "Mitul Kabir Badhon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Mitul Kabir Badhon — Software Engineer & Systems Architect",
    description:
      "Personal portfolio and engineering log of Mitul Kabir Badhon. High-performance backends, clean TypeScript architecture, and deliberate digital craftsmanship.",
    siteName: "Mitul Kabir Badhon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitul Kabir Badhon — Software Engineer & Systems Architect",
    description:
      "Personal portfolio and engineering log of Mitul Kabir Badhon. High-performance backends, clean TypeScript architecture, and deliberate digital craftsmanship.",
    creator: "@mitulkabir",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-[#5DD62C]/20 selection:text-[#5DD62C]">
        <NoiseOverlay />
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
      </body>
    </html>
  );
}
