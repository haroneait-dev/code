"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { curriculum, totalLessons, type Lesson, type Module } from "@/lib/curriculum";
import { exercisesByLesson } from "@/lib/exercises";
import { createClient } from "@/lib/supabase/client";

// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────
function getCopyIcon(copied: boolean) {
  return copied ? "✓ Copié" : "Copier";
}

function copyToClipboard(text: string, cb: () => void) {
  navigator.clipboard.writeText(text).then(cb);
}

function highlightCode(code: string, lang: string): string {
  if (lang === "json") {
    return code
      .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="tok-kw">$1</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="tok-str">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="tok-num">$1</span>')
      .replace(/\/\/.*/g, '<span class="tok-comment">$&</span>');
  }
  if (lang === "bash" || lang === "sh") {
    return code
      .replace(/^(#.*)$/gm, '<span class="tok-comment">$1</span>')
      .replace(/\b(npm|pnpm|yarn|git|npx|claude|curl|kill|echo|export|cd|ls)\b/g, '<span class="tok-cmd">$1</span>')
      .replace(/(--[\w-]+|-[a-zA-Z])\b/g, '<span class="tok-flag">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="tok-str">$1</span>');
  }
  if (lang === "typescript" || lang === "ts") {
    return code
      .replace(/\/\/.*/g, '<span class="tok-comment">$&</span>')
      .replace(/\b(import|export|const|let|var|function|async|await|return|interface|type|from|new)\b/g, '<span class="tok-kw">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span class="tok-str">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
  }
  if (lang === "markdown") {
    return code
      .replace(/^(#{1,3}.*)$/gm, '<span class="tok-kw">$1</span>')
      .replace(/^(-.*)$/gm, '<span class="tok-cmd">$1</span>');
  }
  return code;
}

// ────────────────────────────────────────────────
// SUB-COMPONENTS
// ────────────────────────────────────────────────
function CodeBlock({ lang, code, label }: { lang: string; code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const highlighted = highlightCode(code, lang);
  return (
    <div className="code-block my-4">
      <div className="code-block-header">
        <span className="code-block-lang">{label || lang}</span>
        <button
          className="code-block-copy"
          onClick={() => copyToClipboard(code, () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })}
        >
          {getCopyIcon(copied)}
        </button>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  );
}

function Callout({ type, icon, text }: { type: string; icon: string; text: string }) {
  return (
    <div className={`callout callout-${type}`}>
      <span className="callout-icon">{icon}</span>
      <div className="callout-body" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left py-2 px-3 border-b border-[var(--border)] text-[var(--text)] font-semibold text-xs uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-[var(--bg-hover)] transition-colors">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="py-2 px-3 border-b border-[var(--border)] text-[var(--text-dim)]"
                  dangerouslySetInnerHTML={{
                    __html: ci === 0
                      ? `<code style="font-family: 'JetBrains Mono', monospace; font-size: 0.8em; color: #9f67ff;">${cell}</code>`
                      : cell,
                  }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="my-3 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-[var(--text-dim)] text-sm">
          <span className="text-[var(--purple-light)] mt-0.5 flex-shrink-0">▸</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

// ────────────────────────────────────────────────
// LESSON CONTENT RENDERER
// ────────────────────────────────────────────────
// ────────────────────────────────────────────────
// EXERCISE CARD
// ────────────────────────────────────────────────
function ExerciseCard({ ex, index }: { ex: { level: string; icon: string; title: string; description: string; hint: string }; index: number }) {
  const [hintOpen, setHintOpen] = useState(false);
  const [done, setDone] = useState(false);

  const levelStyle: Record<string, { bg: string; border: string; color: string }> = {
    "débutant":       { bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.25)",   color: "#4ade80" },
    "intermédiaire":  { bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.25)",  color: "#fb923c" },
    "avancé":         { bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   color: "#f87171" },
  };
  const ls = levelStyle[ex.level] ?? levelStyle["débutant"];

  return (
    <div style={{ background: done ? "rgba(34,197,94,0.05)" : "var(--bg-card)", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "var(--border)"}`, borderRadius: "12px", padding: "1.1rem 1.25rem", transition: "all 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem" }}>{ex.icon}</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", padding: "0.15rem 0.5rem", borderRadius: "999px", background: ls.bg, border: `1px solid ${ls.border}`, color: ls.color }}>
              {ex.level}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Exercice {index + 1}</span>
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: done ? "#4ade80" : "#fff", marginBottom: "0.4rem" }}>
            {done && "✓ "}{ex.title}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.65 }}>{ex.description}</div>

          <button
            onClick={() => setHintOpen(v => !v)}
            style={{ marginTop: "0.6rem", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            {hintOpen ? "▾" : "▸"} {hintOpen ? "Masquer l'indice" : "Voir l'indice"}
          </button>
          {hintOpen && (
            <div style={{ marginTop: "0.5rem", padding: "0.6rem 0.8rem", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#c4b5fd", fontStyle: "italic", lineHeight: 1.6 }}>
              💡 {ex.hint}
            </div>
          )}
        </div>
        <button
          onClick={() => setDone(v => !v)}
          style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "8px", border: `2px solid ${done ? "#22c55e" : "var(--border)"}`, background: done ? "#22c55e" : "transparent", color: "#fff", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
          title={done ? "Marquer comme non-fait" : "Marquer comme fait"}
        >
          {done ? "✓" : ""}
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// LESSON CONTENT
// ────────────────────────────────────────────────
function LessonContent({ lesson, mod, onComplete, isCompleted }: {
  lesson: Lesson;
  mod: Module;
  onComplete: () => void;
  isCompleted: boolean;
}) {
  const exercises = exercisesByLesson[lesson.id] ?? lesson.exercises ?? [];

  return (
    <div className="fade-in max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-purple">{mod.emoji} {mod.title}</span>
          {lesson.tag && <span className="badge badge-orange">{lesson.tag}</span>}
          <span className="text-xs text-[var(--text-muted)]">⏱ {lesson.duration}</span>
          {exercises.length > 0 && (
            <span className="badge badge-green">🎯 {exercises.length} exercices</span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3">{lesson.title}</h1>
        <p className="text-[var(--text-dim)] text-base leading-relaxed">{lesson.intro}</p>
      </div>

      {/* Content sections */}
      <div className="prose">
        {lesson.sections.map((section, i) => (
          <div key={i}>
            {section.heading && <h2>{section.heading}</h2>}
            {section.body && <p>{section.body}</p>}
            {section.bullets && <BulletList items={section.bullets} />}
            {section.code && (
              <CodeBlock lang={section.code.lang} code={section.code.code} label={section.code.label} />
            )}
            {section.callout && (
              <Callout type={section.callout.type} icon={section.callout.icon} text={section.callout.text} />
            )}
            {section.table && (
              <Table headers={section.table.headers} rows={section.table.rows} />
            )}
            {section.keypoints && (
              <div className="bg-[var(--purple-dim)] border border-[rgba(124,58,237,0.3)] rounded-lg p-4 my-4">
                <div className="text-xs font-semibold text-[var(--purple-light)] uppercase tracking-wider mb-2">Points clés</div>
                <ul className="space-y-1">
                  {section.keypoints.map((kp, ki) => (
                    <li key={ki} className="text-sm text-[var(--text-dim)] flex items-start gap-2">
                      <span className="text-[var(--purple-light)]">✦</span> {kp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Exercises */}
      {exercises.length > 0 && (
        <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🎯</span>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", margin: 0 }}>Exercices pratiques</h2>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>— ancre les concepts dans la réalité</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {exercises.map((ex, i) => <ExerciseCard key={i} ex={ex} index={i} />)}
          </div>
        </div>
      )}

      {/* Complete button */}
      <div className="mt-10 pt-6 border-t border-[var(--border)] flex items-center gap-3">
        <button
          onClick={onComplete}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            isCompleted
              ? "bg-[var(--green-dim)] border border-[rgba(34,197,94,0.3)] text-[#4ade80] cursor-default"
              : "bg-[var(--purple)] hover:bg-[#6d28d9] text-white border border-[var(--purple)]"
          }`}
        >
          {isCompleted ? <><span className="check-pop">✓</span> Leçon complétée</> : <>✓ Marquer comme complété</>}
        </button>
        {isCompleted && <span className="text-sm text-[var(--text-muted)]">Passez à la leçon suivante →</span>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// HOME / LANDING
// ────────────────────────────────────────────────
function HomePage({ onStart, completed }: { onStart: () => void; completed: number }) {
  const pct = Math.round((completed / totalLessons) * 100);
  const totalExercises = 50;

  return (
    <div className="fade-in" style={{ overflowX: "hidden" }}>
      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        {/* Glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse at top, rgba(124,58,237,0.25) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", top: "30%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "20%", right: "10%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />
        </div>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "999px", padding: "0.3rem 0.9rem", marginBottom: "1.75rem", fontSize: "0.78rem", fontWeight: 600, color: "#a78bfa" }}>
          <span>🔥</span> Formation basée sur la vidéo de 4h — de Zéro à Expert
        </div>

        {/* H1 */}
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
          <span style={{ color: "#fff", display: "block" }}>Passe de débutant</span>
          <span style={{ display: "block", background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            à expert Claude
          </span>
        </h1>

        <p style={{ color: "var(--text-dim)", fontSize: "1.1rem", maxWidth: "560px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          La formation complète pour maîtriser l&apos;IA la plus puissante de 2026.
          {" "}<strong style={{ color: "var(--text)" }}>{totalLessons} leçons</strong>, {totalExercises}+ exercices pratiques,
          {" "}zéro prérequis.
        </p>

        {/* Progress (returning user) */}
        {completed > 0 && (
          <div style={{ maxWidth: "380px", margin: "0 auto 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
              <span>🔄 Reprends là où tu t&apos;es arrêté</span>
              <span style={{ color: "#a78bfa", fontWeight: 600 }}>{pct}% — {completed}/{totalLessons}</span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface)", borderRadius: "999px", overflow: "hidden" }}>
              <div className="progress-bar-fill" style={{ height: "100%", width: `${pct}%`, borderRadius: "999px" }} />
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onStart}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2.2rem", background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.45)", transition: "transform 0.15s, box-shadow 0.15s", letterSpacing: "-0.01em" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(124,58,237,0.55)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(124,58,237,0.45)"; }}
        >
          {completed > 0 ? "Continuer la formation" : "Commencer gratuitement"} →
        </button>

        <p style={{ marginTop: "0.9rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
          Gratuit · Aucune inscription · Progression sauvegardée localement
        </p>
      </div>

      {/* ── CHATTER vs DÉLÉGUER ──────────────────────────── */}
      <div style={{ padding: "0 2rem 4rem", maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Le secret des experts</span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginTop: "0.4rem", letterSpacing: "-0.02em" }}>
            La plupart chatent. Les experts <span style={{ color: "#a855f7" }}>délèguent.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* Chat card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "rgba(239,68,68,0.5)" }} />
            <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>💬</div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Mode Débutant — Chatter</div>
            {["\"Écris-moi une fonction de tri\"", "Guide Claude étape par étape", "1 prompt = 1 action", "Résultat : un bout de code", "Gain : quelques minutes"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                <span style={{ color: "#f87171", flexShrink: 0 }}>✗</span> {t}
              </div>
            ))}
          </div>
          {/* Déléguer card */}
          <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))", border: "1px solid rgba(124,58,237,0.35)", borderRadius: "14px", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #7c3aed, #a855f7)" }} />
            <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🚀</div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Mode Expert — Déléguer</div>
            {["\"Implémente la feature auth complète\"", "Claude planifie et exécute seul", "1 prompt = 10-50 actions", "Résultat : feature complète + tests", "Gain : 2 à 4 heures"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: "0.35rem" }}>
                <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Cette formation t&apos;apprend à passer en mode <strong style={{ color: "var(--text)" }}>délégation</strong> dès la première leçon.
        </p>
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      <div style={{ padding: "2rem", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          {[
            { icon: "📚", value: `${totalLessons}`, label: "Leçons" },
            { icon: "⏱", value: "4h", label: "De contenu" },
            { icon: "🎯", value: `${totalExercises}+`, label: "Exercices" },
            { icon: "🚀", value: "0", label: "Prérequis" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODULES ──────────────────────────────────────── */}
      <div style={{ padding: "3.5rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Programme complet</span>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginTop: "0.4rem", letterSpacing: "-0.02em" }}>
            {curriculum.length} modules · Du zéro à l&apos;expert
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.875rem" }}>
          {curriculum.map((mod, idx) => {
            const modCompleted = mod.lessons.filter((l) => completed > 0).length;
            return (
              <div
                key={mod.id}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.25rem", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = mod.color + "66"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: mod.color, opacity: 0.7 }} />
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>{mod.emoji}</span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: mod.color, opacity: 0.9 }}>Module {idx + 1}</span>
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "0.35rem" }}>{mod.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {mod.lessons.length} leçon{mod.lessons.length > 1 ? "s" : ""} · {mod.lessons.reduce((a, l) => a + (exercisesByLesson[l.id]?.length ?? 0), 0)} exercices
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── EXERCICES CTA ─────────────────────────────────── */}
      <div style={{ padding: "0 2rem 3rem", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(249,115,22,0.08))", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "16px", padding: "2rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎯</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
            {totalExercices}+ exercices pratiques inclus
          </h3>
          <p style={{ color: "var(--text-dim)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Chaque leçon se termine par 3 exercices graduels — débutant, intermédiaire, avancé.
            La théorie sans pratique, ça ne sert à rien.
          </p>
          <button
            onClick={onStart}
            style={{ padding: "0.75rem 2rem", background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
          >
            {completed > 0 ? `Reprendre — ${pct}% complété →` : "Commencer maintenant →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const totalExercices = 50;

// ────────────────────────────────────────────────
// SIDEBAR
// ────────────────────────────────────────────────
function Sidebar({
  currentModuleId,
  currentLessonId,
  completedSet,
  onSelect,
  collapsed,
  onToggle,
}: {
  currentModuleId: string;
  currentLessonId: string;
  completedSet: Set<string>;
  onSelect: (modId: string, lessonId: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set([currentModuleId])
  );

  useEffect(() => {
    setExpandedModules((prev) => new Set([...prev, currentModuleId]));
  }, [currentModuleId]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  const completedCount = completedSet.size;
  const pct = Math.round((completedCount / totalLessons) * 100);

  return (
    <aside
      className="flex flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] transition-all duration-200 flex-shrink-0"
      style={{
        width: collapsed ? "52px" : "260px",
        minWidth: collapsed ? "52px" : "260px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-4 border-b border-[var(--border)]"
        style={{ minHeight: "60px" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              ◈
            </span>
            <span className="text-sm font-bold text-white whitespace-nowrap">Claude Code</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-hover)] transition-all flex-shrink-0"
          style={{ marginLeft: collapsed ? "auto" : "0" }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Progress */}
          <div className="px-3 py-3 border-b border-[var(--border)]">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
              <span>Progression</span>
              <span>{completedCount}/{totalLessons}</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
              <div className="progress-bar-fill h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Modules list */}
          <nav className="flex-1 overflow-y-auto py-2">
            {curriculum.map((mod) => {
              const isExpanded = expandedModules.has(mod.id);
              const modCompleted = mod.lessons.filter((l) =>
                completedSet.has(`${mod.id}:${l.id}`)
              ).length;

              return (
                <div key={mod.id}>
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="sidebar-item w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-[var(--bg-hover)] group"
                  >
                    <span className="text-base flex-shrink-0">{mod.emoji}</span>
                    <span className="flex-1 text-xs font-semibold text-[var(--text-dim)] group-hover:text-white uppercase tracking-wider truncate">
                      {mod.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {modCompleted}/{mod.lessons.length}
                    </span>
                    <span
                      className="text-xs text-[var(--text-muted)] transition-transform duration-150"
                      style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                    >
                      ›
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="pb-1">
                      {mod.lessons.map((lesson) => {
                        const key = `${mod.id}:${lesson.id}`;
                        const isActive = currentModuleId === mod.id && currentLessonId === lesson.id;
                        const isDone = completedSet.has(key);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelect(mod.id, lesson.id)}
                            className={`sidebar-item w-full flex items-center gap-2.5 pl-8 pr-3 py-2 text-left transition-all ${
                              isActive
                                ? "bg-[var(--purple-dim)] border-l-2 border-l-[var(--purple)]"
                                : "hover:bg-[var(--bg-hover)] border-l-2 border-l-transparent"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 border transition-all ${
                                isDone
                                  ? "bg-[var(--green)] border-[var(--green)] text-white"
                                  : isActive
                                  ? "border-[var(--purple-light)] text-[var(--purple-light)]"
                                  : "border-[var(--border)] text-[var(--text-muted)]"
                              }`}
                            >
                              {isDone ? "✓" : "○"}
                            </span>
                            <span
                              className={`text-xs leading-tight flex-1 ${
                                isActive
                                  ? "text-white font-medium"
                                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
                              }`}
                            >
                              {lesson.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </>
      )}

      {collapsed && (
        <nav className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-1">
          {curriculum.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                onToggle();
                setTimeout(() => {
                  setExpandedModules(new Set([mod.id]));
                }, 50);
              }}
              title={mod.title}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:bg-[var(--bg-hover)] ${
                currentModuleId === mod.id ? "bg-[var(--purple-dim)]" : ""
              }`}
            >
              {mod.emoji}
            </button>
          ))}
        </nav>
      )}
    </aside>
  );
}

// ────────────────────────────────────────────────
// TOP HEADER
// ────────────────────────────────────────────────
function TopBar({
  lesson,
  mod,
  onHome,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  userEmail,
  onLogout,
}: {
  lesson: Lesson | null;
  mod: Module | null;
  onHome: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  userEmail?: string;
  onLogout: () => void;
}) {
  return (
    <header
      className="flex items-center gap-3 px-5 border-b border-[var(--border)] flex-shrink-0"
      style={{ height: "56px", background: "var(--bg-surface)" }}
    >
      <button
        onClick={onHome}
        className="text-sm text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[var(--bg-hover)]"
      >
        ⌂ Accueil
      </button>

      {lesson && mod && (
        <>
          <span className="text-[var(--border)]">/</span>
          <span className="text-sm text-[var(--text-muted)]">
            {mod.emoji} {mod.title}
          </span>
          <span className="text-[var(--border)]">/</span>
          <span className="text-sm text-white font-medium truncate flex-1">
            {lesson.title}
          </span>
        </>
      )}

      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="lesson-nav-btn text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ padding: "0.35rem 0.7rem" }}
        >
          ← Préc.
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="lesson-nav-btn primary text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ padding: "0.35rem 0.7rem" }}
        >
          Suiv. →
        </button>
        {userEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.5rem", borderLeft: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userEmail}
            </span>
            <button
              onClick={onLogout}
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "6px", color: "#f87171", cursor: "pointer" }}
            >
              Déco.
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────
export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<"home" | "lesson">("home");
  const [currentModuleId, setCurrentModuleId] = useState(curriculum[0].id);
  const [currentLessonId, setCurrentLessonId] = useState(curriculum[0].lessons[0].id);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [userEmail, setUserEmail] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Load user + progress (client-side only)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
    try {
      const saved = localStorage.getItem("cc_progress");
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }, []);

  const saveProgress = useCallback((newSet: Set<string>) => {
    try {
      localStorage.setItem("cc_progress", JSON.stringify([...newSet]));
    } catch {}
  }, []);

  const currentMod = curriculum.find((m) => m.id === currentModuleId) ?? curriculum[0];
  const currentLesson = currentMod.lessons.find((l) => l.id === currentLessonId) ?? currentMod.lessons[0];

  // Flat list of all lessons for prev/next
  const allLessons: Array<{ modId: string; lessonId: string }> = curriculum.flatMap((mod) =>
    mod.lessons.map((l) => ({ modId: mod.id, lessonId: l.id }))
  );
  const currentIndex = allLessons.findIndex(
    (x) => x.modId === currentModuleId && x.lessonId === currentLessonId
  );
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const goToLesson = useCallback((modId: string, lessonId: string) => {
    setCurrentModuleId(modId);
    setCurrentLessonId(lessonId);
    setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, []);

  const goPrev = useCallback(() => {
    if (hasPrev) {
      const prev = allLessons[currentIndex - 1];
      goToLesson(prev.modId, prev.lessonId);
    }
  }, [hasPrev, currentIndex, allLessons, goToLesson]);

  const goNext = useCallback(() => {
    if (hasNext) {
      const next = allLessons[currentIndex + 1];
      goToLesson(next.modId, next.lessonId);
    }
  }, [hasNext, currentIndex, allLessons, goToLesson]);

  const markComplete = useCallback(() => {
    const key = `${currentModuleId}:${currentLessonId}`;
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(key);
      saveProgress(next);
      return next;
    });
  }, [currentModuleId, currentLessonId, saveProgress]);

  const isCompleted = completed.has(`${currentModuleId}:${currentLessonId}`);

  const handleStart = useCallback(() => {
    // Find first uncompleted lesson
    for (const { modId, lessonId } of allLessons) {
      if (!completed.has(`${modId}:${lessonId}`)) {
        goToLesson(modId, lessonId);
        return;
      }
    }
    goToLesson(allLessons[0].modId, allLessons[0].lessonId);
  }, [allLessons, completed, goToLesson]);

  return (
    <main
      className="flex"
      style={{ height: "100vh", overflow: "hidden", background: "var(--bg-dark)" }}
    >
      {/* Sidebar */}
      <Sidebar
        currentModuleId={currentModuleId}
        currentLessonId={currentLessonId}
        completedSet={completed}
        onSelect={goToLesson}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar — only in lesson view */}
        {view === "lesson" && (
          <TopBar
            lesson={currentLesson}
            mod={currentMod}
            onHome={() => setView("home")}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
            userEmail={userEmail}
            onLogout={handleLogout}
          />
        )}

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--bg-dark)" }}
        >
          {view === "home" ? (
            <HomePage onStart={handleStart} completed={completed.size} />
          ) : (
            <div className="px-10 py-10">
              <LessonContent
                lesson={currentLesson}
                mod={currentMod}
                onComplete={markComplete}
                isCompleted={isCompleted}
              />

              {/* Bottom navigation */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--border)] max-w-3xl">
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className="lesson-nav-btn disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Leçon précédente
                </button>
                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className="lesson-nav-btn primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Leçon suivante →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
