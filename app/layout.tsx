import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
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
    default: "Claude Mastery : apprendre Claude et Claude Code en français",
    template: "%s — Claude Mastery",
  },
  description:
    "Apprendre Claude et Claude Code en français : guides pour l'assistant au quotidien, formation et wiki pour les développeurs. Gratuit, sans inscription.",
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
      "Maîtrise Claude Code avec la formation francophone de référence. Modules pratiques, wiki et fiches, en accès libre.",
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
      className={`${display.variable} ${body.variable} ${jbm.variable}`}
    >
      <body className="font-body-rt antialiased">
        {children}
      </body>
    </html>
  );
}
