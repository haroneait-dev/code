"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Motion design au défilement, sur tout le site :
// - le surligneur (.text-mark) se trace comme un coup de feutre ;
// - les titres de section et les cartes des grilles montent en cascade.
// Seuls les éléments sous la ligne de flottaison sont cachés au départ :
// le premier affichage n'est jamais retardé. Rien avec « réduire les animations ».
export function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vh = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("cm-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    const marks = document.querySelectorAll<HTMLElement>("main .text-mark:not(.cm-mark)");
    marks.forEach((el) => {
      el.classList.add("cm-mark");
      if (el.getBoundingClientRect().top < vh) setTimeout(() => el.classList.add("cm-in"), 250);
      else io.observe(el);
    });

    const blocks = document.querySelectorAll<HTMLElement>("main section h2, main section .grid > *");
    blocks.forEach((el) => {
      if (el.classList.contains("cm-reveal") || el.getBoundingClientRect().top < vh) return;
      const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty("--cm-i", String(Math.min(i, 8)));
      el.classList.add("cm-reveal");
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
