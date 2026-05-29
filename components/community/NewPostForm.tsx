"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { COMMUNITY_CATEGORIES } from "@/lib/community/categories";

export function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(COMMUNITY_CATEGORIES[0].id as string);
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tags = tagsInput
        .split(/[, ]+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, category, tags }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue");
        return;
      }
      router.push(`/communaute/${data.post.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Field label="Catégorie">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors"
        >
          {COMMUNITY_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label} — {c.description}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Titre" hint={`${title.length} / 200`}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 200))}
          required
          minLength={4}
          maxLength={200}
          placeholder="Ex : J'ai un bug avec les hooks PreToolUse en background"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors"
        />
      </Field>

      <Field
        label="Corps du message"
        hint="Markdown supporté. Soit clair, donne des exemples."
      >
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          placeholder="Détaille ton problème, ton workflow, ta question…"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors font-mono text-[14px] leading-relaxed resize-y"
        />
      </Field>

      <Field
        label="Étiquettes"
        hint="Séparées par des virgules ou espaces. 5 max."
      >
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="claude-sonnet, hooks, mcp"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors"
        />
      </Field>

      {error && (
        <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-body-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || title.trim().length < 4}
        className="btn-primary h-12 rounded-full inline-flex items-center justify-center gap-2 font-medium text-body-sm self-start px-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" strokeWidth={1.75} />
        {loading ? "Publication…" : "Publier"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-body-sm font-medium text-on-surface mb-2">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-on-surface-variant mt-2">{hint}</p>
      )}
    </div>
  );
}
