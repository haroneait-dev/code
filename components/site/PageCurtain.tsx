"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Transition entre les pages : un rideau souci puis vert monte et couvre
// l'écran avec le logo, la page change dessous, puis le rideau repart par le haut.
// Désactivé avec « réduire les animations ».
type Phase = "idle" | "cover" | "hold" | "reveal";
const COVER_MS = 420;

export function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const set = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noCurtain !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // ancre ou même page
      if (phaseRef.current !== "idle") return;
      e.preventDefault();
      set("cover");
      setTimeout(() => {
        set("hold");
        router.push(url.pathname + url.search + url.hash);
      }, COVER_MS);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // Nouvelle page affichée : le rideau s'en va.
  useEffect(() => {
    if (phaseRef.current === "idle") return;
    window.scrollTo(0, 0);
    set("reveal");
    const t = setTimeout(() => set("idle"), 650);
    return () => clearTimeout(t);
  }, [pathname]);

  // Filet de sécurité : jamais bloqué sous le rideau.
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => set("reveal"), 4000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => set("idle"), 650);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "idle") return null;
  return (
    <div className={`cm-curtain cm-curtain-${phase}`} aria-hidden>
      <div className="cm-curtain-a" />
      <div className="cm-curtain-b">
        <div className="cm-curtain-logo">&gt;_</div>
      </div>
    </div>
  );
}
