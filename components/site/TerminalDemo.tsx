"use client";

import { useEffect, useRef, useState } from "react";

// Terminal d'essai sur l'accueil : le visiteur tape une demande (ou clique
// sur une suggestion) et voit, ligne par ligne, ce que Claude Code ferait.
// Réponses écrites à la main, rien n'est envoyé.

type Line = { text: string; tone?: "muted" | "ok" | "add" | "del" | "tool" };

const SCRIPTS: { match: RegExp; label: string; lines: Line[] }[] = [
  {
    match: /^\/init/i,
    label: "/init",
    lines: [
      { text: "● Lecture du projet (package.json, src/, tests/)", tone: "tool" },
      { text: "  Next.js 16, TypeScript, 42 composants, Vitest", tone: "muted" },
      { text: "● Écriture de CLAUDE.md", tone: "tool" },
      { text: "+ ## Commandes : npm run dev, npm test, npm run lint", tone: "add" },
      { text: "+ ## Conventions : composants dans components/, pas de any", tone: "add" },
      { text: "✓ CLAUDE.md créé. Je le relirai au début de chaque session.", tone: "ok" },
    ],
  },
  {
    match: /explique|comprend|c.est quoi ce projet/i,
    label: "explique ce projet",
    lines: [
      { text: "● Lecture de 18 fichiers", tone: "tool" },
      { text: "C'est une boutique en ligne en Next.js :", tone: undefined },
      { text: "  · app/ : les pages (catalogue, panier, paiement)", tone: "muted" },
      { text: "  · lib/stripe.ts : le paiement, appelé depuis app/api/checkout", tone: "muted" },
      { text: "  · Point d'attention : aucun test sur le calcul de la TVA.", tone: "muted" },
      { text: "Voulez-vous que j'ajoute ces tests ?", tone: "ok" },
    ],
  },
  {
    match: /test/i,
    label: "ajoute des tests pour la TVA",
    lines: [
      { text: "● Lecture de lib/prix.ts", tone: "tool" },
      { text: "● Création de lib/prix.test.ts (6 cas)", tone: "tool" },
      { text: "+ it(\"applique 20 % sur un prix HT\", …)", tone: "add" },
      { text: "+ it(\"arrondit au centime supérieur\", …)", tone: "add" },
      { text: "● npm test", tone: "tool" },
      { text: "✗ 1 échec : 19,99 € HT donne 23,98 € au lieu de 23,99 €", tone: "del" },
      { text: "● Correction de l'arrondi dans lib/prix.ts", tone: "tool" },
      { text: "✓ 6 tests réussis", tone: "ok" },
    ],
  },
  {
    match: /review|relis|relecture|bug/i,
    label: "/review",
    lines: [
      { text: "● Lecture du diff (4 fichiers, +120 −35)", tone: "tool" },
      { text: "1. app/api/checkout : le montant vient du navigateur.", tone: "del" },
      { text: "   Recalculez-le côté serveur, sinon on peut payer 1 €.", tone: "muted" },
      { text: "2. components/Panier.tsx : clé de liste manquante.", tone: undefined },
      { text: "3. Rien d'autre de bloquant.", tone: "muted" },
      { text: "✓ Relecture terminée : 1 problème important, 1 mineur", tone: "ok" },
    ],
  },
  {
    match: /sombre|dark/i,
    label: "ajoute un mode sombre",
    lines: [
      { text: "● Lecture de tailwind.config.ts et app/globals.css", tone: "tool" },
      { text: "+ darkMode: \"class\"", tone: "add" },
      { text: "+ .dark { --fond: 27 22 18; --texte: 242 233 220; }", tone: "add" },
      { text: "● Création de components/ThemeToggle.tsx", tone: "tool" },
      { text: "● npm run build", tone: "tool" },
      { text: "✓ Mode sombre ajouté, le choix est gardé dans le navigateur", tone: "ok" },
    ],
  },
];

const FALLBACK: Line[] = [
  { text: "● Lecture des fichiers concernés", tone: "tool" },
  { text: "Voici mon plan :", tone: undefined },
  { text: "  1. repérer le code à modifier", tone: "muted" },
  { text: "  2. faire le changement par petites étapes", tone: "muted" },
  { text: "  3. lancer les tests et vous montrer le résultat", tone: "muted" },
  { text: "Je commence ? (ici, c'est une démo : essayez une suggestion)", tone: "ok" },
];

const TONE: Record<string, string> = {
  muted: "text-[#b8a993]",
  ok: "text-[#9fd3b4]",
  add: "text-[#9fd3b4]",
  del: "text-[#f0a58f]",
  tool: "text-[#f2b23e]",
};

export function TerminalDemo() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ prompt: string; lines: Line[]; shown: number }[]>([]);
  const busy = history.length > 0 && history[history.length - 1].shown < history[history.length - 1].lines.length;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!busy) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(
      () =>
        setHistory((h) => {
          const last = h[h.length - 1];
          return [...h.slice(0, -1), { ...last, shown: reduce ? last.lines.length : last.shown + 1 }];
        }),
      reduce ? 0 : 380
    );
    return () => clearTimeout(t);
  }, [history, busy]);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [history]);

  function run(text: string) {
    const prompt = text.trim();
    if (!prompt || busy) return;
    const script = SCRIPTS.find((s) => s.match.test(prompt));
    setHistory((h) => [...h.slice(-2), { prompt, lines: script?.lines ?? FALLBACK, shown: 0 }]);
    setInput("");
  }

  return (
    <div className="rounded-lg border-[1.5px] border-on-surface bg-[#2b2119] text-[#f6efe3] shadow-[6px_6px_0_rgb(var(--c-green-soft))] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#f0a58f]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#f2b23e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#9fd3b4]" />
        <span className="ml-2 font-mono text-[12px] text-[#b8a993]">~/ma-boutique · claude</span>
      </div>
      <div ref={box} className="h-[300px] overflow-y-auto px-4 py-3 font-mono text-[13px] md:text-[14px] leading-[1.7]" aria-live="polite">
        {history.length === 0 && (
          <p className="text-[#b8a993]">
            Tapez une demande comme vous le feriez à Claude Code, ou choisissez une suggestion ci-dessous.
          </p>
        )}
        {history.map((h, i) => (
          <div key={i} className="mb-3">
            <p className="break-words">
              <span className="text-[#f2b23e]">&gt;</span> {h.prompt}
            </p>
            {h.lines.slice(0, h.shown).map((l, j) => (
              <p key={j} className={`break-words cm-line-in ${l.tone ? TONE[l.tone] : ""}`}>
                {l.text}
              </p>
            ))}
            {i === history.length - 1 && busy && <span className="inline-block w-2 h-4 bg-[#f6efe3] align-middle animate-pulse" />}
          </div>
        ))}
      </div>
      <form
        className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
      >
        <span className="font-mono text-[#f2b23e]">&gt;</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ajoute des tests pour la TVA"
          aria-label="Votre demande à Claude Code"
          className="flex-1 min-w-0 bg-transparent font-mono text-[16px] md:text-[14px] text-[#f6efe3] placeholder:text-[#7d6f5e] outline-none"
        />
        <button type="submit" disabled={busy} className="font-mono text-[12px] px-3 py-1.5 rounded bg-[#2f5d46] text-[#fbf6ee] disabled:opacity-50" data-ripple>
          Entrée
        </button>
      </form>
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {SCRIPTS.map((s) => (
          <button
            key={s.label}
            type="button"
            disabled={busy}
            onClick={() => run(s.label)}
            className="font-mono text-[12px] px-2.5 py-1 rounded border border-white/20 text-[#e9dfcf] hover:border-[#f2b23e] hover:text-[#f2b23e] transition-colors disabled:opacity-50"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
