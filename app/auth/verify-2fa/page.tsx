"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Verify2FAPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Code incorrect");
        setCode("");
        return;
      }
      router.push("/");
    } catch {
      setError("Erreur réseau");
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
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="fade-in" style={{ width: "100%", maxWidth: "380px" }}>
        {/* Header */}
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
            🔐
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "0.25rem" }}>
            Vérification 2FA
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Entrez le code de votre application d'authentification
          </p>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "1.75rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📱</div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", lineHeight: 1.7 }}>
              Ouvrez <strong style={{ color: "#fff" }}>Google Authenticator</strong> ou <strong style={{ color: "#fff" }}>Authy</strong> et entrez le code affiché pour{" "}
              <strong style={{ color: "#9f67ff" }}>Claude Code Formation</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="000000"
              autoComplete="one-time-code"
              autoFocus
              style={{
                width: "100%",
                padding: "1rem",
                background: "var(--bg-surface)",
                border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "var(--border)"}`,
                borderRadius: "10px",
                color: "#fff",
                fontSize: "2rem",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.4em",
                textAlign: "center",
                outline: "none",
                marginBottom: "1rem",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => !error && (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) => !error && (e.target.style.borderColor = "var(--border)")}
            />

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "0.65rem",
                  color: "#f87171",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              style={{
                width: "100%",
                padding: "0.8rem",
                background:
                  loading || code.length !== 6
                    ? "var(--border)"
                    : "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: loading || code.length !== 6 ? "not-allowed" : "pointer",
                boxShadow:
                  code.length === 6 && !loading
                    ? "0 4px 16px rgba(124,58,237,0.35)"
                    : "none",
                transition: "all 0.15s",
              }}
            >
              {loading ? "Vérification..." : "Accéder à la formation →"}
            </button>
          </form>

          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <a
              href="/auth"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text-muted)")
              }
            >
              ← Retour à la connexion
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "1rem" }}>
          Le code change toutes les 30 secondes ⏱
        </p>
      </div>
    </div>
  );
}
