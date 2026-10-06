import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CopyButton } from "@/components/site/CopyButton";
import { BlurFade } from "@/components/ui/motion";
import { PROMPT_GROUPS } from "@/lib/prompts";

export const metadata = {
  title: "Prompts prêts à copier pour Claude",
  description:
    "Des prompts testés pour Claude, prêts à copier : e-commerce, réseaux sociaux, travail, études, Claude Code et vie quotidienne.",
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
              Copiez, remplacez ce qui est entre crochets, envoyez. Pour
              comprendre pourquoi ils marchent, lisez{" "}
              <Link href="/wiki/claude-bases/bien-demander" className="text-primary font-semibold hover:underline underline-offset-4">
                Bien formuler ses demandes
              </Link>
              .
            </p>
          </div>
        </section>

        <nav aria-label="Catégories" className="w-full px-margin-mobile md:px-margin-desktop pb-12">
          <div className="max-w-container-max mx-auto flex flex-wrap gap-2.5">
            {PROMPT_GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border-[1.5px] border-on-surface px-4 py-2 text-[15px] font-semibold text-on-surface hover:bg-[rgb(var(--c-mark))] transition-colors">
                {g.name}
              </a>
            ))}
          </div>
        </nav>

        {PROMPT_GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="w-full px-margin-mobile md:px-margin-desktop py-12 md:py-14 border-t border-outline-variant scroll-mt-20">
            <div className="max-w-container-max mx-auto">
              <h2 className="font-headline-lg text-[30px] md:text-[38px] leading-[1.1] font-bold tracking-tight mb-2">{g.name}</h2>
              <p className="text-[17px] text-on-surface-variant mb-8">{g.intro}</p>
              <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {g.prompts.map((p, i) => (
                  <BlurFade key={p.title} inView delay={i * 0.05}>
                    <li className="h-full flex flex-col rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 shadow-[4px_4px_0_rgb(var(--c-mark))] list-none">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="font-headline-lg text-[20px] font-bold text-on-surface">{p.title}</h3>
                        <CopyButton text={p.text} event={`${g.id}/${p.title}`} />
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-[13.5px] leading-[1.7] text-on-surface bg-surface-container-low border border-outline-variant rounded-md p-4 mb-3 flex-grow">{p.text}</pre>
                      {p.tip && <p className="text-[14.5px] text-on-surface-variant leading-relaxed">Astuce : {p.tip}</p>}
                    </li>
                  </BlurFade>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
