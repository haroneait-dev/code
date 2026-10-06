"use client";

// Recherche rapide : Ctrl+K (ou ⌘K) depuis n'importe quelle page, ou la loupe de l'en-tête.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, CornerDownLeft, FileText, LayoutGrid, Search } from "lucide-react";
import type { SearchResult } from "@/lib/search";

export const OPEN_SEARCH = "cm-open-search";

const SUGGESTIONS: SearchResult[] = [
  { type: "page", title: "Test de niveau", description: "10 questions pour savoir par où commencer.", href: "/test", context: "Page" },
  { type: "wiki", title: "Bien formuler ses demandes", description: "La méthode et des modèles à copier.", href: "/wiki/claude-bases/bien-demander", context: "Les bases" },
  { type: "wiki", title: "Installer Claude Code", description: "Installation et connexion.", href: "/wiki/demarrer/installation", context: "Démarrer" },
  { type: "page", title: "Prompts prêts à copier", description: "Des prompts testés par catégorie.", href: "/prompts", context: "Page" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal });
        const data = await res.json();
        setResults(data.results ?? []);
        setActive(0);
      } catch {}
    }, 120);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [q]);

  const list = q.trim().length >= 2 ? results : SUGGESTIONS;

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (list[active]) go(list[active].href);
      else if (q.trim()) go(`/recherche?q=${encodeURIComponent(q.trim())}`);
    }
  }

  const Icon = ({ type }: { type: SearchResult["type"] }) =>
    type === "lesson" ? <BookOpen className="w-4 h-4" strokeWidth={1.75} /> : type === "page" ? <LayoutGrid className="w-4 h-4" strokeWidth={1.75} /> : <FileText className="w-4 h-4" strokeWidth={1.75} />;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] bg-[rgb(var(--c-ink)/0.35)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Recherche"
        >
          <motion.div
            className="w-full max-w-xl rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest shadow-[6px_6px_0_rgb(var(--c-mark))] overflow-hidden"
            initial={{ y: -8, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 px-4 border-b border-outline-variant">
              <Search className="w-5 h-5 text-on-surface-variant shrink-0" strokeWidth={1.75} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Rechercher un article, une app, un prompt…"
                className="h-14 flex-1 min-w-0 bg-transparent text-[17px] text-on-surface placeholder:text-on-surface-variant outline-none"
                aria-label="Rechercher"
              />
              <kbd className="hidden sm:inline font-mono text-[11px] text-on-surface-variant border border-outline-variant rounded px-1.5 py-0.5">Échap</kbd>
            </div>
            <ul className="max-h-[55vh] overflow-y-auto py-2">
              {q.trim().length < 2 && <li className="px-4 pt-1 pb-2 font-mono text-[12px] uppercase tracking-wider text-on-surface-variant">Pour commencer</li>}
              {list.map((r, i) => (
                <li key={r.href}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 ${i === active ? "bg-[rgb(var(--c-mark)/0.45)]" : ""}`}
                  >
                    <span className="mt-0.5 text-on-surface-variant"><Icon type={r.type} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-[15.5px] text-on-surface truncate">{r.title}</span>
                      <span className="block text-[13.5px] text-on-surface-variant truncate">{r.context} · {r.description}</span>
                    </span>
                    {i === active && <CornerDownLeft className="w-4 h-4 mt-1 text-on-surface-variant shrink-0" strokeWidth={1.75} />}
                  </button>
                </li>
              ))}
              {q.trim().length >= 2 && list.length === 0 && (
                <li className="px-4 py-6 text-[15px] text-on-surface-variant">Aucun résultat pour « {q} ».</li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH))}
      aria-label="Rechercher (Ctrl+K)"
      title="Rechercher (Ctrl+K)"
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
    >
      <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
    </button>
  );
}
