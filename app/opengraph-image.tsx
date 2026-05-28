import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Claude Mastery — Formation Claude Code en français";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
            Claude{" "}
            <span style={{ fontWeight: 400, opacity: 0.7 }}>Mastery</span>
          </div>
        </div>

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
            Formation Claude Code
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            De zéro à <span style={{ opacity: 0.6 }}>expert</span> Claude Code.
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              opacity: 0.75,
              maxWidth: 900,
            }}
          >
            La formation francophone de référence — modules pratiques, wiki et
            communauté.
          </div>
        </div>

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
          <div>🇫🇷 100% Français</div>
        </div>
      </div>
    ),
    size
  );
}
