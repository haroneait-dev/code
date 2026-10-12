"use client";

// Bandeau de guidage : invite à faire le test à la première visite,
// puis rappelle le parcours et la prochaine étape. Jamais bloquant.

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { BlurFade } from "@/components/ui/motion";
import { loadResult, type QuizResult } from "@/lib/quiz";
import { THEMES } from "@/lib/applications";
import { PATHS } from "@/lib/app-paths";

const HIDE_KEY = "cm-parcours-masque";

export function ParcoursBanner({ themeId }: { themeId?: string }) {
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setResult(loadResult());
    try {
      setHidden(window.sessionStorage.getItem(HIDE_KEY) === "1");
    } catch {}
    setReady(true);
  }, []);

  // Avant lecture du navigateur : on réserve la place pour éviter que la page saute.
  if (!ready) return <div aria-hidden className="min-h-[188px] md:min-h-[104px]" />;
  if (hidden) return null;
  if (themeId && result && result.theme !== themeId) return null;

  function hide() {
    setHidden(true);
    try {
      window.sessionStorage.setItem(HIDE_KEY, "1");
    } catch {}
  }

  if (!result) {
    return (
      <BlurFade className="relative rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex-1 pr-8">
          <p className="font-semibold text-body text-on-surface mb-1">Nouveau ici ? Faites le test de niveau.</p>
          <p className="text-small text-on-surface-variant leading-relaxed">
            10 questions, 2 minutes : vous saurez par quoi commencer et quel parcours suivre.
          </p>
        </div>
        <Link href="/test" className="btn-primary inline-flex items-center justify-center gap-2 shrink-0 group">
          Faire le test
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
        </Link>
        <button type="button" onClick={hide} aria-label="Masquer" className="absolute top-3 right-3 p-1.5 rounded text-on-surface-variant hover:bg-surface-container">
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </BlurFade>
    );
  }

  const theme = THEMES.find((t) => t.id === result.theme);
  const plan = PATHS[result.theme]?.[result.levelIndex];
  return (
    <BlurFade className="relative rounded-lg border-[1.5px] border-primary bg-[rgb(var(--c-green-soft)/0.40)] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
      <div className="flex-1 pr-8 min-w-0">
        <p className="font-mono text-small uppercase tracking-wider text-on-surface-variant mb-1">
          Votre parcours · {theme?.name} · {result.level}
        </p>
        {plan && (
          <p className="text-body text-on-surface leading-relaxed">
            <strong>Prochaine étape :</strong> {plan.steps[0]}
          </p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <Link href={`/applications#${result.theme}`} className="btn-primary inline-flex items-center justify-center">
          Continuer
        </Link>
        <Link href="/test" className="btn-secondary inline-flex items-center justify-center">
          Mon plan
        </Link>
      </div>
      <button type="button" onClick={hide} aria-label="Masquer" className="absolute top-3 right-3 p-1.5 rounded text-on-surface-variant hover:bg-surface-container">
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </BlurFade>
  );
}
