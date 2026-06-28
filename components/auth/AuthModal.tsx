"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AtSign, Lock, Sparkles, X, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { pseudoToEmail } from "@/lib/pseudo-auth";
import {
  isValidUsername,
  normalizeUsername,
  isReservedUsername,
} from "@/lib/community/types";

type Mode = "signup" | "login";

export function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("signup");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape + lock scroll
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
      setMode("signup");
      setPseudo("");
      setPassword("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  const username = normalizeUsername(pseudo);
  const pseudoFormatOk = isValidUsername(username);
  const passwordOk = password.length >= 6;
  const canSubmit = pseudoFormatOk && passwordOk && !loading;

  // Once authenticated, do a full navigation so the server (proxy + RSC)
  // picks up the freshly-set session cookies. Respect ?from= if present.
  const redirectAfterAuth = () => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    window.location.assign(from && from.startsWith("/") ? from : "/");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudoFormatOk) {
      setError(
        "Pseudo invalide : 3 à 20 caractères, minuscules, chiffres et _."
      );
      return;
    }
    if (mode === "signup" && isReservedUsername(username)) {
      setError("Ce pseudo est réservé, choisis-en un autre.");
      return;
    }
    if (!passwordOk) {
      setError("Mot de passe : 6 caractères minimum.");
      return;
    }

    setError(null);
    setLoading(true);
    const supabase = getSupabase();
    const email = pseudoToEmail(username);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          if (/already|registered|exist/i.test(signUpError.message)) {
            setError(
              "Ce pseudo est déjà pris. Passe sur « Se reconnecter »."
            );
          } else {
            setError(signUpError.message);
          }
          setLoading(false);
          return;
        }
        if (!data.session) {
          // Email confirmation is still enabled in Supabase — not supported here.
          setError(
            "Inscription bloquée : désactive « Confirm email » dans Supabase pour autoriser l'accès direct."
          );
          setLoading(false);
          return;
        }
        // Enregistre le pseudo sur le profil
        const res = await fetch("/api/profile/username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, display_name: username }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d.error ?? "Erreur lors de l'enregistrement du pseudo.");
          setLoading(false);
          return;
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError("Pseudo ou mot de passe incorrect.");
          setLoading(false);
          return;
        }
      }
      redirectAfterAuth();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erreur réseau, réessaie."
      );
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

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

      {/* Centering wrapper */}
      <div className="relative flex min-h-full items-center justify-center p-4 py-8">
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
            {isSignup ? "Choisis ton pseudo" : "Re-bienvenue"}
          </h2>
          <p className="text-center text-on-surface-variant font-body-rt text-body-rt mb-8">
            {isSignup
              ? "Un pseudo + un mot de passe, et tu y as accès à vie."
              : "Reconnecte-toi avec ton pseudo et ton mot de passe."}
          </p>

          <form onSubmit={submit}>
            {/* Pseudo */}
            <label
              htmlFor="auth-pseudo"
              className="block font-body-sm text-body-sm font-medium text-on-surface mb-2"
            >
              Pseudo
            </label>
            <div className="relative mb-1">
              <AtSign
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
                strokeWidth={1.75}
              />
              <input
                id="auth-pseudo"
                type="text"
                required
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="ton_pseudo"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={20}
                className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-3 font-body-rt text-body-rt text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            {isSignup && (
              <p className="text-xs text-on-surface-variant mb-4">
                3 à 20 caractères : minuscules, chiffres et <code>_</code>.
              </p>
            )}

            {/* Mot de passe */}
            <label
              htmlFor="auth-password"
              className={`block font-body-sm text-body-sm font-medium text-on-surface mb-2 ${
                isSignup ? "" : "mt-4"
              }`}
            >
              Mot de passe
            </label>
            <div className="relative mb-4">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
                strokeWidth={1.75}
              />
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-3 font-body-rt text-body-rt text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary font-body-rt text-body-rt font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />}
              {isSignup ? "Créer mon accès" : "Se reconnecter"}
            </button>

            {error && (
              <p className="mt-4 text-sm text-error text-center">{error}</p>
            )}
          </form>

          {/* Toggle créer / se reconnecter */}
          <p className="text-center text-body-sm text-on-surface-variant mt-6">
            {isSignup ? "Tu as déjà un pseudo ?" : "Première visite ?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setError(null);
              }}
              className="text-primary font-medium hover:underline"
            >
              {isSignup ? "Se reconnecter" : "Créer un pseudo"}
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
