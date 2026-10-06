import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PromptsExplorer } from "@/components/site/PromptsExplorer";
import { PROMPT_GROUPS } from "@/lib/prompts";

export const metadata = {
  title: "Prompts prêts à copier pour Claude : SEO, e-commerce, marketing, vente…",
  description:
    "Des prompts testés pour Claude, prêts à copier, avec la technique derrière chacun : SEO, e-commerce, réseaux sociaux, publicité, prospection, études, données, Claude Code et vie quotidienne.",
  alternates: { canonical: "/prompts" },
};

export default function PromptsPage() {
  const total = PROMPT_GROUPS.reduce((n, g) => n + g.prompts.length, 0);
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="prompts" />
      <main className="flex-grow">
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-10 md:pt-20">
          <div className="max-w-container-max mx-auto">
            <p className="tag-note mb-7">{total} prompts · {PROMPT_GROUPS.length} catégories</p>
            <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[64px] md:leading-[1] mb-6 max-w-3xl">
              Des prompts <span className="text-mark">prêts à copier</span>.
            </h1>
            <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-2xl">
              Chaque prompt applique une vraie technique de métier, expliquée en
              dessous. Copiez, remplacez ce qui est entre crochets, envoyez. Pour la
              méthode générale, lisez{" "}
              <Link href="/wiki/claude-bases/bien-demander" className="text-primary font-semibold hover:underline underline-offset-4">
                Bien formuler ses demandes
              </Link>
              .
            </p>
          </div>
        </section>
        <PromptsExplorer groups={PROMPT_GROUPS} />
      </main>
      <SiteFooter />
    </div>
  );
}
