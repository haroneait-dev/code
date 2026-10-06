"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { track } from "@vercel/analytics";

export function CopyButton({ text, label = "Copier", event }: { text: string; label?: string; event?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (event) track("prompt_copie", { prompt: event });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={copy}
      className={`h-9 px-3.5 rounded-md inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors ${
        copied ? "bg-primary text-on-primary" : "btn-secondary"
      }`}
    >
      {copied ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <Copy className="w-4 h-4" strokeWidth={2} />}
      {copied ? "Copié" : label}
    </button>
  );
}
