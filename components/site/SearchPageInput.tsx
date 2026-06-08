"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchPageInput({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  // Résultats en direct : on met à jour l'URL (debounce) → le serveur
  // re-render la liste. router.replace pour ne pas empiler l'historique.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const q = value.trim();
      router.replace(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche");
    }, 250);
    return () => clearTimeout(timer);
  }, [value, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    // déjà mis à jour en direct ; on referme juste le clavier mobile
    inputRef.current?.blur();
    router.replace(`/recherche?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary transition-colors"
    >
      <Search
        className="w-5 h-5 text-on-surface-variant shrink-0"
        strokeWidth={1.75}
      />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent border-none text-body-rt text-on-surface focus:ring-0 placeholder:text-on-surface-variant w-full outline-none"
        placeholder="Rechercher une leçon, un article du wiki…"
        type="text"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        aria-label="Rechercher dans la formation et le wiki"
      />
      <button
        type="submit"
        className="hidden sm:inline-flex text-body-sm font-medium text-primary hover:underline shrink-0"
      >
        Rechercher
      </button>
    </form>
  );
}
