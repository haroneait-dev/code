import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LearningPath, SectionToc } from "@/components/site/SectionToc";
import { articleCountBySection } from "@/lib/wiki-manifest";
import { curriculum, totalLessons } from "@/lib/curriculum";

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
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-14 md:pt-20">
          <div className="max-w-container-max mx-auto">
            <p className="tag-note mb-7">Partie Claude Code · {count} articles · Claude Code 2.1.288</p>
            <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[64px] md:leading-[1] mb-6 max-w-3xl">
              <span className="text-mark">Claude Code</span>, l'agent qui code avec vous.
            </h1>
            <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-2xl mb-8">
              Pour les développeurs et les curieux du terminal : une formation de{" "}
              {curriculum.length} modules et {totalLessons} leçons, et un wiki qui
              couvre le CLI, les outils, l'automatisation, l'API et le travail en
              équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/learn"
                className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] group"
              >
                Commencer la formation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </Link>
              <Link
                href="/wiki/actualites/nouveautes-2026"
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
              De l'installation au travail en équipe. Gardez un projet réel sous
              la main pour pratiquer à chaque étape.
            </p>
            <LearningPath steps={PATH} />
          </div>
        </section>

        <section className="w-full px-margin-mobile md:px-margin-desktop py-14 md:py-20">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-lg text-[30px] md:text-[38px] leading-[1.1] font-bold tracking-tight mb-10">
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
              <h2 className="font-headline-lg text-[24px] font-bold mb-6">Pour aller plus loin</h2>
              <SectionToc categories={["modeles", "prompt-engineering", "actualites"]} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
