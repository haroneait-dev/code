import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { curriculum, totalLessons } from "@/lib/curriculum";
import { CATEGORIES, articleCount, stubsByCategory } from "@/lib/wiki-manifest";

// Date de la dernière revue complète du contenu.
const LAST_REVIEW = "3 octobre 2026";
const CLAUDE_CODE_VERSION = "2.1.288";

// Ce qui a vraiment changé ces dernières semaines, avec la page qui en parle.
const RECENT = [
  {
    date: "1 oct.",
    title: "Les mods arrivent dans Claude Code",
    text: "Les plugins peuvent maintenant dessiner des panneaux et réagir aux événements de la session.",
    href: "/wiki/plugins/mods",
  },
  {
    date: "29 sept.",
    title: "Sonnet 5.5 remplace Sonnet 5",
    text: "1M de tokens de contexte, 2 $ / 10 $ le million de tokens : plus rapide et moins cher que Sonnet 5.",
    href: "/wiki/modeles/opus-sonnet-5-5",
  },
  {
    date: "22 sept.",
    title: "Opus 5.5 devient le modèle par défaut",
    text: "Le niveau de Fable 5.1 sur la plupart des tâches, pour 4 $ / 20 $ le million de tokens.",
    href: "/wiki/modeles/opus-sonnet-5-5",
  },
  {
    date: "18 sept.",
    title: "AGENTS.md est lu par Claude Code",
    text: "Un projet sans CLAUDE.md peut réutiliser le fichier d'instructions partagé avec d'autres agents.",
    href: "/wiki/demarrer/claude-md",
  },
];

// Un parcours dans l'ordre : l'ordre compte, d'où la numérotation.
const PATH = [
  {
    step: "1",
    title: "Installer et lancer",
    text: "Installer le CLI, ouvrir un projet, écrire un premier CLAUDE.md et comprendre les modes de permission.",
    href: "/wiki/demarrer/installation",
    cta: "Installation",
  },
  {
    step: "2",
    title: "Lui confier du vrai travail",
    text: "Plan mode, sous-agents, gestion du contexte : déléguer une tâche de bout en bout et relire ce qui revient.",
    href: "/learn",
    cta: "La formation",
  },
  {
    step: "3",
    title: "L'outiller pour votre équipe",
    text: "Skills, hooks, serveurs MCP et plugins : transformer vos habitudes en réglages partagés.",
    href: "/wiki/plugins/introduction-plugins",
    cta: "Plugins et skills",
  },
];

export default function LandingPage() {
  const totalModules = curriculum.length;
  const wikiTotal = articleCount();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="formation" />

      <main className="flex-grow">
        {/* Ouverture */}
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-start">
            <div className="min-w-0">
              <p className="tag-note mb-7">
                Revu le {LAST_REVIEW} · Claude Code {CLAUDE_CODE_VERSION}
              </p>
              <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[42px] leading-[1.04] md:text-[68px] md:leading-[0.98] mb-6">
                Apprendre <span className="text-mark">Claude Code</span>, en
                français, sans détour.
              </h1>
              <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-xl mb-8">
                Une formation gratuite et sans inscription : {totalModules}{" "}
                modules, {totalLessons} leçons et {wikiTotal} articles de
                référence, relus à chaque nouvelle version.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/learn"
                  className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] group"
                >
                  Commencer la formation
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    strokeWidth={2}
                  />
                </Link>
                <Link
                  href="/wiki"
                  className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px]"
                >
                  Parcourir le wiki
                </Link>
              </div>
            </div>

            {/* Carnet : une vraie première session */}
            <figure className="min-w-0 rounded-lg border-[1.5px] border-on-surface bg-[#2b2119] text-[#f6efe3] shadow-[6px_6px_0_#f2b23e] rotate-[0.6deg]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 font-mono text-[12px] text-[#c9b9a6]">
                <span>~/mon-projet</span>
                <span>première session</span>
              </div>
              <pre className="px-5 py-5 font-mono text-[13px] leading-[1.75] overflow-x-auto">
                <span className="text-[#c9b9a6]"># 1. Installer (macOS, Linux, WSL)</span>
                {"\n"}
                <span className="text-[#f2b23e]">$</span> curl -fsSL https://claude.ai/install.sh | bash
                {"\n\n"}
                <span className="text-[#c9b9a6]"># 2. Ouvrir un projet</span>
                {"\n"}
                <span className="text-[#f2b23e]">$</span> cd mon-projet && claude
                {"\n\n"}
                <span className="text-[#c9b9a6]"># 3. Lui faire lire le code</span>
                {"\n"}
                <span className="text-[#f2b23e]">&gt;</span> /init
                {"\n"}
                <span className="text-[#9fd3b4]">  ✓ CLAUDE.md créé (stack, scripts, conventions)</span>
                {"\n\n"}
                <span className="text-[#f2b23e]">&gt;</span> Ajoute une validation zod sur
                {"\n"}
                {"  "}app/api/users/route.ts et lance les tests
              </pre>
              <figcaption className="px-5 pb-4 text-[12px] text-[#c9b9a6]">
                Windows : <code className="font-mono">irm https://claude.ai/install.ps1 | iex</code>
              </figcaption>
            </figure>
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
                  Claude Code sort une version presque chaque jour. On garde ici
                  ce qui change votre façon de travailler, le reste est dans le
                  changelog.
                </p>
              </div>
              <Link
                href="/wiki/actualites/nouveautes-2026"
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4 shrink-0"
              >
                Toutes les nouveautés 2026
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              {RECENT.map((item) => (
                <li key={item.title} className="border-t border-outline-variant">
                  <Link
                    href={item.href}
                    className="grid grid-cols-[72px_1fr] gap-4 py-5 group"
                  >
                    <span className="font-mono text-[13px] text-on-surface-variant pt-1 tabular-nums">
                      {item.date}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-[17px] text-on-surface group-hover:text-primary transition-colors mb-1">
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

        {/* Parcours */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-16 md:py-24">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-lg text-[32px] md:text-[42px] leading-[1.1] font-bold tracking-tight mb-3 max-w-2xl">
              Par où commencer
            </h2>
            <p className="text-on-surface-variant text-[17px] leading-relaxed mb-10 max-w-2xl">
              Trois étapes, dans cet ordre. Chacune tient en une soirée si vous
              avez un projet sous la main pour pratiquer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PATH.map((p) => (
                <Link
                  key={p.step}
                  href={p.href}
                  className="group flex flex-col bg-surface-container-lowest border border-outline-variant rounded-lg p-6 soft-lift"
                >
                  <span className="font-display-xl text-[44px] leading-none font-extrabold text-primary-fixed-dim mb-4">
                    {p.step}
                  </span>
                  <span className="font-semibold text-[19px] text-on-surface mb-2">
                    {p.title}
                  </span>
                  <span className="text-[15px] text-on-surface-variant leading-relaxed mb-5 flex-grow">
                    {p.text}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
                    {p.cta}
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sommaire du wiki */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-16 md:py-20 bg-surface-container-lowest border-t border-outline-variant">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
            <div>
              <h2 className="font-headline-lg text-[32px] md:text-[42px] leading-[1.1] font-bold tracking-tight mb-3">
                Le wiki, rangé comme un sommaire
              </h2>
              <p className="text-on-surface-variant text-[17px] leading-relaxed mb-6">
                {wikiTotal} articles en {CATEGORIES.length} rubriques. Chaque
                article indique sa date de dernière mise à jour.
              </p>
              <Link
                href="/wiki"
                className="btn-secondary h-11 px-5 rounded-md inline-flex items-center gap-2 font-semibold text-[15px]"
              >
                Ouvrir le wiki
              </Link>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {CATEGORIES.map((cat) => (
                <li key={cat.id} className="border-b border-dotted border-outline">
                  <Link
                    href={`/wiki/${cat.id}`}
                    className="flex items-baseline gap-3 py-3 group"
                  >
                    <span className="font-medium text-on-surface group-hover:text-primary transition-colors min-w-0 truncate">
                      {cat.name}
                    </span>
                    <span className="flex-grow" aria-hidden />
                    <span className="font-mono text-[13px] text-on-surface-variant tabular-nums">
                      {stubsByCategory(cat.id).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Clôture */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-16 md:py-20 border-t border-outline-variant">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-headline-lg text-[28px] md:text-[34px] leading-[1.15] font-bold tracking-tight mb-2">
                Pas de compte, pas de paywall.
              </h2>
              <p className="text-on-surface-variant text-[17px] leading-relaxed">
                Tout le contenu est ouvert. Ouvrez une leçon, gardez un terminal
                à côté, et pratiquez sur votre propre code.
              </p>
            </div>
            <Link
              href="/learn"
              className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] group shrink-0"
            >
              Première leçon
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                strokeWidth={2}
              />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
