"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { track } from "@vercel/analytics";
import { sharePath } from "@/lib/share";

export function ShareResult({ levelIndex, level, theme }: { levelIndex: number; level: string; theme: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}${sharePath(levelIndex, theme)}` : "";
  const text = `J'ai le niveau ${level} sur Claude. Et vous ?`;

  async function share() {
    track("partage_resultat", { niveau: level });
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mon niveau sur Claude", text, url });
        return;
      } catch {
        // partage annulé : on propose la copie
      }
    }
    copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={share} className="btn-secondary h-10 px-4 rounded-md inline-flex items-center gap-2 font-semibold text-[14.5px]">
        <Share2 className="w-4 h-4" strokeWidth={2} />
        Partager mon résultat
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 px-4 rounded-md inline-flex items-center font-semibold text-[14.5px] border border-outline-variant hover:bg-surface-container-low"
      >
        WhatsApp
      </a>
      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 px-4 rounded-md inline-flex items-center font-semibold text-[14.5px] border border-outline-variant hover:bg-surface-container-low"
      >
        X
      </a>
      <button type="button" onClick={copy} className="h-10 px-4 rounded-md inline-flex items-center gap-2 font-semibold text-[14.5px] border border-outline-variant hover:bg-surface-container-low">
        {copied ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <Link2 className="w-4 h-4" strokeWidth={2} />}
        {copied ? "Lien copié" : "Copier le lien"}
      </button>
    </div>
  );
}
