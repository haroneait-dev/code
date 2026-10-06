import { ImageResponse } from "next/og";

// ─── Images de partage (1200×630), direction « Atelier » ──────────────
// Papier chaud, encre, vert sapin, surligneur souci. Utilisé par les
// routes opengraph-image.tsx (articles, leçons, sections) et le partage
// du résultat du test de niveau.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const INK = "#2b2119";
const PAPER = "#fbf6ee";
const GREEN = "#2f5d46";
const MARK = "#fbe3a8";
const MARIGOLD = "#f2b23e";

function titleFontSize(title: string): number {
  const n = title.length;
  if (n > 68) return 54;
  if (n > 48) return 64;
  if (n > 30) return 76;
  return 90;
}

function clamp(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 10,
          background: GREEN,
          color: PAPER,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          transform: "rotate(-3deg)",
        }}
      >
        {">_"}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>Claude Mastery</div>
    </div>
  );
}

function Footer({ right }: { right: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 22,
        fontWeight: 600,
        color: "#66574a",
        borderTop: `2px solid ${INK}`,
        paddingTop: 22,
      }}
    >
      <div>Apprendre Claude en français · gratuit</div>
      <div>{right}</div>
    </div>
  );
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
          padding: "64px 72px",
          background: PAPER,
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        <Logo />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 16px",
              background: MARK,
              fontSize: 22,
              fontWeight: 700,
              transform: "rotate(-1.5deg)",
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
              maxWidth: 1040,
            }}
          >
            {clamp(title, 96)}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 28, lineHeight: 1.4, color: "#66574a", maxWidth: 980 }}>
              {clamp(subtitle, 130)}
            </div>
          ) : null}
        </div>
        <Footer right={kind === "wiki" ? "Wiki" : kind} />
      </div>
    ),
    ogSize
  );
}

// Carte de partage du résultat du test de niveau.
export function ogResult({ level, theme }: { level: string; theme?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: PAPER,
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        <Logo />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#66574a" }}>Mon niveau sur Claude :</div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                fontSize: 150,
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: -4,
                background: MARK,
                padding: "0 18px",
                borderBottom: `10px solid ${MARIGOLD}`,
              }}
            >
              {level}
            </div>
          </div>
          {theme ? <div style={{ fontSize: 34, fontWeight: 600 }}>{`Parcours : ${theme}`}</div> : null}
        </div>
        <Footer right="Et vous ? Test en 10 questions" />
      </div>
    ),
    ogSize
  );
}
