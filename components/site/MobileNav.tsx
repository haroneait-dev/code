"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS as LINKS, type NavKey } from "@/lib/nav";

export function MobileNav({ active = null }: { active?: NavKey }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors text-on-surface"
      >
        <Menu className="w-5 h-5" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <div
            className="absolute inset-0 bg-on-surface/40 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-surface border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between h-16 px-5 border-b border-outline-variant">
              <span className="font-headline-lg text-[21px] font-bold text-on-surface tracking-tight">
                Claude Mastery
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors text-on-surface"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {LINKS.map((l) => {
                const isActive = active === l.key;
                return (
                  <Link
                    key={l.key}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={
                      isActive
                        ? "flex items-center px-4 py-3 rounded-md bg-primary-fixed text-on-surface font-semibold text-body-rt"
                        : "flex items-center px-4 py-3 rounded-md text-on-surface hover:bg-surface-container transition-colors text-body-rt"
                    }
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-5 py-5 border-t border-outline-variant flex flex-col gap-3">
              <Link
                href="/test"
                onClick={() => setOpen(false)}
                className="btn-primary h-12 rounded-md inline-flex items-center justify-center font-semibold text-[15px]"
              >
                Test de niveau (2 min)
              </Link>
              <span className="text-body-sm text-on-surface-variant">Formation Claude en français, en accès libre.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
