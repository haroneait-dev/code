import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { decodeShare, shareParams } from "@/lib/share";

export function generateStaticParams() {
  return shareParams();
}

export async function generateMetadata({ params }: { params: Promise<{ niveau: string; theme: string }> }) {
  const { niveau, theme } = await params;
  const d = decodeShare(niveau, theme);
  const title = `Niveau ${d.level ?? ""} sur Claude${d.theme ? `, parcours ${d.theme.name}` : ""}`;
  return {
    title,
    description: "Et vous, quel est votre niveau ? Test gratuit en 10 questions, avec un parcours sur mesure.",
  };
}

export default async function SharedResultPage({ params }: { params: Promise<{ niveau: string; theme: string }> }) {
  const { niveau, theme } = await params;
  const d = decodeShare(niveau, theme);
  if (!d.level) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="test" />
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-section">
        <div className="max-w-2xl mx-auto">
          <p className="tag-note mb-7">Résultat partagé</p>
          <h1 className="text-h1 font-display-xl font-extrabold tracking-tight text-on-surface mb-6">
            Niveau <span className="text-mark">{d.level}</span>
            {d.theme ? <> en {d.theme.name.toLowerCase()}</> : null}.
          </h1>
          <p className="text-body md:text-body text-on-surface-variant leading-relaxed mb-8">
            Et vous, où en êtes-vous avec Claude ? 10 questions, 2 minutes, et vous
            recevez votre niveau et un parcours sur mesure. Gratuit, sans inscription.
          </p>
          <Link href="/test" className="btn-primary inline-flex items-center justify-center gap-2 group">
            Faire le test
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
