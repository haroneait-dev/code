// Vidéo verticale « 3 astuces Claude Code » (1080x1920), pour TikTok, Reels et Shorts.

import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { body, display, loadLocalFonts, mono } from "./fonts";

loadLocalFonts();

const PAPER = "#fbf6ee";
const INK = "#2b2119";
const GREEN = "#2f5d46";
const MARK = "#fbe3a8";

function Rise({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16 } });
  return <div style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 60}px)` }}>{children}</div>;
}

function Mark({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 14], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span style={{ backgroundImage: `linear-gradient(${MARK}, ${MARK})`, backgroundSize: `${w}% 42%`, backgroundPosition: "0 88%", backgroundRepeat: "no-repeat", padding: "0 8px" }}>
      {children}
    </span>
  );
}

function Tip({ n, title, text, code }: { n: number; title: string; text: string; code: string }) {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [140, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "0 90px", justifyContent: "center", opacity: out }}>
      <Rise>
        <div style={{ fontFamily: display, fontSize: 260, color: "#f2b23e", lineHeight: 0.9 }}>{n}</div>
      </Rise>
      <Rise delay={6}>
        <div style={{ fontFamily: display, fontSize: 104, color: INK, lineHeight: 1.02, letterSpacing: -2, marginTop: 20 }}>
          <Mark delay={18}>{title}</Mark>
        </div>
      </Rise>
      <Rise delay={14}>
        <div style={{ fontFamily: body, fontWeight: 500, fontSize: 50, color: "#66574a", lineHeight: 1.35, marginTop: 44 }}>{text}</div>
      </Rise>
      <Rise delay={24}>
        <div style={{ marginTop: 56, alignSelf: "flex-start", fontFamily: mono, fontSize: 44, color: PAPER, background: INK, borderRadius: 18, padding: "26px 34px", boxShadow: `10px 10px 0 ${MARK}` }}>
          {code}
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

export function TikTokAstuces() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {/* Barre de progression en haut, utile sur les vidéos courtes */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 14, width: `${progress * 100}%`, background: GREEN }} />

      <Sequence durationInFrames={90}>
        <AbsoluteFill style={{ padding: "0 90px", justifyContent: "center" }}>
          <Rise>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 44, color: GREEN, letterSpacing: 2 }}>CLAUDE CODE</div>
          </Rise>
          <Rise delay={6}>
            <div style={{ fontFamily: display, fontSize: 150, color: INK, lineHeight: 0.98, letterSpacing: -4, marginTop: 24 }}>
              3 astuces que les <Mark delay={22}>pros</Mark> utilisent
            </div>
          </Rise>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <Tip n={1} title="Donnez-lui un moyen de vérifier" text="Des tests, un linter, une capture : Claude corrige jusqu'à ce que ça passe." code="… puis lance npm test" />
      </Sequence>
      <Sequence from={240} durationInFrames={150}>
        <Tip n={2} title="Le plan avant le code" text="Il explore et propose un plan sans rien modifier. Vous corrigez, puis il exécute." code="Shift + Tab → plan" />
      </Sequence>
      <Sequence from={390} durationInFrames={150}>
        <Tip n={3} title="Un CLAUDE.md court et vivant" text="Commandes, conventions, pièges. Une ligne de plus à chaque erreur répétée." code="/init" />
      </Sequence>
      <Sequence from={510}>
        <AbsoluteFill style={{ background: GREEN, justifyContent: "center", alignItems: "center", padding: 90 }}>
          <Rise>
            <div style={{ fontFamily: display, fontSize: 96, color: PAPER, textAlign: "center", lineHeight: 1.05 }}>Les 30 astuces sont sur le site</div>
          </Rise>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
