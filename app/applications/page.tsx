import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { THEMES, KIND_LABEL, appSlug, type AppKind } from "@/lib/applications";
import { PATHS } from "@/lib/app-paths";
import { ParcoursBanner } from "@/components/site/ParcoursBanner";
import { LevelBadge, StepCheck, ThemeProgress } from "@/components/site/Progress";
import { Section3D } from "@/components/site/Section3D";

export const metadata = {
  title: "Applications à brancher sur Claude, par thème",
  description:
    "E-commerce, vibe coding, vidéo et motion design, marketing, design, productivité : les applications et serveurs MCP à connecter à Claude, avec un exemple de demande pour chacune.",
};

const KIND_STYLE: Record<AppKind, string> = {
  connecteur: "bg-[rgb(var(--c-green-soft))] text-on-surface",
  mcp: "bg-[rgb(var(--c-mark))] text-on-primary-fixed",
  communautaire: "bg-surface-container-high text-on-surface-variant",
  "sans-mcp": "bg-surface-container-low text-on-surface-variant border border-outline-variant",
};

export default function ApplicationsPage() {
  const total = THEMES.reduce((n, t) => n + t.apps.length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="apps" />

      <main className="flex-grow">
        <section className="py-section w-full px-margin-mobile md:px-margin-desktop  pb-10 ">
          <div className="max-w-container-max mx-auto">
            <div className="flex items-start justify-between gap-4">
              <p className="tag-note mb-7">{THEMES.length} thèmes · {total} applications</p>
              <Section3D name="applications" className="w-24 sm:w-32 md:w-44 -mt-6 -mr-2 -mb-8 md:-mb-14" />
            </div>
            <h1 className="text-h1 font-display-xl font-extrabold tracking-tight text-on-surface mb-6 max-w-3xl">
              Les <span className="text-mark">applications</span> à brancher sur Claude.
            </h1>
            <p className="text-body md:text-body text-on-surface-variant leading-relaxed max-w-2xl">
              Choisissez votre domaine. Pour chaque application : ce que Claude
              peut en faire, comment la connecter, et une demande à essayer tout
              de suite.
            </p>
            <div className="mt-8 max-w-3xl">
              <ParcoursBanner />
            </div>
          </div>
        </section>

        <nav aria-label="Thèmes" className="w-full px-margin-mobile md:px-margin-desktop pb-12">
          <div className="max-w-container-max mx-auto flex flex-wrap gap-2.5">
            {THEMES.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="rounded border-[1.5px] border-on-surface px-4 py-2 text-small font-semibold text-on-surface hover:bg-[rgb(var(--c-mark))] transition-colors"
              >
                {t.name}
              </a>
            ))}
          </div>
        </nav>

        <section className="py-section w-full px-margin-mobile md:px-margin-desktop  bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-h2 font-headline-lg  font-bold mb-2">Dans Claude (site, bureau, mobile)</h2>
              <p className="text-small text-on-surface-variant leading-relaxed">
                Paramètres, puis <strong>Connecteurs</strong> : choisissez
                l'application dans l'annuaire et connectez votre compte. Aucun code.
                Pour un serveur MCP qui n'est pas dans l'annuaire, « Ajouter un
                connecteur personnalisé » avec son adresse.
              </p>
            </div>
            <div>
              <h2 className="text-h2 font-headline-lg  font-bold mb-2">Dans Claude Code</h2>
              <p className="text-small text-on-surface-variant leading-relaxed mb-3">
                Une commande dans le terminal, puis <code className="font-mono text-small">/mcp</code> pour vous connecter :
              </p>
              <pre className="rounded bg-[rgb(var(--c-on-surface))] text-[rgb(var(--c-on-surface))] p-3 font-mono text-small overflow-x-auto">claude mcp add --transport http nom https://adresse/mcp</pre>
            </div>
            <div>
              <h2 className="text-h2 font-headline-lg  font-bold mb-2">Avant de brancher</h2>
              <p className="text-small text-on-surface-variant leading-relaxed">
                Un connecteur donne à Claude accès à vos données. Préférez les
                versions officielles, ne donnez que les droits utiles, et
                relisez avant toute action qui envoie, paie ou supprime.{" "}
                <Link href="/wiki/mcp/securite-mcp" className="text-primary font-semibold hover:underline underline-offset-4">
                  La sécurité MCP
                </Link>
              </p>
            </div>
          </div>
          <div className="max-w-container-max mx-auto mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small text-on-surface-variant">
            {(Object.keys(KIND_LABEL) as AppKind[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-small font-semibold ${KIND_STYLE[k]}`}>{KIND_LABEL[k]}</span>
                {k === "connecteur" && "dans l'annuaire de Claude"}
                {k === "mcp" && "publié par l'éditeur"}
                {k === "communautaire" && "maintenu par la communauté, à vérifier"}
                {k === "sans-mcp" && "Claude Code s'en sert directement"}
              </span>
            ))}
          </div>
        </section>

        {THEMES.map((t) => (
          <section key={t.id} id={t.id} className="py-section w-full px-margin-mobile md:px-margin-desktop   scroll-mt-20 border-b border-outline-variant">
            <div className="max-w-container-max mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-10">
                <div className="max-w-2xl">
                  <h2 className="text-h2 font-headline-lg   leading-[1.1] font-bold tracking-tight mb-4">
                    {t.name}
                  </h2>
                  <p className="text-body md:text-body text-on-surface leading-relaxed mb-3">{t.intro}</p>
                  <p className="text-small text-on-surface-variant">Pour : {t.forWho}</p>
                </div>
                <div className="rounded border border-outline-variant bg-surface-container-lowest p-5 self-start">
                  <p className="font-mono text-small uppercase tracking-wider text-on-surface-variant mb-3">Pour apprendre</p>
                  <ul className="flex flex-col gap-2">
                    {t.learn.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-small text-primary font-semibold hover:underline underline-offset-4">
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {PATHS[t.id] && (
                <div className="mb-12">
                  <h3 className="text-h3 font-headline-lg   font-bold mb-2">De débutant à expert</h3>
                  <p className="text-small text-on-surface-variant mb-6 max-w-2xl">
                    Quatre niveaux, dans l'ordre. Cochez les étapes au fur et à mesure : votre progression reste enregistrée dans ce navigateur.
                  </p>
                  <div className="mb-6">
                    <ThemeProgress ids={PATHS[t.id].flatMap((lv, li) => lv.steps.map((_, si) => `${t.id}:${li}:${si}`))} />
                  </div>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {PATHS[t.id].map((lv, i) => (
                      <li key={lv.level} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="font-display-xl text-h2 leading-none font-extrabold text-primary-fixed-dim tabular-nums">{i + 1}</span>
                          <span className="font-headline-lg text-body font-bold text-on-surface">{lv.level}</span>
                        </div>
                        <p className="text-small text-on-surface font-semibold leading-relaxed mb-3">{lv.goal}</p>
                        <ul className="flex flex-col gap-1.5 mb-4">
                          {lv.steps.map((s, si) => (
                            <StepCheck key={s} id={`${t.id}:${i}:${si}`} text={s} />
                          ))}
                        </ul>
                        <p className="rounded bg-[rgb(var(--c-mark)/0.50)] border border-[rgb(var(--c-marigold))]/40 px-3.5 py-2.5 text-small text-on-surface leading-relaxed">
                          <strong>Projet de validation :</strong> {lv.project}
                        </p>
                        <LevelBadge ids={lv.steps.map((_, si) => `${t.id}:${i}:${si}`)} theme={t.id} levelIndex={i} level={lv.level} />
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <h3 className="text-h3 font-headline-lg   font-bold mb-6">Les applications</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {t.apps.map((a) => (
                  <li key={a.name} className="flex flex-col rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="font-headline-lg text-h3 font-bold text-on-surface"><Link href={`/applications/${appSlug(a.name)}`} className="hover:text-primary transition-colors">{a.name}</Link></h4>
                      <span className={`shrink-0 rounded px-2 py-0.5 text-small font-semibold ${KIND_STYLE[a.kind]}`}>
                        {KIND_LABEL[a.kind]}
                      </span>
                    </div>
                    <p className="text-small text-on-surface-variant leading-relaxed mb-4">{a.what}</p>
                    <div className="rounded bg-surface-container-low border border-outline-variant p-3.5 mb-4">
                      <p className="font-mono text-small uppercase tracking-wider text-on-surface-variant mb-1.5">À essayer</p>
                      <p className="text-small text-on-surface leading-relaxed">« {a.prompt} »</p>
                    </div>
                    {a.setup && (
                      <pre className="rounded bg-[rgb(var(--c-on-surface))] text-[rgb(var(--c-on-surface))] p-3 font-mono text-small overflow-x-auto mb-4">{a.setup}</pre>
                    )}
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline underline-offset-4"
                    >
                      Site officiel
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <section className="py-section w-full px-margin-mobile md:px-margin-desktop ">
          <div className="max-w-container-max mx-auto max-w-2xl">
            <h2 className="text-h2 font-headline-lg   font-bold tracking-tight mb-3">Aller plus loin avec MCP</h2>
            <p className="text-body text-on-surface-variant leading-relaxed mb-5">
              Comprendre comment fonctionnent les connecteurs, en installer
              d'autres, ou créer le vôtre pour l'outil de votre entreprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/wiki/mcp/introduction-mcp" className="btn-primary inline-flex items-center justify-center">
                Qu'est-ce que MCP ?
              </Link>
              <Link href="/wiki/mcp/serveurs-populaires" className="btn-secondary inline-flex items-center justify-center">
                Les serveurs populaires
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
