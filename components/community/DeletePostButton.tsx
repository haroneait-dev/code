"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeletePostButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!confirm("Supprimer définitivement ce post ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Échec de la suppression");
        return;
      }
      router.push("/communaute");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
      {loading ? "Suppression…" : "Supprimer"}
    </button>
  );
}
