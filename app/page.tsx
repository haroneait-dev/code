"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { curriculum, totalLessons, type Lesson, type Module } from "@/lib/curriculum";
import { exercisesByLesson } from "@/lib/exercises";

// ─────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────
type SR = {
  modId: string; modTitle: string;
  lessonId: string; lessonTitle: string;
  sectionIdx: number | null; sectionHeading: string | null;
  excerpt: string;
};

function buildIndex(): SR[] {
  const idx: SR[] = [];
  for (const mod of curriculum) {
    for (const lesson of mod.lessons) {
      idx.push({ modId: mod.id, modTitle: mod.title, lessonId: lesson.id, lessonTitle: lesson.title, sectionIdx: null, sectionHeading: null, excerpt: lesson.intro });
      lesson.sections.forEach((s, i) => {
        const text = [s.heading, s.body, ...(s.bullets ?? []), ...(s.keypoints ?? [])].filter(Boolean).join(" ");
        if (text.trim()) idx.push({ modId: mod.id, modTitle: mod.title, lessonId: lesson.id, lessonTitle: lesson.title, sectionIdx: i, sectionHeading: s.heading ?? null, excerpt: text.slice(0, 100) });
      });
    }
  }
  return idx;
}

function runSearch(q: string, index: SR[]): SR[] {
  if (!q.trim()) return [];
  const lq = q.toLowerCase();
  const seen = new Set<string>();
  return index.filter(r => {
    const t = `${r.lessonTitle} ${r.sectionHeading ?? ""} ${r.excerpt}`.toLowerCase();
    if (!t.includes(lq)) return false;
    const key = `${r.lessonId}-${r.sectionIdx ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 10);
}

// ─────────────────────────────────────────────
// CONTENT HELPERS
// ─────────────────────────────────────────────
function copyToClipboard(text: string, cb: () => void) { navigator.clipboard.writeText(text).then(cb); }

function highlight(code: string, lang: string): string {
  if (lang === "bash" || lang === "sh") return code
    .replace(/^(#.*)$/gm, '<span class="tok-comment">$1</span>')
    .replace(/\b(npm|git|npx|claude|cd|ls|cat|echo|export|mkdir)\b/g, '<span class="tok-cmd">$1</span>')
    .replace(/(--[\w-]+|-[a-zA-Z])\b/g, '<span class="tok-flag">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="tok-str">$1</span>');
  if (lang === "typescript" || lang === "ts" || lang === "js") return code
    .replace(/\/\/.*/g, '<span class="tok-comment">$&</span>')
    .replace(/\b(import|export|const|let|function|async|await|return|interface|type|from|new)\b/g, '<span class="tok-kw">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span class="tok-str">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
  if (lang === "json") return code
    .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="tok-kw">$1</span>:')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="tok-str">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="tok-num">$1</span>');
  if (lang === "markdown") return code
    .replace(/^(#{1,3}.*)$/gm, '<span class="tok-kw">$1</span>')
    .replace(/^(-.*)$/gm, '<span class="tok-cmd">$1</span>');
  return code;
}

function CodeBlock({ lang, code, label }: { lang: string; code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-block my-4">
      <div className="code-block-header">
        <span className="code-block-lang">{label || lang}</span>
        <button className="code-block-copy" onClick={() => copyToClipboard(code, () => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}>
          {copied ? "✓" : "Copier"}
        </button>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
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
    <div style={{ overflowX: "auto", margin: "1.25rem 0", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border)", color: "var(--beige-muted)", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid rgba(200,190,168,0.06)", color: "var(--beige-dim)", fontSize: "0.83rem" }} dangerouslySetInnerHTML={{ __html: ci === 0 ? `<code style="font-family:'JetBrains Mono',monospace;font-size:0.8em;color:var(--beige)">${cell}</code>` : cell }} />)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0.75rem 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: "0.625rem", fontSize: "0.9rem", color: "var(--beige-dim)", lineHeight: 1.7, alignItems: "flex-start" }}>
          <span style={{ color: "var(--beige-muted)", flexShrink: 0, marginTop: "0.55rem", width: "4px", height: "4px", borderRadius: "50%", background: "var(--beige-muted)", display: "inline-block" }} />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function ExerciseItem({ ex, index }: { ex: { level: string; icon: string; title: string; description: string; hint: string }; index: number }) {
  const [open, setOpen] = useState(false);
  const colors: Record<string, string> = { "débutant": "#7fa87f", "intermédiaire": "#c89060", "avancé": "#9080c8" };
  const c = colors[ex.level] ?? "#7fa87f";
  return (
    <div style={{ padding: "0.875rem 0", borderBottom: "1px solid rgba(200,190,168,0.08)" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.6rem", fontWeight: 600, color: c, border: `1px solid ${c}40`, borderRadius: "3px", padding: "0.12rem 0.4rem", flexShrink: 0, marginTop: "0.2rem", fontFamily: "'JetBrains Mono', monospace" }}>{ex.level}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--beige)", marginBottom: "0.2rem" }}>{index + 1}. {ex.title}</div>
          <p style={{ fontSize: "0.82rem", color: "var(--beige-muted)", margin: 0, lineHeight: 1.65 }}>{ex.description}</p>
          <button onClick={() => setOpen(v => !v)} style={{ background: "none", border: "none", color: "var(--beige-dim)", fontSize: "0.72rem", cursor: "pointer", padding: 0, marginTop: "0.4rem" }}>
            {open ? "▾ masquer" : "▸ indice"}
          </button>
          {open && <div style={{ marginTop: "0.35rem", padding: "0.5rem 0.75rem", background: "rgba(200,190,168,0.04)", borderLeft: "2px solid var(--beige-muted)", fontSize: "0.78rem", color: "var(--beige-dim)", lineHeight: 1.6 }}>{ex.hint}</div>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LESSON VIEW
// ─────────────────────────────────────────────
function LessonView({ lesson, mod, scrollToSection, isMobile }: {
  lesson: Lesson; mod: Module;
  scrollToSection: number | null;
  isMobile: boolean;
}) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exercises = exercisesByLesson[lesson.id] ?? lesson.exercises ?? [];

  useEffect(() => {
    if (scrollToSection !== null) {
      setTimeout(() => sectionRefs.current[scrollToSection]?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  }, [scrollToSection, lesson.id]);

  return (
    <article className="fade-in" style={{ maxWidth: "700px", margin: "0 auto", padding: isMobile ? "1.5rem 0 6rem" : "3rem 0 6rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--beige-muted)", marginBottom: "0.75rem", letterSpacing: "0.04em" }}>
          {mod.title}{lesson.tag ? ` · ${lesson.tag}` : ""} · {lesson.duration}
        </div>
        <h1 style={{ fontSize: isMobile ? "1.5rem" : "1.875rem", fontWeight: 700, color: "var(--beige)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.875rem" }}>
          {lesson.title}
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--beige-dim)", lineHeight: 1.8 }}>
          {lesson.intro}
        </p>
      </header>

      <div style={{ height: "1px", background: "var(--border)", marginBottom: "2.25rem" }} />

      <div className="prose">
        {lesson.sections.map((s, i) => (
          <div key={i} ref={el => { sectionRefs.current[i] = el; }} id={`s${i}`} style={{ scrollMarginTop: isMobile ? "5rem" : "2rem" }}>
            {s.heading && <h2>{s.heading}</h2>}
            {s.body && <p>{s.body}</p>}
            {s.bullets && <BulletList items={s.bullets} />}
            {s.code && <CodeBlock lang={s.code.lang} code={s.code.code} label={s.code.label} />}
            {s.callout && <Callout type={s.callout.type} icon={s.callout.icon} text={s.callout.text} />}
            {s.table && <Table headers={s.table.headers} rows={s.table.rows} />}
            {s.keypoints && (
              <div style={{ background: "rgba(200,190,168,0.04)", border: "1px solid rgba(200,190,168,0.1)", borderRadius: "6px", padding: "0.875rem 1rem", margin: "1.25rem 0" }}>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Points clés</div>
                {s.keypoints.map((kp, ki) => (
                  <div key={ki} style={{ display: "flex", gap: "0.5rem", fontSize: "0.84rem", color: "var(--beige-dim)", marginBottom: "0.3rem" }}>
                    <span style={{ color: "var(--beige-muted)", flexShrink: 0 }}>—</span> {kp}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {exercises.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />
          <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
            Exercices · {exercises.length}
          </div>
          {exercises.map((ex, i) => <ExerciseItem key={i} ex={ex} index={i} />)}
        </div>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────
// SEARCH RESULTS DROPDOWN
// ─────────────────────────────────────────────
function SearchResults({ results, query, onSelect }: { results: SR[]; query: string; onSelect: (r: SR) => void }) {
  if (results.length === 0) return (
    <div style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--beige-muted)" }}>
      Aucun résultat pour « {query} »
    </div>
  );
  return (
    <>
      {results.map((r, i) => (
        <button key={i} onClick={() => onSelect(r)}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.15rem", padding: "0.7rem 1rem", background: "none", border: "none", borderBottom: "1px solid rgba(200,190,168,0.05)", cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,190,168,0.05)")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}
        >
          <span style={{ fontSize: "0.825rem", fontWeight: 500, color: "var(--beige)" }}>{r.sectionHeading ?? r.lessonTitle}</span>
          <span style={{ fontSize: "0.7rem", color: "var(--beige-muted)" }}>{r.modTitle} · {r.lessonTitle}</span>
        </button>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
// MOBILE DRAWER
// ─────────────────────────────────────────────
function MobileDrawer({ open, onClose, currentModuleId, currentLessonId, onNavigate, onSelect }: {
  open: boolean; onClose: () => void;
  currentModuleId: string; currentLessonId: string;
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
  onSelect: (modId: string, lessonId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SR[]>([]);
  const [expandedMod, setExpandedMod] = useState<string | null>(currentModuleId);
  const index = useMemo(() => buildIndex(), []);

  useEffect(() => { setResults(runSearch(query, index)); }, [query, index]);
  useEffect(() => { if (open) setExpandedMod(currentModuleId); }, [open, currentModuleId]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.2s" }}
      />
      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: "300px", maxWidth: "85vw",
        background: "var(--bg-surface)", borderRight: "1px solid var(--border)",
        zIndex: 201, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Drawer header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", height: "52px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--beige)" }}>Navigation</span>
          <button onClick={onClose} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--border)", borderRadius: "5px", color: "var(--beige-muted)", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
        </div>

        {/* Search */}
        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--beige-muted)" }}>⌕</span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "0.875rem", color: "var(--beige)", caretColor: "var(--beige)" }}
            />
            {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--beige-muted)", cursor: "pointer", fontSize: "0.7rem", padding: 0 }}>✕</button>}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {query ? (
            <SearchResults results={results} query={query} onSelect={r => { onNavigate(r.modId, r.lessonId, r.sectionIdx); setQuery(""); onClose(); }} />
          ) : (
            <nav style={{ padding: "0.5rem 0" }}>
              {curriculum.map(mod => {
                const isExpanded = expandedMod === mod.id;
                return (
                  <div key={mod.id}>
                    <button onClick={() => setExpandedMod(isExpanded ? null : mod.id)}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ flex: 1, fontSize: "0.78rem", fontWeight: 600, color: "var(--beige-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{mod.title}</span>
                      <span style={{ color: "var(--beige-muted)", fontSize: "0.7rem", transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "none" }}>›</span>
                    </button>
                    {isExpanded && mod.lessons.map((lesson, li) => {
                      const isActive = mod.id === currentModuleId && lesson.id === currentLessonId;
                      return (
                        <button key={lesson.id} onClick={() => { onSelect(mod.id, lesson.id); onClose(); }}
                          style={{ width: "100%", display: "flex", gap: "0.625rem", alignItems: "flex-start", padding: "0.5rem 1rem 0.5rem 2rem", background: isActive ? "rgba(200,190,168,0.07)" : "none", borderLeft: isActive ? "2px solid var(--beige-dim)" : "2px solid transparent", borderTop: "none", borderRight: "none", borderBottom: "none", cursor: "pointer", textAlign: "left" }}>
                          <span style={{ fontSize: "0.62rem", color: "var(--beige-muted)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "0.2rem" }}>{String(li + 1).padStart(2, "0")}</span>
                          <span style={{ fontSize: "0.8rem", color: isActive ? "var(--beige)" : "var(--beige-dim)", fontWeight: isActive ? 500 : 400, lineHeight: 1.4 }}>{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// MOBILE HEADER
// ─────────────────────────────────────────────
function MobileHeader({ onMenuOpen, onHome, view, lessonTitle, onSearchOpen }: {
  onMenuOpen: () => void; onHome: () => void;
  view: "home" | "lesson"; lessonTitle?: string;
  onSearchOpen: () => void;
}) {
  return (
    <header style={{ height: "52px", display: "flex", alignItems: "center", padding: "0 1rem", gap: "0.75rem", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
      <button onClick={onMenuOpen} style={{ width: "36px", height: "36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
        <span style={{ width: "16px", height: "1.5px", background: "var(--beige-dim)", borderRadius: "1px" }} />
        <span style={{ width: "16px", height: "1.5px", background: "var(--beige-dim)", borderRadius: "1px" }} />
        <span style={{ width: "16px", height: "1.5px", background: "var(--beige-dim)", borderRadius: "1px" }} />
      </button>

      {view === "home" ? (
        <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ width: "20px", height: "20px", borderRadius: "4px", background: "var(--beige)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "var(--bg-dark)", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>C</span>
          <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--beige)" }}>Claude Code</span>
        </button>
      ) : (
        <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--beige-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lessonTitle}</span>
      )}

      <button onClick={onSearchOpen} style={{ marginLeft: "auto", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 15 15" fill="none"><path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.889 3.182a4.5 4.5 0 1 1 .707-.707l2.604 2.603a.5.5 0 0 1-.707.707L9.111 9.682Z" fill="var(--beige-muted)" fillRule="evenodd" clipRule="evenodd"/></svg>
      </button>
    </header>
  );
}

// ─────────────────────────────────────────────
// MOBILE SEARCH OVERLAY
// ─────────────────────────────────────────────
function MobileSearchOverlay({ open, onClose, onNavigate }: {
  open: boolean; onClose: () => void;
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SR[]>([]);
  const index = useMemo(() => buildIndex(), []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setResults(runSearch(query, index)); }, [query, index]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-dark)", zIndex: 300, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1rem", height: "52px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 15 15" fill="none"><path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.889 3.182a4.5 4.5 0 1 1 .707-.707l2.604 2.603a.5.5 0 0 1-.707.707L9.111 9.682Z" fill="var(--beige-muted)" fillRule="evenodd" clipRule="evenodd"/></svg>
        <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher dans la formation…"
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "1rem", color: "var(--beige)", caretColor: "var(--beige)" }}
        />
        <button onClick={() => { onClose(); setQuery(""); }} style={{ background: "none", border: "none", color: "var(--beige-muted)", cursor: "pointer", fontSize: "0.875rem", padding: "0.25rem 0.5rem" }}>Annuler</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {query.length === 0 ? (
          <div style={{ padding: "1.5rem 1rem", color: "var(--beige-muted)", fontSize: "0.875rem" }}>Tapez pour rechercher…</div>
        ) : (
          <SearchResults results={results} query={query} onSelect={r => { onNavigate(r.modId, r.lessonId, r.sectionIdx); onClose(); setQuery(""); }} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MOBILE BOTTOM NAV
// ─────────────────────────────────────────────
function MobileBottomNav({ onPrev, onNext, hasPrev, hasNext }: { onPrev: () => void; onNext: () => void; hasPrev: boolean; hasNext: boolean }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", zIndex: 100 }}>
      <button onClick={onPrev} disabled={!hasPrev}
        style={{ flex: 1, padding: "0.875rem", background: "none", border: "none", borderRight: "1px solid var(--border)", color: hasPrev ? "var(--beige-dim)" : "var(--beige-muted)", fontSize: "0.825rem", cursor: hasPrev ? "pointer" : "default", opacity: hasPrev ? 1 : 0.4 }}>
        ← Précédente
      </button>
      <button onClick={onNext} disabled={!hasNext}
        style={{ flex: 1, padding: "0.875rem", background: "none", border: "none", color: hasNext ? "var(--beige)" : "var(--beige-muted)", fontSize: "0.825rem", fontWeight: 500, cursor: hasNext ? "pointer" : "default", opacity: hasNext ? 1 : 0.4 }}>
        Suivante →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// DESKTOP COMPONENTS
// ─────────────────────────────────────────────
function DesktopTopNav({ currentModuleId, currentView, onHome, onModuleSelect, onNavigate }: {
  currentModuleId: string; currentView: "home" | "lesson";
  onHome: () => void; onModuleSelect: (modId: string) => void;
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SR[]>([]);
  const index = useMemo(() => buildIndex(), []);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setResults(runSearch(query, index)); }, [query, index]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  useEffect(() => {
    const click = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSearchOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  return (
    <div style={{ borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "0 1.5rem", height: "52px", gap: "1rem" }}>
        <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}>
          <span style={{ width: "22px", height: "22px", borderRadius: "4px", background: "var(--beige)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "var(--bg-dark)", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>C</span>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--beige)", whiteSpace: "nowrap" }}>Claude Code</span>
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: "0.8rem", color: "var(--beige-muted)" }}>Formation</span>
        <div style={{ flex: 1 }} />

        <div ref={searchRef} style={{ position: "relative" }}>
          <button onClick={() => setSearchOpen(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.75rem", background: searchOpen ? "rgba(200,190,168,0.06)" : "none", border: "1px solid var(--border)", borderRadius: "5px", cursor: "pointer", color: "var(--beige-muted)", fontSize: "0.775rem", transition: "all 0.1s" }}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.889 3.182a4.5 4.5 0 1 1 .707-.707l2.604 2.603a.5.5 0 0 1-.707.707L9.111 9.682Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/></svg>
            Rechercher
            <kbd style={{ fontSize: "0.6rem", color: "var(--beige-muted)", background: "rgba(200,190,168,0.05)", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.1rem 0.35rem" }}>⌘K</kbd>
          </button>
          {searchOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: "400px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", zIndex: 300, boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.875rem", borderBottom: "1px solid var(--border)" }}>
                <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.889 3.182a4.5 4.5 0 1 1 .707-.707l2.604 2.603a.5.5 0 0 1-.707.707L9.111 9.682Z" fill="var(--beige-muted)" fillRule="evenodd" clipRule="evenodd"/></svg>
                <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher…"
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "0.875rem", color: "var(--beige)", caretColor: "var(--beige)" }}
                />
              </div>
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                {query.length === 0 ? (
                  <div style={{ padding: "0.75rem", fontSize: "0.78rem", color: "var(--beige-muted)" }}>Tapez pour rechercher dans les {totalLessons} leçons…</div>
                ) : (
                  <SearchResults results={results} query={query} onSelect={r => { onNavigate(r.modId, r.lessonId, r.sectionIdx); setSearchOpen(false); setQuery(""); }} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Module tabs */}
      <div style={{ display: "flex", padding: "0 1.5rem", overflowX: "auto" }}>
        <button onClick={onHome}
          style={{ padding: "0.5rem 0.875rem", background: "none", border: "none", borderBottom: currentView === "home" ? "2px solid var(--beige)" : "2px solid transparent", cursor: "pointer", fontSize: "0.775rem", fontWeight: currentView === "home" ? 600 : 400, color: currentView === "home" ? "var(--beige)" : "var(--beige-muted)", whiteSpace: "nowrap", transition: "color 0.1s", marginBottom: "-1px" }}>
          Vue d&apos;ensemble
        </button>
        {curriculum.map(mod => {
          const isActive = currentView === "lesson" && currentModuleId === mod.id;
          return (
            <button key={mod.id} onClick={() => onModuleSelect(mod.id)}
              style={{ padding: "0.5rem 0.875rem", background: "none", border: "none", borderBottom: isActive ? "2px solid var(--beige)" : "2px solid transparent", cursor: "pointer", fontSize: "0.775rem", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--beige)" : "var(--beige-muted)", whiteSpace: "nowrap", transition: "color 0.1s", marginBottom: "-1px" }}>
              {mod.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DesktopLessonSidebar({ mod, currentLessonId, onSelect }: { mod: Module; currentLessonId: string; onSelect: (modId: string, lessonId: string) => void }) {
  return (
    <aside style={{ width: "220px", minWidth: "220px", borderRight: "1px solid var(--border)", overflowY: "auto", padding: "1.25rem 0", flexShrink: 0 }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 1rem", marginBottom: "0.75rem" }}>
        {mod.title}
      </div>
      {mod.lessons.map((lesson, li) => {
        const isActive = lesson.id === currentLessonId;
        return (
          <button key={lesson.id} onClick={() => onSelect(mod.id, lesson.id)}
            style={{ width: "100%", display: "flex", gap: "0.625rem", alignItems: "flex-start", padding: "0.45rem 1rem", background: isActive ? "rgba(200,190,168,0.07)" : "none", borderLeft: isActive ? "2px solid var(--beige-dim)" : "2px solid transparent", borderTop: "none", borderRight: "none", borderBottom: "none", cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(200,190,168,0.04)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
          >
            <span style={{ fontSize: "0.62rem", color: "var(--beige-muted)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "0.2rem" }}>{String(li + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: "0.775rem", color: isActive ? "var(--beige)" : "var(--beige-dim)", fontWeight: isActive ? 500 : 400, lineHeight: 1.45 }}>{lesson.title}</span>
          </button>
        );
      })}
    </aside>
  );
}

// ─────────────────────────────────────────────
// HOMEPAGE
// ─────────────────────────────────────────────
function HomePage({ onNavigate, onSelect, isMobile }: {
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
  onSelect: (modId: string, lessonId: string) => void;
  isMobile: boolean;
}) {
  const [expandedMod, setExpandedMod] = useState<string | null>(curriculum[0].id);

  return (
    <div className="fade-in" style={{ maxWidth: "680px", margin: "0 auto", padding: isMobile ? "2.5rem 1.25rem 5rem" : "4.5rem 2.5rem 6rem" }}>
      {/* Hero */}
      <div style={{ marginBottom: isMobile ? "2.5rem" : "4rem" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
          Formation · {totalLessons} leçons · 4h
        </div>
        <h1 style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: 700, color: "var(--beige)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.875rem" }}>
          Maîtriser Claude Code
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--beige-muted)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: "480px" }}>
          De la première commande aux architectures multi-agents. Une formation structurée, complète, pensée pour les développeurs.
        </p>
        {!isMobile && (
          <div style={{ maxWidth: "500px" }}>
            <HomepageSearch onNavigate={onNavigate} />
          </div>
        )}
      </div>

      {/* Skills */}
      <div style={{ marginBottom: isMobile ? "2.5rem" : "3.5rem" }}>
        <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Au programme</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 2rem" }}>
          {["Écrire un CLAUDE.md efficace", "Configurer des serveurs MCP", "Automatiser avec les hooks", "Passer du chat à la délégation", "Gérer la fenêtre de contexte", "Orchestrer des agents en parallèle", "Utiliser la mémoire persistante", "Optimiser les coûts de tokens", "Intégrer dans vos pipelines CI/CD", "Déboguer avec les outils intégrés"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.625rem", fontSize: "0.84rem", color: "var(--beige-dim)", lineHeight: 1.5, alignItems: "flex-start", padding: "0.3rem 0", borderBottom: "1px solid rgba(200,190,168,0.04)" }}>
              <span style={{ color: "var(--beige-muted)", flexShrink: 0, fontSize: "0.65rem", marginTop: "0.35rem" }}>—</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
          {curriculum.length} modules
        </div>
        {curriculum.map((mod, idx) => (
          <div key={mod.id} style={{ borderTop: "1px solid var(--border)" }}>
            <button onClick={() => setExpandedMod(expandedMod === mod.id ? null : mod.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: "0.62rem", color: "var(--beige-muted)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, width: "18px", textAlign: "right" }}>{String(idx + 1).padStart(2, "0")}</span>
              <span style={{ flex: 1, fontSize: "0.9rem", fontWeight: 600, color: "var(--beige)" }}>{mod.title}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--beige-muted)" }}>{mod.lessons.length} leçons</span>
              <span style={{ color: "var(--beige-muted)", fontSize: "0.7rem", transition: "transform 0.15s", transform: expandedMod === mod.id ? "rotate(90deg)" : "none" }}>›</span>
            </button>
            {expandedMod === mod.id && (
              <div style={{ paddingBottom: "0.5rem" }}>
                {mod.lessons.map((lesson, li) => (
                  <button key={lesson.id} onClick={() => onSelect(mod.id, lesson.id)}
                    style={{ width: "100%", display: "flex", gap: "0.875rem", alignItems: "center", padding: "0.45rem 0 0.45rem 1.875rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderRadius: "4px", transition: "background 0.1s", minHeight: "44px" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,190,168,0.05)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <span style={{ fontSize: "0.62rem", color: "var(--beige-muted)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, width: "18px", textAlign: "right" }}>{li + 1}</span>
                    <span style={{ flex: 1, fontSize: "0.84rem", color: "var(--beige-dim)", lineHeight: 1.4 }}>{lesson.title}</span>
                    <span style={{ fontSize: "0.68rem", color: "var(--beige-muted)", flexShrink: 0 }}>{lesson.duration}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>
    </div>
  );
}

function HomepageSearch({ onNavigate }: { onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SR[]>([]);
  const [focused, setFocused] = useState(false);
  const index = useMemo(() => buildIndex(), []);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setResults(runSearch(query, index)); }, [query, index]);
  useEffect(() => {
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false); };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.75rem 1rem", background: "var(--bg-card)", border: `1px solid ${focused ? "rgba(200,190,168,0.25)" : "var(--border)"}`, borderRadius: "8px", transition: "border-color 0.15s" }}>
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}><path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.889 3.182a4.5 4.5 0 1 1 .707-.707l2.604 2.603a.5.5 0 0 1-.707.707L9.111 9.682Z" fill="var(--beige-muted)" fillRule="evenodd" clipRule="evenodd"/></svg>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)}
          placeholder="Rechercher dans la formation…"
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "0.9rem", color: "var(--beige)", caretColor: "var(--beige)" }}
        />
        <kbd style={{ flexShrink: 0, fontSize: "0.62rem", color: "var(--beige-muted)", background: "rgba(200,190,168,0.06)", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.12rem 0.4rem" }}>⌘K</kbd>
      </div>
      {focused && query.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", zIndex: 200, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", maxHeight: "320px", overflowY: "auto" }}>
          <SearchResults results={results} query={query} onSelect={r => { onNavigate(r.modId, r.lessonId, r.sectionIdx); setQuery(""); setFocused(false); }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [view, setView] = useState<"home" | "lesson">("home");
  const [currentModuleId, setCurrentModuleId] = useState(curriculum[0].id);
  const [currentLessonId, setCurrentLessonId] = useState(curriculum[0].lessons[0].id);
  const [scrollToSection, setScrollToSection] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentMod = curriculum.find(m => m.id === currentModuleId) ?? curriculum[0];
  const currentLesson = currentMod.lessons.find(l => l.id === currentLessonId) ?? currentMod.lessons[0];
  const allLessons = curriculum.flatMap(mod => mod.lessons.map(l => ({ modId: mod.id, lessonId: l.id })));
  const currentIndex = allLessons.findIndex(x => x.modId === currentModuleId && x.lessonId === currentLessonId);

  const goToLesson = useCallback((modId: string, lessonId: string) => {
    setCurrentModuleId(modId); setCurrentLessonId(lessonId); setScrollToSection(null); setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, []);

  const navigate = useCallback((modId: string, lessonId: string, sectionIdx: number | null) => {
    setCurrentModuleId(modId); setCurrentLessonId(lessonId); setScrollToSection(sectionIdx); setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, []);

  const handleModuleSelect = useCallback((modId: string) => {
    const mod = curriculum.find(m => m.id === modId);
    if (mod) goToLesson(modId, mod.lessons[0].id);
  }, [goToLesson]);

  const goPrev = useCallback(() => { if (currentIndex > 0) { const p = allLessons[currentIndex - 1]; goToLesson(p.modId, p.lessonId); } }, [currentIndex, allLessons, goToLesson]);
  const goNext = useCallback(() => { if (currentIndex < allLessons.length - 1) { const n = allLessons[currentIndex + 1]; goToLesson(n.modId, n.lessonId); } }, [currentIndex, allLessons, goToLesson]);

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <main style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg-dark)", overflow: "hidden" }}>
        <MobileHeader
          onMenuOpen={() => setDrawerOpen(true)}
          onHome={() => setView("home")}
          view={view}
          lessonTitle={view === "lesson" ? currentLesson.title : undefined}
          onSearchOpen={() => setMobileSearchOpen(true)}
        />

        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          currentModuleId={currentModuleId}
          currentLessonId={currentLessonId}
          onNavigate={(modId, lessonId, sectionIdx) => { navigate(modId, lessonId, sectionIdx); setDrawerOpen(false); }}
          onSelect={(modId, lessonId) => { goToLesson(modId, lessonId); setDrawerOpen(false); }}
        />

        <MobileSearchOverlay open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} onNavigate={navigate} />

        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {view === "home" ? (
            <HomePage onNavigate={navigate} onSelect={goToLesson} isMobile={true} />
          ) : (
            <div style={{ padding: "0 1.25rem" }}>
              <LessonView lesson={currentLesson} mod={currentMod} scrollToSection={scrollToSection} isMobile={true} />
            </div>
          )}
        </div>

        {view === "lesson" && (
          <MobileBottomNav onPrev={goPrev} onNext={goNext} hasPrev={currentIndex > 0} hasNext={currentIndex < allLessons.length - 1} />
        )}
      </main>
    );
  }

  // ── DESKTOP LAYOUT ──
  return (
    <main style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-dark)" }}>
      <DesktopTopNav
        currentModuleId={currentModuleId}
        currentView={view}
        onHome={() => setView("home")}
        onModuleSelect={handleModuleSelect}
        onNavigate={navigate}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {view === "lesson" && (
          <DesktopLessonSidebar mod={currentMod} currentLessonId={currentLessonId} onSelect={goToLesson} />
        )}

        <div ref={contentRef} style={{ flex: 1, overflowY: "auto" }}>
          {view === "home" ? (
            <HomePage onNavigate={navigate} onSelect={goToLesson} isMobile={false} />
          ) : (
            <div style={{ padding: "0 3rem" }}>
              <LessonView lesson={currentLesson} mod={currentMod} scrollToSection={scrollToSection} isMobile={false} />
              <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "700px", margin: "0 auto", paddingBottom: "4rem" }}>
                <button onClick={goPrev} disabled={currentIndex === 0} className="lesson-nav-btn" style={{ opacity: currentIndex > 0 ? 1 : 0.3 }}>← Précédente</button>
                <button onClick={goNext} disabled={currentIndex >= allLessons.length - 1} className="lesson-nav-btn primary" style={{ opacity: currentIndex < allLessons.length - 1 ? 1 : 0.3 }}>Suivante →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
