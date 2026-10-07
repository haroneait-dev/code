// Animation « Claude Code en action » : un terminal qui montre une vraie
// boucle d'agent (demande, lecture, modifications, tests). Lue dans le site
// par @remotion/player, et rendue en vidéo par le CLI Remotion.

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#2b2119";
const PAPER = "#f6efe3";
const MUTED = "#a8998a";
const GREEN = "#9fd3b4";
const RED = "#f0a58c";
const MARIGOLD = "#f2b23e";
const MONO = "var(--font-jbm), 'JetBrains Mono', ui-monospace, monospace";

type Line = { at: number; text: string; color?: string; prefix?: string; prefixColor?: string };

const PROMPT = "ajoute un mode sombre et vérifie les tests";

const LINES: Line[] = [
  { at: 70, prefix: "●", prefixColor: MARIGOLD, text: "Je regarde comment les couleurs sont définies…", color: PAPER },
  { at: 82, prefix: "  ⎿", prefixColor: MUTED, text: "Lecture de 12 fichiers", color: MUTED },
  { at: 104, prefix: "●", prefixColor: MARIGOLD, text: "Plan : variables CSS + bouton de thème", color: PAPER },
  { at: 128, prefix: "●", prefixColor: MARIGOLD, text: "Modification de app/globals.css", color: PAPER },
  { at: 136, prefix: "  -", prefixColor: RED, text: "  background-color: #fbf6ee;", color: RED },
  { at: 142, prefix: "  +", prefixColor: GREEN, text: "  background-color: rgb(var(--c-surface));", color: GREEN },
  { at: 150, prefix: "  +", prefixColor: GREEN, text: "  .dark { --c-surface: 27 22 18; }", color: GREEN },
  { at: 170, prefix: "●", prefixColor: MARIGOLD, text: "Création de components/ThemeToggle.tsx", color: PAPER },
  { at: 192, prefix: "●", prefixColor: MARIGOLD, text: "npm test", color: PAPER },
];

function Cursor({ frame }: { frame: number }) {
  return <span style={{ opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0, color: MARIGOLD }}>▍</span>;
}

export function ClaudeCodeDemo() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fondu d'entrée et de sortie pour une boucle propre
  const fade = interpolate(frame, [0, 8, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });

  const typed = Math.max(0, Math.min(PROMPT.length, Math.floor((frame - 12) * 1.3)));
  const testsAt = 205;
  const testProgress = interpolate(frame, [testsAt, testsAt + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const doneAt = testsAt + 48;
  const done = spring({ frame: frame - doneAt, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center", opacity: fade }}>
      <div
        style={{
          width: "94%",
          height: "90%",
          background: INK,
          borderRadius: 18,
          border: "2px solid #2b2119",
          boxShadow: "10px 10px 0 #fbe3a8",
          transform: `translateY(${(1 - pop) * 20}px)`,
          overflow: "hidden",
          fontFamily: MONO,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Barre de fenêtre */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderBottom: "1px solid #3d3229" }}>
          {["#e0816b", "#e8b45a", "#8cbf98"].map((c) => (
            <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
          ))}
          <span style={{ marginLeft: 12, color: MUTED, fontSize: 16 }}>~/mon-site — claude</span>
        </div>

        <div style={{ padding: "20px 24px", fontSize: 24, lineHeight: 1.6, color: PAPER, flex: 1 }}>
          {/* Demande */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ color: MARIGOLD }}>&gt; </span>
            {PROMPT.slice(0, typed)}
            {typed < PROMPT.length && <Cursor frame={frame} />}
          </div>

          {LINES.map((l) => {
            const p = interpolate(frame, [l.at, l.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            if (p <= 0) return null;
            return (
              <div key={l.at} style={{ opacity: p, transform: `translateX(${(1 - p) * -12}px)`, whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis" }}>
                <span style={{ color: l.prefixColor }}>{l.prefix} </span>
                <span style={{ color: l.color }}>{l.text}</span>
              </div>
            );
          })}

          {/* Barre de progression des tests */}
          {frame >= testsAt && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
              <span style={{ color: MUTED }}>  ⎿</span>
              <div style={{ width: 200, height: 10, borderRadius: 99, background: "#3d3229", overflow: "hidden" }}>
                <div style={{ width: `${testProgress * 100}%`, height: "100%", background: GREEN }} />
              </div>
              <span style={{ color: testProgress >= 1 ? GREEN : MUTED }}>{Math.round(testProgress * 48)} / 48 tests</span>
            </div>
          )}

          {frame >= doneAt && (
            <div
              style={{
                marginTop: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                borderRadius: 10,
                background: "#2f5d46",
                color: "#fffcf7",
                transform: `scale(${0.85 + done * 0.15})`,
                opacity: Math.min(1, done * 1.5),
                transformOrigin: "left center",
              }}
            >
              ✓ Terminé : 48 tests réussis
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
}
