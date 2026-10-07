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
        <section className="w-full px-margin-mobile md:px-margin-desktop pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-container-max mx-auto">
            <p className="tag-note mb-7">Comparateur</p>
            <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[60px] md:leading-[1] mb-6 max-w-3xl">
              Quel modèle Claude <span className="text-mark">choisir</span> ?
            </h1>
            <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed max-w-2xl mb-10">
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
