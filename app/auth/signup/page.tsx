"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--text-primary)",
  fontSize: "0.9375rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  color: "var(--text-muted)",
  marginBottom: "0.375rem",
  fontWeight: 500,
};

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "0.75rem",
    background: disabled
      ? "rgba(255,255,255,0.06)"
      : "linear-gradient(135deg, var(--purple), var(--orange))",
    border: "none",
    borderRadius: "0.5rem",
    color: disabled ? "var(--text-muted)" : "white",
    fontWeight: 700,
    fontSize: "0.9375rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity 0.15s",
  };
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Un compte existe déjà avec cet email."
          : error.message
      );
      setLoading(false);
      return;
    }

    // If session is returned immediately → email confirmation disabled → redirect
    if (data.session) {
      window.location.replace("/");
      return;
    }

    // Otherwise → confirmation email sent
    setLoading(false);
    setConfirmPending(true);
  }

  if (confirmPending) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--bg-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          padding: "2.5rem 2rem",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📬</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Vérifie ta boîte mail
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Un lien de confirmation a été envoyé à{" "}
            <strong style={{ color: "white" }}>{email}</strong>.<br />
            Clique dessus pour activer ton compte et accéder à la formation.
          </p>
          <div style={{
            margin: "1.5rem 0",
            padding: "0.75rem 1rem",
            background: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            color: "#c4b5fd",
          }}>
            Pense à vérifier tes spams si tu ne vois pas l&apos;email.
          </div>
          <Link href="/auth/login" style={{
            display: "inline-block",
            color: "var(--purple)",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "0.875rem",
          }}>
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-dark)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.625rem",
          }}>
            <span style={{ fontSize: "1.75rem" }}>⚡</span>
            <span style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, var(--purple), var(--orange))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Claude Code Formation</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Crée ton compte — c&apos;est gratuit
          </p>
        </div>

        {/* Selling points */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.25rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          {["33 leçons", "50+ exercices", "0 prérequis"].map((t) => (
            <span key={t} style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.75rem",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "999px",
              color: "#c4b5fd",
            }}>{t}</span>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem" }}>
            Créer mon compte
          </h1>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                style={inputStyle}
                autoComplete="email"
              />
            </div>

            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                style={inputStyle}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div style={{
                padding: "0.75rem 1rem",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "0.5rem",
                color: "#fca5a5",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...btnStyle(loading), marginTop: "0.25rem" }}
            >
              {loading ? "Création du compte…" : "Créer mon compte →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ou</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Déjà un compte ?{" "}
            <Link href="/auth/login" style={{ color: "var(--purple)", textDecoration: "none", fontWeight: 600 }}>
              Se connecter
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", opacity: 0.6 }}>
          En créant un compte tu acceptes nos conditions d&apos;utilisation.
        </p>
      </div>
    </div>
  );
}
