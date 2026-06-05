import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/site/ChatWidget";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jbm = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbm",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://claude-code-harone1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Claude Mastery — Formation Claude Code en français",
    template: "%s — Claude Mastery",
  },
  description:
    "La formation francophone de référence pour maîtriser Claude Code, le CLI d'Anthropic. Modules pratiques, wiki et communauté.",
  keywords: [
    "Claude Code",
    "Anthropic",
    "formation IA",
    "CLI Claude",
    "développement assisté par IA",
    "Claude Mastery",
    "tutoriel Claude",
  ],
  authors: [{ name: "Claude Mastery" }],
  creator: "Claude Mastery",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Claude Mastery",
    title: "Claude Mastery — Formation Claude Code en français",
    description:
      "Maîtrise Claude Code avec la formation francophone de référence. Modules pratiques, wiki et communauté.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Mastery — Formation Claude Code en français",
    description:
      "Maîtrise Claude Code avec la formation francophone de référence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${hanken.variable} ${inter.variable} ${jbm.variable}`}
    >
      <body className="font-body-rt antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
