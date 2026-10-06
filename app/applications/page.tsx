import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { THEMES, KIND_LABEL, type AppKind } from "@/lib/applications";
import { PATHS } from "@/lib/app-paths";
import { ParcoursBanner } from "@/components/site/ParcoursBanner";
import { StepCheck, ThemeProgress } from "@/components/site/Progress";

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
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-10 md:pt-20">
          <div className="max-w-container-max mx-auto">
            <p className="tag-note mb-7">{THEMES.length} thèmes · {total} applications</p>
            <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[64px] md:leading-[1] mb-6 max-w-3xl">
              Les <span className="text-mark">applications</span> à brancher sur Claude.
            </h1>
            <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-2xl">
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
                className="rounded-full border-[1.5px] border-on-surface px-4 py-2 text-[15px] font-semibold text-on-surface hover:bg-[rgb(var(--c-mark))] transition-colors"
              >
                {t.name}
              </a>
            ))}
          </div>
        </nav>

        <section className="w-full px-margin-mobile md:px-margin-desktop py-12 bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="font-headline-lg text-[22px] font-bold mb-2">Dans Claude (site, bureau, mobile)</h2>
              <p className="text-[15.5px] text-on-surface-variant leading-relaxed">
                Paramètres, puis <strong>Connecteurs</strong> : choisissez
                l'application dans l'annuaire et connectez votre compte. Aucun code.
                Pour un serveur MCP qui n'est pas dans l'annuaire, « Ajouter un
                connecteur personnalisé » avec son adresse.
              </p>
            </div>
            <div>
              <h2 className="font-headline-lg text-[22px] font-bold mb-2">Dans Claude Code</h2>
              <p className="text-[15.5px] text-on-surface-variant leading-relaxed mb-3">
                Une commande dans le terminal, puis <code className="font-mono text-[14px]">/mcp</code> pour vous connecter :
              </p>
              <pre className="rounded-md bg-[#2b2119] text-[#f6efe3] p-3 font-mono text-[12.5px] overflow-x-auto">claude mcp add --transport http nom https://adresse/mcp</pre>
            </div>
            <div>
              <h2 className="font-headline-lg text-[22px] font-bold mb-2">Avant de brancher</h2>
              <p className="text-[15.5px] text-on-surface-variant leading-relaxed">
                Un connecteur donne à Claude accès à vos données. Préférez les
                versions officielles, ne donnez que les droits utiles, et
                relisez avant toute action qui envoie, paie ou supprime.{" "}
                <Link href="/wiki/mcp/securite-mcp" className="text-primary font-semibold hover:underline underline-offset-4">
                  La sécurité MCP
                </Link>
              </p>
            </div>
          </div>
          <div className="max-w-container-max mx-auto mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-on-surface-variant">
            {(Object.keys(KIND_LABEL) as AppKind[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-[12.5px] font-semibold ${KIND_STYLE[k]}`}>{KIND_LABEL[k]}</span>
                {k === "connecteur" && "dans l'annuaire de Claude"}
                {k === "mcp" && "publié par l'éditeur"}
                {k === "communautaire" && "maintenu par la communauté, à vérifier"}
                {k === "sans-mcp" && "Claude Code s'en sert directement"}
              </span>
            ))}
          </div>
        </section>

        {THEMES.map((t) => (
          <section key={t.id} id={t.id} className="w-full px-margin-mobile md:px-margin-desktop py-14 md:py-16 scroll-mt-20 border-b border-outline-variant">
            <div className="max-w-container-max mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-10">
                <div className="max-w-2xl">
                  <h2 className="font-headline-lg text-[32px] md:text-[42px] leading-[1.1] font-bold tracking-tight mb-4">
                    {t.name}
                  </h2>
                  <p className="text-[17px] md:text-[18px] text-on-surface leading-relaxed mb-3">{t.intro}</p>
                  <p className="text-[15px] text-on-surface-variant">Pour : {t.forWho}</p>
                </div>
                <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-5 self-start">
                  <p className="font-mono text-[12px] uppercase tracking-wider text-on-surface-variant mb-3">Pour apprendre</p>
                  <ul className="flex flex-col gap-2">
                    {t.learn.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-[15px] text-primary font-semibold hover:underline underline-offset-4">
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {PATHS[t.id] && (
                <div className="mb-12">
                  <h3 className="font-headline-lg text-[24px] md:text-[28px] font-bold mb-2">De débutant à expert</h3>
                  <p className="text-[15.5px] text-on-surface-variant mb-6 max-w-2xl">
                    Quatre niveaux, dans l'ordre. Cochez les étapes au fur et à mesure : votre progression reste enregistrée dans ce navigateur.
                  </p>
                  <div className="mb-6">
                    <ThemeProgress ids={PATHS[t.id].flatMap((lv, li) => lv.steps.map((_, si) => `${t.id}:${li}:${si}`))} />
                  </div>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {PATHS[t.id].map((lv, i) => (
                      <li key={lv.level} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="font-display-xl text-[28px] leading-none font-extrabold text-primary-fixed-dim tabular-nums">{i + 1}</span>
                          <span className="font-headline-lg text-[20px] font-bold text-on-surface">{lv.level}</span>
                        </div>
                        <p className="text-[15.5px] text-on-surface font-semibold leading-relaxed mb-3">{lv.goal}</p>
                        <ul className="flex flex-col gap-1.5 mb-4">
                          {lv.steps.map((s, si) => (
                            <StepCheck key={s} id={`${t.id}:${i}:${si}`} text={s} />
                          ))}
                        </ul>
                        <p className="rounded-md bg-[rgb(var(--c-mark)/0.50)] border border-[#f2b23e]/40 px-3.5 py-2.5 text-[14.5px] text-on-surface leading-relaxed">
                          <strong>Projet de validation :</strong> {lv.project}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <h3 className="font-headline-lg text-[24px] md:text-[28px] font-bold mb-6">Les applications</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {t.apps.map((a) => (
                  <li key={a.name} className="flex flex-col rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 shadow-[4px_4px_0_rgb(var(--c-mark))]">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="font-headline-lg text-[22px] font-bold text-on-surface">{a.name}</h4>
                      <span className={`shrink-0 rounded px-2 py-0.5 text-[12.5px] font-semibold ${KIND_STYLE[a.kind]}`}>
                        {KIND_LABEL[a.kind]}
                      </span>
                    </div>
                    <p className="text-[15.5px] text-on-surface-variant leading-relaxed mb-4">{a.what}</p>
                    <div className="rounded-md bg-surface-container-low border border-outline-variant p-3.5 mb-4">
                      <p className="font-mono text-[11.5px] uppercase tracking-wider text-on-surface-variant mb-1.5">À essayer</p>
                      <p className="text-[15px] text-on-surface leading-relaxed">« {a.prompt} »</p>
                    </div>
                    {a.setup && (
                      <pre className="rounded-md bg-[#2b2119] text-[#f6efe3] p-3 font-mono text-[12px] overflow-x-auto mb-4">{a.setup}</pre>
                    )}
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-primary hover:underline underline-offset-4"
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

        <section className="w-full px-margin-mobile md:px-margin-desktop py-16">
          <div className="max-w-container-max mx-auto max-w-2xl">
            <h2 className="font-headline-lg text-[28px] md:text-[34px] font-bold tracking-tight mb-3">Aller plus loin avec MCP</h2>
            <p className="text-[17px] text-on-surface-variant leading-relaxed mb-5">
              Comprendre comment fonctionnent les connecteurs, en installer
              d'autres, ou créer le vôtre pour l'outil de votre entreprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/wiki/mcp/introduction-mcp" className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center font-semibold text-[15px]">
                Qu'est-ce que MCP ?
              </Link>
              <Link href="/wiki/mcp/serveurs-populaires" className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center font-semibold text-[15px]">
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
