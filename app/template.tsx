// Transition à chaque changement de page : léger glissement vers le haut, en CSS pur
// (aucun JavaScript, pas de départ invisible : l'affichage n'est pas retardé).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="cm-page-enter">{children}</div>;
}
