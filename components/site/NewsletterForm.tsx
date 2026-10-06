"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { track } from "@vercel/analytics";

export function NewsletterForm({ source = "site" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, site }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setState("ok");
      track("newsletter_inscription", { source });
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Erreur");
    }
  }

  if (state === "ok") {
    return (
      <p className="inline-flex items-center gap-2 font-semibold text-[16px] text-primary">
        <Check className="w-5 h-5" strokeWidth={2.5} />
        C'est noté. À la semaine prochaine !
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor={`nl-${source}`} className="sr-only">Votre adresse e-mail</label>
        <input
          id={`nl-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 min-w-0 rounded-md border-[1.5px] border-on-surface bg-surface-container-lowest px-4 text-[16px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="hidden"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-primary h-12 px-5 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] disabled:opacity-60 group"
        >
          {state === "loading" ? "Envoi…" : "S'inscrire"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
        </button>
      </div>
      {state === "error" && <p className="text-[14px] text-secondary">{message}</p>}
      <p className="text-[13.5px] text-on-surface-variant">Un e-mail par semaine, désinscription en un clic. Pas de pub, pas de revente.</p>
    </form>
  );
}
