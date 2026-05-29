"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Check } from "lucide-react";

export function ProfileSettingsForm({
  username,
  displayName: initialDisplay,
  bio: initialBio,
  avatarUrl: initialAvatar,
}: {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplay);
  const [bio, setBio] = useState(initialBio);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Field label="Pseudo">
        <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface-variant flex items-center gap-2">
          <span>@{username}</span>
          <span className="ml-auto text-xs text-on-surface-variant">
            Non modifiable
          </span>
        </div>
      </Field>

      <Field
        label="Nom affiché"
        hint="C'est ce qui sera affiché à côté de tes posts."
      >
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={40}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors"
          required
        />
      </Field>

      <Field label="Bio" hint={`${bio.length} / 280 caractères`}>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 280))}
          rows={4}
          placeholder="Parle un peu de toi : stack, intérêts, projets…"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors resize-none"
        />
      </Field>

      <Field label="URL d'avatar" hint="Pour l'instant, colle une URL d'image.">
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          type="url"
          placeholder="https://…"
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
        disabled={loading}
        className="btn-primary h-12 rounded-full inline-flex items-center justify-center gap-2 font-medium text-body-sm self-start px-8 disabled:opacity-50"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" strokeWidth={2} />
            Enregistré
          </>
        ) : (
          <>
            <Save className="w-4 h-4" strokeWidth={1.75} />
            {loading ? "Enregistrement…" : "Enregistrer"}
          </>
        )}
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
