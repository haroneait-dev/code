// Gabarit des vidéos TikTok (1080x1920) : accroche, 3 points, fin.
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { body, display, loadLocalFonts, mono } from "./fonts";
import type { Point, Video } from "./videos";

loadLocalFonts();

const PAPER = "#fbf6ee";
const INK = "#2b2119";
const GREEN = "#2f5d46";
const MARK = "#fbe3a8";
const MARIGOLD = "#f2b23e";
export const HOOK = 90;
export const POINT = 150;
export const OUTRO = 90;
export const TIKTOK_FRAMES = HOOK + 3 * POINT + OUTRO;

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

function PointScene({ n, p }: { n: number; p: Point }) {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [POINT - 10, POINT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pop = spring({ frame: frame - 2, fps: 30, config: { damping: 9, stiffness: 160 } });
  return (
    <AbsoluteFill style={{ padding: "0 90px 260px", justifyContent: "center", opacity: out }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ width: 150, height: 150, borderRadius: 999, background: GREEN, color: PAPER, fontFamily: display, fontSize: 96, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop}) rotate(-6deg)`, border: `8px solid ${MARIGOLD}` }}>
          {n}
        </div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 40, color: "#66574a" }}>{n} / 3</div>
      </div>
      <Rise delay={6}>
        <div style={{ fontFamily: display, fontSize: 108, color: INK, lineHeight: 1.02, letterSpacing: -2, marginTop: 40 }}>
          <Mark delay={18}>{p.title}</Mark>
        </div>
      </Rise>
      <Rise delay={14}>
        <div style={{ fontFamily: body, fontWeight: 500, fontSize: 52, color: "#66574a", lineHeight: 1.35, marginTop: 40 }}>{p.text}</div>
      </Rise>
      {p.code ? (
        <Rise delay={24}>
          <div style={{ marginTop: 56, display: "inline-block", fontFamily: mono, fontSize: 46, color: PAPER, background: INK, borderRadius: 18, padding: "26px 34px", boxShadow: `10px 10px 0 ${MARK}` }}>
            {p.code}
          </div>
        </Rise>
      ) : null}
    </AbsoluteFill>
  );
}

export function TikTokVideo({ video }: { video: Video }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [a, b, c] = video.hook;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: 14, width: `${(frame / durationInFrames) * 100}%`, background: GREEN }} />
      <Sequence durationInFrames={HOOK}>
        <AbsoluteFill style={{ padding: "0 90px 200px", justifyContent: "center" }}>
          <Rise>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 44, color: GREEN, letterSpacing: 2 }}>{video.kicker}</div>
          </Rise>
          <Rise delay={6}>
            <div style={{ fontFamily: display, fontSize: 150, color: INK, lineHeight: 0.98, letterSpacing: -4, marginTop: 24 }}>
              {a}
              <Mark delay={22}>{b}</Mark>
              {c}
            </div>
          </Rise>
        </AbsoluteFill>
      </Sequence>
      {video.points.map((p, i) => (
        <Sequence key={i} from={HOOK + i * POINT} durationInFrames={POINT}>
          <PointScene n={i + 1} p={p} />
        </Sequence>
      ))}
      <Sequence from={HOOK + 3 * POINT}>
        <AbsoluteFill style={{ background: GREEN, justifyContent: "center", alignItems: "center", padding: "0 90px 200px" }}>
          <Rise>
            <div style={{ fontFamily: display, fontSize: 100, color: PAPER, textAlign: "center", lineHeight: 1.05 }}>{video.outro}</div>
          </Rise>
          <Rise delay={10}>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 48, color: MARK, textAlign: "center", marginTop: 40 }}>Gratuit, en français · lien en bio</div>
          </Rise>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
