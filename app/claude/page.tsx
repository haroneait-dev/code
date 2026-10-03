import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LearningPath, SectionToc } from "@/components/site/SectionToc";
import { articleCountBySection } from "@/lib/wiki-manifest";

export const metadata = {
  title: "Claude : le guide complet en français",
  description:
    "Apprendre à utiliser Claude au quotidien : premiers pas, projets, mémoire, recherche, fichiers, Cowork, extensions et cas d'usage concrets.",
};

const PATH = [
  {
    title: "Premiers pas",
    text: "Où utiliser Claude, à quoi ressemble l'interface, et une première conversation utile.",
    href: "/wiki/claude-bases/premiers-pas",
  },
  {
    title: "Bien formuler ses demandes",
    text: "La méthode contexte, objectif, contraintes, format, avec des modèles à copier.",
    href: "/wiki/claude-bases/bien-demander",
  },
  {
    title: "Choisir son offre et son modèle",
    text: "Gratuit ou payant, Sonnet ou Opus, et comment ne pas épuiser son quota.",
    href: "/wiki/claude-bases/offres-et-limites",
  },
  {
    title: "Protéger ses données",
    text: "Le réglage d'entraînement, l'incognito, et ce qu'il ne faut jamais envoyer.",
    href: "/wiki/claude-bases/confidentialite",
  },
  {
    title: "Créer ses premiers projets",
    text: "Un espace par sujet, avec vos documents et vos instructions.",
    href: "/wiki/claude-ai/projects-creation",
  },
  {
    title: "Fichiers, recherche et mémoire",
    text: "Lui faire lire et créer des fichiers, chercher sur le web, retenir le contexte.",
    href: "/wiki/claude-ai/docs-slides-design",
  },
  {
    title: "Le laisser agir avec Cowork",
    text: "Confier une vraie tâche qui touche vos fichiers, vos outils et le web.",
    href: "/wiki/claude-agents/cowork",
  },
  {
    title: "L'appliquer à votre vie",
    text: "Études, rédaction, données, entreprise, quotidien : des méthodes prêtes à l'emploi.",
    href: "/wiki/cas-usage/vie-quotidienne",
  },
];

export default function ClaudeHubPage() {
  const count = articleCountBySection("claude");

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="claude" showSearch />

      <main className="flex-grow">
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-14 md:pt-20">
          <div className="max-w-container-max mx-auto max-w-3xl md:max-w-container-max">
            <p className="tag-note mb-7">Partie Claude · {count} articles · revue le 3 octobre 2026</p>
            <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[64px] md:leading-[1] mb-6 max-w-3xl">
              <span className="text-mark">Claude</span>, l'assistant, expliqué de A à Z.
            </h1>
            <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-2xl mb-8">
              Pour tout le monde, sans connaissances techniques : discuter, écrire,
              analyser des documents, chercher sur le web, et depuis 2026, lui
              confier de vraies tâches. Chaque article est à jour des dernières
              versions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/wiki/claude-bases/premiers-pas"
                className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] group"
              >
                Commencer par les bases
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </Link>
              <Link
                href="/wiki/actualites/nouveautes-claude-2026"
                className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center font-semibold text-[15px]"
              >
                Les nouveautés 2026
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full px-margin-mobile md:px-margin-desktop py-14 md:py-16 bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-lg text-[30px] md:text-[38px] leading-[1.1] font-bold tracking-tight mb-3">
              Le parcours conseillé
            </h2>
            <p className="text-on-surface-variant text-[17px] leading-relaxed mb-8 max-w-2xl">
              Huit étapes, dans cet ordre. Comptez une vingtaine de minutes par
              étape, Claude ouvert dans un autre onglet pour essayer au fur et à
              mesure.
            </p>
            <LearningPath steps={PATH} />
          </div>
        </section>

        <section className="w-full px-margin-mobile md:px-margin-desktop py-14 md:py-20">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-lg text-[30px] md:text-[38px] leading-[1.1] font-bold tracking-tight mb-10">
              Tous les articles
            </h2>
            <SectionToc categories={["claude-bases", "claude-ai", "claude-agents", "cas-usage"]} />

            <div className="mt-16 pt-10 border-t border-outline-variant">
              <h2 className="font-headline-lg text-[24px] font-bold mb-6">Pour aller plus loin</h2>
              <SectionToc categories={["modeles", "prompt-engineering", "obsidian"]} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
