"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue");
        return;
      }

      if (data.step === "setup_2fa") {
        router.push("/auth/setup-2fa");
      } else if (data.step === "needs_2fa") {
        router.push("/auth/verify-2fa");
      } else {
        router.push("/");
      }
    } catch {
      setError("Erreur réseau, réessayez");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
            }}
          >
            ◈
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "0.25rem",
            }}
          >
            Claude Code Formation
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {tab === "login"
              ? "Connectez-vous pour accéder à la formation"
              : "Créez votre compte pour commencer"}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                style={{
                  padding: "0.875rem",
                  background: tab === t ? "var(--bg-hover)" : "transparent",
                  color: tab === t ? "#fff" : "var(--text-muted)",
                  fontWeight: tab === t ? 600 : 400,
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {t === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--text-dim)",
                  marginBottom: "0.4rem",
                }}
              >
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.875rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border-color 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--text-dim)",
                  marginBottom: "0.4rem",
                }}
              >
                Mot de passe
                {tab === "register" && (
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      marginLeft: "0.4rem",
                    }}
                  >
                    (8 caractères minimum)
                  </span>
                )}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  style={{
                    width: "100%",
                    padding: "0.65rem 2.5rem 0.65rem 0.875rem",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "1rem",
                    padding: 0,
                  }}
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "0.65rem 0.875rem",
                  color: "#f87171",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: loading
                  ? "var(--border)"
                  : "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s",
                boxShadow: loading ? "none" : "0 4px 16px rgba(124,58,237,0.35)",
              }}
            >
              {loading
                ? "Chargement..."
                : tab === "login"
                ? "Se connecter →"
                : "Créer mon compte →"}
            </button>

            {/* 2FA hint */}
            {tab === "register" && (
              <p
                style={{
                  marginTop: "1rem",
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                🔐 Après l'inscription, vous configurerez l'authentification à deux
                facteurs (Google Authenticator, Authy…)
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
