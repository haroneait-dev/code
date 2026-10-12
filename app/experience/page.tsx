"use client";

import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════════ */
type TermLineData = {
  text: string;
  type: "cmd" | "ok" | "err" | "dim" | "info" | "prompt" | "cursor" | "edit" | "stat" | "empty";
};

type SectionDef = {
  id: string;
  num: string;
  eyebrow: string;
  titleLines: string[];
  body: string | null;
  stats?: { value: string; label: string }[];
  cta?: { label: string; href: string };
};

type XForm = {
  rotY: number;
  rotX: number;
  scale: number;
  opacity: number;
  glowRGB: string;
  glowA: number;
};

/* ════════════════════════════════════════════════════════════════════════════
   TERMINAL CONTENT PER SECTION
══════════════════════════════════════════════════════════════════════════════ */
const TERM_LINES: TermLineData[][] = [
  // 0 — intro
  [
    { text: "$ claude", type: "cmd" },
    { text: "", type: "empty" },
    { text: "⬡  Claude Code  ready", type: "info" },
    { text: "", type: "empty" },
    { text: "→  Quel projet aujourd'hui ?", type: "prompt" },
    { text: "█", type: "cursor" },
  ],
  // 1 — intelligence
  [
    { text: "> claude analyse", type: "cmd" },
    { text: "", type: "empty" },
    { text: "  ✓  847 fichiers indexés", type: "ok" },
    { text: "  ✓  128 000 tokens chargés", type: "ok" },
    { text: "  ✓  Dépendances mappées", type: "ok" },
    { text: "  ✓  Patterns reconnus", type: "ok" },
    { text: "", type: "empty" },
    { text: "  Contexte complet. Prêt.", type: "info" },
  ],
  // 2 — précision
  [
    { text: "> claude refactore auth", type: "cmd" },
    { text: "", type: "empty" },
    { text: "  Reading app/auth/...", type: "dim" },
    { text: "  Reading lib/supabase.ts", type: "dim" },
    { text: "", type: "empty" },
    { text: "  ✎  app/auth/callback.ts", type: "edit" },
    { text: "  ✎  lib/supabase.ts", type: "edit" },
    { text: "", type: "empty" },
    { text: "  ✓  3 fichiers · types OK", type: "ok" },
  ],
  // 3 — autonomie
  [
    { text: "> claude test --fix-all", type: "cmd" },
    { text: "", type: "empty" },
    { text: "  ⟳  47 tests running...", type: "dim" },
    { text: "  ✗  3 échecs détectés", type: "err" },
    { text: "", type: "empty" },
    { text: "  ✎  fix: auth timeout", type: "edit" },
    { text: "  ✎  fix: mock supabase", type: "edit" },
    { text: "  ✎  fix: env variables", type: "edit" },
    { text: "", type: "empty" },
    { text: "  ✓  47/47 tests passent", type: "ok" },
  ],
  // 4 — chiffres
  [
    { text: "> claude metrics --all", type: "cmd" },
    { text: "", type: "empty" },
    { text: "  Vitesse       ×10", type: "stat" },
    { text: "  Fichiers      847", type: "stat" },
    { text: "  Contexte    200k", type: "stat" },
    { text: "  Config          0", type: "stat" },
  ],
  // 5 — cta
  [
    { text: "$ claude", type: "cmd" },
    { text: "", type: "empty" },
    { text: "⬡  Formation Claude Code", type: "info" },
    { text: "   8 modules · 40+ leçons", type: "dim" },
    { text: "", type: "empty" },
    { text: "→  Commencer maintenant", type: "prompt" },
    { text: "█", type: "cursor" },
  ],
];

/* ════════════════════════════════════════════════════════════════════════════
   3-D TRANSFORMS PER SECTION
══════════════════════════════════════════════════════════════════════════════ */
const XFORMS: XForm[] = [
  { rotY: 0,   rotX: 0,   scale: 0.92, opacity: 0.25, glowRGB: "0,60,200",   glowA: 0.08 },
  { rotY: -10, rotX: 5,   scale: 1,    opacity: 1,    glowRGB: "0,140,255",  glowA: 0.45 },
  { rotY: -16, rotX: 7,   scale: 1,    opacity: 1,    glowRGB: "0,200,255",  glowA: 0.4  },
  { rotY: -8,  rotX: 3,   scale: 1,    opacity: 1,    glowRGB: "120,80,255", glowA: 0.45 },
  { rotY: 6,   rotX: -2,  scale: 0.84, opacity: 1,    glowRGB: "220,160,0",  glowA: 0.35 },
  { rotY: 0,   rotX: 0,   scale: 0.9,  opacity: 1,    glowRGB: "200,200,255",glowA: 0.2  },
];

/* ════════════════════════════════════════════════════════════════════════════
   SECTIONS
══════════════════════════════════════════════════════════════════════════════ */
const SECTIONS: SectionDef[] = [
  {
    id: "intro",
    num: "01",
    eyebrow: "La formation ultime",
    titleLines: ["Claude", "Code"],
    body: "L'IA qui recode votre façon de travailler. Maîtrisez le CLI le plus puissant d'Anthropic.",
  },
  {
    id: "intelligence",
    num: "02",
    eyebrow: "Capacité",
    titleLines: ["Intelligence", "Contextuelle"],
    body: "200 000 tokens de contexte. Comprend votre codebase entière, vos patterns, vos conventions — instantanément.",
  },
  {
    id: "precision",
    num: "03",
    eyebrow: "Exécution",
    titleLines: ["Précision", "Chirurgicale"],
    body: "Modifie exactement ce qu'il faut, rien de plus. Respecte votre architecture, vos standards, vos préférences.",
  },
  {
    id: "autonomie",
    num: "04",
    eyebrow: "Workflow",
    titleLines: ["Autonomie", "Absolue"],
    body: "Exécute, teste, débogue, itère — en boucle continue. Vous intervenez quand vous le décidez.",
  },
  {
    id: "chiffres",
    num: "05",
    eyebrow: "Impact mesuré",
    titleLines: ["En", "Chiffres"],
    body: null,
    stats: [
      { value: "×10", label: "Vitesse de développement" },
      { value: "847", label: "Fichiers analysés en <2s" },
      { value: "200k", label: "Tokens de contexte" },
      { value: "0", label: "Configuration requise" },
    ],
  },
  {
    id: "formation",
    num: "06",
    eyebrow: "Commencer",
    titleLines: ["Votre", "Expérience"],
    body: "8 modules. 40+ leçons. De la prise en main à la maîtrise totale.",
    cta: { label: "Accéder à la formation", href: "/" },
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   STAR CANVAS
══════════════════════════════════════════════════════════════════════════════ */
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.0 + 0.1,
      a: Math.random() * 0.65 + 0.05,
      phase: Math.random() * Math.PI * 2,
      freq: 0.003 + Math.random() * 0.009,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const alpha = s.a * (0.35 + 0.65 * Math.sin(s.phase + t * s.freq));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,185,255,${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TERMINAL LINE
══════════════════════════════════════════════════════════════════════════════ */
const LINE_COLOR: Record<TermLineData["type"], string> = {
  cmd:    "#ffffff",
  ok:     "#50fa7b",
  err:    "#ff5555",
  dim:    "rgba(255,255,255,0.3)",
  info:   "#8be9fd",
  prompt: "#bd93f9",
  cursor: "#50fa7b",
  edit:   "#ffb86c",
  stat:   "#f1fa8c",
  empty:  "transparent",
};

function TermLine({ line, idx, active }: { line: TermLineData; idx: number; active: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), idx * 85 + 40);
    return () => clearTimeout(t);
  }, [idx, active]);

  return (
    <div
      style={{
        fontSize: 12.5,
        lineHeight: 1.9,
        color: LINE_COLOR[line.type],
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(4px)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        whiteSpace: "pre",
        minHeight: line.type === "empty" ? "0.75em" : undefined,
        letterSpacing: "0.01em",
      }}
    >
      {line.text}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TERMINAL WINDOW
══════════════════════════════════════════════════════════════════════════════ */
function Terminal({ sectionIdx }: { sectionIdx: number }) {
  const xf = XFORMS[sectionIdx];
  const lines = TERM_LINES[sectionIdx];
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, [sectionIdx]);

  const glow1 = `rgba(${xf.glowRGB},${xf.glowA})`;
  const glow2 = `rgba(${xf.glowRGB},${xf.glowA * 0.35})`;
  const glow3 = `rgba(${xf.glowRGB},${xf.glowA * 0.12})`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 clamp(20px, 4vw, 50px)",
        opacity: xf.opacity,
        transition: "opacity 0.9s ease",
      }}
    >
      {/* Nebula glow behind terminal */}
      <div
        style={{
          position: "absolute",
          inset: "10%",
          background: `radial-gradient(ellipse at 55% 50%, rgba(${xf.glowRGB},0.08) 0%, transparent 65%)`,
          transition: "background 0.9s ease",
          pointerEvents: "none",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "min(400px, 100%)",
          background: "linear-gradient(160deg, #0b0b16 0%, #07070f 100%)",
          border: "1px solid rgba(70,90,220,0.22)",
          borderRadius: 14,
          boxShadow: [
            `0 0 40px ${glow1}`,
            `0 0 90px ${glow2}`,
            `0 0 180px ${glow3}`,
            "0 30px 80px rgba(0,0,0,0.9)",
            "inset 0 1px 0 rgba(255,255,255,0.06)",
          ].join(", "),
          transform: `perspective(1000px) rotateY(${xf.rotY}deg) rotateX(${xf.rotX}deg) scale(${xf.scale})`,
          transition: [
            "transform 0.95s cubic-bezier(0.25,0.46,0.45,0.94)",
            "box-shadow 0.8s ease",
          ].join(", "),
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 16px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(70,90,220,0.15)",
          }}
        >
          {(["#ff5f57", "#febc2e", "#28c840"] as const).map((c, i) => (
            <div
              key={i}
              style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.75 }}
            />
          ))}
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 10.5,
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.07em",
            }}
          >
            claude-code — bash
          </span>
        </div>

        {/* Scanlines */}
        <div
          style={{
            position: "absolute",
            inset: "37px 0 0 0",
            background:
              "repeating-linear-gradient(transparent,transparent 3px,rgba(0,0,0,0.045) 3px,rgba(0,0,0,0.045) 4px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Lines */}
        <div style={{ position: "relative", padding: "18px 22px 24px", minHeight: 270 }}>
          {lines.map((line, i) => (
            <TermLine key={`${sectionIdx}-${i}`} line={line} idx={i} active={ready} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NAV DOTS
══════════════════════════════════════════════════════════════════════════════ */
function NavDots({
  active,
  onDotClick,
}: {
  active: number;
  onDotClick: (i: number) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 11,
        zIndex: 30,
      }}
    >
      {SECTIONS.map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          title={SECTIONS[i].eyebrow}
          style={{
            width: 5,
            height: i === active ? 22 : 5,
            borderRadius: 3,
            background:
              i === active
                ? "#ffffff"
                : "rgba(255,255,255,0.22)",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "height 0.35s ease, background 0.35s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION CONTENT
══════════════════════════════════════════════════════════════════════════════ */
function SectionContent({ section, active }: { section: SectionDef; active: boolean }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(28px, 7vw, 90px)",
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: active ? "rgba(80,160,255,0.9)" : "rgba(80,160,255,0)",
          marginBottom: 18,
          transition: "color 0.5s ease 0.1s",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {section.num} — {section.eyebrow}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "clamp(54px,7.5vw,100px)",
          fontWeight: 200,
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          color: "#ffffff",
          marginBottom: 28,
        }}
      >
        {section.titleLines.map((line, i) => (
          <div
            key={i}
            style={{
              overflow: "hidden",
            }}
          >
            <div
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "none" : "translateY(100%)",
                transition: `opacity 0.65s ease ${i * 0.1 + 0.2}s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.1 + 0.2}s`,
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      {section.body && (
        <p
          style={{
            fontSize: "clamp(15px,1.6vw,18px)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.42)",
            maxWidth: 420,
            opacity: active ? 1 : 0,
            transform: active ? "none" : "translateY(14px)",
            transition: "opacity 0.65s ease 0.42s, transform 0.65s ease 0.42s",
            fontWeight: 300,
          }}
        >
          {section.body}
        </p>
      )}

      {/* Stats grid */}
      {section.stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "36px 52px",
            maxWidth: 420,
            marginTop: 4,
          }}
        >
          {section.stats.map((stat, i) => (
            <div
              key={i}
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "none" : "translateY(18px)",
                transition: `opacity 0.65s ease ${i * 0.1 + 0.25}s, transform 0.65s ease ${i * 0.1 + 0.25}s`,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(40px,5.5vw,68px)",
                  fontWeight: 200,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {section.cta && (
        <div
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "none" : "translateY(14px)",
            transition: "opacity 0.65s ease 0.5s, transform 0.65s ease 0.5s",
            marginTop: 40,
          }}
        >
          <a
            href={section.cta.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 30px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 8,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: "0.06em",
              textDecoration: "none",
              transition: "border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.07)";
              el.style.borderColor = "rgba(255,255,255,0.75)";
              el.style.boxShadow = "0 0 30px rgba(255,255,255,0.07)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(255,255,255,0.35)";
              el.style.boxShadow = "none";
            }}
          >
            {section.cta.label}
            <span style={{ opacity: 0.6 }}>→</span>
          </a>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function ExperiencePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Override body overflow (globals.css sets overflow: hidden)
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // IntersectionObserver
  useEffect(() => {
    const observers = SECTIONS.map((_, i) => {
      const el = sectionRefs.current[i];
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(i); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });
    return () => { observers.forEach((o) => o?.disconnect()); };
  }, []);

  const scrollToSection = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  };

  const progressPct = ((activeIdx + 1) / SECTIONS.length) * 100;

  return (
    <div
      style={{
        background: "#000000",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* ── Fixed layers ─────────────────────────────── */}
      <StarCanvas />

      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          background: "rgba(255,255,255,0.07)",
          zIndex: 40,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPct}%`,
            background:
              "linear-gradient(90deg,rgba(0,120,255,0.9),rgba(120,80,255,0.9))",
            transition: "width 0.6s ease",
          }}
        />
      </div>

      {/* Section counter — top left */}
      <div
        style={{
          position: "fixed",
          top: 28,
          left: "clamp(28px, 6vw, 80px)",
          zIndex: 40,
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase",
        }}
      >
        {String(activeIdx + 1).padStart(2, "0")} / {SECTIONS.length}
      </div>

      {/* Nav dots */}
      <NavDots active={activeIdx} onDotClick={scrollToSection} />

      {/* Terminal — fixed right panel */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "clamp(280px,50vw,620px)",
          height: "100vh",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Terminal sectionIdx={activeIdx} />
      </div>

      {/* ── Scrollable text sections ────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "clamp(280px,50vw,660px)",
        }}
      >
        {SECTIONS.map((section, i) => (
          <div
            key={section.id}
            ref={(el) => { sectionRefs.current[i] = el; }}
          >
            <SectionContent section={section} active={activeIdx === i} />
          </div>
        ))}
      </div>

      {/* ── Scroll hint (visible only on intro) ─────── */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          left: "clamp(28px,6vw,80px)",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: activeIdx === 0 ? 0.45 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 1,
            height: 40,
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))",
            animation: "scrollPulse 1.8s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; transform: scaleY(0.8) translateY(4px); }
          50%      { opacity: 1;   transform: scaleY(1)   translateY(0);   }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; }
      `}</style>
    </div>
  );
}
