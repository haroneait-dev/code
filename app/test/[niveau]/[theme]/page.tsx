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
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <p className="tag-note mb-7">Résultat partagé</p>
          <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[60px] md:leading-[1] mb-6">
            Niveau <span className="text-mark">{d.level}</span>
            {d.theme ? <> en {d.theme.name.toLowerCase()}</> : null}.
          </h1>
          <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed mb-8">
            Et vous, où en êtes-vous avec Claude ? 10 questions, 2 minutes, et vous
            recevez votre niveau et un parcours sur mesure. Gratuit, sans inscription.
          </p>
          <Link href="/test" className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[16px] group">
            Faire le test
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
