"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { curriculum, totalLessons, type Lesson, type Module } from "@/lib/curriculum";
import { exercisesByLesson } from "@/lib/exercises";

// ─────────────────────────────────────────────
// SEARCH INDEX
// ─────────────────────────────────────────────
type SearchResult = {
  modId: string;
  modTitle: string;
  lessonId: string;
  lessonTitle: string;
  sectionIdx: number | null;
  sectionHeading: string | null;
  excerpt: string;
};

function buildIndex(): SearchResult[] {
  const index: SearchResult[] = [];
  for (const mod of curriculum) {
    for (const lesson of mod.lessons) {
      // lesson title
      index.push({ modId: mod.id, modTitle: mod.title, lessonId: lesson.id, lessonTitle: lesson.title, sectionIdx: null, sectionHeading: null, excerpt: lesson.intro });
      // sections
      lesson.sections.forEach((s, i) => {
        const text = [s.heading, s.body, ...(s.bullets ?? []), ...(s.keypoints ?? [])].filter(Boolean).join(" ");
        if (text.trim()) {
          index.push({ modId: mod.id, modTitle: mod.title, lessonId: lesson.id, lessonTitle: lesson.title, sectionIdx: i, sectionHeading: s.heading ?? null, excerpt: text.slice(0, 120) });
        }
      });
    }
  }
  return index;
}

function search(query: string, index: SearchResult[]): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const seen = new Set<string>();
  return index.filter(r => {
    const text = `${r.lessonTitle} ${r.sectionHeading ?? ""} ${r.excerpt}`.toLowerCase();
    if (!text.includes(q)) return false;
    const key = `${r.lessonId}-${r.sectionIdx ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function copyToClipboard(text: string, cb: () => void) {
  navigator.clipboard.writeText(text).then(cb);
}

function highlightCode(code: string, lang: string): string {
  if (lang === "bash" || lang === "sh") {
    return code
      .replace(/^(#.*)$/gm, '<span class="tok-comment">$1</span>')
      .replace(/\b(npm|pnpm|git|npx|claude|curl|echo|export|cd|ls|cat|mkdir)\b/g, '<span class="tok-cmd">$1</span>')
      .replace(/(--[\w-]+|-[a-zA-Z])\b/g, '<span class="tok-flag">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="tok-str">$1</span>');
  }
  if (lang === "typescript" || lang === "ts" || lang === "js") {
    return code
      .replace(/\/\/.*/g, '<span class="tok-comment">$&</span>')
      .replace(/\b(import|export|const|let|var|function|async|await|return|interface|type|from|new|class)\b/g, '<span class="tok-kw">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span class="tok-str">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
  }
  if (lang === "json") {
    return code
      .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="tok-kw">$1</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="tok-str">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="tok-num">$1</span>');
  }
  if (lang === "markdown") {
    return code
      .replace(/^(#{1,3}.*)$/gm, '<span class="tok-kw">$1</span>')
      .replace(/^(-.*)$/gm, '<span class="tok-cmd">$1</span>');
  }
  return code;
}

// ─────────────────────────────────────────────
// CODE BLOCK
// ─────────────────────────────────────────────
function CodeBlock({ lang, code, label }: { lang: string; code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-block my-4">
      <div className="code-block-header">
        <span className="code-block-lang">{label || lang}</span>
        <button className="code-block-copy" onClick={() => copyToClipboard(code, () => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}>
          {copied ? "✓ Copié" : "Copier"}
        </button>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: highlightCode(code, lang) }} />
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
    <div style={{ overflowX: "auto", margin: "1rem 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "var(--text-dim)" }}
                  dangerouslySetInnerHTML={{ __html: ci === 0 ? `<code style="font-family:'JetBrains Mono',monospace;font-size:0.78em;color:var(--accent-light)">${cell}</code>` : cell }}
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
    <ul style={{ margin: "0.75rem 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: "0.6rem", fontSize: "0.875rem", color: "var(--text-dim)", lineHeight: 1.65, alignItems: "flex-start" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0, fontSize: "0.6rem", marginTop: "0.45rem" }}>▸</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────
// EXERCISE — minimal style
// ─────────────────────────────────────────────
function ExerciseItem({ ex, index }: {
  ex: { level: string; icon: string; title: string; description: string; hint: string };
  index: number;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const levelColor: Record<string, string> = { "débutant": "#4ade80", "intermédiaire": "#fb923c", "avancé": "#a78bfa" };
  const color = levelColor[ex.level] ?? "#4ade80";

  return (
    <div style={{ padding: "0.875rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 700, color, background: `${color}12`, border: `1px solid ${color}25`, borderRadius: "3px", padding: "0.15rem 0.4rem", flexShrink: 0, marginTop: "0.1rem" }}>
          {ex.level}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>
            {index + 1}. {ex.title}
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{ex.description}</p>
          <button onClick={() => setHintOpen(v => !v)} style={{ marginTop: "0.4rem", background: "none", border: "none", color: "var(--accent)", fontSize: "0.72rem", cursor: "pointer", padding: 0 }}>
            {hintOpen ? "▾ masquer l'indice" : "▸ voir l'indice"}
          </button>
          {hintOpen && (
            <div style={{ marginTop: "0.35rem", padding: "0.5rem 0.75rem", background: "rgba(91,106,249,0.06)", borderLeft: "2px solid var(--accent)", fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
              {ex.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LESSON CONTENT
// ─────────────────────────────────────────────
function LessonContent({ lesson, mod, scrollToSection }: {
  lesson: Lesson;
  mod: Module;
  scrollToSection: number | null;
}) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exercises = exercisesByLesson[lesson.id] ?? lesson.exercises ?? [];

  useEffect(() => {
    if (scrollToSection !== null && sectionRefs.current[scrollToSection]) {
      setTimeout(() => sectionRefs.current[scrollToSection]?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [scrollToSection, lesson.id]);

  return (
    <div className="fade-in" style={{ maxWidth: "740px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
          {mod.title} {lesson.tag ? `· ${lesson.tag}` : ""} · {lesson.duration}
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
          {lesson.title}
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-dim)", lineHeight: 1.75 }}>
          {lesson.intro}
        </p>
      </div>

      <div style={{ height: "1px", background: "var(--border)", margin: "0 0 2rem" }} />

      {/* Sections */}
      <div className="prose">
        {lesson.sections.map((section, i) => (
          <div key={i} ref={el => { sectionRefs.current[i] = el; }} id={`section-${i}`} style={{ scrollMarginTop: "1.5rem" }}>
            {section.heading && <h2>{section.heading}</h2>}
            {section.body && <p>{section.body}</p>}
            {section.bullets && <BulletList items={section.bullets} />}
            {section.code && <CodeBlock lang={section.code.lang} code={section.code.code} label={section.code.label} />}
            {section.callout && <Callout type={section.callout.type} icon={section.callout.icon} text={section.callout.text} />}
            {section.table && <Table headers={section.table.headers} rows={section.table.rows} />}
            {section.keypoints && (
              <div style={{ background: "rgba(91,106,249,0.05)", border: "1px solid rgba(91,106,249,0.15)", borderRadius: "6px", padding: "0.875rem 1rem", margin: "1rem 0" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Points clés</div>
                {section.keypoints.map((kp, ki) => (
                  <div key={ki} style={{ display: "flex", gap: "0.5rem", fontSize: "0.83rem", color: "var(--text-dim)", marginBottom: "0.3rem" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>–</span> {kp}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Exercises */}
      {exercises.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Exercices pratiques — {exercises.length}
          </div>
          {exercises.map((ex, i) => <ExerciseItem key={i} ex={ex} index={i} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// HOMEPAGE
// ─────────────────────────────────────────────
function HomePage({ onSelect }: { onSelect: (modId: string, lessonId: string) => void }) {
  return (
    <div className="fade-in" style={{ maxWidth: "820px", margin: "0 auto", padding: "3.5rem 2.5rem 6rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
          Formation · {totalLessons} leçons · 4h
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: "0.875rem" }}>
          Maîtriser Claude Code
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-dim)", lineHeight: 1.75, maxWidth: "560px" }}>
          Une formation structurée qui couvre Claude Code de A à Z — des premiers pas aux architectures multi-agents avancées.
        </p>
      </div>

      {/* Compétences */}
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
          Au programme
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.4rem" }}>
          {[
            "Écrire un CLAUDE.md qui rend Claude expert de votre codebase",
            "Configurer des serveurs MCP (GitHub, filesystem, BDD)",
            "Automatiser vos workflows avec le système de hooks",
            "Passer du mode chat au mode délégation complète",
            "Gérer la fenêtre de contexte sans gaspiller de tokens",
            "Orchestrer des agents en parallèle sur des tâches complexes",
            "Utiliser la mémoire persistante entre les sessions",
            "Intégrer Claude Code dans vos pipelines CI/CD",
            "Optimiser les coûts et éviter les dérives de contexte",
            "Déboguer avec les outils de diagnostic intégrés",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.6rem", fontSize: "0.825rem", color: "var(--text-dim)", lineHeight: 1.5, alignItems: "flex-start", padding: "0.35rem 0" }}>
              <span style={{ color: "var(--accent)", flexShrink: 0, fontSize: "0.6rem", marginTop: "0.45rem" }}>▸</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
          {curriculum.length} modules
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {curriculum.map((mod, idx) => (
            <ModuleAccordion key={mod.id} mod={mod} idx={idx} onSelect={onSelect} defaultOpen={idx === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModuleAccordion({ mod, idx, onSelect, defaultOpen }: { mod: Module; idx: number; onSelect: (m: string, l: string) => void; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", width: "20px", textAlign: "right", flexShrink: 0 }}>{String(idx + 1).padStart(2, "0")}</span>
        <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{mod.title}</span>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{mod.lessons.length} leçons</span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", transition: "transform 0.15s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </button>
      {open && (
        <div style={{ paddingBottom: "0.5rem" }}>
          {mod.lessons.map((lesson, li) => (
            <button
              key={lesson.id}
              onClick={() => onSelect(mod.id, lesson.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "0.45rem 0 0.45rem 2rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.1s", borderRadius: "4px" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", width: "20px", textAlign: "right", flexShrink: 0 }}>{li + 1}</span>
              <span style={{ flex: 1, fontSize: "0.825rem", color: "var(--text-dim)" }}>{lesson.title}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{lesson.duration}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SEARCH BAR
// ─────────────────────────────────────────────
function SearchBar({ onNavigate }: { onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [focused, setFocused] = useState(false);
  const index = useMemo(() => buildIndex(), []);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(search(query, index));
  }, [query, index]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showDropdown = focused && query.length > 0;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.6rem", background: "var(--bg-dark)", border: "1px solid var(--border)", borderRadius: "5px" }}>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>⌕</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Rechercher…"
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "0.775rem", color: "var(--text)", caretColor: "var(--accent)" }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.7rem", padding: 0, lineHeight: 1 }}>✕</button>
        )}
      </div>

      {showDropdown && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0, right: 0,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          zIndex: 100,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          {results.length === 0 ? (
            <div style={{ padding: "0.75rem 0.875rem", fontSize: "0.775rem", color: "var(--text-muted)" }}>Aucun résultat</div>
          ) : results.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onNavigate(r.modId, r.lessonId, r.sectionIdx);
                setQuery("");
                setFocused(false);
              }}
              style={{ width: "100%", display: "block", padding: "0.6rem 0.875rem", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <div style={{ fontSize: "0.775rem", fontWeight: 500, color: "var(--text)", marginBottom: "0.15rem" }}>
                {r.sectionHeading ?? r.lessonTitle}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {r.modTitle} · {r.lessonTitle}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ currentModuleId, currentLessonId, onSelect, onHome, collapsed, onToggle, onNavigate }: {
  currentModuleId: string;
  currentLessonId: string;
  onSelect: (modId: string, lessonId: string) => void;
  onHome: () => void;
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: (modId: string, lessonId: string, sectionIdx: number | null) => void;
}) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => new Set([currentModuleId]));

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

  return (
    <aside style={{ width: collapsed ? "44px" : "248px", minWidth: collapsed ? "44px" : "248px", display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)", background: "var(--bg-surface)", transition: "width 0.18s, min-width 0.18s", flexShrink: 0 }}>
      {/* Top */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.625rem", height: "48px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {!collapsed && (
          <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: "0.45rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ width: "20px", height: "20px", borderRadius: "4px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#fff", fontWeight: 800, flexShrink: 0 }}>C</span>
            <span style={{ fontSize: "0.775rem", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap" }}>Claude Code</span>
          </button>
        )}
        <button onClick={onToggle} style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", marginLeft: collapsed ? "auto" : "0", flexShrink: 0 }}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Search */}
          <div style={{ padding: "0.5rem 0.625rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <SearchBar onNavigate={onNavigate} />
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "0.25rem 0" }}>
            {curriculum.map(mod => {
              const isExpanded = expandedModules.has(mod.id);
              return (
                <div key={mod.id}>
                  <button
                    onClick={() => toggleModule(mod.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.425rem 0.625rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <span style={{ flex: 1, fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.65rem", transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "none", flexShrink: 0 }}>›</span>
                  </button>
                  {isExpanded && mod.lessons.map(lesson => {
                    const isActive = currentModuleId === mod.id && currentLessonId === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelect(mod.id, lesson.id)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.35rem 0.625rem 0.35rem 1.5rem", background: isActive ? "rgba(91,106,249,0.08)" : "none", borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent", borderTop: "none", borderRight: "none", borderBottom: "none", cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-hover)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
                      >
                        <span style={{ flex: 1, fontSize: "0.765rem", color: isActive ? "var(--text)" : "var(--text-dim)", fontWeight: isActive ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lesson.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </>
      )}

      {collapsed && (
        <nav style={{ flex: 1, overflowY: "auto", padding: "0.375rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
          {curriculum.map(mod => (
            <button key={mod.id} onClick={() => { onToggle(); setTimeout(() => setExpandedModules(new Set([mod.id])), 50); }} title={mod.title}
              style={{ width: "28px", height: "28px", borderRadius: "5px", border: "none", background: currentModuleId === mod.id ? "rgba(91,106,249,0.1)" : "none", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {mod.emoji}
            </button>
          ))}
        </nav>
      )}
    </aside>
  );
}

// ─────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────
function TopBar({ lesson, mod, onHome, onPrev, onNext, hasPrev, hasNext }: {
  lesson: Lesson | null; mod: Module | null;
  onHome: () => void; onPrev: () => void; onNext: () => void;
  hasPrev: boolean; hasNext: boolean;
}) {
  return (
    <header style={{ height: "48px", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 1.25rem", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
      <button onClick={onHome} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.775rem", cursor: "pointer", padding: "0.2rem 0.4rem", borderRadius: "3px", transition: "color 0.1s", flexShrink: 0 }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
        ← Accueil
      </button>
      {lesson && mod && (
        <>
          <span style={{ color: "var(--border)", fontSize: "0.7rem" }}>/</span>
          <span style={{ fontSize: "0.775rem", color: "var(--text-muted)", flexShrink: 0 }}>{mod.title}</span>
          <span style={{ color: "var(--border)", fontSize: "0.7rem" }}>/</span>
          <span style={{ fontSize: "0.775rem", color: "var(--text-dim)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</span>
        </>
      )}
      <div style={{ display: "flex", gap: "0.25rem", marginLeft: "auto", flexShrink: 0 }}>
        <button onClick={onPrev} disabled={!hasPrev} className="lesson-nav-btn" style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", opacity: hasPrev ? 1 : 0.3 }}>← Préc.</button>
        <button onClick={onNext} disabled={!hasNext} className="lesson-nav-btn primary" style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", opacity: hasNext ? 1 : 0.3 }}>Suiv. →</button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<"home" | "lesson">("home");
  const [currentModuleId, setCurrentModuleId] = useState(curriculum[0].id);
  const [currentLessonId, setCurrentLessonId] = useState(curriculum[0].lessons[0].id);
  const [scrollToSection, setScrollToSection] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentMod = curriculum.find(m => m.id === currentModuleId) ?? curriculum[0];
  const currentLesson = currentMod.lessons.find(l => l.id === currentLessonId) ?? currentMod.lessons[0];

  const allLessons = curriculum.flatMap(mod => mod.lessons.map(l => ({ modId: mod.id, lessonId: l.id })));
  const currentIndex = allLessons.findIndex(x => x.modId === currentModuleId && x.lessonId === currentLessonId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const goToLesson = useCallback((modId: string, lessonId: string) => {
    setCurrentModuleId(modId);
    setCurrentLessonId(lessonId);
    setScrollToSection(null);
    setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, []);

  const navigate = useCallback((modId: string, lessonId: string, sectionIdx: number | null) => {
    setCurrentModuleId(modId);
    setCurrentLessonId(lessonId);
    setScrollToSection(sectionIdx);
    setView("lesson");
    contentRef.current?.scrollTo(0, 0);
  }, []);

  const goPrev = useCallback(() => { if (hasPrev) { const p = allLessons[currentIndex - 1]; goToLesson(p.modId, p.lessonId); } }, [hasPrev, currentIndex, allLessons, goToLesson]);
  const goNext = useCallback(() => { if (hasNext) { const n = allLessons[currentIndex + 1]; goToLesson(n.modId, n.lessonId); } }, [hasNext, currentIndex, allLessons, goToLesson]);

  return (
    <main style={{ height: "100vh", overflow: "hidden", display: "flex", background: "var(--bg-dark)" }}>
      <Sidebar
        currentModuleId={currentModuleId}
        currentLessonId={currentLessonId}
        onSelect={goToLesson}
        onHome={() => setView("home")}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        onNavigate={navigate}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {view === "lesson" && (
          <TopBar lesson={currentLesson} mod={currentMod} onHome={() => setView("home")} onPrev={goPrev} onNext={goNext} hasPrev={hasPrev} hasNext={hasNext} />
        )}

        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", background: "var(--bg-dark)" }}>
          {view === "home" ? (
            <HomePage onSelect={goToLesson} />
          ) : (
            <div style={{ padding: "2.5rem 3rem" }}>
              <LessonContent lesson={currentLesson} mod={currentMod} scrollToSection={scrollToSection} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", maxWidth: "740px" }}>
                <button onClick={goPrev} disabled={!hasPrev} className="lesson-nav-btn" style={{ opacity: hasPrev ? 1 : 0.3 }}>← Précédente</button>
                <button onClick={goNext} disabled={!hasNext} className="lesson-nav-btn primary" style={{ opacity: hasNext ? 1 : 0.3 }}>Suivante →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
