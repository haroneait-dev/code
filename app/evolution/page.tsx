import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EvolutionBars } from "@/components/site/EvolutionBars";
import { BlurFade } from "@/components/ui/motion";
import { OPUS_PRICE, CONTEXT, MODELS_PER_YEAR, TIMELINE } from "@/lib/evolution";
import { PATCH_NOTES, KIND_INFO } from "@/lib/patch-notes";

export const metadata = {
  title: "L'évolution de Claude en chiffres",
  description:
    "Prix, fenêtre de contexte, rythme des sorties : l'évolution des modèles Claude depuis 2024 en graphiques animés, et les dernières nouveautés en direct.",
  alternates: { canonical: "/evolution" },
};

function formatDate(d: string) {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

export default function EvolutionPage() {
  const live = PATCH_NOTES.filter((n) => n.kind !== "site").slice(0, 5);
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="evolution" />
      <main className="flex-grow">
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-12 md:pt-20">
          <div className="max-w-container-max mx-auto max-w-3xl md:max-w-container-max">
            <p className="tag-note mb-7">Depuis mars 2024</p>
            <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[64px] md:leading-[1] mb-6 max-w-3xl">
              L'évolution de Claude, <span className="text-mark">en chiffres</span>.
            </h1>
            <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-2xl">
              Des modèles plus puissants, moins chers, qui lisent plus et sortent
              de plus en plus vite. Les chiffres viennent des annonces officielles,
              détaillées dans le wiki.
            </p>
          </div>
        </section>

        <section className="w-full px-margin-mobile md:px-margin-desktop pb-16">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BlurFade inView className="rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 shadow-[5px_5px_0_rgb(var(--c-mark))]">
              <h2 className="font-headline-lg text-[22px] font-bold mb-1">Le prix du haut de gamme</h2>
              <p className="text-[14.5px] text-on-surface-variant mb-5">Gamme Opus, en dollars par million de tokens générés.</p>
              <EvolutionBars bars={OPUS_PRICE} max={75} />
              <p className="text-[14.5px] text-on-surface mt-5 font-semibold">Près de 4 fois moins cher en deux ans et demi.</p>
            </BlurFade>
            <BlurFade inView delay={0.08} className="rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 shadow-[5px_5px_0_rgb(var(--c-mark))]">
              <h2 className="font-headline-lg text-[22px] font-bold mb-1">Ce qu'il peut lire d'un coup</h2>
              <p className="text-[14.5px] text-on-surface-variant mb-5">Fenêtre de contexte standard.</p>
              <EvolutionBars bars={CONTEXT} max={1000} color="mark" />
              <p className="text-[14.5px] text-on-surface mt-5 font-semibold">5 fois plus de texte qu'en 2024.</p>
            </BlurFade>
            <BlurFade inView delay={0.16} className="rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 shadow-[5px_5px_0_rgb(var(--c-mark))]">
              <h2 className="font-headline-lg text-[22px] font-bold mb-1">Le rythme des sorties</h2>
              <p className="text-[14.5px] text-on-surface-variant mb-5">Nouveaux modèles publiés par année.</p>
              <EvolutionBars bars={MODELS_PER_YEAR} max={12} />
              <p className="text-[14.5px] text-on-surface mt-5 font-semibold">Deux fois plus de modèles en 2026, avant même la fin de l'année.</p>
            </BlurFade>
          </div>
        </section>

        <section className="w-full px-margin-mobile md:px-margin-desktop py-16 bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
            <div>
              <h2 className="font-headline-lg text-[30px] md:text-[38px] font-bold tracking-tight mb-8">Les grandes étapes</h2>
              <ol className="relative border-l-2 border-outline-variant ml-2">
                {TIMELINE.map((t, i) => (
                  <BlurFade key={t.title} inView delay={Math.min(i, 3) * 0.05}>
                    <li className="pl-7 pb-8 relative list-none">
                      <span className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-[3px] border-surface-container-low ${t.big ? "bg-primary-fixed-dim" : "bg-primary"}`} />
                      <p className="font-mono text-[13px] text-on-surface-variant mb-1">{t.date}</p>
                      <p className={`font-headline-lg font-bold text-on-surface ${t.big ? "text-[22px]" : "text-[19px]"}`}>{t.title}</p>
                      <p className="text-[15.5px] text-on-surface-variant leading-relaxed">{t.text}</p>
                    </li>
                  </BlurFade>
                ))}
              </ol>
              <Link href="/wiki/modeles/evolution-claude" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4">
                La chronologie détaillée
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div>
              <div className="lg:sticky lg:top-24 rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="relative flex w-3 h-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex w-3 h-3 rounded-full bg-primary" />
                  </span>
                  <h2 className="font-headline-lg text-[20px] font-bold">En direct</h2>
                  <span className="text-[13px] text-on-surface-variant">les dernières nouveautés</span>
                </div>
                <ul className="flex flex-col gap-4">
                  {live.map((n) => (
                    <li key={n.title} className="border-b border-outline-variant pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded px-2 py-0.5 text-[12px] font-semibold ${KIND_INFO[n.kind].className}`}>{KIND_INFO[n.kind].label}</span>
                        <span className="font-mono text-[12.5px] text-on-surface-variant">{formatDate(n.date)}</span>
                      </div>
                      {n.href ? (
                        <Link href={n.href} className="font-semibold text-[15.5px] text-on-surface hover:text-primary">{n.title}</Link>
                      ) : (
                        <p className="font-semibold text-[15.5px] text-on-surface">{n.title}</p>
                      )}
                    </li>
                  ))}
                </ul>
                <Link href="/patch-notes" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:underline underline-offset-4">
                  Toutes les patch notes
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
