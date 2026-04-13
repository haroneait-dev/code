"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Setup2FAPage() {
  const router = useRouter();
  const [qrDataURL, setQrDataURL] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"scan" | "verify">("scan");

  useEffect(() => {
    fetch("/api/auth/setup-2fa")
      .then((r) => r.json())
      .then((d) => {
        if (d.qrDataURL) setQrDataURL(d.qrDataURL);
        if (d.secret) setSecret(d.secret);
      })
      .catch(() => setError("Impossible de générer le QR code"));
  }, []);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Code incorrect");
        return;
      }
      router.push("/");
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  // Format secret in groups of 4 for readability
  const formattedSecret = secret.match(/.{1,4}/g)?.join(" ") ?? secret;

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

      <div className="fade-in" style={{ width: "100%", maxWidth: "460px" }}>
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
            Configuration 2FA
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Protégez votre compte avec l'authentification à deux facteurs
          </p>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Steps indicator */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {["Scanner le QR", "Vérifier le code"].map((label, i) => {
              const active = (i === 0 && step === "scan") || (i === 1 && step === "verify");
              const done = i === 0 && step === "verify";
              return (
                <div
                  key={i}
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    fontSize: "0.8rem",
                    fontWeight: active ? 600 : 400,
                    color: done ? "#4ade80" : active ? "#fff" : "var(--text-muted)",
                    background: active ? "var(--bg-hover)" : "transparent",
                    borderBottom: active
                      ? "2px solid #7c3aed"
                      : done
                      ? "2px solid #22c55e"
                      : "2px solid transparent",
                  }}
                >
                  {done ? "✓ " : `${i + 1}. `}
                  {label}
                </div>
              );
            })}
          </div>

          <div style={{ padding: "1.5rem" }}>
            {step === "scan" ? (
              <>
                {/* Instructions */}
                <div
                  style={{
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.25)",
                    borderRadius: "8px",
                    padding: "0.875rem",
                    marginBottom: "1.25rem",
                    fontSize: "0.85rem",
                    color: "var(--text-dim)",
                    lineHeight: 1.7,
                  }}
                >
                  <strong style={{ color: "#fff" }}>Instructions :</strong>
                  <ol style={{ marginTop: "0.4rem", paddingLeft: "1.2rem" }}>
                    <li>Installez <strong style={{ color: "#fff" }}>Google Authenticator</strong> ou <strong style={{ color: "#fff" }}>Authy</strong> sur votre téléphone</li>
                    <li>Scannez le QR code ci-dessous</li>
                    <li>Cliquez sur "Continuer" pour vérifier</li>
                  </ol>
                </div>

                {/* QR Code */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  {qrDataURL ? (
                    <div
                      style={{
                        padding: "12px",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrDataURL} alt="QR Code 2FA" width={180} height={180} />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 204,
                        height: 204,
                        background: "var(--bg-surface)",
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Génération…
                    </div>
                  )}
                </div>

                {/* Manual key */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowSecret((v) => !v)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "transparent",
                      border: "1px dashed var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-muted)",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {showSecret ? "🙈 Masquer la clé manuelle" : "⌨️ Entrer la clé manuellement"}
                  </button>
                  {showSecret && secret && (
                    <div
                      style={{
                        padding: "0.75rem",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.9rem",
                        color: "#9f67ff",
                        letterSpacing: "0.1em",
                        textAlign: "center",
                        wordBreak: "break-all",
                      }}
                    >
                      {formattedSecret}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep("verify")}
                  disabled={!qrDataURL}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: qrDataURL
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "var(--border)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: qrDataURL ? "pointer" : "not-allowed",
                    boxShadow: qrDataURL ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
                  }}
                >
                  J'ai scanné le QR → Continuer
                </button>
              </>
            ) : (
              <>
                {/* Verify step */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📱</div>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    Ouvrez votre application d'authentification et entrez
                    le code à <strong style={{ color: "#fff" }}>6 chiffres</strong> affiché pour
                    <br />
                    <strong style={{ color: "#9f67ff" }}>Claude Code Formation</strong>
                  </p>
                </div>

                <form onSubmit={handleVerify}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9 ]*"
                    maxLength={7}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="000000"
                    autoComplete="one-time-code"
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "1.6rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.3em",
                      textAlign: "center",
                      outline: "none",
                      marginBottom: "1rem",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
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
                      padding: "0.75rem",
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
                        loading || code.length !== 6
                          ? "none"
                          : "0 4px 16px rgba(124,58,237,0.35)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {loading ? "Vérification..." : "✓ Activer le 2FA"}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep("scan"); setError(""); setCode(""); }}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    ← Retour au QR code
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
