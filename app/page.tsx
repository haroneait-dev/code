"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { curriculum, totalLessons, type Lesson, type Module } from "@/lib/curriculum";
import { exercisesByLesson } from "@/lib/exercises";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

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
// WIKI TYPES
// ─────────────────────────────────────────────
type WikiTip = {
  id: string;
  title: string;
  content: string;
  author: string | null;
  category: string;
  upvotes: number;
  created_at: string;
};

type CommunitySkill = {
  id: string;
  name: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  description: string | null;
  author: string | null;
  upvotes: number;
  created_at: string;
};

const SKILL_LEVELS = ["Débutant", "Intermédiaire", "Avancé"] as const;
const SKILL_LEVEL_COLORS: Record<string, string> = {
  "Débutant": "#7fa87f",
  "Intermédiaire": "#c89060",
  "Avancé": "#c87070",
};

const WIKI_CATEGORIES = ["Tous", "Tips & Tricks", "Workflow", "CLAUDE.md", "MCP", "Hooks", "Divers"] as const;
const WIKI_CATEGORY_COLORS: Record<string, string> = {
  "Tips & Tricks": "#9080c8",
  "Workflow": "#6080b0",
  "CLAUDE.md": "#c89060",
  "MCP": "#7fa87f",
  "Hooks": "#c87070",
  "Divers": "#9a9080",
};

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
function MobileDrawer({ open, onClose, currentModuleId, currentLessonId, currentView, onNavigate, onSelect, onWiki }: {
  open: boolean; onClose: () => void;
  currentModuleId: string; currentLessonId: string; currentView: "home" | "lesson" | "wiki";
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
  onSelect: (modId: string, lessonId: string) => void;
  onWiki: () => void;
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
              {/* Communauté link */}
              <button onClick={() => { onWiki(); onClose(); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1rem", background: currentView === "wiki" ? "rgba(144,128,184,0.1)" : "none", borderLeft: currentView === "wiki" ? "2px solid var(--purple-light)" : "2px solid transparent", borderTop: "none", borderRight: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: currentView === "wiki" ? 600 : 400, color: currentView === "wiki" ? "var(--purple-light)" : "var(--beige-dim)" }}>Communauté</span>
              </button>
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
function MobileHeader({ onMenuOpen, onHome, view, lessonTitle, onSearchOpen, user, onAuthClick }: {
  onMenuOpen: () => void; onHome: () => void;
  view: "home" | "lesson" | "wiki"; lessonTitle?: string;
  onSearchOpen: () => void;
  user: User | null; onAuthClick: () => void;
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
      <button onClick={onAuthClick}
        style={{ width: "30px", height: "30px", borderRadius: "50%", background: user ? "var(--beige-muted)" : "none", border: user ? "none" : "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: user ? "0.65rem" : "0.6rem", fontWeight: 700, color: user ? "var(--bg-dark)" : "var(--beige-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
        {user ? (user.email?.[0]?.toUpperCase() ?? "?") : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="var(--beige-muted)" strokeWidth="1.2"/><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="var(--beige-muted)" strokeWidth="1.2" strokeLinecap="round"/></svg>
        )}
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
// USER MENU
// ─────────────────────────────────────────────
function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = user.email?.[0]?.toUpperCase() ?? "?";
  const shortEmail = user.email ? (user.email.length > 20 ? user.email.slice(0, 18) + "…" : user.email) : "";

  useEffect(() => {
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0.5rem 0.25rem 0.25rem", background: open ? "rgba(200,190,168,0.08)" : "none", border: "1px solid var(--border)", borderRadius: "20px", cursor: "pointer", transition: "all 0.1s" }}>
        <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--beige-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "var(--bg-dark)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{initials}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--beige-dim)", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shortEmail}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="var(--beige-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", minWidth: "180px", overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.5)", zIndex: 300 }}>
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--beige-muted)", marginBottom: "0.15rem" }}>Connecté en tant que</div>
            <div style={{ fontSize: "0.8rem", color: "var(--beige)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
          </div>
          <button onClick={() => { onSignOut(); setOpen(false); }}
            style={{ width: "100%", padding: "0.65rem 1rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.825rem", color: "var(--beige-dim)", display: "flex", alignItems: "center", gap: "0.5rem", transition: "background 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,190,168,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3M9 9l3-3-3-3M12 6.5H5" stroke="var(--beige-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// DESKTOP COMPONENTS
// ─────────────────────────────────────────────
function DesktopTopNav({ currentModuleId, currentView, onHome, onModuleSelect, onNavigate, onWiki, user, onAuthClick, onSignOut }: {
  currentModuleId: string; currentView: "home" | "lesson" | "wiki";
  onHome: () => void; onModuleSelect: (modId: string) => void;
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
  onWiki: () => void;
  user: User | null; onAuthClick: () => void; onSignOut: () => void;
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
    <div className="glass-nav" style={{ borderBottom: "1px solid rgba(200,190,168,0.07)", flexShrink: 0, position: "relative", zIndex: 10 }}>
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

        {/* Auth */}
        {user ? (
          <UserMenu user={user} onSignOut={onSignOut} />
        ) : (
          <button onClick={onAuthClick} className="btn-magnetic"
            style={{ padding: "0.375rem 0.875rem", background: "var(--beige)", border: "none", borderRadius: "5px", color: "var(--bg-dark)", fontSize: "0.775rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            Se connecter
          </button>
        )}
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
        <div style={{ flex: 1 }} />
        <button onClick={onWiki}
          style={{ padding: "0.5rem 0.875rem", background: "none", border: "none", borderBottom: currentView === "wiki" ? "2px solid var(--purple-light)" : "2px solid transparent", cursor: "pointer", fontSize: "0.775rem", fontWeight: currentView === "wiki" ? 600 : 400, color: currentView === "wiki" ? "var(--purple-light)" : "var(--beige-muted)", whiteSpace: "nowrap", transition: "color 0.1s", marginBottom: "-1px" }}>
          Communauté
        </button>
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
// TYPEWRITER
// ─────────────────────────────────────────────
function TypewriterText({ text, speed = 48, className, style }: {
  text: string; speed?: number; className?: string; style?: React.CSSProperties;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { setDone(true); clearInterval(id); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span className={className} style={style}>
      {displayed}
      {!done && (
        <span style={{ borderRight: "3px solid currentColor", marginLeft: "1px", animation: "blink 0.7s step-end infinite", display: "inline-block", height: "0.85em", verticalAlign: "middle" }} />
      )}
    </span>
  );
}

// ─────────────────────────────────────────────
// COUNT UP
// ─────────────────────────────────────────────
function CountUp({ to, duration = 1200, delay = 0 }: { to: number; duration?: number; delay?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const frame = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * to));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(timeout);
  }, [to, duration, delay]);
  return <>{val}</>;
}

// ─────────────────────────────────────────────
// TERMINAL MOCKUP — hero visual
// ─────────────────────────────────────────────
function TerminalMockup({ isMobile }: { isMobile: boolean }) {
  const LINES = [
    { text: '$ claude "Ajoute des tests unitaires"', color: "#8be9fd" },
    { text: "◆ Lecture du projet (47 fichiers)…", color: "#b0a0e8" },
    { text: "◆ Analyse de Button.tsx", color: "#b0a0e8" },
    { text: "◆ Écriture de Button.test.tsx", color: "#b0a0e8" },
    { text: "◆ Mise à jour de vitest.config.ts", color: "#b0a0e8" },
    { text: "✓ 12 tests créés — 100% coverage", color: "#70d090" },
    { text: "$ _", color: "#8be9fd" },
  ];
  const [visible, setVisible] = useState(0);
  const [cycle, setCycle] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(0);
    let count = 0;
    let tid: ReturnType<typeof setTimeout>;
    function next() {
      count++;
      setVisible(count);
      if (count < LINES.length) {
        tid = setTimeout(next, 420);
      } else {
        tid = setTimeout(() => setCycle(c => c + 1), 4500);
      }
    }
    tid = setTimeout(next, 900);
    return () => clearTimeout(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  useEffect(() => {
    if (isMobile) return;
    const move = (e: MouseEvent) => {
      if (!termRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * -9;
      termRef.current.style.transform = `perspective(1100px) rotateY(${x}deg) rotateX(${y}deg)`;
    };
    const leave = () => {
      if (termRef.current) termRef.current.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg)";
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseleave", leave); };
  }, [isMobile]);

  const tags = [
    { label: "CLAUDE.md", top: "8%", left: "-14%", delay: "0s" },
    { label: "MCP Server", top: "18%", right: "-13%", delay: "1.8s" },
    { label: "$ hooks", bottom: "22%", left: "-11%", delay: "0.9s" },
    { label: "// agents", bottom: "10%", right: "-11%", delay: "2.5s" },
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Glow derrière le terminal */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "120%", height: "120%",
        background: "radial-gradient(ellipse at center, rgba(96,80,200,0.13) 0%, transparent 68%)",
        pointerEvents: "none", zIndex: 0,
        animation: "chat-glow 4s ease-in-out infinite",
      }} />

      {/* Tags flottants */}
      {!isMobile && tags.map((tag, i) => (
        <div key={i} style={{
          position: "absolute", zIndex: 20,
          top: tag.top, bottom: (tag as {bottom?: string}).bottom,
          left: (tag as {left?: string}).left, right: (tag as {right?: string}).right,
          padding: "0.28rem 0.7rem",
          background: "rgba(18,15,12,0.92)",
          border: "1px solid rgba(200,190,168,0.18)",
          borderRadius: "999px",
          fontSize: "0.65rem",
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(200,190,168,0.85)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          animation: "float-tag 4s ease-in-out infinite",
          animationDelay: tag.delay,
          whiteSpace: "nowrap",
        }}>{tag.label}</div>
      ))}

      {/* Terminal window */}
      <div ref={termRef} style={{
        position: "relative", zIndex: 10,
        background: "linear-gradient(160deg, #171412 0%, #100e0c 100%)",
        border: "1px solid rgba(200,190,168,0.1)",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "transform 0.28s cubic-bezier(0.175,0.885,0.32,1.275)",
        transformStyle: "preserve-3d",
      }}>
        {/* Barre de titre */}
        <div style={{
          padding: "0.65rem 1rem", display: "flex", alignItems: "center", gap: "0.45rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
            <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.8, display: "inline-block" }} />
          ))}
          <span style={{ flex: 1, textAlign: "center", fontSize: "0.66rem", color: "rgba(200,190,168,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            claude-code — zsh
          </span>
        </div>
        {/* Contenu */}
        <div style={{ padding: "1.25rem 1.5rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.77rem", lineHeight: 2.1, minHeight: "210px" }}>
          {LINES.slice(0, visible).map((line, i) => (
            <div key={`${cycle}-${i}`} className="fade-in" style={{ color: line.color }}>
              {line.text}
              {i === visible - 1 && line.text === "$ _" && (
                <span style={{ borderRight: "2px solid #8be9fd", marginLeft: "1px", animation: "blink 0.7s step-end infinite", display: "inline-block", height: "0.8em", verticalAlign: "middle" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HOMEPAGE
// ─────────────────────────────────────────────
function HomePage({ onNavigate, onSelect, isMobile, user, onAuthClick }: {
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
  onSelect: (modId: string, lessonId: string) => void;
  isMobile: boolean;
  user: User | null;
  onAuthClick: () => void;
}) {
  const [expandedMod, setExpandedMod] = useState<string | null>(curriculum[0].id);
  const introLessonCount = curriculum.find(m => m.id === "intro")?.lessons.length ?? 0;
  const lockedLessonsCount = totalLessons - introLessonCount;

  useReveal([user]);

  const FEATURES = [
    { code: ".md", label: "CLAUDE.md", desc: "Configure l'IA pour ton projet" },
    { code: "mcp", label: "Serveurs MCP", desc: "Connecte des outils externes" },
    { code: "fn()", label: "Hooks", desc: "Automatise avec des scripts" },
    { code: "x4", label: "Multi-agents", desc: "Orchestre des agents en parallèle" },
    { code: "ctx", label: "Contexte", desc: "Gère la fenêtre de contexte" },
    { code: "git", label: "CI/CD", desc: "Intègre dans tes pipelines" },
  ];

  return (
    <div className="view-enter" style={{ maxWidth: isMobile ? "100%" : "1080px", margin: "0 auto", padding: isMobile ? "2.5rem 1.25rem 5rem" : "4rem 3rem 6rem", position: "relative", zIndex: 1 }}>

      {/* ── HERO 2 COLONNES ── */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2.5rem" : "5rem", alignItems: "center", marginBottom: isMobile ? "3.5rem" : "6rem" }}>

        {/* Colonne gauche — texte */}
        <div className="reveal reveal-delay-1">
          <div className="badge-live" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.62rem", fontWeight: 600, color: "rgba(96,80,160,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem", padding: "0.25rem 0.75rem", background: "rgba(96,80,160,0.08)", border: "1px solid rgba(96,80,160,0.2)", borderRadius: "999px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(96,80,160,0.9)", display: "inline-block" }} />
            Formation Claude Code
          </div>

          <h1 className="gradient-text" style={{ fontSize: isMobile ? "2.4rem" : "3.5rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
            <TypewriterText text="Maîtriser Claude Code" speed={52} />
          </h1>

          <p style={{ fontSize: "1rem", color: "var(--beige-muted)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: "420px" }}>
            De la première commande aux architectures multi-agents. Formation structurée, pensée pour les développeurs.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            {[
              { value: totalLessons, label: "leçons", delay: 300 },
              { value: curriculum.length, label: "modules", delay: 550 },
              { value: 4, label: "heures", delay: 800 },
            ].map(({ value, label, delay }, i) => (
              <div key={i} className="stat-pop" style={{ animationDelay: `${delay}ms`, animationFillMode: "both", textAlign: "center", padding: "0.75rem 1.25rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", minWidth: "76px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--purple)", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                  <CountUp to={value} duration={900} delay={delay} />
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.3rem" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={user ? undefined : onAuthClick} className="btn-magnetic"
              style={{ padding: "0.7rem 1.5rem", background: "linear-gradient(135deg, rgba(96,80,200,0.92), rgba(60,80,200,0.92))", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
              {user ? "Continuer la formation →" : "Commencer gratuitement →"}
            </button>
            {!isMobile && (
              <div style={{ flex: 1, minWidth: "200px" }}>
                <HomepageSearch onNavigate={onNavigate} />
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite — terminal */}
        {!isMobile && (
          <div className="reveal reveal-delay-2" style={{ padding: "2rem 1rem" }}>
            <TerminalMockup isMobile={false} />
          </div>
        )}
      </div>

      {/* ── AUTH BANNER ── */}
      {!user && (
        <Tilt3D className="reveal reveal-delay-2" style={{ marginBottom: "4rem", borderRadius: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem", background: "linear-gradient(135deg,rgba(96,80,200,0.07),rgba(50,80,180,0.05))", border: "1px solid rgba(96,80,200,0.18)", borderRadius: "14px", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(96,80,200,0.04),transparent)", backgroundSize: "200% 100%", animation: "shimmer-lock 4s linear infinite" }} />
            <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--beige)", fontWeight: 600, marginBottom: "0.25rem" }}>
                {lockedLessonsCount} leçons accessibles après connexion
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--beige-muted)" }}>
                {introLessonCount} leçons gratuites disponibles maintenant
              </div>
            </div>
            <button onClick={onAuthClick} className="btn-magnetic"
              style={{ padding: "0.6rem 1.3rem", background: "linear-gradient(135deg,rgba(96,80,200,0.9),rgba(60,80,200,0.9))", border: "1px solid rgba(140,120,240,0.35)", borderRadius: "9px", color: "#fff", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, position: "relative" }}>
              Se connecter →
            </button>
          </div>
        </Tilt3D>
      )}

      {/* ── AU PROGRAMME — feature cards ── */}
      <div className="reveal reveal-delay-2" style={{ marginBottom: isMobile ? "3rem" : "4.5rem" }}>
        <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Au programme</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: "0.875rem" }}>
          {FEATURES.map((f, i) => (
            <Tilt3D key={i} style={{ borderRadius: "12px" }}>
              <div style={{ padding: "1.25rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", height: "100%" }}>
                <div style={{ fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--purple)", fontWeight: 700, marginBottom: "0.6rem", padding: "0.2rem 0.5rem", background: "rgba(96,80,160,0.07)", borderRadius: "4px", display: "inline-block", letterSpacing: "0.03em" }}>{f.code}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--beige)", marginBottom: "0.3rem" }}>{f.label}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--beige-muted)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>

      {/* ── CURRICULUM ── */}
      <div style={{ maxWidth: "680px" }}>
        <div className="reveal reveal-delay-3" style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
          {curriculum.length} modules
        </div>
        {curriculum.map((mod, idx) => {
          const isLocked = !user && mod.id !== "intro";
          return (
            <div key={mod.id} className={`reveal reveal-delay-${Math.min(idx + 3, 5)} mod-row module-card-hover`}
              style={{ borderTop: "1px solid rgba(42,32,24,0.07)", opacity: isLocked ? 0.55 : 1, transition: "opacity 0.15s" }}>
              <button onClick={() => isLocked ? onAuthClick() : setExpandedMod(expandedMod === mod.id ? null : mod.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 0.4rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: "0.62rem", color: "rgba(96,80,160,0.6)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, width: "18px", textAlign: "right" }}>{String(idx + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, fontSize: "0.9rem", fontWeight: 600, color: isLocked ? "var(--beige-muted)" : "var(--beige)" }}>{mod.title}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--beige-muted)" }}>{mod.lessons.length} leçons</span>
                {isLocked
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="5" width="8" height="6" rx="1.5" stroke="rgba(96,80,160,0.5)" strokeWidth="1.2"/><path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="rgba(96,80,160,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  : <span style={{ color: "var(--beige-muted)", fontSize: "0.7rem", transition: "transform 0.15s", display: "inline-block", transform: expandedMod === mod.id ? "rotate(90deg)" : "none" }}>›</span>
                }
              </button>
              {!isLocked && expandedMod === mod.id && (
                <div className="view-enter" style={{ paddingBottom: "0.5rem" }}>
                  {mod.lessons.map((lesson, li) => (
                    <button key={lesson.id} onClick={() => onSelect(mod.id, lesson.id)}
                      style={{ width: "100%", display: "flex", gap: "0.875rem", alignItems: "center", padding: "0.45rem 0 0.45rem 1.875rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderRadius: "4px", transition: "background 0.15s", minHeight: "44px" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(96,80,160,0.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                      <span style={{ fontSize: "0.62rem", color: "rgba(96,80,160,0.5)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, width: "18px", textAlign: "right" }}>{li + 1}</span>
                      <span style={{ flex: 1, fontSize: "0.84rem", color: "var(--beige-dim)", lineHeight: 1.4 }}>{lesson.title}</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--beige-muted)", flexShrink: 0 }}>{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
// AUTH MODAL
// ─────────────────────────────────────────────
function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) { setError("Email et mot de passe requis."); return; }
    setLoading(true); setError("");
    if (mode === "signin") {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      if (data.user) { onAuth(data.user); onClose(); }
    } else {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      if (data.user && !data.session) {
        setSuccess("Vérifie ton email pour confirmer ton compte.");
      } else if (data.user) {
        onAuth(data.user); onClose();
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (err) setError("Google non configuré. Utilise email/mot de passe.");
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)" }} />
      <div className="fade-in" style={{ position: "relative", width: "420px", maxWidth: "100%", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", zIndex: 1, padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--beige-muted)", cursor: "pointer", fontSize: "1rem", padding: "0.25rem", lineHeight: 1 }}>✕</button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "var(--beige)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.05rem", color: "var(--bg-dark)", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: "0.75rem" }}>C</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--beige)" }}>Claude Code Formation</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
          {(["signin", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{ flex: 1, padding: "0.5rem", background: "none", border: "none", borderBottom: mode === m ? "2px solid var(--beige)" : "2px solid transparent", color: mode === m ? "var(--beige)" : "var(--beige-muted)", fontSize: "0.85rem", fontWeight: mode === m ? 600 : 400, cursor: "pointer", marginBottom: "-1px", transition: "color 0.1s" }}>
              {m === "signin" ? "Connexion" : "Créer un compte"}
            </button>
          ))}
        </div>

        {success ? (
          <div style={{ padding: "1.5rem 0", textAlign: "center", lineHeight: 1.7 }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✉️</div>
            <p style={{ fontSize: "0.875rem", color: "var(--beige-dim)" }}>{success}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {/* Google OAuth */}
            <button onClick={handleGoogle}
              style={{ width: "100%", padding: "0.65rem", background: "none", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--beige-dim)", fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", transition: "background 0.1s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,190,168,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.31a3.67 3.67 0 0 1-1.6 2.41v2h2.58C16.8 12.7 15.68 10.6 15.68 8.18Z" fill="#4285F4"/>
                <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.58-2a4.87 4.87 0 0 1-7.27-2.56H.76v2.07A8 8 0 0 0 8 16Z" fill="#34A853"/>
                <path d="M3.45 9.5A4.8 4.8 0 0 1 3.2 8c0-.52.09-1.02.25-1.5V4.43H.76A8 8 0 0 0 0 8c0 1.29.31 2.51.76 3.57L3.45 9.5Z" fill="#FBBC04"/>
                <path d="M8 3.18c1.22 0 2.3.42 3.16 1.24l2.37-2.37A7.93 7.93 0 0 0 8 0 8 8 0 0 0 .76 4.43L3.45 6.5A4.77 4.77 0 0 1 8 3.18Z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>ou par email</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Email</label>
              <input autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="toi@exemple.com"
                style={{ width: "100%", padding: "0.65rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder={mode === "signup" ? "8 caractères minimum" : "••••••••"}
                style={{ width: "100%", padding: "0.65rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
            </div>

            {error && <div style={{ fontSize: "0.8rem", color: "#c87070", lineHeight: 1.5 }}>{error}</div>}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "0.7rem", background: "var(--beige)", border: "none", borderRadius: "7px", color: "var(--bg-dark)", fontSize: "0.875rem", fontWeight: 600, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "0.125rem", transition: "background 0.1s" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--beige-light)"; }}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--beige)")}>
              {loading ? "…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// WIKI VIEW
// ─────────────────────────────────────────────
function WikiView({ isMobile, isAdmin }: { isMobile: boolean; isAdmin: boolean }) {
  const [communityTab, setCommunityTab] = useState<"tips" | "skills">("tips");
  const [tips, setTips] = useState<WikiTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formCategory, setFormCategory] = useState("Tips & Tricks");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wiki_voted");
      if (stored) setVoted(new Set(JSON.parse(stored)));
    } catch {}
    fetch("/api/wiki")
      .then(r => r.json())
      .then(data => { setTips(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredTips = activeCategory === "Tous" ? tips : tips.filter(t => t.category === activeCategory);

  const handleVote = async (id: string) => {
    if (voted.has(id)) return;
    const next = new Set(voted); next.add(id);
    setVoted(next);
    try { localStorage.setItem("wiki_voted", JSON.stringify([...next])); } catch {}
    setTips(prev => prev.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
    fetch(`/api/wiki/${id}/vote`, { method: "POST" }).catch(() => {});
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { setDeleting(false); return; }
    const res = await fetch(`/api/wiki/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTips(prev => prev.filter(t => t.id !== id));
      setConfirmDeleteId(null);
    }
    setDeleting(false);
  };

  const handleSubmit = async () => {
    if (!formTitle.trim() || !formContent.trim()) { setSubmitError("Titre et contenu requis."); return; }
    setSubmitting(true); setSubmitError("");
    const res = await fetch("/api/wiki", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formTitle, content: formContent, author: formAuthor || null, category: formCategory }),
    });
    const data = await res.json();
    if (!res.ok) { setSubmitError(data.error ?? "Erreur serveur."); setSubmitting(false); return; }
    setTips(prev => [data, ...prev]);
    setSubmitSuccess(true);
    setSubmitting(false);
  };

  return (
    <div className="fade-in" style={{ maxWidth: "760px", margin: "0 auto", padding: isMobile ? "1.5rem 1.25rem 5rem" : "3rem 2rem 5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          Base de connaissances
        </div>
        <h1 style={{ fontSize: isMobile ? "1.5rem" : "1.875rem", fontWeight: 700, color: "var(--beige)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "0.5rem" }}>
          Communauté
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--beige-muted)", lineHeight: 1.7, maxWidth: "480px" }}>
          Tips, workflows, configs et compétences partagés par la communauté.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "1.75rem" }}>
        {(["tips", "skills"] as const).map(tab => {
          const label = tab === "tips" ? "Tips & Wiki" : "Compétences";
          const isActive = communityTab === tab;
          return (
            <button key={tab} onClick={() => setCommunityTab(tab)}
              style={{ padding: "0.5rem 1.1rem", background: "none", border: "none", borderBottom: isActive ? "2px solid var(--beige)" : "2px solid transparent", marginBottom: "-1px", cursor: "pointer", fontSize: "0.825rem", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--beige)" : "var(--beige-muted)", transition: "color 0.1s" }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Skills tab */}
      {communityTab === "skills" && <SkillsView isMobile={isMobile} />}

      {/* Tips tab content below */}
      {communityTab === "tips" && <>

      {/* Category filter */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {WIKI_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: "0.3rem 0.75rem", background: isActive ? "rgba(200,190,168,0.1)" : "none", border: `1px solid ${isActive ? "rgba(200,190,168,0.3)" : "var(--border)"}`, borderRadius: "999px", color: isActive ? "var(--beige)" : "var(--beige-muted)", fontSize: "0.75rem", cursor: "pointer", fontWeight: isActive ? 500 : 400, transition: "all 0.1s" }}>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Tips list */}
      {loading ? (
        <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--beige-muted)", fontSize: "0.875rem" }}>Chargement…</div>
      ) : filteredTips.length === 0 ? (
        <div style={{ padding: "3rem 0", textAlign: "center" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--beige-muted)", marginBottom: "1rem" }}>
            {activeCategory === "Tous" ? "Aucune contribution pour l'instant." : `Aucune contribution dans "${activeCategory}".`}
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ padding: "0.5rem 1.25rem", background: "none", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige-dim)", fontSize: "0.825rem", cursor: "pointer" }}>
            Être le premier à contribuer →
          </button>
        </div>
      ) : (
        <div>
          {filteredTips.map(tip => {
            const isExpanded = expandedId === tip.id;
            const hasVoted = voted.has(tip.id);
            const color = WIKI_CATEGORY_COLORS[tip.category] ?? "#9a9080";
            return (
              <div key={tip.id} style={{ borderTop: "1px solid var(--border)", padding: "1.1rem 0" }}>
                <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                  {/* Upvote */}
                  <button onClick={() => handleVote(tip.id)}
                    title={hasVoted ? "Déjà voté" : "Utile"}
                    style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", background: "none", border: `1px solid ${hasVoted ? "rgba(200,190,168,0.25)" : "var(--border)"}`, borderRadius: "6px", padding: "0.4rem 0.5rem", cursor: hasVoted ? "default" : "pointer", transition: "all 0.1s", minWidth: "40px" }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M4.5 1L8.5 7.5H0.5L4.5 1Z" fill={hasVoted ? "var(--beige)" : "var(--beige-muted)"} />
                    </svg>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: hasVoted ? "var(--beige)" : "var(--beige-muted)", fontFamily: "'JetBrains Mono', monospace" }}>{tip.upvotes}</span>
                  </button>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 600, color, border: `1px solid ${color}40`, borderRadius: "3px", padding: "0.1rem 0.4rem", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
                        {tip.category}
                      </span>
                    </div>
                    <button onClick={() => setExpandedId(isExpanded ? null : tip.id)}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", width: "100%", display: "block" }}>
                      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--beige)", marginBottom: "0.3rem", lineHeight: 1.4 }}>{tip.title}</h3>
                    </button>

                    {isExpanded ? (
                      <pre style={{ fontSize: "0.825rem", color: "var(--beige-dim)", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "0 0 0.5rem" }}>
                        {tip.content}
                      </pre>
                    ) : (
                      <p style={{ fontSize: "0.825rem", color: "var(--beige-muted)", margin: "0 0 0.5rem", lineHeight: 1.65, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                        {tip.content}
                      </p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {tip.author && <span style={{ fontSize: "0.7rem", color: "var(--beige-muted)" }}>par {tip.author}</span>}
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                        {new Date(tip.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <button onClick={() => setExpandedId(isExpanded ? null : tip.id)}
                        style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--beige-muted)", fontSize: "0.7rem", cursor: "pointer", padding: 0 }}>
                        {isExpanded ? "↑ Réduire" : "↓ Lire"}
                      </button>
                      {isAdmin && (
                        confirmDeleteId === tip.id ? (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginLeft: "0.5rem" }}>
                            <span style={{ fontSize: "0.68rem", color: "var(--beige-muted)" }}>Supprimer ?</span>
                            <button onClick={() => handleDelete(tip.id)} disabled={deleting}
                              style={{ fontSize: "0.68rem", color: "#c87070", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}>
                              {deleting ? "…" : "Oui"}
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)}
                              style={{ fontSize: "0.68rem", color: "var(--beige-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                              Non
                            </button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(tip.id)}
                            title="Supprimer"
                            style={{ marginLeft: "0.25rem", background: "none", border: "none", cursor: "pointer", padding: "0.1rem", color: "var(--beige-muted)", opacity: 0.5, transition: "opacity 0.1s", lineHeight: 1 }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                            onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 3h8M5 3V2h2v1M4.5 3v6M7.5 3v6M3 3l.5 7h5L9 3" stroke="#c87070" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 400 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: isMobile ? "calc(100vw - 2rem)" : "560px", maxHeight: "90vh", overflowY: "auto", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", zIndex: 401, padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--beige)" }}>Partager un tip</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--beige-muted)", cursor: "pointer", fontSize: "1rem", padding: "0.25rem" }}>✕</button>
            </div>

            {submitSuccess ? (
              <div className="check-pop" style={{ padding: "2rem 0", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>✓</div>
                <p style={{ fontSize: "0.9rem", color: "var(--beige)", marginBottom: "1.25rem" }}>Contribution publiée, merci !</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={() => { setSubmitSuccess(false); setFormTitle(""); setFormContent(""); setFormAuthor(""); setFormCategory("Tips & Tricks"); }}
                    style={{ padding: "0.5rem 1.1rem", background: "var(--beige)", border: "none", borderRadius: "6px", color: "var(--bg-dark)", fontSize: "0.825rem", fontWeight: 600, cursor: "pointer" }}>
                    + Ajouter un autre
                  </button>
                  <button onClick={() => { setShowForm(false); setSubmitSuccess(false); }}
                    style={{ padding: "0.5rem 1.1rem", background: "none", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige-dim)", fontSize: "0.825rem", cursor: "pointer" }}>
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Titre *</label>
                  <input value={formTitle} onChange={e => setFormTitle(e.target.value)}
                    placeholder="Ex: Utiliser #file pour donner du contexte ciblé"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Catégorie</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none" }}>
                    {WIKI_CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Contenu *</label>
                  <textarea value={formContent} onChange={e => setFormContent(e.target.value)}
                    rows={7}
                    placeholder={"Décris ton tip, workflow ou config en détail.\nTu peux inclure du code ou des exemples."}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.84rem", outline: "none", resize: "vertical", lineHeight: 1.7, fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Nom (optionnel)</label>
                  <input value={formAuthor} onChange={e => setFormAuthor(e.target.value)}
                    placeholder="Anonyme si laissé vide"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
                </div>

                {submitError && <div style={{ fontSize: "0.8rem", color: "#c87070" }}>{submitError}</div>}

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowForm(false)}
                    style={{ padding: "0.5rem 1rem", background: "none", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige-dim)", fontSize: "0.825rem", cursor: "pointer" }}>
                    Annuler
                  </button>
                  <button onClick={handleSubmit} disabled={submitting}
                    style={{ padding: "0.5rem 1.25rem", background: "var(--beige)", border: "none", borderRadius: "6px", color: "var(--bg-dark)", fontSize: "0.825rem", fontWeight: 600, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? "Envoi…" : "Publier"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      </>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SKILLS VIEW
// ─────────────────────────────────────────────
function SkillsView({ isMobile }: { isMobile: boolean }) {
  const [skills, setSkills] = useState<CommunitySkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<string>("Tous");
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formLevel, setFormLevel] = useState<string>("Débutant");
  const [formDescription, setFormDescription] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("skills_voted");
      if (stored) setVoted(new Set(JSON.parse(stored)));
    } catch {}
    fetch("/api/skills")
      .then(r => r.json())
      .then(data => { setSkills(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeLevel === "Tous" ? skills : skills.filter(s => s.level === activeLevel);

  const handleVote = async (id: string) => {
    if (voted.has(id)) return;
    const next = new Set(voted); next.add(id);
    setVoted(next);
    try { localStorage.setItem("skills_voted", JSON.stringify([...next])); } catch {}
    setSkills(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
    fetch(`/api/skills/${id}/vote`, { method: "POST" }).catch(() => {});
  };

  const handleSubmit = async () => {
    if (!formName.trim()) { setSubmitError("Nom de compétence requis."); return; }
    setSubmitting(true); setSubmitError("");
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, level: formLevel, description: formDescription || null, author: formAuthor || null }),
    });
    const data = await res.json();
    if (!res.ok) { setSubmitError(data.error ?? "Erreur serveur."); setSubmitting(false); return; }
    setSkills(prev => [data, ...prev]);
    setSubmitSuccess(true);
    setSubmitting(false);
  };

  const levelFilters = ["Tous", ...SKILL_LEVELS];

  return (
    <div>
      {/* Level filter + add button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          {levelFilters.map(lv => {
            const isActive = activeLevel === lv;
            const color = lv === "Tous" ? undefined : SKILL_LEVEL_COLORS[lv];
            return (
              <button key={lv} onClick={() => setActiveLevel(lv)}
                style={{ padding: "0.3rem 0.75rem", background: isActive ? "rgba(200,190,168,0.1)" : "none", border: `1px solid ${isActive ? (color ?? "rgba(200,190,168,0.3)") : "var(--border)"}`, borderRadius: "999px", color: isActive ? (color ?? "var(--beige)") : "var(--beige-muted)", fontSize: "0.75rem", cursor: "pointer", fontWeight: isActive ? 500 : 400, transition: "all 0.1s" }}>
                {lv}
              </button>
            );
          })}
        </div>
        <button onClick={() => { setShowForm(true); setSubmitSuccess(false); setSubmitError(""); }}
          style={{ flexShrink: 0, padding: "0.45rem 0.9rem", background: "var(--beige)", border: "none", borderRadius: "6px", color: "var(--bg-dark)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--beige-light)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--beige)")}>
          + Ajouter
        </button>
      </div>

      {/* Skills list */}
      {loading ? (
        <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--beige-muted)", fontSize: "0.875rem" }}>Chargement…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "3rem 0", textAlign: "center" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--beige-muted)", marginBottom: "1rem" }}>
            {activeLevel === "Tous" ? "Aucune compétence pour l'instant." : `Aucune compétence de niveau "${activeLevel}".`}
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ padding: "0.5rem 1.25rem", background: "none", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige-dim)", fontSize: "0.825rem", cursor: "pointer" }}>
            Être le premier à contribuer →
          </button>
        </div>
      ) : (
        <div>
          {filtered.map(skill => {
            const hasVoted = voted.has(skill.id);
            const color = SKILL_LEVEL_COLORS[skill.level] ?? "#9a9080";
            return (
              <div key={skill.id} style={{ borderTop: "1px solid var(--border)", padding: "1.1rem 0" }}>
                <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                  {/* Upvote */}
                  <button onClick={() => handleVote(skill.id)}
                    title={hasVoted ? "Déjà voté" : "Utile"}
                    style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", background: "none", border: `1px solid ${hasVoted ? "rgba(200,190,168,0.25)" : "var(--border)"}`, borderRadius: "6px", padding: "0.4rem 0.5rem", cursor: hasVoted ? "default" : "pointer", transition: "all 0.1s", minWidth: "40px" }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M4.5 1L8.5 7.5H0.5L4.5 1Z" fill={hasVoted ? "var(--beige)" : "var(--beige-muted)"} />
                    </svg>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: hasVoted ? "var(--beige)" : "var(--beige-muted)", fontFamily: "'JetBrains Mono', monospace" }}>{skill.upvotes}</span>
                  </button>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 600, color, border: `1px solid ${color}40`, borderRadius: "3px", padding: "0.1rem 0.4rem", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
                        {skill.level}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--beige)", marginBottom: "0.3rem", lineHeight: 1.4 }}>{skill.name}</h3>
                    {skill.description && (
                      <p style={{ fontSize: "0.825rem", color: "var(--beige-muted)", margin: "0 0 0.5rem", lineHeight: 1.65 }}>{skill.description}</p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {skill.author && <span style={{ fontSize: "0.7rem", color: "var(--beige-muted)" }}>par {skill.author}</span>}
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                        {new Date(skill.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 400 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: isMobile ? "calc(100vw - 2rem)" : "480px", maxHeight: "90vh", overflowY: "auto", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", zIndex: 401, padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--beige)" }}>Ajouter une compétence</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--beige-muted)", cursor: "pointer", fontSize: "1rem", padding: "0.25rem" }}>✕</button>
            </div>

            {submitSuccess ? (
              <div className="check-pop" style={{ padding: "2rem 0", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>✓</div>
                <p style={{ fontSize: "0.9rem", color: "var(--beige)", marginBottom: "1.25rem" }}>Compétence ajoutée, merci !</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={() => { setSubmitSuccess(false); setFormName(""); setFormLevel("Débutant"); setFormDescription(""); setFormAuthor(""); }}
                    style={{ padding: "0.5rem 1.1rem", background: "var(--beige)", border: "none", borderRadius: "6px", color: "var(--bg-dark)", fontSize: "0.825rem", fontWeight: 600, cursor: "pointer" }}>
                    + Ajouter une autre
                  </button>
                  <button onClick={() => { setShowForm(false); setSubmitSuccess(false); }}
                    style={{ padding: "0.5rem 1.1rem", background: "none", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige-dim)", fontSize: "0.825rem", cursor: "pointer" }}>
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Compétence *</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)}
                    placeholder="Ex: Prompt engineering, MCP servers, CLAUDE.md…"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Niveau</label>
                  <select value={formLevel} onChange={e => setFormLevel(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none" }}>
                    {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Description (optionnelle)</label>
                  <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)}
                    rows={4}
                    placeholder="Décris comment tu utilises cette compétence, ou donne un exemple…"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.84rem", outline: "none", resize: "vertical", lineHeight: 1.7, fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--beige-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Nom (optionnel)</label>
                  <input value={formAuthor} onChange={e => setFormAuthor(e.target.value)}
                    placeholder="Anonyme si laissé vide"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
                </div>

                {submitError && <div style={{ fontSize: "0.8rem", color: "#c87070" }}>{submitError}</div>}

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowForm(false)}
                    style={{ padding: "0.5rem 1rem", background: "none", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--beige-dim)", fontSize: "0.825rem", cursor: "pointer" }}>
                    Annuler
                  </button>
                  <button onClick={handleSubmit} disabled={submitting}
                    style={{ padding: "0.5rem 1.25rem", background: "var(--beige)", border: "none", borderRadius: "6px", color: "var(--bg-dark)", fontSize: "0.825rem", fontWeight: 600, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? "Envoi…" : "Publier"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// BACKGROUND ORBS
// ─────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Purple orb — top left */}
      <div style={{
        position: "absolute", width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(100,70,200,0.13) 0%, transparent 68%)",
        top: "-250px", left: "-180px",
        animation: "orb1 22s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Blue orb — bottom right */}
      <div style={{
        position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(50,90,200,0.10) 0%, transparent 68%)",
        bottom: "-150px", right: "-150px",
        animation: "orb2 28s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Indigo orb — center */}
      <div style={{
        position: "absolute", width: "450px", height: "450px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(130,50,180,0.07) 0%, transparent 68%)",
        top: "35%", right: "25%",
        animation: "orb3 20s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Dot grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(200,190,168,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// REVEAL HOOK (scroll animations)
// ─────────────────────────────────────────────
function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─────────────────────────────────────────────
// 3D TILT CARD
// ─────────────────────────────────────────────
function Tilt3D({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    const glare = glareRef.current;
    if (!el || !glare) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
    el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
    
    const glareX = (e.clientX - r.left) / r.width * 100;
    const glareY = (e.clientY - r.top) / r.height * 100;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08), transparent 50%)`;
  }
  function onLeave() {
    const el = ref.current;
    const glare = glareRef.current;
    if (!el || !glare) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    glare.style.background = "transparent";
  }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className}
      style={{ transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)", transformStyle: "preserve-3d", position: "relative", ...style }}>
      <div ref={glareRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", transition: "background 0.2s ease", borderRadius: "inherit", zIndex: 10 }} />
      <div style={{ transform: "translateZ(25px)", display: "block", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHAT WIDGET
// ─────────────────────────────────────────────
type ChatMessage = { role: "user" | "assistant"; content: string };

function renderMarkdown(text: string): string {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre style="background:rgba(0,0,0,0.4);border:1px solid rgba(200,190,168,0.12);border-radius:6px;padding:0.75rem;overflow-x:auto;margin:0.5rem 0;font-family:'JetBrains Mono',monospace;font-size:0.78rem;line-height:1.5;color:var(--beige-dim)"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code style="font-family:\'JetBrains Mono\',monospace;font-size:0.82em;background:rgba(200,190,168,0.1);padding:0.1em 0.3em;border-radius:3px;color:var(--beige)">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^#{1,3}\s+(.+)$/gm, '<div style="font-weight:600;color:var(--beige);margin:0.75rem 0 0.25rem">$1</div>')
    .replace(/^[-•]\s+(.+)$/gm, '<div style="display:flex;gap:0.4rem;padding:0.1rem 0"><span style="color:var(--beige-muted);flex-shrink:0">•</span><span>$1</span></div>')
    .replace(/\n\n/g, '<div style="height:0.6rem"></div>')
    .replace(/\n/g, "<br/>");
}

function ChatWidget({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  if (!user) return null;

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) {
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "_Erreur lors de la connexion à l'assistant._" }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: accumulated }]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "_Erreur réseau._" }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Assistant IA"
        className={!open ? "chat-btn-glow" : ""}
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 1000,
          width: "54px", height: "54px", borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg,rgba(120,96,200,0.98),rgba(80,100,200,0.98))"
            : "linear-gradient(135deg,rgba(120,96,200,0.88),rgba(80,100,200,0.88))",
          border: "1px solid rgba(160,130,240,0.5)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s, background 0.2s", fontSize: "1.3rem",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span className={!open ? "float-icon" : ""}>{open ? "✕" : "✦"}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: "5rem", right: "1.5rem", zIndex: 999,
          width: "min(380px, calc(100vw - 2rem))",
          height: "min(520px, calc(100vh - 8rem))",
          background: "var(--bg-panel)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
            <span style={{ fontSize: "1rem" }}>✦</span>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--beige)" }}>Assistant Claude Code</div>
              <div style={{ fontSize: "0.68rem", color: "var(--beige-muted)" }}>Formation + recherche web</div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--beige-muted)", fontSize: "0.68rem", cursor: "pointer", padding: "0.25rem 0.5rem", borderRadius: "4px" }}
              >
                Effacer
              </button>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                <div style={{ fontSize: "0.82rem", color: "var(--beige-muted)", lineHeight: 1.6 }}>
                  Pose-moi n'importe quelle question sur Claude Code, la formation, ou l'IA pour les devs.
                </div>
                {["C'est quoi un CLAUDE.md ?", "Comment configurer un serveur MCP ?", "Quelle est la différence entre chat et délégation ?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    style={{ textAlign: "left", background: "rgba(200,190,168,0.05)", border: "1px solid rgba(200,190,168,0.1)", borderRadius: "6px", padding: "0.45rem 0.7rem", fontSize: "0.75rem", color: "var(--beige-dim)", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,190,168,0.25)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(200,190,168,0.1)")}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "90%",
                  padding: "0.55rem 0.875rem",
                  borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  background: msg.role === "user" ? "rgba(144,128,200,0.25)" : "rgba(200,190,168,0.07)",
                  border: `1px solid ${msg.role === "user" ? "rgba(144,128,200,0.3)" : "rgba(200,190,168,0.1)"}`,
                  fontSize: "0.82rem",
                  color: "var(--beige-dim)",
                  lineHeight: 1.65,
                  wordBreak: "break-word",
                }}>
                  {msg.role === "user"
                    ? <span>{msg.content}</span>
                    : msg.content
                      ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      : <span style={{ color: "var(--beige-muted)", fontSize: "0.75rem" }}>
                          <span style={{ animation: "pulse 1.2s infinite" }}>Recherche et réflexion</span>
                          {" "}<span style={{ opacity: 0.5 }}>•••</span>
                        </span>
                  }
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)", flexShrink: 0, display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              placeholder="Pose ta question… (Entrée pour envoyer)"
              rows={1}
              style={{
                flex: 1, background: "rgba(200,190,168,0.05)", border: "1px solid rgba(200,190,168,0.15)",
                borderRadius: "8px", padding: "0.55rem 0.75rem", color: "var(--beige)", fontSize: "0.82rem",
                resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5,
                maxHeight: "120px", overflowY: "auto",
              }}
              onInput={e => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: "rgba(144,128,200,0.85)", border: "none", borderRadius: "8px",
                padding: "0.55rem 0.875rem", color: "#fff", fontSize: "0.8rem", fontWeight: 600,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.5 : 1, flexShrink: 0,
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// GLOWING MOUSE ORB
// ─────────────────────────────────────────────
function GlowingMouseOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!orbRef.current) return;
      orbRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div ref={orbRef} style={{
      position: "fixed", top: 0, left: 0, width: "400px", height: "400px",
      borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      background: "radial-gradient(circle, rgba(96,80,160,0.05) 0%, transparent 70%)",
      transition: "transform 0.12s ease-out",
      willChange: "transform",
    }} />
  );
}

// ─────────────────────────────────────────────
// COSMIC BACKGROUND
// ─────────────────────────────────────────────
function CosmicBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Purple orb — top left */}
      <div style={{
        position: "absolute", width: "800px", height: "800px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(96,80,200,0.07) 0%, transparent 65%)",
        top: "-300px", left: "-200px",
        animation: "orb1 22s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Blue orb — bottom right */}
      <div style={{
        position: "absolute", width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(60,100,200,0.05) 0%, transparent 65%)",
        bottom: "-200px", right: "-180px",
        animation: "orb2 28s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Warm orb — center */}
      <div style={{
        position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,160,80,0.04) 0%, transparent 65%)",
        top: "30%", right: "20%",
        animation: "orb3 20s ease-in-out infinite",
        willChange: "transform",
      }} />
      {/* Dot grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(100,85,65,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// GLOBAL QUANTUM STYLES (keyframes injected at runtime)
// ─────────────────────────────────────────────
function GlobalQuantumStyles() {
  useEffect(() => {
    const id = "quantum-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes quantum-float {
        0%,100% { transform: translateY(0px) rotate(0deg); }
        33%      { transform: translateY(-8px) rotate(1deg); }
        66%      { transform: translateY(4px) rotate(-1deg); }
      }
      @keyframes aurora-shift {
        0%   { background-position: 0% 50%; opacity: 0.6; }
        50%  { background-position: 100% 50%; opacity: 1; }
        100% { background-position: 0% 50%; opacity: 0.6; }
      }
      @keyframes particle-rise {
        0%   { transform: translateY(0) scale(1); opacity: 0.7; }
        100% { transform: translateY(-120px) scale(0); opacity: 0; }
      }
      .module-card-hover {
        transition: transform 0.25s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.25s ease;
      }
      .module-card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(96,80,160,0.10), 0 0 0 1px rgba(96,80,160,0.12);
      }
      .btn-magnetic {
        transition: transform 0.2s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.2s ease;
      }
      .btn-magnetic:hover {
        transform: translateY(-1px) scale(1.03);
        box-shadow: 0 6px 20px rgba(96,80,160,0.18);
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  return null;
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [view, setView] = useState<"home" | "lesson" | "wiki">("home");
  const [currentModuleId, setCurrentModuleId] = useState(curriculum[0].id);
  const [currentLessonId, setCurrentLessonId] = useState(curriculum[0].lessons[0].id);
  const [scrollToSection, setScrollToSection] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const isAdmin = !!(user?.email && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);

  const currentMod = curriculum.find(m => m.id === currentModuleId) ?? curriculum[0];
  const currentLesson = currentMod.lessons.find(l => l.id === currentLessonId) ?? currentMod.lessons[0];
  const allLessons = curriculum.flatMap(mod => mod.lessons.map(l => ({ modId: mod.id, lessonId: l.id })));
  const currentIndex = allLessons.findIndex(x => x.modId === currentModuleId && x.lessonId === currentLessonId);

  const goToLesson = useCallback((modId: string, lessonId: string) => {
    if (!user && modId !== "intro") { setShowAuth(true); return; }
    setCurrentModuleId(modId); setCurrentLessonId(lessonId); setScrollToSection(null); setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, [user]);

  const navigate = useCallback((modId: string, lessonId: string, sectionIdx: number | null) => {
    if (!user && modId !== "intro") { setShowAuth(true); return; }
    setCurrentModuleId(modId); setCurrentLessonId(lessonId); setScrollToSection(sectionIdx); setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, [user]);

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
          user={user}
          onAuthClick={() => setShowAuth(true)}
        />

        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          currentModuleId={currentModuleId}
          currentLessonId={currentLessonId}
          currentView={view}
          onNavigate={(modId, lessonId, sectionIdx) => { navigate(modId, lessonId, sectionIdx); setDrawerOpen(false); }}
          onSelect={(modId, lessonId) => { goToLesson(modId, lessonId); setDrawerOpen(false); }}
          onWiki={() => { if (!user) { setShowAuth(true); return; } setView("wiki"); setDrawerOpen(false); }}
        />

        <MobileSearchOverlay open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} onNavigate={navigate} />

        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {view === "home" ? (
            <HomePage onNavigate={navigate} onSelect={goToLesson} isMobile={true} user={user} onAuthClick={() => setShowAuth(true)} />
          ) : view === "wiki" ? (
            <WikiView isMobile={true} isAdmin={isAdmin} />
          ) : (
            <div style={{ padding: "0 1.25rem" }}>
              <LessonView lesson={currentLesson} mod={currentMod} scrollToSection={scrollToSection} isMobile={true} />
            </div>
          )}
        </div>

        {view === "lesson" && (
          <MobileBottomNav onPrev={goPrev} onNext={goNext} hasPrev={currentIndex > 0} hasNext={currentIndex < allLessons.length - 1} />
        )}

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={u => setUser(u)} />}
        <ChatWidget user={user} />
        <GlowingMouseOrb />
        <GlobalQuantumStyles />
        <CosmicBackground />
      </main>
    );
  }

  // ── DESKTOP LAYOUT ──
  return (
    <main style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-dark)", position: "relative" }}>
      <DesktopTopNav
        currentModuleId={currentModuleId}
        currentView={view}
        onHome={() => setView("home")}
        onModuleSelect={handleModuleSelect}
        onNavigate={navigate}
        onWiki={() => { if (!user) { setShowAuth(true); return; } setView("wiki"); }}
        user={user}
        onAuthClick={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 1 }}>
        {view === "lesson" && (
          <DesktopLessonSidebar mod={currentMod} currentLessonId={currentLessonId} onSelect={goToLesson} />
        )}

        <div ref={contentRef} style={{ flex: 1, overflowY: "auto" }}>
          {view === "home" ? (
            <HomePage onNavigate={navigate} onSelect={goToLesson} isMobile={false} user={user} onAuthClick={() => setShowAuth(true)} />
          ) : view === "wiki" ? (
            <WikiView isMobile={false} isAdmin={isAdmin} />
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

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={u => setUser(u)} />}
      <ChatWidget user={user} />
      <GlowingMouseOrb />
      <GlobalQuantumStyles />
      <CosmicBackground />
    </main>
  );
}
