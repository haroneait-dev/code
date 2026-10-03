import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { curriculum, totalLessons } from "@/lib/curriculum";
import { articleCount, articleCountBySection } from "@/lib/wiki-manifest";

// Date de la dernière revue complète du contenu.
const LAST_REVIEW = "3 octobre 2026";

// Ce qui a vraiment changé ces dernières semaines, avec la page qui en parle.
const RECENT = [
  {
    date: "1 oct.",
    part: "Claude Code",
    title: "Les mods arrivent dans Claude Code",
    text: "Les plugins peuvent dessiner des panneaux et réagir aux événements de la session.",
    href: "/wiki/plugins/mods",
  },
  {
    date: "28 sept.",
    part: "Les deux",
    title: "Sonnet 5.5 remplace Sonnet 5",
    text: "Plus rapide et moins cher : 2 $ / 10 $ le million de tokens, 1M de tokens de contexte.",
    href: "/wiki/modeles/opus-sonnet-5-5",
  },
  {
    date: "22 sept.",
    part: "Les deux",
    title: "Opus 5.5, le niveau de Fable pour moins cher",
    text: "Le nouveau modèle par défaut de Claude Code, au niveau de Fable 5.1 sur la plupart des tâches.",
    href: "/wiki/modeles/opus-sonnet-5-5",
  },
  {
    date: "16 sept.",
    part: "Claude",
    title: "« One Claude » : chat, Cowork et Artifacts fusionnés",
    text: "Avec Claude Docs, Slides et Design pour écrire, présenter et maquetter sans quitter la conversation.",
    href: "/wiki/claude-ai/docs-slides-design",
  },
];

export default function LandingPage() {
  const totalModules = curriculum.length;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />

      <main className="flex-grow">
        {/* Ouverture */}
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-container-max mx-auto">
            <p className="tag-note mb-7">Revu le {LAST_REVIEW}</p>
            <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[42px] leading-[1.04] md:text-[72px] md:leading-[0.98] mb-6 max-w-4xl">
              Apprendre <span className="text-mark">Claude</span> et{" "}
              <span className="text-mark">Claude Code</span>, en français.
            </h1>
            <p className="text-[18px] md:text-[21px] text-on-surface-variant leading-relaxed max-w-2xl">
              Gratuit et sans inscription. {articleCount()} articles et une
              formation de {totalLessons} leçons, relus à chaque nouvelle version.
              Choisissez votre porte d'entrée.
            </p>
          </div>
        </section>

        {/* Les deux parties */}
        <section className="w-full px-margin-mobile md:px-margin-desktop pb-16 md:pb-24">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Claude */}
            <Link
              href="/claude"
              className="group flex flex-col rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-7 md:p-9 shadow-[6px_6px_0_#fbe3a8] hover:shadow-[8px_8px_0_#f2b23e] transition-shadow"
            >
              <span className="font-mono text-[13px] text-on-surface-variant mb-3">
                Pour tout le monde · {articleCountBySection("claude")} articles
              </span>
              <span className="font-headline-lg text-[34px] md:text-[42px] leading-[1.05] font-extrabold text-on-surface mb-4">
                Claude
              </span>
              <span className="text-[17px] text-on-surface-variant leading-relaxed mb-7">
                L'assistant au quotidien : bien formuler ses demandes, projets,
                mémoire, recherche, fichiers, Cowork, Chrome et Office, et des cas
                d'usage pour les études, le travail et la vie de tous les jours.
              </span>

              <span className="rounded-md bg-surface-container-low border border-outline-variant p-4 mb-7 text-[15px] leading-relaxed">
                <span className="block text-on-surface-variant mb-2">Vous</span>
                <span className="block text-on-surface mb-4">
                  Voici mes relevés bancaires de 3 mois. Classe mes dépenses et
                  propose 3 économies réalistes.
                </span>
                <span className="block text-on-surface-variant mb-2">Claude</span>
                <span className="block text-on-surface">
                  J'ai classé 214 opérations en 9 catégories. Le poste qui a le
                  plus augmenté : les livraisons de repas (+68 €/mois)…
                </span>
              </span>

              <span className="mt-auto inline-flex items-center gap-2 font-semibold text-primary">
                Découvrir Claude
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </span>
            </Link>

            {/* Claude Code */}
            <Link
              href="/claude-code"
              className="group flex flex-col rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-7 md:p-9 shadow-[6px_6px_0_#cfe0d5] hover:shadow-[8px_8px_0_#2f5d46] transition-shadow"
            >
              <span className="font-mono text-[13px] text-on-surface-variant mb-3">
                Pour les développeurs · {totalModules} modules · {articleCountBySection("code")} articles
              </span>
              <span className="font-headline-lg text-[34px] md:text-[42px] leading-[1.05] font-extrabold text-on-surface mb-4">
                Claude Code
              </span>
              <span className="text-[17px] text-on-surface-variant leading-relaxed mb-7">
                L'agent qui code avec vous dans le terminal : une formation pas à
                pas, et un wiki sur les outils, les hooks, les skills, MCP, les
                plugins, l'API et le travail en équipe.
              </span>

              <span className="rounded-md bg-[#2b2119] text-[#f6efe3] p-4 mb-7 font-mono text-[13px] leading-[1.8] overflow-x-auto block">
                <span className="block"><span className="text-[#f2b23e]">$</span> curl -fsSL https://claude.ai/install.sh | bash</span>
                <span className="block"><span className="text-[#f2b23e]">$</span> cd mon-projet && claude</span>
                <span className="block"><span className="text-[#f2b23e]">&gt;</span> /init</span>
                <span className="block text-[#9fd3b4]">  ✓ CLAUDE.md créé</span>
              </span>

              <span className="mt-auto inline-flex items-center gap-2 font-semibold text-primary">
                Apprendre Claude Code
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </span>
            </Link>
          </div>
        </section>

        {/* Ce qui a changé */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-16 md:py-20 bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <h2 className="font-headline-lg text-[32px] md:text-[42px] leading-[1.1] font-bold tracking-tight mb-3">
                  Ce qui a changé ces dernières semaines
                </h2>
                <p className="text-on-surface-variant text-[17px] leading-relaxed">
                  On garde ici ce qui change vraiment votre façon d'utiliser Claude.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  href="/wiki/actualites/nouveautes-claude-2026"
                  className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4"
                >
                  Nouveautés de Claude
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </Link>
                <Link
                  href="/wiki/actualites/nouveautes-2026"
                  className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4"
                >
                  Nouveautés de Claude Code
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              {RECENT.map((item) => (
                <li key={item.title} className="border-t border-outline-variant">
                  <Link href={item.href} className="grid grid-cols-[76px_1fr] gap-4 py-6 group">
                    <span className="font-mono text-[13px] text-on-surface-variant pt-1 tabular-nums">
                      {item.date}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">
                        {item.part}
                      </span>
                      <span className="block font-semibold text-[17px] text-on-surface group-hover:text-primary transition-colors mb-1.5">
                        {item.title}
                      </span>
                      <span className="block text-[15px] text-on-surface-variant leading-relaxed">
                        {item.text}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Clôture */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-16 md:py-20">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-headline-lg text-[28px] md:text-[34px] leading-[1.15] font-bold tracking-tight mb-2">
                Pas de compte, pas de paywall.
              </h2>
              <p className="text-on-surface-variant text-[17px] leading-relaxed">
                Tout le contenu est ouvert. Gardez Claude ouvert dans un autre
                onglet et pratiquez au fil de la lecture.
              </p>
            </div>
            <Link
              href="/wiki"
              className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] shrink-0"
            >
              Voir tout le wiki
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
