import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Code — Formation Complète",
  description:
    "Formation interactive et complète sur Claude Code, le CLI officiel d'Anthropic pour coder avec l'IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
