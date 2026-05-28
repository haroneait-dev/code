"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type PerSub = {
  subreddit: string;
  ok: boolean;
  error?: string;
  posts?: unknown[];
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "success";
      fetched: number;
      auto_imported: number;
      perSub?: PerSub[];
    }
  | { kind: "error"; message: string; perSub?: PerSub[] };

export function RedditImportButton() {
  const [state, setState] = useState<State>({ kind: "idle" });

  const trigger = async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/admin/reddit-import", {
        method: "POST",
        credentials: "include",
      });
      const text = await res.text();
      const contentType = res.headers.get("content-type") ?? "";
      const looksLikeHtml =
        contentType.includes("text/html") || text.trimStart().startsWith("<");

      if (looksLikeHtml) {
        // Real HTML response = Vercel SSO or similar wall
        throw new Error(
          `Vercel Deployment Protection bloque la route (HTTP ${res.status}). Désactive Vercel Authentication sur Production dans les settings du projet.`
        );
      }

      // Parse JSON body (may be from 200 or from explicit error status like 502/500)
      let json: {
        ok?: boolean;
        error?: string;
        fetched?: number;
        auto_imported?: number;
        perSub?: PerSub[];
      };
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Réponse non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
      }

      if (!res.ok || json.ok === false) {
        setState({
          kind: "error",
          message: json.error ?? `HTTP ${res.status}`,
          perSub: json.perSub,
        });
        return;
      }

      setState({
        kind: "success",
        fetched: json.fetched ?? 0,
        auto_imported: json.auto_imported ?? 0,
        perSub: json.perSub,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("[reddit-import]", e);
      setState({ kind: "error", message });
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-grow min-w-0">
          <h3 className="font-body-rt text-body-rt font-semibold text-on-surface mb-1">
            Import Reddit
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Récupère les top posts hebdomadaires des subreddits r/ClaudeAI,
            r/Anthropic, r/ChatGPTCoding, r/LocalLLaMA. Auto-import des posts
            avec score ≥ 30 et 5+ commentaires.
          </p>
        </div>
        <button
          type="button"
          onClick={trigger}
          disabled={state.kind === "loading"}
          className="btn-primary px-4 h-10 inline-flex items-center gap-2 rounded-lg text-body-sm font-medium disabled:opacity-60 shrink-0"
        >
          {state.kind === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
              Import…
            </>
          ) : (
            <>
              <Download className="w-4 h-4" strokeWidth={1.75} />
              Lancer l'import
            </>
          )}
        </button>
      </div>

      {state.kind === "success" && (
        <div className="mt-4 pt-4 border-t border-outline-variant">
          <div className="flex items-center gap-2 text-sm text-on-surface mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={1.75} />
            <span>
              <strong>{state.fetched}</strong> posts récupérés ·{" "}
              <strong>{state.auto_imported}</strong> auto-importés (qualité OK)
            </span>
          </div>
          {state.perSub && <PerSubList perSub={state.perSub} />}
        </div>
      )}

      {state.kind === "error" && (
        <div className="mt-4 pt-4 border-t border-outline-variant">
          <div className="flex items-start gap-2 text-sm text-error mb-3">
            <AlertCircle
              className="w-4 h-4 mt-0.5 shrink-0"
              strokeWidth={1.75}
            />
            <span>Erreur : {state.message}</span>
          </div>
          {state.perSub && <PerSubList perSub={state.perSub} />}
        </div>
      )}
    </div>
  );
}

function PerSubList({ perSub }: { perSub: PerSub[] }) {
  return (
    <ul className="space-y-1 text-xs font-code-md">
      {perSub.map((s) => (
        <li
          key={s.subreddit}
          className={`flex items-start gap-2 ${
            s.ok ? "text-on-surface-variant" : "text-error"
          }`}
        >
          <span className="shrink-0">{s.ok ? "✓" : "✗"}</span>
          <span className="font-semibold w-32 shrink-0">r/{s.subreddit}</span>
          <span className="break-all">
            {s.ok
              ? `${(s.posts as unknown[] | undefined)?.length ?? 0} posts`
              : s.error}
          </span>
        </li>
      ))}
    </ul>
  );
}
