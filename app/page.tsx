"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { curriculum, totalLessons, type Lesson, type Module } from "@/lib/curriculum";
import { exercisesByLesson } from "@/lib/exercises";

// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────
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
// CODE BLOCK
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
          onClick={() => copyToClipboard(code, () => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
        >
          {copied ? "✓ Copié" : "Copier"}
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
              <th key={i} className="text-left py-2 px-3 border-b border-[var(--border)] text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-[var(--bg-hover)] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="py-2 px-3 border-b border-[var(--border)] text-[var(--text-dim)]"
                  dangerouslySetInnerHTML={{
                    __html: ci === 0
                      ? `<code style="font-family:'JetBrains Mono',monospace;font-size:0.8em;color:#9f67ff">${cell}</code>`
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
    <ul className="my-3 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[var(--text-dim)] text-sm leading-relaxed">
          <span className="text-[var(--accent)] mt-0.5 flex-shrink-0 text-xs">▸</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

// ────────────────────────────────────────────────
// EXERCISE CARD — professional task style
// ────────────────────────────────────────────────
const LEVEL_META: Record<string, { label: string; color: string }> = {
  "débutant":      { label: "Débutant",      color: "#4ade80" },
  "intermédiaire": { label: "Intermédiaire", color: "#fb923c" },
  "avancé":        { label: "Avancé",        color: "#a78bfa" },
};

function ExerciseCard({ ex, index }: {
  ex: { level: string; icon: string; title: string; description: string; hint: string };
  index: number;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const [done, setDone] = useState(false);
  const meta = LEVEL_META[ex.level] ?? LEVEL_META["débutant"];

  return (
    <div style={{
      display: "flex",
      gap: "1rem",
      padding: "1rem 1.25rem",
      background: done ? "rgba(34,197,94,0.04)" : "var(--bg-card)",
      border: `1px solid ${done ? "rgba(34,197,94,0.2)" : "var(--border)"}`,
      borderRadius: "8px",
      transition: "all 0.15s",
    }}>
      {/* Checkbox */}
      <button
        onClick={() => setDone(v => !v)}
        style={{
          flexShrink: 0,
          width: "20px", height: "20px",
          borderRadius: "4px",
          border: `1.5px solid ${done ? "#22c55e" : "var(--border)"}`,
          background: done ? "#22c55e" : "transparent",
          color: "#fff",
          fontSize: "0.7rem",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: "1px",
          transition: "all 0.15s",
        }}
      >{done ? "✓" : ""}</button>

      <div style={{ flex: 1 }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: meta.color }}>
            {index + 1}. {ex.title}
          </span>
          <span style={{
            fontSize: "0.65rem",
            color: meta.color,
            background: `${meta.color}15`,
            border: `1px solid ${meta.color}30`,
            borderRadius: "4px",
            padding: "0.1rem 0.4rem",
            fontWeight: 600,
          }}>{meta.label}</span>
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
          {ex.description}
        </p>

        <button
          onClick={() => setHintOpen(v => !v)}
          style={{ marginTop: "0.5rem", background: "none", border: "none", color: "var(--accent)", fontSize: "0.72rem", cursor: "pointer", padding: 0 }}
        >
          {hintOpen ? "▾ Masquer l'indice" : "▸ Voir l'indice"}
        </button>

        {hintOpen && (
          <div style={{
            marginTop: "0.4rem",
            padding: "0.5rem 0.75rem",
            background: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(124,58,237,0.15)",
            borderRadius: "6px",
            fontSize: "0.78rem",
            color: "#a78bfa",
            lineHeight: 1.6,
          }}>
            {ex.hint}
          </div>
        )}
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
    <div className="fade-in" style={{ maxWidth: "760px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{mod.emoji} {mod.title}</span>
        <span style={{ color: "var(--border)", fontSize: "0.75rem" }}>/</span>
        {lesson.tag && (
          <>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", padding: "0.1rem 0.5rem", borderRadius: "4px" }}>{lesson.tag}</span>
            <span style={{ color: "var(--border)", fontSize: "0.75rem" }}>/</span>
          </>
        )}
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{lesson.duration}</span>
      </div>

      {/* Title */}
      <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
        {lesson.title}
      </h1>
      <p style={{ color: "var(--text-dim)", fontSize: "1rem", lineHeight: 1.75, marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
        {lesson.intro}
      </p>

      {/* Content sections */}
      <div className="prose">
        {lesson.sections.map((section, i) => (
          <div key={i}>
            {section.heading && <h2>{section.heading}</h2>}
            {section.body && <p>{section.body}</p>}
            {section.bullets && <BulletList items={section.bullets} />}
            {section.code && <CodeBlock lang={section.code.lang} code={section.code.code} label={section.code.label} />}
            {section.callout && <Callout type={section.callout.type} icon={section.callout.icon} text={section.callout.text} />}
            {section.table && <Table headers={section.table.headers} rows={section.table.rows} />}
            {section.keypoints && (
              <div style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "8px", padding: "1rem 1.25rem", margin: "1rem 0" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Points clés</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {section.keypoints.map((kp, ki) => (
                    <li key={ki} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-dim)" }}>
                      <span style={{ color: "var(--accent)", flexShrink: 0 }}>✦</span> {kp}
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
        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              Exercices pratiques · {exercises.length} exercices
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {exercises.map((ex, i) => <ExerciseCard key={i} ex={ex} index={i} />)}
          </div>
        </div>
      )}

      {/* Complete button */}
      <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onComplete}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.6rem 1.25rem",
            borderRadius: "6px",
            border: isCompleted ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--accent)",
            background: isCompleted ? "rgba(34,197,94,0.08)" : "var(--accent)",
            color: isCompleted ? "#4ade80" : "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: isCompleted ? "default" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {isCompleted ? "✓ Leçon complétée" : "Marquer comme terminée"}
        </button>
        {isCompleted && (
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Passez à la leçon suivante →
          </span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// HOMEPAGE — professional course overview
// ────────────────────────────────────────────────
function HomePage({ onStart, onSelect, completed }: {
  onStart: () => void;
  onSelect: (modId: string, lessonId: string) => void;
  completed: number;
}) {
  const pct = Math.round((completed / totalLessons) * 100);

  return (
    <div className="fade-in" style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2.5rem 5rem" }}>

      {/* ── HEADER ──────────────────────────────── */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
              Formation complète · 4 heures
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: "1rem" }}>
              Maîtriser Claude Code
            </h1>
            <p style={{ color: "var(--text-dim)", fontSize: "1rem", lineHeight: 1.75, maxWidth: "520px", marginBottom: "1.5rem" }}>
              De la première commande aux workflows multi-agents avancés. Une formation structurée qui couvre l&apos;intégralité de Claude Code — des fondamentaux à la maîtrise réelle.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[
                { value: `${totalLessons}`, label: "leçons" },
                { value: `${curriculum.length}`, label: "modules" },
                { value: "50+", label: "exercices" },
                { value: "4h", label: "de contenu" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div style={{
            width: "220px",
            flexShrink: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "1.25rem",
          }}>
            {completed > 0 ? (
              <>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Votre progression</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{pct}%</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>{completed}/{totalLessons} leçons terminées</div>
                <div style={{ height: "4px", background: "var(--bg-hover)", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
                  <div className="progress-bar-fill" style={{ height: "100%", width: `${pct}%`, borderRadius: "4px" }} />
                </div>
              </>
            ) : (
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
                Progression sauvegardée automatiquement dans votre navigateur.
              </div>
            )}
            <button
              onClick={onStart}
              style={{
                width: "100%",
                padding: "0.65rem",
                background: "var(--accent)",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {completed > 0 ? "Continuer →" : "Commencer →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── WHAT YOU WILL MASTER ─────────────────── */}
      <div style={{ marginBottom: "3rem", padding: "1.75rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px" }}>
        <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
          Ce que vous allez maîtriser
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.6rem" }}>
          {[
            "Rédiger un CLAUDE.md qui transforme Claude en expert de votre codebase",
            "Configurer des serveurs MCP (GitHub, filesystem, bases de données)",
            "Créer des hooks pour automatiser vos workflows de développement",
            "Passer du mode 'chat' au mode 'délégation' — la vraie différence d'échelle",
            "Gérer la fenêtre de contexte et éviter les dérives coûteuses",
            "Orchestrer des agents en parallèle pour des tâches complexes",
            "Utiliser la mémoire persistante entre les sessions de travail",
            "Intégrer Claude Code dans vos pipelines CI/CD",
            "Optimiser les coûts et itérer sans gaspiller des tokens",
            "Déboguer efficacement avec les outils de diagnostic intégrés",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.5, alignItems: "flex-start" }}>
              <span style={{ color: "var(--accent)", flexShrink: 0, fontSize: "0.75rem", marginTop: "0.15rem" }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── CURRICULUM ───────────────────────────── */}
      <div>
        <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
          Programme — {curriculum.length} modules
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {curriculum.map((mod, idx) => (
            <ModuleRow key={mod.id} mod={mod} idx={idx} completed={completed} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModuleRow({ mod, idx, completed, onSelect }: {
  mod: Module;
  idx: number;
  completed: number;
  onSelect: (modId: string, lessonId: string) => void;
}) {
  const [open, setOpen] = useState(idx === 0);
  const totalEx = mod.lessons.reduce((a, l) => a + (exercisesByLesson[l.id]?.length ?? 0), 0);

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      {/* Module header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.875rem 1rem",
          background: open ? "var(--bg-card)" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
      >
        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", width: "24px", flexShrink: 0, textAlign: "center" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: "1rem", flexShrink: 0 }}>{mod.emoji}</span>
        <span style={{ flex: 1, fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>{mod.title}</span>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0 }}>
          {mod.lessons.length} leçons · {totalEx} exercices
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", transition: "transform 0.15s", transform: open ? "rotate(90deg)" : "none", flexShrink: 0 }}>›</span>
      </button>

      {/* Lesson list */}
      {open && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {mod.lessons.map((lesson, li) => (
            <button
              key={lesson.id}
              onClick={() => onSelect(mod.id, lesson.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 1rem 0.6rem 2.75rem",
                background: "transparent",
                border: "none",
                borderBottom: li < mod.lessons.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", width: "20px", flexShrink: 0 }}>{String(li + 1).padStart(2, "0")}</span>
              <span style={{ flex: 1, fontSize: "0.825rem", color: "var(--text-dim)" }}>{lesson.title}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>{lesson.duration}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// SIDEBAR
// ────────────────────────────────────────────────
function Sidebar({
  currentModuleId,
  currentLessonId,
  completedSet,
  onSelect,
  onHome,
  collapsed,
  onToggle,
}: {
  currentModuleId: string;
  currentLessonId: string;
  completedSet: Set<string>;
  onSelect: (modId: string, lessonId: string) => void;
  onHome: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set([currentModuleId])
  );

  useEffect(() => {
    setExpandedModules(prev => new Set([...prev, currentModuleId]));
  }, [currentModuleId]);

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId); else next.add(modId);
      return next;
    });
  };

  const completedCount = completedSet.size;
  const pct = Math.round((completedCount / totalLessons) * 100);

  return (
    <aside style={{
      width: collapsed ? "48px" : "256px",
      minWidth: collapsed ? "48px" : "256px",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid var(--border)",
      background: "var(--bg-surface)",
      transition: "width 0.2s, min-width 0.2s",
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.75rem", height: "52px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {!collapsed && (
          <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ width: "22px", height: "22px", borderRadius: "5px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#fff", fontWeight: 800, flexShrink: 0 }}>C</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>Claude Code</span>
          </button>
        )}
        <button
          onClick={onToggle}
          style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.85rem", marginLeft: collapsed ? "auto" : "0", flexShrink: 0 }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Progress */}
          <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              <span>Progression</span>
              <span>{completedCount} / {totalLessons}</span>
            </div>
            <div style={{ height: "3px", background: "var(--bg-hover)", borderRadius: "3px", overflow: "hidden" }}>
              <div className="progress-bar-fill" style={{ height: "100%", width: `${pct}%`, borderRadius: "3px" }} />
            </div>
          </div>

          {/* Modules */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "0.375rem 0" }}>
            {curriculum.map(mod => {
              const isExpanded = expandedModules.has(mod.id);
              const modCompleted = mod.lessons.filter(l => completedSet.has(`${mod.id}:${l.id}`)).length;

              return (
                <div key={mod.id}>
                  <button
                    onClick={() => toggleModule(mod.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <span style={{ fontSize: "0.85rem", flexShrink: 0 }}>{mod.emoji}</span>
                    <span style={{ flex: 1, fontSize: "0.72rem", fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {mod.title}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", flexShrink: 0 }}>{modCompleted}/{mod.lessons.length}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "none", flexShrink: 0 }}>›</span>
                  </button>

                  {isExpanded && (
                    <div>
                      {mod.lessons.map(lesson => {
                        const key = `${mod.id}:${lesson.id}`;
                        const isActive = currentModuleId === mod.id && currentLessonId === lesson.id;
                        const isDone = completedSet.has(key);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelect(mod.id, lesson.id)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              padding: "0.4rem 0.75rem 0.4rem 1.875rem",
                              background: isActive ? "var(--accent-dim)" : "none",
                              borderTop: "none",
                              borderRight: "none",
                              borderBottom: "none",
                              borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background 0.1s",
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-hover)"; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
                          >
                            <span style={{
                              width: "14px", height: "14px",
                              borderRadius: "3px",
                              border: `1.5px solid ${isDone ? "#22c55e" : isActive ? "var(--accent)" : "var(--border)"}`,
                              background: isDone ? "#22c55e" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                              fontSize: "0.55rem",
                              color: "#fff",
                            }}>
                              {isDone ? "✓" : ""}
                            </span>
                            <span style={{
                              fontSize: "0.75rem",
                              color: isActive ? "#fff" : "var(--text-muted)",
                              fontWeight: isActive ? 500 : 400,
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}>
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
        <nav style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
          {curriculum.map(mod => (
            <button
              key={mod.id}
              onClick={() => { onToggle(); setTimeout(() => setExpandedModules(new Set([mod.id])), 50); }}
              title={mod.title}
              style={{
                width: "30px", height: "30px",
                borderRadius: "6px",
                border: "none",
                background: currentModuleId === mod.id ? "var(--accent-dim)" : "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
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
// TOP BAR
// ────────────────────────────────────────────────
function TopBar({ lesson, mod, onHome, onPrev, onNext, hasPrev, hasNext }: {
  lesson: Lesson | null;
  mod: Module | null;
  onHome: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  return (
    <header style={{
      height: "52px",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0 1.25rem",
      borderBottom: "1px solid var(--border)",
      background: "var(--bg-surface)",
      flexShrink: 0,
    }}>
      <button
        onClick={onHome}
        style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer", padding: "0.25rem 0.5rem", borderRadius: "4px", transition: "color 0.1s" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        ← Accueil
      </button>

      {lesson && mod && (
        <>
          <span style={{ color: "var(--border)", fontSize: "0.75rem" }}>/</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{mod.emoji} {mod.title}</span>
          <span style={{ color: "var(--border)", fontSize: "0.75rem" }}>/</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lesson.title}
          </span>
        </>
      )}

      <div style={{ display: "flex", gap: "0.375rem", marginLeft: "auto", flexShrink: 0 }}>
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="lesson-nav-btn"
          style={{ padding: "0.3rem 0.7rem", fontSize: "0.775rem", opacity: hasPrev ? 1 : 0.3 }}
        >
          ← Préc.
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="lesson-nav-btn primary"
          style={{ padding: "0.3rem 0.7rem", fontSize: "0.775rem", opacity: hasNext ? 1 : 0.3 }}
        >
          Suiv. →
        </button>
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cc_progress");
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const saveProgress = useCallback((newSet: Set<string>) => {
    try { localStorage.setItem("cc_progress", JSON.stringify([...newSet])); } catch {}
  }, []);

  const currentMod = curriculum.find(m => m.id === currentModuleId) ?? curriculum[0];
  const currentLesson = currentMod.lessons.find(l => l.id === currentLessonId) ?? currentMod.lessons[0];

  const allLessons = curriculum.flatMap(mod => mod.lessons.map(l => ({ modId: mod.id, lessonId: l.id })));
  const currentIndex = allLessons.findIndex(x => x.modId === currentModuleId && x.lessonId === currentLessonId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const goToLesson = useCallback((modId: string, lessonId: string) => {
    setCurrentModuleId(modId);
    setCurrentLessonId(lessonId);
    setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, []);

  const goPrev = useCallback(() => { if (hasPrev) { const p = allLessons[currentIndex - 1]; goToLesson(p.modId, p.lessonId); } }, [hasPrev, currentIndex, allLessons, goToLesson]);
  const goNext = useCallback(() => { if (hasNext) { const n = allLessons[currentIndex + 1]; goToLesson(n.modId, n.lessonId); } }, [hasNext, currentIndex, allLessons, goToLesson]);

  const markComplete = useCallback(() => {
    const key = `${currentModuleId}:${currentLessonId}`;
    setCompleted(prev => { const next = new Set(prev); next.add(key); saveProgress(next); return next; });
  }, [currentModuleId, currentLessonId, saveProgress]);

  const handleStart = useCallback(() => {
    for (const { modId, lessonId } of allLessons) {
      if (!completed.has(`${modId}:${lessonId}`)) { goToLesson(modId, lessonId); return; }
    }
    goToLesson(allLessons[0].modId, allLessons[0].lessonId);
  }, [allLessons, completed, goToLesson]);

  return (
    <main style={{ height: "100vh", overflow: "hidden", display: "flex", background: "var(--bg-dark)" }}>
      <Sidebar
        currentModuleId={currentModuleId}
        currentLessonId={currentLessonId}
        completedSet={completed}
        onSelect={goToLesson}
        onHome={() => setView("home")}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {view === "lesson" && (
          <TopBar
            lesson={currentLesson}
            mod={currentMod}
            onHome={() => setView("home")}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        )}

        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", background: "var(--bg-dark)" }}>
          {view === "home" ? (
            <HomePage onStart={handleStart} onSelect={goToLesson} completed={completed.size} />
          ) : (
            <div style={{ padding: "2.5rem 3rem" }}>
              <LessonContent
                lesson={currentLesson}
                mod={currentMod}
                onComplete={markComplete}
                isCompleted={completed.has(`${currentModuleId}:${currentLessonId}`)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", maxWidth: "760px" }}>
                <button onClick={goPrev} disabled={!hasPrev} className="lesson-nav-btn" style={{ opacity: hasPrev ? 1 : 0.3 }}>
                  ← Leçon précédente
                </button>
                <button onClick={goNext} disabled={!hasNext} className="lesson-nav-btn primary" style={{ opacity: hasNext ? 1 : 0.3 }}>
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
