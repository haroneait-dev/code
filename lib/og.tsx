import { ImageResponse } from "next/og";

// ─── Template OG partagé ───────────────────────────────────────────────
// Génère une image de partage social 1200×630 cohérente avec le branding
// Claude Mastery (palette beige, logo « C », badge catégorie).
// Utilisé par les routes opengraph-image.tsx des articles wiki, leçons, sections.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Réduit la taille de police pour les titres longs afin d'éviter le débordement. */
function titleFontSize(title: string): number {
  const n = title.length;
  if (n > 68) return 52;
  if (n > 48) return 64;
  if (n > 30) return 76;
  return 88;
}

/** Coupe proprement un texte trop long pour le sous-titre. */
function clamp(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

export function ogImage({
  badge,
  title,
  subtitle,
  kind = "wiki",
}: {
  badge: string;
  title: string;
  subtitle?: string;
  kind?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #f5f1eb 0%, #ede4d3 60%, #e0c29e 100%)",
          fontFamily: "sans-serif",
          color: "#241a0e",
        }}
      >
        {/* En-tête : logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#241a0e",
              color: "#f5f1eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            <span>Claude</span>
            <span style={{ fontWeight: 400, opacity: 0.7 }}>Mastery</span>
          </div>
        </div>

        {/* Corps : badge + titre + sous-titre */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              padding: "8px 18px",
              border: "1px solid rgba(36, 26, 14, 0.25)",
              borderRadius: 999,
              fontSize: 18,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
              opacity: 0.7,
            }}
          >
            {clamp(badge, 42)}
          </div>
          <div
            style={{
              fontSize: titleFontSize(title),
              lineHeight: 1.04,
              fontWeight: 800,
              letterSpacing: -1.5,
              maxWidth: 1010,
            }}
          >
            {clamp(title, 96)}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 27,
                lineHeight: 1.4,
                opacity: 0.75,
                maxWidth: 940,
              }}
            >
              {clamp(subtitle, 140)}
            </div>
          ) : null}
        </div>

        {/* Pied : domaine + type */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            opacity: 0.7,
            fontWeight: 600,
          }}
        >
          <div>claude-mastery.fr</div>
          <div>{`${kind} · 🇫🇷 100% Français`}</div>
        </div>
      </div>
    ),
    ogSize
  );
}
