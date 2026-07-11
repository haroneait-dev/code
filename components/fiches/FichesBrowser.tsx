"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, X, ArrowUpRight } from "lucide-react";
import {
  FICHES,
  FICHE_CATEGORIES,
  FICHE_DIFFICULTIES,
  type Fiche,
  type FicheCategory,
  type FicheDifficulty,
} from "@/lib/fiches";

const DIFFICULTY_STYLE: Record<FicheDifficulty, string> = {
  Débutant: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Intermédiaire: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Avancé: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export function FichesBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FicheCategory | null>(null);
  const [difficulty, setDifficulty] = useState<FicheDifficulty | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FICHES.filter((f) => {
      if (category && f.category !== category) return false;
      if (difficulty && f.difficulty !== difficulty) return false;
      if (!q) return true;
      const haystack = (
        f.title +
        " " +
        f.summary +
        " " +
        f.technicalDetails +
        " " +
        f.tags.join(" ")
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category, difficulty]);

  const hasFilter = query || category || difficulty;

  return (
    <div>
      {/* Barre de recherche */}
      <div className="relative mb-6 max-w-xl">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
          strokeWidth={1.75}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une fiche (titre, concept, tag)…"
          aria-label="Rechercher une fiche"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-11 pr-4 py-3 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Filtres catégorie */}
      <div className="flex flex-wrap gap-2 mb-3">
        <FilterChip
          label="Toutes"
          active={category === null}
          onClick={() => setCategory(null)}
        />
        {FICHE_CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={category === c}
            onClick={() => setCategory(category === c ? null : c)}
          />
        ))}
      </div>

      {/* Filtres difficulté */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-[12px] uppercase tracking-wider text-on-surface-variant mr-1">
          Niveau
        </span>
        {FICHE_DIFFICULTIES.map((d) => (
          <FilterChip
            key={d}
            label={d}
            active={difficulty === d}
            onClick={() => setDifficulty(difficulty === d ? null : d)}
          />
        ))}
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
              setDifficulty(null);
            }}
            className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-primary transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Compteur */}
      <p className="text-body-sm text-on-surface-variant mb-6">
        {filtered.length} fiche{filtered.length > 1 ? "s" : ""}
        {hasFilter ? " correspondant à ta recherche" : " au total"}.
      </p>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="border border-dashed border-outline-variant rounded-xl p-12 text-center text-on-surface-variant">
          Aucune fiche ne correspond. Essaie d'élargir tes filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((f) => (
            <FicheCard
              key={f.id}
              fiche={f}
              open={openId === f.id}
              onToggle={() => setOpenId(openId === f.id ? null : f.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "px-3.5 py-1.5 rounded-full text-body-sm font-medium bg-primary text-on-primary transition-colors"
          : "px-3.5 py-1.5 rounded-full text-body-sm bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-colors"
      }
    >
      {label}
    </button>
  );
}

function FicheCard({
  fiche,
  open,
  onToggle,
}: {
  fiche: Fiche;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden transition-colors">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left p-5 md:p-6 flex gap-4 items-start group"
      >
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-code-md text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">
              {fiche.category}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded ${DIFFICULTY_STYLE[fiche.difficulty]}`}
            >
              {fiche.difficulty}
            </span>
          </div>
          <h3 className="font-body-rt text-body-rt font-semibold text-on-surface mb-1.5">
            {fiche.title}
          </h3>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            {fiche.summary}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 mt-1 text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div className="px-5 md:px-6 pb-6 -mt-1">
          <div className="border-t border-outline-variant pt-5 space-y-4">
            {fiche.technicalDetails.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-body-sm text-on-surface-variant leading-relaxed"
              >
                {para}
              </p>
            ))}

            {fiche.codeSnippet && (
              <pre className="bg-surface-container border border-outline-variant rounded-lg p-4 overflow-x-auto text-[13px] font-code-md text-on-surface leading-relaxed">
                <code>{fiche.codeSnippet}</code>
              </pre>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {fiche.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-code-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded"
                >
                  #{t}
                </span>
              ))}
            </div>

            {fiche.wikiHref && (
              <Link
                href={fiche.wikiHref}
                className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline pt-1"
              >
                Approfondir dans le wiki
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
