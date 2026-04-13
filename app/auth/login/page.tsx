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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : error.message
      );
      setLoading(false);
    } else {
      // Force full reload so the proxy picks up the new session cookie
      window.location.replace("/");
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setResetLoading(false);
    setResetSent(true);
  }

  if (showReset) {
    return (
      <AuthShell subtitle="Réinitialisation du mot de passe">
        {resetSent ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📬</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Un lien a été envoyé à <strong style={{ color: "white" }}>{resetEmail}</strong>.<br />
              Vérifie ta boîte mail.
            </p>
            <button
              onClick={() => { setShowReset(false); setResetSent(false); }}
              style={{ marginTop: "1.25rem", background: "none", border: "none", color: "var(--purple)", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
            >
              ← Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
              Entre ton email et on t&apos;envoie un lien pour réinitialiser ton mot de passe.
            </p>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="toi@exemple.com"
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={resetLoading} style={btnStyle(resetLoading)}>
              {resetLoading ? "Envoi…" : "Envoyer le lien"}
            </button>
            <button
              type="button"
              onClick={() => setShowReset(false)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.875rem", marginTop: "-0.25rem" }}
            >
              ← Retour
            </button>
          </form>
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell subtitle="Connecte-toi pour accéder à la formation">
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
            <label style={labelStyle}>Mot de passe</label>
            <button
              type="button"
              onClick={() => { setShowReset(true); setResetEmail(email); }}
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", padding: 0 }}
            >
              Mot de passe oublié ?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
            autoComplete="current-password"
          />
        </div>

        {error && <ErrorBox message={error} />}

        <button type="submit" disabled={loading} style={{ ...btnStyle(loading), marginTop: "0.25rem" }}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <Divider />

      <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Pas encore de compte ?{" "}
        <Link href="/auth/signup" style={{ color: "var(--purple)", textDecoration: "none", fontWeight: 600 }}>
          S&apos;inscrire gratuitement →
        </Link>
      </p>
    </AuthShell>
  );
}

// ─── Shared pieces ───────────────────────────────────────────────────────────

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

function ErrorBox({ message }: { message: string }) {
  return (
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
      <span>⚠</span> {message}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ou</span>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
    </div>
  );
}

function AuthShell({ children, subtitle }: { children: React.ReactNode; subtitle: string }) {
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
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{subtitle}</p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
