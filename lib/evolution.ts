// Données de la page « L'évolution de Claude ». Reprises des articles du wiki
// (modeles/evolution-claude, modeles/pricing-tokens), déjà vérifiés.

export type Bar = { label: string; value: number; display: string; note?: string };

export const OPUS_PRICE: Bar[] = [
  { label: "Opus 3 · mars 2024", value: 75, display: "75 $" },
  { label: "Opus 4 · mai 2025", value: 75, display: "75 $" },
  { label: "Opus 4.5 · nov. 2025", value: 25, display: "25 $" },
  { label: "Opus 5 · juil. 2026", value: 25, display: "25 $" },
  { label: "Opus 5.5 · sept. 2026", value: 20, display: "20 $", note: "le niveau de Fable 5.1 sur la plupart des tâches" },
];

export const CONTEXT: Bar[] = [
  { label: "Claude 3 · 2024", value: 200, display: "200K tokens", note: "≈ 500 pages" },
  { label: "Claude 4 · 2025", value: 200, display: "200K tokens" },
  { label: "Opus 4.8 · mai 2026", value: 1000, display: "1M tokens", note: "au tarif standard" },
  { label: "Génération 5 · 2026", value: 1000, display: "1M tokens", note: "par défaut, ≈ 2 500 pages" },
];

export const MODELS_PER_YEAR: Bar[] = [
  { label: "2024", value: 6, display: "6 modèles" },
  { label: "2025", value: 7, display: "7 modèles" },
  { label: "2026 (à octobre)", value: 12, display: "12 modèles" },
];

export const TIMELINE: { date: string; title: string; text: string; big?: boolean }[] = [
  { date: "Mars 2024", title: "Claude 3", text: "Haiku, Sonnet, Opus : trois tailles, 200K de contexte, vision.", big: true },
  { date: "Juin 2024", title: "Claude 3.5 Sonnet", text: "Meilleur qu'Opus 3 en code, pour bien moins cher." },
  { date: "Oct. 2024", title: "Computer use", text: "Claude pilote un écran par captures et clics." },
  { date: "Fév. 2025", title: "Claude 3.7 Sonnet et Claude Code", text: "La réflexion étendue, et l'agent dans le terminal en aperçu.", big: true },
  { date: "Mai 2025", title: "Claude 4", text: "Opus 4 et Sonnet 4 ; Claude Code ouvert à tous." },
  { date: "Nov. 2025", title: "Opus 4.5", text: "Le niveau Opus trois fois moins cher." },
  { date: "Mai 2026", title: "Opus 4.8", text: "1M de contexte au tarif standard." },
  { date: "Juin 2026", title: "Fable 5 et Mythos 5", text: "Une nouvelle gamme au-dessus d'Opus.", big: true },
  { date: "Juil. 2026", title: "Opus 5", text: "La génération 5 devient la référence." },
  { date: "Sept. 2026", title: "Opus 5.5 et Sonnet 5.5", text: "Le niveau Fable 5.1 pour 4 $ / 20 $ ; Sonnet 30 % plus rapide.", big: true },
];
