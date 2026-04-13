"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { curriculum, totalLessons, type Lesson, type Module } from "@/lib/curriculum";

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
function LessonContent({ lesson, mod, onComplete, isCompleted }: {
  lesson: Lesson;
  mod: Module;
  onComplete: () => void;
  isCompleted: boolean;
}) {
  return (
    <div className="fade-in max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-purple">{mod.emoji} {mod.title}</span>
          {lesson.tag && <span className="badge badge-orange">{lesson.tag}</span>}
          <span className="text-xs text-[var(--text-muted)]">⏱ {lesson.duration}</span>
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
              <CodeBlock
                lang={section.code.lang}
                code={section.code.code}
                label={section.code.label}
              />
            )}
            {section.callout && (
              <Callout
                type={section.callout.type}
                icon={section.callout.icon}
                text={section.callout.text}
              />
            )}
            {section.table && (
              <Table headers={section.table.headers} rows={section.table.rows} />
            )}
            {section.keypoints && (
              <div className="bg-[var(--purple-dim)] border border-[rgba(124,58,237,0.3)] rounded-lg p-4 my-4">
                <div className="text-xs font-semibold text-[var(--purple-light)] uppercase tracking-wider mb-2">
                  Points clés
                </div>
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
          {isCompleted ? (
            <>
              <span className="check-pop">✓</span> Leçon complétée
            </>
          ) : (
            <>✓ Marquer comme complété</>
          )}
        </button>
        {isCompleted && (
          <span className="text-sm text-[var(--text-muted)]">
            Passez à la leçon suivante →
          </span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// HOME / LANDING
// ────────────────────────────────────────────────
function HomePage({ onStart, completed }: { onStart: () => void; completed: number }) {
  const pct = Math.round((completed / totalLessons) * 100);
  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-full py-16 px-8 text-center">
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div className="relative mb-6">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-2 mx-auto"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
        >
          ◈
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
        Claude Code
      </h1>
      <p className="text-xl text-[var(--purple-light)] font-semibold mb-4">
        Formation Complète
      </p>
      <p className="text-[var(--text-dim)] max-w-xl text-base leading-relaxed mb-10">
        Maîtrisez Claude Code de A à Z — le CLI officiel d'Anthropic pour coder avec l'IA.
        {" "}
        <span className="text-[var(--text)]">{totalLessons} leçons</span> couvrant l'installation, les outils fichiers, Git, MCP, Hooks, la mémoire et les techniques avancées.
      </p>

      {/* Progress */}
      {completed > 0 && (
        <div className="w-full max-w-sm mb-8">
          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Progression</span>
            <span>{completed}/{totalLessons} leçons</span>
          </div>
          <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border)]">
            <div className="progress-bar-fill h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">{pct}% complété</p>
        </div>
      )}

      {/* Module cards */}
      <div className="grid grid-cols-2 gap-3 max-w-xl w-full mb-10">
        {curriculum.map((mod) => (
          <div
            key={mod.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-left"
          >
            <span className="text-2xl">{mod.emoji}</span>
            <div>
              <div className="text-sm font-semibold text-white">{mod.title}</div>
              <div className="text-xs text-[var(--text-muted)]">
                {mod.lessons.length} leçon{mod.lessons.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-8 py-3.5 rounded-xl font-bold text-base text-white transition-all hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
        }}
      >
        {completed > 0 ? "Continuer la formation →" : "Commencer la formation →"}
      </button>
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
  collapsed,
  onToggle,
  userEmail,
  onLogout,
}: {
  currentModuleId: string;
  currentLessonId: string;
  completedSet: Set<string>;
  onSelect: (modId: string, lessonId: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  userEmail: string;
  onLogout: () => void;
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
          {/* User info + logout */}
          {userEmail && (
            <div className="px-3 py-2.5 border-b border-[var(--border)] flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" }}
              >
                {userEmail[0].toUpperCase()}
              </div>
              <span className="text-xs text-[var(--text-muted)] truncate flex-1">{userEmail}</span>
              <button
                onClick={onLogout}
                title="Déconnexion"
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors text-xs px-1.5 py-0.5 rounded hover:bg-[rgba(239,68,68,0.1)]"
              >
                ⎋
              </button>
            </div>
          )}
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
}: {
  lesson: Lesson | null;
  mod: Module | null;
  onHome: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
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

      <div className="flex items-center gap-2 ml-auto">
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
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────
export default function App() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<"home" | "lesson">("home");
  const [currentModuleId, setCurrentModuleId] = useState(curriculum[0].id);
  const [currentLessonId, setCurrentLessonId] = useState(curriculum[0].lessons[0].id);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  // Load progress from localStorage + fetch user info
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cc_progress");
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.email) setUserEmail(d.email); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
  }

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
        userEmail={userEmail}
        onLogout={handleLogout}
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
