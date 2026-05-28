import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Wrench,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Zap,
  Cpu,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { TerminalDemo } from "@/components/site/TerminalDemo";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { curriculum, totalLessons } from "@/lib/curriculum";
import { CATEGORIES, articleCount } from "@/lib/wiki-manifest";

const FEATURES = [
  {
    icon: Terminal,
    title: "Le CLI pas à pas",
    desc: "Installation, premières commandes, slash commands, modes d'usage.",
  },
  {
    icon: Wrench,
    title: "Tools & MCP",
    desc: "Read, Edit, Bash, Grep, et l'écosystème MCP pour étendre Claude.",
  },
  {
    icon: GitBranch,
    title: "Git & workflows",
    desc: "Commits, PRs, code review et CI/CD pilotés par l'agent.",
  },
  {
    icon: Sparkles,
    title: "Prompt engineering",
    desc: "Le langage qui marche vraiment avec Claude — pas la théorie.",
  },
  {
    icon: ShieldCheck,
    title: "Skills & subagents",
    desc: "Construire ses propres skills réutilisables et déléguer en parallèle.",
  },
  {
    icon: Zap,
    title: "API & SaaS",
    desc: "Construire un produit complet avec Claude derrière, prêt à monétiser.",
  },
];

const MARQUEE = [
  "CLI",
  "MCP",
  "Hooks",
  "Skills",
  "Subagents",
  "Slash commands",
  "Code review",
  "Git workflows",
  "Tool use",
  "Prompt caching",
  "Streaming",
  "API",
  "SaaS",
  "Sécurité",
];

const CODE_REAL = `# Installer Claude Code
$ npm install -g @anthropic-ai/claude-code

# Lancer dans n'importe quel projet
$ cd mon-projet && claude

# Ou créer un skill réutilisable
$ claude skills add ./skills/code-review

# Hooks : déclencher une action après chaque edit
.claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit", "hooks": [
        { "type": "command", "command": "npm run lint --silent" }
      ]}
    ]
  }
}`;

export default function LandingPage() {
  const totalModules = curriculum.length;
  const wikiTotal = articleCount();
  const wikiCats = CATEGORIES.length;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="formation" />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative w-full overflow-hidden">
          {/* Aurora background */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 pointer-events-none"
          >
            <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[80%] rounded-full blur-[120px] opacity-50 aurora-blob bg-[radial-gradient(circle,#e0c29e_0%,transparent_70%)]" />
            <div
              className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[70%] rounded-full blur-[140px] opacity-40 aurora-blob bg-[radial-gradient(circle,#a37b5a_0%,transparent_70%)]"
              style={{ animationDelay: "-6s" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(36,26,14,0.06),transparent_60%)]" />
          </div>

          <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
              {/* Left — pitch */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 border border-outline-variant bg-surface-container-lowest/70 backdrop-blur rounded-full px-4 py-1.5 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
                    Formation Claude Code · 100% Français
                  </span>
                </div>

                <h1 className="font-display-xl font-extrabold tracking-tight mb-6 text-[44px] leading-[1.02] md:text-[72px] md:leading-[0.95]">
                  <span className="text-on-surface">Maîtrise </span>
                  <span className="text-gradient">Claude Code,</span>
                  <br />
                  <span className="text-on-surface">en français.</span>
                </h1>

                <p className="font-body-rt text-[17px] md:text-[20px] text-on-surface-variant max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  La formation francophone de référence pour devenir expert du
                  CLI d'Anthropic. {totalModules} modules pratiques,{" "}
                  {totalLessons} leçons, un wiki de {wikiTotal} articles, et un
                  assistant IA qui t'accompagne.
                </p>

                <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3 mb-10">
                  <Link
                    href="/learn"
                    className="btn-primary h-12 px-7 rounded-full inline-flex items-center justify-center gap-2 font-medium text-body-sm w-full sm:w-auto group"
                  >
                    Commencer gratuitement
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      strokeWidth={1.75}
                    />
                  </Link>
                  <Link
                    href="/wiki"
                    className="btn-secondary h-12 px-7 rounded-full inline-flex items-center justify-center gap-2 font-medium text-body-sm w-full sm:w-auto"
                  >
                    Explorer le wiki
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
                  <Stat
                    value={totalModules}
                    label="modules"
                  />
                  <Stat value={totalLessons} label="leçons" />
                  <Stat value={wikiTotal} label="articles wiki" />
                </div>
              </div>

              {/* Right — terminal */}
              <div className="hidden lg:block">
                <TerminalDemo />
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div className="relative border-y border-outline-variant bg-surface-container-lowest/60 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap py-3">
              {[...MARQUEE, ...MARQUEE].map((word, i) => (
                <span
                  key={i}
                  className="px-6 text-body-sm text-on-surface-variant font-medium tracking-wide"
                >
                  · {word}
                </span>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
          </div>
        </section>

        {/* WHAT YOU LEARN */}
        <section
          id="programme"
          className="w-full px-margin-mobile md:px-margin-desktop py-24"
        >
          <div className="max-w-container-max mx-auto">
            <ScrollReveal className="max-w-2xl mb-14">
              <div className="inline-flex items-center border border-outline-variant rounded-full px-4 py-1 mb-5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
                  Programme
                </span>
              </div>
              <h2 className="font-headline-lg text-[36px] md:text-[44px] leading-[1.1] font-bold tracking-tight mb-4">
                Tout ce que Claude Code peut faire,{" "}
                <span className="text-gradient">déconstruit</span>.
              </h2>
              <p className="text-body-rt text-on-surface-variant leading-relaxed">
                Pas de théorie creuse. Chaque module est ancré dans un cas
                d'usage réel : refactor, debug, code review, déploiement.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                <ScrollReveal key={title} delay={i * 60}>
                  <div className="h-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 soft-lift">
                    <div className="w-11 h-11 rounded-xl bg-primary-fixed/40 flex items-center justify-center mb-4 text-primary">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-semibold text-on-surface mb-2 text-[17px]">
                      {title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CODE + ECOSYSTEM */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-24 bg-surface-container-lowest border-y border-outline-variant">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal>
              <div className="inline-flex items-center border border-outline-variant rounded-full px-4 py-1 mb-5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
                  Concret
                </span>
              </div>
              <h2 className="font-headline-lg text-[36px] md:text-[44px] leading-[1.1] font-bold tracking-tight mb-5">
                Du premier <code className="font-mono text-primary">$ claude</code> à ton premier hook.
              </h2>
              <p className="text-body-rt text-on-surface-variant leading-relaxed mb-6">
                Tu apprends à configurer Claude Code, écrire des prompts qui
                marchent, créer tes propres skills, et automatiser ton workflow
                avec les hooks. Le tout en français, avec des exemples qui
                tournent vraiment.
              </p>
              <ul className="space-y-3">
                {[
                  "Installation & configuration complète",
                  "Slash commands et workflows custom",
                  "Skills réutilisables entre projets",
                  "Hooks pour automatiser le lint, les tests, les commits",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-body-sm text-on-surface"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="relative rounded-2xl bg-[#1a1c1c] border border-outline-variant overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#241a0e]/60 border-b border-white/5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-xs font-mono text-white/40">
                    bash
                  </span>
                </div>
                <pre className="p-5 font-mono text-[12.5px] leading-relaxed text-white/85 overflow-x-auto">
                  {CODE_REAL}
                </pre>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* WIKI TEASER */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-24">
          <div className="max-w-container-max mx-auto">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center border border-outline-variant rounded-full px-4 py-1 mb-5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
                  Wiki
                </span>
              </div>
              <h2 className="font-headline-lg text-[36px] md:text-[44px] leading-[1.1] font-bold tracking-tight mb-4">
                <AnimatedCounter
                  value={wikiTotal}
                  className="text-gradient"
                />{" "}
                articles, {wikiCats} catégories.
              </h2>
              <p className="text-body-rt text-on-surface-variant leading-relaxed">
                Une base de connaissances exhaustive sur Claude Code, mise à
                jour en continu.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {CATEGORIES.slice(0, 14).map((cat, i) => (
                <ScrollReveal key={cat.id} delay={i * 30}>
                  <Link
                    href={`/wiki/${cat.id}`}
                    className="block px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-primary-fixed/20 transition-colors text-center"
                  >
                    <div className="text-body-sm font-medium text-on-surface truncate">
                      {cat.name}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-28 bg-surface-container-lowest border-t border-outline-variant">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <Cpu
                className="w-10 h-10 mx-auto mb-6 text-primary"
                strokeWidth={1.5}
              />
              <h2 className="font-display-xl font-bold tracking-tight mb-5 text-[36px] md:text-[52px] leading-[1.05]">
                Prêt à coder avec Claude ?
              </h2>
              <p className="text-body-rt text-on-surface-variant mb-8 leading-relaxed">
                Inscription gratuite. Le premier module est offert. Le reste
                arrive très bientôt.
              </p>
              <Link
                href="/learn"
                className="btn-primary h-12 px-8 rounded-full inline-flex items-center justify-center gap-2 font-medium text-body-sm group"
              >
                Accéder à la formation
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  strokeWidth={1.75}
                />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <AnimatedCounter
        value={value}
        className="text-[32px] md:text-[40px] font-bold tracking-tight text-on-surface"
      />
      <span className="text-xs uppercase tracking-wider text-on-surface-variant mt-0.5">
        {label}
      </span>
    </div>
  );
}
