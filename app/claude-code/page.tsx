import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LearningPath, SectionToc } from "@/components/site/SectionToc";
import { articleCountBySection } from "@/lib/wiki-manifest";
import { curriculum, totalLessons } from "@/lib/curriculum";
import { ClaudeCodePlayer } from "@/components/site/ClaudeCodePlayer";
import { Section3D } from "@/components/site/Section3D";

export const metadata = {
  title: "Claude Code : formation et wiki en français",
  description:
    "Apprendre Claude Code, l'agent de développement d'Anthropic : formation en modules, et wiki sur le CLI, les outils, les hooks, les skills, MCP, les plugins et l'API.",
};

const PATH = [
  {
    title: "Installer Claude Code",
    text: "L'installeur natif, la connexion, et les premières vérifications.",
    href: "/wiki/demarrer/installation",
  },
  {
    title: "Votre premier prompt",
    text: "Déléguer une vraie tâche plutôt que poser une question.",
    href: "/wiki/demarrer/premier-prompt",
  },
  {
    title: "CLAUDE.md et AGENTS.md",
    text: "Donner le contexte du projet une fois pour toutes.",
    href: "/wiki/demarrer/claude-md",
  },
  {
    title: "Les modes de permission",
    text: "Auto, manuel, plan : garder le contrôle sans tout valider.",
    href: "/wiki/cli/permissions-modes",
  },
  {
    title: "Suivre la formation",
    text: "Les modules pas à pas, avec des exercices sur votre propre code.",
    href: "/learn",
  },
  {
    title: "Skills, hooks et MCP",
    text: "Automatiser vos habitudes et brancher vos outils.",
    href: "/wiki/skills/structure-skill",
  },
  {
    title: "Plusieurs agents à la fois",
    text: "Sous-agents, agent view, dynamic workflows, routines dans le cloud.",
    href: "/wiki/cli/agent-view-sessions",
  },
  {
    title: "Plugins et mods",
    text: "Partager sa configuration avec l'équipe et modifier l'interface.",
    href: "/wiki/plugins/introduction-plugins",
  },
];

export default function ClaudeCodeHubPage() {
  const count = articleCountBySection("code");

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="code" showSearch />

      <main className="flex-grow">
        <section className="py-section w-full px-margin-mobile md:px-margin-desktop   ">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,520px)] gap-10 lg:gap-12 items-center">
            <div>
            <div className="flex items-start justify-between gap-4">
              <p className="tag-note mb-7">Partie Claude Code · {count} articles · Claude Code 2.1.288</p>
              <Section3D name="claude-code" className="w-24 sm:w-32 md:w-44 -mt-6 -mr-2 -mb-8 md:-mb-14" />
            </div>
            <h1 className="text-h1 font-display-xl font-extrabold tracking-tight text-on-surface mb-6 max-w-3xl">
              <span className="text-mark">Claude Code</span>, l'agent qui code avec vous.
            </h1>
            <p className="text-body md:text-body text-on-surface-variant leading-relaxed max-w-2xl mb-8">
              Pour les développeurs et les curieux du terminal : une formation de{" "}
              {curriculum.length} modules et {totalLessons} leçons, et un wiki qui
              couvre le CLI, les outils, l'automatisation, l'API et le travail en
              équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/learn"
                className="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                Commencer la formation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </Link>
              <Link
                href="/wiki/actualites/nouveautes-2026"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Les nouveautés 2026
              </Link>
            </div>
            </div>
            <ClaudeCodePlayer />
          </div>
        </section>

        <section className="py-section w-full px-margin-mobile md:px-margin-desktop   bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-container-max mx-auto">
            <h2 className="text-h2 font-headline-lg   leading-[1.1] font-bold tracking-tight mb-3">
              Le parcours conseillé
            </h2>
            <p className="text-on-surface-variant text-body leading-relaxed mb-8 max-w-2xl">
              De l'installation au travail en équipe. Gardez un projet réel sous
              la main pour pratiquer à chaque étape.
            </p>
            <LearningPath steps={PATH} />
          </div>
        </section>

        <section className="py-section w-full px-margin-mobile md:px-margin-desktop  ">
          <div className="max-w-container-max mx-auto">
            <h2 className="text-h2 font-headline-lg   leading-[1.1] font-bold tracking-tight mb-10">
              Tous les articles
            </h2>
            <SectionToc
              categories={[
                "demarrer",
                "cli",
                "outils",
                "slash-commands",
                "hooks",
                "skills",
                "subagents",
                "mcp",
                "plugins",
                "workflows",
                "api",
                "enterprise",
              ]}
            />

            <div className="mt-16 pt-10 border-t border-outline-variant">
              <h2 className="text-h2 font-headline-lg  font-bold mb-6">Pour aller plus loin</h2>
              <SectionToc categories={["modeles", "prompt-engineering", "actualites"]} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
