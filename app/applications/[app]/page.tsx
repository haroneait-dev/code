import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CopyButton } from "@/components/site/CopyButton";
import { allApps, KIND_LABEL, type AppKind } from "@/lib/applications";

export function generateStaticParams() {
  return allApps().map((a) => ({ app: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ app: string }> }) {
  const { app } = await params;
  const a = allApps().find((x) => x.slug === app);
  if (!a) return {};
  return {
    title: `Utiliser Claude avec ${a.name}`,
    description: `Brancher ${a.name} sur Claude : ce que Claude peut en faire, comment le connecter, et des demandes prêtes à essayer.`,
    alternates: { canonical: `/applications/${a.slug}` },
  };
}

const HOW: Record<AppKind, { title: string; steps: string[] }> = {
  connecteur: {
    title: "Le connecter à Claude",
    steps: [
      "Dans Claude (site, bureau ou mobile), ouvrez Paramètres, puis Connecteurs.",
      "Cherchez l'application dans l'annuaire et cliquez sur Connecter.",
      "Connectez-vous à votre compte et accordez seulement les accès dont vous avez besoin.",
      "Dans une conversation, activez le connecteur puis demandez ce que vous voulez en langage courant.",
    ],
  },
  mcp: {
    title: "Le connecter à Claude",
    steps: [
      "Dans Claude : Paramètres, Connecteurs. S'il est dans l'annuaire, cliquez sur Connecter ; sinon, « Ajouter un connecteur personnalisé » avec l'adresse du serveur indiquée dans sa documentation officielle.",
      "Dans Claude Code : ajoutez le serveur avec claude mcp add (commande ci-dessous si disponible), puis tapez /mcp pour vous connecter.",
      "Commencez par des demandes en lecture seule pour vérifier ce que Claude voit.",
      "Relisez avant toute action qui modifie, envoie, paie ou supprime.",
    ],
  },
  communautaire: {
    title: "Le connecter à Claude",
    steps: [
      "Ce serveur est maintenu par la communauté : lisez son code source ou au moins sa page avant de l'installer.",
      "Installez-le dans Claude Code avec claude mcp add en suivant son README, puis vérifiez avec /mcp.",
      "Donnez-lui des accès en lecture seule quand c'est possible (base de données, clé API limitée).",
      "Ne lui confiez jamais de secrets que vous ne confieriez pas à un inconnu.",
    ],
  },
  "sans-mcp": {
    title: "L'utiliser avec Claude",
    steps: [
      "Pas besoin de connecteur : Claude Code installe et pilote l'outil directement en ligne de commande.",
      "Installez Claude Code, ouvrez un dossier de travail et décrivez ce que vous voulez obtenir.",
      "Laissez Claude proposer les commandes ; validez-les ou pré-autorisez celles qui sont sûres.",
      "Gardez les fichiers originaux : travaillez sur des copies.",
    ],
  },
};

export default async function AppPage({ params }: { params: Promise<{ app: string }> }) {
  const { app } = await params;
  const a = allApps().find((x) => x.slug === app);
  if (!a) notFound();
  const how = HOW[a.kind];
  const others = allApps().filter((x) => x.slug !== a.slug && x.uses.some((u) => a.uses.some((v) => v.theme.id === u.theme.id))).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="apps" />
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <nav className="text-[14px] text-on-surface-variant mb-6">
            <Link href="/applications" className="hover:text-primary">Applications</Link> <span aria-hidden>›</span> {a.name}
          </nav>
          <p className="tag-note mb-6">{KIND_LABEL[a.kind]} · {a.uses.map((u) => u.theme.name).join(" · ")}</p>
          <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[38px] leading-[1.05] md:text-[56px] md:leading-[1] mb-6">
            Claude <span className="text-mark">+ {a.name}</span>
          </h1>
          <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed mb-10">{a.uses[0].what}</p>

          <section className="mb-12">
            <h2 className="font-headline-lg text-[26px] md:text-[30px] font-bold mb-5">Ce que vous pouvez lui demander</h2>
            <ul className="flex flex-col gap-4">
              {a.uses.map((u) => (
                <li key={u.theme.id} className="rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-5 shadow-[4px_4px_0_rgb(var(--c-mark))]">
                  <p className="font-mono text-[12.5px] uppercase tracking-wider text-on-surface-variant mb-2">{u.theme.name}</p>
                  {a.uses.length > 1 && <p className="text-[15.5px] text-on-surface-variant mb-3">{u.what}</p>}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <p className="text-[16.5px] text-on-surface leading-relaxed">« {u.prompt} »</p>
                    <CopyButton text={u.prompt} event={`app/${a.slug}`} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-headline-lg text-[26px] md:text-[30px] font-bold mb-5">{how.title}</h2>
            <ol className="flex flex-col gap-3 mb-5">
              {how.steps.map((s, i) => (
                <li key={s} className="grid grid-cols-[32px_1fr] gap-3">
                  <span className="font-display-xl text-[22px] font-extrabold text-primary-fixed-dim tabular-nums">{i + 1}</span>
                  <span className="text-[16px] text-on-surface leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            {a.setup && (
              <div className="flex items-center gap-3">
                <pre className="flex-1 min-w-0 rounded-md bg-[#2b2119] text-[#f6efe3] p-3.5 font-mono text-[13px] overflow-x-auto">{a.setup}</pre>
                <CopyButton text={a.setup} label="Copier" />
              </div>
            )}
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4">
              Documentation officielle de {a.name}
              <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </a>
          </section>

          <section className="mb-12 rounded-lg bg-surface-container-low border border-outline-variant p-6">
            <h2 className="font-headline-lg text-[22px] font-bold mb-3">Pour progresser</h2>
            <ul className="flex flex-col gap-2">
              {a.uses.map((u) => (
                <li key={u.theme.id}>
                  <Link href={`/applications#${u.theme.id}`} className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline underline-offset-4">
                    Le parcours {u.theme.name.toLowerCase()}, de débutant à expert
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/wiki/mcp/introduction-mcp" className="text-primary font-semibold hover:underline underline-offset-4">Comprendre MCP</Link>
                {" · "}
                <Link href="/wiki/mcp/securite-mcp" className="text-primary font-semibold hover:underline underline-offset-4">La sécurité des connecteurs</Link>
              </li>
            </ul>
          </section>

          {others.length > 0 && (
            <section>
              <h2 className="font-headline-lg text-[22px] font-bold mb-4">Dans le même domaine</h2>
              <div className="flex flex-wrap gap-2.5">
                {others.map((o) => (
                  <Link key={o.slug} href={`/applications/${o.slug}`} className="rounded-full border-[1.5px] border-on-surface px-4 py-2 text-[15px] font-semibold text-on-surface hover:bg-[rgb(var(--c-mark))] transition-colors">
                    {o.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
