"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Une barre discrète à l’arrivée. Aucun lien intercepté, aucun délai ajouté.
export function PageCurtain() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 180);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return visible ? <div className="cm-route-progress" aria-hidden="true" /> : null;
}
