"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const MAX_LEN = 5000;

export function MessageComposer({
  conversationId,
  onOptimistic,
  onSent,
}: {
  conversationId: string;
  onOptimistic?: (tempId: string, body: string) => void;
  onSent?: (tempId: string, realId: string) => void;
}) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [body]);

  const send = async () => {
    const trimmed = body.trim();
    if (!trimmed || loading) return;
    if (trimmed.length > MAX_LEN) {
      setError(`Maximum ${MAX_LEN} caractères.`);
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setLoading(true);
    setError(null);
    onOptimistic?.(tempId, trimmed);
    setBody("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId, body: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Échec de l'envoi");
        setBody(trimmed);
        return;
      }
      onSent?.(tempId, data.message?.id ?? tempId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
      setBody(trimmed);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="border-t border-outline-variant bg-surface px-margin-mobile md:px-margin-desktop py-3 sticky bottom-0">
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="text-body-sm text-error mb-2">{error}</div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, MAX_LEN))}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Écris un message…"
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-2xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors resize-none leading-relaxed"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || body.trim().length === 0}
            className="btn-primary h-11 w-11 rounded-full inline-flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </form>
      </div>
    </div>
  );
}
