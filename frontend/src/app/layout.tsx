import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { PublicShell } from "@/components/layout/public-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: replace with production domain
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mitul Kabir Badhon | Software Engineer & Architect",
    template: "%s | Mitul Kabir Badhon",
  },
  description:
    "Full-stack software engineer specializing in scalable distributed architectures, Next.js, TypeScript, and modern high-performance web systems.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "Tailwind CSS",
    "System Design",
    "Portfolio",
  ],
  authors: [{ name: "Mitul Kabir Badhon", url: "https://github.com/mitulkabirbadhon7" }],
  creator: "Mitul Kabir Badhon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Mitul Kabir Badhon | Software Engineer & Architect",
    description:
      "Full-stack software engineer specializing in scalable distributed architectures, Next.js, TypeScript, and modern high-performance web systems.",
    siteName: "Mitul Kabir Badhon Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitul Kabir Badhon | Software Engineer & Architect",
    description:
      "Full-stack software engineer specializing in scalable distributed architectures, Next.js, TypeScript, and modern high-performance web systems.",
    creator: "@mitulkabir",
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
      </body>
    </html>
  );
}
