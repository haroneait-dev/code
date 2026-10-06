"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/site/CopyButton";
import { DEFIS, currentDefiIndex } from "@/lib/defis";

// Calculé dans le navigateur pour changer chaque lundi sans redéployer le site.
export function DefiSemaine() {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => setI(currentDefiIndex()), []);
  const d = DEFIS[i ?? 0];

  return (
    <div className={`rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 md:p-8 shadow-[6px_6px_0_rgb(var(--c-mark))] transition-opacity ${i === null ? "opacity-0" : "opacity-100"}`}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="tag-note">Défi de la semaine</span>
        <span className="font-mono text-[13px] text-on-surface-variant">{d.level}</span>
      </div>
      <h3 className="font-headline-lg text-[24px] md:text-[28px] font-bold text-on-surface mb-3">{d.title}</h3>
      <p className="text-[16.5px] text-on-surface leading-relaxed mb-5">{d.text}</p>
      {d.prompt && (
        <div className="rounded-md bg-surface-container-low border border-outline-variant p-4 mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <p className="font-mono text-[13.5px] text-on-surface leading-relaxed">{d.prompt}</p>
          <CopyButton text={d.prompt} event="defi" />
        </div>
      )}
      <Link href={d.href} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4">
        Le guide pour réussir
        <ArrowRight className="w-4 h-4" strokeWidth={2} />
      </Link>
    </div>
  );
}
