"use client";

import { useEffect, useState } from "react";
import { Flag, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  targetKind: "post" | "comment";
  targetId: string;
};

export function ReportButton({ targetKind, targetId }: Props) {
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setAuthed(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setAuthed(!!session?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!authed) return null;

  const closeAndReset = () => {
    setOpen(false);
    setReason("");
    setError(null);
    setDone(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 4 || trimmed.length > 500) {
      setError("La raison doit faire entre 4 et 500 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_kind: targetKind,
          target_id: targetId,
          reason: trimmed,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Échec du signalement");
        return;
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-error transition-colors"
      >
        <Flag className="w-3.5 h-3.5" strokeWidth={1.75} />
        Signaler
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/30 backdrop-blur-sm"
          onClick={closeAndReset}
        >
          <div
            className="w-full max-w-md bg-surface rounded-2xl border border-outline-variant p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display-md text-display-md font-bold text-on-surface">
                  Signaler ce contenu
                </h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Explique pourquoi en quelques mots. Un admin examinera.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAndReset}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {done ? (
              <div className="text-body-rt text-on-surface bg-primary-fixed/40 rounded-xl p-4">
                Merci. Ton signalement a été transmis aux modérateurs.
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={closeAndReset}
                    className="btn-primary px-5 h-9 rounded-full inline-flex items-center text-body-sm font-medium"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  minLength={4}
                  maxLength={500}
                  placeholder="Décris le problème (spam, harcèlement, hors-sujet…)"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors resize-y"
                />
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{reason.trim().length} / 500</span>
                  {error && <span className="text-error">{error}</span>}
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={closeAndReset}
                    className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors px-3"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || reason.trim().length < 4}
                    className="btn-primary px-5 h-9 rounded-full inline-flex items-center gap-2 text-body-sm font-medium disabled:opacity-50"
                  >
                    <Flag className="w-4 h-4" strokeWidth={1.75} />
                    {loading ? "Envoi…" : "Signaler"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
