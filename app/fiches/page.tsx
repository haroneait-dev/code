import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FichesBrowser } from "@/components/fiches/FichesBrowser";
import { ficheCount } from "@/lib/fiches";

export const metadata = {
  title: "Fiches — Claude Mastery",
  description:
    "Base de fiches de connaissances sur l'écosystème Claude : Claude Code, MCP, prompt engineering, entreprise, recherche et sécurité. Filtrable et actionnable.",
};

export default function FichesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="fiches" showSearch />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <section className="mb-12 max-w-3xl">
          <div className="mb-6">
            <span className="tag-note">
              Fiches · {ficheCount()} entrées
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl md:text-[64px] md:leading-[1] font-extrabold tracking-tight mb-6 text-on-surface">
            Les <span className="text-mark">fiches</span> essentielles.
          </h1>
          <p className="font-body-rt text-body-rt md:text-[19px] text-on-surface-variant leading-relaxed">
            Des fiches courtes et actionnables sur tout l'écosystème Claude —
            modèles, Claude Code, MCP, prompt engineering, entreprise, recherche
            et sécurité. Filtre par thème et par niveau, ou cherche directement.
          </p>
        </section>

        <FichesBrowser />
      </main>

      <SiteFooter />
    </div>
  );
}
