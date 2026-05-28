"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Github, Mail, Sparkles, X, Loader2, CheckCircle2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type State =
  | { kind: "idle" }
  | { kind: "loading"; method: "github" | "email" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setState({ kind: "idle" });
      setEmail("");
    }
  }, [open]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  const signInGitHub = async () => {
    setState({ kind: "loading", method: "github" });
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setState({ kind: "error", message });
    }
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState({ kind: "loading", method: "email" });
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setState({ kind: "sent" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setState({ kind: "error", message });
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm" />

      {/* Centering wrapper that grows with content */}
      <div className="relative flex min-h-full items-center justify-center p-4 py-8">
        {/* Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl p-8 sm:p-10 my-auto"
        >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 w-8 h-8 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#f0eae0" }}
          >
            <Sparkles className="w-7 h-7 text-primary" strokeWidth={1.75} />
          </div>
        </div>

        <h2
          id="auth-modal-title"
          className="font-display-xl text-[28px] font-bold text-center text-on-surface tracking-tight mb-2"
        >
          Bienvenue
        </h2>
        <p className="text-center text-on-surface-variant font-body-rt text-body-rt mb-8">
          Connectez-vous pour continuer vers Claude Mastery.
        </p>

        {state.kind === "sent" ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <CheckCircle2
                className="w-6 h-6 text-primary"
                strokeWidth={1.75}
              />
            </div>
            <p className="font-body-rt text-on-surface mb-2">
              Lien magique envoyé.
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Vérifiez vos emails à <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* GitHub */}
            <button
              type="button"
              onClick={signInGitHub}
              disabled={state.kind === "loading"}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-on-surface text-inverse-on-surface font-body-rt text-body-rt font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {state.kind === "loading" && state.method === "github" ? (
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.75} />
              ) : (
                <Github className="w-5 h-5" strokeWidth={1.75} />
              )}
              Continuer avec GitHub
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs text-on-surface-variant">ou</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            {/* Email magic link */}
            <form onSubmit={sendMagicLink}>
              <label
                htmlFor="auth-email"
                className="block font-body-sm text-body-sm font-medium text-on-surface mb-2"
              >
                Adresse email
              </label>
              <div className="relative mb-4">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
                  strokeWidth={1.75}
                />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-3 font-body-rt text-body-rt text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={state.kind === "loading" || !email.trim()}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary font-body-rt text-body-rt font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {state.kind === "loading" && state.method === "email" && (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
                )}
                Recevoir un lien magique
              </button>
            </form>

            {state.kind === "error" && (
              <p className="mt-4 text-sm text-error text-center">
                {state.message}
              </p>
            )}

            <p className="text-center text-xs text-on-surface-variant mt-6 leading-relaxed">
              En continuant, vous acceptez nos{" "}
              <a href="#" className="underline hover:text-on-surface">
                Conditions
              </a>{" "}
              et notre{" "}
              <a href="#" className="underline hover:text-on-surface">
                Politique de confidentialité
              </a>
              .
            </p>
          </>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
}
