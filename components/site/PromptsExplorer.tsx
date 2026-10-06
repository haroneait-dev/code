"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CopyButton } from "@/components/site/CopyButton";
import { BlurFade } from "@/components/ui/motion";
import type { PromptGroup, PromptLevel } from "@/lib/prompts";

const LEVELS: (PromptLevel | "Tous")[] = ["Tous", "Débutant", "Intermédiaire", "Avancé"];

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function PromptsExplorer({ groups }: { groups: PromptGroup[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<PromptLevel | "Tous">("Tous");

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    return groups
      .map((g) => ({
        ...g,
        prompts: g.prompts.filter(
          (p) =>
            (level === "Tous" || p.level === level) &&
            (!nq || norm(`${p.title} ${p.text} ${p.why ?? ""} ${g.name}`).includes(nq)),
        ),
      }))
      .filter((g) => g.prompts.length > 0);
  }, [groups, q, level]);

  const count = filtered.reduce((n, g) => n + g.prompts.length, 0);
  const filtering = q.trim() !== "" || level !== "Tous";

  return (
    <>
      <div className="w-full px-margin-mobile md:px-margin-desktop pb-8">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-center gap-3">
          <label className="flex items-center gap-2 h-12 flex-1 max-w-md rounded-md border-[1.5px] border-on-surface bg-surface-container-lowest px-4 focus-within:border-primary">
            <Search className="w-4 h-4 text-on-surface-variant shrink-0" strokeWidth={2} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Chercher un prompt (SEO, e-mail, TikTok…)"
              className="flex-1 min-w-0 bg-transparent text-[16px] text-on-surface placeholder:text-on-surface-variant outline-none"
              aria-label="Chercher un prompt"
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Niveau">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                aria-pressed={level === l}
                className={`h-10 px-4 rounded-full text-[14.5px] font-semibold border-[1.5px] transition-colors ${
                  level === l ? "bg-primary border-primary text-on-primary" : "border-outline-variant text-on-surface hover:border-on-surface"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {filtering && (
            <span className="font-mono text-[13px] text-on-surface-variant md:ml-auto">
              {count} résultat{count > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {!filtering && (
        <nav aria-label="Catégories" className="w-full px-margin-mobile md:px-margin-desktop pb-12">
          <div className="max-w-container-max mx-auto flex flex-wrap gap-2.5">
            {groups.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border-[1.5px] border-on-surface px-4 py-2 text-[15px] font-semibold text-on-surface hover:bg-[rgb(var(--c-mark))] transition-colors">
                {g.name} <span className="font-mono text-[12.5px] text-on-surface-variant">{g.prompts.length}</span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {filtered.length === 0 && (
        <p className="w-full px-margin-mobile md:px-margin-desktop pb-16 max-w-container-max mx-auto text-[17px] text-on-surface-variant">
          Aucun prompt ne correspond. Essayez un autre mot.
        </p>
      )}

      {filtered.map((g) => (
        <section key={g.id} id={g.id} className="w-full px-margin-mobile md:px-margin-desktop py-12 md:py-14 border-t border-outline-variant scroll-mt-20">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-10 mb-8">
              <div>
                <h2 className="font-headline-lg text-[30px] md:text-[38px] leading-[1.1] font-bold tracking-tight mb-2">{g.name}</h2>
                <p className="text-[17px] text-on-surface-variant leading-relaxed">{g.intro}</p>
              </div>
              {g.method && !filtering && (
                <div className="rounded-lg bg-surface-container-low border border-outline-variant p-5 self-start">
                  <p className="font-mono text-[12px] uppercase tracking-wider text-on-surface-variant mb-2.5">La méthode</p>
                  <ul className="flex flex-col gap-2 list-disc pl-5 text-[15px] text-on-surface leading-relaxed">
                    {g.method.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {g.prompts.map((p, i) => (
                <BlurFade key={p.title} inView delay={Math.min(i, 4) * 0.04}>
                  <li className="h-full flex flex-col rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-5 md:p-6 shadow-[4px_4px_0_rgb(var(--c-mark))] list-none">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        {p.level && <span className="font-mono text-[12px] text-on-surface-variant">{p.level}</span>}
                        <h3 className="font-headline-lg text-[20px] font-bold text-on-surface leading-snug">{p.title}</h3>
                      </div>
                      <CopyButton text={p.text} event={`${g.id}/${p.title}`} />
                    </div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.7] text-on-surface bg-surface-container-low border border-outline-variant rounded-md p-4 mb-4 flex-grow">{p.text}</pre>
                    {p.why && (
                      <p className="text-[14.5px] text-on-surface leading-relaxed mb-2">
                        <strong>Pourquoi ça marche :</strong> <span className="text-on-surface-variant">{p.why}</span>
                      </p>
                    )}
                    {p.tip && <p className="text-[14.5px] text-on-surface-variant leading-relaxed">Astuce : {p.tip}</p>}
                  </li>
                </BlurFade>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
