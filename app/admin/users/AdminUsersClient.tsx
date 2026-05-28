"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, X, Clock, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/site/Avatar";

type Profile = {
  user_id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
};

type Filter = "all" | "pending" | "approved" | "rejected";

export function AdminUsersClient({ initial }: { initial: Profile[] }) {
  const [profiles, setProfiles] = useState(initial);
  const [filter, setFilter] = useState<Filter>("pending");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: profiles.length,
      pending: profiles.filter((p) => p.status === "pending").length,
      approved: profiles.filter((p) => p.status === "approved").length,
      rejected: profiles.filter((p) => p.status === "rejected").length,
    }),
    [profiles]
  );

  const visible = useMemo(
    () =>
      filter === "all" ? profiles : profiles.filter((p) => p.status === filter),
    [profiles, filter]
  );

  const updateStatus = async (
    userId: string,
    action: "approve" | "reject"
  ) => {
    setPendingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(await res.text());
      startTransition(() => {
        setProfiles((prev) =>
          prev.map((p) =>
            p.user_id === userId
              ? {
                  ...p,
                  status: action === "approve" ? "approved" : "rejected",
                  approved_at:
                    action === "approve" ? new Date().toISOString() : null,
                }
              : p
          )
        );
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      alert(`Action échouée : ${msg}`);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors border ${
              filter === f
                ? "bg-on-surface text-inverse-on-surface border-on-surface"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:text-on-surface"
            }`}
          >
            {LABELS[f]} <span className="opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-outline-variant rounded-xl">
          <p className="text-on-surface-variant">Aucun utilisateur dans cette vue.</p>
        </div>
      ) : (
        <ul className="border border-outline-variant rounded-xl divide-y divide-outline-variant bg-surface-container-lowest">
          {visible.map((p) => (
            <li
              key={p.user_id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-grow">
                <Avatar
                  name={p.email}
                  initial={(p.email[0] ?? "?").toUpperCase()}
                  size={36}
                />
                <div className="min-w-0">
                  <div className="font-body-rt text-body-sm font-medium text-on-surface truncate">
                    {p.email}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Inscrit le {formatDate(p.created_at)}
                  </div>
                </div>
              </div>

              <StatusBadge status={p.status} />

              <div className="flex gap-2 sm:ml-auto">
                {p.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(p.user_id, "approve")}
                    disabled={pendingId === p.user_id}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-on-primary text-body-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Approuver
                  </button>
                )}
                {p.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(p.user_id, "reject")}
                    disabled={pendingId === p.user_id}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface text-body-sm font-medium transition-colors disabled:opacity-60"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                    Rejeter
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const LABELS: Record<Filter, string> = {
  pending: "En attente",
  approved: "Approuvés",
  rejected: "Rejetés",
  all: "Tous",
};

function StatusBadge({ status }: { status: Profile["status"] }) {
  const map = {
    pending: {
      label: "En attente",
      icon: Clock,
      bg: "rgba(122,117,107,0.15)",
      fg: "#6b6359",
    },
    approved: {
      label: "Approuvé",
      icon: ShieldCheck,
      bg: "rgba(122,167,122,0.15)",
      fg: "#4a7a4a",
    },
    rejected: {
      label: "Rejeté",
      icon: X,
      bg: "rgba(186,26,26,0.1)",
      fg: "#93000a",
    },
  } as const;
  const { label, icon: Icon, bg, fg } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider self-start"
      style={{ backgroundColor: bg, color: fg }}
    >
      <Icon className="w-3 h-3" strokeWidth={2} />
      {label}
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
