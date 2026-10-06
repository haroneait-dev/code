"use client";

// Progression dans les parcours, gardée dans le navigateur (sans compte).

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const KEY = "cm-progres";
const EVENT = "cm-progres-change";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function useDone() {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    setDone(read());
    const on = () => setDone(read());
    window.addEventListener(EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return done;
}

function toggle(id: string) {
  const cur = read();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function StepCheck({ id, text }: { id: string; text: string }) {
  const done = useDone().includes(id);
  return (
    <li>
      <button
        type="button"
        onClick={() => toggle(id)}
        aria-pressed={done}
        className="group w-full text-left grid grid-cols-[22px_1fr] gap-3 items-start py-1"
      >
        <span
          className={`mt-0.5 w-[22px] h-[22px] rounded-md border-[1.5px] inline-flex items-center justify-center transition-colors ${
            done ? "bg-primary border-primary text-on-primary" : "border-outline group-hover:border-on-surface"
          }`}
        >
          {done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
        </span>
        <span className={`text-[15px] leading-relaxed transition-colors ${done ? "text-on-surface-variant line-through decoration-outline" : "text-on-surface"}`}>
          {text}
        </span>
      </button>
    </li>
  );
}

export function ThemeProgress({ ids }: { ids: string[] }) {
  const done = useDone();
  const n = ids.filter((id) => done.includes(id)).length;
  const pct = ids.length ? n / ids.length : 0;
  return (
    <div className="flex items-center gap-4 max-w-md">
      <div className="h-2.5 flex-1 rounded-full bg-surface-container-high overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${Math.round(pct * 100)}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="font-mono text-[13px] text-on-surface-variant tabular-nums shrink-0">
        {n} étape{n > 1 ? "s" : ""} sur {ids.length}
      </span>
    </div>
  );
}

// Badge affiché quand toutes les étapes d'un niveau sont cochées.
export function LevelBadge({ ids, theme, levelIndex, level }: { ids: string[]; theme: string; levelIndex: number; level: string }) {
  const done = useDone();
  const complete = ids.length > 0 && ids.every((id) => done.includes(id));
  const [copied, setCopied] = useState(false);
  if (!complete) return null;
  const slugs = ["debutant", "intermediaire", "avance", "expert"];
  const path = `/badge/${theme}/${slugs[levelIndex]}`;

  async function share() {
    const url = `${window.location.origin}${path}`;
    const text = `J'ai validé le niveau ${level} sur Claude Mastery.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-4 flex items-center justify-between gap-3 rounded-md bg-primary text-on-primary px-4 py-3"
    >
      <span className="inline-flex items-center gap-2 font-semibold text-[15px]">
        <Check className="w-4 h-4" strokeWidth={3} /> Niveau validé
      </span>
      <button type="button" onClick={share} className="text-[14px] font-semibold underline underline-offset-4">
        {copied ? "Lien copié" : "Partager mon badge"}
      </button>
    </motion.div>
  );
}
