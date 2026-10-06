import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { decodeShare, shareParams } from "@/lib/share";

export function generateStaticParams() {
  return shareParams();
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string; niveau: string }> }) {
  const { theme, niveau } = await params;
  const d = decodeShare(niveau, theme);
  return {
    title: `Niveau ${d.level} validé, parcours ${d.theme?.name ?? ""}`,
    description: "Un parcours en 4 niveaux pour passer de débutant à expert avec Claude. Gratuit, sans inscription.",
  };
}

export default async function BadgePage({ params }: { params: Promise<{ theme: string; niveau: string }> }) {
  const { theme, niveau } = await params;
  const d = decodeShare(niveau, theme);
  if (!d.level || !d.theme) notFound();
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="apps" />
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <p className="tag-note mb-7">Badge partagé</p>
          <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[60px] md:leading-[1] mb-6">
            Niveau <span className="text-mark">{d.level}</span> validé en {d.theme.name.toLowerCase()}.
          </h1>
          <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed mb-8">
            Ce parcours fait passer de débutant à expert avec Claude, étape par étape,
            avec un projet concret à chaque niveau. Gratuit, sans inscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/applications#${d.theme.id}`} className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[16px]">
              Voir le parcours <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <Link href="/test" className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center font-semibold text-[15px]">
              Faire le test de niveau
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
