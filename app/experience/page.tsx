import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { TerminalDemo } from "@/components/site/TerminalDemo";

export const metadata = { title: "Essayer une démonstration de Claude Code", description: "Explorez une démonstration locale de Claude Code, puis suivez la formation en français." };

export default function ExperiencePage() {
  return <div className="min-h-screen flex flex-col"><SiteHeader active="code" />
    <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section">
      <h1 className="font-display-xl text-h1 font-bold mb-6">Claude Code en pratique</h1>
      <p className="text-body text-on-surface-variant max-w-reading mb-8">Tapez une demande pour explorer la démonstration. Les réponses sont préparées à l’avance ; rien n’est envoyé.</p>
      <div className="max-w-3xl mb-8"><TerminalDemo /></div>
      <Link href="/learn" className="btn-primary">Commencer la formation</Link>
    </main><SiteFooter /></div>;
}
