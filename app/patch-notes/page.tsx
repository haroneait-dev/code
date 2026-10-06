import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BlurFade } from "@/components/ui/motion";
import { PATCH_NOTES, KIND_INFO, type NoteKind } from "@/lib/patch-notes";

export const metadata = {
  title: "Patch notes : les mises à jour du site et de Claude",
  description:
    "Chaque mise à jour du site et chaque nouveauté de Claude et Claude Code, de la plus récente à la plus ancienne.",
};

function formatDate(d: string) {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function PatchNotesPage() {
  const byDate = PATCH_NOTES.reduce<Record<string, typeof PATCH_NOTES>>((acc, n) => {
    (acc[n.date] ??= []).push(n);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="patch" />
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-14 md:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="tag-note mb-7">Mis à jour le {formatDate(PATCH_NOTES[0].date)}</p>
          <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[64px] md:leading-[1] mb-6">
            Patch <span className="text-mark">notes</span>.
          </h1>
          <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed mb-8">
            Tout ce qui change, au même endroit : les nouveautés du site, de Claude
            et de Claude Code. Le plus récent en haut.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-14">
            {(Object.keys(KIND_INFO) as NoteKind[]).map((k) => (
              <span key={k} className={`rounded px-2.5 py-1 text-[13px] font-semibold ${KIND_INFO[k].className}`}>
                {KIND_INFO[k].label}
              </span>
            ))}
          </div>

          <ol className="relative border-l-2 border-outline-variant ml-2">
            {dates.map((date) => (
              <li key={date} className="pl-7 pb-12 relative">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary border-[3px] border-surface" />
                <p className="font-mono text-[14px] text-on-surface-variant mb-4">{formatDate(date)}</p>
                <div className="flex flex-col gap-4">
                  {byDate[date].map((n, i) => (
                    <BlurFade key={n.title} inView delay={i * 0.05}>
                      <article className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className={`rounded px-2 py-0.5 text-[12.5px] font-semibold ${KIND_INFO[n.kind].className}`}>
                            {KIND_INFO[n.kind].label}
                          </span>
                          {n.version && <span className="font-mono text-[13px] text-on-surface-variant">{n.version}</span>}
                        </div>
                        <h2 className="font-headline-lg text-[21px] md:text-[23px] font-bold text-on-surface mb-3">{n.title}</h2>
                        <ul className="flex flex-col gap-1.5 list-disc pl-5 text-[15.5px] text-on-surface-variant leading-relaxed mb-3">
                          {n.items.map((it) => (
                            <li key={it}>{it}</li>
                          ))}
                        </ul>
                        {n.href && (
                          <Link href={n.href} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:underline underline-offset-4">
                            Voir
                            <ArrowRight className="w-4 h-4" strokeWidth={2} />
                          </Link>
                        )}
                      </article>
                    </BlurFade>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          <p className="text-[15.5px] text-on-surface-variant">
            Le détail mois par mois :{" "}
            <Link href="/wiki/actualites/nouveautes-claude-2026" className="text-primary font-semibold hover:underline underline-offset-4">nouveautés de Claude</Link>
            {" "}et{" "}
            <Link href="/wiki/actualites/nouveautes-2026" className="text-primary font-semibold hover:underline underline-offset-4">nouveautés de Claude Code</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
