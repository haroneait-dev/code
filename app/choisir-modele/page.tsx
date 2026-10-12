import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ModelPicker } from "@/components/site/ModelPicker";

export const metadata = {
  title: "Quel modèle Claude choisir ? Le comparateur",
  description:
    "Haiku, Sonnet, Opus ou Fable : décrivez votre usage et voyez le modèle Claude conseillé et son coût par mois sur l'API.",
  alternates: { canonical: "/choisir-modele" },
};

export default function ChoisirModelePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />
      <main className="flex-grow">
        <section className="py-section w-full px-margin-mobile md:px-margin-desktop    ">
          <div className="max-w-container-max mx-auto">
            <p className="tag-note mb-7">Comparateur</p>
            <h1 className="text-h1 font-display-xl font-extrabold tracking-tight text-on-surface mb-6 max-w-3xl">
              Quel modèle Claude <span className="text-mark">choisir</span> ?
            </h1>
            <p className="text-body md:text-body text-on-surface-variant leading-relaxed max-w-2xl mb-10">
              Décrivez votre usage : le comparateur conseille un modèle et estime ce
              qu'il coûte par mois sur l'API. Prix d'octobre 2026, détaillés dans le{" "}
              <Link href="/wiki/modeles/comparatif-modeles" className="underline decoration-[rgb(var(--c-mark))] decoration-4 underline-offset-2">comparatif des modèles</Link>.
            </p>
            <ModelPicker />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
