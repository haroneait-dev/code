"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, AtSign } from "lucide-react";
import { isValidUsername, normalizeUsername } from "@/lib/community/types";

export function OnboardingForm({
  initialDisplayName,
}: {
  initialDisplayName: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState(
    initialDisplayName.split("@")[0].slice(0, 40)
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalized = normalizeUsername(username);
  const formatOk = isValidUsername(normalized);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formatOk) {
      setError(
        "Le pseudo doit faire 3 à 20 caractères : minuscules, chiffres, underscore."
      );
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalized, display_name: displayName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue");
        setLoading(false);
        return;
      }
      router.push(`/u/${data.username}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur réseau, réessaie."
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div>
        <label className="block text-body-sm font-medium text-on-surface mb-2">
          Pseudo
        </label>
        <div
          className={`flex items-center border rounded-xl bg-surface-container-lowest transition-colors focus-within:border-primary ${
            error ? "border-error" : "border-outline-variant"
          }`}
        >
          <span className="pl-3 text-on-surface-variant">
            <AtSign className="w-4 h-4" strokeWidth={1.75} />
          </span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ton_pseudo"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={20}
            className="flex-1 bg-transparent px-2 py-3 text-body-rt text-on-surface outline-none"
            required
          />
        </div>
        <p className="text-xs text-on-surface-variant mt-2">
          3 à 20 caractères. Minuscules, chiffres et <code>_</code>.
        </p>
      </div>

      <div>
        <label className="block text-body-sm font-medium text-on-surface mb-2">
          Nom affiché <span className="text-on-surface-variant">(optionnel)</span>
        </label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={40}
          placeholder="Ton prénom ou un alias"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors"
        />
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-body-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !formatOk}
        className="btn-primary h-12 rounded-full inline-flex items-center justify-center gap-2 font-medium text-body-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Création…" : "Valider mon pseudo"}
        {!loading && <ArrowRight className="w-4 h-4" strokeWidth={1.75} />}
      </button>
    </form>
  );
}
