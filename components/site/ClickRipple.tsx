"use client";

// Onde au clic sur les boutons (.btn-primary, .btn-secondary, [data-ripple]).
import { useEffect } from "react";

export function ClickRipple() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function onDown(e: PointerEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(".btn-primary, .btn-secondary, [data-ripple]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const span = document.createElement("span");
      span.className = "cm-ripple";
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - r.left - size / 2}px`;
      span.style.top = `${e.clientY - r.top - size / 2}px`;
      el.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
