"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FileText, CornerDownLeft } from "lucide-react";
import type { SearchResult } from "@/lib/search";

export function SiteSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Raccourci ⌘K / Ctrl+K → focus sur la recherche
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fermeture au clic extérieur
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // Suggestions en direct (debounce + annulation de la requête précédente)
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(-1);
        setOpen(true);
      } catch {
        /* requête annulée — on ignore */
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [value]);

  function go(href: string) {
    setOpen(false);
    inputRef.current?.blur();
    router.push(href);
  }

  function submitFull() {
    const q = value.trim();
    if (!q) return;
    go(`/recherche?q=${encodeURIComponent(q)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      go(results[activeIndex].href);
    } else {
      submitFull();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open && results.length) setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && value.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 focus-within:border-primary transition-colors"
      >
        <Search
          className="w-4 h-4 text-on-surface-variant mr-2 shrink-0"
          strokeWidth={1.75}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length && setOpen(true)}
          className="bg-transparent border-none text-body-sm text-on-surface focus:ring-0 placeholder:text-on-surface-variant w-48 outline-none"
          placeholder="Rechercher…"
          type="text"
          aria-label="Rechercher dans la formation et le wiki"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
        />
        <span className="text-xs text-on-surface-variant border border-outline-variant rounded px-1 ml-2 font-code-md shrink-0">
          ⌘K
        </span>
      </form>

      {showDropdown && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-[26rem] max-w-[80vw] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-body-sm text-on-surface-variant">
              Aucune suggestion pour « {value.trim()} »
            </p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((r, i) => {
                const Icon = r.type === "lesson" ? BookOpen : FileText;
                const active = i === activeIndex;
                return (
                  <li key={r.href} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => go(r.href)}
                      className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                        active ? "bg-primary-fixed/30" : "hover:bg-surface-container"
                      }`}
                    >
                      <Icon
                        className="w-4 h-4 mt-0.5 text-on-surface-variant shrink-0"
                        strokeWidth={1.75}
                      />
                      <span className="min-w-0 flex-grow">
                        <span className="block text-body-sm font-medium text-on-surface truncate">
                          {r.title}
                        </span>
                        <span className="block text-[12px] text-on-surface-variant truncate">
                          {r.type === "lesson" ? "Formation" : "Wiki"} · {r.context}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            type="button"
            onClick={submitFull}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border-t border-outline-variant text-body-sm text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span>
              Voir tous les résultats pour «{" "}
              <span className="text-on-surface">{value.trim()}</span> »
            </span>
            <CornerDownLeft className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
